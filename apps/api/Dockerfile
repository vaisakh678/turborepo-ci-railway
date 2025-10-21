FROM node:22.18.0

RUN npm i -g pnpm
 
WORKDIR /usr/src/app
 
# Copy root package.json and lockfile
COPY package.json ./
 
# Copy the api package.json
COPY apps/api/package.json ./apps/api/package.json
 
RUN pnpm i 
 
# Copy app source
COPY . .
 
EXPOSE 3000
 
CMD [ "node", "apps/api/src/index.js" ]