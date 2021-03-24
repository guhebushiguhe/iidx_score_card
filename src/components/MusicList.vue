<template>
    <div :class="className">
        <ul class="music-ul">
            <li
                class="music-li"
                v-for="({_id,lamp,grade,music,charts}) in data"
                :key="_id"
            >
                <div class="wrap left-wrap">
                    <span>{{lamp}}</span>
                    <span>{{grade2Str(grade)}}</span>
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
    data() {
        return {}
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
            const link = charts._links._self
            window.open(link)
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
