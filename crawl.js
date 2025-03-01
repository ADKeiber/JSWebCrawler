function normalizeURL(urlString) {
    const urlObject = new URL(urlString)
    const path = `${urlObject.hostname}${urlObject.pathname}`

    if(path.length > 0 && path.slice(-1) === "/") {
        return path.slice(0, -1)
    }
    return path
}

module.exports = {
    normalizeURL
} //exports methods to be used elsewhere