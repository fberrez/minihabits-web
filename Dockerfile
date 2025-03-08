FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
# Install ALL dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile
COPY . .
# Build the application
RUN pnpm run build

FROM node:20-alpine AS prod
WORKDIR /app
# Copy the built files
COPY --from=build /app/dist ./dist
# Install serve to host the static files
RUN npm install -g serve
# Expose port 80
EXPOSE 80
# Command to serve static files with proper SPA routing
CMD ["serve", "-s", "dist", "-l", "80"] 