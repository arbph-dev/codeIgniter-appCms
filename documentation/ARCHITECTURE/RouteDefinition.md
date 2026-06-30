# RouteDefinition

## Objectif

Décrire une route de navigation.

Une route associe :

```
URL    ↓View
```

---

## Exemple

```
{    path : '/article/:id',    view : 'article-detail'}
```

---

## Exemple complet

```
[    {        path : '/',        view : 'home'    },    {        path : '/articles',        view : 'article-list'    },    {        path : '/article/:id',        view : 'article-detail'    }]
```

---

## CMS

```
/articles    ↓ArticleListView/article/15    ↓ArticleDetailView
```

---

## Particularité SPA

Une route ne recharge pas la page.

Elle publie généralement :

```
route:change
```

puis :

```
view:open
```

---