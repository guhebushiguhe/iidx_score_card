(function(e){function t(t){for(var a,s,l=t[0],o=t[1],u=t[2],c=0,d=[];c<l.length;c++)s=l[c],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&d.push(r[s][0]),r[s]=0;for(a in o)Object.prototype.hasOwnProperty.call(o,a)&&(e[a]=o[a]);p&&p(t);while(d.length)d.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],a=!0,l=1;l<n.length;l++){var o=n[l];0!==r[o]&&(a=!1)}a&&(i.splice(t--,1),e=s(s.s=n[0]))}return e}var a={},r={app:0},i=[];function s(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=a,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(n,a,function(t){return e[t]}.bind(null,a));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],o=l.push.bind(l);l.push=t,l=l.slice();for(var u=0;u<l.length;u++)t(l[u]);var p=o;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("2b0e"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("p",{staticClass:"time"},[e._v(e._s((new Date).toLocaleString())),n("span",{domProps:{innerHTML:e._s("&nbsp;&nbsp;&nbsp;&nbsp;")}}),e._v("v1.01")]),n("h2",{staticClass:"title"},[e._v("IIDX查分器")]),n("div",{staticClass:"box search-box"},[n("span",[e._v("DJName ")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.djName,expression:"djName"}],ref:"nameInp",attrs:{type:"text",disabled:e.isLoading},domProps:{value:e.djName},on:{keypress:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getProfiles(t)},input:function(t){t.target.composing||(e.djName=t.target.value)}}}),n("span",[e._v("lv ")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.lv,expression:"lv"}],attrs:{type:"text",disabled:e.isLoading},domProps:{value:e.lv},on:{keypress:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getProfiles(t)},input:function(t){t.target.composing||(e.lv=t.target.value)}}}),n("button",{attrs:{type:"button",disabled:e.isLoading},on:{click:e.getProfiles}},[e._v("搜索")]),n("br"),e._l(e.playStyleList,(function(t){return n("span",{key:t.value},[n("label",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.playStyle,expression:"playStyle"}],staticClass:"radio",attrs:{type:"radio",id:t.value,disabled:e.isLoading},domProps:{value:t.value,checked:e._q(e.playStyle,t.value)},on:{change:function(n){e.playStyle=t.value}}}),e._v(" "+e._s(t.label)+" ")])])}))],2),e.isNameSelectShow?n("div",{staticClass:"box profiles-select"},[n("p",{staticClass:"msg"},[e._v("存在重名账号，请选择账号继续")]),e._l(e.profiles,(function(t,a){return n("div",{key:a,staticClass:"profile-card",on:{click:function(n){return e.getSingleProfile(t)}}},[n("p",[n("span",[e._v("DJName: "),n("span",{staticClass:"djName"},[e._v(e._s(t.dj_name))])])]),"SINGLE"==e.playStyle||"ALL"==e.playStyle?n("p",[e._v(" SP Rank: "+e._s(t.sp.rank)+", Plays: "+e._s(t.sp.plays)+", DJ Points: "+e._s(t.sp.dj_points)+" ")]):e._e(),"DOUBLE"==e.playStyle||"ALL"==e.playStyle?n("p",[e._v(" DP Rank: "+e._s(t.dp.rank)+", Plays: "+e._s(t.dp.plays)+", DJ Points: "+e._s(t.dp.dj_points)+" ")]):e._e()])}))],2):e._e(),e.profile?n("div",{staticClass:"box profiles-box"},[n("p",[n("span",[e._v("DJName: "),n("span",{staticClass:"djName"},[e._v(e._s(e.profile.dj_name))])])]),"SINGLE"==e.playStyle||"ALL"==e.playStyle?n("p",[e._v(" SP Rank: "+e._s(e.profile.sp.rank)+", Plays: "+e._s(e.profile.sp.plays)+", DJ Points: "+e._s(e.profile.sp.dj_points)+" ")]):e._e(),"DOUBLE"==e.playStyle||"ALL"==e.playStyle?n("p",[e._v(" DP Rank: "+e._s(e.profile.dp.rank)+", Plays: "+e._s(e.profile.dp.plays)+", DJ Points: "+e._s(e.profile.dp.dj_points)+" ")]):e._e()]):e._e(),n("div",{staticClass:"box score-box"},[e.isLoading?n("p",[e._v("加载中，请耐心等候···")]):e._e(),e.scores.length>0&&!e.isLoading?n("ul",e._l(e.scores,(function(t){return n("li",{key:t.label,staticClass:"score"},[n("span",[e._v(e._s(t.label))]),n("span",[e._v(e._s(t.value))])])})),0):e._e()])])},i=[],s=n("2909"),l=n("1da1"),o=(n("d81d"),n("4de4"),n("caad"),n("2532"),n("b680"),n("b64b"),n("96cf"),{name:"App",components:{},data:function(){return{djName:"",lv:"ALL",playStyle:"ALL",isLoading:!1,isNameSelectShow:!1,profiles:null,profile:null,qpros:{_id:"XXXX",_etag:"XXXX",head:"XXXX",hair:"XXXX",hand:"XXXX",face:"XXXX",body:"XXXX"},scores:[],scoresData:{},idsList:{},playStyleList:[{label:"ALL",value:"ALL"},{label:"SP",value:"SINGLE"},{label:"DP",value:"DOUBLE"}],gradeList:[{grade:"MAX",min:1,max:2},{grade:"MAX-",min:.9445,max:1},{grade:"AAA",min:.8888,max:.9445},{grade:"AA",min:.7777,max:.8888},{grade:"A",min:.6666,max:.7777},{grade:"B",min:.5555,max:.6666},{grade:"C",min:.4444,max:.5555},{grade:"D",min:.3333,max:.4444},{grade:"E",min:.2222,max:.3333},{grade:"F",min:.2222,max:0}]}},methods:{getProfiles:function(){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function t(){var n,a,r,i,s,l,o,u;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.djName,""!=n){t.next=4;break}return alert("请输入DJ NAME"),t.abrupt("return");case 4:if(a=e.lv,e.lv=""==a?"ALL":a,r=e.idsList,i=r[n]||null,s=e.scoresData,!r[n]){t.next=12;break}return e.parseScores(s[i]),t.abrupt("return");case 12:return e.profile=null,e.scores=[],e.isLoading=!0,t.next=17,e.$axios.getProfiles(n);case 17:if(l=t.sent,o=0,!(l._items.length>1)){t.next=25;break}return e.isNameSelectShow=!0,e.isLoading=!1,l._items.sort((function(e,t){var n=new Date(e.access_time).getTime(),a=new Date(t.access_time).getTime();return a-n})),e.profiles=l._items,t.abrupt("return");case 25:u=l["_items"][o],e.getSingleProfile(u);case 27:case"end":return t.stop()}}),t)})))()},getSingleProfile:function(e){this.isNameSelectShow=!1,this.profiles=null,this.isLoading=!0;var t=e.dj_name,n=e.iidx_id,a=e.sp,r=e.dp,i=e._id;this.idsList[t]=i,this.profile={dj_name:t,iidx_id:n,sp:{rank:a.rank,plays:a.plays,dj_points:a.dj_points},dp:{rank:r.rank,plays:r.plays,dj_points:r.dj_points}},this.$forceUpdate(),this.getScores()},getScores:function(){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function t(){var n,a,r,i,l,o,u,p,c,d,f,m,_,y,v;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:n=e.idsList[e.djName]||null,a=null,r=null,i={_items:[],_links:{},_related:{charts:[],music:[],profiles:[]}};case 4:return t.next=6,e.$axios.getScores(n,r);case 6:c=t.sent,d=c._items,f=c._links,m=c._related,_=m.charts,y=m.music,v=m.profiles,(l=i._items).push.apply(l,Object(s["a"])(d)),(o=i._related.charts).push.apply(o,Object(s["a"])(_)),(u=i._related.music).push.apply(u,Object(s["a"])(y)),(p=i._related.profiles).push.apply(p,Object(s["a"])(v)),a=f._next,r=c._items[249]?c._items[249]._id:null;case 15:if(a){t.next=4;break}case 16:e.isLoading=!1,i._items.map((function(e){var t=i._related.charts.filter((function(t){return t._id==e.chart_id}))[0],n=t.notes;t.play_style;e.grade=e.ex_score/n/2})),e.scoresData[n]=i,e.parseScores(i);case 20:case"end":return t.stop()}}),t)})))()},parseScores:function(e){var t=this;return Object(l["a"])(regeneratorRuntime.mark((function n(){var a,r,i,s,l,o,u,p,c,d,f,m,_,y,v,g,h,b,C,L;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:a=t.gradeList,r=e._items,e._links,i=e._related,s=t.lv,l=[],o=["1","2","3","4","5","6","7","8","9","10","11","12"],u=t.playStyle,l="ALL"!=u?i.charts.filter((function(e){return e.play_style==u})).map((function(e){var t=e._id,n=e.rating,a=e.play_style;return{_id:t,rating:n,play_style:a}})):i.charts,s&&"ALL"!=s?o.includes(s)?l=l.filter((function(e){var t=e.rating;return t==s})).map((function(e){return e._id})):alert("lv不合法，请重新输入"):l=l.map((function(e){return e._id})),p=r.filter((function(e){return l.includes(e["chart_id"])})),c=p.length,d=p.filter((function(e){return"FULL_COMBO"==e.lamp})).length,f=p.filter((function(e){return"EX_HARD_CLEAR"==e.lamp})).length,m=p.filter((function(e){return"HARD_CLEAR"==e.lamp})).length,_=p.filter((function(e){return"CLEAR"==e.lamp})).length,y=p.filter((function(e){return"ASSIST_CLEAR"==e.lamp})).length,v=p.filter((function(e){return"EASY_CLEAR"==e.lamp})).length,g=p.filter((function(e){return"FAILED"==e.lamp})).length,h=((c-g)/c*100).toFixed(2)+"%",b={totalCount:c,FCCount:d,EXHCCount:f,HCCount:m,NCCount:_,ACCount:y,ECCount:v,FCount:g,clearRate:h},a.map((function(e){b[e.grade]=p.filter((function(t){return t.grade>=e.min&&t.grade<e.max})).length})),C={totalCount:"lv.".concat(s||"ALL"),FCCount:"FC",EXHCCount:"EXHC",HCCount:"HC",NCCount:"NC",ACCount:"AC",ECCount:"EC",FCount:"Failed",clearRate:"CLEAR RATE",MAX:"MAX","MAX-":"MAX-",AAA:"AAA",AA:"AA",A:"A",B:"B",C:"C",D:"D",E:"E",F:"F"},L=[],Object.keys(C).map((function(e){L.push({label:C[e],value:b[e]})})),t.scores=L,t.$forceUpdate();case 25:case"end":return n.stop()}}),n)})))()}},watch:{djName:function(e,t){e!=t&&(this.djName=e.toUpperCase())},playStyle:function(e,t){e!=t&&""!=this.djName&&this.getProfiles()}},mounted:function(){this.$refs.nameInp.focus()}}),u=o,p=(n("5c0b"),n("2877")),c=Object(p["a"])(u,r,i,!1,null,null,null),d=c.exports,f=(n("d3b7"),n("bc3a")),m=n.n(f);m.a.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded;charset=UTF-8",m.a.defaults.headers.authorization="Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJ0b2tlbiIsImlhdCI6MTYxMTU5NTY3MSwic3ViIjoiNjQyMDQ2MjYxQHFxLmNvbSIsInNjb3BlIjoibWFjaGluZV9hY2Nlc3Mgcml2YWxfd3JpdGUgc2V0dGluZ3NfcmVhZCBzZXR0aW5nc193cml0ZSJ9.stRjxVQB_-0nkJnJf4o2ZNGyQGUmOI4RddUKC5BEKZ4",m.a.defaults.baseURL="https://arcana.nu",m.a.interceptors.request.use((function(e){return e}),(function(e){return console.log(e),Promise.reject(e)})),m.a.interceptors.response.use((function(e){return e.data}),(function(e){return console.log(e),Promise.reject(e)}));var _=m.a;function y(e){return _.get("/api/v1/iidx/27/profiles/",{params:{dj_name:e}})}function v(e,t){return _.get("/api/v1/iidx/27/player_bests/",{params:t?{profile_id:e,__pos:t}:{profile_id:e}})}var g={getProfiles:y,getScores:v};a["a"].config.productionTip=!1,a["a"].prototype.$axios=g,new a["a"]({render:function(e){return e(d)}}).$mount("#app")},"5c0b":function(e,t,n){"use strict";n("9c0c")},"9c0c":function(e,t,n){}});
//# sourceMappingURL=app.13ac67f7.js.map