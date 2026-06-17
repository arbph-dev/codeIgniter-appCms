<h2>Users list</h2>

<table border="1">
    <tr>
        <th>ID</th>
        <th>Email</th>
        <th>Username</th>
        <th>Active</th>
        <th>Groups</th>
        <th>Permissions</th>
    </tr>

<?php foreach ($users as $u): ?>

    <tr data-user-id="<?= $u->id ?>">
        <td><?= $u->id ?></td>
        <td><?= esc($u->email) ?></td>
        <td><?= esc($u->username) ?></td>
        <td><?= $u->isActivated() ? 'yes' : 'no' ?></td>

        <td>
            <?php foreach ($u->getGroups() as $g): ?>
                <?= $g ?> 
            <?php endforeach; ?>
        </td>

        <td>
            <?= $u->can('admin.access') ? 'admin ' : '' ?>
            <?= $u->can('users.delete') ? 'delete' : '' ?>
        </td>
    </tr>

<?php endforeach; ?>

</table>