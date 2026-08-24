"""
akinator/core/database.py
KnowledgeBase — adapté domaine entreprise.
Charge l'ontologie depuis config/classes.json au démarrage.
"""
import json
import sqlite3
from pathlib import Path
from rich.console import Console
from rich.prompt import Prompt, Confirm
from rich.panel import Panel

console = Console()

DB_FILE   = Path(__file__).parent.parent / "data" / "akinator.db"
CFG_DIR   = Path(__file__).parent.parent / "config"


class KnowledgeBase:

    def __init__(self, db_path: Path = DB_FILE):
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn   = sqlite3.connect(str(db_path))
        self.cursor = self.conn.cursor()
        self._setup_db()
        self._load_ontology()

    # ------------------------------------------------------------------
    # Schéma SQLite
    # ------------------------------------------------------------------
    def _setup_db(self):
        self.cursor.executescript("""
            CREATE TABLE IF NOT EXISTS seclass (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                name      TEXT    UNIQUE NOT NULL,
                parent_id INTEGER,
                FOREIGN KEY (parent_id) REFERENCES seclass(id)
            );
            CREATE TABLE IF NOT EXISTS seprop (
                id   INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT    UNIQUE NOT NULL,
                type TEXT    NOT NULL DEFAULT 'string'
            );
            CREATE TABLE IF NOT EXISTS seclass_prop (
                class_id INTEGER,
                prop_id  INTEGER,
                PRIMARY KEY (class_id, prop_id),
                FOREIGN KEY (class_id) REFERENCES seclass(id),
                FOREIGN KEY (prop_id)  REFERENCES seprop(id)
            );
            CREATE TABLE IF NOT EXISTS seinst (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                name     TEXT    NOT NULL,
                class_id INTEGER NOT NULL,
                UNIQUE(name, class_id),
                FOREIGN KEY (class_id) REFERENCES seclass(id)
            );
            CREATE TABLE IF NOT EXISTS seinst_value (
                inst_id INTEGER,
                prop_id INTEGER,
                value   TEXT,
                PRIMARY KEY (inst_id, prop_id),
                FOREIGN KEY (inst_id) REFERENCES seinst(id),
                FOREIGN KEY (prop_id) REFERENCES seprop(id)
            );
            CREATE TABLE IF NOT EXISTS seprop_stats (
                class_id       INTEGER,
                prop_id        INTEGER,
                instance_count INTEGER DEFAULT 0,
                min_value      REAL,
                max_value      REAL,
                mean_value     REAL,
                median_value   REAL,
                std_dev        REAL,
                updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (class_id, prop_id)
            );
            CREATE TABLE IF NOT EXISTS seprop_manual_thresholds (
                class_id INTEGER,
                prop_id  INTEGER,
                ll REAL, l REAL, h REAL, hh REAL,
                PRIMARY KEY (class_id, prop_id)
            );
        """)
        self.conn.commit()

    # ------------------------------------------------------------------
    # Chargement ontologie depuis classes.json
    # ------------------------------------------------------------------
    def _load_ontology(self):
        cfg_path = CFG_DIR / "classes.json"
        if not cfg_path.exists():
            console.print(f"[yellow]config/classes.json introuvable — ontologie vide[/]")
            return

        cfg = json.loads(cfg_path.read_text(encoding="utf-8"))

        # 1. Classes (dans l'ordre du fichier — parent avant enfant)
        for cls in cfg.get("classes", []):
            name   = cls["name"]
            parent = cls.get("parent")
            if not self.get_class_id(name):
                parent_id = self.get_class_id(parent) if parent else None
                self.cursor.execute(
                    "INSERT INTO seclass (name, parent_id) VALUES (?, ?)",
                    (name, parent_id)
                )

        # 2. Propriétés globales
        for prop in cfg.get("properties", []):
            if not self.get_property_id(prop["name"]):
                self.cursor.execute(
                    "INSERT INTO seprop (name, type) VALUES (?, ?)",
                    (prop["name"], prop.get("type", "string"))
                )

        self.conn.commit()

        # 3. Liaisons classe ↔ propriété
        for class_name, prop_names in cfg.get("class_properties", {}).items():
            class_id = self.get_class_id(class_name)
            if not class_id:
                continue
            for prop_name in prop_names:
                prop_id = self.get_property_id(prop_name)
                if prop_id:
                    try:
                        self.cursor.execute(
                            "INSERT INTO seclass_prop (class_id, prop_id) VALUES (?, ?)",
                            (class_id, prop_id)
                        )
                    except sqlite3.IntegrityError:
                        pass  # déjà liée

        self.conn.commit()

    # ------------------------------------------------------------------
    # Utilitaires de base
    # ------------------------------------------------------------------
    def commit(self):
        self.conn.commit()

    def close(self):
        self.commit()
        self.conn.close()
    # ------------------------------------------------------------------
    def get_class_id(self, name: str):
        if not name:
            return None
        self.cursor.execute("SELECT id FROM seclass WHERE LOWER(name) = LOWER(?)", (name,) )
        row = self.cursor.fetchone()
        return row[0] if row else None

    def get_class_name(self, class_id: int):
        self.cursor.execute("SELECT name FROM seclass WHERE id = ?", (class_id,))
        row = self.cursor.fetchone()
        return row[0] if row else None

    def get_property_id(self, name: str):
        if not name:
            return None
        self.cursor.execute(
            "SELECT id FROM seprop WHERE LOWER(name) = LOWER(?)", (name,)
        )
        row = self.cursor.fetchone()
        return row[0] if row else None

    def get_property_type(self, prop_name: str):
        pid = self.get_property_id(prop_name)
        if not pid:
            return None
        self.cursor.execute("SELECT type FROM seprop WHERE id = ?", (pid,))
        row = self.cursor.fetchone()
        return row[0] if row else None

    def get_all_class_names(self) -> list[str]:
        self.cursor.execute("SELECT name FROM seclass ORDER BY name")
        return [r[0] for r in self.cursor.fetchall()]

    def get_all_property_names(self) -> list[str]:
        self.cursor.execute("SELECT name FROM seprop ORDER BY name")
        return [r[0] for r in self.cursor.fetchall()]

    # ------------------------------------------------------------------
    # Classes
    # ------------------------------------------------------------------
    def add_class(self, name: str, parent: str = None) -> bool:
        name = name.strip().capitalize()
        if not name:
            console.print("[red]Nom vide[/]")
            return False
        if self.get_class_id(name):
            console.print(f"[red]Classe '{name}' existe déjà[/]")
            return False
        parent_id = self.get_class_id(parent) if parent else None
        self.cursor.execute(
            "INSERT INTO seclass (name, parent_id) VALUES (?, ?)", (name, parent_id)
        )
        self.commit()
        console.print(Panel(f"Classe [green]'{name}'[/] créée", style="green"))
        return True

    def get_hierarchy(self) -> list[tuple]:
        """Retourne [(id, name, parent_id, level)] trié hiérarchiquement."""
        self.cursor.execute("""
            WITH RECURSIVE tree(id, name, parent_id, level) AS (
                SELECT id, name, parent_id, 0
                FROM seclass WHERE parent_id IS NULL
                UNION ALL
                SELECT c.id, c.name, c.parent_id, t.level + 1
                FROM seclass c JOIN tree t ON c.parent_id = t.id
            )
            SELECT id, name, parent_id, level FROM tree ORDER BY level, name
        """)
        return self.cursor.fetchall()

    # ------------------------------------------------------------------
    # Propriétés
    # ------------------------------------------------------------------
    def add_property(self, name: str, ptype: str = "string") -> bool:
        name = name.strip().lower()
        if not name:
            return False
        valid = {"string", "bool", "int", "float", "date"}
        if ptype not in valid:
            console.print(f"[red]Type invalide : {ptype}[/]")
            return False
        if self.get_property_id(name):
            console.print(f"[red]Propriété '{name}' existe déjà[/]")
            return False
        self.cursor.execute(
            "INSERT INTO seprop (name, type) VALUES (?, ?)", (name, ptype)
        )
        self.commit()
        console.print(Panel(f"Propriété [cyan]'{name}'[/] ({ptype}) créée", style="cyan"))
        return True

    def link_property_to_class(self, class_name: str, prop_name: str) -> bool:
        cid = self.get_class_id(class_name)
        pid = self.get_property_id(prop_name)
        if not cid or not pid:
            console.print("[red]Classe ou propriété inconnue[/]")
            return False
        try:
            self.cursor.execute(
                "INSERT INTO seclass_prop (class_id, prop_id) VALUES (?, ?)", (cid, pid)
            )
            self.commit()
            return True
        except sqlite3.IntegrityError:
            return False

    def get_all_props_for_class(self, class_name: str) -> list[str]:
        """Propriétés héritées de toute la chaîne parent."""
        cid = self.get_class_id(class_name)
        if not cid:
            return []
        props = set()
        current = cid
        while current:
            self.cursor.execute("""
                SELECT p.name FROM seprop p
                JOIN seclass_prop cp ON p.id = cp.prop_id
                WHERE cp.class_id = ?
            """, (current,))
            for r in self.cursor.fetchall():
                props.add(r[0])
            self.cursor.execute(
                "SELECT parent_id FROM seclass WHERE id = ?", (current,)
            )
            row = self.cursor.fetchone()
            current = row[0] if row else None
        return sorted(props)

    # ------------------------------------------------------------------
    # Instances
    # ------------------------------------------------------------------
    def add_instance(self, name: str, class_name: str) -> bool:
        name = name.strip()
        cid  = self.get_class_id(class_name)
        if not cid:
            console.print("[red]Classe inconnue[/]")
            return False
        self.cursor.execute(
            "SELECT 1 FROM seinst WHERE LOWER(name)=LOWER(?) AND class_id=?",
            (name, cid)
        )
        if self.cursor.fetchone():
            console.print(f"[red]Instance '{name}' existe déjà dans {class_name}[/]")
            return False
        self.cursor.execute(
            "INSERT INTO seinst (name, class_id) VALUES (?, ?)", (name, cid)
        )
        self.commit()
        console.print(Panel(f"Instance [green]'{name}'[/] ajoutée à [green]{class_name}[/]", style="green"))
        return True

    def get_all_instances(self, class_name: str) -> list[str]:
        cid = self.get_class_id(class_name)
        if not cid:
            return []
        self.cursor.execute(
            "SELECT name FROM seinst WHERE class_id=? ORDER BY name", (cid,)
        )
        return [r[0] for r in self.cursor.fetchall()]

    # ------------------------------------------------------------------
    # Valeurs
    # ------------------------------------------------------------------
    def get_instance_value(self, inst_name: str, class_name: str, prop_name: str):
        cid = self.get_class_id(class_name)
        if not cid:
            return None
        self.cursor.execute(
            "SELECT id FROM seinst WHERE LOWER(name)=LOWER(?) AND class_id=?",
            (inst_name, cid)
        )
        row = self.cursor.fetchone()
        if not row:
            return None
        inst_id = row[0]
        pid = self.get_property_id(prop_name)
        if not pid:
            return None
        self.cursor.execute(
            "SELECT value FROM seinst_value WHERE inst_id=? AND prop_id=?",
            (inst_id, pid)
        )
        row = self.cursor.fetchone()
        if not row or row[0] is None:
            return None
        val   = row[0]
        ptype = self.get_property_type(prop_name)
        if ptype == "bool":
            return val.lower() == "true"
        try:
            if ptype == "int":   return int(val)
            if ptype == "float": return float(val)
        except (ValueError, TypeError):
            pass
        return val

    def set_instance_value(self, inst_name: str, class_name: str, prop_name: str, value) -> bool:
        cid = self.get_class_id(class_name)
        if not cid:
            return False
        self.cursor.execute(
            "SELECT id FROM seinst WHERE LOWER(name)=LOWER(?) AND class_id=?",
            (inst_name, cid)
        )
        row = self.cursor.fetchone()
        if not row:
            return False
        inst_id = row[0]
        pid = self.get_property_id(prop_name)
        if not pid:
            return False
        if value is None:
            stored = None
        elif value is True:
            stored = "true"
        elif value is False:
            stored = "false"
        else:
            stored = str(value)
        self.cursor.execute("""
            INSERT INTO seinst_value (inst_id, prop_id, value) VALUES (?, ?, ?)
            ON CONFLICT(inst_id, prop_id) DO UPDATE SET value = excluded.value
        """, (inst_id, pid, stored))
        self.commit()
        return True

    def ask_and_set_properties(self, inst_name: str, class_name: str):
        """Saisie interactive des propriétés d'une instance."""
        props = self.get_all_props_for_class(class_name)
        if not props:
            console.print("[yellow]Aucune propriété disponible[/]")
            return
        console.print(Panel(f"[bold]Propriétés pour [green]{inst_name}[/] ({class_name})[/bold]"))
        for prop in props:
            current = self.get_instance_value(inst_name, class_name, prop)
            if current is not None:
                console.print(f"  [dim]{prop} : {current} (déjà défini)[/]")
                if not Confirm.ask("Modifier ?", default=False):
                    continue
            ptype = self.get_property_type(prop)
            if ptype == "bool":
                raw = Prompt.ask(f"[cyan]{prop}[/] ? (oui/non/X)", default="X")
                if raw.upper() == "X":
                    val = None
                else:
                    val = raw.lower() in ("oui", "o", "true", "1", "yes")
            elif ptype in ("int", "float"):
                raw = Prompt.ask(f"[cyan]{prop}[/] ? (nombre/X)", default="X")
                if raw.upper() == "X":
                    val = None
                else:
                    try:
                        val = int(raw) if ptype == "int" else float(raw)
                    except ValueError:
                        val = None
            else:
                raw = Prompt.ask(f"[cyan]{prop}[/] ? (texte/X)", default="X")
                val = None if raw.upper() == "X" else raw
            self.set_instance_value(inst_name, class_name, prop, val)

    # ------------------------------------------------------------------
    # Seuils & stats (repris v0.7)
    # ------------------------------------------------------------------
    def get_thresholds(self, class_name: str, prop_name: str) -> dict:
        cid = self.get_class_id(class_name)
        pid = self.get_property_id(prop_name)
        if not cid or not pid:
            return {}
        thresholds = {"LL": None, "L": None, "M": None, "H": None, "HH": None}
        self.cursor.execute(
            "SELECT ll, l, h, hh FROM seprop_manual_thresholds WHERE class_id=? AND prop_id=?",
            (cid, pid)
        )
        row = self.cursor.fetchone()
        if row:
            thresholds["LL"], thresholds["L"], thresholds["H"], thresholds["HH"] = row
        self.cursor.execute(
            "SELECT mean_value, median_value, std_dev FROM seprop_stats WHERE class_id=? AND prop_id=?",
            (cid, pid)
        )
        row = self.cursor.fetchone()
        if row:
            mean, median, stdev = row
            thresholds["M"] = median or mean
            if stdev and stdev > 0:
                if thresholds["L"]  is None: thresholds["L"]  = mean - stdev
                if thresholds["H"]  is None: thresholds["H"]  = mean + stdev
                if thresholds["LL"] is None: thresholds["LL"] = mean - 2 * stdev
                if thresholds["HH"] is None: thresholds["HH"] = mean + 2 * stdev
        return thresholds
