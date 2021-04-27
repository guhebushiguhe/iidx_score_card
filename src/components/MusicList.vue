<template>
    <div
        :class="`${className}`"
        v-show="data && data.length>0"
        :style="{maxHeight:musicListMaxHeight+'px'}"
    >
        <ul class="music-ul">
            <li
                class="music-li"
                v-for="({_id,lamp,grade,music,charts,netease_ids}) in data"
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
        }
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
            const touch = event.touches ? event.touches[0] : event
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
    },
    beforeDestroy(){
        clearInterval(this.playerTimer)
        this.playerTimer = null
    },
    watch:{
        data(val,oldVal){
            if(val==oldVal)return
            if(!this.data.length)this.hidePlayer()
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
</style>
