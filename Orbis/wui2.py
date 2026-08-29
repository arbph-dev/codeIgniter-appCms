from PySide6.QtCore import QObject, Property, Signal, Slot
from PySide6.QtQml import QQmlApplicationEngine
from PySide6.QtGui import QGuiApplication
import sys


class ApplicationController(QObject):
    system_status_changed = Signal(str)

    def __init__(self):
        super().__init__()
        self._system_status = "operational"

    @Property(str, notify=system_status_changed)
    def system_status(self):
        return self._system_status

    @Slot()
    def refresh_status(self):
        self._system_status = "operational"
        self.system_status_changed.emit(self._system_status)


app = QGuiApplication(sys.argv)
engine = QQmlApplicationEngine()

controller = ApplicationController()
engine.rootContext().setContextProperty(
    "appController",
    controller,
)

engine.load("qml/Main.qml")

if not engine.rootObjects():
    sys.exit(-1)

sys.exit(app.exec())