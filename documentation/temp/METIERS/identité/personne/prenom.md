


```sql
CREATE TABLE prenom (
    prenom_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    fk_mot_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (prenom_id),
    CONSTRAINT fk_prenom_mot FOREIGN KEY (fk_mot_id) REFERENCES mots(mot_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

laravel

```php
Schema::create('prenom', function (Blueprint $table) {
    $table->increments('prenom_id');
    $table->unsignedInteger('fk_mot_id');
    $table->foreign('fk_mot_id')
          ->references('mot_id')->on('mots')
          ->onDelete('cascade');
    $table->timestamps(); // optionnel, si vous voulez created_at/updated_at
});
```


## Relation

[[METIERS/mots]]