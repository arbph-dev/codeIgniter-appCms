
#### version sqlite
```sql
CREATE TABLE "maritimus_quartier_maritime" (
    "rowid" integer PRIMARY KEY AUTOINCREMENT,
    "domaine" text,
    "lbl" text,
    "nom" text,
    "secteur" text
);
```

#### version mysql / mariadb
```sql
CREATE TABLE maritimus_quartier_maritime (
  rowid INT UNSIGNED NOT NULL AUTO_INCREMENT,
  domaine TINYTEXT NOT NULL,
  lbl TINYTEXT NULL,
  nom TINYTEXT NULL,
  secteur TINYTEXT NULL,
  PRIMARY KEY (rowid))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
```

attention
- aux backstick de mysql
- les "" pose problème pour mysql / mariadb, en cas d'export sqlite il faut supprimer les "" voir ci dessus
- rowid est spécifique a sqlite




## core/database.py

[`def __init__(self):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L15)
- KnowledgeBase::def __init__(self): - App - Nombre de lignes  =9

[`def _setup_db(self):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L24)
- KnowledgeBase::def _setup_db(self): - Data - Nombre de lignes  =69

[`def commit(self):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L93)
- KnowledgeBase::def commit(self): - Data - Nombre de lignes  =3

[`close`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L96)
- KnowledgeBase::close - Data - Nombre de lignes  =5

[`def get_class_id(self, name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L101)
- KnowledgeBase::def get_class_id(self, name): - Classes - Nombre de lignes  =5

[`def get_property_id(self, name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L106)
- KnowledgeBase::def get_property_id(self, name): - Propriétés  - Nombre de lignes  =5

[`def get_all_class_names(self):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L111)
- KnowledgeBase::def get_all_class_names(self): - Classes - Nombre de lignes  =4

[`def get_all_property_names(self):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L115)
- KnowledgeBase::def get_all_property_names(self): - Propriétés  - Nombre de lignes  =5

[`def add_class(self, name, parent=None):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L120)
- KnowledgeBase::def add_class(self, name, parent=None): - Classes - Nombre de lignes  =18

[`def add_property(self, name, ptype="string"):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L138)
- KnowledgeBase::def add_property(self, name, ptype="string"): - Propriétés  - Nombre de lignes  =21

[`def link_property_to_class(self, class_name, prop_name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L159)
- KnowledgeBase::def link_property_to_class(self, class_name, prop_name): - MetaRules - Nombre de lignes  =16

[` def add_instance(self, name, class_name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L175)
- KnowledgeBase:: def add_instance(self, name, class_name): - Instances  - Nombre de lignes  =25

[`def get_all_instances(self, class_name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L200)
- KnowledgeBase::def get_all_instances(self, class_name): - Valeurs  - Nombre de lignes  =8

[`def get_instance_value(self, inst_name, class_name, prop_name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L208)
- KnowledgeBase::def get_instance_value(self, inst_name, class_name, prop_name): - Valeurs  - Nombre de lignes  =27

[`def set_instance_value(self, inst_name, class_name, prop_name, value):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L235)
- KnowledgeBase::def set_instance_value(self, inst_name, class_name, prop_name, value): - Valeurs  - Nombre de lignes  =20

[`def get_property_type(self, prop_name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L255)
- KnowledgeBase::def get_property_type(self, prop_name): - Propriétés  - Nombre de lignes  =

[`def get_all_props_for_class(self, class_name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L262)
- KnowledgeBase::def get_all_props_for_class(self, class_name): - Propriétés  - Nombre de lignes  =16

[`def get_hierarchy(self):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L278)
- KnowledgeBase::def get_hierarchy(self): - Classes - Nombre de lignes  =11

[`def _update_stats(self, class_id, prop_id, value):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L289)
- KnowledgeBase::def _update_stats(self, class_id, prop_id, value): - MetaRules - Nombre de lignes  =31

[`def _register_default_rules(self):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L320)
- KnowledgeBase::def _register_default_rules(self): - Rules - Nombre de lignes  =17

[`def _recalculate_full_stats(self, class_id, prop_id):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L337)
- KnowledgeBase::def _recalculate_full_stats(self, class_id, prop_id): - MetaRules - Nombre de lignes  =28

[`def set_instance_value(self, inst_name, class_name, prop_name, value):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L365)
- KnowledgeBase::def set_instance_value(self, inst_name, class_name, prop_name, value): - Valeurs  - Nombre de lignes  =36

[`def get_thresholds(self, class_name, prop_name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L401)
- KnowledgeBase::def get_thresholds(self, class_name, prop_name): - MetaRules - Nombre de lignes  =39

[`def set_manual_thresholds(self, class_name, prop_name, ll=None, l=None, h=None, hh=None):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L440)
- KnowledgeBase::def set_manual_thresholds(self, class_name, prop_name, ll=None, l=None, h=None, hh=None): - MetaRules - Nombre de lignes  =14

[`def ask_and_set_properties(self, inst_name, class_name):`](/project/sysex/akinator-0-7/XXpertSystem/core/database.py#L454)
- KnowledgeBase::def ask_and_set_properties(self, inst_name, class_name): - MetaRules - Nombre de lignes  =45
