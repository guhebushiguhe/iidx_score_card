import axios from './axios'

const arcana_baseURL = 'https://arcana.nu'
const netease_baseURL = 'https://apimusic.linweiqin.com'

function getProfiles (djName) {
    return axios.get(arcana_baseURL+'/api/v1/iidx/27/profiles/',{
        params: {
          'dj_name': djName
        }
    })
}
function getScores (id,pos) {
    return axios.get(arcana_baseURL+'/api/v1/iidx/27/player_bests/',{
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
    return axios.get(arcana_baseURL+`/api/v1/iidx/27/charts/`,{
        params:{
            music_id, music_id,
            omnimix: true,
        }
    })
}

function getSongUrl (id) {
    return axios.get(netease_baseURL+"/song/url",{
        params:{
            id: id,
        }
    })
}

function getQpros (id) {
    return axios.get(arcana_baseURL+'/api/v1/iidx/27/qpros/'+id)
}

export default {
    getProfiles,
    getScores,
    getChartsByMusicId,
    getSongUrl,
    getQpros
}