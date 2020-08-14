FROM node:12
WORKDIR /Users/yashdamani/Desktop/structured
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000 3306
CMD [ "npm","run", "start" ]

