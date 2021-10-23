import axios from './axios'

const globalConfigStr = localStorage.getItem('globalConfig')
let version = '27'
if (globalConfigStr) {
    version = JSON.parse(globalConfigStr).version
}

const arcana_baseURL = 'https://arcana.nu'
const netease_baseURL = 'https://apimusic.linweiqin.com'

function getProfiles (djName) {
    return axios.get(arcana_baseURL+`/api/v1/iidx/${version}/profiles/`,{
        params: {
          'dj_name': djName
        }
    })
}
function getScores (id,pos) {
    return axios.get(arcana_baseURL+`/api/v1/iidx/${version}/player_bests/`,{
    params:pos?
    {
        profile_id: id,
        __pos: pos,
    }:
    {
        profile_id: id
    }
    })
}
function getChartsByMusicId (music_id) {
    return axios.get(arcana_baseURL+`/api/v1/iidx/${version}/charts/`,{
        params:{
            music_id, music_id,
            omnimix: true,
        }
    })
}
function getQpros (id) {
    return axios.get(arcana_baseURL+`/api/v1/iidx/${version}/qpros/`+id)
}

function getSongUrl (id) {
    return axios.get(netease_baseURL+"/song/url",{
        params:{
            id: id,
        }
    })
}
function getSongDetails (id) {
    return axios.get(netease_baseURL+'/song/detail?ids='+id)
}



export default {
    getProfiles,
    getScores,
    getChartsByMusicId,
    getQpros,
    getSongUrl,
    getSongDetails,
}