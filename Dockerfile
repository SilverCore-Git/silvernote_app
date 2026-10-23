# SilverNote app - Vue 3 + Vite, build (npm) puis service statique par nginx
FROM node:22-alpine AS build
WORKDIR /app

# Vite lit import.meta.env à la compilation : ces valeurs sont figées dans le
# bundle (publiques côté navigateur, fournies par le CI).
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_PDFSHIFT_KEY
ARG VITE_DISCORD_ISSUE_WH
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY \
    VITE_PDFSHIFT_KEY=$VITE_PDFSHIFT_KEY \
    VITE_DISCORD_ISSUE_WH=$VITE_DISCORD_ISSUE_WH \
    PUPPETEER_SKIP_DOWNLOAD=1

COPY package.json package-lock.json ./
# Conflit de peers tiptap v2/v3 déjà présent dans le projet
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
