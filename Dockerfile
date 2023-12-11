FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm i -g npm@latest
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build
EXPOSE 3586
CMD ["pnpm", "start"]