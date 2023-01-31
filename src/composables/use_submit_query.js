const axios = require("axios")
const wbk = require("wikibase-sdk")

export function use_submit_query() {
    async function submit_query(sparql) {
        const wdk = wbk({
          instance: 'https://www.wikidata.org',
          sparqlEndpoint: 'https://query.wikidata.org/sparql'
          })
      
        const url = wdk.sparqlQuery(sparql)
        const results = await axios.get(url)
        let simplifiedResults = wbk.simplify.sparqlResults(results.data)
        return simplifiedResults
      }

    return { submit_query }
}