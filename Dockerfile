FROM node:12
WORKDIR /Users/yashdamani/Desktop/structured
COPY package*.json ./
RUN npm install
RUN npm install -g pm2
COPY . .
EXPOSE 3000 3306
CMD ["node", "index.js"]

