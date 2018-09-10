function Vue(options) {
    this.$options = options || {};
    var data = this._data = this.$options.data;
    var _this = this;

    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function (key) {
        _this._proxyData(data,key);
    });

    this._initComputed();

    observe(data, this);

    this.$compile = new Compile(options.el || document.body, this)
}

Vue.prototype = {
    $watch: function (key, cb, options) {
        new Watcher(this, key, cb);
    },

    _proxyData: function (data,key, setter, getter) {
        console.log(JSON.stringify(key));
        console.log(JSON.stringify(setter));
        console.log(JSON.stringify(getter));
        var _this = this;
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

    _initComputed: function () {
        var _this = this;
        var computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function (key) {
                Object.defineProperty(_this, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get,
                    set: function () {
                    }
                });
            });
        }
    }
};
