<template>
  <div id="app" ref="app">
    <div class="title-wrap">
      <p class="time">{{new Date().toLocaleString()}}<span v-html="'&nbsp;&nbsp;&nbsp;&nbsp;'"></span>{{version}}</p>
      <div class="share-btn" @click="capture">↗</div>
    </div>
    <h2 class="title">IIDX查分器</h2>
    <div class="box search-box">
      <span>DJName </span><span class="search-name-wrap">
          <input class="searchInp" type="text" v-model="djName" @keypress.enter="getProfiles"  @focus="isTyping = true" @blur="lossTyping" :disabled="isLoading" ref="nameInp">
          <ul v-if="names.length>0 && isTyping" class="names-ul">
            <li
              v-for="item in names"
              :key="item"
              class="names-li"
            ><span class="name" @click="searchName(item)">{{item}}</span><span class="delBtn" @click="delName(item)">×</span></li>
          </ul>
        </span>
      <span>lv </span><input class="searchInp" type="text" v-model="lv" @keypress.enter="getProfiles" :disabled="isLoading">
      <button type="button" @click="getProfiles" :disabled="isLoading">搜索</button><br>
      <span
        v-for="item in playStyleList"
        :key="item.value"
      >
        <label>
          <input
            type="radio"
            class="radio"
            v-model="playStyle"
            :value="item.value"
            :id="item.value"
            :disabled="isLoading"
          >
          {{item.label}}
        </label>

      </span>
    </div>
    <div
      class="box profiles-select"
      v-if="isNameSelectShow"
    >
      <p class="msg">{{profiles?'存在重名账号，请选择账号继续':'查无此名，请重新输入'}}</p>
      <div v-if="profiles">
        <div
          v-for="(item,index) in profiles"
          :key="index"
          class="profile-card"
          @click="continueGetProfile(item)"
        >
        <p>
          <span>DJName: <span class="djName">{{item.dj_name}}</span></span>
        </p>
        <p v-if="playStyle=='SINGLE' || playStyle=='ALL'">
          SP Rank: {{item.sp.rank}}, Plays: {{item.sp.plays}}, DJ Points: {{item.sp.dj_points}}
        </p>
        <p v-if="playStyle=='DOUBLE' || playStyle=='ALL'">
          DP Rank: {{item.dp.rank}}, Plays: {{item.dp.plays}}, DJ Points: {{item.dp.dj_points}}
        </p>
      </div>
      </div>
    </div>
    <div
      class="box profiles-box"
      v-if="profile"
    >
      <p>
        <span>DJName: <span class="djName">{{profile.dj_name}}</span></span>
      </p>
      <p v-if="playStyle=='SINGLE' || playStyle=='ALL'">
        SP Rank: {{profile.sp.rank}}, Plays: {{profile.sp.plays}}, DJ Points: {{profile.sp.dj_points}}
      </p>
      <p v-if="playStyle=='DOUBLE' || playStyle=='ALL'">
        DP Rank: {{profile.dp.rank}}, Plays: {{profile.dp.plays}}, DJ Points: {{profile.dp.dj_points}}
      </p>
    </div>
    <div class="box score-box">
      <p class="#9ab5c2" v-if="isLoading">加载中，请耐心等候···</p>
      <ul v-if="scores.length>0 && !isLoading">
        <li
          v-for="(item,index) in scores"
          :key="item.label"
          class="score-li"
        >
        <span>{{item.label}}</span>
        <span :class="`${newScores.length > 0?'score':''}`">{{item.value}}</span>
        <span
         v-if="newScores.length > 0"
         class="plus"
        >{{ parsePlus(newScores[index].value) }}</span>
        </li>
      </ul>
      <div class="new-time" v-if="newTime">最后亿把</br>{{ `${newTime.startTime} ---- ${newTime.endTime}` }}</div>
    </div>
    <div class="cap-wrap" v-if="capURL" @click="capURL=null">
      <div class="btn-wrap">
        长按图片选择分享图片，任意位置点击取消
        <!-- <button @click="copyCap" ref="copyBtn" id="aaa">复制</button> -->
        <!-- <button @click="capURL=null">取消</button> -->
      </div>
      <div ref='capImg'>
        <img class="cap-img" :src="capURL" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import '@/utils/canvas2image.js'
import Clipboard from 'clipboard'
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      version: 'v1.02',
      names: [],
      isTyping: false,
      capURL: null,
      newTime: null,
      djName: '',
      lv: 'ALL',
      playStyle: 'ALL',
      isLoading: false,
      isNameSelectShow: false,
      profiles: null,
      profile: null,
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
      newScores: [],
      profilesData: {},
      scoresData:{},
      newScoresData:{},
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
          min: 0,
          max: 0.2222
        },
      ],
      lampList: [
        'FULL_COMBO',
        'EX_HARD_CLEAR',
        'HARD_CLEAR',
        'CLEAR',
        'ASSIST_CLEAR',
        'EASY_CLEAR',
        'FAILED'
      ]
    }
  },
  computed: {
      labelList () {
        const lv = this.lv
        return {
          ALL_TEMP:`lv.${lv?lv:'ALL'}`,
          FULL_COMBO: 'FC',
          EX_HARD_CLEAR: 'EXHC',
          HARD_CLEAR: 'HC',
          CLEAR: 'NC',
          ASSIST_CLEAR: 'AC',
          EASY_CLEAR: 'EC',
          FAILED: 'Failed',
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
      },
  },
  methods: {
    capture() {
      const appRef = this.$refs.app
      html2canvas(appRef,{
        backgroundColor: '#333536',
        useCORS: true
      }).then((canvas)=>{
        let capURL = canvas.toDataURL(`${this.id||null}_scores/jpg`)
        this.capURL = capURL
      })
    },
    // 复制图片到剪贴板，因为capURL为base64暂时无法复制
    // copyCap(e) {
    //   const capImg = this.$refs.capImg;
    //   this.copyFunction(capImg, "#aaa");
    // },
    // copyFunction(t, a){
    //   var e = new Clipboard(a, {
    //       target: function () {   
    //           return console.log(t, a),
    //           t
    //       }
    //   });
    //   e.on("success", function (t) {
    //       console.log('复制成功');
    //   }),
    //   e.on("error", function (t) {
    //       console.log('复制失败');
    //   })
    // },
    lossTyping() {
      setTimeout(()=>{
        this.isTyping = false
      },300)
    },
    searchName(name) {
      this.djName = name
      this.getProfiles()
    },
    addName(name) {
      this.names.push(name)
      this.setCookie('names',this.names.join('|'))
    },
    delName(name) {
      let newNames = [...this.names]
      this.names = newNames.filter(i=>i!=name)
      this.setCookie('names',this.names.join('|'))
    },
    getNames(){
      const nameStr = this.getCookie('names')
      if(nameStr)this.names = nameStr.split('|')
    },
    setCookie(name, value, seconds) {
        seconds = seconds || 0;   //seconds有值就直接赋值，没有为0
        var expires = "";
        if (seconds != 0) {      //设置cookie生存时间
            var date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + escape(value) + expires + "; path=/";   //转码并赋值
    },
    getCookie(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                var c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end)).replace(/\"/g, "");
            }
        }
        return null;
    },
    async getProfiles() {
      this.isNameSelectShow = false
      this.newTime = null
      const names = this.names
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
      const newScoresData = this.newScoresData
      if( idsList[djName] ){
        const _items = this.profilesData[id]
        this.getSingleProfile(_items)
        this.scores = this.parseScores(scoresData[id])
        const newTimeData = newScoresData[id]
        this.newScores = newTimeData._items.length>0?this.parseScores(newTimeData):[]
        this.newTime = newTimeData.newTime
        this.$forceUpdate()
        return
      }
      if(!names.includes(djName)){
        this.addName(djName)
      }
      this.profile = null
      this.scores = []
      this.isLoading = true
      const data = await this.$axios.getProfiles(djName)
      let index = 0
      if(data._items.length<=0){
        this.isNameSelectShow = true
        this.isLoading = false
        this.profiles = null
        this.$refs.nameInp.focus()
        return
      }
      if(data._items.length>1){
        this.isNameSelectShow = true
        this.isLoading = false
        data._items.sort((a,b)=>{
          const timeA = new Date(a.access_time).getTime()
          const timeB = new Date(b.access_time).getTime()
          return timeB-timeA
        })
        this.profiles = data._items
        return
      }
      const _items = data['_items'][index]
      this.getSingleProfile(_items)
      this.getScores()
    },
    getSingleProfile(_items) {
      this.isNameSelectShow = false
      this.profiles = null
      this.profilesData[_items._id]=_items
      const {dj_name,iidx_id,sp,dp,_id,access_time} = _items
      this.idsList[dj_name]=_id
      this.profile = {
        dj_name,
        iidx_id,
        access_time,
        sp: {
          rank: sp.rank,
          plays: sp.plays,
          dj_points: sp.dj_points,
        },
        dp: {
          rank: dp.rank,
          plays: dp.plays,
          dj_points: dp.dj_points,
        },
      },
      this.$forceUpdate()
    },
    async getScores() {
      this.isLoading = true
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
      this.scores = this.parseScores(resData)
      const newTimeData = this.newFilter(resData)
      this.newScoresData[id]=newTimeData
      this.newScores = newTimeData._items.length>0?this.parseScores(newTimeData):[]
    },
    newFilter (data) {
      const {_items,_related} = data

      // 过滤查询时间当天0点后的成绩为新成绩
      // const now = new Date()
      // const today = now.setHours(0,0,0,0)
      // const new_items = _items.filter(i=>new Date(i.timestamp).getTime()>today)
      // const newData = {
      //   _items: new_items,
      //   _related
      // }

      // 过滤最后一把成绩，休息3小时算下一把
      const waitTime = 3*60*60*1000
      let new_items = _items.sort((a,b)=>{
        const timeA = new Date(a.timestamp).getTime()
        const timeB = new Date(b.timestamp).getTime()
        return timeB - timeA
      })
      // 最后刷卡时间，使用不准，暂废
      // const endTime = new Date(this.profile.access_time).toLocaleString()
      const endTime = new Date(new_items[0].timestamp).toLocaleString()
      let startDay = 0 
      new_items.some((item,index)=>{
        function parseTime(t) {
          return new Date(t.timestamp).getTime()
        }
        if(parseTime(item)-parseTime(new_items[index+1])>waitTime){
          startDay = new Date(item.timestamp).setHours(5,0,0)
          return true
        }
      })
      new_items = new_items.filter(i=>new Date(i.timestamp).getTime()>startDay)
      const startTime = new Date(new_items[new_items.length-1].timestamp).toLocaleString()
      const newTime = {
        startTime,
        endTime
      }
      this.newTime = newTime
      // console.log('startTime',startTime)
      // console.log('endTime',endTime)
      // console.log(new_items)
      const newData = {
        _items: new_items,
        _related,
        newTime
      }

      return newData
    },
    parseScores(data) {
      const gradeList = this.gradeList
      const labelList = this.labelList
      const {_items,_related} = data
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
        this.$$nextTick(()=>{
          })
        this.lv = 'ALL'
        return
      }else {
        idList =  idList.filter(({rating})=>rating==lv).map(item=>item._id)
      }
      const musicList = _items.filter(item=>idList.includes(item['chart_id']))
      const LAMPS = {}
      this.lampList.map(lamp=>{
        LAMPS[lamp]=musicList.filter(item=>item.lamp == lamp).length
      })
      const { FAILED } = LAMPS
      const NO_PLAY = musicList.filter(item=>item.status == 'NO_PLAY').length
      const ALL_TEMP = musicList.length
      const clearRate = ALL_TEMP<=0?'----':((ALL_TEMP - FAILED - NO_PLAY)/ALL_TEMP*100).toFixed(2)+'%'

      let res = {
        ALL_TEMP,
        ...LAMPS,
        clearRate
      }

      gradeList.map(item=>{
        res[item.grade] = musicList.filter(i=>i.grade >= item.min && i.grade < item.max).length
      })

      let scores = []
      Object.keys(labelList).map(item=>{
          scores.push({
            label: labelList[item],
            value: res[item]
          })
      })
      return scores
    },
    continueGetProfile (_items) {
      this.getSingleProfile(_items)
      this.getScores()
    },
    parsePlus(val){
      let num = null
      if(isNaN(val-0)){
        return ''
      }
      return val==0?'':'↑+'+val
    }
  },
  watch: {
    djName(val,oldVal){
      if(val==oldVal)return
      this.djName = val.toUpperCase()
    },
    playStyle(val,oldVal){
      if(val==oldVal || this.djName=='')return
      this.getProfiles()
    }
  },
  mounted() {
    this.$refs.nameInp.focus()
    this.getNames()
  }
}
</script>

<style lang="scss">
#app {
  text-align: center;
  // margin-top: 60px;
  padding-bottom: 30px;
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
ul,ol{
  list-style: none;
}
.cap-wrap{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  .btn-wrap{
    width: 80%;
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
  }
  .cap-img{
    border: 2px solid #fff;
    width: 340px;
  }
}
.title-wrap{
  width: 100%;
  display: flex;
  justify-content: space-between;
  .time{
    width: 100%;
    font-size: 14px;
    text-align: left;
    text-indent: 1em;
    color: #888;
  }
  .share-btn{
    padding-right: 10px;
    font-weight: 700;
    cursor: pointer;
  }
}
.title {
  margin-top: 10px;
}
.box{
  margin-top: 20px;
}
.search-box{
  margin-top: 20px;
  .searchInp{
    width: 100px;
    margin-right: 15px;
  }
  .search-name-wrap{
    display: inline-block;
    position: relative;
    .names-ul{
      position: absolute;
      top: 26px;
      right: 20px;
      width: 100px;
      background: #333;
      .names-li{
        font-size: 12px;
        line-height: 24px;
        text-align: left;
        text-indent: 0.5em;
        border-bottom: 1px solid #888;
        display: flex;
        justify-content: space-between;
        .name{
          cursor: pointer;
        }
        .delBtn{
          margin-right: 5px;
          cursor: pointer;
        }
      }
    }
  }
  .radio{
    margin-top: 10px;
  }
}
.profiles-select{
  width: 100%;
  .msg{
    margin-bottom: 10px;
  }
  .profile-card{
    margin-bottom: 10px;
    background: #444;
    padding: 10px 0;
    cursor: pointer;
    &:hover{
      background: #555;
    }
  }
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
  .msg{
    margin-top: 40px;
    text-align: center;
  }
  ul{
    .score-li{
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
      .score{
        text-align: right;
        padding-right: 5px;
      }
      .plus{
        font-weight: 700;
        font-size: 12px;
        text-align: left;
        padding-left: 5px;
        width: 30px;
      }
    }
  }
  >.new-time{
    margin-top: 5px;
    font-size: 12px;
    color: rgba(148, 170, 180,.5);
  }
}
</style>
