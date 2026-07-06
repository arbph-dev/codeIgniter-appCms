## `vehicules`

- `id` (bigint), `num_acc` (FK), `num_veh` (string), `senc`,`catv`,`occutc`,`obs`,`obsm`,`choc`,`manv`,`marque_id`(nullable),`modele_id`(nullable),`annee_modele`(nullable)
    
- index : (`num_acc`), (`catv`), (`marque_id`)
    


### La rubrique VÉHICULES
```
VÉHICULES
Num_Acc,senc,catv,occutc,obs,obsm,choc,manv,num_veh
201600050625,1,07,000,00,2,6,11,A01
201600050625,1,01,000,00,2,1,00,Z01
201600050626,1,07,000,00,2,2,01,A01
201600050627,1,07,000,00,2,1,02,B01
201600050627,1,07,000,00,0,4,02,A01
201600050628,1,07,000,00,2,4,02,A01

```
Num_Acc
Identifiant de l’accident identique à celui du fichier "rubrique CARACTERISTIQUES" repris pour chacun des véhicules
décrits impliqués dans l’accident

Num_Veh
Identifiant du véhicule repris pour chacun des usagers occupant ce véhicule (y compris les piétons qui sont
rattachés aux véhicules qui les ont heurtés) – Code alphanumérique

senc
Sens de circulation :
1 – PK ou PR ou numéro d’adresse postale croissant
2 – PK ou PR ou numéro d’adresse postale décroissant

catv
Catégorie du véhicule :
01 - Bicyclette
02 - Cyclomoteur <50cm3
03 - Voiturette (Quadricycle à moteur carrossé) (anciennement "voiturette ou tricycle à moteur")
04 - Référence plus utilisée depuis 2006 (scooter immatriculé)
05 - Référence plus utilisée depuis 2006 (motocyclette)
06 - Référence plus utilisée depuis 2006 (side-car)
07 - VL seul
08 - Catégorie plus utilisée (VL + caravane)
09 - Catégorie plus utilisée (VL + remorque)
10 - VU seul 1,5T <= PTAC <= 3,5T avec ou sans remorque (anciennement VU seul 1,5T <= PTAC <=
3,5T)
11 - Référence plus utilisée depuis 2006 (VU (10) + caravane)
12 - Référence plus utilisée depuis 2006 (VU (10) + remorque)
13 - PL seul 3,5T <PTCA <= 7,5T
14 - PL seul > 7,5T
15 - PL > 3,5T + remorque
16 - Tracteur routier seul
17 - Tracteur routier + semi-remorque
18 - Référence plus utilisée depuis 2006 (transport en commun)
19 - Référence plus utilisée depuis 2006 (tramway)
20 - Engin spécial
21 - Tracteur agricole
30 - Scooter < 50 cm3
31 - Motocyclette > 50 cm3 et <= 125 cm3
32 - Scooter > 50 cm3 et <= 125 cm3
33 - Motocyclette > 125 cm3
34 - Scooter > 125 cm3
35 - Quad léger <= 50 cm3 (Quadricycle à moteur non carrossé)
36 - Quad lourd > 50 cm3 (Quadricycle à moteur non carrossé)
37 - Autobus
38 - Autocar
39 - Train
40 - Tramway
99 - Autre véhicule

obs
Obstacle fixe heurté :
1 – Véhicule en stationnement
2 – Arbre
3 – Glissière métallique
4 – Glissière béton
5 – Autre glissière
6 – Bâtiment, mur, pile de pont
7 – Support de signalisation verticale ou poste d’appel d’urgence
8 – Poteau
9 – Mobilier urbain
10 – Parapet
11 – Ilot, refuge, borne haute
12 – Bordure de trottoir
13 – Fossé, talus, paroi rocheuse
14 – Autre obstacle fixe sur chaussée
15 – Autre obstacle fixe sur trottoir ou accotement
16 – Sortie de chaussée sans obstacle

obsm
Obstacle mobile heurté :
1 – Piéton
2 – Véhicule
4 – Véhicule sur rail
5 – Animal domestique
6 – Animal sauvage
9 – Autre

choc
Point de choc initial :
1 - Avant
2 – Avant droit
3 – Avant gauche
4 – Arrière
5 – Arrière droit
6 – Arrière gauche
7 – Côté droit
8 – Côté gauche
9 – Chocs multiples (tonneaux)

manv
Manœuvre principale avant l’accident :
1 – Sans changement de direction
2 – Même sens, même file
3 – Entre 2 files
4 – En marche arrière
5 – A contresens
6 – En franchissant le terre-plein central
7 – Dans le couloir bus, dans le même sens
8 – Dans le couloir bus, dans le sens inverse
9 – En s’insérant
10 – En faisant demi-tour sur la chaussée
Changeant de file
11 – A gauche
12 – A droite
Déporté
13 – A gauche
14 – A droite
Tournant
15 – A gauche
16 – A droite
Dépassant
17 – A gauche
18 – A droite
Divers
19 – Traversant la chaussée
20 – Manœuvre de stationnement
21 – Manœuvre d’évitement
22 – Ouverture de porte
23 – Arrêté (hors stationnement)
24 – En stationnement (avec occupants)

occutc
Nombre d’occupants dans le transport en commun

---
# Evolution

## vehicule_marque 
- tables standard pour marques/modèles (id, nom, meta)
Modèle : VehiculeMarque

| Champ | Type  |
| ----- | ----- |
| `id`  | UUID  |
| `nom` | Texte |

## VehiculeModele

| Champ                     | Type                                   |
| ------------------------- | -------------------------------------- |
| `id`                      | UUID                                   |
| `marque_id`               | FK                                     |
| `nom`                     | Texte                                  |
| `annee_min` / `annee_max` | Entier                                 |
| `type`                    | Catégorie (voiture, moto, utilitaire…) |
## Modèle : VehiculeImpliqué

|Champ|Type|
|---|---|
|`accident_id`|FK|
|`modele_id`|FK|
|`annee`|Entier|
|`defaillances_suspectées`|Texte|
|`observations`|Texte|
# Migrations








# Model
### Vehicule
app/Models/Vehicule.php
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    protected $fillable = [
        'num_acc','num_veh','senc','catv','occutc','obs','obsm','choc','manv','marque_id','modele_id','annee_modele'
    ];

    public function accident() { return $this->belongsTo(Accident::class,'num_acc','num_acc'); }
    public function usagers() { return $this->hasMany(Usager::class,'num_veh','num_veh'); }
    public function marque() { return $this->belongsTo(VehiculeMarque::class,'marque_id'); }
    public function modele() { return $this->belongsTo(VehiculeModele::class,'modele_id'); }
}

```
