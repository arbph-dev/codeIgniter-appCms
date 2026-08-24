"""
services/auth/AuthProvider.py
Interface abstraite — tout provider d'auth doit l'implémenter.
"""
from abc import ABC, abstractmethod
import requests


class AuthProvider(ABC):

    @abstractmethod
    def get_session(self) -> requests.Session:
        """Retourne une Session requests prête à l'emploi (token/clé injecté)."""
        pass

    @property
    @abstractmethod
    def is_logged(self) -> bool:
        """True si la session est active."""
        pass

    @abstractmethod
    def __repr__(self) -> str:
        pass
