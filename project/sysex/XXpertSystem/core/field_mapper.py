"""
core/field_mapper.py
Brique de mapping déclaratif : source dict → payload CI.

Inspiré du pattern JS PropertySet / ComputedPropertySet.
Centralise les transformations, casts de type, résolutions FK et champs calculés.

Usage :
    mapper = FieldMapper("ban", "ci_adresse")

    mapper.field("voienom",       from_="nom_voie",   type_=str)
    mapper.field("voienumero",    from_="housenumber", type_=int,
                 transform=lambda v: int(v.split()[0]) if v else None)
    mapper.computed("precision",  depends=["type","score"],
                 fn=GeocodePrecision.from_ban)
    mapper.resolve("voietype_id", from_="type_voie",  type_=int,
                 fn=resolve_type_voie)

    payload, warnings = mapper.apply(ban_result)
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Callable


# ─────────────────────────────────────────────────────────────────────────────
# Descripteurs de champs
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class FieldDef:
    """Champ simple : lecture, cast de type, transformation optionnelle."""
    target:    str                        # nom dans le payload CI
    source:    str                        # clé dans le dict source
    type_:     type        = str          # type cible (str, int, float, bool)
    transform: Callable | None = None     # transformation optionnelle
    required:  bool        = False        # erreur si absent
    default:   Any         = None         # valeur par défaut si absent


@dataclass
class ComputedFieldDef:
    """Champ calculé depuis plusieurs champs source."""
    target:   str
    depends:  list[str]          # clés dans le dict source
    fn:       Callable           # fn(*values) → valeur cible
    required: bool = False


@dataclass
class ResolveFieldDef:
    """Champ FK : nécessite un appel de résolution (réseau ou cache)."""
    target:      str
    source:      str              # clé principale dans le dict source
    fn:          Callable         # fn(value, **aux) → (id, status, label) ou id
    type_:       type = int
    aux_sources: dict[str, str] = field(default_factory=dict)
    # aux_sources = {"citycode": "citycode"} → fn(value, citycode=src["citycode"])
    required: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Résultats
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class MappingWarning:
    field:   str
    level:   str         # 'info' / 'warn' / 'error'
    message: str
    value:   Any = None


@dataclass
class MappingResult:
    payload:  dict
    warnings: list[MappingWarning]
    ok:       bool

    @property
    def errors(self) -> list[MappingWarning]:
        return [w for w in self.warnings if w.level == "error"]

    @property
    def has_errors(self) -> bool:
        return bool(self.errors)

    def __repr__(self):
        status = "OK" if self.ok else "ERRORS"
        return (f"MappingResult({status}, "
                f"{len(self.payload)} champs, "
                f"{len(self.warnings)} warnings)")


# ─────────────────────────────────────────────────────────────────────────────
# FieldMapper
# ─────────────────────────────────────────────────────────────────────────────

class FieldMapper:
    """
    Mapper déclaratif source → payload CI.

    Trois types de déclarations :
      .field()    → mapping direct avec cast + transform optionnelle
      .computed() → calculé depuis plusieurs champs source
      .resolve()  → résolution FK (appel réseau ou cache)
    """

    def __init__(self, source_name: str, target_name: str):
        self.source_name = source_name
        self.target_name = target_name
        self._fields:   list[FieldDef]          = []
        self._computed: list[ComputedFieldDef]  = []
        self._resolves: list[ResolveFieldDef]   = []

    # ── Déclarations ─────────────────────────────────────────────────────────

    def field(
        self,
        target:    str,
        from_:     str,
        type_:     type        = str,
        transform: Callable | None = None,
        required:  bool        = False,
        default:   Any         = None,
    ) -> "FieldMapper":
        self._fields.append(FieldDef(
            target=target, source=from_, type_=type_,
            transform=transform, required=required, default=default,
        ))
        return self

    def computed(
        self,
        target:   str,
        depends:  list[str],
        fn:       Callable,
        required: bool = False,
    ) -> "FieldMapper":
        self._computed.append(ComputedFieldDef(
            target=target, depends=depends, fn=fn, required=required,
        ))
        return self

    def resolve(
        self,
        target:      str,
        from_:       str,
        fn:          Callable,
        type_:       type = int,
        aux:         dict[str, str] | None = None,
        required:    bool = False,
    ) -> "FieldMapper":
        self._resolves.append(ResolveFieldDef(
            target=target, source=from_, fn=fn, type_=type_,
            aux_sources=aux or {}, required=required,
        ))
        return self

    # ── Application ──────────────────────────────────────────────────────────

    def apply(self, source: dict) -> MappingResult:
        """
        Applique le mapping sur un dict source.
        Retourne MappingResult(payload, warnings, ok).
        None values sont exclues du payload final.
        """
        payload:  dict                = {}
        warnings: list[MappingWarning] = []

        # 1. Champs simples
        for fd in self._fields:
            raw = source.get(fd.source, fd.default)
            if raw is None:
                if fd.required:
                    warnings.append(MappingWarning(
                        field=fd.target, level="error",
                        message=f"Champ requis absent : {fd.source!r}",
                    ))
                continue
            try:
                val = fd.transform(raw) if fd.transform else raw
                if val is None:
                    continue
                val = fd.type_(val) if not isinstance(val, fd.type_) else val
                payload[fd.target] = val
            except Exception as e:
                warnings.append(MappingWarning(
                    field=fd.target, level="warn",
                    message=f"Transform échouée ({fd.source}={raw!r}) : {e}",
                    value=raw,
                ))

        # 2. Champs calculés
        for cd in self._computed:
            vals = [source.get(dep) for dep in cd.depends]
            try:
                val = cd.fn(*vals)
                if val is not None:
                    payload[cd.target] = val
                elif cd.required:
                    warnings.append(MappingWarning(
                        field=cd.target, level="error",
                        message=f"Computed requis retourne None",
                    ))
            except Exception as e:
                warnings.append(MappingWarning(
                    field=cd.target, level="warn",
                    message=f"Computed échoué : {e}",
                ))

        # 3. Résolutions FK
        for rd in self._resolves:
            raw = source.get(rd.source)
            if raw is None:
                if rd.required:
                    warnings.append(MappingWarning(
                        field=rd.target, level="error",
                        message=f"Source FK absente : {rd.source!r}",
                    ))
                continue
            try:
                aux_kwargs = {
                    k: source.get(src_key)
                    for k, src_key in rd.aux_sources.items()
                }
                result = rd.fn(raw, **aux_kwargs)

                # Supporte (id, status, label) ou id direct
                if isinstance(result, tuple):
                    resolved_id, status, label = result
                    if status in ("pending", "approx"):
                        warnings.append(MappingWarning(
                            field=rd.target, level="warn",
                            message=f"Résolution {status} : {raw!r} → {label!r}",
                            value={"id": resolved_id, "status": status, "label": label},
                        ))
                    elif status == "error":
                        warnings.append(MappingWarning(
                            field=rd.target, level="error",
                            message=f"Résolution échouée : {label}",
                        ))
                        if rd.required:
                            continue
                    if resolved_id is not None:
                        try:
                            payload[rd.target] = rd.type_(resolved_id)
                        except (TypeError, ValueError):
                            payload[rd.target] = resolved_id
                else:
                    if result is None:
                        if rd.required:
                            warnings.append(MappingWarning(
                                field=rd.target, level="error",
                                message=f"FK introuvable pour {raw!r}",
                            ))
                        continue
                    try:
                        payload[rd.target] = rd.type_(result)
                    except (TypeError, ValueError):
                        payload[rd.target] = result

            except Exception as e:
                warnings.append(MappingWarning(
                    field=rd.target, level="error",
                    message=f"Resolve exception : {e}",
                ))

        has_errors = any(w.level == "error" for w in warnings)
        return MappingResult(
            payload  = payload,
            warnings = warnings,
            ok       = not has_errors,
        )

    def __repr__(self):
        return (f"FieldMapper({self.source_name!r} → {self.target_name!r}, "
                f"{len(self._fields)} fields, "
                f"{len(self._computed)} computed, "
                f"{len(self._resolves)} resolves)")
