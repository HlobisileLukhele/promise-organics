# Stage 1 — build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_GOOGLE_PLACES_API_KEY
ENV VITE_GOOGLE_PLACES_API_KEY=$VITE_GOOGLE_PLACES_API_KEY

RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
