class KnowledgeBase:
    def __init__(self):
        self.features = ["ailes", "plumes", "crie"]
        self.animals = {
            "tigre": {"ailes": False, "plumes": False, "crie": "rugit"},
            "merle": {"ailes": True, "plumes": True, "crie": "chante"}
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
        answer = input(question + " (oui/non) ").strip().lower()
        if answer in ("oui", "non"):
            return answer == "oui"
        print("Réponse invalide, veuillez répondre par 'oui' ou 'non'.")


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


def ask_discriminating_feature(kb, known_animal, wrong_animal):
    print(f"Je n'ai pas réussi à deviner. Quelle caractéristique différencie un {known_animal} d'un {wrong_animal} ?")
    new_feat = input("Nom de la caractéristique : ").strip().lower()
    kb.add_feature(new_feat)
    val_known = ask_value(f"Valeur de '{new_feat}' pour un {known_animal} :")
    val_wrong = ask_value(f"Valeur de '{new_feat}' pour un {wrong_animal} :")
    kb.set_feature_value(known_animal, new_feat, val_known)
    kb.set_feature_value(wrong_animal, new_feat, val_wrong)
    print(f"Caractéristique '{new_feat}' ajoutée et renseignée.")


def guess_animal(kb):
    print("Pensez à un animal, je vais essayer de deviner.")
    answers = {}
    for feat in kb.features:
        sample_val = None
        for animal in kb.animals:
            val = kb.get_feature_value(animal, feat)
            if val is not None:
                sample_val = val
                break
        if isinstance(sample_val, bool) or sample_val is None:
            answers[feat] = ask_yes_no(f"L'animal a-t-il {feat} ?")

    candidates = kb.find_candidates(answers)

    if not candidates:
        add_new_animal(kb)
    elif len(candidates) == 1:
        candidate = candidates[0]
        if ask_yes_no(f"Est-ce que l'animal est un {candidate} ?"):
            print(f"J'ai trouvé ! C'est un {candidate}.")
        else:
            add_new_animal(kb)
            wrong_animal = input("Quel était l'animal auquel vous pensiez ? ").strip().lower()
            if wrong_animal in kb.animals:
                ask_discriminating_feature(kb, wrong_animal, candidate)
            else:
                print("Cet animal n'est pas dans la base, il a été ajouté.")
    else:
        print("Plusieurs animaux correspondent :")
        for c in candidates:
            print(f"- {c}")
        print("Je ne peux pas deviner précisément. Veuillez ajouter l'animal si besoin.")
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
        elif choice == "0":
            print("Au revoir !")
            break
        else:
            print("Option invalide, veuillez réessayer.")


if __name__ == "__main__":
    main_menu()
