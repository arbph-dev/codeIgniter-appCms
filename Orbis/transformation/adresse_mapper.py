# transformation/adresse_mapper.py
from __future__ import annotations
from typing import Any, Optional
from acquisition.sources import AdresseBan

_BAN_TYPE_TO_PRECISION = {
    "housenumber": "numero",
    "street": "voie",
    "locality": "commune",
    "municipality": "commune",
    "city": "commune",
}

def ban_to_zealot_payload(
    ban: AdresseBan,
    *,
    codepostal_id: int,
    voietype_id: Optional[int] = None,
    voiecharniere: Optional[int] = None,
    voierpt: Optional[str] = None,
    complement: Optional[str] = None,
) -> dict[str, Any]:
    voienom = (ban.nom_voie or ban.street or "").strip()
    if not voienom and ban.label:
        voienom = (
            ban.label.split(ban.postcode)[0].strip()
            if ban.postcode and ban.postcode in ban.label
            else ban.label
        )
    if not voienom:
        raise ValueError("BAN sans nom de voie exploitable")

    payload: dict[str, Any] = {
        "voienom": voienom[:60],
        "codepostal_id": codepostal_id,
        "ban_id": ban.ban_id or None,
        "precision": _BAN_TYPE_TO_PRECISION.get((ban.type or "").lower(), "approx"),
    }
    if ban.housenumber:
        payload["voienumero"] = str(ban.housenumber)[:10]
    if voietype_id is not None:
        payload["voietype_id"] = voietype_id
    if voiecharniere is not None:
        payload["voiecharniere"] = voiecharniere
    if voierpt:
        payload["voierpt"] = voierpt
    if complement:
        payload["complement"] = complement
    if ban.lat is not None:
        payload["latitude"] = ban.lat
    if ban.lon is not None:
        payload["longitude"] = ban.lon
    if ban.city:
        payload["acheminement"] = ban.city[:60]
    return payload