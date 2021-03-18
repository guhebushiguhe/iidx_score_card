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
            labelStr: ''
        }
    },
    methods: {
        text2img(text){
            const source =  this.labelImg[text]
            return `<img src="${source}" alt="" />`
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
<style lang="scss" scoped>
.label-modal{

}
</style>