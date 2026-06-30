# SecurityDefinition

## Objectif

Décrire les règles de sécurité.

La sécurité ne doit jamais être dispersée dans les composants.

---

## Exemple

```
{    resource : 'article',    permissions : [        'read',        'create',        'update',        'delete'    ]}
```

---

## Exemple CMS

```
{    resource : 'article',    roles : {        guest : [            'read'        ],        editor : [            'read',            'update'        ],        admin : [            'read',            'create',            'update',            'delete'        ]    }}
```

---

## Exemple Référentiel Entreprises

```
{    resource : 'entreprise',    roles : {        guest : ['read'],        agent : [            'read',            'update'        ],        admin : [            'read',            'create',            'update',            'delete'        ]    }}
```