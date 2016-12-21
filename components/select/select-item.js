System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SelectItem;
    return {
        setters:[],
        execute: function() {
            SelectItem = (function () {
                function SelectItem(source) {
                    var _this = this;
                    if (typeof source === 'string') {
                        this.id = this.text = source;
                    }
                    if (typeof source === 'object') {
                        this.id = source.id || source.text;
                        this.text = source.text;
                        if (source.children && source.text) {
                            this.children = source.children.map(function (c) {
                                var r = new SelectItem(c);
                                r.parent = _this;
                                return r;
                            });
                            this.text = source.text;
                        }
                    }
                }
                SelectItem.prototype.fillChildrenHash = function (optionsMap, startIndex) {
                    var i = startIndex;
                    this.children.map(function (child) {
                        optionsMap.set(child.id, i++);
                    });
                    return i;
                };
                SelectItem.prototype.hasChildren = function () {
                    return this.children && this.children.length > 0;
                };
                SelectItem.prototype.getSimilar = function () {
                    var r = new SelectItem(false);
                    r.id = this.id;
                    r.text = this.text;
                    r.parent = this.parent;
                    return r;
                };
                return SelectItem;
            }());
            exports_1("SelectItem", SelectItem);
        }
    }
});
//# sourceMappingURL=select-item.js.map