<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class Chimie extends BaseController
{
    public function index()
    {
        $data = [
            'title' => 'Chimie de l\'eau',
            'intro' => 'Traitement d\'eau pour générateurs de vapeur et réseaux industriels.',

            // --- UNITÉS ---
            'unitesData' => [
                'ph' => [
                    'titre'          => 'pH — Potentiel d\'hydrogène',
                    'description'    => 'Le pH mesure l\'alcalinité ou l\'acidité d\'une solution. Il varie de 0 à 14 à 20°C. '
                                      . 'En dessous de 7 : acide. À 7 : neutre. Au dessus de 7 : basique. '
                                      . 'Le pH diminue quand la température augmente, la mesure de référence est à 20°C. '
                                      . 'pH = -log[H3O+] | pOH = -log[OH-] | pKe = pH + pOH = 14',
                    'ke'             => 'Ke = [H3O+] × [OH-] = 10⁻¹⁴. '
                                      . 'Acide pH=0 → pOH=14. Basique pH=14 → pOH=0.',
                    'exemple_terrain'=> 'En pratique : une fuite sur condenseur peut être identifiée par son pH. '
                                      . 'L\'eau de chaudière est très basique (passivation des tubes acier). '
                                      . 'L\'eau de condensation a un pH très bas. '
                                      . 'Une bandelette pH permet de localiser la zone de fuite.',
                ],
                'th' => [
                    'titre'       => 'TH — Titre hydrotimétrique',
                    'description' => 'Le TH mesure la dureté de l\'eau : quantité de calcium et magnésium dissous. Unité : degré français (°f).',
                    'usages'      => [
                        'Blanchisserie process de lavage : 5 à 7 °f',
                        'Entrée chaudière vapeur : 0 °f obligatoire',
                        'Eau de ville courante : 25 à 40 °f selon région',
                    ],
                ],
                'tac' => [
                    'titre'      => 'TAC — Titre alcalimétrique complet',
                    'description'=> 'Le TAC mesure la concentration en bicarbonates de l\'eau. '
                                  . 'Il est directement lié au risque d\'entartrage.',
                    'entartrage' => 'TH + TAC → tartre + CO2. '
                                  . '1°f TH + 1°f TAC = 10 mg de tartre par litre (10 g/m³). '
                                  . 'Un générateur 2 t/h, 10h/j, 250 j/an avec eau TH=35°f → 875 kg de tartre par an.',
                ],
            ],

            // --- CORROSIONS ---
            'corrosionsData' => [
                'intro' => 'La corrosion est un phénomène chimique qui altère les équipements : chaudières, réseaux vapeur, retours condensats. '
                         . 'Elle peut entraîner perforation, fissuration et rupture.',
                'types' => [
                    [
                        'titre'       => 'Corrosion par l\'oxygène (O₂)',
                        'description' => 'Les eaux mises en contact avec l\'air fixent de l\'oxygène. '
                                       . 'L\'élévation de température le libère et provoque des piqûres sous les dépôts (pustules). '
                                       . 'Un courant électrique s\'établit entre zone aérée (cathode) et zone moins aérée (anode) : le fer anodique passe en solution.',
                        'facteurs'    => ['Température élevée', 'Contact avec l\'air', 'Dépôts de tartre favorisant les zones anodiques'],
                    ],
                    [
                        'titre'       => 'Corrosion par le CO₂',
                        'description' => 'La dissociation des bicarbonates sous l\'effet de la température libère du CO₂. '
                                       . 'Dissous dans les condensats, il forme de l\'acide carbonique, abaisse le pH et augmente la corrosion. '
                                       . 'Plus accentuée dans les eaux bicarbonatées sodiques.',
                        'facteurs'    => ['Bicarbonates dans l\'eau d\'alimentation', 'Température', 'Eau bicarbonatée sodique'],
                    ],
                    [
                        'titre'       => 'Corrosion par les sels dissous',
                        'description' => 'Les chlorures sont les sels corrosifs les plus répandus : MgCl₂, FeCl₂, FeCl₃, NaCl, CaCl₂. '
                                       . 'Tolérés jusqu\'à 100 mg/L (TH 10-25°f). Au delà de 1 g/L : attaque inter-granulaire du fer et de l\'acier.',
                        'facteurs'    => ['Chlorures > 100 mg/L', 'Adoucisseurs mal rincés (eau salée)', 'Eau traitée au chlore ou à l\'ozone'],
                    ],
                ],
                'preventions' => [
                    'Surveiller parfaitement le rinçage des adoucisseurs',
                    'Chauffer l\'eau en bâche pour éliminer l\'oxygène dissous',
                    'Vidanger et nettoyer à chaque arrêt prolongé',
                    'Relever le pH à 8,5 par adjonction de phosphate trisodique',
                    'Ouvrir et nettoyer la chaudière plusieurs fois par an',
                    'Conditionner l\'eau d\'alimentation',
                ],
            ],

            // --- PURGES ---
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
                    [
                        'nom'         => 'Extraction de fond',
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

            // --- ÉQUIPEMENTS ---
            'equipementsData' => [
                'principe'        => 'L\'adoucisseur utilise une résine échangeuse d\'ions : le calcium et le magnésium sont échangés '
                                   . 'contre du sodium. La charge minérale totale reste identique (eau adoucie ≠ eau déminéralisée). '
                                   . 'La résine se régénère avec une saumure (300 g/L de NaCl).',
                'dimensionnement' => [
                    'Mesurer le TH de l\'eau à adoucir',
                    'Estimer la consommation quotidienne (m³/j)',
                    'Estimer le débit maximal (m³/h)',
                    'Vérifier la pression disponible',
                    'Choisir le mode de régénération',
                ],
                'perso' => 'Expérience : dé-sulfatation de résines carboxyliques après 30 mois de fonctionnement sans suivi. '
                         . 'Solution proposée par Culligan : 35 000 € de remplacement de résines. '
                         . 'Solution retenue après 15 jours de travail personnel : procédure de dé-sulfatation, '
                         . 'résultats validés par Nalco et un spécialiste Véolia.',
                'types' => [
                    [
                        'nom'         => 'Adoucisseur semi-automatique',
                        'description' => 'Bouteille fibre de verre dans bac à saumure. Régénération automatique, déclenchement manuel (minuterie). Sans raccordement électrique.',
                        'specs'       => ['Capacités : 7, 16, 20, 30 L de résine', 'Raccords Ø 20/27 (3/4")', 'Accessoires : filtre tamis, clapet retenue, soupape 7 bar'],
                    ],
                    [
                        'nom'         => 'Adoucisseur chronométrique',
                        'description' => 'Régénération programmée sur durée. Vanne 5600 à 8 cycles automatiques. Versions monobloc et bi-bloc.',
                        'specs'       => ['Monobloc : 7 à 30 L | Bi-bloc : 7 à 100 L', 'Volume traité/cycle (TH=25°f) : 1,6 à 24,0 m³', 'Raccords Ø 26/34 (1")'],
                    ],
                    [
                        'nom'         => 'Adoucisseur volumétrique',
                        'description' => 'Régénération programmée sur volume réel traité (compteur mécanique incorporé). Plus précis que le chronométrique.',
                        'specs'       => ['Monobloc : 7 à 30 L | Bi-bloc : 7 à 100 L', 'Volume traité/cycle (TH=25°f) : 1,6 à 24,0 m³', 'Raccords Ø 26/34 (1")'],
                    ],
                    [
                        'nom'         => 'Adoucisseur DUPLEX (TWIN alterné)',
                        'description' => 'Deux bouteilles alternées avec turbine incorporée : aucune interruption d\'eau traitée. '
                                       . 'L\'appareil n°1 bascule automatiquement sur le n°2 à saturation, puis régénère pendant que le n°2 produit.',
                        'specs'       => ['Zéro interruption de production', 'Régénération volumétrique automatique', 'Idéal pour usage continu 24h/24'],
                    ],
                ],
            ],
        ];

        return view('pages/chimie_main', $data);
    }
}
