const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const FILES = [
  path.join(__dirname, 'Albergues - Camino Finistere  Muxia.kml'),
  path.join(__dirname, 'Albergues - Camino Frances - Galicia.kml'),
  path.join(__dirname, 'Albergues - St Jean to Santiago.kml')
]

const CONTENTS = FILES.map(fpath => fs.readFileSync(fpath).toString())
const ALBERGUES = CONTENTS.reduce((acc, content) => {
  const $ = cheerio.load(content)
  const places = $('Placemark').map((index, placemark) => {
    const name = $(placemark).find('name').text().trim().replace('\n', '')
    if (!name) console.log('!!!')
    const [lng, lat, _] = $(placemark).find('coordinates').text().trim().split(',')
    return { name, lat, lng }
  }).get()

  return acc.concat(places)
}, [])

const MUTATION_OPERATIONS = ALBERGUES.map(({ name, lat, lng }) => {
  if (!name) return ''

  const mutationName = `${name}${lat}${lng}`.replace(/[^\w]/g, '')

  return `  ${mutationName}: createLocation(
    name: "${name}",
    latitude: ${lat},
    longitude: ${lng}
  ) {
    id,
    name,
    latitude,
    longitude
  }`
})

const IMPORT_MUTATION = `mutation ImportAlbergues {
${MUTATION_OPERATIONS.join('\n\n')}
}`

const DEST_FILE = path.join(__dirname, 'albergues.graphql')
fs.writeFileSync(DEST_FILE, IMPORT_MUTATION)
