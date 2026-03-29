import { client } from "./redis.js";



export const createRevokeKey = ({userId , token})=>{
    return `revokeToken::${userId}::${token}`
}

export const set = async ({key , value , ttl} = {})=> {

    if( typeof value == "object"){
        value = JSON.stringify(value)
    }

    if(ttl){
        return await client.set(key ,  value , {EX : ttl})
    }else{
        return await client.set(key , value)
    }
}


export const increment = async (key)=>{
    return await client.incr(key)
}

export const get = async (key)=>{
    let data =  await client.get(key)
    // ----------------
    try {
        data = JSON.parse(data)
    } catch (error) {}
    return data
}

export const ttl = async (key) =>{
    return await client.ttl(key)
}

export const exists = async (key)=>{
    return await client.exists(key)
}

export const redis_delete = async (key)=>{
    return await client.del(key)
}

export const mget=async(...keys)=>{
    return await client.mGet(keys)
}

export const keys = async(prefix)=>{
    return await client.keys(`${prefix}*`)
}