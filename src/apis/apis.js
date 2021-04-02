import axios from './axios'

const acana_baseURL = 'https://arcana.nu'
const netease_baseURL = 'https://apimusic.linweiqin.com'

function getProfiles (djName) {
    return axios.get(acana_baseURL+'/api/v1/iidx/27/profiles/',{
        params: {
          'dj_name': djName
        }
    })
}
function getScores (id,pos) {
    return axios.get(acana_baseURL+'/api/v1/iidx/27/player_bests/',{
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

function getSongUrl (id) {
    return axios.get(netease_baseURL+"/song/url",{
        params:{
            id: id,
        }
    })
}

export default {
    getProfiles,
    getScores,
    getSongUrl
}