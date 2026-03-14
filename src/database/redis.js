import { createClient } from "redis"
import { env } from "../../config/index.js"
console.log(env.REDIS_URI);

export const client = createClient({
    url: env.REDIS_URI
});

client.on("error", function (err) {
    throw err;
});

export const connectRedis = async () => {
    try {
        await client.connect();
        console.log("redis connected");
    } catch (error) {
        console.log(error);

    }
}

// Disconnect after usage
