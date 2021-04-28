<template>
    <div
        :class="`${className}`"
        v-show="data && data.length>0"
        :style="{maxHeight:musicListMaxHeight+'px'}"
    >
        <ul class="music-ul">
            <div class="topEmpty" :style="{height: topEmptyHeight+'px'}"></div>
            <li
                class="music-li"
                v-for="({_id,lamp,grade,music,charts,netease_ids}) in dataActive"
                :key="_id"
                @touchstart="touchstart(music,charts)"
                @touchend="touchend"
                @mousedown="touchstart(music,charts)"
                @mouseup="touchend"
            >
                <div class="wrap left-wrap">
                    <span :class="`lamp ${lamp}`"></span>
                    <Score :num="charts.rating.toString()" :type="typeList[charts.difficulty]" label="music-level" />
                    <Label :text="grade2Str(grade)" type="small" />
                </div>
                <div class="wrap right-wrap">
                    <span
                        class="music-name"
                        :style="{maxWidth:musicNameWidth+'px'}"
                    >{{music.title}}</span>
                    <img
                        :src="playBtnSrc(music,'list')"
                        alt=""
                        v-if="netease_ids.length"
                        class="play-btn"
                        @click="playSong(netease_ids,music,charts)"
                    >
                </div>
                <div class="main-wrap">
                    <div class="grade-wrap">
                        <div :class="`grade-score ${gradeColor(grade,lamp)}`" :style="gradeStyle(grade)"></div>
                        <div class="grade-bg"></div>
                    </div>
                </div>
                <div class="music-li-cover" :style="{background: `url(${img.music_li_cover})`,backgroundSize: '100% 100%'}"></div>
            </li>
            <div class="bottomEmpty" :style="{height: bottomEmptyHeight+'px'}"></div>
        </ul>
        <div
            class="audio-player-box"
            :class="musicUrl!=''?'show':''"
            @touchstart="handlePlayerTouchStart"
            @touchmove="handlePlayerTouchMove"
            @touchend="handlePlayerTouchEnd"
        >
            <div class="total-wrap">
                <div class="top-wrap">
                    <span class="title-wrap">
                        <span class="title">{{ playMusic?playMusic.title:'' }}</span>
                        <span class="more" v-if="ids.length>1">···
                            <ul class="music-ids-ul">
                                <li
                                    class="music-ids-li"
                                    v-for="(item,key) in ids"
                                    :key="key"
                                    @click="changeUrl(item)"
                                >
                                    {{ item.title }}
                                </li>
                            </ul>
                        </span>
                    </span>
                    <span class="info">
                        <span class="artist">
                            Artist: {{ playMusic?playMusic.artist:'' }}
                        </span>
                        <span class="folder">
                            Folder: {{ playMusic?playMusic.folder:'' }}
                        </span>
                        <span class="bpm">
                            BPM: {{ playMusic?playMusic.bpm:'' }}
                        </span>
                    </span>
                </div>
                <div class="bottom-wrap">
                    <audio
                        ref="audio"
                        class="audio-player"
                        :src="musicUrl"
                        crossOrigin="anonymous"
                        @pause="audioPause"
                        @play="audioPlay"
                        controls
                        autoplay
                        loop
                    >您的浏览器不支持 audio 标签</audio>
                    <div class='player-wrap'>
                        <div class="cover-wrap" :style="{animationPlayState: `${isAudioPlaying?'running':'paused'}`}">
                            <img :src="playMusic?(playMusic.picUrl || img.cover):null" alt="" class="cover">
                            <img :src="img.disc" alt="" class="disc">
                        </div>
                        <span :class="`time ${isAudioPlaying?'playing':''}`">{{timeMoveAble ? toCurrentTimeStr : currentTimeStr}}</span>
                        <img
                            :src="playBtnSrc(playMusic || {_id:''},'player')"
                            alt=""
                            class="play-btn"
                            @click="togglePlay"
                        >
                    </div>
                    <img :src="img.down" alt="" class="down-btn" @click="hidePlayer">
                </div>
                <av-bars
                    ref-link="audio"
                    class="audio-visual"
                    caps-color="#FFF"
                    :bar-color="['rgba(255,255,255,0)', 'rgba(255,255,255,.05)', 'rgba(255,255,255,.1)']"
                    :bar-width="10"
                    :bar-space="2"
                    :canv-width="400"
                    :canv-height="90"
                    :caps-height="2"
                ></av-bars>
                <div
                    class="time-line"
                    :style="{width: `${currentTime/duration*100}%`}"
                >
                    <div
                        class="time-handle"
                        :style="{left: timeBarLeft+'px'}"
                        @mousedown.stop="handleStartChangeCurrentTime"
                        @touchstart.stop="handleStartChangeCurrentTime"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Score from '@/components/Score.vue'
import Label from '@/components/Label.vue'
export default {
    name: 'MusicList',
    props:{
        className:{
            type: String,
            required: false,
            default: ''
        },
        data:{
            type: Array,
            required: false,
            default: ()=>[]
        },
        setBpm:{
            type: Function,
            required: false,
            default: ()=>{}
        },
        musicListMaxHeight:{
            type: Number,
            required: false,
            default: 9999
        }
    },
    components:{
        Score,
        Label,
    },
    data() {
        return {
            touchTimer: null,
            musicUrl: '',
            ids: [],
            playMusic: null,
            isAudioPlaying: false,
            isPlayerShow: false,
            img:{
                music_li_cover: require('@/assets/music_li_cover.png'),
                down: require('@/assets/down.png'),
                play: require('@/assets/play.png'),
                playing: require('@/assets/playing.png'),
                pause: require('@/assets/pause.png'),
                disc: require('@/assets/disc.png'),
                cover: require('@/assets/cover.jpg'),
            },
            typeList:{
                BEGINNER: 'green',
                NORMAL: 'default',
                HYPER: 'yellow',
                ANOTHER: 'down',
                BLACK: 'black',
            },
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
            musicNameWidth: 9999,
            currentTime: 0,
            duration: 0,
            toCurrentTime: 0,
            timeMoveAble: false,
            playerTimer: null,
            touchPosX: null,
            touchStartX: null,
            dataActive: null,
            topEmptyHeight: 0,
            bottomEmptyHeight: 0,
            focusIndex: null
        }
    },
    computed:{
        currentTimeStr () {
            const currentTime = this.currentTime
            let mm = parseInt(currentTime/60)
            let ss = parseInt(currentTime)%60
            if(mm.toString().length==1)mm = '0'+mm
            if(ss.toString().length==1)ss = '0'+ss
            return `${mm}:${ss}`
        },
        toCurrentTimeStr () {
            const toCurrentTime = this.toCurrentTime
            let mm = parseInt(toCurrentTime/60)
            let ss = parseInt(toCurrentTime)%60
            if(mm.toString().length==1)mm = '0'+mm
            if(ss.toString().length==1)ss = '0'+ss
            return `${mm}:${ss}`
        },
        timeBarLeft () {
            const timeMoveAble = this.timeMoveAble
            const app = document.querySelector('#app')
            return timeMoveAble
            ?this.toCurrentTime / this.duration * app.offsetWidth
            :this.currentTime / this.duration * app.offsetWidth
        },
        // activeIndex(){
        //     const data = this.data
        //     const data_show = data.filter(i=>i.show)
        //     const viewLimit = 50
        //     const ulPaddingBottom = 0
        //     const el_musicList = document.querySelector('.music-list')
        //     const musicListHeight = el_musicList?el_musicList.offsetHeight:0
        //     const ulMaxScrollTop = data_show.length*42-10+ulPaddingBottom-musicListHeight
        //     const scrollTop = el_musicList?el_musicList.scrollTop:0
        //     const focusIndex = parseInt(scrollTop/ulMaxScrollTop)
        //     let firstIndex = 0
        //     let lastIndex = 99
        //     if(focusIndex>=viewLimit){
        //         firstIndex = focusIndex-focusIndex%viewLimit
        //         lastIndex = firstIndex+viewLimit-1<=ulMaxScrollTop?firstIndex+viewLimit-1:ulMaxScrollTop
        //     }
        //     return {
        //         firstIndex,
        //         lastIndex
        //     }
        // },
        // dataActive(){
        //     const data = this.data
        //     const data_show = data.filter(i=>i.show)
        //     const firstIndex = this.activeIndex.firstIndex
        //     const lastIndex = this.activeIndex.lastIndex
        //     const data_active = data_show.filter((i,index)=>index>=firstIndex && index<=lastIndex)
        //     return data_active
        // },
        // emptyHeight(){
        //     const ulPaddingBottom = 0
        //     return {
        //         topEmptyHeight: this.activeIndex.firstIndex*42,
        //         bottomEmptyHeight: this.activeIndex.lastIndex*42+ulPaddingBottom
        //     }
        // }
    },
    methods:{
        grade2Str(grade){
            const gradeList = this.gradeList
            let gradeStr = ''
            gradeList.some(item=>{
                if(grade >= item.min && grade < item.max){
                    gradeStr = item.grade
                    return true
                }
            })
            return gradeStr
        },
        gotoChartsLink(charts){
            // console.log(charts)
            const chart_id = charts._id
            const music_id = charts.music_id
            const link = `https://arcana.nu/iidx/27/music/${music_id}/${chart_id}` 
            window.open(link)
        },
        gradeStyle(grade){
            return {
                width: `${(grade-0)*100}%`,
            }
        },
        gradeColor(grade,lamp){
            const gradeList = this.gradeList
            const colorful = lamp=='FULL_COMBO'?'colorful':''
            let color = ''
            gradeList.some(i=>{
                if(grade>i.min && grade<=i.max){
                    color = i.grade
                    return true
                }
            })
            return `${color} ${['MAX','MAX-','AAA','AA'].includes(color)?colorful:''}`
        },
        touchstart(music,charts){
            clearTimeout(this.touchTimer)
            this.touchTimer = setTimeout(()=>{
                const playStyle = charts.play_style=='SINGLE'?'SP':'DP'
                // const difficulty = charts.difficulty=='BLACK'?'LEGGENDARIA':charts.difficulty
                const diffLists = {
                    BEGINNER: 'B',
                    NORMAL: 'N',
                    HYPER: 'H',
                    ANOTHER: 'A',
                    BLACK: 'L'
                }
                const difficulty = diffLists[charts.difficulty]
                const rating = charts.rating
                const copyStr = `[${playStyle}${difficulty}${rating}] ${music.title}`
                this.$copyText(copyStr)
                .then(res => {
                    this.$message.success(`复制成功 ${copyStr}`)
                },err => {
                    this.$message.error('复制失败')
                })
            },1000)
        },
        touchend(){
            clearTimeout(this.touchTimer)
        },
        async playSong(ids,music,charts){
            const playMusic = this.playMusic
            const isAudioPlaying = this.isAudioPlaying
            if(playMusic && music._id==playMusic._id){
                if(isAudioPlaying){
                    this.audioPause()
                }else{
                    this.audioPlay()
                }
                return
            }
            const id = ids[0].id
            const {data} = await this.$axios.getSongUrl(id)
            this.musicUrl = data[0].url
            const {songs} = await this.$axios.getSongDetails(id)
            const picUrl = songs[0].al.picUrl
            const bpm = charts.bpm_min != charts.bpm_max
                        ?`${charts.bpm_min} - ${charts.bpm_max}`
                        :charts.bpm_min
            this.playMusic = {
                _id: music._id,
                picUrl,
                maxbpm: charts.bpm_max,
                bpm,
                title: ids[0].title,
                artist: ids[0].artist,
                folder: music.folder
            }
            this.ids = ids
            this.isAudioPlaying = true
            this.isPlayerShow = true
            this.setBpm(charts.bpm_max)
        },
        togglePlay(){
            const playMusic = this.playMusic
            const isAudioPlaying = this.isAudioPlaying
            if(!playMusic)return
            if(isAudioPlaying){
                this.audioPause()
            }else{
                this.audioPlay()
            }
        },
        audioPlay() {
            const el_audio = document.querySelector('audio')
            this.isAudioPlaying = true
            el_audio.play()
            this.currentTime = el_audio.currentTime
            this.duration = el_audio.duration
            clearInterval(this.playerTimer)
            this.playerTimer=null
            this.playerTimer=setInterval(()=>{
                this.currentTime = document.querySelector('audio').currentTime
            },100)
            if(this.playMusic)this.setBpm(this.playMusic.maxbpm)
        },
        audioPause() {
            const el_audio = document.querySelector('audio')
            this.isAudioPlaying = false
            this.setBpm(null)
            el_audio.pause()
            clearInterval(this.playerTimer)
            this.playerTimer = null
        },
        hidePlayer() {
            this.musicUrl = ''
            this.playMusic = null
            this.isAudioPlaying = false
            this.isPlayerShow = false
            this.setBpm(null)
        },
        async changeUrl(idData){
            const { id, title, artist } = idData
            const {data} = await this.$axios.getSongUrl(id)
            this.musicUrl = data[0].url
            this.playMusic.title = title
            this.playMusic.artist = artist
        },
        playBtnSrc(music,type){
            const playMusic = this.playMusic
            const img = this.img
            const isAudioPlaying = this.isAudioPlaying
            if(type=='player'){
                return isAudioPlaying?img.pause:img.play
            }
            if(playMusic && music._id==playMusic._id){
                return isAudioPlaying?img.playing:img.pause
            }else{
                return img.play
            }
        },
        handleStartChangeCurrentTime(){
            this.timeMoveAble = true
        },
        handleMoveChangeCurrentTime(){
            if(!this.timeMoveAble || this.touchPosX)return
            const duration = this.duration
            const currentWidth = document.querySelector('.time-line').offsetWidth
            const appWidth = document.querySelector('#app').offsetWidth
            const appLeft = document.querySelector('#app').offsetLeft
            const el_timeHandle = document.querySelector('.time-handle')
            const touch = window.event.touches ? window.event.touches[0] : window.event
            const diffX = touch.clientX - el_timeHandle.offsetLeft - appLeft + appWidth/2
            const newLeft = el_timeHandle.offsetLeft + diffX
            el_timeHandle.style.left = newLeft + 3 + 'px'
            this.toCurrentTime = newLeft/ appWidth * duration
        },
        handleEndChangeCurrentTime(){
            if(!this.timeMoveAble)return
            // console.log(this.toCurrentTime)
            this.timeMoveAble = false
            const el_audio = document.querySelector('audio')
            el_audio.currentTime = this.toCurrentTime-0
            this.currentTime = this.toCurrentTime-0
            this.toCurrentTime = null
        },
        handlePlayerTouchStart(){
            this.touchPosX = event.touches[0].clientX
            this.touchStartX = document.querySelector('.time-line').offsetWidth
        },
        handlePlayerTouchMove(){
            if(!this.touchPosX)return
            const touch = event.touches[0]
            const touchDiffX = touch.clientX - this.touchPosX
            if(Math.abs(touchDiffX) < 10 && !this.toCurrentTime)return
            this.timeMoveAble = true
            const duration = this.duration
            const appWidth = document.querySelector('#app').offsetWidth
            const el_timeHandle = document.querySelector('.time-handle')
            let newLeft = this.touchStartX + 2*touchDiffX
            if(newLeft < 0)newLeft = 0
            if(newLeft > appWidth)newLeft = appWidth
            el_timeHandle.style.left = newLeft + 3 + 'px'
            this.toCurrentTime = newLeft/ appWidth * duration
        },
        handlePlayerTouchEnd(){
            if(!this.touchPosX)return
            this.handleEndChangeCurrentTime()
            this.touchPosX = null
            this.touchStartX = null
        },
        setDataActive_emptyHeight(){
            const data = this.data
            if(!data)return
            const data_show = data.filter(i=>i.show)
            const data_length = data_show.length
            const viewLimit = 20
            const ulPaddingBottom = 120
            const el_musicList = document.querySelector('.music-list')
            const musicListHeight = el_musicList?el_musicList.offsetHeight:0
            const ulMaxScrollTop = data_length*42-10+ulPaddingBottom-musicListHeight
            const scrollTop = el_musicList?el_musicList.scrollTop:0
            const focusIndex = Math.floor(scrollTop/ulMaxScrollTop*data_length)
            if(this.focusIndex == focusIndex && this.focusIndex!=0)return
            this.focusIndex = focusIndex
            // console.log('scrollTop',scrollTop)
            let firstIndex = 0
            let lastIndex = viewLimit*3-1
            if(focusIndex>=viewLimit){
                firstIndex = focusIndex-focusIndex%viewLimit-viewLimit
            }
            lastIndex = firstIndex+viewLimit*3-1<=ulMaxScrollTop?firstIndex+viewLimit*3-1:data_length-1
            if(focusIndex+viewLimit*2-1>=data_length){
                firstIndex = data_length-viewLimit*3
                lastIndex = data_length-1
            }
            // console.log('focusIndex',focusIndex,'firstIndex',firstIndex,'lastIndex',lastIndex)
            const data_active = data_show.filter((i,index)=>index>=firstIndex && index<=lastIndex)
            this.dataActive = data_active
            this.topEmptyHeight = firstIndex*42
            this.bottomEmptyHeight = (data_length-1-lastIndex)*42+ulPaddingBottom
            // this.bottomEmptyHeight = bottomEmptyHeight>=0?bottomEmptyHeight:0
        }
    },
    mounted(){
        this.musicNameWidth = document.body.clientWidth - (91+37+28+5)
        window.onresize = ()=>{
            this.musicNameWidth = document.body.clientWidth - (91+37+28+5)
        }
        document.onmousemove = this.handleMoveChangeCurrentTime
        document.ontouchmove = this.handleMoveChangeCurrentTime
        document.onmouseup = this.handleEndChangeCurrentTime
        document.ontouchend = this.handleEndChangeCurrentTime
        this.setDataActive_emptyHeight()
        const el = document.querySelector('.music-list')
        if(el)el.addEventListener('scroll',this.setDataActive_emptyHeight)
    },
    beforeDestroy(){
        clearInterval(this.playerTimer)
        this.playerTimer = null
    },
    watch:{
        data(val,oldVal){
            if(val==oldVal)return
            if(!this.data.length){
                this.hidePlayer()
            }else{
                this.focusIndex = null
                this.setDataActive_emptyHeight()
                const el = document.querySelector('.music-list')
                if(el)el.addEventListener('scroll',this.setDataActive_emptyHeight)
            }
        }
    }
}
</script>
<style lang="scss">
@-moz-keyframes blinker {  
 0% { opacity: 1.0; }
 25% { opacity: 0.7; }
 50% { opacity: 1.0; }
 75% { opacity: 0.7; }
 100% { opacity: 1.0; }
 }

@-webkit-keyframes blinker {  
 0% { opacity: 1.0; }
 25% { opacity: 0.7; }
 50% { opacity: 1.0; }
 75% { opacity: 0.7; }
 100% { opacity: 1.0; }
 }

@keyframes blinker {  
 0% { opacity: 1.0; }
 25% { opacity: 0.7; }
 50% { opacity: 1.0; }
 75% { opacity: 0.7; }
 100% { opacity: 1.0; }
 }

@-moz-keyframes fc_color {  
 0% { background: rgb(255, 255, 255); opacity: 1.0; }
 25% { opacity: 0.7; }
 50% { background: rgb(255, 241, 49); opacity: 1.0; }
 75% { opacity: 0.7; }
 100% { background: rgb(255, 255, 255); opacity: 1.0; }
 }

@-webkit-keyframes fc_color {  
 0% { background: rgb(255, 255, 255); opacity: 1.0; }
 25% { opacity: 0.7; }
 50% { background: rgb(255, 241, 49); opacity: 1.0; }
 75% { opacity: 0.7; }
 100% { background: rgb(255, 255, 255); opacity: 1.0; }
 }

@keyframes fc_color {  
 0% { background: rgb(255, 255, 255); opacity: 1.0; }
 25% { opacity: 0.7; }
 50% { background: rgb(255, 241, 49); opacity: 1.0; }
 75% { opacity: 0.7; }
 100% { background: rgb(255, 255, 255); opacity: 1.0; }
 }

@-moz-keyframes exc_color {  
 0% { background: rgb(240, 30, 30); opacity: 1.0; }
 25% { opacity: 0.7; }
 50% { background: rgb(255, 241, 49); opacity: 1.0; }
 75% { opacity: 0.7; }
 100% { background: rgb(240, 30, 30); opacity: 1.0; }
 }

@-webkit-keyframes exc_color {  
 0% { background: rgb(240, 30, 30); opacity: 1.0; }
 25% { opacity: 0.7; }
 50% { background: rgb(255, 241, 49); opacity: 1.0; }
 75% { opacity: 0.7; }
 100% { background: rgb(240, 30, 30); opacity: 1.0; }
 }

@keyframes exc_color {  
 0% { background: rgb(240, 30, 30); opacity: 1.0; }
 25% { opacity: 0.7; }
 50% { background: rgb(255, 241, 49); opacity: 1.0; }
 75% { opacity: 0.7; }
 100% { background: rgb(240, 30, 30); opacity: 1.0; }
 }

.FAILED {
-webkit-animation-name: blinker;
-webkit-animation-duration: .2s;
-webkit-animation-timing-function: linear;
-webkit-animation-iteration-count: infinite;

-moz-animation-name: blinker;
-moz-animation-duration: .2s;
-moz-animation-timing-function: linear;
-moz-animation-iteration-count: infinite;

 animation-name: blinker;
 animation-duration: .2s;
 animation-timing-function: linear;
 animation-iteration-count: infinite;

}

.FULL_COMBO {
-webkit-animation-name: fc_color;
-webkit-animation-duration: .2s;
-webkit-animation-timing-function: linear;
-webkit-animation-iteration-count: infinite;

-moz-animation-name: fc_color;
-moz-animation-duration: .2s;
-moz-animation-timing-function: linear;
-moz-animation-iteration-count: infinite;

 animation-name: fc_color;
 animation-duration: .2s;
 animation-timing-function: linear;
 animation-iteration-count: infinite;
}
.EX_HARD_CLEAR {
-webkit-animation-name: exc_color;
-webkit-animation-duration: .2s;
-webkit-animation-timing-function: linear;
-webkit-animation-iteration-count: infinite;

-moz-animation-name: exc_color;
-moz-animation-duration: .2s;
-moz-animation-timing-function: linear;
-moz-animation-iteration-count: infinite;

 animation-name: exc_color;
 animation-duration: .2s;
 animation-timing-function: linear;
 animation-iteration-count: infinite;
}


  .music-list{
    max-width: 100%;
    width: 400px;
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
        // &:nth-last-of-type(1){
        //   margin-bottom: 120px;
        // }
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
            width: 227px;
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
    div.audio-player-box{
      user-select:none;
      box-sizing: border-box;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0;
      overflow: hidden;
      background: linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,.8) 20%,rgba(0,0,0,1) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
      transition: height .2s;
      &.show{
        height: 180px;
      }
      .total-wrap{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        .top-wrap{
          width: 100%;
          box-sizing: border-box;
          padding: 0 20px;
          font-size: 12px;
          line-height: 14px;
          // color: #333;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .title-wrap{
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: 600;
            line-height: 22px;
            .title{
              max-width: 90%;
              overflow: hidden;
              text-align: left;
              margin-bottom: 5px;
              // white-space: nowrap;
              // text-overflow: ellipsis;
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
                bottom: 0;
                right: 20px;
                box-sizing: border-box;
                padding: 5px 20px;
                background: rgba(0,0,0,.8);
                align-items: flex-start;
                z-index: 3;
                .music-ids-li{
                  font-size: 16px;
                  line-height: 28px;
                  max-width: 300px;
                  overflow: hidden;
                  text-align: left;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  color: #bbb;
                  &:hover{
                    color: #fff;
                    // color: rgb(142, 27, 187);
                  }
                }
              }
            }
          }
          .info{
            display: flex;
            align-items: center;
            span{
              padding-right: 10px;
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
          padding: 15px 0 15px;
          // border: 1px solid red;
          // width: 100%;
          // height: 30px;
          // background: #f1f3f4;
          border-radius: 15px;
          // padding-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          .audio-player{
            width: 100%;
            height: 30px;
            outline: none;
            display: none;
          }
          .player-wrap{
            width: 180px;
            margin-right: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .cover-wrap{
              width: 60px;
              height: 60px;
              margin-right: 5px;
              position: relative;
              @keyframes disc_rotate{
                0% { transform: rotate(0deg)}
                50% { transform: rotate(180deg)}
                100% { transform: rotate(360deg)}
              }
              -webkit-animation-name: disc_rotate;
              -webkit-animation-duration: 20s;
              -webkit-animation-timing-function: linear;
              -webkit-animation-iteration-count: infinite;
              -webkit-animation-fill-mode : forwards;
              -webkit-animation-play-state: paused;
              -moz-animation-name: disc_rotate;
              -moz-animation-duration: 20s;
              -moz-animation-timing-function: linear;
              -moz-animation-iteration-count: infinite;
              -moz-animation-fill-mode : forwards;
              -moz-animation-play-state: paused;
              .cover{
                width: 55%;
                height: 55%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                border-radius: 50%;
              }
              .disc{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
              }
            }
            .time{
              color: #888;
              font-size: 28px;
              line-height: 28px;
              font-weight: 700;
              vertical-align: text-top;
              &.playing{
                color: #fff;
              }
            }
            .play-btn{
              width: 28px;
              height: 28px;
              margin: 6px;
              cursor: pointer;
              outline: none;
              z-index:2;
            }
          }
          .down-btn{
            width: 20px;
            height: 20px;
            padding-right: 10px;
            cursor: pointer;
          }
        }
        .audio-visual{
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          z-index: -2;
        }
        .time-line{
          position: absolute;
          bottom: 6px;
          left: 0;
          height: 3px;
          background: #99a0ff;
          .time-handle{
            width: 6px;
            height: 6px;
            border-radius: 50%;
            border: 2px solid #99a0ff;
            background: #fff;
            position: absolute;
            top: 50%;
            transform: translate(-50%,-50%);
            &:hover{
              width: 12px;
              height: 12px;
            }
          }
        }
      }
    }
  }
</style>
