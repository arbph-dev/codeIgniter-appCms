```php

# ==========================================
# TESTS CURL - API FORMES JURIDIQUES
# ==========================================

BASE_URL="https://elfennel.fr/api/formesjuridiques"

echo "🧪 Tests API Formes Juridiques"
echo "================================"

# ------------------------------------------
# 1. Liste paginée (page 1, 20 résultats)
# ------------------------------------------
echo ""
echo "📋 Test 1 : Liste paginée (défaut)"
curl -X GET "${BASE_URL}?page=1" | jq .

# ------------------------------------------
# 2. Liste paginée avec pagination personnalisée
# ------------------------------------------
echo ""
echo "📋 Test 2 : Liste paginée (5 résultats par page)"
curl -X GET "${BASE_URL}?page=1&per_page=5" | jq .

# ------------------------------------------
# 3. Recherche par mot-clé (SARL)
# ------------------------------------------
echo ""
echo "🔍 Test 3 : Recherche 'SARL'"
curl -X GET "${BASE_URL}?search=SARL" | jq .

# ------------------------------------------
# 4. Recherche avec endpoint /search (style CodePostal)
# ------------------------------------------
echo ""
echo "🔍 Test 4 : Recherche via /search?q=societe"
curl -X GET "${BASE_URL}/search?q=societe" | jq .

# ------------------------------------------
# 5. Recherche courte (< 2 caractères) -> réponse vide
# ------------------------------------------
echo ""
echo "🔍 Test 5 : Recherche trop courte (1 caractère)"
curl -X GET "${BASE_URL}/search?q=S" | jq .

# ------------------------------------------
# 6. Détail d'une forme juridique (code 5499 = SARL)
# ------------------------------------------
echo ""
echo "📄 Test 6 : Détail code 5499 (SARL)"
curl -X GET "${BASE_URL}/5499" | jq .

# ------------------------------------------
# 7. Détail d'une forme juridique (code 1000 = Entrepreneur individuel)
# ------------------------------------------
echo ""
echo "📄 Test 7 : Détail code 1000 (Entrepreneur individuel)"
curl -X GET "${BASE_URL}/1000" | jq .

# ------------------------------------------
# 8. Détail forme juridique inexistante
# ------------------------------------------
echo ""
echo "❌ Test 8 : Code inexistant (9999)"
curl -X GET "${BASE_URL}/9999" | jq .

# ------------------------------------------
# 9. Compteur total
# ------------------------------------------
echo ""
echo "🔢 Test 9 : Compteur total"
curl -X GET "${BASE_URL}/count" | jq .

# ------------------------------------------
# 10. Liste des codes uniquement
# ------------------------------------------
echo ""
echo "📋 Test 10 : Liste codes uniquement (5 premiers)"
curl -X GET "${BASE_URL}/codes" | jq '. | .[0:5]'

# ------------------------------------------
# 11. Recherche par code exact
# ------------------------------------------
echo ""
echo "🔍 Test 11 : Recherche code exact '5410'"
curl -X GET "${BASE_URL}?search=5410" | jq .

# ------------------------------------------
# 12. Pagination - page spécifique
# ------------------------------------------
echo ""
echo "📋 Test 12 : Page 3 (10 résultats/page)"
curl -X GET "${BASE_URL}?page=3&per_page=10" | jq .

echo ""
echo "✅ Tests terminés !"

```