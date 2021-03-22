<template>
    <div :class="className">
    <span
        v-for="item in playStyleList"
        :key="item.value"
    >
        <label :class="`radio-label ${playStyle==item.value?'active':''}`">
        <input
            type="radio"
            class="radio"
            @click="changePlayStyle"
            :value="item.value"
            :id="item.value"
            :disabled="isLoading"
        >
        <img :src="playStyle==item.value?playStyleImg[item.value]:playStyleImg[`${item.value}_p`]" alt="" />
        </label>
    </span>
    </div>
</template>
<script>
export default {
    name: "PlayStyleSelector",
    props:{
        className:{
            type: String,
            required: false,
            default: ''
        },
        playStyle:{
            type: String,
            required: false,
            default: 'ALL'
        },
        playStyleList:{
            type: Array,
            required: false,
            default: []
        },
        isLoading:{
            type: Boolean,
            required: false,
            default: false
        },
        changePlayStyle:{
            type: Function,
            required: false,
            default: ()=>{}
        },
    },
    data() {
        return{
            playStyleImg:{
                'SINGLE': require('@/assets/style/sp.png'),
                'DOUBLE': require('@/assets/style/dp.png'),
                'ALL': require('@/assets/style/all.png'),
                'SINGLE_p': require('@/assets/style/sp_p.png'),
                'DOUBLE_p': require('@/assets/style/dp_p.png'),
                'ALL_p': require('@/assets/style/all_p.png'),
            },
        }
    },
    methods:{

    },
}
</script>
<style lang="scss" scope>
.lv-wrap{
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;
    .lv-btn{
        cursor: pointer;
    }
    .lv-menu{
        z-index: 1;
        display: none;
        position: absolute;
        top: 24px;
        right: 0;
        width: 70px;
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
    &:hover .lv-menu{
        display: block;
    }
}
</style>