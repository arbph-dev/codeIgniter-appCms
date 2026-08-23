
dépendances : 
- sys
- PyQt6.QtWidgets :
    - QApplication
    - QMainWindow
    - QWidget
    - QVBoxLayout
    - QListWidget
    - QLabel
    - QTabWidget
- PyQt6.QtCore
    - pyqtSignal
    - Qt

# pyqt6-gui-000

`Workbench::__init__` créé les panels et établit la connexion du **signal** du ListPanel au **slot** du DetailPanel
```py
self.list_panel.item_selected.connect(self.detail_panel.update_details)
```

ListPanel affiche une liste d'éléments, sur une sélection ListPanel transmet le **signal** avec `ListPanel::on_selection_changed`
```py
self.item_selected.emit(current_row, item_text)
```

DetailPanel reçoit le signal sur son slot et appel `DetailPanel::update_details(self, index, text)`


## ListPanel 
Affiche une liste d'éléments avec gestion de sélection

Extends : QWidget

Le constructeur
- crée et instancie un enfant `self.list_widget` de classe QListWidget
- ajoute le paramètre `items` contenants les données fournis au constructeur dans `self.list_widget` avec la méthode QListWidget::addItems()
- Connecte le signal de sélection : `currentRowChanged` au gestionnaire de signal `on_selection_changed`


Structure
```
ListPanel (QWidget)
    item_selected ( pyqtSignal )
    self.list_widget
    def __init__
    def on_selection_changed
```

```py
class ListPanel(QWidget):
    # Signal émis quand un élément est sélectionné, transmet l'index et le texte
    item_selected = pyqtSignal(int, str)

    def __init__(self, items, parent=None):
        super().__init__(parent)
        self.list_widget = QListWidget()
        self.list_widget.addItems(items)
        layout = QVBoxLayout()
        layout.addWidget(self.list_widget)
        self.setLayout(layout)

        # Connexion du signal de sélection interne à notre signal personnalisé
        self.list_widget.currentRowChanged.connect(self.on_selection_changed)

    def on_selection_changed(self, current_row):
        if current_row >= 0:
            item_text = self.list_widget.item(current_row).text()
            self.item_selected.emit(current_row, item_text)
```

## DetailPanel
affiche les détails d'un élément, avec plusieurs onglets

Structure
```
DetailPanel (QWidget)
    self.tabs
    self.info_label
    def __init__
    def update_details(self, index, text):
```

```py
class DetailPanel(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.tabs = QTabWidget()
        self.info_label = QLabel("Sélectionnez un élément dans la liste.")
        self.tabs.addTab(self.info_label, "Détails")

        layout = QVBoxLayout()
        layout.addWidget(self.tabs)
        self.setLayout(layout)

    def update_details(self, index, text):
        # Exemple simple : mise à jour du label avec les infos reçues
        self.info_label.setText(f"Détails de l'élément #{index} : {text}")
        # Ici, vous pouvez gérer plusieurs onglets pour afficher plus d'infos
```
## Workbench
organise les panels et gère la communication

```py
class Workbench(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Workbench avec Panels et Signaux")

        # Création des panels
        self.list_panel = ListPanel(["Item 1", "Item 2", "Item 3", "Item 4"])
        self.detail_panel = DetailPanel()

        # Organisation de la fenêtre principale
        central_widget = QWidget()
        layout = QVBoxLayout()
        layout.addWidget(self.list_panel)
        layout.addWidget(self.detail_panel)
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)

        # Connexion du signal du ListPanel au slot du DetailPanel via le Workbench
        self.list_panel.item_selected.connect(self.detail_panel.update_details)
```

```py
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = Workbench()
    window.resize(400, 300)
    window.show()
    sys.exit(app.exec())
```

---


### QListWidget

