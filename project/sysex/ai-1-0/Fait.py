class Fait:
    def __init__(self, grandeur, connu=False, unite=None, valeur=None):
        self.grandeur = grandeur
        self.connu = connu
        self.unite = unite
        self.valeur = valeur

    def __str__(self) -> str:
        return 'grandeur : ' + self.grandeur + ' connu ' + str(self.connu) + ' valeur ' + str(self.valeur)
