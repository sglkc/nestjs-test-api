# https://pnpm.io/docker#example-1-build-a-bundle-in-a-docker-container

# Stage 1: Base setup
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable # always redownload pnpm from corepack on run
RUN npm i -g pnpm
WORKDIR /app

# Stage 2: Development dependencies (cache-friendly)
FROM base AS dev-deps
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Stage 3: Production dependencies
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Stage 4: Build stage
FROM base AS build
COPY --from=dev-deps /app/node_modules /app/node_modules
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm run build

# Stage 5: Final production image
FROM base AS production
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY package.json .

EXPOSE 3000
CMD [ "pnpm", "start:prod" ]
