<template>
  <div id="app" ref="app">
    <div class="title-wrap">
      <p class="time">{{new Date().toLocaleString()}}<span v-html="'&nbsp;&nbsp;&nbsp;&nbsp;'"></span>{{version}}</p>
      <div @click="capture"><img class="share-btn" :src="icon.share" alt=""></div>
    </div>
    <div
      class="box profiles-box"
    >
      <p>
        <span>DJ</span> 
        <span class="search-name-wrap">
          <div class="search-inp-wrap">
            <input class="searchInp" type="text" v-model="djName" @keypress.enter="toSearch"  @focus="isTyping = true" @blur="lossTyping" :disabled="isLoading" ref="nameInp">
            <span class="empty-text" v-if="djName==''">点击此处输入DJ NAME</span>
            <img class="refresh-btn" :src="icon.refresh" alt="刷新" @click="refresh">
          </div>
          <ul v-if="names.length>0 && isTyping" class="names-ul">
            <li
              v-for="item in names"
              :key="item"
              class="names-li"
            ><span class="name" @click="searchName(item)">{{item}}</span><span class="delBtn" @click="delName(item)">×</span></li>
          </ul>
        </span>
      </p>
      <p v-if="profile">
        SP Rank: {{profile.sp.rank}}, Plays: {{profile.sp.plays}}, DJ Points: {{profile.sp.dj_points}}
      </p>
      <p v-if="profile">
        DP Rank: {{profile.dp.rank}}, Plays: {{profile.dp.plays}}, DJ Points: {{profile.dp.dj_points}}
      </p>
    </div>
    <div class="box search-box">
      <LvSelector
        :lv="lv"
        :change-lv="changeLv"
        class="lv-selector-wrap"
      />
      <PlayStyleSelector
        class="radio-wrap"
        :play-style="playStyle"
        :is-loading="isLoading"
        :play-style-list="playStyleList"
        :change-play-style="playStyleChange"
      />
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
        <p>
          SP Rank: {{item.sp.rank}}, Plays: {{item.sp.plays}}, DJ Points: {{item.sp.dj_points}}
        </p>
        <p>
          DP Rank: {{item.dp.rank}}, Plays: {{item.dp.plays}}, DJ Points: {{item.dp.dj_points}}
        </p>
      </div>
      </div>
    </div>
    <div class="box score-box">
      <p class="#9ab5c2" v-if="isLoading">加载中，请耐心等候···</p>
      <ul v-if="scores.length>0 && !isLoading">
        <li
          v-for="(item,index) in scores"
          :key="item.label"
          class="score-li"
        >
        <span class="label-wrap"><Label :text="item.label" /></span>
        <span :class="`${newScores.length > 0?'score':''}`"><Score :num="item.value.toString()" :type="`${item.label=='CLEAR RATE'?'target':'default'}`" :data="item.data" /></span>
        <span
         v-if="newScores.length > 0"
         class="plus"
        ><Score :num="parsePlus(newScores[index].value)" type="plus" :data="newScores[index].data" /></span>
        </li>
      </ul>
      <div class="new-time" v-if="newTime">新成绩：{{ `${newTime.startTime} - ${newTime.endTime}` }}</div>
    </div>
    <div class="cap-wrap" v-if="capURL" @click="capURL=null">
      <div class="btn-wrap">
        <p>长按图片分享图片，任意位置点击取消</p>
        <p>或通过浏览器分享链接</p>
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
import Score from '@/components/Score.vue'
import Label from '@/components/Label.vue'
import LvSelector from '@/components/LvSelector.vue'
import PlayStyleSelector from '@/components/PlayStyleSelector.vue'
export default {
  name: 'App',
  components: {
    Score,
    Label,
    LvSelector,
    PlayStyleSelector
  },
  data() {
    return {
      version: 'IIDX速查工具v1.03',
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
      icon:{
        refresh: require('@/assets/refresh.png'),
        share: require('@/assets/share.png'),
      },
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
      ],
      lvList: ['1','2','3','4','5','6','7','8','9','10','11','12'],
    }
  },
  computed: {
      labelList () {
        return {
          ALL_TEMP:'ALL',
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
        useCORS: true,
        dpi: 300,
      }).then((canvas)=>{
        let capURL = canvas.toDataURL(`${this.id||null}_scores/jpg`)
        this.capURL = capURL
      })
    },
    lossTyping() {
      setTimeout(()=>{
        this.isTyping = false
      },300)
    },
    searchName(name) {
      this.djName = name
      this.toSearch()
    },
    addName(name) {
      this.names.push(name)
      const yearTime = 365*24*60*60
      this.setCookie('names',this.names.join('|'),yearTime)
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
    toSearch() {
      const djName = this.djName
      const lv = this.lv
      this.lv=lv==''?'ALL':lv
      const playStyle = this.playStyle
      this.$router.push({name: 'home',query:{djName,lv,playStyle}})
      this.getProfiles()
    },
    refresh(){
      this.idsList = {}
      this.scoresData = {}
      this.newScoresData = {}
      this.toSearch()
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
      // 过滤最后一把成绩，休息3小时算下一把
      const waitTime = 3*60*60*1000
      let new_items = _items.sort((a,b)=>{
        const timeA = new Date(a.timestamp).getTime()
        const timeB = new Date(b.timestamp).getTime()
        return timeB - timeA
      })
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
      if(!startTime || !endTime){
        const timeList = new_items.map(i=>new Date(i.timestamp).toLocaleString())
        console.log('计算最后一把时间出错，时间列表为：',timeList)
      }
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
      let musicList = []
      const lvList = this.lvList
      const playStyle = this.playStyle
      // 将_related对应内容写入_items
      musicList = _items.map((i,index)=>{
        const {chart_id,music_id} = i
        const charts = _related.charts.filter(j=>j._id==chart_id)[0]
        const music = _related.music.filter(j=>j._id==music_id)[0]
        const profiles = _related.profiles[0]
        return {
          ...i,
          charts,
          music,
          profiles
        }
      })
      if(playStyle!="ALL"){
        musicList = musicList.filter(item=>item.charts.play_style==playStyle)
      }
      if (lv || lv!='ALL') {
        musicList = musicList
      }else if(!lvList.includes(lv)){
        alert('lv不合法，请重新输入')
        this.$$nextTick(()=>{
          })
        this.lv = 'ALL'
        return
      }else {
        musicList =  musicList.filter(({charts})=>charts.rating==lv)
      }
      const LAMPS = {}
      this.lampList.map(lamp=>{
        LAMPS[lamp]=musicList.filter(item=>item.lamp == lamp)
      })
      const { FAILED } = LAMPS
      const NO_PLAY = musicList.filter(item=>item.status == 'NO_PLAY')
      const ALL_TEMP = musicList
      const clearRate = ALL_TEMP.length<=0?'----':((ALL_TEMP.length - FAILED.length - NO_PLAY.length)/ALL_TEMP.length*100).toFixed(2)+'%'

      let res = {
        ALL_TEMP,
        ...LAMPS,
        clearRate
      }
      gradeList.map(item=>{
        res[item.grade] = musicList.filter(i=>i.grade >= item.min && i.grade < item.max)
      })

      let scores = []
      Object.keys(labelList).map(item=>{
          const value = item=='clearRate'?res[item]:res[item].length
          const data = item=='clearRate'?null:res[item]
          scores.push({
            label: labelList[item],
            value,
            data
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
    },
    changeLv(lv){
      this.lv = lv
      this.toSearch()
    },
    playStyleChange(e){
      this.playStyle=e.target.value
    }
  },
  watch: {
    djName(val,oldVal){
      if(val==oldVal)return
      this.djName = val.toUpperCase()
    },
    playStyle(val,oldVal){
      if(val==oldVal || this.djName=='')return
      this.toSearch()
    }
  },
  mounted() {
    // console.log(this.$route)
    const query = this.$route.query
    // const {djName,lv,playStyle} = this.$route.query
    if(query.djName){
      // 有搜索参数
      this.djName = query.djName
      this.lv = query.lv || 'ALL'
      this.playStyle = query.playStyle || 'ALL'
      this.getProfiles()
    }else{
      // 没有搜索参数
      this.$refs.nameInp.focus()
      this.getNames()
    }

  }
}
</script>

<style lang="scss">
// $fontColor1: #9ab5c2;
$fontColor1: #fff;
$fontShadownColor: #4d6e7c;
html,body,ul,ol,li,p,div,span,i,img,h1,h2,h3,h4,h5,h6{
  margin: 0;
  padding: 0;
}
html,body{
  // background: #333536;
  background: url('./assets/bg3.jpeg') repeat fixed;
  background-size: cover;
  color: $fontColor1;
}
ul,ol{
  list-style: none;
}
::-webkit-scrollbar{
  width: 5px;
}
::-webkit-scrollbar-thumb{
  background: #9ab5c2;
}
::-webkit-scrollbar-track{
  background: transparent;
}
#app {
  min-height:100vh;
  width: 400px;
  background: url('./assets/bg3.jpeg') repeat-y fixed;
  text-align: center;
  font-family:'Segoe UI', Tahoma, 'Geneva', 'Verdana', 'sans-serif';
  text-shadow: $fontShadownColor 1px 0 0, $fontShadownColor 0 1px 0, $fontShadownColor -1px 0 0, $fontShadownColor 0 -1px 0;
  padding-bottom: 30px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    // display: flex;
    // justify-content: space-around;
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
    color: $fontColor1;
  }
  .share-btn{
    width: 18px;
    height: 18px;
    padding-right: 10px;
    // font-weight: 700;
    cursor: pointer;
  }
}
.search-box{
  // margin-top: 20px;
  margin-bottom: 20px;
  width: 80%;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  .searchInp{
    width: 100px;
    margin-right: 15px;
    background: #013765;
    border: 1px solid #fff;
    border-radius: 4px;
    color: #fff;
    text-indent: .3em;
    outline: none;
  }
  .lv-selector-wrap{
    background: rgba(51, 51, 51,.5);
    height: 24px;
    border-radius: 12px;
    border-width: 0;
    display: flex;
    align-items: center;
  }
  .radio-wrap{
    background: rgba(51, 51, 51,.5);
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    border-width: 0;
    padding: 0 10px;
    display: flex;
    align-items: center;
    .radio-label{
      height: 18px;
      padding: 0 10px;
      cursor: pointer;
      text-shadow: none;
      color: rgba(255, 255, 255,.2);
      // opacity: 0.4;
      display: flex;
      align-items: center;
      img{
        display: inline-block;
        line-height: 24px;
      }
    }
    .active{
      color: #fff;
      // opacity: 1;
    }
    .radio{
      margin-top: 10px;
      display: none;
    }
  }
}
.profiles-select{
  width: 100%;
  .msg{
    margin-bottom: 10px;
  }
  .profile-card{
    margin-bottom: 10px;
    background: rgba(51, 51, 51, 0.5);
    padding: 10px 0;
    cursor: pointer;
    &:hover{
      background: rgba(51, 51, 51, 0.8);
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
  // margin-bottom: 10px;
  padding: 20px 0;
  >p{
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    // text-align: left;
    padding: 0 20px;
    .search-name-wrap{
      padding: 0;
      display: inline-block;
      position: relative;
      .search-inp-wrap{
        position: relative;
        .searchInp{
          display: inline-block;
          width: 140px;
          margin-right: 15px;
          background: transparent;
          border: none;
          // background: #013765;
          // border: 1px solid #fff;
          border-radius: 4px;
          color: #fff;
          font-size: 30px;
          font-weight: 700;
          text-indent: .3em;
          outline: none;
        }
        .empty-text{
          z-index: -1;
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          font-size: 12px;
          color: #ccc;
        }
        .refresh-btn{
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
      .names-ul{
        z-index: 2;
        position: absolute;
        top: 38px;
        left: 10px;
        width: 130px;
        background: #00426d;
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
    >span{
      padding: 0 5px 10px 0;
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
      background: rgba(68, 68, 68, .8);
      margin-bottom: 2px;
      // box-sizing: border-box;
      border: 1px solid #fff;
      border-radius: 4px 16px 4px 16px;
      &:nth-child(odd){
        background: #333;
      }
      .label-wrap{
        position: relative;
        &::after{
          content: '';
          display: inline-block;
          width: 1px;
          height: 18px;
          background: #fff;
          position: absolute;
          top: 6px;
          right: 0;
        }
      }
      span{
        width: 100px;
        text-align: center;
        padding: 0 10px;
        line-height: 24px;
        .label-modal{
          img{
            height: 17px;
          }
        }
      }
      .score{
        text-align: right;
        padding-right: 0;
        img{
          // width: 16px;
          height: 14px;
        }
      }
      .plus{
        font-weight: 700;
        font-size: 12px;
        text-align: left;
        // padding-left: 0;
        width: 100px;
        img{
          width: 12px;
        }
      }
    }
  }
  >.new-time{
    margin-top: 5px;
    font-size: 10px;
    // color: rgba(148, 170, 180,.5);
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
