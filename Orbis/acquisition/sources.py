"""
acquisition/sources.py — couche 2 : dataclasses d'acquisition

Chaque classe représente la réponse brute d'un fournisseur,
aplatie en un dict métier via from_api().

Flux :
    API → client.method() → dict brut → Source.from_api(dict) → Source
    Source → EntrepriseMapper.map*() → EntrepriseModel  (couche 3, à venir)
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing     import Optional


# ═══════════════════════════════════════════════════════════════════
# INSEE Sirene
# ═══════════════════════════════════════════════════════════════════

@dataclass
class EntrepriseInsee:
    """
    Unité légale issue de l'API INSEE Sirene v3.
    Source : GET /siren/{siren}  ou  /siren?q=…

    Champs tirés de :
        racine                     → siren, categorieEntreprise, dateCreation…
        periodesUniteLegale[0]     → denomination, naf, etat, formeJuridique…
    """
    siren:             str
    denomination:      Optional[str]       # denominationUniteLegale (période courante)
    sigle:             Optional[str]       # sigleUniteLegale
    naf:               Optional[str]       # activitePrincipaleUniteLegale  ex: "47.78C"
    naf_naf25:         Optional[str]       # activitePrincipaleNAF25UniteLegale ex: "47.63Y"
    categorie:         Optional[str]       # categorieEntreprise : PME / ETI / GE
    etat:              Optional[str]       # etatAdministratifUniteLegale : A / C
    forme_juridique:   Optional[str]       # categorieJuridiqueUniteLegale ex: "5499"
    date_creation:     Optional[str]       # dateCreationUniteLegale ex: "2003-04-01"
    tranche_effectif:  Optional[str]       # trancheEffectifsUniteLegale ex: "NN"
    nic_siege:         Optional[str]       # nicSiegeUniteLegale ex: "00019"
    siret_siege:       Optional[str]       # siren + nic_siege (calculé)
    economie_sociale:  Optional[bool]      # economieSocialeSolidaireUniteLegale
    statut_diffusion:  Optional[str]       # statutDiffusionUniteLegale : O / P / N

    @classmethod
    def from_api(cls, data: dict) -> "EntrepriseInsee":
        periodes = data.get("periodesUniteLegale", [{}])
        p        = periodes[0] if periodes else {}
        siren    = data.get("siren", "")
        nic      = p.get("nicSiegeUniteLegale")
        return cls(
            siren            = siren,
            denomination     = p.get("denominationUniteLegale"),
            sigle            = data.get("sigleUniteLegale"),
            naf              = p.get("activitePrincipaleUniteLegale"),
            naf_naf25        = data.get("activitePrincipaleNAF25UniteLegale"),
            categorie        = data.get("categorieEntreprise"),
            etat             = p.get("etatAdministratifUniteLegale"),
            forme_juridique  = p.get("categorieJuridiqueUniteLegale"),
            date_creation    = data.get("dateCreationUniteLegale"),
            tranche_effectif = data.get("trancheEffectifsUniteLegale"),
            nic_siege        = nic,
            siret_siege      = siren + nic if siren and nic else None,
            economie_sociale = p.get("economieSocialeSolidaireUniteLegale"),
            statut_diffusion = data.get("statutDiffusionUniteLegale"),
        )

    def to_dict(self) -> dict:
        return asdict(self)


# ═══════════════════════════════════════════════════════════════════
# INPI RNE  (skeleton — sample JSON en attente)
# ═══════════════════════════════════════════════════════════════════

@dataclass
class EntrepriseInpi:
    """
    Entreprise issue de l'API INPI RNE.
    Source : GET /companies/{siren}

    Structure INPI : formality.content.personneMorale.identite.description
    Skeleton : sera affiné à réception du JSON sample.
    """
    siren:           str
    denomination:    Optional[str]         = None
    forme_juridique: Optional[str]         = None   # libellé ex: "Société à responsabilité limitée"
    capital:         Optional[float]       = None
    representants:   list                  = field(default_factory=list)
    beneficiaires:   list                  = field(default_factory=list)

    @classmethod
    def from_api(cls, data: dict) -> "EntrepriseInpi":
        content  = data.get("formality", {}).get("content", {})
        pm       = content.get("personneMorale", {})
        desc     = pm.get("identite", {}).get("description", {})
        fj_raw   = desc.get("formeJuridique")
        return cls(
            siren           = data.get("siren", ""),
            denomination    = desc.get("denomination"),
            forme_juridique = fj_raw.get("libelle") if isinstance(fj_raw, dict) else fj_raw,
            capital         = desc.get("capitalSocial"),
            representants   = content.get("representants", []),
            beneficiaires   = content.get("beneficiairesEffectifs", []),
        )

    def to_dict(self) -> dict:
        return asdict(self)


# ═══════════════════════════════════════════════════════════════════
# zealot.fr — Personne
# ═══════════════════════════════════════════════════════════════════

@dataclass
class PersonneZealot:
    """
    Personne issue de l'API zealot.fr.
    Source : GET /personnes?q=…  ou  /personnes/{id}

    Note : les dates arrivent sous forme d'objet
        {"date": "1890-11-22 00:00:00.000000", "timezone_type": 3, "timezone": "UTC"}
    _extract_date() en tire la partie date ISO "YYYY-MM-DD".
    """
    id:                  int
    nom:                 Optional[str]
    prenoms:             Optional[str]
    nom_complet:         Optional[str]
    nom_naissance:       Optional[str]
    civilite:            Optional[str]
    sexe:                Optional[str]      # M / F
    date_naissance:      Optional[str]      # "1890-11-22"
    precision_naissance: Optional[str]      # jour / mois / annee
    date_deces:          Optional[str]      # "1970-11-09"
    precision_deces:     Optional[str]
    nationalite:         Optional[str]
    bio:                 Optional[str]      # texte court
    detail:              Optional[str]      # HTML long
    slug:                Optional[str]
    source:              Optional[str]      # ex: "test-seeder"
    quality_score:       Optional[int]      # 0-100

    @staticmethod
    def _extract_date(d) -> Optional[str]:
        """{"date": "1890-11-22 00:00:00.000000", …} → "1890-11-22"."""
        if not d or not isinstance(d, dict):
            return None
        raw = (d.get("date") or "")[:10]
        return raw or None

    @classmethod
    def from_api(cls, data: dict) -> "PersonneZealot":
        return cls(
            id                  = data["id"],
            nom                 = data.get("nom"),
            prenoms             = data.get("prenoms"),
            nom_complet         = data.get("nom_complet"),
            nom_naissance       = data.get("nom_naissance"),
            civilite            = data.get("civilite"),
            sexe                = data.get("sexe"),
            date_naissance      = cls._extract_date(data.get("date_naissance")),
            precision_naissance = data.get("precision_naissance"),
            date_deces          = cls._extract_date(data.get("date_deces")),
            precision_deces     = data.get("precision_deces"),
            nationalite         = data.get("nationalite"),
            bio                 = data.get("bio"),
            detail              = data.get("detail"),
            slug                = data.get("slug"),
            source              = data.get("source"),
            quality_score       = data.get("quality_score"),
        )

    def to_dict(self) -> dict:
        return asdict(self)


# ═══════════════════════════════════════════════════════════════════
# BAN — Adresse géocodée
# ═══════════════════════════════════════════════════════════════════

@dataclass
class AdresseBan:
    """
    Adresse issue de l'API BAN (Base Adresse Nationale).
    Source : BanClient.search() ou BanClient.reverse()

    Note : BanClient retourne déjà le dict normalisé (pas le GeoJSON brut).
    from_parsed() consomme ce dict directement.
    """
    ban_id:      str
    label:       str                        # "12 Rue de la Republique 29000 Quimper"
    score:       float                      # 0.0 – 1.0
    type:        str                        # housenumber / street / municipality
    housenumber: Optional[str]             # "12"
    street:      Optional[str]             # "Rue de la Republique"
    type_voie:   Optional[str]             # "Rue"  (normalisé par BanClient)
    nom_voie:    Optional[str]             # "de la Republique"
    postcode:    Optional[str]             # "29000"
    citycode:    Optional[str]             # code INSEE commune "29232"
    city:        Optional[str]             # "Quimper"
    context:     Optional[str]             # "29, Finistère, Bretagne"
    lat:         Optional[float]
    lon:         Optional[float]
    x:           Optional[float]           # Lambert 93
    y:           Optional[float]

    @classmethod
    def from_parsed(cls, data: dict) -> "AdresseBan":
        """Depuis le dict normalisé retourné par BanClient.search()/reverse()."""
        return cls(
            ban_id      = data.get("ban_id",      ""),
            label       = data.get("label",       ""),
            score       = data.get("score",       0.0),
            type        = data.get("type",        ""),
            housenumber = data.get("housenumber"),
            street      = data.get("street"),
            type_voie   = data.get("type_voie"),
            nom_voie    = data.get("nom_voie"),
            postcode    = data.get("postcode"),
            citycode    = data.get("citycode"),
            city        = data.get("city"),
            context     = data.get("context"),
            lat         = data.get("lat"),
            lon         = data.get("lon"),
            x           = data.get("x"),
            y           = data.get("y"),
        )

    def to_dict(self) -> dict:
        return asdict(self)


# ═══════════════════════════════════════════════════════════════════
# OMDB
# ═══════════════════════════════════════════════════════════════════

@dataclass
class OmdbFilm:
    """
    Film / série complet(e) issu(e) de l'API OMDB.
    Source : OmdbClient.get_movie(imdb_id)
    """
    imdb_id:      str
    title:        Optional[str]
    year:         Optional[str]
    rated:        Optional[str]            # "PG" / "R" / "G" / …
    released:     Optional[str]            # "15 Jun 1977"
    runtime:      Optional[str]            # "175 min"
    genre:        Optional[str]            # "Drama, History, War"
    director:     Optional[str]
    writer:       Optional[str]
    actors:       Optional[str]
    plot:         Optional[str]
    language:     Optional[str]
    country:      Optional[str]
    awards:       Optional[str]
    poster:       Optional[str]            # URL
    imdb_rating:  Optional[str]            # "7.4"
    imdb_votes:   Optional[str]            # "67,192"
    metascore:    Optional[str]            # "63"
    box_office:   Optional[str]            # "$50,750,000"
    type_:        Optional[str]            # movie / series / episode
    ratings:      list = field(default_factory=list)  # [{"Source":…,"Value":…}]

    @classmethod
    def from_api(cls, data: dict) -> "OmdbFilm":
        return cls(
            imdb_id     = data.get("imdbID",     ""),
            title       = data.get("Title"),
            year        = data.get("Year"),
            rated       = data.get("Rated"),
            released    = data.get("Released"),
            runtime     = data.get("Runtime"),
            genre       = data.get("Genre"),
            director    = data.get("Director"),
            writer      = data.get("Writer"),
            actors      = data.get("Actors"),
            plot        = data.get("Plot"),
            language    = data.get("Language"),
            country     = data.get("Country"),
            awards      = data.get("Awards"),
            poster      = data.get("Poster"),
            imdb_rating = data.get("imdbRating"),
            imdb_votes  = data.get("imdbVotes"),
            metascore   = data.get("Metascore"),
            box_office  = data.get("BoxOffice"),
            type_       = data.get("Type"),
            ratings     = data.get("Ratings", []),
        )

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class OmdbResultItem:
    """
    Item d'une liste de résultats OMDB (search).
    Source : OmdbClient.search(titre) → data["Search"][n]
    """
    imdb_id: str
    title:   Optional[str]
    year:    Optional[str]
    type_:   Optional[str]    # movie / series / game
    poster:  Optional[str]    # URL ou "N/A"

    @classmethod
    def from_api(cls, data: dict) -> "OmdbResultItem":
        return cls(
            imdb_id = data.get("imdbID", ""),
            title   = data.get("Title"),
            year    = data.get("Year"),
            type_   = data.get("Type"),
            poster  = data.get("Poster"),
        )

    def to_dict(self) -> dict:
        return asdict(self)


# ═══════════════════════════════════════════════════════════════════
# OpenLibrary
# ═══════════════════════════════════════════════════════════════════

@dataclass
class OuvrageOpenLibrary:
    """
    Ouvrage issu d'OpenLibrary.
    Source : OpenLibraryClient.search_*() → data["docs"][n]

    Champs disponibles dans search.json (vérifiés sur sample réel) :
        key, title, author_name[], first_publish_year,
        edition_count, language[], ia[], cover_i,
        has_fulltext, ebook_access
    Les ISBN et publisher ne sont PAS dans search.json (seulement via by_isbn).
    """
    key:           Optional[str]        # "/works/OL1068091W"
    title:         Optional[str]
    author:        Optional[str]        # noms joints par ", "
    year:          Optional[int]        # first_publish_year
    edition_count: Optional[int]
    language:      Optional[str]        # première langue ex: "eng"
    cover_id:      Optional[int]        # cover_i → URL: https://covers.openlibrary.org/b/id/{cover_id}-M.jpg
    has_fulltext:  Optional[bool]
    ebook_access:  Optional[str]        # "public" / "borrowable" / "no_ebook"
    subjects:      list = field(default_factory=list)   # subject[] tronqué à 10

    @classmethod
    def from_search(cls, doc: dict) -> "OuvrageOpenLibrary":
        """Depuis un item docs[] de /search.json."""
        return cls(
            key           = doc.get("key"),
            title         = doc.get("title"),
            author        = ", ".join(doc.get("author_name", [])) or None,
            year          = doc.get("first_publish_year"),
            edition_count = doc.get("edition_count"),
            language      = (doc.get("language") or [None])[0],
            cover_id      = doc.get("cover_i"),
            has_fulltext  = doc.get("has_fulltext"),
            ebook_access  = doc.get("ebook_access"),
            subjects      = (doc.get("subject") or [])[:10],
        )

    @property
    def cover_url(self) -> Optional[str]:
        """URL de couverture Medium (via ID OpenLibrary)."""
        if self.cover_id:
            return f"https://covers.openlibrary.org/b/id/{self.cover_id}-M.jpg"
        return None

    def to_dict(self) -> dict:
        d = asdict(self)
        d["cover_url"] = self.cover_url
        return d


# ═══════════════════════════════════════════════════════════════════
# zealot.fr — Organisation / Entreprise  (skeleton)
# ═══════════════════════════════════════════════════════════════════

@dataclass
class EntrepriseZealot:
    """
    Organisation/Entreprise issue de zealot.fr.
    Source : GET /organisations/{id}  ou  /organisations?q=…

    Skeleton — sera affiné à réception du JSON sample.
    Cas d'usage principal : réconciliation Organisation ↔ EntrepriseInsee
    (des organisations ont été créées sans SIREN associé).
    """
    id_zealot:    int
    siren:        Optional[str]         # peut être null si non rapproché
    nom:          Optional[str]         # denomination dans zealot
    slug:         Optional[str]
    tags:         list  = field(default_factory=list)

    @classmethod
    def from_api(cls, data: dict) -> "EntrepriseZealot":
        return cls(
            id_zealot = data.get("id"),
            siren     = data.get("siren"),
            nom       = data.get("nom") or data.get("denomination"),
            slug      = data.get("slug"),
            tags      = data.get("tags", []),
        )

    def to_dict(self) -> dict:
        return asdict(self)


# ═══════════════════════════════════════════════════════════════════
# Saisie UI  (formulaire desktop / web)
# ═══════════════════════════════════════════════════════════════════

@dataclass
class EntrepriseUI:
    """
    Saisie manuelle depuis le formulaire ORBIS.
    Seul `siren` et `denomination` sont obligatoires.
    """
    siren:           str
    denomination:    str
    naf:             Optional[str]  = None
    forme_juridique: Optional[str]  = None   # code ex: "5499"
    commentaire:     Optional[str]  = None

    def to_dict(self) -> dict:
        return asdict(self)
