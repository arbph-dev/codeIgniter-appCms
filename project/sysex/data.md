# Tables

[seclass](/project/sysex/data.md#seclass)
- contient les classes du système : animal, mammifère 

seprop
- contient les propriétés qui sont affectables aux classes

seclass_prop
- contient les propriétés affectées aux classes

seinst
- instance de classe

seinst_value

seprop_stats

seprop_manual_thresholds

se_users

se_submissions

se_events
    - a documenter

credentials

## seclass
champs
- id , name, parent_id

relations
- structurelle et hiérarchique 1 parent peut avoir n enfants

```sql
CREATE TABLE IF NOT EXISTS seclass (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES seclass(id)
);
```

## seprop
```sql
CREATE TABLE IF NOT EXISTS seprop (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL DEFAULT 'string'
);
```

## seclass_prop
```sql
CREATE TABLE IF NOT EXISTS seclass_prop (
    class_id INTEGER,
    prop_id INTEGER,
    PRIMARY KEY (class_id, prop_id),
    FOREIGN KEY (class_id) REFERENCES seclass(id),
    FOREIGN KEY (prop_id) REFERENCES seprop(id)
);
```
## seinst
```sql
CREATE TABLE IF NOT EXISTS seinst (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_id INTEGER NOT NULL,
    UNIQUE(name, class_id),
    FOREIGN KEY (class_id) REFERENCES seclass(id)
);
```
## seinst_value
```sql
CREATE TABLE IF NOT EXISTS seinst_value (
    inst_id INTEGER,
    prop_id INTEGER,
    value TEXT,
    PRIMARY KEY (inst_id, prop_id)
);
```
## seprop_stats
```sql
-- Nouvelle table pour les statistiques par (classe, propriété numérique)
CREATE TABLE IF NOT EXISTS seprop_stats (
    class_id INTEGER,
    prop_id INTEGER,
    instance_count INTEGER DEFAULT 0,   -- nb d'instances avec valeur non nulle
    min_value REAL,
    max_value REAL,
    mean_value REAL,
    median_value REAL,
    std_dev REAL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, prop_id),
    FOREIGN KEY (class_id) REFERENCES seclass(id),
    FOREIGN KEY (prop_id) REFERENCES seprop(id)
);
```
## seprop_manual_thresholds
```sql
-- Optionnel : table pour seuils manuels (expert)
CREATE TABLE IF NOT EXISTS seprop_manual_thresholds (
    class_id INTEGER,
    prop_id INTEGER,
    ll REAL,
    l REAL,
    h REAL,
    hh REAL,
    PRIMARY KEY (class_id, prop_id),
    FOREIGN KEY (class_id) REFERENCES seclass(id),
    FOREIGN KEY (prop_id) REFERENCES seprop(id)
);
```

## se_users
```sql
CREATE TABLE IF NOT EXISTS se_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
## se_submissions
```sql
CREATE TABLE IF NOT EXISTS se_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    description TEXT,
    changes_json TEXT,
    status TEXT DEFAULT 'pending',
    validated_by INTEGER,
    validated_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES se_users(id),
    FOREIGN KEY (validated_by) REFERENCES se_users(id)
);
```



## credentials
```sql
CREATE TABLE credentials (
    service    TEXT PRIMARY KEY,
    login      TEXT,
    password   TEXT,
    api_key    TEXT,
    token      TEXT,
    updated_at DATETIME
);
```sql
