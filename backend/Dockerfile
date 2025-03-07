FROM node:22-slim
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["node","./src/index.js"]
