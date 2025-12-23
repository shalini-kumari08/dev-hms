#  Base image 
FROM node:20-alpine

#  Set working directory 
WORKDIR /usr/src/app

#  Install dependencies first (layer caching) 
COPY package*.json ./
RUN npm ci --only=production

#  Copy source code 
COPY . .

#  Environment 
ENV NODE_ENV=production

#  Expose app port 
EXPOSE 5000

#  Start server 
CMD ["node", "server.js"]
