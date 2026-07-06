## `usagers`

- `id`, `num_acc` (FK), `num_veh` (nullable), `place`,`catu`,`grav`,`sexe`,`trajet`,`secu`,`locp`,`actp`,`etatp`,`an_nais`
    
- index : (`num_acc`), (`grav`)

### La rubrique USAGERS

```
USAGERS
Num_Acc,place,catu,grav,sexe,trajet,secu,locp,actp,etatp,an_nais,num_veh
201600050625,1,1,3,2,1,11,0,0,0,1979,A01
201600050626,1,1,4,1,1,11,0,0,0,1975,A01
201600050627,1,1,1,1,5,11,0,0,0,1942,B01
201600050627,1,1,4,2,9,11,0,0,0,1966,A01

```

Num_Acc
Identifiant de l’accident identique à celui du fichier "rubrique CARACTERISTIQUES" repris pour chacun des usagers
décrits impliqués dans l’accident

Num_Veh
Identifiant du véhicule repris pour chacun des usagers occupant ce véhicule (y compris les piétons qui sont
rattachés aux véhicules qui les ont heurtés) – Code alphanumérique
place
Permet de situer la place occupée dans le véhicule par l'usager au moment de l'accident

catu
Catégorie d'usager :
1 - Conducteur
2 - Passager
3 - Piéton
4 - Piéton en roller ou en trottinette

grav
Gravité de l'accident : Les usagers accidentés sont classés en trois catégories de victimes plus les indemnes
1 - Indemne
2 - Tué
3 - Blessé hospitalisé
4 - Blessé léger

sexe
Sexe de l'usager
1 - Masculin
2 – Féminin

An_nais
Année de naissance de l'usager

trajet
Motif du déplacement au moment de l’accident :
1 – Domicile – travail
2 – Domicile – école
3 – Courses – achats
4 – Utilisation professionnelle
5 – Promenade – loisirs
9 – Autre

secu
sur 2 caractères :
le premier concerne l’existence d’un Équipement de sécurité
1 – Ceinture
2 – Casque
3 – Dispositif enfants
4 – Equipement réfléchissant
9 – Autre
le second concerne l’utilisation de l’Équipement de sécurité
1 – Oui
2 – Non
3 – Non déterminable

locp
Localisation du piéton :
Sur chaussée :
1 – A + 50 m du passage piéton
2 – A – 50 m du passage piéton
Sur passage piéton :
3 – Sans signalisation lumineuse
4 – Avec signalisation lumineuse
Divers :
5 – Sur trottoir
6 – Sur accotement
7 – Sur refuge ou BAU
8 – Sur contre allée

actp
Action du piéton :
Se déplaçant
0 - non renseigné ou sans objet
1 - Sens véhicule heurtant
2 - Sens inverse du véhicule
Divers
3 - Traversant
4 - Masqué
5 - Jouant – courant
6 - Avec animal
9 - Autre

etatp
Cette variable permet de préciser si le piéton accidenté était seul ou non
1 – Seul
2 – Accompagné
3 – En groupe


# Migration

### 2025_11_23_000004_create_usagers_table.php
```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('usagers', function (Blueprint $table) {
            $table->id();
            $table->string('num_acc', 32)->index();
            $table->string('num_veh', 16)->nullable()->index();
            $table->tinyInteger('place')->nullable();
            $table->tinyInteger('catu')->nullable();
            $table->tinyInteger('grav')->nullable()->index();
            $table->tinyInteger('sexe')->nullable();
            $table->tinyInteger('trajet')->nullable();
            $table->string('secu',4)->nullable();
            $table->tinyInteger('locp')->nullable();
            $table->tinyInteger('actp')->nullable();
            $table->tinyInteger('etatp')->nullable();
            $table->smallInteger('an_nais')->nullable();
            $table->timestamps();

            $table->foreign('num_acc')->references('num_acc')->on('accidents')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('usagers');
    }
};

```
# Model

### Usager
app/Models/Usager.php
```php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usager extends Model
{
    protected $fillable = [
        'num_acc','num_veh','place','catu','grav','sexe','trajet','secu','locp','actp','etatp','an_nais'
    ];

    public function accident() { return $this->belongsTo(Accident::class,'num_acc','num_acc'); }
    public function vehicule() { return $this->belongsTo(Vehicule::class,'num_veh','num_veh'); }
}

```
