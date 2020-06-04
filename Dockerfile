FROM node:12 
COPY . .
RUN npm install
RUN npm install -g typescript
RUN rm -rf ./built
RUN tsc
CMD [ "node", "./built/index.js"]
