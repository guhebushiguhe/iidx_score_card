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
        <!-- <span>DJ</span>  -->
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
        SP {{profile.sp.rank || "__段"}}, DJP: {{profile.sp.dj_points}}
      </p>
      <p v-if="profile">
        DP {{profile.dp.rank || "__段"}}, DJP: {{profile.dp.dj_points}}
      </p>
      <Qpros 
        :qprosData="qprosData"
        :bpm="bpm"
      />
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
        v-show="scores.length>0 && !isLoading"
        :class="`score-ul ${isMusicListShow?'music-show':''}`"
      >
        <li
          v-for="(item,index) in scores"
          :key="item.label"
          :style="{maxHeight: isMusicListShow?'9999px':scoreLiMaxHeight+'px'}"
          :class="`${activeLabel!='' && activeLabel!=item.label?'inactive':''} score-li`"
        >
          <span
            class="label-wrap"
            :style="{marginTop: isMusicListShow?'0px':spanMarginTop+'px'}"
          >
            <Label :text="item.label" :change-label="changeLabel" :is-music-list-show="isMusicListShow" /></span>
          <span
            :class="`${newScores.length > 0?'score':''}`"
            :style="{marginTop: isMusicListShow?'0px':spanMarginTop+'px'}"
          >
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
            v-show="newScores.length > 0"
            class="plus"
            :style="{marginTop: isMusicListShow?'0px':spanMarginTop+'px'}"
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
        :set-bpm="setBpm"
        :music-list-max-height="musicListMaxHeight"
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
import localJson from '@/utils/netease_id_list.js'
// import arcana_data from '@/utils/arcana_music_list.js'
import Score from '@/components/Score.vue'
import Label from '@/components/Label.vue'
import LvSelector from '@/components/LvSelector.vue'
import PlayStyleSelector from '@/components/PlayStyleSelector.vue'
import MusicList from '@/components/MusicList.vue'
import Sorter from '@/components/Sorter.vue'
import Qpros from '@/components/Qpros.vue'
export default {
  name: 'App',
  components: {
    Score,
    Label,
    LvSelector,
    PlayStyleSelector,
    MusicList,
    Sorter,
    Qpros
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
      playStyle: 'SINGLE',
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
      scores: [],
      newScores: [],
      profilesData: {},
      scoresData:{},
      newScoresData:{},
      idsList:{},
      playStyleList: [
        // {
        //   label: 'ALL',
        //   value: 'ALL'
        // },
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
          min: 0.94444445,
          max: 1
        },
        {
          grade: 'AAA',
          min: 0.88888888,
          max: 0.94444445
        },
        {
          grade: 'AA',
          min: 0.77777777,
          max: 0.88888888
        },
        {
          grade: 'A',
          min: 0.66666666,
          max: 0.77777777
        },
        {
          grade: 'B',
          min: 0.55555555,
          max: 0.66666666
        },
        {
          grade: 'C',
          min: 0.44444444,
          max: 0.55555555
        },
        {
          grade: 'D',
          min: 0.33333333,
          max: 0.44444444
        },
        {
          grade: 'E',
          min: 0.22222222,
          max: 0.33333333
        },
        {
          grade: 'F',
          min: 0,
          max: 0.22222222
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
        'NO PLAY': require('@/assets/clear/clear_no_play.png'),
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
      },
      audioData: [],
      titleList:{
        // arcana_title: netease_title
        '牧神笛吹きて': '牧神笛吹き',
        'ALFARSHEAR 双神威に廻る夢': 'ALFARSHEAR~双神威に廻る梦~',
        'LETHEBOLG 〜双神威に斬り咲けり〜': 'LETHEBOLG~双神威に斩り咲けり~',
        'ワルツ第17番 ト短調”大犬のワルツ”': 'ワルツ第17番 ト短調\"大犬のワルツ\" - (17号圆舞曲 G小调 “大犬圆舞曲”)',
        'がっつり陰キャ!? 怪盗いいんちょの億劫^^;': 'がっつり陰キャ!? 怪盗いいんちょの億劫^^;',
        '𝆑𝆑𝆑𝆑𝆑': 'fffff',
        '仮想空間の旅人たち': '仮想空间の旅人たち'
      },
      scoreLiMaxHeight: 9999,
      musicListMaxHeight: 9999,
      spanMarginTop: 0,
      qprosData: null,
      bpm: null,
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
          NO_PLAY: 'NO PLAY',
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
      this.qprosData = null
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
      const _items = data['_items'][0]
      const qprosData = await this.$axios.getQpros(_items._id)
      this.qprosData = qprosData
      await this.getSingleProfile(_items)
      this.getScores()
    },
    async getSingleProfile(_items) {
      const {dj_name,iidx_id,sp,dp,_id,access_time} = _items
      if(_items.qprosData){
        this.qprosData = _items.qprosData
      }else{
        if(!this.qprosData)this.qprosData = await this.$axios.getQpros(_items._id)
        _items.qprosData = Object.freeze(this.qprosData) || null
      }
      this.isNameSelectShow = false
      this.profiles = null
      this.profilesData[_items._id]=_items
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
      if(!id)return
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

      // 获取全量charts和music映射表
      // let all_charts =  {}
      // let all_music =  {}
      // resData._related.charts.map(i=>{
      //   if(i.play_style=="DOUBLE" && !all_charts[i._id]){
      //     all_charts[i._id]=i
      //   }
      // })
      // resData._related.music.map(i=>{
      //   if(!all_music[i._id]){
      //     all_music[i._id]=i
      //   }
      // })
      // console.log(this.djName,'all_charts',Object.keys(all_charts).length,all_charts)
      // console.log('all_music',Object.keys(all_music).length,all_music)
      
      // 轮询获取全曲charts
      // const music_list = arcana_data.music_list
      // const music_ids = Object.keys(music_list)
      // let music_charts = {}

      // music_ids.map(async i=>{
      //   const {_items} = await this.$axios.getChartsByMusicId(i)
      //   if(!music_charts[i]){
      //     let music = music_list[i]
      //     music.charts = _items
      //     music_charts[i] = music
      //   }
      // })

      // let i = 0
      // do{
      //   const {_items} = await this.$axios.getChartsByMusicId(music_ids[i])
      //   if(!music_charts[music_ids[i]]){
      //     let music = music_list[music_ids[i]]
      //     music.charts = _items
      //     music_charts[music_ids[i]] = music
      //   }
      //   i+=1
      // }while(i<music_ids.length)
      // console.log('music_charts',music_charts)



      // 手动添加grade
      // const netease_ids_list = {}
      resData._items.map(item=>{
        const {notes} = resData._related.charts.filter(i=>i._id==item.chart_id)[0]
        const{ title:music_title, _id:music_id } = resData._related.music.filter(i=>i._id==item.music_id)[0]
        const netease_ids = this.getNeteaseId(music_title,music_id)
        item.grade = item.ex_score / notes / 2
        item.netease_ids = netease_ids
        // if(!netease_ids_list[item.music_id]){
        //   netease_ids_list[item.music_id] = netease_ids
        // }
      })
      // console.log(this.djName,netease_ids_list)
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
    getNeteaseId(music_title,music_id){
      const {neteaseIdListObj} = localJson
      return neteaseIdListObj[music_id] || []

      // const titleList = this.titleList
      // function replaceTitle(str){
      //     return titleList[str] || str
      // }
      // function parseTitle(str){
      //   return str
      //         .replace(/\ /g,' ')
      //         .replace(/[\*♡♥★☆♨・.！!？?:¡→～~〜◎-\s\(\)\;]/g,'')
      //         .toLowerCase()
      // }
      // const neteaseIdList = localJson.neteaseIdList
      // const parseMusicTitle = parseTitle(replaceTitle(music_title))
      //                         // .replace(/間/g,'间')
      // let netease_ids = []
      // neteaseIdList.forEach(({id,title,artist})=>{
      //   const match = parseTitle(title).match(parseMusicTitle)
      //   if(match){
      //     netease_ids.push({
      //       id,
      //       title,
      //       artist
      //     })
      //   }
      // })
      // if (netease_ids.length>2){
      //   netease_ids = []
      //   neteaseIdList.forEach(({id,title,artist})=>{
      //     const match = parseTitle(title) == parseMusicTitle ||
      //                   parseTitle(title).match(parseMusicTitle) && 
      //                   parseTitle(title).match(/(remix)(version)/ig)
      //     if(match){
      //       netease_ids.push({
      //         id,
      //         title,
      //         artist
      //       })
      //     }
      //   })
      // }
      // if (!netease_ids.length){
      //   neteaseIdList.forEach(({id,title,artist})=>{
      //     const match = parseTitle(title).match(parseMusicTitle.split('feat')[0].split('ft')[0].split('(')[0])
      //     if(match){
      //       netease_ids.push({
      //         id,
      //         title,
      //         artist
      //       })
      //     }
      //   })
      // }
      // if (netease_ids.length<=0)console.log('匹配不到歌名')
      // if (netease_ids.length>0)console.log('匹配')
      // if (netease_ids.length>1)console.log('匹配多个',parseMusicTitle,netease_ids[1].title)
      // return netease_ids
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
        this.$nextTick(()=>{
          })
        this.lv = 'SINGLE'
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
        NO_PLAY,
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
    async continueGetProfile (_items) {
      await this.getSingleProfile(_items)
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
    },
    setBpm(bpm){
      this.bpm = bpm
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
    const query = this.$route.query
    if(query.djName){
      // 有搜索参数
      this.djName = query.djName
      this.lv = query.lv || 'ALL'
      this.playStyle = query.playStyle || 'SINGLE'
      this.getProfiles()
    }else{
      // 没有搜索参数
      this.$refs.nameInp.focus()
      this.getNames()
    }
    this.scoreLiMaxHeight = (document.body.clientHeight - (198+30+21+(20-1)*2))/20
    this.spanMarginTop = this.scoreLiMaxHeight<28?(this.scoreLiMaxHeight-28)/2+'px':'0px'
    this.musicListMaxHeight = document.body.clientHeight - (259+30+21)
    window.onresize=()=>{
      this.scoreLiMaxHeight = (document.body.clientHeight - (198+30+21+(20-1)*2))/20
      this.spanMarginTop = this.scoreLiMaxHeight<28?(this.scoreLiMaxHeight-28)/2+'px':'0px'
      this.musicListMaxHeight = document.body.clientHeight - (259+30+21)
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
  // background-image: linear-gradient(180deg, #5b649b, #3d1259);
  background-size: cover;
  color: $fontColor1;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  width: 100%;
  height: 100%;
  // overflow: hidden;
}
@media screen and (max-device-width: 420px){
  body{
    overflow: hidden;
  }
}
ul,ol{
  list-style: none;
}
::-webkit-scrollbar{
  width: 5px;
}
::-webkit-scrollbar-thumb{
  background: #8689b2;
  border-radius: 2px;
}
::-webkit-scrollbar-track{
  background: rgba(0,0,0,.6);
  border-radius: 2px;
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
  box-sizing: border-box;
  padding-left: 20px;
  // padding-right: 35%;
  // width: 100%;
  width: 352px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  .lv-selector-wrap{
    // background: rgba(51, 51, 51,.5);
    background: linear-gradient(180deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, .2) 49%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, .4) 100%,);
    // border: 1px solid #ccc;
    height: 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    margin-right: 10px;
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
  width: 352px;
  // margin-bottom: 10px;
  padding: 40px 0 20px;
  position: relative;
  >p{
    width: 100%;
    box-sizing: border-box;
    // font-size: 14px;
    text-align: center;
    text-align: left;
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
          // text-indent: .3em;
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
        background: rgba(30,30,30,.8);
        .names-li{
          font-size: 12px;
          line-height: 24px;
          text-align: left;
          text-indent: 0.5em;
          border-bottom: 1px solid #888;
          background: linear-gradient(180deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, .2) 49%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, .4) 100%,);
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
      max-width: 100%;
      width: 375px;
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
            display: inline-block;
            line-height: 24px;
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
    max-width: 100%;
    width: 375px;
    overflow: hidden;
    height: 0;
    transition: height 0.5s;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: relative;
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
        justify-content: flex-start;
        &:nth-last-of-type(1){
          margin-bottom: 100px;
        }
        .wrap{
          display: flex;
          justify-content: space-between;
          line-height: 32px;
        }
        .left-wrap{
          width: 91px;
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
              // background-image: linear-gradient(0deg, rgb(255, 224, 138), rgb(138, 255, 173), rgb(138, 222, 255), rgb(146, 138, 255), rgb(255, 138, 138),);
              background: #fff;
            }
            &.EX_HARD_CLEAR,&.EX_HARD_CLEAR:after{
              background: rgb(255, 17, 0);
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
              filter: blur(4px);
            }
          }
          span{
            padding-right: 5px;
          }
        }
        .right-wrap{
          font-size: 12px;
          box-sizing: border-box;
          // border: 1px solid red;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          // width: 100%;
          .music-name{
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 212px;
            // width: 90%;
            // flex: 1;
            text-align: left;
            cursor: pointer;
          }
          .play-btn{
            width: 16px;
            height: 16px;
            margin: 6px;
            cursor: pointer;
            outline: none;
            z-index:2;
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
              &.B, &.C, &.D, &.E, &.F{
                background: rgb(25, 219, 35);
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
    &.short{
      // height: 460px;
    }
  }
  div.audio-player-box{
    box-sizing: border-box;
    // border: 1px solid red;
    position: fixed;
    bottom: 26px;
    // bottom: -26px;
    left: 50%;
    width: 90%;
    height: 72px;
    transform: translateX(-50%);
    background: #f1f3f4;
    // background: #333;
    border-radius: 15px;
    padding-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    .top-wrap{
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
      font-size: 12px;
      line-height: 14px;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .title-wrap{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        font-size: 18px;
        font-weight: 600;
        line-height: 22px;
        .title{
          max-width: 90%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .more{
          padding-left: 10px;
          cursor: pointer;
          position: relative;
          &:hover .music-ids-ul{
            display: block;
          }
          .music-ids-ul{
            display: none;
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-70%);
            padding: 0 10px;
            background: #f1f3f4;
            box-shadow: 5px 5px 5px rgba(0,0,0,.4);
            border-radius: 10px;
            align-items: flex-start;
            z-index: 3;
            .music-ids-li{
              font-size: 14px;
              line-height: 20px;
              max-width: 300px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              &:hover{
                color: rgb(142, 27, 187);
              }
            }
          }
        }
      }
      .info{
        display: flex;
        align-items: center;
        span{
          padding-right: 20px;
        }
        .artist{
          overflow: hidden;
          max-width: 160px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .bottom-wrap{
      box-sizing: border-box;
      // border: 1px solid red;
      width: 100%;
      height: 30px;
      // background: #f1f3f4;
      border-radius: 15px;
      // padding-right: 10px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .audio-player{
        width: 100%;
        height: 30px;
        outline: none;
      }
      .down-btn{
        width: 20px;
        height: 20px;
        padding-right: 10px;
        cursor: pointer;
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
