<h2>Users list</h2>

<input type="text" id="filterInput" placeholder="Filtrer par nom ou email" />

<table id="usersTable" border="1" style="width:100%; border-collapse: collapse;">
    <thead>
        <tr>
            <th data-column="id" data-order="asc">Id ▲</th>
            <th data-column="username" data-order="asc">Nom ▲</th>
            <th data-column="email" data-order="asc">Email ▲</th>
            <th data-column="role" data-order="asc">Rôle ▲</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <!-- Les lignes seront générées en JS -->
    </tbody>
</table>
