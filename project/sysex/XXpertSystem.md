

## services/auth/

ApiKeyAuth.py
- Authentification par clé API — header ou query param.

Usage :
```py
  # INSEE : clé en header
  auth = ApiKeyAuth(api_key="xxx", header_name="X-INSEE-Api-Key-Integration")
  session = auth.get_session()

  # Autre API : clé en query param
  auth = ApiKeyAuth(api_key="xxx", query_name="api_key")
```
