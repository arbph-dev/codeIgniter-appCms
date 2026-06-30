<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="utf-8">

    <title>Edition Part</title>

    <link
        rel="stylesheet"
        href="/assets/css/components/wysedit.css">

</head>

<body>

<h1>

Edition de la Part #<?= $part['id'] ?>

</h1>

<form
    method="post"
    action="/admin/cmspart/update/<?= $part['id'] ?>">

    <table>

        <tr>

            <th>Titre</th>

            <td>

                <input
                    type="text"
                    name="title"
                    size="80"
                    value="<?= esc($part['title']) ?>">

            </td>

        </tr>

        <tr>

            <th>Aside</th>

            <td>

                <textarea
                    name="aside"
                    rows="4"
                    cols="80"><?= esc($part['aside']) ?></textarea>

            </td>

        </tr>

        <tr>

            <th>Composant</th>

            <td>

                <?= $editor ?>

            </td>

        </tr>

    </table>

    <p>

        <button type="submit">

            Enregistrer

        </button>

        <a href="/admin/cmstree">

            Annuler

        </a>

        &nbsp;&nbsp;

        <a
            href="/cms/part/<?= $part['id'] ?>"
            target="_blank">

            Prévisualiser

        </a>

    </p>

</form>

<script type="module">

import { initAdmin } from '/assets/js/admin/bootstrap.js'

document.addEventListener(
    'DOMContentLoaded',
    () => initAdmin()
)

</script>

</body>

</html>
