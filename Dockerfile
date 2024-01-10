FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY package*.json .
RUN npm install -g pnpm
RUN pnpm install
COPY . .
ENV NODE_ENV production
RUN npm run build
# RUN npm run seed:run // TODO in real deployment
EXPOSE 3000
CMD ["npm", "run", "start:prod"]