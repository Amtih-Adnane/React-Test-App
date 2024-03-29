FROM node:latest


WORKDIR /
COPY package.json .
RUN npm install

EXPOSE 5001

WORKDIR /app

COPY . .
CMD ["npm", "run", "dev"]

