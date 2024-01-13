FROM node:hydrogen-slim

COPY . .

RUN npm i

CMD [ "npm", "run", "start" ]
