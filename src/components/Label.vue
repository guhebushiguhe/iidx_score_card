<template>
    <div :class="`label-modal ${className}`" v-html="labelStr">label</div>
</template>
<script>
export default {
    name:'Label',
    props:{
        className:{
            type: String,
            required: false,
            default: ''
        },
        text:{
            type: String,
            required: false,
            default: ''
        },
    },
    data(){
        return{
            labelImg:{
                'lv.1': require('@/assets/level/lv_1.png'),
                'lv.2': require('@/assets/level/lv_2.png'),
                'lv.3': require('@/assets/level/lv_3.png'),
                'lv.4': require('@/assets/level/lv_4.png'),
                'lv.5': require('@/assets/level/lv_5.png'),
                'lv.6': require('@/assets/level/lv_6.png'),
                'lv.7': require('@/assets/level/lv_7.png'),
                'lv.8': require('@/assets/level/lv_8.png'),
                'lv.9': require('@/assets/level/lv_9.png'),
                'lv.10': require('@/assets/level/lv_10.png'),
                'lv.11': require('@/assets/level/lv_11.png'),
                'lv.12': require('@/assets/level/lv_12.png'),
                'lv.ALL': require('@/assets/level/lv_all.png'),
                FC: require('@/assets/clear/clear_full_combo.png'),
                EXHC: require('@/assets/clear/clear_ex_hard.png'),
                HC: require('@/assets/clear/clear_hard.png'),
                NC: require('@/assets/clear/clear_normal.png'),
                AC: require('@/assets/clear/clear_assist.png'),
                EC: require('@/assets/clear/clear_easy.png'),
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
            lvList:{
                'lv.1': "1",
                'lv.2': "2",
                'lv.3': "3",
                'lv.4': "4",
                'lv.5': "5",
                'lv.6': "6",
                'lv.7': "7",
                'lv.8': "8",
                'lv.9': "9",
                'lv.10': "10",
                'lv.11': "11",
                'lv.12': "12",
                'lv.ALL': "13",
            },
            labelStr: ''
        }
    },
    methods: {
        text2img(text){
            const source =  this.labelImg[text]
            let labelStr = `<img src="${source}" alt="" />`
            if(text.match('lv.')){
                const labelImg = this.labelImg
                const lvList = this.lvList
                let lvStr = ''
                Object.keys(lvList).map(i=>{
                    lvStr += `<li class="lv-li"><img src="${labelImg[i]}" alt="" @click="changeLv(${lvList[i]})"/></li>`
                })
                labelStr = `<img src="${source}" alt="" /><ul class="menu">${lvStr}</ul>`
            }
            return labelStr
        },
        changeLv(lv){
            console.log('change lv',lv)
        }
    },
    watch:{
        text(val,oldVal){
            if(val==oldVal)return
            this.labelStr = this.text2img(this.text)
        }
    },
    mounted(){
        this.labelStr = this.text2img(this.text)
    }
}
</script>
<style lang="scss">
.label-modal{
    height: 30px;
    width: 97px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    >.menu{
        z-index: 1;
        display: none;
        position: absolute;
        top: 30px;
        right: 0;
        width: 80px;
        padding: 0 5px;
        background: rgb(74, 78, 80);
        color: #fff;
        border: 1px solid #ccc;
        border-width: 0 1px 1px 1px;
        .lv-li{
            position: relative;
            height: 24px;
            border-bottom: 1px solid #fff;
            cursor: pointer;
            img{
                position: absolute;
                top: 50%;
                left: 50%;
                height: 18px;
                transform: translate(-50%,-50%);
            }
            &:hover{
                img{
                    height: 24px;
                }
                background: rgb(120, 126, 129);
            }
        }
    }
    &:hover .menu{
        display: block;
    }
}
</style>