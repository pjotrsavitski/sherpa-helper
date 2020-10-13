FROM node:12-alpine
WORKDIR /helper
COPY . .
# TODO Consider providing all the required settings and configurations
# Either change the .env file before build process succeeds or provide
# configuration to the container during either build time or at runtime
# Runtime configuration would require some changes to be made to the
# code with some kind of JSON file being loaded and configuration read
# from it. The file itself could be written/overwritten during container start
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=0 /helper/dist /usr/share/nginx/html
