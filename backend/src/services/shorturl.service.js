import { saveShortUrl, shortUrlExists } from "../dao/shorturl.dao.js";
import { generateNanoId } from "../utils/helper.js"

export const shorturlServiceWithoutUser = async (url, slug=null) => {

    let shorturl = slug || generateNanoId(7);

    const exists = await shortUrlExists(shorturl);
    if(exists){
        throw new Error("Custom slug is already taken. Please choose another one.");
    }
    const saveUrl = await saveShortUrl(url, shorturl);
    console.log("Saved Short Url :", saveUrl);

    return `${process.env.APP_URL}${shorturl}`;
}

export const shorturlServiceWithUser = async (url, slug=null, userId) => {

    let shorturl = slug || generateNanoId(7);
    const exists = await shortUrlExists(shorturl);
    if(exists){
        throw new Error("Custom slug is already taken. Please choose another one.");
    }
    const saveUrl = await saveShortUrl(url, shorturl, userId);
    console.log("Saved Short Url :", saveUrl);

    return `${process.env.APP_URL}${shorturl}`;
}