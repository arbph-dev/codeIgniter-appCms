# services/api/enums/adresse.py

"""
Enums métier Adresse.

Correspondance avec les enums PHP Zealot :
    IndiceRepetition
    Charniere
    GeocodePrecision
"""

from __future__ import annotations

from enum import Enum, IntEnum


class IndiceRepetition(str, Enum):
    """
    Indice de répétition d'adresse.
    """

    BIS = "B"
    TER = "T"
    QUATER = "Q"
    QUINQUIES = "C"

    @property
    def label(self) -> str:
        return {
            self.BIS: "Bis",
            self.TER: "Ter",
            self.QUATER: "Quater",
            self.QUINQUIES: "Quinquies",
        }[self]


class Charniere(IntEnum):
    """
    Charnière du nom de voie.
    """

    DE = 0
    D_APOSTROPHE = 1
    DU = 2
    DE_LA = 3
    DES = 4
    DE_L_APOSTROPHE = 5
    DE_LAS = 6
    DE_LOS = 7

    @property
    def label(self) -> str:
        return {
            self.DE: "de",
            self.D_APOSTROPHE: "d'",
            self.DU: "du",
            self.DE_LA: "de la",
            self.DES: "des",
            self.DE_L_APOSTROPHE: "de l'",
            self.DE_LAS: "de las",
            self.DE_LOS: "de los",
        }[self]


class GeocodePrecision(str, Enum):
    """
    Précision géographique d'une adresse.
    """

    NUMERO = "numero"
    VOIE = "voie"
    COMMUNE = "commune"
    APPROXIMATIF = "approx"

    @property
    def label(self) -> str:
        return {
            self.NUMERO: "Au numéro",
            self.VOIE: "À la voie",
            self.COMMUNE: "À la commune",
            self.APPROXIMATIF: "Approximatif",
        }[self]