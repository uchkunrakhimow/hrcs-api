FROM oven/bun:1.2.22 AS build

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bunx prisma generate
RUN bun run build --compile --minify-whitespace --minify-syntax --outfile server src/index.ts

FROM debian:bookworm-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgcc-s1 \
    libssl3 \
    ca-certificates \
    wget \
    gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

COPY --from=build /app/server server
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src/generated ./generated

EXPOSE 3000

CMD ["./server"]
