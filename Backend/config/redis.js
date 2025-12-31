
let redis;
if (process.env.NODE_ENV === "production") {
  const { Redis } = require("@upstash/redis");
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  const { createClient } = require("redis");
  redis = createClient();
  redis.connect().then(()=>console.log("Redis Connected")).catch((err)=>console.log("Redis Error", err));
}

module.exports = redis;
