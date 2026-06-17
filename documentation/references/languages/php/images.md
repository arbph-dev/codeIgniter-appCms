# Manipulation d'Images - Extension GD

Fonctions natives PHP pour les images avec l'extension GD.

---

## Création et chargement d'images

### imagecreate
Crée une nouvelle image vide en mémoire.

```php
$image = imagecreate(width, height);
```

### imagecreatefromjpeg
Crée une image à partir d'un fichier JPEG.

```php
$image = imagecreatefromjpeg(filename);
```

### imagecreatefrompng
Crée une image à partir d'un fichier PNG.

```php
$image = imagecreatefrompng(filename);
```

### imagecreatefromgif
Crée une image à partir d'un fichier GIF.

```php
$image = imagecreatefromgif(filename);
```

### imagecreatefromwebp
Crée une image à partir d'un fichier WebP.

```php
$image = imagecreatefromwebp(filename);
```

---

## Manipulation et modification

### imagesx et imagesy
Obtiennent la largeur et la hauteur d'une image.

```php
$width = imagesx($image);
$height = imagesy($image);
```

### imagecopy
Copie une partie d'une image source vers une image destination.

```php
imagecopy($dest, $src, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h);
```

### imagecopyresampled
Copie et redimensionne une image avec un meilleur rendu.

```php
imagecopyresampled($dest, $src, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h);
```

### imagerotate
Fait pivoter une image d'un certain angle.

```php
$rotated = imagerotate($image, $angle, $bgcolor);
```

### imageflip
Retourne une image horizontalement, verticalement ou les deux.

```php
imageflip($image, $mode);
```

---

## Dessiner sur une image

### imageline
Dessine une ligne.

```php
imageline($image, $x1, $y1, $x2, $y2, $color);
```

### imagefilledrectangle
Dessine un rectangle rempli.

```php
imagefilledrectangle($image, $x1, $y1, $x2, $y2, $color);
```

### imagestring
Écrit une chaîne de caractères.

```php
imagestring($image, $font, $x, $y, $string, $color);
```

### imagettftext
Écrit du texte avec une police TrueType.

```php
imagettftext($image, $size, $angle, $x, $y, $color, $fontfile, $text);
```

---

## Gestion des couleurs

### imagecolorallocate
Alloue une couleur.

```php
$color = imagecolorallocate($image, $r, $g, $b);
```

**Exemple** :
```php
$red = imagecolorallocate($image, 255, 0, 0);
$green = imagecolorallocate($image, 0, 255, 0);
$blue = imagecolorallocate($image, 0, 0, 255);
```

### imagecolortransparent
Définit une couleur transparente.

```php
imagecolortransparent($image, $color);
```

---

## Sauvegarde et affichage

### imagejpeg
Sauvegarde une image au format JPEG.

```php
imagejpeg($image, $filename, $quality);
```

### imagepng
Sauvegarde une image au format PNG.

```php
imagepng($image, $filename);
```

### imagegif
Sauvegarde une image au format GIF.

```php
imagegif($image, $filename);
```

### imagewebp
Sauvegarde une image au format WebP.

```php
imagewebp($image, $filename);
```

### Afficher une image dans le navigateur

```php
header('Content-Type: image/jpeg');
imagejpeg($image);
```

---

## Libération de la mémoire

### imagedestroy
Libère la mémoire associée à une image.

```php
imagedestroy($image);
```

**Bonne pratique** :
```php
$image = imagecreatefrompng('photo.png');
// ... manipulations ...
imagedestroy($image);
```

---

## Autres fonctions utiles

### getimagesize
Obtient les dimensions et le type d'une image.

```php
$imageinfo = getimagesize($filename);
// Retourne : [width, height, type, 'mime' => 'image/jpeg']
```

### imagefilter
Applique un filtre (ex : gris, flou, contraste).

```php
imagefilter($image, IMG_FILTER_GRAYSCALE);
imagefilter($image, IMG_FILTER_BLUR);
imagefilter($image, IMG_FILTER_BRIGHTNESS, $brightness);
```

---

## Alternatives à GD

### Imagick (Extension PHP pour ImageMagick)

Imagick propose des fonctions plus avancées pour le traitement d'images :

```php
$image = new Imagick('photo.png');
$image->resizeImage(800, 600, Imagick::FILTER_LANCZOS, 1);
$image->writeImage('resized.png');
```

**Avantages** :
- Meilleure qualité de redimensionnement
- Plus de filtres disponibles
- Meilleure gestion des formats modernes
- Traitement plus rapide pour les opérations complexes

---

**Référence** : [PHP - GD and Image Functions](https://www.php.net/manual/en/book.image.php)
