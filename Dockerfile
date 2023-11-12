FROM node:20.9.0-slim
WORKDIR /app
COPY package.json .
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi
COPY . ./
EXPOSE 3500
CMD ["node", "sever.js"]
