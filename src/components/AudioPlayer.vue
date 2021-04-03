<template>
    <div class="audio-player-box" v-if="musicUrl!=''">
        <audio ref="audio" class="audio-player" :src="musicUrl" @pause="audioPause" @play="audioPlay" controls autoplay loop >您的浏览器不支持 audio 标签</audio>
        <img :src="img.down" alt="" class="down-btn" @click="hidePlayer">
    </div>
</template>
<script>
export default {
    name: 'AudioPlayer',
    props:{
        data:{
            type: Array,
            required: false,
            default: ()=>[]
        }
    },
    methods:{

    }

}
</script>
<style lang='scss' scoped>
div.audio-player-box{
box-sizing: border-box;
// border: 1px solid red;
position: fixed;
bottom: 16px;
left: 0;
width: 100%;
height: 60px;
background: #f1f3f4;
border-radius: 15px;
padding-right: 10px;
display: flex;
justify-content: space-around;
align-items: center;
z-index: 2;
.audio-player{
    width: 90%;
    height: 30px;
    outline: none;
}
.down-btn{
    width: 20px;
    height: 20px;
    cursor: pointer;
}
}
</style>