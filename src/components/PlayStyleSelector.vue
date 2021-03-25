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
            :disabled="disabled"
        >
        <img
            :src="playStyle==item.value?playStyleImg[item.value]:playStyleImg[`${item.value}_p`]"
            :class="`${disabled?'':'active'}`"
            alt=""
        />
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
        disabled:{
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
<style lang="scss">
.radio-wrap{
    background: rgba(51, 51, 51,.5);
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    border-width: 0;
    padding: 0 10px;
    display: flex;
    align-items: center;
    .radio-label{
        height: 18px;
        padding: 0 10px;
        text-shadow: none;
        color: rgba(255, 255, 255,.2);
        // opacity: 0.4;
        display: flex;
        align-items: center;
        img{
        display: inline-block;
        line-height: 24px;
        }
    }
    .radio-label{
        .active{
            cursor: pointer;
        }
    }
    .radio{
        margin-top: 10px;
        display: none;
    }
}
</style>