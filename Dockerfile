FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++ \
  && npm install -g pnpm@10.11.1

WORKDIR /server

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/

RUN pnpm install --frozen-lockfile --filter @dtc/backend...

COPY apps/backend ./apps/backend

WORKDIR /server/apps/backend
RUN pnpm build

FROM node:22-alpine AS runner

RUN apk add --no-cache python3 make g++ \
  && addgroup -S medusa && adduser -S medusa -G medusa

WORKDIR /server

COPY --from=builder --chown=medusa:medusa /server/apps/backend/.medusa/server ./

RUN npm install --omit=dev \
  && npm cache clean --force

USER medusa

ENV NODE_ENV=production
EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
