# On utilise une image Node.js légère
FROM node:22-alpine

# On se place dans le dossier de travail
WORKDIR /usr/src/app

# On copie les fichiers de dépendances
COPY package*.json ./

# On installe les dépendances
RUN npm install

# On copie tout le reste du code
COPY . .

# On compile le projet NestJS
RUN npm run build

# On lance le projet compilé (beaucoup plus léger pour le PC !)
CMD ["npm", "run", "start:prod"]
