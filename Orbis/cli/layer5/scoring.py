# cli/layer5/scoring.py
# 2026-09-02-002 - retirer : _norm_upper(), _tokens()



from __future__ import annotations

import re
import unicodedata
from typing import Any, Optional

from cli.layer5.working_memory import WMRecord, CandidateScore
from cli.layer5.text_utils import norm_upper,tokens

W_NOM = 4
W_SIREN = 8
W_LOC = 4
W_NAF = 2
W_EXTRA = 1
SCORE_MAX = W_NOM + W_SIREN + W_LOC + W_NAF + W_EXTRA + W_EXTRA  # 20



def score_nom(org_nom: str, cand_nom: str | None) -> float:
    if not org_nom or not cand_nom:
        return 0.0
    to, tc = tokens(org_nom), tokens(cand_nom)
    if not to or not tc:
        return 0.0
    nm, np_ = len(to), len(tc)
    if nm == np_:
        len_factor = 1.0
    else:
        len_factor = max(0.0, 1.0 - abs(nm - np_) / nm)

    inter = len(set(to) & set(tc))
    union = len(set(to) | set(tc)) or 1
    jacc = inter / union

    exact = 1.0 if norm_upper(org_nom) == norm_upper(cand_nom) else 0.0
    factor = max(exact, 0.5 * len_factor + 0.5 * jacc)
    return W_NOM * factor


def _extract_cp(text: Optional[str]) -> Optional[str]:
    if not text:
        return None
    m = re.search(r"\b(\d{5})\b", str(text))
    return m.group(1) if m else None


def _extract_commune(text: Optional[str]) -> Optional[str]:
    if not text:
        return None
    text = str(text).strip()
    m = re.search(r"\b\d{5}\s+(.+)$", text)
    if m:
        return m.group(1).strip().upper()
    return text.upper()


def score_loc(org_loc: Optional[str], cand_loc: Optional[str]) -> float:
    """0..W_LOC — CP exact → plein ; commune seule → demi."""
    if not org_loc or not cand_loc:
        return 0.0
    cp_o, cp_c = _extract_cp(org_loc), _extract_cp(cand_loc)
    if cp_o and cp_c and cp_o == cp_c:
        return float(W_LOC)
    com_o, com_c = _extract_commune(org_loc), _extract_commune(cand_loc)
    if com_o and com_c and (com_o == com_c or com_o in com_c or com_c in com_o):
        return float(W_LOC) * 0.5
    return 0.0


def score_candidate(rec: WMRecord, cand: Any) -> CandidateScore:
    detail: dict = {}
    total = 0.0

    s_nom = score_nom(rec.nom, getattr(cand, "denomination", None))
    detail["nom"] = round(s_nom, 2)
    total += s_nom

    org_siren = rec.siren
    if not org_siren and rec.siret:
        digits = re.sub(r"\D", "", rec.siret)
        if len(digits) >= 9:
            org_siren = digits[:9]
    s_siren = 0.0
    if org_siren and getattr(cand, "siren", None) and org_siren == cand.siren:
        s_siren = float(W_SIREN)
    detail["siren"] = s_siren
    total += s_siren

    # localisation ×4 (cand.localisation via enrich SIRET siège)
    cand_loc = getattr(cand, "localisation", None)
    s_loc = score_loc(rec.localisation, cand_loc)
    detail["localisation"] = round(s_loc, 2)
    total += s_loc

    s_naf = 0.0
    if rec.naf and getattr(cand, "naf", None):
        a = rec.naf.replace(".", "")
        b = (cand.naf or "").replace(".", "")
        if a and b and (a == b or a[:4] == b[:4]):
            s_naf = float(W_NAF)
    detail["naf"] = s_naf
    total += s_naf

    s_fj = 0.0
    if rec.forme_juridique and getattr(cand, "forme_juridique", None):
        if str(rec.forme_juridique) == str(cand.forme_juridique):
            s_fj = float(W_EXTRA)
    detail["forme_juridique"] = s_fj
    total += s_fj

    s_etat = float(W_EXTRA) if getattr(cand, "etat", None) == "A" else 0.0
    detail["etat"] = s_etat
    total += s_etat

    pct = int(round(100.0 * total / SCORE_MAX))
    return CandidateScore(insee=cand, score_raw=total, score_pct=pct, detail=detail)

def score_record(rec: WMRecord) -> None:
    scored = [score_candidate(rec, c) for c in rec.insee_candidates]
    scored.sort(key=lambda x: x.score_pct, reverse=True)
    rec.scored = scored

    if scored:
        pcts = [s.score_pct for s in scored]
        rec.match_pct = pcts[0]                      # top, plus la moyenne
        rec.match_max = pcts[0]                       # == top (liste triée desc)
        rec.match_min = min(pcts)
        rec.match_moy = int(round(sum(pcts) / len(pcts)))
    else:
        rec.match_pct = rec.match_min = rec.match_max = rec.match_moy = 0

    v = 0.0
    if rec.siren or (rec.siret and len(re.sub(r"\D", "", rec.siret or "")) >= 9):
        v += 1.0 / 3.0
    if scored:
        v += 2.0 / 3.0
    rec.veracity_pct = int(round(100.0 * v))
    rec.global_pct = int(round((rec.match_pct * 2 + rec.veracity_pct) / 3))    
