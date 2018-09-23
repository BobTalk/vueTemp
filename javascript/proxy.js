function Vue(options) {
    this.$options = options || {};
    var data = this._data = this.$options.data; //data ==》 组件中data数据
    var _this = this;

    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function (key) {
        _this._proxyData(data, key);
    });

    this._initComputed();
    observe(data, this);

    this.$compile = new Compile(options.el || document.body, this)
}

Vue.prototype = {
    $watch: function (key, cb, options) {
        new Watcher(this, key, cb);
    },
    //双向绑定原理
    _proxyData: function (data, key, setter, getter) {
        var _this = this; //this ===> obj  obj{$options:{}, _data:{}}
        setter = setter ||
            Object.defineProperty(_this, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return _this._data[key];
                },
                set: function proxySetter(newVal) {
                    _this._data[key] = newVal;
                }
            });
    },
    //属性计算
    _initComputed: function () {
        var _this = this;  // this ==> obj  obj{$options:{}, _data:{}}
        var computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function (key) {
                Object.defineProperty(_this, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get, //computed[key].get 是调用属性拦截器（Object.defineProperty）上的get
                    set: function () {
                    }
                });
            });
        }
    }
};
