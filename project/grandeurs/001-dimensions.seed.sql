/******************************************************************************
 * Référentiel des dimensions physiques
 ******************************************************************************/

INSERT INTO dimensions
(code, nom, symbole, description)

VALUES

('LENGTH',      'Longueur',            'L',  'Dimension des longueurs'),

('AREA',        'Surface',             'S',  'Dimension des surfaces'),

('VOLUME',      'Volume',              'V',  'Dimension des volumes'),

('TIME',        'Temps',               'T',  'Dimension temporelle'),

('MASS',        'Masse',               'M',  'Dimension des masses'),

('TEMPERATURE', 'Température',         'Θ',  'Dimension thermique'),

('CURRENT',     'Courant électrique',  'I',  'Intensité électrique'),

('VOLTAGE',     'Tension électrique',  'U',  'Différence de potentiel'),

('POWER',       'Puissance',           'P',  'Puissance'),

('ENERGY',      'Énergie',             'E',  'Énergie'),

('PRESSURE',    'Pression',            'Pr', 'Pression'),

('FLOW',        'Débit',               'Q',  'Débit volumique ou massique');
