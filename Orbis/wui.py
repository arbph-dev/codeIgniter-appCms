from pathlib import Path
import sys

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QComboBox,
    QDoubleSpinBox,
    QFrame,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QListWidget,
    QMainWindow,
    QPushButton,
    QStackedWidget,
    QTabWidget,
    QVBoxLayout,
    QWidget,
)


BASE_DIR = Path(__file__).resolve().parent
STYLES_DIR = BASE_DIR / "styles"


class PanelDetail(QWidget):
    def __init__(self, name, switch_tab_callback):
        super().__init__()

        self.name = name
        self.switch_tab_callback = switch_tab_callback

        self.setObjectName("contentPanel")
        self.init_ui()

    def init_ui(self):
        outer_layout = QVBoxLayout(self)
        outer_layout.setContentsMargins(28, 28, 28, 28)

        card = QFrame()
        card.setObjectName("panelCard")

        layout = QVBoxLayout(card)
        layout.setContentsMargins(28, 28, 28, 28)
        layout.setSpacing(18)

        title = QLabel(self.name)
        title.setObjectName("panelTitle")
        layout.addWidget(title)

        description = QLabel(
            f"Bienvenue dans le panneau {self.name}. "
            "Cette zone peut contenir vos fonctions métier."
        )
        description.setObjectName("panelDescription")
        description.setWordWrap(True)
        layout.addWidget(description)

        controls_tabs = QTabWidget()
        controls_tabs.setObjectName("controlsTabs")

        controls_tabs.addTab(
            self.create_available_controls(),
            "Contrôles disponibles",
        )

        controls_tabs.addTab(
            self.create_information_tab(),
            "Informations",
        )

        layout.addWidget(controls_tabs)

        navigation_layout = QHBoxLayout()

        btn_switch = QPushButton("Aller au premier onglet")
        btn_switch.setObjectName("primaryButton")
        btn_switch.clicked.connect(lambda: self.switch_tab_callback(0))

        navigation_layout.addStretch()
        navigation_layout.addWidget(btn_switch)

        layout.addLayout(navigation_layout)

        outer_layout.addWidget(card)

    def create_available_controls(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setSpacing(14)

        line_edit = QLineEdit()
        line_edit.setPlaceholderText("Saisissez une valeur")
        layout.addWidget(QLabel("Champ texte"))
        layout.addWidget(line_edit)

        combo = QComboBox()
        combo.addItems(["Option A", "Option B", "Option C"])
        layout.addWidget(QLabel("Liste déroulante"))
        layout.addWidget(combo)

        spin_box = QDoubleSpinBox()
        spin_box.setRange(0, 1000)
        spin_box.setDecimals(2)
        layout.addWidget(QLabel("Valeur numérique"))
        layout.addWidget(spin_box)

        checkbox = QCheckBox("Activer le contrôle")
        layout.addWidget(checkbox)

        layout.addStretch()

        return page

    def create_information_tab(self):
        page = QWidget()
        layout = QVBoxLayout(page)

        label = QLabel(
            "Cette interface peut accueillir des commandes, "
            "des indicateurs, des paramètres ou des vues de simulation."
        )
        label.setWordWrap(True)

        layout.addWidget(label)
        layout.addStretch()

        return page


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.current_theme = "marine"

        self.setWindowTitle("Interface professionnelle PySide6")
        self.resize(1280, 800)

        self.init_ui()
        self.apply_theme(self.current_theme)

    def init_ui(self):
        central_widget = QWidget()
        central_widget.setObjectName("centralWidget")
        self.setCentralWidget(central_widget)

        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Header
        header = QFrame()
        header.setObjectName("header")

        header_layout = QHBoxLayout(header)
        header_layout.setContentsMargins(22, 0, 22, 0)

        title_layout = QVBoxLayout()
        title_layout.setSpacing(0)

        app_title = QLabel("Système de supervision")
        app_title.setObjectName("appTitle")

        app_subtitle = QLabel("Interface de contrôle et de paramétrage")
        app_subtitle.setObjectName("appSubtitle")

        title_layout.addWidget(app_title)
        title_layout.addWidget(app_subtitle)

        header_layout.addLayout(title_layout)
        header_layout.addStretch()

        self.theme_button = QPushButton("Thème nature")
        self.theme_button.clicked.connect(self.toggle_theme)
        header_layout.addWidget(self.theme_button)

        fullscreen_button = QPushButton("Plein écran")
        fullscreen_button.clicked.connect(self.toggle_fullscreen)
        header_layout.addWidget(fullscreen_button)

        main_layout.addWidget(header)

        # Corps de l'application
        content_layout = QHBoxLayout()
        content_layout.setContentsMargins(0, 0, 0, 0)
        content_layout.setSpacing(0)

        sidebar = QFrame()
        sidebar.setObjectName("sidebar")

        sidebar_layout = QVBoxLayout(sidebar)
        sidebar_layout.setContentsMargins(0, 16, 0, 16)
        sidebar_layout.setSpacing(4)

        sidebar_title = QLabel("NAVIGATION")
        sidebar_title.setObjectName("sidebarTitle")
        sidebar_layout.addWidget(sidebar_title)

        self.sidebar = QListWidget()
        self.sidebar.setObjectName("sidebarList")
        self.sidebar.addItems(
            [
                "Tableau de bord",
                "Paramètres",
                "Diagnostic",
            ]
        )
        self.sidebar.currentRowChanged.connect(self.change_tab)

        sidebar_layout.addWidget(self.sidebar)
        content_layout.addWidget(sidebar)

        self.stack = QStackedWidget()
        self.stack.setObjectName("stack")

        for index in range(3):
            panel = PanelDetail(
                self.sidebar.item(index).text(),
                self.switch_to_tab,
            )
            self.stack.addWidget(panel)

        content_layout.addWidget(self.stack)
        main_layout.addLayout(content_layout)

        self.statusBar().showMessage("Application prête")
        self.sidebar.setCurrentRow(0)

    def change_tab(self, index):
        if 0 <= index < self.stack.count():
            self.stack.setCurrentIndex(index)
            self.statusBar().showMessage(
                f"Onglet actif : {self.sidebar.item(index).text()}"
            )

    def switch_to_tab(self, index):
        self.sidebar.setCurrentRow(index)

    def toggle_fullscreen(self):
        if self.isFullScreen():
            self.showNormal()
        else:
            self.showFullScreen()

    def toggle_theme(self):
        self.current_theme = (
            "nature" if self.current_theme == "marine" else "marine"
        )

        self.apply_theme(self.current_theme)

        label = (
            "Thème marine"
            if self.current_theme == "marine"
            else "Thème nature"
        )
        self.theme_button.setText(label)


    @staticmethod
    def extract_colors(stylesheet):
        colors = {}

        for line in stylesheet.splitlines():
            line = line.strip()

            if not line.startswith("@"):
                continue

            if ":" not in line:
                continue

            variable, value = line.split(
                ":",
                1,
            )

            colors[variable.strip()] = (
                value.strip().rstrip(";")
            )

        return colors


    def apply_theme(self, theme_name):
        common_css = self.read_style_file("style.qss")
        theme_css = self.read_style_file(
            f"{theme_name}.qss"
        )

        replacements = self.extract_colors(theme_css)

        stylesheet = common_css

        for variable in sorted(
            replacements,
            key=len,
            reverse=True,
        ):
            stylesheet = stylesheet.replace(
                variable,
                replacements[variable],
            )

        unknown_variables = sorted(
            {
                word
                for word in stylesheet.split()
                if word.startswith("@")
            }
        )

        if unknown_variables:
            print(
                "Variables QSS non remplacées :",
                unknown_variables,
            )

        QApplication.instance().setStyleSheet(stylesheet)

    @staticmethod
    def read_style_file(filename):
        path = STYLES_DIR / filename

        try:
            return path.read_text(encoding="utf-8")
        except FileNotFoundError:
            raise RuntimeError(f"Feuille de style introuvable : {path}")

    @staticmethod
    def extract_color(stylesheet, variable):
        for line in stylesheet.splitlines():
            line = line.strip()

            if line.startswith(variable + ":"):
                return line.split(":", 1)[1].strip().rstrip(";")

        raise RuntimeError(
            f"La variable {variable} est absente de la feuille de style."
        )


if __name__ == "__main__":
    app = QApplication(sys.argv)

    window = MainWindow()
    window.showFullScreen()

    sys.exit(app.exec())