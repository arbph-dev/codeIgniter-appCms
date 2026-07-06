# distinctions
On créer un véritable référentiel. Au lieu d'avoir :
- personne_distinction
- organisation_distinction

Ainsi on pourra attribuer :
- une Légion d'honneur à une personne ;
- un Label Entreprise du Patrimoine Vivant à une entreprise ;
- une Certification ISO 9001 à une organisation (si tu considères cela comme une distinction).

## module 
2 tables polymorphes génériques plutôt qu'une multitude de tables spécialisées. 
Le schéma reste compact tout en restant très extensible.

- distinctions
- distinction_objets
  puis une seule table d'attribution.
---
**table distinctions**
- id
- code
- label
- organisme
- description

---
**table distinction_objets**
- id
- distinction_id
- objet_type ( personne | organisation )
- objet_id
- date_attribution
- reference
- commentaire

## Notes
Concept	à généraliser :
- [document](/documentation/METIERS/MAINTENANCE/document.md) / [documentobjet](/documentation/METIERS/MAINTENANCE/documentobjet.md)
- Distinctions /	distinction_objets
- (éventuellement) Images	/ imageobjet
- (éventuellement) Liens externes / 	lienobjet

