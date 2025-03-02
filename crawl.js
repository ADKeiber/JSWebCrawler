const {JSDOM} = require("jsdom")

async function crawlPage(currentURL) {
    console.log(`Actively crawling: ${currentURL}`)
    try {
        
        const resp = await fetch(currentURL)
        if(resp.status > 399){
            console.log(`ERROR IN FETCH.. status code ${resp.status} on page: ${currentURL}`)
            return
        }
        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`NON-HTML RESPONSE.. content type ${contentType} on page: ${currentURL}`)
            return
        }
        console.log(await resp.text())
    } catch (err) {
        console.log(`Error in fetch:  "${err}", on page: ${currentURL}`)
    }

}

function normalizeURL(urlString) {
    const urlObject = new URL(urlString)
    const path = `${urlObject.hostname}${urlObject.pathname}`
    if(path.length > 0 && path.slice(-1) === "/") {
        return path.slice(0, -1)
    }
    return path
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for( const element of linkElements) {
        if (element.href.slice(0, 1) === '/') {
            //relative
            try {
                const urlObj = new URL(`${baseURL}${element.href}`)
                urls.push(urlObj.href)
            } catch (err){
                console.log(`error with relative url: ${err.message}`)
            }
            
        } else {
            //absolute
            try {
                const urlObj = new URL(element.href)
                urls.push(urlObj.href)
            } catch (err){
                console.log(`error with absolute url: ${err.message}`)
            }
        }  
    }
    return urls
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
} //exports methods to be used elsewhere