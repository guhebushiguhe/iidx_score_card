<template>
  <div id="app" ref="app">
    <div class="title-wrap">
      <!-- <p class="time">{{new Date().toLocaleString()}}<span v-html="'&nbsp;&nbsp;&nbsp;&nbsp;'"></span>{{version}}</p> -->
      <!-- <div @click="capture"><img class="share-btn" :src="icon.share" alt=""></div> -->
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
        :disabled="isLoading"
      />
      <PlayStyleSelector
        class="radio-wrap"
        :play-style="playStyle"
        :disabled="isLoading"
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
      <ul
        v-if="scores.length>0 && !isLoading"
        :class="`score-ul ${isMusicListShow?'music-show':''}`"
      >
        <li
          v-for="(item,index) in scores"
          :key="item.label"
          :class="`${activeLabel!='' && activeLabel!=item.label?'inactive':''} score-li`"
        >
          <span class="label-wrap"><Label :text="item.label" :change-label="changeLabel" :is-music-list-show="isMusicListShow" /></span>
          <span :class="`${newScores.length > 0?'score':''}`">
            <Score
              :num="item.value.toString()"
              :type="`${item.label=='CLEAR RATE'?'target':'default'}`"
              :data="item.data"
              :label="item.label"
              :activeLabel="activeLabel"
              :activeType="activeType"
              :show-music-list="showMusicList"
            />
            </span>
          <span
          v-if="newScores.length > 0"
          class="plus"
          >
            <Score
              :num="parsePlus(newScores[index].value)"
              type="plus"
              :data="newScores[index].data"
              :label="item.label"
              :activeLabel="activeLabel"
              :activeType="activeType"
              :show-music-list="showMusicList"
            />
          </span>
          <i :class="`back-btn ${isMusicListShow?'show':''}`" @click.stop="showMusicList('back')">
            <img :src="icon.up" alt="">
            </i>
        </li>
        <Sorter
          class="sorter"
          :disabled="!isMusicListShow"
          :sortMusic="sortMusic"
        />
      </ul>
      <MusicList
        :class="`${isMusicListShow?'show':''} music-list`" 
        :data="musicListData"
      />
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
import MusicList from '@/components/MusicList.vue'
import Sorter from '@/components/Sorter.vue'
export default {
  name: 'App',
  components: {
    Score,
    Label,
    LvSelector,
    PlayStyleSelector,
    MusicList,
    Sorter
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
      isMusicListShow: false,
      activeLabel: '',
      activeType: '',
      profiles: null,
      profile: null,
      icon:{
        refresh: require('@/assets/refresh.png'),
        share: require('@/assets/share.png'),
        up: require('@/assets/up.png'),
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
        'EASY_CLEAR',
        'ASSIST_CLEAR',
        'FAILED'
      ],
      lvList: ['1','2','3','4','5','6','7','8','9','10','11','12'],
      musicListData: [],
      labelImg:{
        'ALL': require('@/assets/clear/all_scores.png'),
        FC: require('@/assets/clear/clear_full_combo.png'),
        EXHC: require('@/assets/clear/clear_ex_hard.png'),
        HC: require('@/assets/clear/clear_hard.png'),
        NC: require('@/assets/clear/clear_normal.png'),
        AC: require('@/assets/clear/clear_assist.png'),
        EC: require('@/assets/clear/clear_easy.png'),
        Failed: require('@/assets/clear/clear_failed.png'),
        'CLEAR RATE': require('@/assets/clear/clear_rate.png'),
        MAX: require('@/assets/djlevel/lv_max.png'),
        'MAX-': require('@/assets/djlevel/lv_max-.png'),
        AAA: require('@/assets/djlevel/lv_aaa.png'),
        AA: require('@/assets/djlevel/lv_aa.png'),
        A: require('@/assets/djlevel/lv_a.png'),
        B: require('@/assets/djlevel/lv_b.png'),
        C: require('@/assets/djlevel/lv_c.png'),
        D: require('@/assets/djlevel/lv_d.png'),
        E: require('@/assets/djlevel/lv_e.png'),
        F: require('@/assets/djlevel/lv_f.png'),
      }
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
          EASY_CLEAR: 'EC',
          ASSIST_CLEAR: 'AC',
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
      localStorage.setItem('names',this.names.join('|'))
    },
    delName(name) {
      let newNames = [...this.names]
      this.names = newNames.filter(i=>i!=name)
      localStorage.setItem('names',this.names.join('|'))
    },
    getNames(){
      const nameStr = localStorage.getItem('names')
      if(nameStr)this.names = nameStr.split('|')
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
        this.$message.warning('请输入DJ NAME')
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
          const isBeginPlayMidnight = new Date(item.timestamp).getHours()<5
          startDay = isBeginPlayMidnight?new Date(item.timestamp).getTime():new Date(item.timestamp).setHours(5,0,0)
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
      if (!lv || lv=='ALL') {
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
    },
    showMusicList(label,data,type) {
      let musicListData = data
      // 刷新进来的
      if(!label && !data && !type){
        const type = this.activeType
        const label = this.activeLabel
        if(!type || !label)return
        const scores = type=="plus"?this.newScores:this.scores
        musicListData = scores.filter(i=>i.label==label)[0].data
      }else{
        if(label=='back'){
          // 后退按钮进来的
          this.activeLabel = ''
          this.activeType = ''
          this.isMusicListShow = false
        }else{
          // 点击数字进来的
          if(data.length<=0)return
          this.activeLabel = label
          this.activeType = type
          this.isMusicListShow = true
        }
      }
      this.musicListData = []
      if(['','back'].includes(this.activeLabel))return
      this.musicListData = musicListData
    },
    sortMusic(type){
      let musicListData = this.musicListData
      let firstId = ''
      const lampCode = {
        FULL_COMBO: 6,
        EX_HARD_CLEAR: 5,
        HARD_CLEAR: 4,
        CLEAR: 3,
        EASY_CLEAR: 2,
        ASSIST_CLEAR: 1,
        FAILED: 0,
      }
      switch (type){
        case 'lamp':
          firstId = musicListData[0].charts._id.toString()
            this.musicListData = musicListData.sort((a,b)=>lampCode[b.lamp] - lampCode[a.lamp])
          if(firstId == musicListData[0].charts._id){
            this.musicListData = musicListData.sort((a,b)=>lampCode[a.lamp] - lampCode[b.lamp])
            }
          break
        case 'level':
          firstId = musicListData[0].charts._id.toString()
            this.musicListData = musicListData.sort((a,b)=>b.charts.rating - a.charts.rating)
          if(firstId == musicListData[0].charts._id){
            this.musicListData = musicListData.sort((a,b)=>a.charts.rating - b.charts.rating)
          }
          break
        case 'grade':
          firstId = musicListData[0].charts._id.toString()
            this.musicListData = musicListData.sort((a,b)=>b.grade - a.grade)
          if(firstId == musicListData[0].charts._id){
            this.musicListData = musicListData.sort((a,b)=>a.grade - b.grade)
          }
          break
        case 'title':
          firstId = musicListData[0].charts._id.toString()
            this.musicListData = musicListData.sort((a,b)=>a.music.title.localeCompare(b.music.title, 'zh-CN', { numeric: true }))
          if(firstId == musicListData[0].charts._id){
            this.musicListData = musicListData.sort((a,b)=>b.music.title.localeCompare(a.music.title, 'zh-CN', { numeric: true }))
          }
          break
        case 'time':
          firstId = musicListData[0].charts._id.toString()
            this.musicListData = musicListData.sort((a,b)=>new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          if(firstId == musicListData[0].charts._id){
            this.musicListData = musicListData.sort((a,b)=>new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          }
          break
        default:
          break
      }
    },
    changeLabel(label){
      this.activeLabel = label
      this.showMusicList()
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
    },
    scores(val,oldVal){
      if(val==oldVal || !this.isMusicListShow)return
      this.showMusicList()
    }
  },
  created(){
    const bgIframe = document.createElement('iframe')
    bgIframe.src = "./bg/bg.html"
    bgIframe.frameBorder = "0"
    bgIframe.width='100%'
    bgIframe.height='100%'
    bgIframe.className = 'bg'
    document.body.appendChild(bgIframe)
  },
  mounted() {
    console.dir(document.getElementsByTagName('iframe')[0])
    // document.getElementsByTagName('iframe')[0]['frameBorder']="0"
    const query = this.$route.query
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
$fontColor1: #fff;
$fontShadownColor: #4d6e7c;
html,body,ul,ol,li,p,div,span,i,img,h1,h2,h3,h4,h5,h6,iframe{
  margin: 0;
  padding: 0;
}
html,body{
  // background: #333536;
  // background: url('./assets/bg3.jpeg') repeat fixed;
  background: #3d1259;
  background-size: cover;
  color: $fontColor1;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  width: 100%;
  height: 100%;
  overflow: hidden;
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
.bg{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-width: 0;
}
#app {
  z-index: 1;
  // height:100%;
  max-width: 100vw;
  // background: url('./assets/bg3.jpeg') repeat-y fixed;
  text-align: center;
  font-family:'Segoe UI', Tahoma, 'Geneva', 'Verdana', 'sans-serif';
  // text-shadow: $fontShadownColor 1px 0 0, $fontShadownColor 0 1px 0, $fontShadownColor -1px 0 0, $fontShadownColor 0 -1px 0;
  padding: 15px 0 30px;
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
  justify-content: flex-end;
  // justify-content: space-between;
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
    // background: rgba(51, 51, 51,.5);
    background: linear-gradient(180deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, .2) 49%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, .4) 100%,);
    // border: 1px solid #ccc;
    height: 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
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
  padding: 30px 0;
  >p{
    width: 100%;
    box-sizing: border-box;
    // font-size: 14px;
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
  // width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .msg{
    margin-top: 40px;
    text-align: center;
  }
  .score-ul{
    width: 87%;
    transition: width 0.5s;
    // transition: padding-bottom 0.5s;
    &.music-show{
      width: 100%;
      padding-bottom: 10px;
      .score-li{
        border-radius: 0;
        border-width: 0 0 1px 0;
        margin-bottom: 0px;
      }
    }
    .score-li{
      width: 100%;
      height: 28px;
      box-sizing: border-box;
      transition: height .5s,border-radius .5s;
      display: flex;
      justify-content: space-between;
      // background: rgba(68, 68, 68, .8);
      background: linear-gradient(180deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, .2) 49%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, .2) 100%,);
      margin-bottom: 2px;
      // box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px 16px 4px 16px;
      &:nth-child(odd){
        // background: #333;
        background: linear-gradient(180deg, rgba(0, 0, 0, .6) 0%, rgba(0, 0, 0, .6) 49%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, .4) 100%,);
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
      .back-btn{
        width: 0;
        overflow: hidden;
        transition: width .5s;
        display: flex;
        justify-content: center;
        align-items: center;
        &.show{
          width: 50px;
          cursor: pointer;
        }
        img{
          height: 80%;
        }
      }
    }
    .inactive{
      height: 0;
      overflow: hidden;
      border-width: 0 !important;
      margin: 0;
    }
  }
  .music-list{
    width: 100%;
    overflow: hidden;
    height: 0;
    transition: height 0.5s;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .music-ul{
      width: 90%;
      .music-li{
        position: relative;
        box-sizing: border-box;
        margin-bottom: 10px;
        padding-right:16px;
        width: 100%;
        height: 32px;
        // border: 1px solid #888;
        border-width: 2px 2px 2px 0;
        // background: rgba(49, 49, 49, 0.8);
        background: linear-gradient(180deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, .2) 49%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, .4) 100%,);
        display: flex;
        justify-content: space-between;
        .wrap{
          display: flex;
          justify-content: space-between;
          line-height: 32px;
        }
        .left-wrap{
          // width: 60px;
          font-size: 12px;
          position: relative;
          align-items: center;
          .lamp{
            width: 16px;
            height: 42px;
            position: absolute;
            top: -1px;
            left: -16px;
            box-sizing: border-box;
            border-width: 2px;
            border-radius: 8px 0 0 8px;
            background: rgb(53, 52, 52);
            &.FULL_COMBO,&.FULL_COMBO:after{
              background-image: linear-gradient(0deg, rgb(255, 224, 138), rgb(138, 255, 173), rgb(138, 222, 255), rgb(146, 138, 255), rgb(255, 138, 138),);
            }
            &.EX_HARD_CLEAR,&.EX_HARD_CLEAR:after{
              background: rgb(255, 238, 0);
            }
            &.HARD_CLEAR,&.HARD_CLEAR:after{
              background: #fff;
            }
            &.CLEAR,&.CLEAR:after{
              background: rgb(0, 225, 255);
            }
            &.EASY_CLEAR,&.EASY_CLEAR:after{
              background: rgb(166, 255, 0);
            }
            &.ASSIST_CLEAR,&.ASSIST_CLEAR:after{
              background: rgb(183, 0, 255);
            }
            &.FAILED,&.FAILED:after{
              background: rgb(180, 0, 0);
            }
            &:after{
              content: '';
              display: inline-block;
              width: 16px;
              height: 42px;
              position: absolute;
              top: 0;
              left: 0;
              box-sizing: border-box;
              border-width: 2px;
              border-radius: 6px 0 0 6px;
              background: rgb(53, 52, 52);
              filter: blur(4px);
            }
          }
          span{
            padding-right: 5px;
          }
        }
        .right-wrap{
          font-size: 12px;
          // border: 1px solid red;
          align-items: center;
          .music-name{
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 247px;
            text-align: left;
            cursor: pointer;
          }
        }
        .main-wrap{
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 6px;
          overflow: hidden;
          .grade-wrap{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            .grade-bg{
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 6px;
              background: rgba(0,0,0,.8);
              overflow: hidden;
            }
            .grade-score{
              position: absolute;
              bottom: 0;
              left: 0;
              height: 6px;
              overflow: hidden;
              z-index: 1;
              // background: rgb(219, 25, 25);
              &.MAX, &.MAX-, &.AAA{
                background: linear-gradient(90deg, rgb(133,56,53) 0%, rgb(238,62,62) 30%, rgb(238,62,62) 100%);
                &.colorful{
                  background: linear-gradient(90deg, rgb(245,69,69), rgb(207,68,253), rgb(56,76,249), rgb(67,252,252), rgb(93,252,74), rgb(254,255,84), rgb(190,40,30), rgb(245,69,69));
                }
              }
              &.AA{
                background: linear-gradient(90deg, rgb(182, 119, 26) 0%, rgb(255, 166, 32) 30%, rgb(255, 166, 32) 100%);
                &.colorful{
                  background: linear-gradient(90deg, rgb(212, 211, 211) 0%, rgb(255, 255, 255) 30%, rgb(255, 255, 255) 100%);
                }
              }
              &.A{
                background: rgb(41, 185, 252);
              }
              &.B{
                background: rgb(128, 219, 25);
              }
              &.C{
                background: rgb(128, 219, 25);
              }
              &.D{
                background: rgb(128, 219, 25);
              }
              &.E{
                background: rgb(128, 219, 25);
              }
              &.F{
                background: rgb(128, 219, 25);
              }
            }
          }
        }
        .music-li-cover{
          position: absolute;
          top: -2px;
          right: 0;
          z-index: 1;
          width: 105%;
          height: 44px;
        }
      }
    }
    &.show{
      overflow-y: auto;
      height: 540px;
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
