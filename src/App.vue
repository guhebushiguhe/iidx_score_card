<template>
  <div id="app">
    <p class="time">{{new Date().toLocaleString()}}<span v-html="'&nbsp;&nbsp;&nbsp;&nbsp;'"></span>v1.01</p>
    <h2 class="title">IIDX查分器</h2>
    <div class="box search-box">
      <span>DJName </span><input type="text" v-model="djName" @keypress.enter="getProfiles" ref="nameInp">
      <span>lv </span><input type="text"  v-model="lv">
      <button type="button" @click="getProfiles" :disabled="isLoading">搜索</button><br>
      <span
        v-for="item in playStyleList"
        :key="item.value"
      >
        <input
          type="radio"
          class="radio"
          v-model="playStyle"
          :value="item.value"
          :id="item.value"
        >
        <label :for="item.value">{{item.label}}</label>

      </span>
    </div>
    <div
      class="box profiles-box"
      v-if="profiles"
    >
      <p>
        <span>DJName: <span class="djName">{{profiles.djName}}</span></span>
        <!-- <span>iidxID: {{profiles.iidxID}}</span> -->
      </p>
      <p v-if="playStyle=='SINGLE' || playStyle=='ALL'">
        SP Rank: {{profiles.sp.rank}}, Plays: {{profiles.sp.plays}}, DJ Points: {{profiles.sp.djPoints}}
      </p>
      <p v-if="playStyle=='DOUBLE' || playStyle=='ALL'">
        DP Rank: {{profiles.dp.rank}}, Plays: {{profiles.dp.plays}}, DJ Points: {{profiles.dp.djPoints}}
      </p>
    </div>
    <div class="box score-box">
      <p v-if="isLoading">加载中，请耐心等候···</p>
      <ul v-if="scores.length>0 && !isLoading">
        <li
          v-for="item in scores"
          :key="item.label"
          class="score"
        >
        <span>{{item.label}}</span>
        <span>{{item.value}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      djName: '',
      lv: 'ALL',
      playStyle: 'ALL',
      isLoading: false,
      isNameSelectShow: false,
      profiles: null,
      qpros: {
          _id: "XXXX",
          _etag: "XXXX",
          head: "XXXX",
          hair: "XXXX",
          hand: "XXXX",
          face: "XXXX",
          body: "XXXX"
      },
      scores: [],
      scoresData:{},
      idsList:{},
      playStyleList: [
        {
          label: 'ALL',
          value: 'ALL'
        },
        {
          label: 'SP',
          value: 'SINGLE'
        },
        {
          label: 'DP',
          value: 'DOUBLE'
        },
      ],
      gradeList: [
        {
          grade: 'MAX',
          min: 1,
          max: 2
        },
        {
          grade: 'MAX-',
          min: 0.9445,
          max: 1
        },
        {
          grade: 'AAA',
          min: 0.8888,
          max: 0.9445
        },
        {
          grade: 'AA',
          min: 0.7777,
          max: 0.8888
        },
        {
          grade: 'A',
          min: 0.6666,
          max: 0.7777
        },
        {
          grade: 'B',
          min: 0.5555,
          max: 0.6666
        },
        {
          grade: 'C',
          min: 0.4444,
          max: 0.5555
        },
        {
          grade: 'D',
          min: 0.3333,
          max: 0.4444
        },
        {
          grade: 'E',
          min: 0.2222,
          max: 0.3333
        },
        {
          grade: 'F',
          min: 0.2222,
          max: 0
        },
      ]
    }
  },
  methods: {
    async getProfiles() {
      const djName = this.djName
      if (djName==''){
        alert('请输入DJ NAME')
        return
      }
      const lv = this.lv
      this.lv=lv==''?'ALL':lv
      const idsList = this.idsList
      const id = idsList[djName] || null
      const scoresData = this.scoresData
      if( idsList[djName] ){
        this.parseScores(scoresData[id])
        return
      }
      this.profiles = null
      this.scores = []
      this.isLoading = true
      const data = await this.$axios.getProfiles(djName)
      let index = 0
      if(data._items.length>1){
        // this.isNameSelectShow = true
        data._items.sort((a,b)=>{
          const timeA = new Date(a.access_time).getTime()
          const timeB = new Date(b.access_time).getTime()
          return timeB-timeA
        })
        const nameStr = '重名记录，请输入序号(默认按最近登录时间倒序)\n'+data._items.map(({dj_name,iidx_id,sp,dp},index)=>{
          return `\n${index+1}  DJ NAME ${dj_name}  IIDX ID ${iidx_id}
          SP Rank${sp.rank}  Plays${sp.plays}  DJ Points${sp.dj_points}
          DP Rank${dp.rank}  Plays${dp.plays}  DJ Points${dp.dj_points}`
        }).join('')
        const indexStr = window.prompt(nameStr,'1')
        index = indexStr==''?0:indexStr-1
      }
      const _items = data['_items'][index]
      const {dj_name,iidx_id,sp,dp,_id} = _items
      this.idsList[djName]=_id
      this.profiles = {
        djName: dj_name,
        iidxID: iidx_id,
        sp: {
          rank: sp.rank,
          plays: sp.plays,
          djPoints: sp.dj_points,
        },
        dp: {
          rank: dp.rank,
          plays: dp.plays,
          djPoints: dp.dj_points,
        },
      },
      this.$forceUpdate()
      this.getScores()
    },
    async getScores() {
      const id = this.idsList[this.djName] || null
      let _next = null
      let pos = null
      let resData = {
        _items: [],
        _links: {},
        _related: {
          charts:[],
          music:[],
          profiles:[]
        }
        
      }
      do {
        const data = await this.$axios.getScores(id,pos)
        const {_items,_links,_related} = data
        const {charts,music,profiles} = _related
        resData._items.push(..._items)
        resData._related.charts.push(...charts)
        resData._related.music.push(...music)
        resData._related.profiles.push(...profiles)
        _next=_links._next
        pos = data._items[249]?data._items[249]._id:null
      }while(_next)
      this.isLoading = false
      // 手动添加grade
      resData._items.map(item=>{
        const {notes,play_style} = resData._related.charts.filter(i=>i._id==item.chart_id)[0]
        item.grade = item.ex_score / notes / 2
      })
      this.scoresData[id]=resData
      this.parseScores(resData)
    },
    async parseScores(data) {
      const gradeList = this.gradeList
      const {_items,_links,_related} = data
      const lv = this.lv
      let idList = []
      const lvList = ['1','2','3','4','5','6','7','8','9','10','11','12']
      const playStyle = this.playStyle
      if(playStyle!="ALL"){
        idList = _related.charts.filter(item=>item.play_style==playStyle).map(({_id,rating,play_style})=>{
          return {
            _id,
            rating,
            play_style
          }
          })
      }else{
        idList = _related.charts
      }
      if (!lv || lv=='ALL') {
        idList =  idList.map(item=>item._id)
      }else if(!lvList.includes(lv)){
        alert('lv不合法，请重新输入')
      }else {
        idList =  idList.filter(({rating})=>rating==lv).map(item=>item._id)
      }
      const musicList = _items.filter(item=>idList.includes(item['chart_id']))
      // const djName = _related.profiles[0]['dj_name']
      const totalCount = musicList.length
      const FCCount = musicList.filter(item=>item.lamp == 'FULL_COMBO').length
      const EXHCCount = musicList.filter(item=>item.lamp == 'EX_HARD_CLEAR').length
      const HCCount = musicList.filter(item=>item.lamp == 'HARD_CLEAR').length
      const NCCount = musicList.filter(item=>item.lamp == 'CLEAR').length
      const ACCount = musicList.filter(item=>item.lamp == 'ASSIST_CLEAR').length
      const ECCount = musicList.filter(item=>item.lamp == 'EASY_CLEAR').length
      const FCount = musicList.filter(item=>item.lamp == 'FAILED').length
      const clearRate = ((totalCount - FCount)/totalCount*100).toFixed(2)+'%'

      let res = {
        totalCount,
        FCCount,
        EXHCCount,
        HCCount,
        NCCount,
        ACCount,
        ECCount,
        FCount,
        clearRate
      }

      gradeList.map(item=>{
        res[item.grade] = musicList.filter(i=>i.grade >= item.min && i.grade < item.max).length
      })

      const labelList = {
          totalCount:`lv.${lv?lv:'ALL'}`,
          FCCount: 'FC',
          EXHCCount: 'EXHC',
          HCCount: 'HC',
          NCCount: 'NC',
          ACCount: 'AC',
          ECCount: 'EC',
          FCount: 'Failed',
          clearRate: 'CLEAR RATE',
          MAX: 'MAX',
          'MAX-': 'MAX-',
          AAA: 'AAA',
          AA: 'AA',
          A: 'A',
          B: 'B',
          C: 'C',
          D: 'D',
          E: 'E',
          F: 'F',
      }

      let scores = []
      Object.keys(labelList).map(item=>{
          scores.push({
            label: labelList[item],
            value: res[item]
          })
      })
      this.scores = scores
      this.$forceUpdate()
    }
  },
  watch: {
    djName(val,oldVal){
      if(val==oldVal)return
      this.djName = val.toUpperCase()
    }
  },
  mounted() {
    this.$refs.nameInp.focus()
  }
}
</script>

<style lang="scss">
#app {
  text-align: center;
  // margin-top: 60px;
  width: 400px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
html,body,ul,ol,li,p,div,span,i,img,h1,h2,h3,h4,h5,h6{
  margin: 0;
  padding: 0;
}
html,body{
  background: #333536;
  color: #9ab5c2;
}
.time{
  width: 100%;
  font-size: 14px;
  text-align: left;
  text-indent: 1em;
  color: #888;
}
.title {
  margin-top: 10px;
}
.box{
  margin-top: 20px;
}
.search-box{
  margin-top: 20px;
  >input{
    width: 100px;
    margin-right: 15px;
  }
  .radio{
    margin-top: 10px;
  }
}
.profiles-box{
  width: 100%;
  p{
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    span{
      padding: 0 20px;
      text-align: text-bottom;
      >.djName{
        padding: 0 10px;
        font-size: 24px;
        font-weight: 700;;
      }
    }
  }
}
.score-box{
  width: 300px;
  p{
    margin-top: 40px;
    text-align: center;
  }
  ul{
    .score{
      width: 100%;
      display: flex;
      justify-content: space-between;
      background: #444;
      &:nth-child(odd){
        background: #333;
      }
      span{
        width: 100px;
        text-align: center;
        padding: 0 10px;
        line-height: 24px;
      }
    }
  }
}
</style>
