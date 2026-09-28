# user_profils

## migration sql (mysql)

```sql
CREATE TABLE user_profils (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         INT UNSIGNED NOT NULL,
    tel_fixe        VARCHAR(20) NULL,
    tel_mobile      VARCHAR(20) NULL,
    personne_id     BIGINT UNSIGNED NULL,
	adresse_id      BIGINT UNSIGNED NULL,
    organisation_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
    defaut          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NULL,
    updated_at      DATETIME NULL,

    PRIMARY KEY (id),

    UNIQUE KEY uk_user_profils_user_org (user_id, organisation_id),

    CONSTRAINT fk_user_profils_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_user_profils_personne
        FOREIGN KEY (personne_id) REFERENCES personnes(id)
        ON DELETE SET NULL ON UPDATE CASCADE,

	CONSTRAINT fk_user_profils_adresse
        FOREIGN KEY (adresse_id) REFERENCES adresses(id)
        ON DELETE SET NULL ON UPDATE CASCADE,

    CONSTRAINT fk_user_profils_organisation
        FOREIGN KEY (organisation_id) REFERENCES organisations(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## historique
- renommer client_profil en user_profils

- UNIQUE KEY uk_client_profil_user (user_id) doit evoluer
	- 1 profil par user par organisation
  		user.id shield et user_profils_persid peuvent être associé a plusieurs user_profils

user_profils peut avoir les mêmes  user.id shield , user_profils_persid si et seulement si  user_profils_orgid est différent (consultant pour deux entreprises distincts)
- il faudra permettre la sélection apres login si on trouve plusieurs profil
- un select dans Toolbar2AuthPanel sera affiché ou masque selon qu'il y est plusieurs profils
- on peut ajouter une valeur default true dans user_profils	le dashboard user permettra de modifier le profil par defaut
