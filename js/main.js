;(function () { /*2018.3.26 me和this*/
    'use strict';/*使用js的严格模式 让语言更有规范 报错更容易找到*/

    /*组件之间的通信可以通过事件监听器来表示*/
        var Event = new Vue();

    Vue.component('task',{  /*Vue.component注册的就是子组件,在html文件内使用的标签就是父组件！！*/
        template:'#task-tpl',   /*template里的是子组件的模板,整个就相当于子组件*/
        props:["todo"],         /*子组件接受父组件的参数*/
        methods:{               /*子组件的方法 子组件不能直接更改数据,要上传给父组件*/
            action:function (name,param) {
                Event.$emit(name,param);   /*子组件点击方法触发action方法,传递两个参数,一个是自定义事件名,另一个是参数*/
            } ,                         /*action方法触发自定义名字为name的事件*/
        }                               /*在父组件挂载的时候触发 父组件挂载时就是Vue mounted*/
    });

    function copy(obj) {   /*assign用的太多了 把它封装起来*/
        return Object.assign({},obj);
    }

    new Vue({
        el: "#main",
        data: {
            list: [], /*这是一个待办事项里面的数据*/
            last_id:1,
            current_content:{},   /*里面是搞事情那一栏的具体参数,如是否完成,具体内容,什么时候提醒*/
        },
        mounted:function () {
            var me = this;/*在下面this是event本身 不是vue*/

            this.list=ms.get('list')||this.list; /*每次VUE初始化的时候 要把他取出来,当this.list是空的时候等于空*/
            if(ms.get('last_id')) {
                this.last_id = ms.get('last_id');
            }
            else this.last_id = 1;

            setInterval(function () {  /*从生命开始每隔1s就检查是否有需要提示的事件*/
                me.check_alerts()
            },1000);


            Event.$on('remove',function (params) {
               me.remove(params);
            });
            Event.$on('change_detail',function (params) {
                me.change_detail(params);
            });
            Event.$on('change_completed',function (params) {
               me.change_completed(params);
            });
            Event.$on('set_current',function (params) {   /*更新*/
               me.set_current(params);
            })
        },
        watch:{   /*当某个值发生变化时,添加事件,跟监听器差不多*/
            list: {
                deep:true,  /*不管这个对象有多深,当里面发生一个微小的变化的时候,都要执行下面的方法*/
                handler :function (new_val,old_val) { /*变化之后的值和变化之前的值*/
                    if(new_val){    /*代表增加和更新和删除*/
                        ms.set('list',new_val);
                    }
                    else{           /*删光的时候*/
                        ms.set('list',[]);
                    }
                }
            }
        },
        methods:{
            check_alerts:function () {  /*检测当前是否有需要提醒的任务 */
                var me =this;
                this.list.forEach(function (row,index) {  /*对数组的每一项进行funcion 第一个参数是数组元素内容,第二个参数是当前元素的索引,第三个是当前数组名*/
                    var alert_time = row.alert_time;
                    if (!alert_time||row.alert_confirmed) return 0;

                    var alert_time = new Date(alert_time).getTime(); /*把alert_time变成一个时间对象,调用getDate方法 获得到Date（）里面时间的毫秒*/
                    var now_time = new Date().getTime();/*Date里面不加参数 获取到现在时间的毫秒*/
                    console.log(alert_time);
                    console.log(now_time);
                    if(now_time>=alert_time){
                         var confirmed = confirm(row.title);/*如果用户确认了不再提醒 那你就不要再提醒 直接返回*/
                        Vue.set(me.list[index],"alert_confirmed",confirmed);
                    }

                })
            },

            change_detail:function (id) {
                var index = this.find_index_by_id(id);
                Vue.set(this.list[index],'show_detail',!this.list[index].show_detail);

                
            },

            merge:function () {        /*回车敲下去后,能过增加一件事*/
                var is_update = this.current_content.id; /*current一直只有一个*/
                /*input绑定的this.current-content.title是时时的
                * 你在input框内输入的时候this.current已经增加了一个title
                * 但是还没有id id是在你提交表单的时候调用方法才赋予的
                * 所以可以通过下面的方法判断是更新还是submit
                * 更新就代表已经有了id submit表示还没有id*/
                if (is_update){
                    var index=this.find_index_by_id(is_update);         /*返回满足item.id=is_update的第一个元素的位置*/
                    Vue.set(this.list,index,copy(this.current_content));/*  this.list[index] = copy(this.current_content)在Vue里头数组的修改不能用这个*/
                }
                else {
                    var title = this.current_content.title;
                    if(!title&&title!==0) return; /*空的时候不接受,0的时候接受*/
                    var todo =copy(this.current_content);
                    todo.id = this.last_id++;
                    ms.set('last_id',this.last_id);
                    this.list.push(todo);


                }

                this.reset_current();
                /*
                *assign方法把后面的可枚举属性复制到第一个参数中,遇到重名的会实行替换
                * 如object.assign({a:1},{a:2,b:2})结果是{a:2,b:2}
                *第一个参数中必须是对象
                * 它实行的是浅拷贝,就是说后面的参数如果是对象
                * 他拷贝得到的是这个对象的引用
                * 该对象的任何变化都会反映到目标对象上
                * 这里执行它的意义在于让各次的current——content都存到不同的对象中再push进去 就可以了
                */

                /*
                *引用的是一个对象的指针
                *直接push(this.current_content)的话 每次都是push同一个对象,而你只是push了这个对象的指针,
                * 第二次的时候还更改了对象的值,有因为第一个对象和第二个对象是一样的(都是相同的地址)
                * 你第二次改了对象的值,第一个对象也变了相当于[obj,obj,obj]对象都一样
                * 所以需要换成assign,这就是浅拷贝
                * 不能直接push(this.current_content)
                */

            },

            remove :function (id) {
                var index = this.find_index_by_id(id); /*splice从数组中删除 第一个参数表示索引,第二个参数表示从索引开始删除的数目*/
                this.list.splice(index,1);
            },

            set_current:function (todo) {
               this.current_content = copy(todo);/*这样的话你改变this.current_content todo就不会跟着改变*/

            },
            reset_current :function () {
                this.set_current({});
            },

            find_index_by_id :function (id) {
                return this.list.findIndex(function (item) {    /*返回满足item.id=is_update的第一个元素的位置*/
                    return item.id == id;                       /*通过id找索引*/
                });
            },

            change_completed:function (id) {
                var index = this.find_index_by_id(id);
                Vue.set(this.list[index],'completed',!this.list[index].completed);   /*completed刚开始没有默认为NULL*/
            }
        }
    });
    /*只有单页的内容 只需要new 一个vue就行了*/
})();