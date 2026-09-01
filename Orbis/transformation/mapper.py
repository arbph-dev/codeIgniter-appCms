"""
transformation/mapper.py — couche 3 : transformation

EntrepriseMapper convertit chaque dataclass d'acquisition (couche 2)
en EntrepriseModel (couche 4).

Règles :
    • Un map*() = une source = un modèle partiel.
    • merge() fusionne deux modèles : les champs non-None de base
      ont priorité ; les None sont comblés par enrichment.
    • reconcileZealot() traite le cas organisation sans SIREN :
      INSEE fournit les données métier, zealot apporte l'id_zealot.

Flux :
    EntrepriseInsee  ──┐
    EntrepriseInpi   ──┤  map*()  ──►  EntrepriseModel  ──► Repository
    EntrepriseZealot ──┤
    EntrepriseUI     ──┘

    EntrepriseZealot (sans siren)  ──┐
                                     ├── reconcileZealot() ──► EntrepriseModel
    EntrepriseInsee  ────────────────┘
"""
from __future__ import annotations

import dataclasses
import json
from typing import Optional

from acquisition.sources import (
    EntrepriseInsee,
    EntrepriseInpi,
    OrganisationZealot,
    EntrepriseZealot,
    EntrepriseUI,
)
from persistence.models import EntrepriseModel


class EntrepriseMapper:

    # ──────────────────────────────────────────────────────────────
    # map*() — une méthode par source
    # ──────────────────────────────────────────────────────────────

    @staticmethod
    def mapInseeToModel(src: EntrepriseInsee) -> EntrepriseModel:
        """
        INSEE Sirene → EntrepriseModel.
        Couvre : denomination, sigle, NAF, catégorie, état, forme juridique,
                 siège, effectif, date de création, statut diffusion.
        """
        # 2026-08-31-004 +
        ess = src.economie_sociale
        if isinstance(ess, str):
            ess = ess.upper() in ("O", "1", "TRUE", "OUI")        
        # --------------------------------------------------------------------------
        return EntrepriseModel(
            siren            = src.siren,
            denomination     = src.denomination,
            sigle            = src.sigle,
            naf              = src.naf,
            naf_naf25        = src.naf_naf25,
            categorie        = src.categorie,
            etat             = src.etat,
            forme_juridique  = src.forme_juridique,
            nic_siege        = src.nic_siege,
            siret_siege      = src.siret_siege,
            tranche_effectif = src.tranche_effectif,
            # 2026-08-31-004 - economie_sociale = src.economie_sociale,
            economie_sociale = ess if isinstance(ess, bool) else None,
            date_creation    = src.date_creation,
            statut_diffusion = src.statut_diffusion,
            source           = "insee",
        )

    @staticmethod
    def mapInpiToModel(src: EntrepriseInpi) -> EntrepriseModel:
        """
        INPI RNE → EntrepriseModel.
        Couvre : denomination, forme juridique (libellé), capital,
                 représentants et bénéficiaires (blobs JSON).
        """
        return EntrepriseModel(
            siren               = src.siren,
            denomination        = src.denomination,
            forme_juridique     = src.forme_juridique,
            capital             = src.capital,
            representants_json  = (
                json.dumps(src.representants, ensure_ascii=False)
                if src.representants else None
            ),
            beneficiaires_json  = (
                json.dumps(src.beneficiaires, ensure_ascii=False)
                if src.beneficiaires else None
            ),
            source              = "inpi",
        )

    @staticmethod
    def mapZealotOrgToModel(src: OrganisationZealot) -> EntrepriseModel:
        """
        Organisation zealot → EntrepriseModel (partiel).
        siren peut être vide → à rapprocher via reconcileZealot().
        """
        return EntrepriseModel(
            siren        = src.siren or "",
            denomination = src.nom,
            id_zealot    = src.id,
            source       = "zealot",
        )

    @staticmethod
    def mapZealotEntToModel(src: EntrepriseZealot) -> EntrepriseModel:
        return EntrepriseModel(
            siren           = src.siren or "",
            denomination    = src.nom,
            naf             = src.codenaf_id,
            forme_juridique = src.forme_juridique_id,
            capital         = src.capital,
            siret_siege     = (src.siege or {}).get("siret") if src.siege else None,
            id_zealot       = src.organisation_id,  # org id côté serveur
            source          = "zealot",
        )
    
    @staticmethod
    def mapZealotToModel(src: OrganisationZealot) -> EntrepriseModel:
        """Alias rétrocompatible : organisation = entrée principale layer5."""
        return EntrepriseMapper.mapZealotOrgToModel(src)

    @staticmethod
    def mapUiToModel(src: EntrepriseUI) -> EntrepriseModel:
        """
        Saisie manuelle (formulaire) → EntrepriseModel.
        Couvre : siren, denomination, naf, forme_juridique, commentaire.
        """
        return EntrepriseModel(
            siren           = src.siren,
            denomination    = src.denomination,
            naf             = src.naf,
            forme_juridique = src.forme_juridique,
            commentaire     = src.commentaire,
            source          = "ui",
        )

    # ──────────────────────────────────────────────────────────────
    # merge() — fusion de deux modèles
    # ──────────────────────────────────────────────────────────────

    @staticmethod
    def merge(
        base:       EntrepriseModel,
        enrichment: EntrepriseModel,
    ) -> EntrepriseModel:
        """
        Fusionne base et enrichment.

        Règle champ par champ :
            base non-None  → base_val  (base a priorité)
            base est None  → enrichment_val

        Le champ `source` combine les deux si différents :
            "insee" + "inpi"  →  "insee+inpi"
            "insee" + "insee" →  "insee"

        Raises ValueError si les SIREN sont différents.
        """
        if base.siren != enrichment.siren:
            raise ValueError(
                f"SIREN incompatibles : {base.siren!r} ≠ {enrichment.siren!r}"
            )

        merged: dict = {}
        for f in dataclasses.fields(EntrepriseModel):
            base_val = getattr(base, f.name)
            enr_val  = getattr(enrichment, f.name)
            merged[f.name] = base_val if base_val is not None else enr_val

        # source : union triée des deux valeurs
        parts  = {s for src in (base.source, enrichment.source)
                    for s in src.split("+") if s}
        merged["source"] = "+".join(sorted(parts))

        return EntrepriseModel(**merged)

    # ──────────────────────────────────────────────────────────────
    # reconcileZealot() — Organisation sans SIREN → INSEE
    # ──────────────────────────────────────────────────────────────

    @staticmethod
    def reconcileZealot( org:   OrganisationZealot, insee: EntrepriseInsee, ) -> EntrepriseModel:
        """
        Organisation zealot (souvent sans SIREN) + fiche INSEE.
        → modèle INSEE complet + id_zealot.
        """
        if org.siren and org.siren != insee.siren:
            raise ValueError(
                f"SIREN incompatibles : org={org.siren!r} ≠ insee={insee.siren!r}"
            )

        model = EntrepriseMapper.mapInseeToModel(insee)
        model.id_zealot = org.id
        model.source = "insee+zealot"
        return model

    # ──────────────────────────────────────────────────────────────
    # enrichFromInsee() — enrichit un modèle existant depuis INSEE
    # ──────────────────────────────────────────────────────────────

    @staticmethod
    def enrichFromInsee( model: EntrepriseModel, insee: EntrepriseInsee,) -> EntrepriseModel:
        """
        Enrichit un modèle existant (ex: issu de zealot ou UI)
        avec les données INSEE.

        Equivalent de merge(model, mapInseeToModel(insee)).
        """
        return EntrepriseMapper.merge(
            model,
            EntrepriseMapper.mapInseeToModel(insee),
        )
