# syntax=docker/dockerfile:1

# Node LTS (satisfies package.json `engines` >=22.12). The major tag tracks the
# latest LTS patch release.
ARG NODE_VERSION=24
# Pin pnpm to match the local toolchain (lockfile v9 / `allowBuilds:` => pnpm 11).
ARG PNPM_VERSION=11.9.0

# ── Base ──────────────────────────────────────────────────────────────────────
# Use corepack to provision a pinned, reproducible pnpm. The corepack bundled in
# the Node image is refreshed first — older copies ship an expired signing key
# that breaks `corepack prepare`.
FROM node:${NODE_VERSION}-slim AS base
ARG PNPM_VERSION
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    CI=1
RUN npm install -g corepack@latest \
    && corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

# ── Dependencies ──────────────────────────────────────────────────────────────
# Install the full dependency tree once, cached on the lockfile so it only
# re-runs when dependencies change. A shared store + BuildKit cache mount keeps
# repeat builds fast.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Prune to production-only dependencies for the runtime image (sharp, the node
# adapter, etc. are loaded at runtime by dist/server/entry.mjs).
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm prune --prod

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM base AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

# Drop privileges — the slim image ships a non-root `node` user.
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node
EXPOSE 4321

# Standalone node adapter entrypoint; honours HOST/PORT from the env above.
CMD ["node", "./dist/server/entry.mjs"]
