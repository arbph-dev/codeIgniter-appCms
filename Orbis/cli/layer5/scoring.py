# cli/layer5/scoring.py
from __future__ import annotations

import re
import unicodedata
from typing import Any

from cli.layer5.working_memory import WMRecord, CandidateScore

W_NOM = 4
W_SIREN = 8
W_LOC = 4
W_NAF = 2
W_EXTRA = 1
SCORE_MAX = W_NOM + W_SIREN + W_LOC + W_NAF + W_EXTRA + W_EXTRA  # 20


def _norm_upper(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.upper().replace("'", " ").replace("’", " ")
    return re.sub(r"\s+", " ", s).strip()


def _tokens(s: str) -> list[str]:
    return [t for t in _norm_upper(s).split() if t]


def score_nom(org_nom: str, cand_nom: str | None) -> float:
    if not org_nom or not cand_nom:
        return 0.0
    to, tc = _tokens(org_nom), _tokens(cand_nom)
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

    exact = 1.0 if _norm_upper(org_nom) == _norm_upper(cand_nom) else 0.0
    factor = max(exact, 0.5 * len_factor + 0.5 * jacc)
    return W_NOM * factor


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

    detail["localisation"] = 0.0  # stub
    total += 0.0

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
        rec.match_pct = int(round(sum(s.score_pct for s in scored) / len(scored)))
    else:
        rec.match_pct = 0

    v = 0.0
    if rec.siren or (rec.siret and len(re.sub(r"\D", "", rec.siret or "")) >= 9):
        v += 1.0 / 3.0
    if scored:
        v += 2.0 / 3.0
    rec.veracity_pct = int(round(100.0 * v))
    rec.global_pct = int(round((rec.match_pct * 2 + rec.veracity_pct) / 3))