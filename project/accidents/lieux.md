## `lieux`

- `id` (bigint auto), `num_acc` (FK accidents.num_acc), `catr`,`voie`,`v1`,`v2`,`circ`,`nbv`,`pr`,`pr1`,`vosp`,`prof`,`plan`,`lartpc`,`larrout`,`surf`,`infra`,`situ`,`env1`
    
- index : (`num_acc`), (`catr`)
    




### La rubrique LIEUX
```
LIEUX
Num_Acc,catr,voie,v1,v2,circ,nbv,pr,pr1,vosp,prof,plan,lartpc,larrout,surf,infra,situ,env1
201600050626,1,55,,,1,02,18,0,0,1,1,040,070,1,0,1,00
201600050627,1,515,,,1,02,1,200,0,1,3,015,105,1,0,1,00
201600050628,1,50,,,3,03,5,0,0,1,1,025,105,1,0,1,00
201600050629,1,7,,,3,03,260,500,0,1,1,025,105,1,0,1,00
201600050630,1,7,,,1,03,275,0,0,1,1,000,000,1,1,1,99
```

Num_Acc
Identifiant de l’accident identique à celui du fichier "rubrique CARACTERISTIQUES" repris dans l’accident

catr
Catégorie de route :
1 - Autoroute
2 - Route Nationale
3 - Route Départementale
4 - Voie Communale
5 - Hors réseau public
6 - Parc de stationnement ouvert à la circulation publique
9 – autre

voie
Numéro de la route

V1
Indice numérique du numéro de route (exemple : 2 bis, 3 ter etc.)

V2
Lettre indice alphanumérique de la route

circ
Régime de circulation :
1 – A sens unique
2 – Bidirectionnelle
3 – A chaussées séparées
4 – Avec voies d’affectation variable

nbv
Nombre total de voies de circulation

vosp
Signale l’existence d’une voie réservée, indépendamment du fait que l’accident ait lieu ou non sur cette voie.
1 – Piste cyclable
2 – Banque cyclable
3 – Voie réservée

prof
Profil en long décrit la déclivité de la route à l'endroit de l'accident
1 - Plat
2 - Pente
3 - Sommet de côte
4- Bas de côte

pr
Numéro du PR de rattachement (numéro de la borne amont)

pr1
Distance en mètres au PR (par rapport à la borne amont)

plan
Tracé en plan :
1 – Partie rectiligne
2 – En courbe à gauche
3 – En courbe à droite
4 – En « S »

lartpc
Largeur du terre plein central (TPC) s'il existe

larrout
Largeur de la chaussée affectée à la circulation des véhicules ne sont pas compris les bandes d'arrêt d'urgence,
les TPC et les places de stationnement

surf
Etat de la surface
1 - normale
2 - mouillée
3 - flaques
4 - inondée
5 - enneigée
6 - boue
7 - verglacée
8 - corps gras - huile
9 - autre

infra
Aménagement - Infrastructure :
1 – Souterrain - tunnel
2 – Pont - autopont
3 – Bretelle d’échangeur ou de raccordement
4 - Voie ferrée
5 – Carrefour aménagé
6 – Zone piétonne
7 – Zone de péage

situ
Situation de l’accident :
1 – Sur chaussée
2 – Sur bande d’arrêt d’urgence
3 – Sur accotement
4 – Sur trottoir
5 – Sur piste cyclable

point école : proximité d'une école


# Migration

# Model

### Lieu
app/Models/Lieu.php
```php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lieu extends Model
{
    protected $fillable = [
        'num_acc','catr','voie','v1','v2','circ','nbv','pr','pr1','vosp','prof','plan','lartpc','larrout','surf','infra','situ','env1'
    ];

    public function accident() { return $this->belongsTo(Accident::class,'num_acc','num_acc'); }
}

