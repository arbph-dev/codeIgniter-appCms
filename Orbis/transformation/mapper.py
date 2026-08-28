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
            economie_sociale = src.economie_sociale,
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
    def mapZealotToModel(src: EntrepriseZealot) -> EntrepriseModel:
        """
        Organisation zealot.fr → EntrepriseModel.
        Couvre : id_zealot, denomination (nom), siren si disponible.

        Note : src.siren peut être None pour les organisations orphelines.
        Dans ce cas siren="" — à rapprocher via reconcileZealot() ensuite.
        """
        return EntrepriseModel(
            siren        = src.siren or "",
            denomination = src.nom,
            id_zealot    = src.id_zealot,
            source       = "zealot",
        )

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
    def reconcileZealot(
        org:   EntrepriseZealot,
        insee: EntrepriseInsee,
    ) -> EntrepriseModel:
        """
        Réconcilie une organisation zealot (sans SIREN) avec une fiche INSEE.

        Usage : des organisations ont été créées dans zealot sans SIREN associé.
        On retrouve l'entreprise INSEE par recherche, puis on rapproche.

        Résultat : modèle INSEE (données métier complètes) + id_zealot zealot.
        source = "insee+zealot"

        Raises ValueError si org.siren est renseigné et différent de insee.siren.
        """
        if org.siren and org.siren != insee.siren:
            raise ValueError(
                f"SIREN incompatibles : org={org.siren!r} ≠ insee={insee.siren!r}"
            )

        model          = EntrepriseMapper.mapInseeToModel(insee)
        model.id_zealot = org.id_zealot
        model.source   = "insee+zealot"
        return model

    # ──────────────────────────────────────────────────────────────
    # enrichFromInsee() — enrichit un modèle existant depuis INSEE
    # ──────────────────────────────────────────────────────────────

    @staticmethod
    def enrichFromInsee(
        model: EntrepriseModel,
        insee: EntrepriseInsee,
    ) -> EntrepriseModel:
        """
        Enrichit un modèle existant (ex: issu de zealot ou UI)
        avec les données INSEE.

        Equivalent de merge(model, mapInseeToModel(insee)).
        """
        return EntrepriseMapper.merge(
            model,
            EntrepriseMapper.mapInseeToModel(insee),
        )
