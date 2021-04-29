import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";

const safeFetch = (info: RequestInfo, init: RequestInit): Promise<Response> => new Promise(async (resolve, reject) => {
    let rejected = false;
    const data = (await fetch(info, init).catch(() => {
        rejected = true;
        return reject();
    })) as Response;

    if (rejected) return;
    if (data.status === 429)
        return new Promise(async resolve_ => setTimeout(await data.json().then(r => r.retry_after), resolve_ as any)).then(() => resolve(safeFetch(info, init)));

    resolve(data);
})

export default safeFetch;