export function parseUrl(url) {
    if (url.includes(":")) {
        return url
    } else {
        // add http protocol by default if url contains no protocol
        return "http://" + url;
    }
}

export function isValidUrl(url) {
    try {
        new URL(url);
        console.log("valid URL")
        return true;
    } catch (err) {
        console.log("invalid URL")
        return false;
        
    }
}

export function isValidShortUrl(url) {
    // cannot must not be empty and must not contain whitespaces or "."
    return !(
        url.length === 0
        || url.includes(" ") 
        || url.includes(".")
    );
}