# Index des fichiers de `Orbis/persistence`

Inventaire des fichiers présents dans `Orbis/persistence` et ses sous-dossiers sur la branche `main`. Les dates et le nombre de mises à jour correspondent à l'historique GitHub disponible pour chaque fichier au moment de la génération.

| Fichier | Description | Imports principaux | Date | Nombre de mises à jour | Lien |
|---|---|---|---|---:|---|
| [`conflict_log.py`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/conflict_log.py) | Modèle et constructeur du journal des conflits SIREN. | `datetime`, `typing`, `sqlalchemy` | 2026-08-28 | 1 | [ouvrir](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/conflict_log.py) |
| [`db.py`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/db.py) | Configuration de l'engine SQLAlchemy, de la base déclarative et des sessions. | `pathlib`, `sqlalchemy` | 2026-08-28 | 1 | [ouvrir](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/db.py) |
| [`index.md`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/index.md) | Fichier d'index du module de persistance. | — | 2026-08-28 | 1 | [ouvrir](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/index.md) |
| [`models.py`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/models.py) | Modèle ORM SQLAlchemy `EntrepriseModel` pour la table `entreprises`. | `datetime`, `typing`, `sqlalchemy` | 2026-08-28 | 1 | [ouvrir](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/models.py) |
| [`repository.py`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/repository.py) | Repository CRUD avec recherche, pagination, gestion des conflits et import/export CSV. | `csv`, `datetime`, `pathlib`, `typing`, `sqlalchemy`, `persistence.models`, `persistence.conflict_log`, `persistence.siren_guard` | 2026-08-28 | 1 | [ouvrir](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/repository.py) |
| [`siren_guard.py`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/siren_guard.py) | Protection contre les doublons SIREN, journalisation des conflits et mise à jour forcée par un administrateur. | `datetime`, `sqlalchemy`, `persistence.models`, `persistence.conflict_log` | 2026-08-28 | 1 | [ouvrir](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/Orbis/persistence/siren_guard.py) |

> Aucun sous-dossier supplémentaire n'est présent dans `Orbis/persistence` au moment de l'inventaire.
