import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            title: 'IIDX查分器',
        }
    }
]

const router = new VueRouter({
    mode: 'hash',
    routes
})
router.beforeEach((to,form,next)=>{
    if(to.meta.title){
        document.title = to.meta.title
    }
    next()
})
export default router