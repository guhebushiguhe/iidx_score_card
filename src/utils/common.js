// const Fuse = require('fuse.js')
// const { dictionary } = require('./loadDictionary')
import Fuse from 'fuse.js'
import { dictionary } from './loadDictionary'

const CNconvert = function (val) {
    const res = String(val).split('').map(i=>{
        return dictionary[i] || i
    }).join('')
    return res
}
const fuseSearch = function (keyWord, data, options, weight = 1) {
  options.keys = options.keys || [ 'title', 'artist' ]
  options.threshold = options.threshold || 0.3  // 匹配阈值，0.0完全匹配
  options.shouldSort = options.shouldSort || true  // 匹配结果包含匹配分数，0.0完全匹配
  options.includeScore = options.includeScore || true  // 匹配结果根据匹配阈值排序
  options.includeMatches = options.includeMatches || true  // default：false  匹配结果包含匹配字符串的索引，用于突出显示
  options.useExtendedSearch = options.useExtendedSearch || true // default: false  使用linux搜索指令
  const fuse = new Fuse(data, options)
  const fuseRes = fuse.search(keyWord).map(i=>Object.assign(i, {score: i.score*weight}))
  return fuseRes
}
const search = (keyWord, data, options = {}) => {
    options.keys = options.keys || [ 'title', 'artist' ]
    const fuseRes = fuseSearch(keyWord, data, options)
    let searchRes = fuseRes

    // A网数据 和 游戏xml数据 高度不匹配时，强制转换搜索
    const nameMap = {
      "𝆑𝆑𝆑𝆑𝆑": "fffff"
    }
    keyWord = nameMap[keyWord] || keyWord

    // 转日文汉字搜索
    const CNKeywor = CNconvert(keyWord)
    const CNFuseRes = fuseSearch(CNKeywor, data, options)
    if (CNFuseRes.length) {
      searchRes = [...searchRes, ...CNFuseRes]
    }

    let topRes = []
    // 完全匹配
    data.map((i, refIndex) => {
      if (i.title === keyWord) {
        topRes.push({
          item: i,
          refIndex,
          score: 0
        })
      }
    })
    if (topRes.length) {
      searchRes = [...topRes, ...searchRes]
    }
    
    // 只保留英文、数字、键盘符号、中文汉字、日文汉字、日文假名，再进行匹配
    if (!searchRes.length < 10) {
      const regx = /[a-zA-Z0-9\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff]/g
      if (keyWord.match(regx) && keyWord.match(regx).length >= 3) {
        const newKeyWord = keyWord.match(regx).join('')
        const newData = data.map(i => {
          const { title, artist , ...rest } = i
          return {
            temp: {
              title: title,
              artist: artist
            },
            title: title.match(regx) ? title.match(regx).join('') : title,
            artist: artist.match(regx) ? artist.match(regx).join('') : artist,
            ...rest
          }
        })
        let exFuseRes = fuseSearch(newKeyWord, newData, options)
        if (exFuseRes.length) {
          exFuseRes = exFuseRes.map(({item, ...rest}) => {
            const { title, artist, temp, ...rest1 } = item
            return {
              item: {
                title: temp.title,
                artist: temp.artist,
                ...rest1
              },
              ...rest
            }
          })
          // if(!exFuseRes.length) {
          //   console.log('exFuse empty', keyWord)
          // }
          const newFuseRes = exFuseRes.filter(i => !searchRes.map(j => j.item.id).includes(i.item.id))
          searchRes = [...searchRes, ...newFuseRes]
        }
      }
    }

    // 去重
    if(searchRes.length) {
      const ids = searchRes.map(i => i.item.id)
      const uniqueIds = ids.filter((i, index) => ids.indexOf(i) === index)
      searchRes = uniqueIds.map(i => searchRes.find(j => j.item.id === i))
    }

    return searchRes
}

// module.exports = { search }
export default {
  search
}