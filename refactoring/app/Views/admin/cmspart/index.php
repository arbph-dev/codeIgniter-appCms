<h1>CMS Parts</h1>

<p>
<a href="/admin/cmspart/create">➕ Nouvelle Part</a>
</p>

<table border="1" cellpadding="5">

<tr>
    <th>Id</th>
    <th>Section</th>
    <th>Type</th>
    <th>Titre</th>
    <th>Position</th>
    <th>Publié</th>
    <th></th>
</tr>

<?php foreach ($parts as $part): ?>

<tr>

    <td><?= esc($part['id']) ?></td>

    <td><?= esc($part['section_id']) ?></td>

    <td><?= esc($part['type_id']) ?></td>

    <td><?= esc($part['title']) ?></td>

    <td><?= esc($part['position']) ?></td>

    <td><?= $part['is_published'] ? '✔' : '' ?></td>

    <td>

        <a href="/admin/cmspart/edit/<?= $part['id'] ?>">
            Edit
        </a>

    </td>

</tr>

<?php endforeach; ?>

</table>