# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite inlines VITE_* env vars into the bundle at BUILD time, not at
# container start — so this has to be a build arg, not a runtime env var.
# Since the browser (not the frontend container) is what calls the API,
# this must be an address the browser can reach: the backend's port
# published to the host, not the backend's in-network container name.
ARG VITE_API_BASE_URL=http://localhost:4000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ---- runtime stage ----
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
