System.register(['./components/select/select', './components/select/select-pipes', '@angular/platform-browser', '@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var select_1, select_pipes_1, platform_browser_1, core_1;
    var Ng2SelectModule;
    var exportedNames_1 = {
        'Ng2SelectModule': true
    };
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default"&& !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (select_1_1) {
                select_1 = select_1_1;
                exportStar_1(select_1_1);
            },
            function (select_pipes_1_1) {
                select_pipes_1 = select_pipes_1_1;
                exportStar_1(select_pipes_1_1);
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Ng2SelectModule = (function () {
                function Ng2SelectModule() {
                }
                Ng2SelectModule = __decorate([
                    core_1.NgModule({
                        exports: [
                            select_1.SelectComponent,
                            select_pipes_1.HightlightPipe
                        ],
                        declarations: [
                            select_1.SelectComponent,
                            select_pipes_1.HightlightPipe
                        ],
                        imports: [
                            platform_browser_1.BrowserModule
                        ]
                    }), 
                    __metadata('design:paramtypes', [])
                ], Ng2SelectModule);
                return Ng2SelectModule;
            }());
            exports_1("Ng2SelectModule", Ng2SelectModule);
        }
    }
});
//# sourceMappingURL=ng2-select.js.map