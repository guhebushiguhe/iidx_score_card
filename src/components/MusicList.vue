<template>
    <div :class="className" v-if="data && data.length>0">
        <ul class="music-ul">
            <li
                class="music-li"
                v-for="({_id,lamp,grade,music,charts}) in data"
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
                        >{{music.title}}</span>
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
    },
    components:{
        Score,
        Label,
    },
    data() {
        return {
            touchTimer: null,
            img:{
                music_li_cover: require('@/assets/music_li_cover.png')
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
            ]
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
                const difficulty = charts.difficulty=='BLACK'?'LEGGENDARIA':charts.difficulty
                const rating = charts.rating
                const copyStr = `${music.title} ${playStyle} ${difficulty} lv.${rating}`
                // alert(`${music.title} ${playStyle} ${difficulty} lv.${rating}`)
                this.$copyText(copyStr)
                .then(res => {
                    // alert("复制成功")
                    this.$message.success(`复制成功 ${copyStr}`)
                },err => {
                    this.$message.error('复制失败')
                    // alert("复制失败")
                })
            },1000)
        },
        touchend(){
            clearTimeout(this.touchTimer)
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
