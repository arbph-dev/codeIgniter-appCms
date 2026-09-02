# services/api/adresse_from_ban.py
"""BAN → résolution FK Zealot → POST /adresse."""
from __future__ import annotations

from typing import Any, Optional

from acquisition.sources import AdresseBan
from transformation.adresse_mapper import ban_to_zealot_payload


def create_adresse_from_ban(
    ban: AdresseBan,
    adresse_client,
    cp_client,
    tv_client=None,
    *,
    dry_run: bool = False,
) -> dict[str, Any]:
    cp_id = cp_client.resolve_id(ban.postcode or "", ban.city)
    if not cp_id:
        raise ValueError(
            f"Code postal introuvable côté Zealot: "
            f"{ban.postcode!r} / {ban.city!r}"
        )

    tv_id = None
    if tv_client is not None:
        tv_id = tv_client.resolve_id(ban.type_voie)

    payload = ban_to_zealot_payload(
        ban,
        codepostal_id=cp_id,
        voietype_id=tv_id,
    )

    created = None
    if not dry_run:
        created = adresse_client.create(**payload)

    return {
        "payload": payload,
        "created": created,
        "codepostal_id": cp_id,
        "voietype_id": tv_id,
    }