
```sql
-- Images
CREATE TABLE images (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    path        VARCHAR(500) NOT NULL,
    filename    VARCHAR(255) NOT NULL,
    alt         TEXT,                    -- description pour balise alt
    status      ENUM('pending','validated','rejected') DEFAULT 'pending',
    uploaded_by INT UNSIGNED,            -- user_id Shield
    created_at  DATETIME,
    updated_at  DATETIME
);

-- Classification hiérarchique images
CREATE TABLE image_categories (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(255) NOT NULL,
    parent_id   INT UNSIGNED NULL,
    FOREIGN KEY (parent_id) REFERENCES image_categories(id)
);

-- Pivot mot ↔ image
CREATE TABLE mot_image (
    mot_id      INT UNSIGNED,
    image_id    INT UNSIGNED,
    PRIMARY KEY (mot_id, image_id)
);
```
