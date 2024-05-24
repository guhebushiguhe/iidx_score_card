const fs = require('fs');
// const path = require('path');
const { music_charts } = require('./arcana_data')
const { search } = require('./common')
const { iidx_data: binData } = require('./iidx_data.js')

let newData = {}
// let binData
// try {
//   binData = JSON.parse(fs.readFileSync('./iidx_data.json'))
// } catch (err) {
//   throw(new Error('No data found!', err))
// }

// if (!binData) {
//   throw(new Error('No data found!'))
// }
const binDataTitles = Object.values(binData.sp).map(i => i.title)

const matchTitles = Object.values(music_charts).map(i => {
  if (binDataTitles.includes(i.title)) {
    return true
  } else {
    const fuseRes = search(i.title, Object.values(binData.sp))
    if (fuseRes.length > 0) {
      // const folder = fuseRes[0].item.folder
      // if (folder + '' === i.folder + '') {
      //   return true
      // }
      newData[i.music_id] = Object.assign({}, i, {bin_id: fuseRes[0].item.id})
      return true
    }
  }
  console.log('未匹配', i.title, i.folder)
  return false
})

fs.writeFileSync('./new_arcana_data.json', JSON.stringify(newData))

console.log('binDataTitles.length', binDataTitles.length)
console.log('arcana数据量', Object.keys(music_charts).length)
console.log('完全匹配title量', matchTitles.length)