# ServiceDefinition

## Objectif

Décrire un service réutilisable.

Un service encapsule une logique transverse.

---

## Exemples

```
NotificationServiceDialogServiceApiServiceAuthServiceStorageServiceExportServiceSpeechService
```

---

## Exemple

```
{    name: 'notificationService',    methods: [        'info',        'warning',        'error'    ]}
```

---

## Position

```
Application    ↓Feature    ↓Service
```

---

## Exemple CMS

```
ArticleFeature    ↓ArticleApi    ↓NotificationService
```

---