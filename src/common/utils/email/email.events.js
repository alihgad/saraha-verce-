import { EventEmitter } from "events";
import { set } from "../../../database/redis.service.js";
import { sendEmail } from "./sendEmail.js";
import { generateHash } from "../../hash/hash.js";

export let event = new EventEmitter()


event.on("verifyEmail", async (data) => {
    console.log(data);
    
    let {userId , email} = data

    let code = Math.floor(Math.random() * 10000)
    code = code.toString().padEnd(4, 0)

    set({
        key: `otp::${userId}`,
        value: await generateHash(code),
        ttl: 60 * 5
    })

    await sendEmail({
        to: email,
        subject: "verfiy your email bsor3a",
        html: `<h1>Hello</h1> 
                <p>${code} </p>
            `
    })
})