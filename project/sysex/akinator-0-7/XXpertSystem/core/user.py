from rich.console import Console
from rich.prompt import Prompt, Confirm  # Confirm ajouté

console = Console()

class UserManager:
    def __init__(self):
        return

    def login(self):
        username = Prompt.ask("[cyan]Votre username[/cyan]").strip().lower()
        if not username:
            console.print("[red]Username requis[/]")
            return self.login()

        self.kb.cursor.execute("SELECT id, role FROM se_users WHERE LOWER(username)=?", (username,))
        row = self.kb.cursor.fetchone()
        if row:
            return row[0], username, row[1]