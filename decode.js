const {JSDOM} = require("jsdom")

async function main() {
    decodeMessage("https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub")
}

main()



async function decodeMessage(url){
  
    try {

        const resp = await fetch(url)
        if(resp.status > 399){
            console.log(`ERROR IN FETCH.. status code ${resp.status} at URL: ${url}`)
            return pages
        }
        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`NON-HTML RESPONSE.. content type ${contentType} at URL: ${url}`)
            return pages
        }
        const htmlBody = await resp.text()

        const decodedData = getData(htmlBody)
        
        var xIndex = 0
        var yIndex = 0
        var lineData = ""
        console.log(decodedData[0][1])
        for(let i = 0 ; i < decodedData.length; i++){
            let datum = decodedData[i]
            if(datum[2] == yIndex){
                if(xIndex == datum[0]){
                    lineData += datum[1]
                } else {
                    while(xIndex < datum[0]){
                        lineData += "a"
                        xIndex++
                    }
                    lineData += datum[1]
                }
                
            }
            
            // else {
            //     yIndex++
            //     xIndex = 0
            //     console.log(lineData)
            //     lineData = ""
            // }
        }
    } catch (err) {
        console.log(`Error in fetch:  "${err}", on page: ${url}`)
    }
  
}

function getData(htmlBody){

    var data = []
    const dom = new JSDOM(htmlBody)
    var document = dom.window.document

    var tableCells = document.evaluate("//tbody//descendant::span[not(contains(text(),'x-coordinate')) and  not(contains(text(),'y-coordinate'))  and not(contains(text(),'Character'))]", document, null, dom.window.XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    
    let node = tableCells.iterateNext();
    while (node) {

        let value = [ 
            parseInt(node.textContent), 
            tableCells.iterateNext().textContent.trim().codePointAt(0).toString(16), 
            parseInt(tableCells.iterateNext().textContent)]
        console.log(value)
        data.push(value)

        node = tableCells.iterateNext()

    }

    sortData(data, 1, 0)


    return data
}

function sortData(array) {
    array.sort((a, b) => {
    if (a[0] < b[0]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1;
    }
    if (a[2] < b[2]) {
      return -1;
    }
    if (a[2] > b[2]) {
      return 1;
    }
    return 0;
  });
}
