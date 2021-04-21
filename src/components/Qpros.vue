<template>
    <div
        class="qpro"
        v-if="qprosData"
        :style="{animationDuration}"
    >
      <img 
        v-for="({mainPart,parts,className},key) in qpparts"
        :key="key"
        alt
        :class="className"
        :src="getQprosUrl(mainPart,parts)"
    />
    </div>
</template>

<script>
export default {
    name: "qpros",
    props:{
        className: {
            type: String,
            required: false,
            default: ''
        },
        qprosData: {
            type: Object,
            required: false,
            default: null
        },
        bpm: {
            type: [String,Number],
            required: false,
            default: null
        }
    },
    data(){
        return {
            qpparts: [
                {
                    parts: 'qp_head_b',
                    mainPart: 'head',
                    className: 'qp-head',
                },
                {
                    parts: 'qp_hair_b',
                    mainPart: 'hair',
                    className: 'qp-hair-b',
                },
                {
                    parts: 'qp_leg_l_lower',
                    mainPart: 'body',
                    className: 'qp-leg-l',
                },
                {
                    parts: 'qp_leg_l_upper',
                    mainPart: 'body',
                    className: 'qp-leg-l',
                },
                {
                    parts: 'qp_arm_r_upper',
                    mainPart: 'body',
                    className: 'qp-arm-r',
                },
                {
                    parts: 'qp_arm_r_lower',
                    mainPart: 'body',
                    className: 'qp-arm-r',
                },
                {
                    parts: 'qp_hand_r',
                    mainPart: 'hand',
                    className: 'qp-hand-r',
                },
                {
                    parts: 'qp_leg_r_lower',
                    mainPart: 'body',
                    className: 'qp-leg-r',
                },
                {
                    parts: 'qp_leg_r_upper',
                    mainPart: 'body',
                    className: 'qp-leg-r',
                },
                {
                    parts: 'qp_body_b',
                    mainPart: 'body',
                    className: 'qp-body',
                },
                {
                    parts: 'qp_body_f',
                    mainPart: 'body',
                    className: 'qp-body',
                },
                {
                    parts: 'qp_face_neutral',
                    mainPart: 'face',
                    className: 'qp-face',
                },
                {
                    parts: 'qp_hair_f',
                    mainPart: 'hair',
                    className: 'qp-hair-f',
                },
                {
                    parts: 'qp_head_f',
                    mainPart: 'head',
                    className: 'qp-head',
                },
                {
                    parts: 'qp_arm_l_upper',
                    mainPart: 'body',
                    className: 'qp-arm-l',
                },
                {
                    parts: 'qp_arm_l_lower',
                    mainPart: 'body',
                    className: 'qp-arm-l',
                },
                {
                    parts: 'qp_hand_l',
                    mainPart: 'hand',
                    className: 'qp-hand-l',
                },
            ]

        }
    },
    computed:{
        animationDuration(){
            const bpm = this.bpm
            return bpm?60/bpm+'s':'1s'
        }
    },
    methods:{
        getQprosUrl(mainPart,parts){
            return `https://arcana.nu/asset/iidx/qpart/${this.qprosData[mainPart]}_${mainPart}/${parts}.png`
        }
    }
}
</script>
<style lang='scss'>
@keyframes qprosDance{
0% { height: 200px; transform: translateY(0px) }
20% { height: 199px; transform: translateY(1px) }
40% { height: 195px; transform: translateY(5px) }
50% { height: 190px; transform: translateY(10px) }
60% { height: 195px; transform: translateY(5px) }
80% { height: 199px; transform: translateY(1px) }
100% { height: 200px; transform: translateY(0px) }
}

.qpro {
    width: 170px;
    height: 200px;
    position: absolute;
    right: -20px;
    top: 0px;
    z-index: -1;

    animation-name: qprosDance;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    img {
        position: absolute;
        display: inline;
    }
    .qp-head {
        left: 14.71%;
        top: 5%;
        width: 77.06%;
        height: 88%;
    }
    .qp-hair-b {
        left: 12.94%;
        top: 5%;
        width: 77.06%;
        height: 88%;
    }

    /* _lower & _upper */
    .qp-leg-l {
        left: 42.65%;
        top: 61.25%;
        width: 30%;
        height: 33%;
    }

    /* _uppper & _lower */
    .qp-arm-r {
        left: 12.35%;
        top: 44.5%;
        width: 38.82%;
        height: 48.5%;
    }
    .qp-hand-r {
        left: 1.47%;
        top: 0;
        width: 62.35%;
        height: 88%;
    }
    /*  _lower & _uppper */
    .qp-leg-r {
        top: 61.25%;
        width: 30%;
        height: 33%;
        left: 26.47%;
    }
    /* _b & _f */
    .qp-body {
        left: 14.71%;
        top: 5%;
        width: 76.47%;
        height: 88%;
    }
    .qp-face {
        left: 29.41%;
        top: 15%;
        width: 44.17%;
        height: 39.5%;
    }
    .qp-hair-f {
        top: 5%;
        left: 12.94%;
        width: 77.06%;
        height: 88%;
    }
    .qp-head-f {
        top: 5%;
        left: 14.71%;
        width: 77.06%;
        height: 88%;
    }
    /* _upper & _lower */
    .qp-arm-l {
        top: 44.5%;
        height: 48.5%;
        left: 50%;
        width: 41.76%;
    }
    .qp-hand-l {
        left: 44.12%;
        top: 0;
        width: 47.65%;
        height: 88%;
    }
}
</style>