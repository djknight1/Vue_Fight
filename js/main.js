;(function () {
    'use strict';/*使用js的严格模式 让语言更有规范 报错更容易找到*/


    new Vue({
        el: "#main",
        data: {
            list: [], /*这是一个待办事项里面的数据*/
            current_content:{},   /*里面是搞事情那一栏的具体参数,如是否完成,具体内容,什么时候提醒*/
        },
        methods:{
            merge:function () {        /*回车敲下去后,能过增加一件事*/
                var title = this.current_content.title;
                if(!title&&title!==0) return; /*空的时候不接受,0的时候接受*/
                var todo = Object.assign({}, this.current_content);
                console.log(this.list);
                this.list.push(todo);
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
                this.list.splice(id,1); /*splice从数组中删除 第一个参数表示索引,第二个参数表示从索引开始删除的数目*/
            },
        }
    });
    /*只有单页的内容 只需要new 一个vue就行了*/
})();