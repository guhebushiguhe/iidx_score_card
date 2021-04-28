<template>
    <div :class="`sorter-wrap ${disabled?'':'able'}`">
        <div class="sorter">
            <span class="sorter-option" @click="sortMusic('lamp')">Lamp <img :src="icon.sort" alt=""></span>
            <span class="sorter-option" @click="sortMusic('level')">level <img :src="icon.sort" alt=""></span>
            <span class="sorter-option" @click="sortMusic('grade')">Grade <img :src="icon.sort" alt=""></span>
            <span class="sorter-option" @click="sortMusic('title')">Title <img :src="icon.sort" alt=""></span>
            <span class="sorter-option" @click="sortMusic('time')">Time <img :src="icon.sort" alt=""></span>
        </div>
        <div class="search-wrap">
            <div class="search">
                <input
                    type="text"
                    placeholder="歌曲名/艺术家/曲风"
                    v-model="searchVal"
                    @keypress.enter="filterScore(scoreFilterVal)"
                >
                <span
                    class="search-btn"
                    @click="filterScore(scoreFilterVal)"
                >搜索</span>
            </div>
            <div class="folder-filter">
                <span class="folder-filter-str">{{ folderFilterStr.label }}</span>
                <img :src="icon.down" alt="" class="down-btn">
                <div class="folder-box">
                    <ul class="folder-ul">
                        <li
                            :class="`folder-li ${folderFilterStr.value == item.value?'active':''}`"
                            v-for="item in folderList"
                            :key="item.value"
                            @click="handleChangeFolderValue(item)"
                        >
                            {{ item.label }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
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
        },
        filterScore: {
            type: Function,
            required: false,
            default: ()=>{}
        },
        musicListData: {
            type: Array,
            required: false,
            default: ()=>[]
        }
    },
    data() {
        return{
            icon:{
                sort: require('@/assets/sort.png'),
                down: require('@/assets/down.png'),
            },
            searchVal: '',
            folderFilterStr: {
                value: -1,
                label: 'All Folder',
            },
            folderList:[
                {
                    value: -1,
                    label: 'All Folder',
                },
                {
                    value: 0,
                    label: '1st Style',
                },
                {
                    value: 1,
                    label: 'substream'
                },
                {
                    value: 2,
                    label: '2nd Style'
                },
                {
                    value: 3,
                    label: '3rd Style'
                },
                {
                    value: 4,
                    label: '4th Style'
                },
                {
                    value: 5,
                    label: '5th Style'
                },
                {
                    value: 6,
                    label: '6th Style'
                },
                {
                    value: 7,
                    label: '7th Style'
                },
                {
                    value: 8,
                    label: '8th Style'
                },
                {
                    value: 9,
                    label: '9th Style'
                },
                {
                    value: 10,
                    label: '10th Style'
                },
                {
                    value: 11,
                    label: '11 IIDX RED'
                },
                {
                    value: 12,
                    label: '12 HAPPY SKY'
                },
                {
                    value: 13,
                    label: '13 DistorteD'
                },
                {
                    value: 14,
                    label: '14 GOLD'
                },
                {
                    value: 15,
                    label: '15 DJ TROOPERS'
                },
                {
                    value: 16,
                    label: '16 EMPRESS'
                },
                {
                    value: 17,
                    label: '17 SIRIUS'
                },
                {
                    value: 18,
                    label: '18 Resort Anthem'
                },
                {
                    value: 19,
                    label: '19 Lincle'
                },
                {
                    value: 20,
                    label: '20 Tricoro'
                },
                {
                    value: 21,
                    label: '21 Spada'
                },
                {
                    value: 22,
                    label: '22 PENDUAL'
                },
                {
                    value: 23,
                    label: '23 copula'
                },
                {
                    value: 24,
                    label: '24 SINOBUZ'
                },
                {
                    value: 25,
                    label: '25 CANNON BALLERS'
                },
                {
                    value: 26,
                    label: '26 Rootage'
                },
                {
                    value: 27,
                    label: '27 HEROIC VERSE'
                },
            ]
        }
    },
    computed:{
        scoreFilterVal(){
            return {
                searchVal: this.searchVal,
                folderFilterVal: this.folderFilterStr.value
            }
        }
    },
    methods:{
        handleChangeFolderValue(item){
            this.folderFilterStr = item
            this.filterScore(this.scoreFilterVal)
        }
    },
    watch:{
        disabled(val,oldVal){
            if(val==oldVal)return
            if(val){
                this.searchVal = ''
                this.folderFilterStr={
                    value: -1,
                    label: 'All Folder',
                }
            }
        },
        musicListData(val,oldVal){
            if(val==oldVal)return
            this.filterScore(this.scoreFilterVal)
        }
    }
}
</script>
<style lang='scss'>
.sorter-wrap{
    width: 100%;
    height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    user-select: none;
    &.able{
        height: inherit;
        overflow: inherit;
    }
    .sorter{
        width: 100%;
        background: linear-gradient(180deg, rgba(0, 0, 0, .6) 0%, rgba(0, 0, 0, .6) 49%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, .4) 100%,);
        font-size: 12px;
        line-height: 24px;
        box-sizing: border-box;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
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
    .search-wrap{
        width: 100%;
        background: linear-gradient(180deg, rgba(0, 0, 0, .6) 0%, rgba(0, 0, 0, .6) 49%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, .4) 100%,);
        font-size: 12px;
        line-height: 24px;
        box-sizing: border-box;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        position: relative;
        .search{
            input{
                width: 160px;
                height: 22px;
                background: transparent;
                box-sizing: border-box;
                border: 1px solid #888;
                border-radius: 6px;
                outline: none;
                color: #fff;
                text-indent: .5em;
                margin-right: 10px;
            }
            .search-btn{
                cursor: pointer;
            }
        }
        .folder-filter{
            display: flex;
            align-items: center;
            cursor: pointer;
            .folder-filter-str{
                padding-right: 6px;
            }
            .down-btn{
                width: 16px;
                height: 16px;
            }
            &:hover .folder-box{
                display: block;
            }
            .folder-box{
                height: 312px;
                overflow-y: scroll;
                position: absolute;
                right: 0;
                top: 100%;
                z-index:3;
                display: none;
                .folder-ul{
                    padding: 0 10px;
                    background: rgba(0, 0, 0, .8);
                    .folder-li{
                        width: 100%;
                        text-align: left;
                        margin-bottom: 2px;
                        color: #888;
                        &.active{
                            color: #fff;
                        }
                        &:hover{
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
}
</style>
