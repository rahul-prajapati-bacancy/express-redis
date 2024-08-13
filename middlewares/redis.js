const { createClient } = require("redis");
const hash = require("object-hash")

let redisClient = undefined;

const initializeRedisClient = async () => {
    let redisURL = process.env.REDIS_URI
    if (redisURL) {
        redisClient = createClient({ url: redisURL }).on("error", (e) => {
            console.error(`Redis client connection failed:`);
            console.error(e);
        });
        try {
            await redisClient.connect();
            console.log(`Connected to Redis successfully!`);
        } catch (err) {
            console.error(`Redis client connection failed:`);
            console.error(err);
        }
    }
}

const isRedisConnected = () => {
    return !!redisClient?.isOpen;
}

const requestToKey = (req) => {
    const reqDataToHash = {
        query: req.query,
        body: req.body,
    };
    return `${req.path}@${hash.sha1(reqDataToHash)}`;
}

const writeRedisCacheData = async (params) => {
    const { key, data, options } = params;
    if (isRedisConnected()) {
        try {
            await redisClient.set(key, data, options)
        } catch (err) {
            console.error("Error getting key data from redis db.", err)
        }
    }
}

const readRedisCacheData = async (params) => {
    const { key } = params;
    let cacheData = null;
    if (isRedisConnected()) {
        cacheData = await redisClient.get(key);
        if (cacheData) {
            return cacheData;
        }
    }
}

const redisCacheMiddleware = (options = {
    EX: 21600
}) => {
    return async (req, res, next) => {
        if (isRedisConnected()) {
            const key = requestToKey(req);
            const cachedValue = await readRedisCacheData({ key });
            if (cachedValue) {
                try {
                    return res.json(JSON.parse(cachedValue));
                } catch {
                    return res.send(cachedValue);
                }
            } else {
                const oldSend = res.send;
                res.send = function (data) {
                    res.send = oldSend;
                    if (res.statusCode.toString().startsWith("2")) {
                        writeRedisCacheData({
                            key, data, options
                        }).then();
                    }
                    return res.send(data);
                };
                next();
            }
        } else {
            next();
        }
    };
}

module.exports = {
    initializeRedisClient,
    requestToKey,
    isRedisConnected,
    writeRedisCacheData,
    readRedisCacheData,
    redisCacheMiddleware
}