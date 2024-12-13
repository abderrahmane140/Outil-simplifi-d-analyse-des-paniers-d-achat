# Web Application: Backend et Frontend

Ce projet inclut à la fois le **backend** et le **frontend** d'une application web.

### Aperçu

- Le **backend** est construit avec **Node.js** et **TypeScript**. Il gère les requêtes API, la gestion des données et la communication avec la base de données.
- Le **frontend** est construit avec **Vue.js**, affichant les données récupérées depuis le backend et fournissant une interface utilisateur interactive.

---

## Fonctionnalités

### Backend:
- Construit avec **Express.js** pour le routage des API.
- **TypeScript** pour une forte typisation et une meilleure expérience développeur.
- **Mongoose** pour l'interaction avec MongoDB.
- **Cors** pour activer les requêtes inter-origines.

### Frontend:
- Architecture basée sur des composants avec Vue.js.
- Récupère et affiche les données depuis le backend.
- Interface utilisateur moderne et responsive pour une excellente expérience utilisateur.

---

## Technologies Utilisées

### Backend:
- **Node.js**
- **Express.js**
- **TypeScript**
- **Mongoose (MongoDB)**
- **Cors**

### Frontend:
- **Vue.js**
- **tailwind css** pour le style
- **chart js**, pour des graphiques et des graphiques interactifs

---

## Instructions d'Installation

### 1. Clonez le dépôt

git clone https://github.com/abderrahmane140/Outil-simplifi-d-analyse-des-paniers-d-achat.git

## 2. Configuration du Backend
1. Allez dans le répertoire backend et installez les dépendances :

cd backend
npm install

2. Configurez les variables d'environnement : Créez un fichier `.env` à la racine du répertoire backend avec vos paramètres d'environnement :

PORT = 4000
MONGO_URL = votre-url-mongo
URL_API_FRONTEND = http://localhost:5173/  # L'URL de votre frontend (généralement http://localhost:5173 si vous l'exécutez en local)


3. Démarrez le backend en mode développement :

npm run dev

4. Pour la production, compilez les fichiers TypeScript et exécutez l'application :

npm run start

Cette commande compile le code TypeScript en JavaScript et exécute les fichiers compilés depuis le dossier dist/.

## 3. Configuration du Frontend

1. Allez dans le répertoire frontend et installez les dépendances :

cd frontend
npm install

2. Démarrez le frontend en mode développement :

npm run dev

## Points de terminaison API

GET /analytics/total_sales : Retourne le montant total des ventes pour la période sélectionnée.
GET /analytics/trending_products : Retourne une liste des 3 produits les plus vendus, avec nom, quantité vendue, et montant total des ventes.
GET /analytics/category_sales : Retourne la répartition des ventes par catégorie, incluant le nombre et le pourcentage des ventes.
GET /products : Retourne un tableau des produits avec leur nombre de ventes pour chaque produit.
