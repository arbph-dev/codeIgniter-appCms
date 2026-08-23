# game/akinator.py - Version corrigée (affichage propre avec Live)

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.live import Live
from rich.prompt import Prompt, Confirm
from ui.console import select_list

console = Console()

def ask_yes_no(question):
    while True:
        ans = Prompt.ask(f"[bold cyan]{question}[/] (oui/o / non/n / X inconnu)", default="o").strip().lower()
        if ans in ("oui", "o", "yes", "y", "1"):
            return True
        if ans in ("non", "n", "no", "0"):
            return False
        if ans in ("x", "inconnu", ""):
            return None
        console.print("[red]Répondez par oui/o, non/n ou X[/red]")

def play(kb, class_name):
    instances = kb.get_all_instances(class_name)
    if not instances:
        console.print(Panel("Aucune instance connue dans cette classe", style="red"))
        return

    console.print(Panel(f"Pensez à une instance de la classe [bold green]{class_name}[/]", style="bold cyan"))
    console.print("[dim]Appuyez sur Entrée quand vous êtes prêt...[/dim]")
    input()

    candidates = instances[:]

    # Boucle principale
    while len(candidates) > 1:
        # === Affichage du tableau live des candidats ===
        table = Table(title=f"[bold yellow]Candidats restants : {len(candidates)}[/]")
        table.add_column("Instance", style="green")
        for c in sorted(candidates):
            table.add_row(c)
        console.print(table)

        # === Génération des questions ===


        # Génération questions
        questions = []
        props = kb.get_all_props_for_class(class_name)

        for prop in props:
            values = []
            known_count = 0
            for inst in candidates:
                val = kb.get_instance_value(inst, class_name, prop)
                if val is not None:
                    values.append(val)
                    known_count += 1

            if known_count == 0:
                continue  # Aucune donnée connue → inutile

            ptype = kb.get_property_type(prop)

            # 1. Booléennes
            if ptype == "bool":
                bool_values = [v for v in values if isinstance(v, bool)]
                if len(bool_values) >= 1 and len(set(bool_values)) > 1:
                    questions.append((prop, "bool", None))

            # 2. Numériques - CONDITIONS STRICTES
            elif ptype in ("int", "float"):
                if known_count < 2:
                    continue
                if len(set(values)) <= 1:  # Toutes les valeurs connues identiques
                    continue

                thresholds = kb.get_thresholds(class_name, prop)
                if thresholds and thresholds["M"] is not None:
                    # Vérifie que le seuil sépare au moins un candidat
                    above = sum(1 for v in values if v > thresholds["M"])
                    below = known_count - above
                    if above > 0 and below > 0:
                        questions.append((prop, "numeric_bound", thresholds["M"]))

            # 3. Text distinct
            elif ptype == "string":
                str_values = [v for v in values if isinstance(v, str)]
                if len(set(str_values)) > 1:
                    for val in set(str_values):
                        questions.append((prop, "text_distinct", val))


        if not questions:
            console.print(Panel("[bold yellow]Plus de question discriminante disponible[/]", style="yellow"))
            break

        # Choix de la question (priorité bool > numeric > text)
        chosen = None
        for q in questions:
            if q[1] == "bool":
                chosen = q
                break
        if not chosen:
            for q in questions:
                if q[1] == "numeric_bound":
                    chosen = q
                    break
        if not chosen:
            chosen = questions[0]

        prop, qtype, extra = chosen

        if qtype == "bool":
            question = f"L'instance a-t-elle {prop} ?"
        elif qtype == "numeric_bound":
            question = f"{prop} est-elle supérieure à {extra:.2f} ?"
        else:
            pretty = extra.replace("_", " ")
            question = f"{prop} est-il '{pretty}' ?"

        # === Pose la question (hors live pour visibilité) ===
        console.print(Panel(question, title="[bold magenta]Question[/]", style="bold magenta"))
        response = ask_yes_no(question)

        if response is None:
            console.print("[dim]Réponse inconnue → je garde tous les candidats possibles[/dim]")
            continue

        # === Filtrage ===
        new_candidates = []
        for inst in candidates:
            val = kb.get_instance_value(inst, class_name, prop)
            keep = False

            if qtype == "bool":
                keep = (val is None or val == response)
            elif qtype == "numeric_bound":
                if val is None:
                    keep = True  # on ne peut pas éliminer
                else:
                    keep = (val > extra) == response
            elif qtype == "text_distinct":
                keep = (val == extra) == response

            if keep:
                new_candidates.append(inst)

        candidates = new_candidates

        if len(candidates) == 0:
            console.print("[red]Aucun candidat compatible → contradiction ?[/red]")
            break

    # === Fin du jeu ===
    console.print(Panel(f"[bold green]Fin du filtrage : {len(candidates)} candidat(s) restant(s)[/]", style="green"))

    if len(candidates) == 1:
        guess = candidates[0]
        if ask_yes_no(f"Est-ce [bold green]{guess}[/] ?"):
            console.print(Panel("[bold green]J'AI GAGNÉ ! 🎉🎉🎉[/]", style="green"))
            return
        else:
            console.print("[yellow]Raté... Apprenons ensemble ![/yellow]")

    # === Phase d'apprentissage ===
    real_name = Prompt.ask("[bold cyan]À quoi pensiez-vous vraiment ?[/bold cyan]").strip()
    if not real_name:
        return

    real_name = real_name.capitalize()

    if real_name not in instances:
        kb.add_instance(real_name, class_name)
        console.print(f"[green]Nouvelle instance '{real_name}' ajoutée[/]")

    console.print(Panel(f"[bold magenta]Saisie des propriétés pour [green]{real_name}[/]\n(C'est essentiel pour m'améliorer !)[/bold magenta]", style="magenta"))
    kb.ask_and_set_properties(real_name, class_name)

    if len(candidates) == 1:
        wrong = candidates[0]
        if Confirm.ask(f"Voulez-vous ajouter une propriété qui distingue {real_name} de {wrong} ?"):
            new_prop = Prompt.ask("[cyan]Nom de la nouvelle propriété[/cyan]").strip().lower()
            if new_prop and not kb.get_property_id(new_prop):
                ptype = Prompt.ask("[cyan]Type[/cyan]", choices=["string","bool","int","float","date"], default="bool")
                kb.add_property(new_prop, ptype)
                kb.link_property_to_class(class_name, new_prop)

            # Saisie intelligente
            if ptype == "bool":
                val_str = Prompt.ask(f"[cyan]Valeur pour {real_name}[/] ? (oui/true / non/false / X inconnu)", default="oui")
                if val_str.upper() == "X":
                    val_real = None
                    val_wrong = None
                else:
                    val_real = val_str.lower() in ("true", "vrai", "oui", "o", "yes", "y", "1")
                    val_wrong = not val_real  # Inférence logique !
                kb.set_instance_value(real_name, class_name, new_prop, val_real)
                kb.set_instance_value(wrong, class_name, new_prop, val_wrong)
                console.print(f"[green]Valeur opposée inférée pour {wrong}[/]")

            # 2. Numérique avec seuil auto - SEULEMENT si assez de données connues
            elif ptype in ("int", "float"):
                known_ratio = known_count / len(candidates) if candidates else 0
                if known_ratio >= 0.5:  # Au moins 50% connus
                    thresholds = kb.get_thresholds(class_name, prop)
                    if thresholds and thresholds["M"] is not None:
                        questions.append((prop, "numeric_bound", thresholds["M"]))
            else:
                # Pour non-bool : saisie manuelle des deux
                val_real = Prompt.ask(f"Valeur pour {real_name} ? (X inconnu)")
                val_wrong = Prompt.ask(f"Valeur pour {wrong} ? (X inconnu)")
                v_r = None if val_real.upper() == "X" else val_real
                v_w = None if val_wrong.upper() == "X" else val_wrong
                kb.set_instance_value(real_name, class_name, new_prop, v_r)
                kb.set_instance_value(wrong, class_name, new_prop, v_w)

    console.print(Panel("[bold green]Merci infiniment pour cet apprentissage ! Je deviens plus intelligent grâce à vous 😊[/]", style="green"))
