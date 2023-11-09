const Redis = require("ioredis");

const getRedisURL = () => {
  if (process.env.REDIS) {
    return process.env.REDIS;
  }
  throw new Error('REDIS URL NOT DEFINED WITH "REDIS" VARIABLE IN ENV');
};

const redis = new Redis(getRedisURL());


module.exports = redis
