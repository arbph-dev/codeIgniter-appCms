from Fait import Fait
from Faits import Faits

class Regles:
    def __init__(self):
        self.regles = []

    def ajouter_regle(self, si, alors):
        self.regles.append({'si': si, 'alors': alors})

    def appliquer_regles(self, faits):
        nouveaux_faits = True
        while nouveaux_faits:
            nouveaux_faits = False
            for regle in self.regles:

                for fait in regle['si']:
                    print(fait)

                print( faits.get("U") )

#faits.get(fait) 
                si_faits = [faits.kbfaits.get(fait) for fait in regle['si']]

                for fait in si_faits:
                    print(fait)
                    faits.kbfaits.get(fait)

                si_connu = all([fait.connu for fait in si_faits])
                alors_faits = [faits.get(fait) for fait in regle['alors']]
                alors_connu = all([fait.connu for fait in alors_faits])
                if si_connu and not alors_connu:
                    valeurs_si = [fait.valeur for fait in si_faits]
                    valeurs_alors = self.calculer_grandeur(regle['alors'], valeurs_si)
                    if valeurs_alors is not None:
                        fait_alors = Fait(regle['alors'], connu=True, valeur=valeurs_alors)
                        faits.update({regle['alors']: fait_alors})
                        nouveaux_faits = True

    def calculer_grandeur(self, grandeur, parametres):
        if grandeur == 'R':
            if len(parametres) == 2:
                return parametres[0] / parametres[1]
        elif grandeur == 'P':
            if len(parametres) == 2:
                return parametres[0] * parametres[1]
        elif grandeur == 'U':
            if len(parametres) == 2:
                return parametres[0] * parametres[1]
        elif grandeur == 'I':
            if len(parametres) == 2:
                return parametres[1] / parametres[0]
        else:
            return None
