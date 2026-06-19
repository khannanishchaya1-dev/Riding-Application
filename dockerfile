#Duild the Frontend (/dist Folder)
FROM node:20-alpine as frontend-builder
COPY ./Frontend /app
WORKDIR /app
RUN npm install
RUN npm run build

#Copy dist into Backend /public(Frontend /dist --> Backend/public)
FROM node:20-alpine
COPY ./Backend /app
WORKDIR /app
RUN npm install
COPY --from=frontend-builder /app/dist /app/public
CMD ["node","server.js"]