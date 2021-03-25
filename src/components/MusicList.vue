<template>
    <div :class="className">
        <ul class="music-ul">
            <li
                class="music-li"
                v-for="({_id,lamp,grade,music,charts}) in data"
                :key="_id"
            >
                <div class="wrap left-wrap">
                    <span :class="`lamp ${lamp}`"></span>
                    <Score :num="charts.rating.toString()" :type="typeList[charts.difficulty]" label="music-level" />
                    <Label :text="grade2Str(grade)" type="small" />
                </div>
                <div class="wrap right-wrap">
                    <span
                        class="music-name"
                        @click="gotoChartsLink(charts)"
                    >{{music.title}}</span>
                </div>
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
            default: []
        },
    },
    components:{
        Score,
        Label,
    },
    data() {
        return {
            typeList:{
                BEGINNER: 'green',
                NORMAL: 'default',
                HYPER: 'yellow',
                ANOTHER: 'down',
                LEGGENDARIA: 'black',
            }
        }
    },
    methods:{
        grade2Str(grade){
            const gradeList = [
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
            console.log(charts)
            // const chart_id = charts._id
            // const music_id = charts.music_id
            // const link = `https://arcana.nu/iidx/27/music/${music_id}/${chart_id}` 
            // window.open(link)
        }
    }
}
</script>
<style lang="scss">
@-moz-keyframes blinker {  
 0% { opacity: 1.0; }
 50% { opacity: 0.7; }
 100% { opacity: 1.0; }
 }

@-webkit-keyframes blinker {  
 0% { opacity: 1.0; }
 50% { opacity: 0.7; }
 100% { opacity: 1.0; }
 }

@keyframes blinker {  
 0% { opacity: 1.0; }
 50% { opacity: 0.7; }
 100% { opacity: 1.0; }
 }
.FULL_COMBO, .EX_HARD_CLEAR, .HARD_CLEAR {
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

 color: white;
}
</style>
