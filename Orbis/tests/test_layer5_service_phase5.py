# tests/test_layer5_service_phase5.py
"""
Phase 5 — push_to_zealot().

Même approche que les phases précédentes : une référence legacy fidèle à
cli/layer5/etapes.py::etape4_push_zealot (purgée de Rich), comparée au
service. Comme demandé explicitement : ces tests VÉRIFIENT la règle
"entreprise, puis établissement (siège ou non)" plutôt que de la modifier
— voir test_push_payload_includes_siret_iff_siege_known, qui est le test
qui répond directement à cette demande.
"""
from __future__ import annotations

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from cli.layer5.working_memory import WorkingMemory, WMRecord
from core.services.layer5_service import Layer5Service, PushOutcome
from persistence.db import Base
from persistence.models import EntrepriseModel


# ═══════════════════════════════════════════════════════════════════
# Fixtures DB — SQLite en mémoire, pré-remplie via l'ORM directement
# (on ne repasse pas par persist_record ici : Phase 5 ne teste que le
# push, pas la persistance — déjà couverte en Phase 4)
# ═══════════════════════════════════════════════════════════════════

@pytest.fixture()
def session_factory():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine)
    yield factory
    engine.dispose()


@pytest.fixture(autouse=True)
def _reset_working_memory():
    WorkingMemory.clear()
    yield
    WorkingMemory.clear()


def _insert_model(session_factory, **kwargs) -> int:
    """Insère un EntrepriseModel directement (bypass persist_record,
    hors scope de cette phase) et retourne son id local."""
    session = session_factory()
    model = EntrepriseModel(**kwargs)
    session.add(model)
    session.commit()
    local_id = model.id
    session.close()
    return local_id


def _rec(organisation_id, siren, local_id, status="saved"):
    return WMRecord(
        organisation_id=organisation_id, nom="peu importe", siren=siren,
        type_id=1, type_label="Entreprise", status=status, local_id=local_id,
    )


# ═══════════════════════════════════════════════════════════════════
# Doublure EntrepriseClient
# ═══════════════════════════════════════════════════════════════════

class FakeEntrepriseClient:
    def __init__(self, raise_for_org: set[int] | None = None):
        self._raise_for_org = raise_for_org or set()
        self.calls: list[tuple[int, dict]] = []  # (organisation_id, payload)

    def attach_to_organisation(self, organisation_id: int, **payload):
        self.calls.append((organisation_id, payload))
        if organisation_id in self._raise_for_org:
            raise RuntimeError(f"Échec réseau simulé pour org#{organisation_id}")
        return {"id": 999}


# ═══════════════════════════════════════════════════════════════════
# Référence legacy — copie fidèle de etape4_push_zealot (sans Rich)
# ═══════════════════════════════════════════════════════════════════

def _legacy_push_zealot(ent_client, repo) -> None:
    to_push = [
        r for r in WorkingMemory.records
        if r.status == "saved" and r.local_id and r.siren
    ]
    if not to_push:
        return

    for rec in to_push:
        model = repo.get_by_id(rec.local_id)
        if not model:
            continue

        body = {
            "siren": model.siren,
            "codenaf_id": model.naf,
            "forme_juridique_id": model.forme_juridique,
        }
        if model.siret_siege:
            body["siret"] = model.siret_siege
        if model.capital is not None:
            body["capital"] = model.capital

        try:
            ent_client.attach_to_organisation(
                rec.organisation_id,
                **{k: v for k, v in body.items() if v is not None},
            )
            rec.status = "pushed"
        except Exception:
            rec.status = "push_error"


# ═══════════════════════════════════════════════════════════════════
# Test 1 — équivalence stricte service vs legacy
# ═══════════════════════════════════════════════════════════════════

def test_push_to_zealot_equivalent_to_legacy(session_factory):
    local_id = _insert_model(
        session_factory, siren="111111111", naf="47.78C",
        forme_juridique="5710", siret_siege="11111111100019", capital=5000.0,
    )
    WorkingMemory.set_scan(
        [_rec(organisation_id=7, siren="111111111", local_id=local_id)],
        scanned=1, page=1, per_page=20,
    )

    ent_client = FakeEntrepriseClient()
    service = Layer5Service(org_client=None, ent_client=ent_client, session_factory=session_factory)
    outcomes = service.push_to_zealot()

    assert len(outcomes) == 1
    assert outcomes[0].status == "pushed"
    assert WorkingMemory.records[0].status == "pushed"

    # Legacy, sur un WorkingMemory remis à l'identique
    WorkingMemory.clear()
    WorkingMemory.set_scan(
        [_rec(organisation_id=7, siren="111111111", local_id=local_id)],
        scanned=1, page=1, per_page=20,
    )
    legacy_ent_client = FakeEntrepriseClient()
    with service.repository() as repo:
        _legacy_push_zealot(legacy_ent_client, repo)

    assert WorkingMemory.records[0].status == "pushed"
    assert ent_client.calls[0][1] == legacy_ent_client.calls[0][1]  # même payload


# ═══════════════════════════════════════════════════════════════════
# Test 2 — LE test demandé : payload "siret" présent <=> siège connu
# ═══════════════════════════════════════════════════════════════════

def test_push_payload_includes_siret_iff_siege_known(session_factory):
    """
    Vérifie explicitement (sans rien modifier) que c'est bien la présence
    de model.siret_siege qui détermine si un établissement (siège) est
    attaché en même temps que l'entreprise : quand il est connu, "siret"
    apparaît dans le payload POST /organisation/{id}/entreprise ; sinon,
    aucune clé "siret" n'est envoyée et aucun établissement n'est créé
    côté serveur pour cette entreprise.
    """
    id_avec_siege = _insert_model(
        session_factory, siren="111111111", siret_siege="11111111100019",
    )
    id_sans_siege = _insert_model(
        session_factory, siren="222222222", siret_siege=None,
    )
    WorkingMemory.set_scan(
        [
            _rec(organisation_id=1, siren="111111111", local_id=id_avec_siege),
            _rec(organisation_id=2, siren="222222222", local_id=id_sans_siege),
        ],
        scanned=2, page=1, per_page=20,
    )

    ent_client = FakeEntrepriseClient()
    service = Layer5Service(org_client=None, ent_client=ent_client, session_factory=session_factory)
    service.push_to_zealot()

    calls_by_org = {org_id: payload for org_id, payload in ent_client.calls}

    assert "siret" in calls_by_org[1]
    assert calls_by_org[1]["siret"] == "11111111100019"

    assert "siret" not in calls_by_org[2]  # pas de siège connu -> pas d'établissement créé


def test_push_payload_excludes_none_fields(session_factory):
    """capital=None (non renseigné) ne doit jamais apparaître dans le payload."""
    local_id = _insert_model(
        session_factory, siren="111111111", naf=None,
        forme_juridique=None, siret_siege=None, capital=None,
    )
    WorkingMemory.set_scan(
        [_rec(organisation_id=1, siren="111111111", local_id=local_id)],
        scanned=1, page=1, per_page=20,
    )

    ent_client = FakeEntrepriseClient()
    service = Layer5Service(org_client=None, ent_client=ent_client, session_factory=session_factory)
    service.push_to_zealot()

    _, payload = ent_client.calls[0]
    assert "capital" not in payload
    assert "codenaf_id" not in payload  # naf=None -> codenaf_id absent
    assert "forme_juridique_id" not in payload
    assert "siret" not in payload
    assert payload == {"siren": "111111111"}


# ═══════════════════════════════════════════════════════════════════
# Test 3 — filtre to_push (status/local_id/siren requis)
# ═══════════════════════════════════════════════════════════════════

def test_push_to_zealot_filters_records_not_ready(session_factory):
    local_id = _insert_model(session_factory, siren="111111111")
    records = [
        _rec(organisation_id=1, siren="111111111", local_id=local_id, status="saved"),  # OK
        _rec(organisation_id=2, siren=None, local_id=local_id, status="saved"),          # siren manquant
        _rec(organisation_id=3, siren="333333333", local_id=None, status="saved"),       # local_id manquant
        _rec(organisation_id=4, siren="444444444", local_id=local_id, status="conflict"), # mauvais statut
    ]
    WorkingMemory.set_scan(records, scanned=4, page=1, per_page=20)

    ent_client = FakeEntrepriseClient()
    service = Layer5Service(org_client=None, ent_client=ent_client, session_factory=session_factory)
    outcomes = service.push_to_zealot()

    assert len(outcomes) == 1
    assert outcomes[0].organisation_id == 1
    assert [c[0] for c in ent_client.calls] == [1]


def test_push_to_zealot_returns_empty_list_when_nothing_to_push(session_factory):
    WorkingMemory.set_scan([], scanned=0, page=1, per_page=20)
    service = Layer5Service(
        org_client=None, ent_client=FakeEntrepriseClient(), session_factory=session_factory,
    )
    assert service.push_to_zealot() == []


# ═══════════════════════════════════════════════════════════════════
# Test 4 — quirk préservé : local_id introuvable -> skip silencieux
# ═══════════════════════════════════════════════════════════════════

def test_push_to_zealot_preserves_silent_skip_when_local_id_not_found(session_factory):
    rec = _rec(organisation_id=1, siren="111111111", local_id=99999)  # id inexistant
    WorkingMemory.set_scan([rec], scanned=1, page=1, per_page=20)

    ent_client = FakeEntrepriseClient()
    service = Layer5Service(org_client=None, ent_client=ent_client, session_factory=session_factory)

    messages = []
    outcomes = service.push_to_zealot(on_progress=messages.append)

    assert outcomes == []
    assert rec.status == "saved"  # PAS changé — quirk préservé de l'original
    assert ent_client.calls == []
    assert any("introuvable" in m for m in messages)


# ═══════════════════════════════════════════════════════════════════
# Test 5 — échec réseau -> push_error
# ═══════════════════════════════════════════════════════════════════

def test_push_to_zealot_marks_push_error_on_exception(session_factory):
    local_id = _insert_model(session_factory, siren="111111111")
    rec = _rec(organisation_id=1, siren="111111111", local_id=local_id)
    WorkingMemory.set_scan([rec], scanned=1, page=1, per_page=20)

    ent_client = FakeEntrepriseClient(raise_for_org={1})
    service = Layer5Service(org_client=None, ent_client=ent_client, session_factory=session_factory)

    outcomes = service.push_to_zealot()

    assert outcomes[0].status == "push_error"
    assert "Échec réseau simulé" in outcomes[0].detail
    assert rec.status == "push_error"
