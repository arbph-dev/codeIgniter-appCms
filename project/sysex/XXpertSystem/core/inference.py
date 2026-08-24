"""
akinator/core/inference.py
ForwardEngine et BackwardEngine — repris v0.7, adaptés domaine entreprise.
"""
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

console = Console()


class Rule:
    def __init__(self, conditions, conclusion, calculation, unit=None,
                 rule_id=None, description=None):
        self.conditions  = conditions
        self.conclusion  = conclusion
        self.calculation = calculation
        self.unit        = unit
        self.rule_id     = rule_id or conclusion
        self.description = description or ""


class ForwardEngine:

    def __init__(self, kb):
        self.kb    = kb
        self.rules = []

    def add_rule(self, conditions, conclusion, calculation, unit=None, rule_id=None, description=None):
        self.rules.append(Rule( conditions, conclusion, calculation,unit, rule_id, description ) )

    def execute(self, inst_name: str, class_name: str, verbose: bool = True) -> dict:
        """
        Chaînage avant sur une instance.
        Retourne le dict des faits déduits {prop: valeur}.
        """
        if verbose:
            console.print(Panel("[bold blue]Inférence Forward[/]", style="bold blue"))

        # Charge les faits connus
        facts = {}
        for prop in self.kb.get_all_props_for_class(class_name):
            val = self.kb.get_instance_value(inst_name, class_name, prop)
            if val is not None:
                facts[prop] = val

        deduced = {}
        changed = True
        iterations = 0

        while changed and iterations < 20:
            changed = False
            iterations += 1
            for rule in self.rules:
                if rule.conclusion in facts:
                    continue  # déjà connu
                if all(c in facts for c in rule.conditions):
                    try:
                        vals    = [facts[c] for c in rule.conditions]
                        new_val = rule.calculation(*vals)
                        if new_val is not None:
                            facts[rule.conclusion] = new_val
                            deduced[rule.conclusion] = new_val
                            self.kb.set_instance_value(
                                inst_name, class_name, rule.conclusion, new_val
                            )
                            if verbose:
                                unit = f" {rule.unit}" if rule.unit else ""
                                console.print(
                                    f"[green]✓ {rule.conclusion} = {new_val}{unit}[/]"
                                    f"  [dim]({rule.rule_id})[/]"
                                )
                            changed = True
                    except Exception as e:
                        if verbose:
                            console.print(f"[red]Erreur règle {rule.rule_id} : {e}[/]")

        if verbose:
            console.print(Panel(
                f"[green]{len(deduced)} valeur(s) déduite(s) en {iterations} itération(s)[/]",
                style="green"
            ))
        return deduced

    def list_rules(self):
        """Affiche les règles chargées."""
        from rich.table import Table
        table = Table(title="Règles Forward chargées")
        table.add_column("ID",          style="cyan")
        table.add_column("Conditions",  style="yellow")
        table.add_column("→ Conclusion",style="green")
        table.add_column("Description", style="dim")
        for r in self.rules:
            table.add_row(
                r.rule_id,
                " + ".join(r.conditions),
                r.conclusion,
                r.description,
            )
        console.print(table)


class BackwardEngine:

    def __init__(self, kb):
        self.kb    = kb
        self.rules = []

    def add_rule(self, conclusion, conditions, calculation, unit=None,
                 rule_id=None, description=None):
        self.rules.append(Rule(
            conditions, conclusion, calculation,
            unit, rule_id, description
        ))

    def prove(self, objective: str, inst_name: str, class_name: str):
        """Chaînage arrière — demande les valeurs manquantes."""
        console.print(f"[magenta]→ Objectif : déduire {objective}[/]")

        val = self.kb.get_instance_value(inst_name, class_name, objective)
        if val is not None:
            console.print(f"[green]✓ Déjà connu : {objective} = {val}[/]")
            return val

        for rule in self.rules:
            if rule.conclusion == objective:
                console.print(f"[yellow]Règle : {rule.conditions} → {objective}[/]")
                vals = []
                for cond in rule.conditions:
                    v = self.prove(cond, inst_name, class_name)
                    if v is None:
                        vals = None
                        break
                    vals.append(v)
                if vals is not None:
                    try:
                        result = rule.calculation(*vals)
                        if result is not None:
                            self.kb.set_instance_value(
                                inst_name, class_name, objective, result
                            )
                            unit = f" {rule.unit}" if rule.unit else ""
                            console.print(f"[bold green]✓ {objective} = {result}{unit}[/]")
                            return result
                    except Exception as e:
                        console.print(f"[red]Erreur calcul : {e}[/]")

        # Demande à l'utilisateur
        unit   = next((r.unit for r in self.rules if r.conclusion == objective), None)
        ptype  = self.kb.get_property_type(objective)
        prompt = f"[cyan]? {objective}[/]" + (f" ({unit})" if unit else "") + " (X inconnu)"
        raw    = Prompt.ask(prompt, default="X")
        if raw.upper() == "X":
            return None
        try:
            if ptype == "int":   val = int(raw)
            elif ptype == "float": val = float(raw)
            elif ptype == "bool":  val = raw.lower() in ("oui", "o", "true", "1")
            else:                  val = raw
        except ValueError:
            return None
        self.kb.set_instance_value(inst_name, class_name, objective, val)
        return val
