FROM node:20.1.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript
RUN tsc

EXPOSE 3000

CMD ["node", "ts-build/app.js"]
