# cli/layer5/insee_enrich.py
"""
Enrichissement INSEE — siège social (SIRET) → localisation CP/commune.
"""
from __future__ import annotations

from typing import Any, Optional

from acquisition.sources import EntrepriseInsee


def _periode0(etab: dict) -> dict:
    periodes = etab.get("periodesEtablissement") or [{}]
    return periodes[0] if periodes else {}


def localisation_from_etablissement(etab: dict) -> Optional[str]:
    """
    Extrait "CP Commune" depuis un établissement Sirene.
    """
    p = _periode0(etab)
    addr = etab.get("adresseEtablissement") or {}

    cp = (
        etab.get("codePostalEtablissement")
        or p.get("codePostalEtablissement")
        or addr.get("codePostalEtablissement")
    )
    commune = (
        etab.get("libelleCommuneEtablissement")
        or p.get("libelleCommuneEtablissement")
        or addr.get("libelleCommuneEtablissement")
    )
    if not cp and not commune:
        return None
    return f"{cp or ''} {commune or ''}".strip()


def find_siege_etablissement(
    etablissements: list[dict],
    nic_siege: Optional[str] = None,
    siret_siege: Optional[str] = None,
) -> Optional[dict]:
    """
    Priorité : siret_siege → nic_siege → flag siège → premier.
    """
    if not etablissements:
        return None

    if siret_siege:
        for e in etablissements:
            if e.get("siret") == siret_siege:
                return e

    if nic_siege:
        for e in etablissements:
            if e.get("nic") == nic_siege or str(e.get("siret") or "")[-5:] == nic_siege:
                return e

    for e in etablissements:
        p = _periode0(e)
        flag = (
            e.get("etablissementSiege")
            or p.get("etablissementSiege")
        )
        if flag in (True, "true", "True", 1, "1"):
            return e

    return etablissements[0]


def enrich_insee_with_siege(
    insee_client: Any,
    cand: EntrepriseInsee,
    *,
    nombre: int = 20,
) -> EntrepriseInsee:
    """
    GET /siret?q=siren:… → siège → cand.localisation (+ siret_siege si manquant).
    """
    if not cand.siren:
        return cand

    if cand.localisation and cand.siret_siege:
        return cand

    q = f"siren:{cand.siren}"
    data = insee_client.search_siret(q, nombre=nombre)
    if not data:
        return cand

    etabs = data.get("etablissements") or []
    siege = find_siege_etablissement(
        etabs,
        nic_siege=cand.nic_siege,
        siret_siege=cand.siret_siege,
    )
    if not siege:
        return cand

    loc = localisation_from_etablissement(siege)
    if loc:
        cand.localisation = loc

    siret = siege.get("siret")
    if siret and not cand.siret_siege:
        cand.siret_siege = siret
        if len(siret) >= 14:
            cand.nic_siege = siret[-5:]

    return cand


def enrich_candidates_siege(
    insee_client: Any,
    candidates: list[EntrepriseInsee],
    *,
    max_enrich: int = 5,
    nombre_siret: int = 20,
) -> list[EntrepriseInsee]:
    """Enrichit au plus max_enrich candidats (ordre d'arrivée)."""
    out: list[EntrepriseInsee] = []
    for i, c in enumerate(candidates):
        if i < max_enrich:
            out.append(
                enrich_insee_with_siege(insee_client, c, nombre=nombre_siret)
            )
        else:
            out.append(c)
    return out