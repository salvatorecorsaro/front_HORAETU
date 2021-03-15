FROM nginx:1.17.1-alpine
COPY /dist/front-horae /usr/share/nginx/html
