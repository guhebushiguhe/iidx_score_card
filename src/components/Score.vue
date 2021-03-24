<template>
    <div :class="`score-modal ${className}`" v-html="imgStr" @dblclick.stop="showMusicList">
    </div>
</template>

<script>

export default {
    name: 'Score',
    props: {
        className: {
            type: String,
            required: false,
            default: ''
        },
        num: {
            type: String,
            required: false,
            default: ''
        },
        type: {
            type: String,
            required: false,
            default: ''
        },
        data: {
            type: Array,
            required: false,
            default: null
        }
    },
    data() {
        return {
            numImg:{
                default:{
                    '0_p': require('@/assets/score/default/0_20p.png'),
                    0: require('@/assets/score/default/0.png'),
                    1: require('@/assets/score/default/1.png'),
                    2: require('@/assets/score/default/2.png'),
                    3: require('@/assets/score/default/3.png'),
                    4: require('@/assets/score/default/4.png'),
                    5: require('@/assets/score/default/5.png'),
                    6: require('@/assets/score/default/6.png'),
                    7: require('@/assets/score/default/7.png'),
                    8: require('@/assets/score/default/8.png'),
                    9: require('@/assets/score/default/9.png'),
                },
                target:{
                    0: require('@/assets/target/0.png'),
                    1: require('@/assets/target/1.png'),
                    2: require('@/assets/target/2.png'),
                    3: require('@/assets/target/3.png'),
                    4: require('@/assets/target/4.png'),
                    5: require('@/assets/target/5.png'),
                    6: require('@/assets/target/6.png'),
                    7: require('@/assets/target/7.png'),
                    8: require('@/assets/target/8.png'),
                    9: require('@/assets/target/9.png'),
                    '%': require('@/assets/target/percent.png'),
                    dot: require('@/assets/target/dot.png'),
                },
                plus:{
                    '0_p': require('@/assets/score/up/0_20p.png'),
                    0: require('@/assets/score/up/0.png'),
                    1: require('@/assets/score/up/1.png'),
                    2: require('@/assets/score/up/2.png'),
                    3: require('@/assets/score/up/3.png'),
                    4: require('@/assets/score/up/4.png'),
                    5: require('@/assets/score/up/5.png'),
                    6: require('@/assets/score/up/6.png'),
                    7: require('@/assets/score/up/7.png'),
                    8: require('@/assets/score/up/8.png'),
                    9: require('@/assets/score/up/9.png'),
                    '+': require('@/assets/score/up/plus.png'),
                    '-': require('@/assets/score/up/minus.png'),
                    '↑': require('@/assets/arrow/arrow_up.png'),
                    '↓': require('@/assets/arrow/arrow_down.png'),
                    '→': require('@/assets/arrow/arrow_default.png'),
                }
            },
            imgStr: ''
        }
    },
    methods: {
        num2Img(num,type){
            if(!num)return ''
            const source = type?this.numImg[type]:this.numImg.default
            let numStr = ''
            if(type == 'plus' && num.length<5){
                const symbol = num.slice(0,2)
                numStr += symbol.split('').map(i=>{
                const className = i=="↑"?'up':''
                return `<img src="${source[`${i}`]}" alt="" class="${className}">`}).join('')
                for(let i=0;i<5-num.length;i++){
                    numStr += `<img src="${source['0_p']}" alt="" >`
                }
                const trueNum = num.slice(2)
                numStr += trueNum.split('').map(i=>{
                return `<img src="${source[i]}" alt="" >`}).join('')
                return numStr
            }
            if(type == 'default' && num.length<4){
                for(let i=0;i<4-num.length;i++){
                    numStr += `<img src="${source['0_p']}" alt="" >`
                }
            }
            numStr += num.split('').map(i=>{
                i = i=="."?'dot':i
                return `<img src="${source[`${i}`]}" alt="" >`}).join('')
            return numStr
        },
        showMusicList() {
            console.log('showMusicList',this.data)
        }
    },
    watch:{
        num(val,oldVal){
            if(val==oldVal)return
            this.imgStr = this.num2Img(this.num,this.type)
        }
    },
    mounted(){
        this.imgStr = this.num2Img(this.num,this.type)
    }
}
</script>
<style lang="scss">
.score-modal{
    height: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .up{
        // position: relative;
        // height: 30px;
        width: 24px !important;
    }
}
</style>