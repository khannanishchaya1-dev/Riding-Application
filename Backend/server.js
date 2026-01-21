const http = require('http');
const app = require("./app");
const PORT = process.env.PORT || 4000;
const { initializeSocketConnection } = require('./socket'); // Import socket initialization
const server = http.createServer(app);
initializeSocketConnection(server);
server.listen(PORT,()=>{console.log(`Server is running on ${PORT}`)});
