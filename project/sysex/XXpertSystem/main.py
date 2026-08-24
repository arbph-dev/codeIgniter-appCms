"""
main.py  —  version EventBus
Principe : le menu publish() des intentions, les features subscribe() et agissent.
Aucune logique métier ici — uniquement le routing des choix utilisateur vers le bus.

Pattern identique au JS :
    bus.publish('naf:search', { q: 'immobilier' })
    bus.publish('omdb:search', { q: 'Dune' })
    bus.publish('akinator:forward', { inst: 'Henaff', cls: 'Entreprise' })
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.auth import CredentialsStore

from rich.console import Console
from rich.panel   import Panel
from rich.table   import Table
from rich.prompt  import Prompt, Confirm

from core.event_bus import bus                          # bus global
from core.database  import KnowledgeBase
from core.inference import ForwardEngine, BackwardEngine
from core.rules     import load_rules

# ── Features : import des init functions ──────────────────────────────────────
from features.omdb.controller    import init_omdb_controller
from features.omdb.renderer      import init_omdb_renderer
from features.codenaf.controller import init_codenaf_controller
from features.codenaf.renderer   import init_codenaf_renderer
# from features.formejuridique.controller import init_fj_controller
# from features.formejuridique.renderer   import init_fj_renderer
# from features.insee.controller          import init_insee_controller
# from features.inpi.controller           import init_inpi_controller

console = Console()


# ─────────────────────────────────────────────────────────────────────────────
# AppController — akinator (inchangé, mais s'abonne aussi au bus)
# ─────────────────────────────────────────────────────────────────────────────

class AppController:

    def __init__(self, kb: KnowledgeBase):
        self.kb      = kb
        self.forward  = ForwardEngine(kb)
        self.backward = BackwardEngine(kb)
        load_rules(kb, self.forward)

        # S'abonne aux événements akinator
        bus.subscribe("akinator:forward",  self._on_forward)
        bus.subscribe("akinator:backward", self._on_backward)
        bus.subscribe("akinator:tree",     lambda _: self.show_tree())
        bus.subscribe("akinator:classes",  lambda _: self.show_classes())

        console.print(Panel(
            f"[green]{len(self.forward.rules)} règle(s) chargée(s)[/]",
            style="green"
        ))

    def _on_forward(self, payload):
        inst = payload.get("inst")
        cls  = payload.get("cls")
        if inst and cls:
            self.forward.execute(inst, cls)

    def _on_backward(self, payload):
        inst      = payload.get("inst")
        cls       = payload.get("cls")
        objective = payload.get("objective")
        if inst and cls and objective:
            self.backward.prove(objective, inst, cls)

    def show_tree(self):
        from rich.tree import Tree
        data = self.kb.get_hierarchy()
        if not data:
            console.print(Panel("Aucune classe", style="yellow"))
            return
        tree  = Tree("[bold blue]Ontologie[/bold blue]")
        nodes = {}
        for cid, name, pid, level in data:
            props = len(self.kb.get_all_props_for_class(name))
            insts = len(self.kb.get_all_instances(name))
            label = f"[green]{name}[/]  [dim]{props} props — {insts} inst.[/]"
            node  = nodes.get(pid, tree).add(label) if pid else tree.add(label)
            nodes[cid] = node
        console.print(tree)

    def show_classes(self):
        classes = self.kb.get_all_class_names()
        if not classes:
            console.print(Panel("Aucune classe", style="yellow"))
            return
        table = Table(title="Classes")
        table.add_column("Classe",        style="green")
        table.add_column("Nb propriétés", justify="right")
        table.add_column("Nb instances",  justify="right")
        for cls in classes:
            props = len(self.kb.get_all_props_for_class(cls))
            insts = len(self.kb.get_all_instances(cls))
            table.add_row(cls, str(props), str(insts))
        console.print(table)

    def show_class_properties(self, class_name: str):
        props = self.kb.get_all_props_for_class(class_name)
        table = Table(title=f"Propriétés de {class_name}", show_lines=True)
        table.add_column("Propriété", style="cyan")
        table.add_column("Type",      style="green")
        for prop in props:
            table.add_row(prop, self.kb.get_property_type(prop) or "?")
        console.print(table)

    def show_instances(self, class_name: str):
        instances = self.kb.get_all_instances(class_name)
        if not instances:
            console.print(Panel(f"Aucune instance dans '{class_name}'", style="yellow"))
            return
        props = self.kb.get_all_props_for_class(class_name)
        table = Table(title=f"Instances — {class_name}", show_lines=True)
        table.add_column("Nom", style="cyan", width=25)
        for p in props:
            table.add_column(p, width=14)
        for inst in instances:
            row = [inst] + [
                "" if (v := self.kb.get_instance_value(inst, class_name, p)) is None
                else str(v)
                for p in props
            ]
            table.add_row(*row)
        console.print(table)

    def show_rules(self):
        self.forward.list_rules()

    def add_class(self):
        name   = Prompt.ask("[cyan]Nom de la classe[/]")
        parent = self._select_class("Classe parente (0 = aucune)")
        self.kb.add_class(name, parent)

    def add_property(self):
        name  = Prompt.ask("[cyan]Nom de la propriété[/]").lower()
        ptype = Prompt.ask("[cyan]Type[/]",
                           choices=["string", "bool", "int", "float", "date"],
                           default="string")
        self.kb.add_property(name, ptype)

    def add_instance(self):
        cls = self._select_class("Classe de l'instance")
        if not cls:
            return
        name = Prompt.ask(f"[cyan]Nom de l'instance ({cls})[/]")
        if self.kb.add_instance(name, cls):
            if Confirm.ask("Saisir les propriétés maintenant ?", default=True):
                self.kb.ask_and_set_properties(name, cls)
            if Confirm.ask("Lancer l'inférence Forward ?", default=True):
                bus.publish("akinator:forward", {"inst": name, "cls": cls})

    def _select_class(self, title: str = "Classe") -> str | None:
        return self._select_from_list(self.kb.get_all_class_names(), title)

    def _select_from_list(self, items: list, title: str) -> str | None:
        if not items:
            console.print("[yellow]Liste vide[/]")
            return None
        table = Table(title=title)
        table.add_column("N°",     style="cyan", width=4)
        table.add_column("Élément",style="green")
        for i, item in enumerate(items, 1):
            table.add_row(str(i), item)
        console.print(table)
        while True:
            ch = Prompt.ask("Numéro (0 annuler)", default="0")
            if ch == "0":
                return None
            if ch.isdigit() and 1 <= int(ch) <= len(items):
                return items[int(ch) - 1]
            console.print("[red]Invalide[/]")


# ─────────────────────────────────────────────────────────────────────────────
# Sous-menus API — simples wrappers qui publient sur le bus
# ─────────────────────────────────────────────────────────────────────────────

def menu_omdb():
    while True:
        console.print(Panel("[bold yellow]OMDB — Films[/]", border_style="yellow"))
        console.print("[cyan]1[/]  Rechercher un film")
        console.print("[cyan]0[/]  Retour")
        choice = Prompt.ask("Choix", choices=["0", "1"])
        if choice == "0":
            return
        if choice == "1":
            title = Prompt.ask("[cyan]Titre du film[/]")
            bus.publish("omdb:search", {"q": title})   # ← une seule ligne


def menu_codenaf():
    while True:
        console.print(Panel("[bold green]CodeNaf[/]", border_style="green"))
        console.print("[cyan]1[/]  Recherche par libellé")
        console.print("[cyan]2[/]  Autocomplete (like)")
        console.print("[cyan]3[/]  Hiérarchie d'un code")
        console.print("[cyan]0[/]  Retour")
        choice = Prompt.ask("Choix", choices=["0", "1", "2", "3"])
        if choice == "0":
            return
        if choice == "1":
            q = Prompt.ask("[cyan]Libellé[/]")
            bus.publish("naf:search", {"q": q})
        elif choice == "2":
            q = Prompt.ask("[cyan]Début de libellé[/] (min 2 car.)")
            bus.publish("naf:ui:like", {"q": q, "len": 10})
        elif choice == "3":
            code = Prompt.ask("[cyan]Code NAF[/]")
            bus.publish("naf:hierarchy", {"code": code})


def menu_api():
    while True:
        console.print(Panel("[bold cyan]APIs externes[/]", border_style="cyan"))
        console.print("[cyan]1[/]  OMDB")
        console.print("[cyan]2[/]  CodeNaf")
        console.print("[cyan]0[/]  Retour")
        choice = Prompt.ask("Choix", choices=["0", "1", "2"])
        if choice == "0":
            return
        if choice == "1":
            menu_omdb()
        elif choice == "2":
            menu_codenaf()


# ─────────────────────────────────────────────────────────────────────────────
# Bootstrap — enregistre toutes les features sur le bus global
# ─────────────────────────────────────────────────────────────────────────────

def bootstrap():
    """
    Miroir de l'import des initXxxController() dans app.js.
    On enregistre tous les controllers/renderers UNE SEULE FOIS au démarrage.
    """
    init_omdb_controller(bus)
    init_omdb_renderer(bus)
    init_codenaf_controller(bus)
    init_codenaf_renderer(bus)
    # init_fj_controller(bus)
    # init_fj_renderer(bus)
    # init_insee_controller(bus)
    # init_inpi_controller(bus)


# ─────────────────────────────────────────────────────────────────────────────
# Menu principal
# ─────────────────────────────────────────────────────────────────────────────

def main():
    console.print(Panel.fit(
        "[bold blue]XXPERT SYSTEM — Domaine Entreprise[/bold blue]\n"
        "[dim]Qualification structurelle + APIs[/dim]",
        style="bold blue"
    ))



    # 1. Bootstrap features (une seule fois)
    bootstrap()

    # 2. Akinator
    kb  = KnowledgeBase()
    app = AppController(kb)

    while True:
        col1 = Table.grid(padding=0)
        col1.add_column()
        col1.add_row("[cyan]1[/]   Arbre des classes")
        col1.add_row("[cyan]2[/]   Lister les classes")
        col1.add_row("[cyan]3[/]   Propriétés d'une classe")
        col1.add_row("[cyan]4[/]   Instances d'une classe")
        col1.add_row("[cyan]5[/]   Ajouter une classe")
        col1.add_row("[cyan]6[/]   Ajouter une propriété")

        col2 = Table.grid(padding=0)
        col2.add_column()
        col2.add_row("[cyan]7[/]   Ajouter une instance")
        col2.add_row("[cyan]8[/]   Inférence Forward")
        col2.add_row("[cyan]9[/]   Inférence Backward")
        col2.add_row("[cyan]10[/]  Lister les règles")
        col2.add_row("[cyan]11[/]  [bold yellow]APIs[/]")
        col2.add_row("[cyan]0[/]   Quitter")

        grid = Table.grid(padding=(0, 4))
        grid.add_column()
        grid.add_column()
        grid.add_row(col1, col2)
        console.print(Panel(grid, title="[bold magenta]MENU[/bold magenta]",
                            border_style="bright_blue"))

        choice = Prompt.ask(
            "[bold cyan]Choix[/]",
            choices=["0","1","2","3","4","5","6","7","8","9","10","11"],
            default="1"
        )

        # Akinator — publish vers les handlers abonnés
        if   choice == "1":  bus.publish("akinator:tree")
        elif choice == "2":  bus.publish("akinator:classes")
        elif choice == "3":
            cls = app._select_class("Classe")
            if cls: app.show_class_properties(cls)
        elif choice == "4":
            cls = app._select_class("Classe à inspecter")
            if cls: app.show_instances(cls)
        elif choice == "5":  app.add_class()
        elif choice == "6":  app.add_property()
        elif choice == "7":  app.add_instance()
        elif choice == "8":
            cls = app._select_class("Classe")
            if cls:
                instances = app.kb.get_all_instances(cls)
                inst = app._select_from_list(instances, "Instance")
                if inst: bus.publish("akinator:forward", {"inst": inst, "cls": cls})
        elif choice == "9":
            cls = app._select_class("Classe")
            if cls:
                instances = app.kb.get_all_instances(cls)
                inst      = app._select_from_list(instances, "Instance")
                objective = Prompt.ask("[cyan]Propriété à déduire[/]")
                if inst and objective:
                    bus.publish("akinator:backward", {"inst": inst, "cls": cls,
                                                       "objective": objective})
        elif choice == "10": app.show_rules()
        elif choice == "11": menu_api()
        elif choice == "0":
            console.print(Panel("[bold green]Au revoir ![/]", style="green"))
            kb.close()
            break


if __name__ == "__main__":
    main()
