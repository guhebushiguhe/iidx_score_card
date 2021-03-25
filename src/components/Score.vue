<template>
    <div :class="`score-modal ${className} ${isActive} ${label}`" v-html="imgStr" @click.stop="showMusicList(label,data,type)">
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
        activeType: {
            type: String,
            required: false,
            default: ''
        },
        data: {
            type: Array,
            required: false,
            default: null
        },
        label: {
            type: String,
            required: false,
            default: ''
        },
        activeLabel: {
            type: String,
            required: false,
            default: ''
        },
        showMusicList: {
            type: Function,
            required: false,
            default: ()=>{}
        },
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
                },
                down:{
                    0: require('@/assets/score/yellow/0.png'),
                    1: require('@/assets/score/yellow/1.png'),
                    2: require('@/assets/score/yellow/2.png'),
                    3: require('@/assets/score/yellow/3.png'),
                    4: require('@/assets/score/yellow/4.png'),
                    5: require('@/assets/score/yellow/5.png'),
                    6: require('@/assets/score/yellow/6.png'),
                    7: require('@/assets/score/yellow/7.png'),
                    8: require('@/assets/score/yellow/8.png'),
                    9: require('@/assets/score/yellow/9.png'),
                },
                yellow:{
                    0: require('@/assets/score/yellow/0.png'),
                    1: require('@/assets/score/yellow/1.png'),
                    2: require('@/assets/score/yellow/2.png'),
                    3: require('@/assets/score/yellow/3.png'),
                    4: require('@/assets/score/yellow/4.png'),
                    5: require('@/assets/score/yellow/5.png'),
                    6: require('@/assets/score/yellow/6.png'),
                    7: require('@/assets/score/yellow/7.png'),
                    8: require('@/assets/score/yellow/8.png'),
                    9: require('@/assets/score/yellow/9.png'),
                },
                green:{
                    0: require('@/assets/score/green/0.png'),
                    1: require('@/assets/score/green/1.png'),
                    2: require('@/assets/score/green/2.png'),
                    3: require('@/assets/score/green/3.png'),
                    4: require('@/assets/score/green/4.png'),
                    5: require('@/assets/score/green/5.png'),
                    6: require('@/assets/score/green/6.png'),
                    7: require('@/assets/score/green/7.png'),
                    8: require('@/assets/score/green/8.png'),
                    9: require('@/assets/score/green/9.png'),
                },
                black:{
                    0: require('@/assets/score/black/0.png'),
                    1: require('@/assets/score/black/1.png'),
                    2: require('@/assets/score/black/2.png'),
                    3: require('@/assets/score/black/3.png'),
                    4: require('@/assets/score/black/4.png'),
                    5: require('@/assets/score/black/5.png'),
                    6: require('@/assets/score/black/6.png'),
                    7: require('@/assets/score/black/7.png'),
                    8: require('@/assets/score/black/8.png'),
                    9: require('@/assets/score/black/9.png'),
                },
            },
            imgStr: ''
        }
    },
    computed:{
        isActive(){
            const inactive = this.label == this.activeLabel
                        && this.type != this.activeType
                        && this.activeLabel != ''
                        && this.activeType != ''
            return inactive?'inactive':''
        }
    },
    methods: {
        num2Img(num,type){
            if(!num)return ''
            let numStr = ''
            const source = type?this.numImg[type]:this.numImg.default
            const label = this.label
            if(!['music-level'].includes(label)){
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
            }
            numStr += num.split('').map(i=>{
                i = i=="."?'dot':i
                return `<img src="${source[`${i}`]}" alt="" >`}).join('')
            return numStr
        },
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
    height: 28px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.5s;
    .up{
        width: 24px !important;
    }
    &.inactive{
        opacity: 0;
    }
    &.music-level{
        width: 30px;
    }
}
</style>