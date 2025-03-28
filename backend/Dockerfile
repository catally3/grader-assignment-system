FROM node:22-slim
WORKDIR /backendapp
COPY package.json /backendapp
RUN npm install
COPY . /backendapp
CMD ["node","./backend/src/index.js"]
