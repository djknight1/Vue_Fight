;(function () {
    window.ms={   /*把函数封装到window对象里变成全局函数 这样可以适用于所有的js文件*/
      set : set,
      get : get,
    };
    function set(key,val){ /*存储函数*/
        /*当我们传进来是一个对象的时候
        * 如果直接储存对象或数组为val然后进行setitem
        * localstorage会调用tosrting方法,这样就会丢失数据
        * 具体可以在console上试一试
        * var a={}
        * a.toString()
        *json理解为对象的字符串表示形式
        所以要先把它变成json再字符串化 */
        localStorage.setItem(key,JSON.stringify(val));
    }
    function get(key) {
        var json = localStorage.getItem(key);
        if(json) {
            return JSON.parse(json); /*把字符串转化为json对象，没有这个方法的话只能返回字符串*/
        }
    }
    ms.set("name","whh0");
    var name = ms.get("name");
    console.log(name)
})();