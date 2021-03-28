<template>
    <div :class="`${className} ${disabled?'':'able'}`">
        <span class="sorter-option" @click="sortMusic('lamp')">Lamp <img :src="icon.sort" alt=""></span>
        <span class="sorter-option" @click="sortMusic('level')">level <img :src="icon.sort" alt=""></span>
        <span class="sorter-option" @click="sortMusic('grade')">Grade <img :src="icon.sort" alt=""></span>
        <span class="sorter-option" @click="sortMusic('title')">Title <img :src="icon.sort" alt=""></span>
        <span class="sorter-option" @click="sortMusic('time')">Time <img :src="icon.sort" alt=""></span>
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
        sortMusic: {
            type: Function,
            required: false,
            default: ()=>{}
        }
    },
    data() {
        return{
            icon:{
                sort: require('@/assets/sort.png'),
            }
        }
    },
}
</script>
<style lang='scss'>
.sorter{
    width: 100%;
    height: 0px;
    overflow: hidden;
    // background: #333;
    background: linear-gradient(180deg, rgba(0, 0, 0, .6) 0%, rgba(0, 0, 0, .6) 49%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, .4) 100%,);
    font-size: 12px;
    line-height: 24px;
    box-sizing: border-box;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    &.able{
        height: 24px;
    }
    .sorter-option{
        cursor: pointer;
        display: flex;
        align-items: center;
        // padding: 0 10px;
        img{
            width: 15px;
            height: 60%;
        }
    }
}
</style>
