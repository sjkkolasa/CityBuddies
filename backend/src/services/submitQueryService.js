// Import requirements to get a Sparql query.
const axios = require('axios')
const wbk = require('wikibase-sdk')

// Takes in SPARQL code as a parameter and sends the code to query.wikidata.org.
// Simplifies the response from wikidata before returning it.
exports.submitQuery = async (sparql) => {
    console.log(`submit query called with sparql: ${sparql}`)
    const wdk = wbk({
        instance: 'https://www.wikidata.org',
        sparqlEndpoint: 'https://query.wikidata.org/sparql'
    })

    const url = wdk.sparqlQuery(sparql)
    try {
        const results = await axios.get(url)
        let simplifiedResults = wbk.simplify.sparqlResults(results.data)
        return simplifiedResults
    }
    catch(error) {
        throw new Error(`(from sparql) ${error.message}` )
    }
}