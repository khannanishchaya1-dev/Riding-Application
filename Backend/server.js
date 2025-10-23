const http = require('http');
const app = require("./app");
const PORT = 3000;
const {initializeSocketConnection}=require('./socket');
const server = http.createServer(app);
server.listen(PORT,()=>{console.log(`Server is running on ${PORT}`)});
