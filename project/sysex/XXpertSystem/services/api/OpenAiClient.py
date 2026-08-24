# services/api/OpenAiClient.py

from .BaseApiClient import BaseApiClient


class OpenAiClient(BaseApiClient):
    """
    OpenAI API

    Auth :
        Authorization: Bearer sk-...

    Base :
        https://api.openai.com/v1
    """

    def __init__(self, auth):
        super().__init__(
            base_url="https://api.openai.com/v1",
            auth=auth
        )

    # ------------------------------------------------------------------
    # Headers
    # ------------------------------------------------------------------

    def _headers(self):

        api_key = self.auth.get("api_key")

        return {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    # ------------------------------------------------------------------
    # Models
    # ------------------------------------------------------------------

    def models(self) -> dict:
        """
        Liste des modèles disponibles.
        """

        return self.get(
            "/models",
            headers=self._headers()
        )

    # ------------------------------------------------------------------
    # Responses API
    # ------------------------------------------------------------------

    def prompt(
        self,
        text: str,
        model: str = "gpt-5"
    ) -> dict:
        """
        Prompt simple.

        Retour JSON complet OpenAI.
        """

        payload = {
            "model": model,
            "input": text
        }

        return self.post(
            "/responses",
            json=payload,
            headers=self._headers()
        )

    # ------------------------------------------------------------------
    # Extraction texte
    # ------------------------------------------------------------------

    def prompt_text(
        self,
        text: str,
        model: str = "gpt-5"
    ) -> str:
        """
        Retourne uniquement le texte généré.
        """

        data = self.prompt(
            text=text,
            model=model
        )

        try:
            return data["output"][0]["content"][0]["text"]
        except Exception:
            return str(data)

    # ------------------------------------------------------------------
    # JSON structuré
    # ------------------------------------------------------------------

    def prompt_json(
        self,
        text: str,
        model: str = "gpt-5"
    ) -> dict:

        payload = {
            "model": model,
            "input": text,
            "text": {
                "format": {
                    "type": "json_object"
                }
            }
        }

        return self.post(
            "/responses",
            json=payload,
            headers=self._headers()
        )