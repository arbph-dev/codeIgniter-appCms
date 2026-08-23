knowledge_base = {
    "tigre": {
        "ailes": False,
        "plumes": False,
        "crie": "rugit"
    },
    "merle": {
        "ailes": True,
        "plumes": True,
        "crie": "chante"
    }
}

def pose_question(caracteristique):
    # Pose une question à l'utilisateur
    reponse = input("L'animal a-t-il {} ? (oui/non) ".format(caracteristique))
    return reponse.lower() == "oui"

def ajouter_animal():
    # Ajoute un nouvel animal à la base de connaissances
    print("Je ne connais pas cet animal. Veuillez fournir des informations à son sujet.")
    nom_animal = input("Quel est le nom de l'animal dont vous pensez ? ")
    knowledge_base[nom_animal] = {}
    print("Merci ! Maintenant, veuillez fournir quelques caractéristiques sur cet animal.")
    for caracteristique in knowledge_base[list(knowledge_base.keys())[0]].keys():
        valeur = input("L'animal {} a-t-il {} ? (oui/non) ".format(nom_animal, caracteristique))
        knowledge_base[nom_animal][caracteristique] = valeur.lower() == "oui"
    print("Les caractéristiques de l'animal ont été enregistrées dans la base de connaissances.")

def deviner_animal():
    # Commence le jeu de devinette
    print("Pensez à un animal ou un objet, et je vais essayer de deviner !")
    print("Répondez aux questions suivantes en utilisant 'oui' ou 'non'.")
    print("-------------------------------------------------------------")

    animal_trouve = False

    while not animal_trouve:
        propositions_possibles = []
        for animal, caracteristiques in knowledge_base.items():
            if all(pose_question(caracteristique) == valeur for caracteristique, valeur in caracteristiques.items()):
                propositions_possibles.append(animal)

        if len(propositions_possibles) == 0:
            ajouter_animal()
            animal_trouve = True
        elif len(propositions_possibles) == 1:
            proposition = propositions_possibles[0]
            reponse = input("Est-ce que l'animal dont vous pensez est {} ? (oui/non) ".format(proposition))
            if reponse.lower() == "oui":
                print("J'ai trouvé ! C'est {}.".format(proposition))
                animal_trouve = True
        else:
            print("Je pense que l'animal dont vous pensez peut être parmi ces options :")
            for proposition in propositions_possibles:
                print(proposition)
            print("Veuillez répondre aux questions suivantes pour affiner votre choix.")

    recommencer = input("Voulez-vous recommencer le jeu ? (oui/non) ")
    if recommencer.lower() == "oui":
        deviner_animal()

if __name__ == "__main__":
    deviner_animal()
