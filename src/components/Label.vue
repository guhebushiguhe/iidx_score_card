<template>
    <div>
        <div
            :class="`label-modal ${className} ${type}`"
            v-html="labelStr">
        </div>
        <ul
            class="label-ul"
            v-if="isMusicListShow"
        >
            <li
                v-for="item in quickLabelList"
                :key="item"
                class="label-li"
            >
                <img :src="labelImg[item]" alt="" @click="changeLabel(item)">
            </li>
        </ul>
        <ul
            class="clear-rate-style-ul"
            v-if="text=='CLEAR RATE' && !isMusicListShow"
        >
            <li
                v-for="item in clearRateStyleList"
                :key="item"
            >
                <img :src="labelImg[item]" alt="" @click="changeClearRateStyle(item)">
            </li>
        </ul>
    </div>
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
        type:{
            type: String,
            required: false,
            default: 'default'
        },
        changeLabel:{
            type: Function,
            required: false,
            default: ()=>{}
        },
        isMusicListShow: {
            type: Boolean,
            required: false,
            default: false
        },
        clearRateStyle: {
            type: String,
            required: false,
            default: 'assistClearRate',
        },
        changeClearRateStyle: {
            type: Function,
            required: false,
            default: ()=>{}
        }
    },
    data(){
        return{
            labelImg:{
                'ALL': require('@/assets/clear/all_scores.png'),
                FC: require('@/assets/clear/clear_full_combo.png'),
                EXHC: require('@/assets/clear/clear_ex_hard.png'),
                HC: require('@/assets/clear/clear_hard.png'),
                NC: require('@/assets/clear/clear_normal.png'),
                AC: require('@/assets/clear/clear_assist.png'),
                EC: require('@/assets/clear/clear_easy.png'),
                'NO PLAY': require('@/assets/clear/clear_no_play.png'),
                Failed: require('@/assets/clear/clear_failed.png'),
                // 'CLEAR RATE': require('@/assets/clear/clear_rate.png'),
                'assistClearRate': require('@/assets/clear/assist_clear_rate.png'),
                'easyClearRate': require('@/assets/clear/easy_clear_rate.png'),
                'normalClearRate': require('@/assets/clear/normal_clear_rate.png'),
                'hardClearRate': require('@/assets/clear/hard_clear_rate.png'),
                'exHardClearRate': require('@/assets/clear/ex_hard_clear_rate.png'),
                'fullComboRate': require('@/assets/clear/full_combo_rate.png'),
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
            quickLabelList:[
                'ALL',
                'FC',
                'EXHC',
                'HC',
                'NC',
                'AC',
                'EC',
                'NO PLAY',
                'Failed',
                'MAX',
                'MAX-',
                'AAA',
                'AA',
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
            ],
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
                'lv.ALL': "ALL",
            },
            labelStr: '',
            clearRateStyleList: [
                'assistClearRate',
                'easyClearRate',
                'normalClearRate',
                'hardClearRate',
                'exHardClearRate',
                'fullComboRate',
            ]
        }
    },
    methods: {
        text2img(text){
            const source =  text=='CLEAR RATE'?this.labelImg[this.clearRateStyle]:this.labelImg[text]
            let labelStr = `<img src="${source}" alt="" />`
            return labelStr
        },
    },
    watch:{
        text(val,oldVal){
            if(val==oldVal)return
            this.labelStr = this.text2img(this.text)
        },
        clearRateStyle(val,oldVal){
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
        height: 28px;
        width: 97px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        &.small{
            // padding-left: 10px;
            width: 57px;
            img{
                height: 14px;
                width: 55px;
                object-fit: cover;
            }
        }
    }
.label-wrap{
    cursor: pointer;
    position: relative;
  .label-ul{
    z-index: 2;
    display: none;
    position: absolute;
    top: 27px;
    left: 0;
    width: 120px;
    padding: 0 5px;
    box-sizing: border-box;
    // background: rgb(74, 78, 80);
    background: rgba(30,30,30,.9);
    color: #fff;
    border: 1px solid #ccc;
    border-width: 0 1px 1px 1px;
    .label-li{
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
  .clear-rate-style-ul{
    z-index: 2;
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    transform: translateX(-10px);
    width: 120px;
    padding: 0 5px;
    box-sizing: border-box;
    // background: rgb(74, 78, 80);
    background: rgba(30,30,30,.9);
    color: #fff;
    border: 1px solid #ccc;
    border-width: 0 1px 1px 1px;
    li{
        position: relative;
        height: 24px;
        border-bottom: 1px solid #fff;
        cursor: pointer;
    }
  }
  &:hover .label-ul,&:hover .clear-rate-style-ul{
    display: block;
  }
}
</style>