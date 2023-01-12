FROM node:16-bullseye

RUN apt update
RUN apt install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node package*.json ./
COPY --chown=node dist ./dist
COPY --chown=node public ./public
COPY --chown=node views ./views

RUN npm install --omit=dev
EXPOSE 3000

CMD ["node", "dist/index.js"]
