# ui/console.py
from rich.console import Console
from rich.table import Table
from rich.tree import Tree
from rich.panel import Panel
from rich.prompt import Prompt, Confirm
from rich.live import Live
from rich.layout import Layout

console = Console()

def show_tree(kb):
    data = kb.get_hierarchy()
    if not data:
        console.print(Panel("Aucune classe", style="yellow"))
        return
    tree = Tree("[bold blue]=== CLASSES ===[/]")
    nodes = {}
    for cid, name, pid, level in data:
        props = len(kb.get_all_props_for_class(name))
        insts = len(kb.get_all_instances(name))
        label = f"[green]{name}[/] — {props} props — {insts} inst."
        if pid is None:
            node = tree.add(label)
        else:
            parent_node = nodes[pid]
            node = parent_node.add(label)
        nodes[cid] = node
    console.print(tree)

def select_list(items, title):
    if not items:
        console.print(Panel("Liste vide", style="yellow"))
        return None
    table = Table(title=title)
    table.add_column("N°", style="cyan")
    table.add_column("Item", style="green")
    for i, item in enumerate(items, 1):
        table.add_row(str(i), item)
    console.print(table)
    while True:
        ch = Prompt.ask("Numéro (0 annuler)", default="0")
        if ch == "0":
            return None
        if ch.isdigit() and 1 <= int(ch) <= len(items):
            return items[int(ch)-1]
        console.print("[red]Invalide[/]")

def show_properties(props, title):
    table = Table(title=title)
    table.add_column("Propriété", style="cyan")
    for p in props:
        table.add_row(p)
    console.print(table)
