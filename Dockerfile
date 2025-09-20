# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.18.0

FROM node:${NODE_VERSION}-bullseye-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source and build the Angular SSR bundle
COPY . .
RUN npm run build


FROM node:${NODE_VERSION}-slim AS runner

ENV NODE_ENV=production \
    PORT=4000

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy build artifacts from the builder image
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/exchange-app/server/server.mjs"]
