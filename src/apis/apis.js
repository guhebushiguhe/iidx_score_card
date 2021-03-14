import axios from './axios'

function getProfiles (djName) {
    return axios.get('/api/v1/iidx/27/profiles/',{
        params: {
          'dj_name': djName
        }
    })
}
function getScores (id,pos) {
    return axios.get('/api/v1/iidx/27/player_bests/',{
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

export default {
    getProfiles,
    getScores
}