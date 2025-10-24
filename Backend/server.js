const http = require('http');
const app = require("./app");
const PORT = 3000;
const { initializeSocketConnection } = require('./Socket'); // Import socket initialization
const server = http.createServer(app);
initializeSocketConnection(server);
server.listen(PORT,()=>{console.log(`Server is running on ${PORT}`)});
