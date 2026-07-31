<!-- app/Views/admin/component_types/form.php -->

<div class="mb-3">
    <label for="name" class="form-label">Nom</label>
    <input
        type="text"
        class="form-control"
        id="name"
        name="name"
        value="<?= esc($componentType['name']) ?>"
        required
    >
</div>

<div class="mb-3">
    <label for="description" class="form-label">Description</label>
    <textarea
        class="form-control"
        id="description"
        name="description"
        rows="4"><?= esc($componentType['description']) ?></textarea>
</div>

<div class="form-check mb-3">
    <input
        class="form-check-input"
        type="checkbox"
        id="is_active"
        name="is_active"
        value="1"
        <?= !empty($componentType['is_active']) ? 'checked' : '' ?>
    >

    <label class="form-check-label" for="is_active">
        Actif
    </label>
</div>
