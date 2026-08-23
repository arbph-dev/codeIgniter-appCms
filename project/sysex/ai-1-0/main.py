import tkinter as tk
from tkinter import messagebox
from Faits import Faits

from Fait import Fait
from Regles import Regles

# Déclaration de la variable globale label_sortie
label_sortie = None

def old_executer_diagnostic():
    # Code pour exécuter le diagnostic et obtenir les résultats
    # ...

# Affichage des résultats dans le label de sortie
    fait_pile = Fait("Pile", connu=True, valeur="OK")
    fait_interrupteur = Fait("Interrupteur", connu=True, valeur="Fermé")
    fait_lampe = Fait("Lampe", connu=True, valeur="Éteinte")
    fait_circuit = Fait("Circuit", connu=True, valeur="Incomplet")

    faits = Faits([fait_pile, fait_interrupteur, fait_lampe, fait_circuit])

    #label_sortie.config(text=str(fait_lampe)) #    print(fait_lampe)
    label_sortie.config(text=str(faits)) #    label_sortie.config(text=str(fait_lampe))

def executer_diagnostic():
    # Création des objets Faits et Regles
    fait_u = Fait("U", connu=True, unite='V', valeur=12)
    fait_i = Fait("I", connu=True, unite='A', valeur=10)
    fait_r = Fait("R")
    fait_p = Fait("P")

    # faits = Faits([fait_u, fait_i, fait_r, fait_p])
    faits = Faits( { fait_u, fait_i, fait_r, fait_p } )

    regles = Regles()

    # Ajout des règles
    regles.ajouter_regle(['U', 'I'], ['R'])
    regles.ajouter_regle(['U', 'R'], ['P'])
    regles.ajouter_regle(['R', 'I'], ['P'])

    # Application des règles aux faits
    regles.appliquer_regles(faits)

    # Affichage des résultats finaux
    label_sortie.config(text=str(faits.get("R")))







def creer_interface():
    global label_sortie  # Utilisation de la variable globale label_sortie

    # Création de la fenêtre principale
    fenetre = tk.Tk()

    # Calcul de la hauteur de la fenêtre
    hauteur_ecran = fenetre.winfo_screenheight()
    hauteur_fenetre = hauteur_ecran // 2

    # Positionnement de la fenêtre en haut de l'écran
    fenetre.geometry(f"800x{hauteur_fenetre}+{(fenetre.winfo_screenwidth() - 800) // 2}+0")

    # Label et champ de saisie
    label_saisie = tk.Label(fenetre, text="Saisir les informations :")
    label_saisie.pack()

    champ_saisie = tk.Entry(fenetre)
    champ_saisie.pack()



    # Bouton d'exécution
    bouton_executer = tk.Button(fenetre, text="Exécuter", command=executer_diagnostic)
    bouton_executer.pack()

    # Label de sortie
    label_sortie = tk.Label(fenetre, text="Résultats :")
    label_sortie.pack()

    # Lancement de la boucle principale de l'interface Tkinter
    fenetre.mainloop()

# Programme principal
if __name__ == "__main__":
    # Création de l'interface graphique
    creer_interface()