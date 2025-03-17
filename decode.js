const {JSDOM} = require("jsdom")

async function main() {
    // decodeMessage("https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub")
    decodeMessage("https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub")
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
        
        var currentXIndex = 0
        var yIndex = decodedData[0][2]
        var lineData = ""
        var index = 0
        while(index < decodedData.length){
            let datum = decodedData[index]

            if(datum[2] != yIndex || index + 1 == decodedData.length){
                currentXIndex = 0
                yIndex--
                console.log(lineData)
                lineData = ""
            }

            while(datum[0] > currentXIndex){
                currentXIndex++
                lineData += " "
            }
            lineData += String.fromCharCode(datum[1])
            currentXIndex++
            index++
        }


        // var index = 0
        // while(index < decodedData.length){
        //     let datum = decodedData[index]

        //     if(datum[2] != yIndex || index + 1 == decodedData.length){
        //         currentXIndex = 0
        //         yIndex++
        //         console.log(lineData)
        //         lineData = ""
        //     }

        //     while(datum[0] > currentXIndex){
                
        //         currentXIndex++
        //         lineData += " "
        //     }

        //     lineData += String.fromCharCode(datum[1])
        //     currentXIndex++
        //     index++
        // }

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
            tableCells.iterateNext().textContent.trim().codePointAt(0), 
            parseInt(tableCells.iterateNext().textContent)]
        data.push(value)

        node = tableCells.iterateNext()

    }

    sortData(data)
    console.log(data)

    return data
}

function sortData(array) {
    array.sort((a, b) => {
    
    if (a[2] < b[2]) {
      return 1;
    }
    if (a[2] > b[2]) {
      return -1;
    }
    if (a[0] < b[0]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1;
    }
    return 0;
  });
}
