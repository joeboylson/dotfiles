FROM mcr.microsoft.com/playwright:v1.50.0-jammy

# VS Code (stable) from Microsoft's apt repo
RUN apt-get update && apt-get install -y --no-install-recommends \
      wget gpg xvfb libasound2 libgbm1 libnss3 libxss1 libsecret-1-0 \
 && wget -qO- https://packages.microsoft.com/keys/microsoft.asc \
      | gpg --dearmor > /usr/share/keyrings/microsoft.gpg \
 && echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/code stable main" \
      > /etc/apt/sources.list.d/vscode.list \
 && apt-get update && apt-get install -y --no-install-recommends code \
 && rm -rf /var/lib/apt/lists/*

# Geist Mono, so screenshots aren't stuck with the default DejaVu Sans Mono.
RUN apt-get update && apt-get install -y --no-install-recommends unzip fontconfig \
 && mkdir -p /usr/share/fonts/truetype/code && cd /tmp \
 && wget -q -O geist.zip https://github.com/vercel/geist-font/releases/download/v1.7.2/geist-font-v1.7.2.zip \
 && unzip -qo geist.zip -d geist \
 && find geist -iname 'GeistMono*.ttf' -exec cp {} /usr/share/fonts/truetype/code/ \; \
 && fc-cache -f \
 && rm -rf /tmp/geist /tmp/geist.zip /var/lib/apt/lists/*

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev

COPY shoot.mjs states.mjs entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENV DISPLAY=:99
ENTRYPOINT ["./entrypoint.sh"]
