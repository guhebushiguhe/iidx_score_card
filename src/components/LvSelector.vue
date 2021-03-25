<template>
    <div :class="`${className}`">
        <div :class="`lv-wrap ${disabled?'':'able'}`">
            <img class="lv-btn" :src="lvImg[`lv.${lv}`]" alt="" >
            <ul
                class="lv-menu"
            >
                <li
                    v-for="item in lvs"
                    :key="item.value"
                    class="lv-li"
                >
                    <img :src="lvImg[item.label]" alt="" @click="changeLv(item.value)">
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: "LvSelector",
    props:{
        className:{
            type: String,
            required: false,
            default: ''
        },
        lv:{
            type: String,
            required: false,
            default: 'ALL'
        },
        changeLv:{
            type: Function,
            required: false,
            default: ()=>{}
        },
        disabled:{
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return{
            lvImg:{
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
            },
            lvs:[
                {
                    label: 'lv.ALL',
                    value: 'ALL'
                },
                {
                    label: 'lv.1',
                    value: '1'
                },
                {
                    label: 'lv.2',
                    value: '2'
                },
                {
                    label: 'lv.3',
                    value: '3'
                },
                {
                    label: 'lv.4',
                    value: '4'
                },
                {
                    label: 'lv.5',
                    value: '5'
                },
                {
                    label: 'lv.6',
                    value: '6'
                },
                {
                    label: 'lv.7',
                    value: '7'
                },
                {
                    label: 'lv.8',
                    value: '8'
                },
                {
                    label: 'lv.9',
                    value: '9'
                },
                {
                    label: 'lv.10',
                    value: '10'
                },
                {
                    label: 'lv.11',
                    value: '11'
                },
                {
                    label: 'lv.12',
                    value: '12'
                },
            ]
        }
    },
    methods:{

    },
}
</script>
<style lang="scss">
.lv-selector-wrap{
    .lv-wrap{
        position: relative;
        height: 24px;
        display: flex;
        align-items: center;
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
    }
    .able:hover .lv-menu{
        display: block;
    }
    .able {
        .lv-btn{
            cursor: pointer;
        }
    }
}
</style>