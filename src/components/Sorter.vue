<template>
    <div :class="`${className} ${disabled?'':'able'}`">
        <span>DJ-Level ↑↓</span>
        <span>level ↑↓</span>
        <span>Clear ↑↓</span>
        <span>Name ↑↓</span>
        <span>Time ↑↓</span>
    </div>
</template>
<script>
export default {
    name: 'Sorter',
    props:{
        className: {
            type: String,
            required: false,
            default: ''
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    data() {
        return{

        }
    },
}
</script>
<style lang='scss'>
.sorter{
    width: 100%;
    height: 0px;
    overflow: hidden;
    background: #333;
    font-size: 12px;
    line-height: 24px;
    box-sizing: border-box;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    &.able{
        height: 24px;
    }
    span{
        // padding: 0 10px;
    }
}
</style>
