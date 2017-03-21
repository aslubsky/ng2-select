"use strict";
var select_1 = require('./components/select/select');
var select_pipes_1 = require('./components/select/select-pipes');
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var Ng2SelectModule = (function () {
    function Ng2SelectModule() {
    }
    Ng2SelectModule.decorators = [
        { type: core_1.NgModule, args: [{
                    exports: [
                        select_1.SelectComponent,
                        select_pipes_1.HightlightPipe
                    ],
                    declarations: [
                        select_1.SelectComponent,
                        select_pipes_1.HightlightPipe
                    ],
                    imports: [
                        common_1.CommonModule
                    ]
                },] },
    ];
    Ng2SelectModule.ctorParameters = function () { return []; };
    return Ng2SelectModule;
}());
exports.Ng2SelectModule = Ng2SelectModule;
//# sourceMappingURL=ng2-select.js.map