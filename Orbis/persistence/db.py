# persistence/db.py
"""
Moteur SQLAlchemy et Base déclarative partagés.

Tous les modèles ORM importent Base depuis ce module.
init_db() crée les tables (CREATE TABLE IF NOT EXISTS).

Usage :
    from persistence.db import get_engine, init_db, get_session

    engine = get_engine()          # data/orbis.db par défaut
    init_db(engine)                # crée les tables
    session = get_session(engine)
    session.close()
"""
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

_DEFAULT_DB = Path(__file__).parent.parent / "data" / "orbis.db"


class Base(DeclarativeBase):
    pass


def get_engine(db_path=None, echo: bool = False):
    path = Path(db_path) if db_path else _DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    return create_engine(f"sqlite:///{path}", echo=echo)


def init_db(engine) -> None:
    """CREATE TABLE IF NOT EXISTS pour tous les modèles enregistrés dans Base."""
    Base.metadata.create_all(engine)


def get_session(engine) -> Session:
    factory = sessionmaker(bind=engine)
    return factory()
