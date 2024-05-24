const fs = require('fs')
const { music_charts } = require('./arcana_data.js')

let newData = {}

music_charts.map(({ bin_id, music_id, music }) => {
  const { _links: musicLinks, ...musicRest } = music
  if (!bin_id && !newData[music_id]) {
    newData[music_id] = {
      ...musicRest,
    }
  }
})

fs.writeFileSync('./new_arcana_data.json', JSON.stringify(newData))