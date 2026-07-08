# ---- Build stage ----
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY package.json ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json vite.config.ts ./
COPY app/ ./app/
COPY public/ ./public/

RUN pnpm build

# ---- Production stage ----
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/.output ./.output
COPY --from=build /app/public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
