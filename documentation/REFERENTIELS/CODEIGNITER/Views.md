Le controller /app/Controllers/Chimie.php passe une variable $data
$data est un tableau contenant key / value et tableau

$data['title']
$data['purgesData']['intro']
$data['purgesData']['teneurs'][0]['source']

le controlleur transmets $data['title'] à la vue app/Views/pages/chimie_main.php

La vue app/Views/pages/chimie_main.php reçoit et desencapsule les données du controller 
La vue dispose des variables $title , $intro et $purgesData
La vue inclue une sous vue pages/chimie/purges et lui passe des données


## /app/Controllers/Chimie.php
```php
        $data = [
            'title' => 'Chimie de l\'eau',
            'intro' => 'Traitement d\'eau pour générateurs de vapeur et réseaux industriels.',

            'purgesData' => [

                'intro'   => 'L\'eau contient des sels minéraux qui se concentrent lors de la vaporisation. '
                           . 'Sans purge, leur concentration augmente indéfiniment dans la chaudière.',
                'teneurs' => [
                    ['source' => 'Odet à Quimper', 'teneur' => '≈ 20 g/m³'],
                    ['source' => 'Paris (réseau)',  'teneur' => '≈ 250 g/m³'],
                    ['source' => 'Sous-sol parisien', 'teneur' => '> 1 700 g/m³'],
                ],

                'conclusion' => 'L\'adoucisseur transforme les sels alcalino-terreux (Ca, Mg) en sels de sodium solubles, '
                              . 'mais n\'élimine pas le carbonate de calcium. La purge reste indispensable.',
                'types' => [
                    [ 'nom' => 'Extraction de fond',
                        'description' => 'Évacuation des boues accumulées au fond de la chaudière.',
                    ],
                    [
                        'nom'         => 'Purge continue manuelle',
                        'description' => 'Robinet à pointeau Ø 8/13, écoulement visible, réglage manuel.',
                    ],
                    [
                        'nom'         => 'Purge continue automatique',
                        'description' => 'Sonde de conductivité + automate. Meilleure solution, plus coûteuse sur petites puissances.',
                    ],
                ],
                'primage' => 'Le primage est l\'entraînement de gouttelettes d\'eau par la vapeur. '
                           . 'Causes : tension superficielle élevée (sels, phosphates, chlorures), agents mouillants, traces d\'hydrocarbures. '
                           . 'Conséquence : altération de la pureté de la vapeur et baisse de rendement.',
            ],
        ];

        return view('pages/chimie_main', $data);
```


## /app/Views/pages/chimie_main.php

```php
    <article class="cp_soft-card">
        <header>
            <h1><?= esc($title) ?></h1>
            <p><?= esc($intro) ?></p>
        </header>


            <?= $this->include('pages/chimie/purges', $purgesData ) ?>
```

## /app/Views/pages/chimie_main.php
```php
    <section>
        <h3>Pourquoi purger ?</h3>
        <div>
            <div>
                <p><?= esc($data['intro']) ?></p>
                <table border="1">
                    <thead>
                        <tr><th>Source d'eau</th><th>Teneur en sels</th></tr>
                    </thead>
                    <tbody>
                        <?php foreach ($data['teneurs'] as $row): ?>
                        <tr>
                            <td><?= esc($row['source']) ?></td>
                            <td><?= esc($row['teneur']) ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <aside>
                <p><?= esc($data['conclusion']) ?></p>
            </aside>
        </div>
    </section>
```
