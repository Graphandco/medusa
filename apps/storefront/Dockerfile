FROM node:22-alpine AS builder

RUN npm install -g pnpm@10.11.1

WORKDIR /server

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/

RUN pnpm install --frozen-lockfile --filter @dtc/storefront...

COPY apps/storefront ./apps/storefront

ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DEFAULT_REGION=dk

ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION

RUN pnpm --filter @dtc/storefront build

FROM node:22-alpine AS runner

RUN npm install -g pnpm@10.11.1 \
  && addgroup -S nodejs && adduser -S nextjs -G nodejs

WORKDIR /server

COPY --from=builder --chown=nextjs:nodejs /server /server

USER nextjs

ENV NODE_ENV=production
EXPOSE 8000

WORKDIR /server/apps/storefront
CMD ["pnpm", "start"]
