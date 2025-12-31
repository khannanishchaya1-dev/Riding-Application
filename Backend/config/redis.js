// Backend/config/redis.js
const { createClient } = require("redis");

const redis = createClient();

redis.connect()
  .then(() => console.log("Redis Connected"))
  .catch(err => console.error("Redis Error", err));

module.exports = redis;
