class Faits:
    def __init__(self, list_fait):
        self.kbfaits = list_fait

    def get(self, fait):
        return self.kbfaits.get(fait)

    def update(self, nouveaux_faits):
        self.kbfaits.update(nouveaux_faits)

    def __str__(self) -> str:
        stemp = 'Liste des faits : \n'

        for fait in self.kbfaits:
            stemp += str(fait[0]) + '\n'
        return stemp