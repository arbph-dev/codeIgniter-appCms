class KnowledgeBase:
    def __init__(self):
        self.features = ["ailes", "plumes", "crie", "rapace", "mammifère", "vit_dans_leau", "couleur dominante", "taille"]
        self.animals = {
            "tigre": {
                "ailes": False, "plumes": False, "crie": "rugit", "rapace": False,
                "mammifère": True, "vit_dans_leau": False, "couleur dominante": "orange et noir"
            },
            "merle": {
                "ailes": True, "plumes": True, "crie": "chante", "rapace": False,
                "mammifère": False, "vit_dans_leau": False, "couleur dominante": "noir"
            },
            "faucon": {
                "ailes": True, "plumes": True, "crie": "crie", "rapace": True,
                "mammifère": False, "vit_dans_leau": False, "couleur dominante": "brun","taille":"moyen"
            },
            "dauphin": {
                "ailes": False, "plumes": False, "crie": "clique", "rapace": False,
                "mammifère": True, "vit_dans_leau": True, "couleur dominante": "gris"
            },
            "aigle": {
                "ailes": True, "plumes": True, "crie": "crie", "rapace": True,
                "mammifère": False, "vit_dans_leau": False, "couleur dominante": "brun et blanc" , "taille":"grand"
            },
            "pingouin": {
                "ailes": True, "plumes": True, "crie": "braille", "rapace": False,
                "mammifère": False, "vit_dans_leau": True, "couleur dominante": "noir et blanc"
            }
        }

    def add_feature(self, feature_name):
        if feature_name not in self.features:
            self.features.append(feature_name)
            for animal in self.animals:
                self.animals[animal][feature_name] = None

    def remove_feature(self, feature_name):
        if feature_name in self.features:
            self.features.remove(feature_name)
            for animal in self.animals:
                if feature_name in self.animals[animal]:
                    del self.animals[animal][feature_name]

    def modify_feature_name(self, old_name, new_name):
        if old_name in self.features and new_name not in self.features:
            idx = self.features.index(old_name)
            self.features[idx] = new_name
            for animal in self.animals:
                self.animals[animal][new_name] = self.animals[animal].pop(old_name, None)

    def add_animal(self, name, features):
        self.animals[name] = features
        for feat in self.features:
            if feat not in features:
                self.animals[name][feat] = None

    def remove_animal(self, name):
        if name in self.animals:
            del self.animals[name]

    def modify_animal_name(self, old_name, new_name):
        if old_name in self.animals and new_name not in self.animals:
            self.animals[new_name] = self.animals.pop(old_name)

    def find_candidates(self, answers):
        candidates = []
        for animal, feats in self.animals.items():
            match = True
            for f, v in answers.items():
                if feats.get(f) is None:
                    continue
                if feats.get(f) != v:
                    match = False
                    break
            if match:
                candidates.append(animal)
        return candidates

    def get_feature_value(self, animal, feature):
        return self.animals.get(animal, {}).get(feature)

    def set_feature_value(self, animal, feature, value):
        if animal in self.animals:
            self.animals[animal][feature] = value


def ask_yes_no(question):
    while True:
        answer = input(question + " (oui/o/non/n/X pour inconnu) ").strip().lower()
        if answer in ("oui", "o", "yes", "y"):
            return True
        if answer in ("non", "n", "no"):
            return False
        if answer in ("x", "inconnu", "je sais pas", "jsp"):
            return None  # None signifie "inconnu"
        print("Réponse invalide, veuillez répondre par 'oui', 'o', 'non', 'n' ou 'X' pour inconnu.")

def ask_value(question):
    return input(question + " ").strip().lower()


def ask_features(kb, animal_name):
    features = {}
    for feat in kb.features:
        val = kb.get_feature_value(animal_name, feat)
        if isinstance(val, bool) or val is None:
            features[feat] = ask_yes_no(f"L'animal {animal_name} a-t-il {feat} ?")
        else:
            features[feat] = ask_value(f"Comment l'animal {animal_name} {feat}-il ?")
    return features

def ask_question(chosen):
    feat, qtype, extra = chosen

    if qtype == "bool":
        return ask_yes_no(f"L'animal a-t-il {feat} ?"), feat, None

    elif qtype == "text_common":
        pretty = extra.replace("_", " ")
        response = ask_yes_no(f"L'animal a-t-il '{feat}' = '{pretty}' ?")
        return response, feat, extra

    elif qtype == "text_distinct":
        pretty = extra.replace("_", " ")
        response = ask_yes_no(f"L'animal est-il de {feat} '{pretty}' ?")
        return response, feat, extra

    return None, None, None  # fallback

def add_new_animal(kb):
    print("Ajout d'un nouvel animal.")
    name = input("Nom de l'animal : ").strip().lower()
    if name in kb.animals:
        print("Cet animal existe déjà.")
        return
    features = ask_features(kb, name)
    kb.add_animal(name, features)
    print(f"Animal '{name}' ajouté.")


def modify_animal(kb):
    name = input("Nom de l'animal à modifier : ").strip().lower()
    if name not in kb.animals:
        print("Animal non trouvé.")
        return
    print(f"Modification des caractéristiques de '{name}'.")
    features = ask_features(kb, name)
    kb.animals[name] = features
    print(f"Animal '{name}' modifié.")


def remove_animal(kb):
    name = input("Nom de l'animal à supprimer : ").strip().lower()
    if name not in kb.animals:
        print("Animal non trouvé.")
        return
    kb.remove_animal(name)
    print(f"Animal '{name}' supprimé.")


def list_animals(kb):
    if not kb.animals:
        print("Aucun animal dans la base.")
        return
    print("Animaux dans la base :")
    for animal in kb.animals:
        print(f"- {animal}")


def add_feature(kb):
    name = input("Nom de la nouvelle caractéristique : ").strip().lower()
    if name in kb.features:
        print("Cette caractéristique existe déjà.")
        return
    kb.add_feature(name)
    print(f"Caractéristique '{name}' ajoutée.")


def modify_feature(kb):
    old_name = input("Nom de la caractéristique à modifier : ").strip().lower()
    if old_name not in kb.features:
        print("Caractéristique non trouvée.")
        return
    new_name = input("Nouveau nom de la caractéristique : ").strip().lower()
    if new_name in kb.features:
        print("Ce nom existe déjà.")
        return
    kb.modify_feature_name(old_name, new_name)
    print(f"Caractéristique '{old_name}' renommée en '{new_name}'.")


def remove_feature(kb):
    name = input("Nom de la caractéristique à supprimer : ").strip().lower()
    if name not in kb.features:
        print("Caractéristique non trouvée.")
        return
    kb.remove_feature(name)
    print(f"Caractéristique '{name}' supprimée.")


def list_features(kb):
    if not kb.features:
        print("Aucune caractéristique dans la base.")
        return
    print("Caractéristiques dans la base :")
    for feat in kb.features:
        print(f"- {feat}")

# V0.2.1  AJOUT
def show_animal_details(kb):
    if not kb.animals:
        print("Aucun animal dans la base.")
        return
    
    print("\n=== DÉTAILS DES ANIMAUX ===")
    for animal, features in kb.animals.items():
        print(f"\n-> {animal.upper()}")
        for feat in kb.features:
            val = features.get(feat)
            if val is True:
                print(f"   • a {feat}")
            elif val is False:
                print(f"   • n'a pas {feat}")
            elif val is not None:
                print(f"   • {feat} : {val}")
            else:
                print(f"   • {feat} : inconnu")




def ask_discriminating_feature(kb, known_animal, wrong_animal):
    print(f"Je n'ai pas réussi à deviner. Quelle caractéristique différencie un {known_animal} d'un {wrong_animal} ?")
    new_feat = input("Nom de la caractéristique : ").strip().lower()
    kb.add_feature(new_feat)
    val_known = ask_value(f"Valeur de '{new_feat}' pour un {known_animal} :")
    val_wrong = ask_value(f"Valeur de '{new_feat}' pour un {wrong_animal} :")
    kb.set_feature_value(known_animal, new_feat, val_known)
    kb.set_feature_value(wrong_animal, new_feat, val_wrong)
    print(f"Caractéristique '{new_feat}' ajoutée et renseignée.")


# V02.1 MODIFICATION ------------------------------------------------------------------------------------------------------------------------------------------------------


def find_possible_questions(candidates, kb, skipped_questions):
    questions = []  # (feat, type, extra)  extra = valeur pour text_common

    for feat in kb.features:
        known = [(a, kb.animals[a].get(feat)) for a in candidates if kb.animals[a].get(feat) is not None]
        if not known:
            continue
        values = [val for _, val in known]
        all_known = len(known) == len(candidates)

        # 1. Booléen discriminante
        if all(isinstance(v, bool) for v in values) and len(set(values)) > 1:
            questions.append((feat, "bool", None))

        # 2. Textuel : une seule valeur connue + au moins un inconnu → "est-ce X ?"
        elif all(isinstance(v, str) for v in values) and len(set(values)) > 1 and all_known:
            for val in set(values):
                key = f"{feat}={val}"
                if key not in skipped_questions:
                    questions.append((feat, "text_distinct", val))

        # 3. Textuel : plusieurs valeurs différentes + tous connus → on peut poser "est-ce grand ?"
        elif all(isinstance(v, str) for v in values) and len(set(values)) > 1 and all_known:
            # On choisit la valeur la plus "distinctive" (ici on prend la première)
            # Mais on garde le type pour savoir qu'on peut poser une question oui/non sur une valeur
            for val in set(values):
                questions.append((feat, "text_distinct", val))

    return questions

def filter_candidates(candidates, feat, response, qtype, extra, kb):
    new_cands = []
    for animal in candidates:
        val = kb.animals[animal].get(feat)
        keep = False

        if qtype == "bool":
            keep = (val is None or val == response)
        elif qtype in ("text_common", "text_distinct"):
            if response:  # oui → doit avoir cette valeur
                keep = (val == extra)
            else:  # non → doit avoir une autre valeur ou inconnu
                keep = (val != extra)
        if keep:
            new_cands.append(animal)
    return new_cands


def guess_animal(kb, debug=True):
    print("Pensez à un animal, je vais essayer de deviner.\n")
    skipped_questions = set()  # Pour mémoriser les questions ignorées (feat + valeur)
    candidates = list(kb.animals.keys())
    answers = {}
    step = 1

    if debug:
        print("=== DÉBUT DU RAISONNEMENT ===")
        print(f"Étape 0 : Candidats initiaux ({len(candidates)}) : {', '.join(sorted(candidates))}\n")

    while len(candidates) > 1:
        if debug:
            print(f"--- ÉTAPE {step} ---")
            print(f"Candidats actuels ({len(candidates)}) : {', '.join(sorted(candidates))}")

        questions = find_possible_questions(candidates, kb, skipped_questions)

        if debug:
            if questions:
                bools = [f for f, t, _ in questions if t == "bool"]
                commons = [f"{f}='{e}'" for f, t, e in questions if t == "text_common"]
                distincts = [f"{f}='{e}'" for f, t, e in questions if t == "text_distinct"]
                print("Questions possibles :")
                if bools: print(f"   Bool : {bools}")
                if commons: print(f"   Commun : {commons}")
                if distincts: print(f"   Distinct : {distincts}")
            else:
                print("Aucune question discriminante.")

        if not questions:
            if debug:
                print("→ Plus de questions utiles.\n")
            break

        # Priorité : bool > text_distinct > text_common
        chosen = next((q for q in questions if q[1] == "bool"), 
                      next((q for q in questions if q[1] == "text_distinct"), 
                           questions[0]))

        response, feat, extra = ask_question(chosen)

        if response is None:
            if debug:
                print("→ Réponse : inconnu (X) → je passe à une autre question")
            if chosen[1] in ("text_distinct", "text_common"):
                skipped_key = f"{feat}={extra}"
                skipped_questions.add(skipped_key)
            continue

        # Sinon, réponse oui/non → on filtre normalement
        candidates = filter_candidates(candidates, feat, response, chosen[1], extra, kb)
        if debug:
                print("→ WATCH guess_animal :  filter_candidates ")
        
        if debug:
            eliminated = len(candidates) < len(candidates)  # juste pour affichage
            print(f"→ Réponse : {'oui' if response else 'non' if chosen[1] != 'text_open' else response}")
            print(f"→ {len(candidates)} restant(s)\n")
            step += 1

    # === Fin ===
    if debug:
        print("=== FIN DU RAISONNEMENT ===\n")

    if len(candidates) == 1:
        candidate = candidates[0]
        if ask_yes_no(f"Est-ce un {candidate} ?"):
            print(f"J'ai trouvé ! C'est un {candidate} ! 🎉")
            return
        else:
            # ... (gestion du "non", ajout, etc. – tu peux garder ton code existant ici)
            real_animal = input("Quel était l'animal auquel vous pensiez ? ").strip().lower()
            if real_animal in kb.animals:
                ask_discriminating_feature(kb, real_animal, candidate)
            else:
                kb.add_animal(real_animal, answers)
                print(f"Animal '{real_animal}' ajouté.")
    else:
        print(f"\nJe n'arrive pas à deviner précisément. Restants : {len(candidates)}")
        for c in sorted(candidates):
            print(f"- {c}")
    
    add_new_animal(kb)

def main_menu():
    kb = KnowledgeBase()
    while True:
        print("\n--- MENU PRINCIPAL ---")
        print("1. Jouer")
        print("2. Voir les animaux")
        print("3. Ajouter un animal")
        print("4. Modifier un animal")
        print("5. Supprimer un animal")
        print("6. Voir les caractéristiques")
        print("7. Ajouter une caractéristique")
        print("8. Modifier une caractéristique")
        print("9. Supprimer une caractéristique")
        print("10. Voir les détails des animaux")  # V0.2.1 NOUVELLE OPTION
        print("0. Quitter")

        choice = input("Choisissez une option : ").strip()
        if choice == "1":
            guess_animal(kb)
        elif choice == "2":
            list_animals(kb)
        elif choice == "3":
            add_new_animal(kb)
        elif choice == "4":
            modify_animal(kb)
        elif choice == "5":
            remove_animal(kb)
        elif choice == "6":
            list_features(kb)
        elif choice == "7":
            add_feature(kb)
        elif choice == "8":
            modify_feature(kb)
        elif choice == "9":
            remove_feature(kb)
        elif choice == "10":
            show_animal_details(kb)            
        elif choice == "0":
            print("Au revoir !")
            break
        else:
            print("Option invalide, veuillez réessayer.")


if __name__ == "__main__":
    main_menu()
