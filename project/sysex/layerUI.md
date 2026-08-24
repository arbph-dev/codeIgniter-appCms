
## ui/console.py

[`def show_tree(kb):`](/project/sysex/akinator-0-7/XXpertSystem/ui/console.py#L12)
- def show_tree(kb): - ui - Nombre de lignes  =19

[`def select_list(items, title):`](/project/sysex/akinator-0-7/XXpertSystem/ui/console.py#L31)
- def select_list(items, title): - ui - Nombre de lignes  =18

[`def show_properties(props, title):`](/project/sysex/akinator-0-7/XXpertSystem/ui/console.py#L49)
- def show_properties(props, title): - ui - Nombre de lignes  =5

## game/akinator.py

[`def ask_yes_no(question):`](/project/sysex/akinator-0-7/XXpertSystem/game/akinator.py#L12)
- def ask_yes_no(question): - ui - Nombre de lignes  =11


---

# Recherches

## QML


### Main.qml
```qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ApplicationWindow {
    id: window

    visible: true
    width: 1440
    height: 900
    minimumWidth: 1024
    minimumHeight: 640

    title: qsTr("Système de supervision")

    property int currentPage: 0
    property string currentTheme: "marine"

    header: TopNavbar {
        id: topNavbar

        Layout.fillWidth: true

        onThemeRequested: {
            window.currentTheme = window.currentTheme === "marine"
                    ? "nature"
                    : "marine"
        }

        onSettingsRequested: {
            window.currentPage = Pages.settings
        }

        onLogoutRequested: {
            appController.logout()
        }
    }

    RowLayout {
        id: rootLayout

        anchors.fill: parent
        spacing: 0

        LeftSidebar {
            id: sidebar

            Layout.fillHeight: true
            Layout.preferredWidth: 230
            Layout.minimumWidth: 190
            Layout.maximumWidth: 280

            currentIndex: window.currentPage

            onPageSelected: function(index) {
                window.currentPage = index
            }
        }

        StackLayout {
            id: pageStack

            Layout.fillWidth: true
            Layout.fillHeight: true

            currentIndex: window.currentPage

            DashboardPage {
                Layout.fillWidth: true
                Layout.fillHeight: true
            }

            ControlsPage {
                Layout.fillWidth: true
                Layout.fillHeight: true
            }

            DiagnosticPage {
                Layout.fillWidth: true
                Layout.fillHeight: true
            }

            NotificationsPage {
                Layout.fillWidth: true
                Layout.fillHeight: true
            }

            SettingsPage {
                Layout.fillWidth: true
                Layout.fillHeight: true

                themeName: window.currentTheme

                onThemeChanged: function(theme) {
                    window.currentTheme = theme
                }
            }
        }
    }
}
```
Les constantes d’index peuvent être regroupées dans un singleton.

### Pages.qml
```qml
pragma Singleton

import QtQuick

QtObject {
    readonly property int dashboard: 0
    readonly property int controls: 1
    readonly property int diagnostic: 2
    readonly property int notifications: 3
    readonly property int settings: 4
}
```
Déclarez ensuite ce singleton dans votre module QML, par exemple avec un fichier qmldir :

```
singleton Pages 1.0 Pages.qml
```
Vous pourrez écrire :

```qml
window.currentPage = Pages.notifications
```
plutôt que :

```qml
window.currentPage = 3
```
Cela rend le code plus lisible et évite les erreurs lorsque l’ordre des pages évolue.

### LeftSidebar.qml
```qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Rectangle {
    id: root

    property int currentIndex: 0

    signal pageSelected(int index)

    color: Theme.sidebarColor

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 12
        spacing: 6

        Label {
            text: qsTr("NAVIGATION")

            Layout.fillWidth: true
            leftPadding: 12
            bottomPadding: 12

            color: Theme.sidebarTextColor
            font.pixelSize: 11
            font.bold: true
            opacity: 0.7
        }

        NavButton {
            text: qsTr("Tableau de bord")
            iconSource: "qrc:/icons/dashboard.svg"
            checked: root.currentIndex === Pages.dashboard

            onClicked: root.pageSelected(Pages.dashboard)
        }

        NavButton {
            text: qsTr("Contrôles")
            iconSource: "qrc:/icons/sliders.svg"
            checked: root.currentIndex === Pages.controls

            onClicked: root.pageSelected(Pages.controls)
        }

        NavButton {
            text: qsTr("Diagnostic")
            iconSource: "qrc:/icons/activity.svg"
            checked: root.currentIndex === Pages.diagnostic

            onClicked: root.pageSelected(Pages.diagnostic)
        }

        NavButton {
            text: qsTr("Notifications")
            iconSource: "qrc:/icons/bell.svg"
            checked: root.currentIndex === Pages.notifications

            onClicked: root.pageSelected(Pages.notifications)
        }

        NavButton {
            text: qsTr("Paramètres")
            iconSource: "qrc:/icons/settings.svg"
            checked: root.currentIndex === Pages.settings

            onClicked: root.pageSelected(Pages.settings)
        }

        Item {
            Layout.fillHeight: true
        }
    }
}
```
### NavButton.qml
```qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Button {
    id: root

    property string iconSource: ""

    checkable: true

    Layout.fillWidth: true
    implicitHeight: 44

    background: Rectangle {
        radius: 7

        color: root.checked
                ? Theme.sidebarSelectedColor
                : root.hovered
                    ? Theme.sidebarHoverColor
                    : "transparent"

        Rectangle {
            visible: root.checked

            width: 4
            height: parent.height
            radius: 2

            anchors.left: parent.left
            color: Theme.accentColor
        }
    }

    contentItem: RowLayout {
        spacing: 12

        Image {
            source: root.iconSource

            Layout.preferredWidth: 20
            Layout.preferredHeight: 20

            sourceSize.width: 20
            sourceSize.height: 20

            opacity: root.checked || root.hovered ? 1.0 : 0.75
        }

        Label {
            text: root.text

            Layout.fillWidth: true

            color: root.checked
                    ? Theme.sidebarSelectedTextColor
                    : Theme.sidebarTextColor

            verticalAlignment: Text.AlignVCenter
        }
    }
}
```

### Pages avec onglets centraux
Chaque page peut contenir son propre TabBar et son propre StackLayout.

#### DashboardPage.qml
```qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Page {
    id: root

    background: Rectangle {
        color: Theme.backgroundColor
    }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 18

        RowLayout {
            Layout.fillWidth: true

            ColumnLayout {
                Layout.fillWidth: true
                spacing: 2

                Label {
                    text: qsTr("Tableau de bord")
                    color: Theme.textColor
                    font.pixelSize: 28
                    font.bold: true
                }

                Label {
                    text: qsTr("Vue synthétique du système")
                    color: Theme.mutedTextColor
                }
            }

            StatusIndicator {
                status: "operational"
            }

            Button {
                text: qsTr("Actualiser")

                onClicked: dashboardApi.loadSummary()
            }
        }

        TabBar {
            id: dashboardTabBar

            Layout.fillWidth: true

            TabButton {
                text: qsTr("Vue générale")
            }

            TabButton {
                text: qsTr("Mesures")
            }

            TabButton {
                text: qsTr("Historique")
            }
        }

        StackLayout {
            id: dashboardTabStack

            Layout.fillWidth: true
            Layout.fillHeight: true

            currentIndex: dashboardTabBar.currentIndex

            OverviewTab {}
            MeasurementsTab {}
            HistoryTab {}
        }
    }
}
```
Le point essentiel est cette liaison :

```qml
currentIndex: dashboardTabBar.currentIndex
```
Le bouton actif dans le TabBar détermine donc directement la page visible dans le StackLayout.

#### Page de contrôles
```qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Page {
    id: root

    background: Rectangle {
        color: Theme.backgroundColor
    }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 18

        Label {
            text: qsTr("Contrôles")
            color: Theme.textColor
            font.pixelSize: 28
            font.bold: true
        }

        TabBar {
            id: controlsTabBar

            Layout.fillWidth: true

            TabButton {
                text: qsTr("Commandes")
            }

            TabButton {
                text: qsTr("Paramètres")
            }

            TabButton {
                text: qsTr("Seuils")
            }
        }

        StackLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true

            currentIndex: controlsTabBar.currentIndex

            CommandsTab {}
            ControlSettingsTab {}
            ThresholdsTab {}
        }
    }
}
```
Vous avez donc deux niveaux indépendants :

```
StackLayout principal
├── DashboardPage
│   └── StackLayout des onglets du dashboard
├── ControlsPage
│   └── StackLayout des onglets de contrôle
├── DiagnosticPage
├── NotificationsPage
└── SettingsPage
```
Il ne faut pas utiliser un unique currentIndex pour toutes ces navigations. Chaque niveau doit avoir son propre index.

#### Cartes de mesures

##### OverviewTab.qml
```qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Item {
    id: root

    GridLayout {
        anchors.fill: parent

        columns: width >= 1000 ? 4 : width >= 700 ? 2 : 1
        rowSpacing: 16
        columnSpacing: 16

        MetricCard {
            title: qsTr("Température")
            value: dashboardApi.temperature
            unit: "°C"

            Layout.fillWidth: true
        }

        MetricCard {
            title: qsTr("Pression")
            value: dashboardApi.pressure
            unit: "bar"

            Layout.fillWidth: true
        }

        MetricCard {
            title: qsTr("Vitesse")
            value: dashboardApi.speed
            unit: "tr/min"

            Layout.fillWidth: true
        }

        MetricCard {
            title: qsTr("Charge")
            value: dashboardApi.load
            unit: "%"

            Layout.fillWidth: true
        }
    }
}
```
Pour un affichage WebAssembly avec seulement des données d’API, cette séparation est propre : dashboardApi récupère les données et les composants QML se contentent de les afficher.

### Gestion des raccourcis
Vous pouvez ajouter les raccourcis dans Main.qml avec Shortcut.

```qml
Shortcut {
    sequence: "Ctrl+1"

    onActivated: {
        window.currentPage = Pages.dashboard
    }
}

Shortcut {
    sequence: "Ctrl+2"

    onActivated: {
        window.currentPage = Pages.controls
    }
}

Shortcut {
    sequence: "Ctrl+3"

    onActivated: {
        window.currentPage = Pages.diagnostic
    }

    }

Shortcut {
    sequence: "Ctrl+4"

    onActivated: {
        window.currentPage = Pages.notifications
    }
}

Shortcut {
    sequence: "Ctrl+5"

    onActivated: {
        window.currentPage = Pages.settings
    }
}

Shortcut {
    sequence: "F11"

    onActivated: {
        window.visibility =
                window.visibility === Window.FullScreen
                ? Window.Windowed
                : Window.FullScreen
    }
}
```

Pour l’application WebAssembly, le comportement de F11 et du plein écran peut dépendre des règles du navigateur. **Il est prudent de conserver également un bouton visible dans la barre supérieure.**

### Chargement différé des pages
StackLayout est suffisant pour cinq pages simples. Si certaines pages deviennent lourdes, utilisez Loader pour différer leur création.

Exemple :

```qml
StackLayout {
    id: pageStack

    Layout.fillWidth: true
    Layout.fillHeight: true

    Loader {
        active: pageStack.currentIndex === Pages.dashboard
        source: "pages/DashboardPage.qml"
    }

    Loader {
        active: pageStack.currentIndex === Pages.controls
        source: "pages/ControlsPage.qml"
    }

    Loader {
        active: pageStack.currentIndex === Pages.diagnostic
        source: "pages/DiagnosticPage.qml"
    }

    Loader {
        active: pageStack.currentIndex === Pages.notifications
        source: "pages/NotificationsPage.qml"
    }

    Loader {
        active: pageStack.currentIndex === Pages.settings
        source: "pages/SettingsPage.qml"
    }
}
```
Attention : avec cette approche, une page peut être détruite lorsqu’elle devient inactive. Il ne faut donc pas y conserver un état local important sans le sauvegarder dans un modèle ou un service.

Pour commencer

Pages toujours chargées :
- Dashboard
- Controls
- Diagnostic
- Notifications
- Settings

Puis Loader uniquement pour les pages lourdes.

### Gestion du chargement des API
Pour chaque page, prévoir trois états :

loading
ready
error

Exemple :

```qml
Item {
    property bool loading: false
    property string errorMessage: ""

    BusyIndicator {
        anchors.centerIn: parent
        running: parent.loading
        visible: parent.loading
    }

    Label {
        anchors.centerIn: parent
        visible: !parent.loading && parent.errorMessage !== ""
        text: parent.errorMessage
        color: Theme.errorColor
    }
}
```
Une page peut charger ses données lorsqu’elle devient active :

```qml
onVisibleChanged: {
    if (visible) {
        dashboardApi.loadSummary()
    }
}
```
Cependant, avec StackLayout, la visibilité peut être gérée indirectement par le layout. Une propriété explicite est souvent plus claire :

```qml
property bool activePage: window.currentPage === Pages.dashboard
```
Puis :

```qml
onActivePageChanged: {
    if (activePage) {
        dashboardApi.loadSummary()
    }
}
```

#### Service API côté QML
Vous pouvez créer un objet spécialisé :

```qml
QtObject {
    id: dashboardApi

    property bool loading: false
    property string errorMessage: ""

    property real temperature: 0
    property real pressure: 0
    property int speed: 0
    property int load: 0

    function loadSummary() {
        loading = true
        errorMessage = ""

        var xhr = new XMLHttpRequest()

        xhr.open(
            "GET",
            "https://api.exemple.fr/api/dashboard/summary"
        )

        xhr.setRequestHeader(
            "Accept",
            "application/json"
        )

        xhr.onreadystatechange = function() {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return
            }

            loading = false

            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText)

                temperature = response.metrics.temperature.value
                pressure = response.metrics.pressure.value
                speed = response.metrics.speed.value
                load = response.metrics.load.value
            } else {
                errorMessage =
                        qsTr("Impossible de charger les données")
            }
        }

        xhr.send()
    }
}
```
À terme, ce code peut être déplacé dans un composant comme :

```
services/
├── DashboardApi.qml
├── NotificationsApi.qml
└── SettingsApi.qml
```

### Règles importantes avec StackLayout

#### 1. Utiliser uniquement des enfants directs
Les enfants du StackLayout déterminent les indices :

```qml
StackLayout {
    PageA {} // index 0
    PageB {} // index 1
    PageC {} // index 2
}
```
Ne mélangez pas des éléments décoratifs avec les pages :

```qml
StackLayout {
    Rectangle {} // deviendrait index 0
    PageA {}     // index 1
}
```
#### 2. Ne pas utiliser d’ancres sur les enfants du layout
Évitez ceci :

```qml
StackLayout {
    Page {
        anchors.fill: parent
    }
}
```
Préférez les propriétés Layout :

```qml
StackLayout {
    Page {
        Layout.fillWidth: true
        Layout.fillHeight: true
    }
}
```
Les layouts Qt Quick redimensionnent leurs enfants et proposent les propriétés attachées Layout.fillWidth, Layout.fillHeight et Layout.preferredWidth.

#### 3. Garder un index par niveau
Structure correcte :

```qml
property int currentPage: 0
property int currentDashboardTab: 0
property int currentControlsTab: 0
```
Structure à éviter :

```qml
property int currentIndex: 0
```
utilisée simultanément pour la sidebar et plusieurs TabBar.

#### 4. Ne pas recréer inutilement les pages
Puisque votre client WebAssembly consulte des données API sans temps réel, il est généralement inutile de reconstruire les pages à chaque actualisation. Actualisez plutôt les propriétés des modèles :

```qml
metricCard.value = response.value
```
ou, mieux, exposez des propriétés dans un service API.

Structure finale simplifiée
```qml
ApplicationWindow {
    header: TopNavbar {}

    RowLayout {
        anchors.fill: parent

        LeftSidebar {
            Layout.preferredWidth: 230
        }

        StackLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true

            DashboardPage {}
            ControlsPage {}
            DiagnosticPage {}
            NotificationsPage {}
            SettingsPage {}
        }
    }
}
```
Puis, dans une page :

```qml
Page {
    ColumnLayout {
        anchors.fill: parent

        TabBar {
            id: tabs
        }

        StackLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            currentIndex: tabs.currentIndex

            FirstTab {}
            SecondTab {}
            ThirdTab {}
        }
    }
}
```













