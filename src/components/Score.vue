<template>
    <div :class="`score-modal ${className}`" v-html="imgStr">
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
    },
    data() {
        return {
            numImg:{
                default:{
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
            const source = type?this.numImg[type]:this.numImg.default
            return num.split('').map(i=>{
                i = i=="."?'dot':i
                return `<img src="${source[`${i}`]}" alt="" >`
                }).join('')
        }
    },
    mounted(){
        this.imgStr = this.num2Img(this.num,this.type)
    }
}
</script>
<style lang="scss" scoped>
.score-modal{
    color: red;
    img{
        height: 20px;
    }
}
</style>