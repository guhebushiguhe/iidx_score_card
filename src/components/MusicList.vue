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
                        :src="playBtnSrc(music)"
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
        <div class="audio-player-box" v-if="musicUrl!=''">
            <div class="top-wrap">
                <span class="title-wrap">
                    <span class="title">{{ playMusic.title }}</span>
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
                        Artist: {{ playMusic.artist }}
                    </span>
                    <span class="folder">
                        Folder: {{ playMusic.folder }}
                    </span>
                </span>
            </div>
            <div class="bottom-wrap">
                <audio ref="audio" class="audio-player" :src="musicUrl" @pause="audioPause" @play="audioPlay" controls autoplay loop >您的浏览器不支持 audio 标签</audio>
                <img :src="img.down" alt="" class="down-btn" @click="hidePlayer">
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
        }
    },
    computed:{ 
      musicNameWidth(){
        return document.body.clientWidth - (91+37+28+5)
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
                const el_audio = document.querySelector('audio')
                if(isAudioPlaying){
                    this.audioPause()
                    this.setBpm(null)
                    el_audio.pause()
                    return
                }else{
                    el_audio.play()
                    this.setBpm(charts.bpm_max)
                    this.audioPlay()
                    return
                }
            }
            const id = ids[0].id
            const {data} = await this.$axios.getSongUrl(id)
            this.musicUrl = data[0].url
            this.playMusic = {
                _id: music._id,
                title: ids[0].title,
                artist: ids[0].artist,
                folder: music.folder
            }
            this.ids = ids
            this.isAudioPlaying = true
            this.isPlayerShow = true
            this.setBpm(charts.bpm_max)
        },
        audioPlay() {
            this.isAudioPlaying = true
        },
        audioPause() {
            this.isAudioPlaying = false
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
        playBtnSrc(music){
            const playMusic = this.playMusic
            const img = this.img
            const isAudioPlaying = this.isAudioPlaying
            if(playMusic && music._id==playMusic._id){
                return isAudioPlaying?img.playing:img.pause
            }else{
                return img.play
            }
        }
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
