la promotion des propriétés du constructeur introduite en PHP 8.

Quand tu écris :

public function __construct(
    public string $type,
    public string $description,
    ...
) {}

PHP génère implicitement l'équivalent de :

class ComponentDefinition
{
    public string $type;
    public string $description;

    public function __construct(
        string $type,
        string $description
    ) {
        $this->type = $type;
        $this->description = $description;
    }
}

Les propriétés sont donc déjà :

déclarées ;
typées ;
initialisées automatiquement.

Tu n'as rien d'autre à faire.
