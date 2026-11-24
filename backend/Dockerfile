FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Create uploads directory owned by node user
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

ENV NODE_ENV=production

USER node

EXPOSE 5000

# Run init script (seed admin + categories) then start the server
CMD ["sh", "-c", "node init.js && npm start"]
