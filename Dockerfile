FROM node:current-alpine3.16  
#ENV NODE_ENV production
#Imagen base - directorio que se creará en Node y que crearemos. Copy, llevará portafolio-client a portafolio-client (En contenedor).

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .

CMD ["yarn", "dev"]
