FROM node:22.10.0

WORKDIR /usr/src/api

COPY . ./
COPY .env .env

RUN npm install

RUN npm run build

ENV PORT=3000
CMD ["npm", "run", "start:prod"]
EXPOSE 3000