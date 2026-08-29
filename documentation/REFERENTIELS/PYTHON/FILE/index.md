


# A documenter
sys
os
pathlib / Path
__file__


```python
from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent
STYLES_DIR = BASE_DIR / "styles"
```



# Manipulation de fichier

## compilation de fichiers
Le script lit la liste de fichiers et les compile dans un fichier
```python
import os

# Liste des fichiers à traiter
path_files = [
r"G:\WEB\BACKUP\Hostinger\HostingerTemp\OBSIDIANDEV\OBSIDIANDEV\PUBLICATION\SPA\VERSION\BETA\TEMP3\EVOLUTION\apex_plugin.js",
r"G:\WEB\BACKUP\Hostinger\HostingerTemp\OBSIDIANDEV\OBSIDIANDEV\PUBLICATION\SPA\VERSION\BETA\TEMP3\EVOLUTION\BasePlugin.js",
r"G:\WEB\BACKUP\Hostinger\HostingerTemp\OBSIDIANDEV\OBSIDIANDEV\PUBLICATION\SPA\VERSION\BETA\TEMP3\EVOLUTION\DependencyLoader.js",
r"G:\WEB\BACKUP\Hostinger\HostingerTemp\OBSIDIANDEV\OBSIDIANDEV\PUBLICATION\SPA\VERSION\BETA\TEMP3\EVOLUTION\mermaid_plugin.js",
r"G:\WEB\BACKUP\Hostinger\HostingerTemp\OBSIDIANDEV\OBSIDIANDEV\PUBLICATION\SPA\VERSION\BETA\TEMP3\EVOLUTION\PluginRegistry.js",
r"G:\WEB\BACKUP\Hostinger\HostingerTemp\OBSIDIANDEV\OBSIDIANDEV\PUBLICATION\SPA\VERSION\BETA\TEMP3\EVOLUTION\plugins-config.js",
r"G:\WEB\BACKUP\Hostinger\HostingerTemp\OBSIDIANDEV\OBSIDIANDEV\PUBLICATION\SPA\VERSION\BETA\TEMP3\EVOLUTION\section_posts_analytics.js",
]

# Demande des entrées utilisateur
nom_fichier = input("Nom du fichier de sortie (ex: maliste.md) : ").strip()
basepath = input("Chemin de base : ").strip()

# Fichier de sortie dans le répertoire courant
output_path = os.path.join(os.getcwd(), nom_fichier)

# Extensions autorisées et leur syntaxe Markdown
extensions = {
    '.html': 'html',
    '.css': 'css',
    '.js': 'js',
    '.php': 'php'
}

with open(output_path, 'w', encoding='utf-8') as outfile:
    for full_path in path_files:
        ext = os.path.splitext(full_path)[1].lower().strip()
        if ext not in extensions:
            print(f"❌ {full_path} ignoré (extension non autorisée)")
            continue
        
        # Demande à l’utilisateur s’il veut inclure ce fichier
        include = input(f"Inclure le fichier {full_path} ? (o/n) : ").strip().lower()
        if include != 'o':
            print(f"⏭️  {full_path} sauté")
            continue

        # Nettoyage du chemin
        new_path = full_path.replace(basepath, '').replace('\\', '/')
        if new_path.startswith('/'):
            new_path = new_path[1:]

        # Lecture du contenu
        try:
            with open(full_path, 'r', encoding='utf-8') as infile:
                content = infile.read()
        except Exception as e:
            print(f"⚠️  Erreur lecture {full_path}: {e}")
            continue

        # Écriture dans le markdown
        outfile.write(f"## {new_path}\n\n")
        outfile.write(f"```{extensions[ext]}\n")
        outfile.write(content)
        outfile.write("\n```\n\n")

print(f"\n✅ Compilation terminée ! Fichier créé : {output_path}")
```
