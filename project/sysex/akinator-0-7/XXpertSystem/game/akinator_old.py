# game/akinator.py
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.live import Live
from rich.prompt import Prompt
from ui.console import select_list

console = Console()

def ask_yes_no(question):
    while True:
        ans = Prompt.ask(f"[cyan]{question}[/] (o/n/x)", default="o").lower()
        if ans in ("o", "oui", "y", "yes"):
            return True
        if ans in ("n", "non", "no"):
            return False
        if ans in ("x", ""):
            return None

def play(kb, class_name):
    instances = kb.get_all_instances(class_name)
    if not instances:
        console.print(Panel("Aucune instance connue", style="red"))
        return

    console.print(Panel(f"Pensez à une instance de [bold green]{class_name}[/]", style="bold cyan"))
    input("Appuyez sur Entrée quand prêt...")

    candidates = instances[:]

    with Live(console=console, refresh_per_second=4) as live:
        while len(candidates) > 1:
            table = Table(title=f"Candidats restants : {len(candidates)}")
            table.add_column("Instance", style="green")
            for c in sorted(candidates):
                table.add_row(c)
            live.update(table)

            props = kb.get_all_props_for_class(class_name)
            questions = []
            for prop in props:
                values = [kb.get_instance_value(i, class_name, prop) for i in candidates if kb.get_instance_value(i, class_name, prop) is not None]
                if not values:
                    continue
                if all(isinstance(v, bool) for v in values) and len(set(values)) > 1:
                    questions.append((prop, "bool"))
                elif all(isinstance(v, str) for v in values) and len(set(values)) > 1:
                    for v in set(values):
                        questions.append((prop, f"{prop} = {v}"))

            if not questions:
                console.print("[yellow]Plus de question discriminante[/]")
                break

            # Priorité bool
            q = next((q for q in questions if q[1] == "bool"), questions[0])
            prop = q[0] if isinstance(q, tuple) and q[1] == "bool" else q[0].split("=")[0].strip()
            response = ask_yes_no(f"L'instance a-t-elle {q} ?")

            if response is None:
                continue

            new_cand = []
            for inst in candidates:
                val = kb.get_instance_value(inst, class_name, prop)
                keep = True
                if "bool" in str(q):
                    keep = val is None or val == response
                else:
                    target = q.split("=")[1].strip()
                    keep = val == target if response else val != target
                if keep:
                    new_cand.append(inst)
            candidates = new_cand

        live.update(Panel("[bold green]Fin du filtrage[/]", style="green"))

    if len(candidates) == 1:
        guess = candidates[0]
        if ask_yes_no(f"Est-ce [bold]{guess}[/] ?"):
            console.print(Panel("[bold green]J'AI GAGNÉ ! 🎉[/]", style="green"))
            return
        console.print("[yellow]Perdu cette fois...[/]")

    # Apprentissage
    real = Prompt.ask("[cyan]À quoi pensiez-vous ?[/cyan]")
    if real and real not in instances:
        kb.add_instance(real, class_name)
        console.print("[green]Nouvelle instance ajoutée, merci pour l'apprentissage ![/]")