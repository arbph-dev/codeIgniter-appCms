On reprend les différentes fonctions

# Audit

## Structure 

```
XXpertSystem\ui\console.py
XXpertSystem\ui\__init__.py
XXpertSystem\game\akinator_old.py
XXpertSystem\game\akinator.py
XXpertSystem\game\__init__.py
XXpertSystem\core\user.py
XXpertSystem\core\inference.py
XXpertSystem\core\database.py
XXpertSystem\core\__init__.py
XXpertSystem\main.py
```

```
XXpertSystem\relics\ui\console.py
XXpertSystem\relics\ui\__init__.py
XXpertSystem\relics\game\akinator_old.py
XXpertSystem\relics\game\akinator.py
XXpertSystem\relics\game\__init__.py
XXpertSystem\relics\core\working_memory.py
XXpertSystem\relics\core\user.py
XXpertSystem\relics\core\inference.py
XXpertSystem\relics\core\database.py
XXpertSystem\relics\core\database copy.py
XXpertSystem\relics\core\__init__.py
XXpertSystem\relics\main.py
```

## couche ui 
on emploie à différents endroits, il faut séparer les couches ui et app
- rich à ajouter au référentiel
- des fonctions de présentation



```
# main.py
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.prompt import Prompt, Confirm, IntPrompt

# ui/console.py
from rich.console import Console
from rich.table import Table
from rich.tree import Tree
from rich.panel import Panel
from rich.prompt import Prompt, Confirm
from rich.live import Live
from rich.layout import Layout

```

```
from ui.console import show_tree, select_list, show_properties
```

## couche db 
trop imbriqué a exploser, retoruver sqlalchemy et cqrs
```
from core.database import KnowledgeBase
```

## couche métiers
```

from game.akinator import play
```



## couche application
```python
# main.py



console = Console()

def main():
    kb = KnowledgeBase()
    console.print(Panel("[bold blue]XXPERT SYSTEM v6.0 – Modular Edition[/]", style="blue"))

# main.py - Boucle principale complète avec toutes les options 1-10

    while True:
        try:
            table = Table.grid(padding=1)
            table.add_column(style="cyan", justify="right")
            table.add_column(style="green")
            table.add_row("1", "Jouer au jeu Akinator")
            table.add_row("2", "Lister les classes (arbre hiérarchique)")
            table.add_row("3", "Ajouter une classe")
            table.add_row("4", "Ajouter une propriété")
            table.add_row("5", "Ajouter une instance (+ saisie props)")
            table.add_row("6", "Lister toutes les propriétés")
            table.add_row("7", "Lister les instances d'une classe")
            table.add_row("8", "Voir les propriétés d'une classe (héritées incluses)")
            table.add_row("9", "Lier une propriété à une classe")
            table.add_row("10","Saisir une valeur de propriété pour une instance")
            
            table.add_row("11", "Voir les seuils (LL/L/M/H/HH) d'une propriété")
            table.add_row("12", "Définir manuellement les seuils d'une propriété")
            
            table.add_row("13", "Inférence Forward sur une instance")
            table.add_row("14", "Inférence Backward (prouver un objectif)")                        

            table.add_row("0", "Quitter")

            console.print(Panel(table, title="[bold magenta]MENU PRINCIPAL[/bold magenta]", border_style="bright_blue"))

            choice = Prompt.ask("[bold cyan]Votre choix[/bold cyan]", 
                                choices=["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14"], 
                                default="1")

            if choice == "1":
                classes = kb.get_all_class_names()
                if not classes:
                    console.print(Panel("Aucune classe disponible", style="red"))
                    continue
                cls = select_list(classes, "Choisissez la classe pour jouer")
                if cls:
                    play(kb, cls)

            elif choice == "2":
                show_tree(kb)

            elif choice == "3":
                name = Prompt.ask("[cyan]Nom de la classe[/cyan]").strip()
                if not name:
                    console.print("[red]Nom invalide[/]")
                    continue
                parent = select_list(kb.get_all_class_names(), "Classe parente (facultatif)")
                if kb.add_class(name, parent):
                    console.print("[green]Classe ajoutée avec succès[/]")

            elif choice == "4":
                name = Prompt.ask("[cyan]Nom de la propriété[/cyan]").strip()
                if not name:
                    console.print("[red]Nom invalide[/]")
                    continue
                ptype = Prompt.ask("[cyan]Type[/cyan]", choices=["string","bool","int","float","date"], default="string")
                if kb.add_property(name, ptype):
                    console.print("[green]Propriété ajoutée avec succès[/]")

            elif choice == "5":  # Ajouter instance + saisie props
                classes = kb.get_all_class_names()
                if not classes:
                    console.print(Panel("Aucune classe disponible", style="red"))
                    continue
                cls = select_list(classes, "Classe pour la nouvelle instance")
                if not cls:
                    continue
                name = Prompt.ask("[cyan]Nom de l'instance[/cyan]").strip()
                if not name:
                    console.print("[red]Nom invalide[/]")
                    continue
                name = name.capitalize()
                if kb.add_instance(name, cls):
                    if Confirm.ask("[cyan]Saisir les propriétés maintenant ?[/cyan]", default=True):
                        kb.ask_and_set_properties(name, cls)

            elif choice == "6":
                props = kb.get_all_property_names()
                if not props:
                    console.print(Panel("Aucune propriété définie", style="yellow"))
                else:
                    table = Table(title="=== PROPRIÉTÉS GLOBALES ===")
                    table.add_column("Nom", style="cyan")
                    table.add_column("Type", style="yellow")
                    for p in props:
                        table.add_row(p, kb.get_property_type(p) or "?")
                    console.print(table)

            elif choice == "7":
                cls = select_list(kb.get_all_class_names(), "Classe à inspecter")
                if cls:
                    instances = kb.get_all_instances(cls)
                    if not instances:
                        console.print(Panel("Aucune instance", style="yellow"))
                    else:
                        table = Table(title=f"Instances de [green]{cls}[/]")
                        table.add_column("Nom", style="cyan")
                        for i in instances:
                            table.add_row(i)
                        console.print(table)

            elif choice == "8":
                cls = select_list(kb.get_all_class_names(), "Classe à analyser")
                if cls:
                    props = kb.get_all_props_for_class(cls)
                    if not props:
                        console.print(Panel("Aucune propriété héritée", style="yellow"))
                    else:
                        table = Table(title=f"Propriétés héritées de [green]{cls}[/]")
                        table.add_column("Propriété", style="cyan")
                        table.add_column("Type", style="yellow")
                        for p in props:
                            table.add_row(p, kb.get_property_type(p) or "?")
                        console.print(table)

            elif choice == "9":
                cls = select_list(kb.get_all_class_names(), "Classe cible")
                if not cls:
                    continue
                prop = select_list(kb.get_all_property_names(), "Propriété à lier")
                if prop:
                    kb.link_property_to_class(cls, prop)

            elif choice == "10":
                cls = select_list(kb.get_all_class_names(), "Classe")
                if not cls:
                    continue
                insts = kb.get_all_instances(cls)
                if not insts:
                    console.print(Panel("Aucune instance dans cette classe", style="yellow"))
                    continue
                inst = select_list(insts, f"Instances de {cls}")
                if not inst:
                    continue
                props = kb.get_all_props_for_class(cls)
                if not props:
                    console.print(Panel("Aucune propriété disponible", style="yellow"))
                    continue
                prop = select_list(props, "Propriété à modifier")
                if not prop:
                    continue
                current = kb.get_instance_value(inst, cls, prop)
                console.print(f"Valeur actuelle : [yellow]{current if current is not None else 'inconnue'}[/]")
                val_str = Prompt.ask(f"[cyan]Nouvelle valeur[/cyan] (X pour inconnu)")
                val = None if val_str.upper() == "X" else val_str
                if val is not None:
                    ptype = kb.get_property_type(prop)
                    try:
                        if ptype == "bool":
                            val = val.lower() in ("true", "vrai", "oui", "o", "1")
                        elif ptype == "int":
                            val = int(val)
                        elif ptype == "float":
                            val = float(val)
                    except ValueError:
                        console.print(f"[red]Format invalide pour le type {ptype}[/]")
                        continue
                if kb.set_instance_value(inst, cls, prop, val):
                    console.print("[green]Valeur mise à jour avec succès[/]")

            elif choice == "11":
                cls = select_list(kb.get_all_class_names(), "Classe")
                if cls:
                    props = [p for p in kb.get_all_props_for_class(cls) if kb.get_property_type(p) in ("int", "float")]
                    prop = select_list(props, "Propriété numérique")
                    if prop:
                        th = kb.get_thresholds(cls, prop)
                        if th and any(th.values()):
                            table = Table(title=f"Seuils pour [green]{prop}[/] dans [green]{cls}[/]")
                            table.add_column("Seuil", style="bold")
                            table.add_column("Valeur", style="cyan")
                            table.add_column("Source", style="yellow")
                            for k in ["LL", "L", "M", "H", "HH"]:
                                val = th[k]
                                source = "manuel" if k in ["LL","L","H","HH"] and val == kb.get_thresholds(cls, prop)[k] else "auto-appris"
                                table.add_row(k, str(val) if val is not None else "-", source)
                            console.print(table)
                        else:
                            console.print(Panel("Pas de données ou seuils définis", style="yellow"))

            elif choice == "12":
                cls = select_list(kb.get_all_class_names(), "Classe")
                if cls:
                    props = [p for p in kb.get_all_props_for_class(cls) if kb.get_property_type(p) in ("int", "float")]
                    prop = select_list(props, "Propriété numérique")
                    if prop:
                        console.print("[cyan]Laissez vide pour garder auto-appris[/]")
                        ll = Prompt.ask("LL (very low)", default="")
                        l = Prompt.ask("L (low)", default="")
                        h = Prompt.ask("H (high)", default="")
                        hh = Prompt.ask("HH (very high)", default="")
                        vals = {}
                        for s, v in {"ll": ll, "l": l, "h": h, "hh": hh}.items():
                            vals[s] = float(v) if v else None
                        kb.set_manual_thresholds(cls, prop, vals["ll"], vals["l"], vals["h"], vals["hh"])
                        console.print("[green]Seuils manuels enregistrés[/]")

            elif choice == "13":
                cls = select_list(kb.get_all_class_names(), "Classe")
                if cls:
                    insts = kb.get_all_instances(cls)
                    inst = select_list(insts, "Instance à analyser")
                    if inst:
                        kb.forward_engine.execute(inst, cls)

            elif choice == "14":
                cls = select_list(kb.get_all_class_names(), "Classe")
                if cls:
                    insts = kb.get_all_instances(cls)
                    inst = select_list(insts, "Instance cible")
                    if inst:
                        props = kb.get_all_props_for_class(cls)
                        objective = select_list(props, "Objectif à prouver")
                        if objective:
                            kb.backward_engine.prove(objective, inst, cls)

            elif choice == "0":
                kb.close()
                console.print(Panel("[bold green]Au revoir ! Merci d'utiliser XXpertSystem 🚀[/bold green]", style="green"))
                break

        except KeyboardInterrupt:
            console.print("\n[red]Interruption utilisateur[/]")
            if Confirm.ask("Quitter l'application ?"):
                kb.close()
                break
        except Exception as e:
            console.print(f"[bold red]Erreur inattendue : {e}[/]")
            console.print("L'application continue...")

if __name__ == "__main__":
    main()
```
