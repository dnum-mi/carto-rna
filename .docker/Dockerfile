FROM node:17.3.0-bullseye-slim as dev

WORKDIR /app

CMD ["sleep", "infinity"]

FROM dev as build-carto-rna

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL:-"/"}

COPY ./package.json ./package-lock.json ./
RUN npm i

COPY ./index.html ./vite.config.js ./
COPY ./public ./public
COPY ./src ./src

RUN npm run build

FROM nginx:1.21.5-alpine as prod

COPY --from=build-carto-rna /app/dist /usr/share/nginx/html
