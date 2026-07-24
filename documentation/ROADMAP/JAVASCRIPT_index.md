## récursivité
tag : récursive, récursivité, récursif

```js
// Fonction récursive avec indentation
function renderNode(label, depth = 0) {
    const page = pageMap[label];
    if (!page) return "";

    const indent = "  ".repeat(depth); // ou "  " pour 2 espaces
    let output = `${indent}- [[${page.file.name}]]\n`;

    const children = pages
        .where(p => (p.cmp_PARENT || []).includes(label))
        .sort(p => p.cmp_ID);

    for (const child of children) {
        output += renderNode(child.cmp_LBL, depth + 1);
    }

    return output;
}

// Racines (pas de parent)
const rootPages = pages
    .where(p => !p.cmp_PARENT || p.cmp_PARENT.length === 0)
    .sort(p => p.cmp_ID);

// Génération texte indenté
let treeText = "";
for (const root of rootPages) {
    treeText += renderNode(root.cmp_LBL);
}
```
