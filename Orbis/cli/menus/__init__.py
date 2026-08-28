# cli/menus/__init__.py
from .insee         import menu_insee
from .inpi          import menu_inpi
from .personne      import menu_personne
from .omdb          import menu_omdb
from .openlibrary   import menu_openlibrary
from .poligraph     import menu_poligraph
from .ban           import menu_ban
from .credentials   import menu_credentials

__all__ = [
    "menu_insee",
    "menu_inpi",
    "menu_personne",
    "menu_omdb",
    "menu_openlibrary",
    "menu_poligraph",
    "menu_ban",
    "menu_credentials",
]
