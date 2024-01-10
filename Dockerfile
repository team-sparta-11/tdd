FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY package*.json .
RUN npm install -g pnpm
RUN pnpm install
COPY . .
ENV NODE_ENV production
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]