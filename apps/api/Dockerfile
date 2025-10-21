FROM node:22.18.0

RUN npm i -g pnpm
 
WORKDIR /usr/src/app
 
# Copy root package.json and lockfile
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
 
# Copy the api package.json
COPY apps/api/package.json ./apps/api/package.json
 
RUN pnpm i 
# RUN pnpm i --dir apps/api
 
# Copy app source
COPY . .
 
EXPOSE 3000
 
CMD [ "node", "apps/api/src/index.js" ]