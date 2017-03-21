"use strict";
var core_1 = require('@angular/core');
var HightlightPipe = (function () {
    function HightlightPipe() {
    }
    HightlightPipe.prototype.transform = function (value, args) {
        if (args.length < 1) {
            return value;
        }
        var query = args[0];
        return query ?
            value.replace(new RegExp(this.escapeRegexp(query), 'gi'), '<strong>$&</strong>') :
            value;
    };
    HightlightPipe.prototype.escapeRegexp = function (queryToEscape) {
        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    };
    HightlightPipe.decorators = [
        { type: core_1.Pipe, args: [{
                    name: 'hightlight'
                },] },
    ];
    HightlightPipe.ctorParameters = function () { return []; };
    return HightlightPipe;
}());
exports.HightlightPipe = HightlightPipe;
//# sourceMappingURL=select-pipes.js.map