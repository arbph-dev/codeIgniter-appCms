pour gérer auth on doit ajouter des éléments dans la structure


## css
```
            /*
            * ─── 3. Zone authentification dans le header ─────────────────────────────────
            */

            .header-auth {
                flex: 0 0 auto;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.85rem;
                /* color : var(--col-A) */
            }
            
            /* Pseudo-classe d'accessibilité : masquer les labels visuellement */
            .sr-only {
                position: absolute;
                width: 1px; height: 1px;
                padding: 0; margin: -1px;
                overflow: hidden;
                clip: rect(0,0,0,0);
                white-space: nowrap;
                border: 0;
            }
            
            /* ── Connecté ── */
            .auth-username {
                display: flex;
                align-items: center;
                gap: 4px;
                font-weight: 600;
                white-space: nowrap;
            }
            
            .auth-link {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                text-decoration: none;
                border-radius: 4px;
                white-space: nowrap;
                transition: opacity 0.2s;
            }
            .auth-link:hover { opacity: 0.75; }
            
            /* Sur mobile : masquer le texte, ne garder que l'icône */
            @media (max-width: 767px) {
                .auth-link span, .auth-username { display: none; }
                .auth-link { padding: 4px 6px; }
            }
            
            /* ── Formulaire de connexion ── */
            .auth-form {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-wrap: wrap;
            }
            
            .auth-form input {
                padding: 4px 8px;
                border: 1px solid rgba(255,255,255,0.4);
                border-radius: 4px;
                font-size: 0.85rem;
                background: rgba(255,255,255,0.15);
                color: inherit;
                min-width: 0;
                width: 130px;
            }
            
            .auth-form input::placeholder { opacity: 0.6; }
            
            .auth-form button {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 5px 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85rem;
                white-space: nowrap;
            }
            
            /* Sur mobile : champs et label cachés, seul le bouton icône reste */
            @media (max-width: 767px) {
                .auth-form input { display: none; }
                .auth-form button span { display: none; }
                .auth-form button { padding: 6px 8px; }
            }

```
