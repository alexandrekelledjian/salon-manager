# Salon Manager - Lot 1, 2 & 3

Gestion des salons : modèle + API + back-office admin minimal + mini-site public + catalogue produits.

## Prérequis

- Node.js >= 18
- - Docker & Docker Compose
  - - npm ou yarn
   
    - ## Installation rapide
   
    - ### 1. Démarrer la base de données
   
    - ```bash
      docker-compose up -d
      ```

      ### 2. Configurer et lancer l'API

      ```bash
      cd api
      cp .env.example .env
      npm install
      npm run migrate
      npm run seed
      npm run dev
      ```

      L'API est disponible sur http://localhost:3001

      ### 3. Configurer et lancer l'admin

      ```bash
      cd admin
      cp .env.local.example .env.local
      npm install
      npm run dev
      ```

      L'admin est disponible sur http://localhost:3000

      ## Commandes API

      | Commande | Description |
      |----------|-------------|
      | `npm run dev` | Démarre en mode développement |
      | `npm run migrate` | Exécute les migrations |
      | `npm run migrate:rollback` | Annule la dernière migration |
      | `npm run seed` | Insère les données de test |
      | `npm test` | Lance les tests |

      ## Commandes Admin

      | Commande | Description |
      |----------|-------------|
      | `npm run dev` | Démarre en mode développement |
      | `npm run build` | Build de production |

      ## Données de test (seeds)

      Admin:
      - Email: admin@example.com
      - - Password: Admin123!
       
        - Salons:
       
        - | code_url | nom | actif |
        - |----------|-----|-------|
        - | HAIR75001 | Salon Coiffure Paris | ✅ |
        - | NAIL69001 | Onglerie Lyon | ✅ |
        - | SPA13001 | Spa Marseille | ❌ |
       
        - Produits (salon HAIR75001):
       
        - | name | price | active |
        - |------|-------|--------|
        - | Coupe Homme | 25,00 € | ✅ |
        - | Coupe Femme | 45,00 € | ✅ |
        - | Coloration | 60,00 € | ✅ |
        - | Produit Inactif | 99,99 € | ❌ |
       
        - ## Exemples curl
       
        - ### API Publique
       
        - ```bashmin

          ```bash
          # Login → récupère le token
          curl -X POST http://localhost:3001/api/admin/auth/login \
            -H "Content-Type: application/json" \
            -d '{"email":"admin@example.com","password":"Admin123!"}'
          ```
       
          ### API Admin (avec token)
       
          ```bash
          TOKEN="votre-token-jwt"

          # Liste des salons
          curl http://localhost:3001/api/admin/salons \
            -H "Authorization: Bearer $TOKEN"

          # Créer un salon
          curl -X POST http://localhost:3001/api/admin/salons \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"code_url":"NEW75002","nom":"Nouveau Salon"}'

          # Modifier un salon (toggle actif)
          curl -X PATCH http://localhost:3001/api/admin/salons/{id} \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"actif":false}'
          ```
       
          ## Mini-site public (Lot 2 & 3)
       
          ### Pages publiques
       
          | URL | Description |
          |-----|-------------|
          | `/s/HAIR75001` | Page publique du salon avec catalogue produits |
          | `/s/INVALID` | Affiche 404 - Salon non trouvé |
       
          ### Variables d'environnement front
       
          | Variable | Description | Défaut |
          |----------|-------------|--------|
          | `NEXT_PUBLIC_API_URL` | URL de l'API | http://localhost:3001 |
          | `NEXT_PUBLIC_SITE_NAME` | Nom affiché dans le header/footer | Mon Salon |
       
          ## Tests
       
          ```bash
          cd api
          npm test
          ```
       
          Tests couverts:
          - ✅ GET public salon actif → 200
          - - ✅ GET public salon inactif → 404
            - - ✅ Routes admin sans token → 401
              - - ✅ Login admin + création salon → OK
               
                - ## Vérification complète
               
                - ### Étape 1 : Démarrer la base de données
               
                - ```bash
                  docker-compose up -d
                  ```
       
                  ### Étape 2 : Configurer et migrer l'API
       
                  ```bash
                  cd api
                  cp .env.example .env
                  npm install
                  npm run migrate
                  npm run seed
                  ```
       
                  ### Étape 3 : Tester l'API publique
       
                  ```bash
                  # Salon actif → 200
                  curl -s http://localhost:3001/api/public/salons/by-code/HAIR75001 | head -c 100

                  # Salon inactif → 404
                  curl -s -w "\nHTTP %{http_code}\n" http://localhost:3001/api/public/salons/by-code/SPA13001

                  # Produits → 200
                  curl -s http://localhost:3001/api/public/salons/HAIR75001/products
                  ```
       
                  ### Étape 4 : Tester le login admin
       
                  ```bash
                  curl -s -X POST http://localhost:3001/api/admin/auth/login \
                    -H "Content-Type: application/json" \
                    -d '{"email":"admin@example.com","password":"Admin123!"}'
                  ```
       
                  ### Étape 5 : Lancer les tests automatisés
       
                  ```bash
                  cd api
                  npm test
                  ```
       
                  ### Étape 6 : Tester le front admin et le mini-site public
       
                  ```bash
                  cd admin
                  cp .env.local.example .env.local
                  npm install
                  npm run dev
                  ```
       
                  Puis ouvrir http://localhost:3000 et vérifier :
       
                  **Admin:**
                  1. Login : admin@example.com / Admin123! → redirige vers liste
                  2. 2. Liste : affiche 3 salons
                     3. 3. Créer : bouton "Nouveau salon" → créer un salon
                        4. 4. Éditer : cliquer "Éditer" → modifier → "Enregistré"
                           5. 5. Toggle actif : décocher "Actif" → enregistrer
                              6. 6. Logout : bouton "Déconnexion" → retour login
                                
                                 7. **Mini-site public:**
                                 8. 1. Accéder à http://localhost:3000/s/HAIR75001
                                    2. 2. Vérifier : nom du salon, adresse, téléphone, email
                                       3. 3. Vérifier : section "Nos produits" avec 3 produits (prix en euros)
                                          4. 4. Accéder à http://localhost:3000/s/INVALID → page 404
                                            
                                             5. ---
                                            
                                             6. ## Structure du projet
                                            
                                             7. ```
                                                salon-manager/
                                                ├── docker-compose.yml
                                                ├── .env.example
                                                ├── .gitignore
                                                ├── README.md
                                                ├── api/
                                                │   ├── package.json
                                                │   ├── knexfile.js
                                                │   ├── jest.config.js
                                                │   ├── .env.example
                                                │   ├── src/
                                                │   │   ├── index.js
                                                │   │   ├── app.js
                                                │   │   ├── config/
                                                │   │   │   └── database.js
                                                │   │   ├── migrations/
                                                │   │   │   ├── 001_enable_pgcrypto.js
                                                │   │   │   ├── 002_create_admins_table.js
                                                │   │   │   ├── 003_create_salons_table.js
                                                │   │   │   └── 004_create_products_table.js
                                                │   │   ├── seeds/
                                                │   │   │   ├── 001_seed_data.js
                                                │   │   │   └── 002_seed_products.js
                                                │   │   ├── middleware/
                                                │   │   │   └── authMiddleware.js
                                                │   │   ├── validators/
                                                │   │   │   └── salonValidator.js
                                                │   │   ├── controllers/
                                                │   │   │   ├── publicController.js
                                                │   │   │   ├── authController.js
                                                │   │   │   └── adminSalonController.js
                                                │   │   └── routes/
                                                │   │       ├── index.js
                                                │   │       ├── publicRoutes.js
                                                │   │       ├── authRoutes.js
                                                │   │       └── adminSalonRoutes.js
                                                │   └── tests/
                                                │       ├── setup.js
                                                │       └── salons.test.js
                                                └── admin/
                                                    ├── package.json
                                                    ├── next.config.js
                                                    ├── .env.local.example
                                                    └── src/
                                                        ├── styles/
                                                        │   ├── globals.css
                                                        │   ├── PublicLayout.module.css
                                                        │   └── SalonPublic.module.css
                                                        ├── lib/
                                                        │   ├── api.js
                                                        │   └── publicApi.js
                                                        ├── components/
                                                        │   └── public/
                                                        │       └── PublicLayout.js
                                                        └── pages/
                                                            └── s/
                                                                └── [code].js
                                                ```
       
                                                ---
       
                                                ## Lots livrés
       
                                                | Lot | Description | Statut |
                                                |-----|-------------|--------|
                                                | Lot 1 | API + Admin (salons) | ✅ Terminé |
                                                | Lot 2 | Mini-site public par salon | ✅ Terminé |
                                                | Lot 3 | Catalogue produits (lecture seule) | ✅ Terminé |
          # Salon actif → 200
          curl http://localhost:3001/api/public/salons/by-code/HAIR75001

          # Salon inactif → 404
          curl http://localhost:3001/api/public/salons/by-code/SPA13001

          # Salon inexistant → 404
          curl http://localhost:3001/api/public/salons/by-code/INVALID

          # Produits d'un salon actif → 200
          curl http://localhost:3001/api/public/salons/HAIR75001/products

          # Produits d'un salon inexistant → 404
          curl http://localhost:3001/api/public/salons/INVALID/products
          ```

          ### Auth Ad
