"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var select_item_1 = require("./select-item");
var SelectComponent = (function () {
    function SelectComponent(element) {
        this.element = element;
        this.allowClear = false;
        this.placeholder = '';
        this.itemClass = 'btn-default';
        this.multiple = false;
        this.tagging = false;
        this.taggingTokens = ['SPACE', 'ENTER'];
        this.data = new core_1.EventEmitter();
        this.selected = new core_1.EventEmitter();
        this.removed = new core_1.EventEmitter();
        this.typed = new core_1.EventEmitter();
        this.options = [];
        this.itemObjects = [];
        this.active = [];
        this.inputMode = false;
        this.optionsOpened = false;
        this.inputValue = '';
        this._initData = [];
        this._items = [];
        this._disabled = false;
    }
    SelectComponent_1 = SelectComponent;
    Object.defineProperty(SelectComponent.prototype, "initData", {
        set: function (value) {
            if (Array.isArray(value)) {
                this._initData = value;
                this.active = this._initData.map(function (d) { return new select_item_1.SelectItem(d); });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectComponent.prototype, "items", {
        set: function (value) {
            this._items = value;
            this.itemObjects = this._items.map(function (item) { return new select_item_1.SelectItem(item); });
            if (this.optionsOpened) {
                this.open();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectComponent.prototype, "disabled", {
        set: function (value) {
            this._disabled = value;
            if (this._disabled === true) {
                this.hideOptions();
            }
        },
        enumerable: true,
        configurable: true
    });
    SelectComponent.prototype.focusToInput = function (value) {
        var _this = this;
        if (value === void 0) { value = ''; }
        setTimeout(function () {
            var el = _this.element.nativeElement.querySelector('div.ui-select-container > input');
            if (el) {
                el.focus();
                el.value = value;
            }
            else {
                console.log('focusToInput error ', _this.element.nativeElement);
            }
        }, 500);
    };
    SelectComponent.prototype.matchClick = function (e) {
        if (this._disabled === true) {
            return;
        }
        this.inputMode = !this.inputMode;
        if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
            this.focusToInput();
            this.open();
        }
    };
    SelectComponent.prototype.mainClick = function (e) {
        if (this.inputMode === true || this._disabled === true) {
            return;
        }
        if (e.keyCode === 46) {
            e.preventDefault();
            this.inputEvent(e);
            return;
        }
        if (e.keyCode === 8) {
            e.preventDefault();
            this.inputEvent(e, true);
            return;
        }
        if (e.keyCode === 9 || e.keyCode === 13 ||
            e.keyCode === 27 || (e.keyCode >= 37 && e.keyCode <= 40)) {
            e.preventDefault();
            return;
        }
        this.inputMode = true;
        this.focusToInput(e.target.value);
        this.open();
        this.inputEvent(e);
    };
    SelectComponent.prototype.open = function () {
        var _this = this;
        this.options = this.itemObjects
            .filter(function (option) { return (_this.multiple === false ||
            _this.multiple === true && !_this.active.find(function (o) { return option.text === o.text; })); });
        if (this.options.length > 0) {
            this.behavior.first();
        }
        this.optionsOpened = true;
    };
    SelectComponent.prototype.ngOnChanges = function (changes) {
        if (this.itemObjects.length > 0) {
            if (!this.behavior) {
                this.behavior = (this.itemObjects.length > 0 && this.itemObjects[0].hasChildren()) ?
                    new ChildrenBehavior(this) : new GenericBehavior(this);
            }
            else {
                var typeIsChildrenBehavior = this.behavior instanceof ChildrenBehavior;
                var needChildrenBehavior = this.itemObjects[0].hasChildren();
                if (needChildrenBehavior && !typeIsChildrenBehavior) {
                    this.behavior = new ChildrenBehavior(this);
                }
                else if (!needChildrenBehavior && typeIsChildrenBehavior) {
                    this.behavior = new GenericBehavior(this);
                }
            }
        }
    };
    SelectComponent.prototype.ngOnInit = function () {
        this.offSideClickHandler = this.getOffSideClickHandler(this);
        this.offSideClickHandlerDocument = this.getOffSideClickHandlerInDocument(this);
        document.addEventListener('click', this.offSideClickHandlerDocument);
        if (this._initData && this._initData.length > 0) {
            this.active = this._initData.map(function (d) { return new select_item_1.SelectItem(d); });
            this.data.emit(this.active);
        }
    };
    SelectComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.element.nativeElement.addEventListener('click', _this.offSideClickHandler);
        }, 500);
    };
    SelectComponent.prototype.ngOnDestroy = function () {
        document.removeEventListener('click', this.offSideClickHandlerDocument);
        this.element.nativeElement.removeEventListener('click', this.offSideClickHandler);
        this.offSideClickHandler = null;
    };
    SelectComponent.prototype.getOffSideClickHandler = function (context) {
        return function (e) {
            if (e.target && e.target.nodeName === 'INPUT'
                && e.target.className && e.target.className.indexOf('ui-select') >= 0) {
                return;
            }
            if (e.target && e.target.className && e.target.className.length > 0 &&
                e.target.className.indexOf('ui-select') >= 0) {
                if (e.target.nodeName !== 'INPUT') {
                    context.matchClick(null);
                }
                return;
            }
            context.inputMode = false;
            context.optionsOpened = false;
        };
    };
    SelectComponent.prototype.getOffSideClickHandlerInDocument = function (context) {
        return function (e) {
            if (e.target && e.target.nodeName === 'INPUT'
                && e.target.className && e.target.className.indexOf('ui-select') >= 0) {
                return;
            }
            if (e.target && e.target.className && e.target.className.length > 0 &&
                e.target.className.indexOf('ui-select') >= 0) {
                if (e.target.nodeName !== 'INPUT') {
                }
                return;
            }
            context.inputMode = false;
            context.optionsOpened = false;
        };
    };
    SelectComponent.prototype.remove = function (item) {
        if (this._disabled === true) {
            return;
        }
        if (this.multiple === true && this.active) {
            var index = this.active.indexOf(item);
            this.active.splice(index, 1);
            this.data.next(this.active);
            this.doEvent('removed', item);
        }
        if (this.multiple === false) {
            this.active = [];
            this.data.next(this.active);
            this.doEvent('removed', item);
        }
    };
    SelectComponent.prototype.doEvent = function (type, value) {
        if (this[type] && value) {
            this[type].next(value);
        }
    };
    SelectComponent.prototype.hideOptions = function () {
        this.inputMode = false;
        this.optionsOpened = false;
    };
    SelectComponent.prototype.keydownEvent = function (e) {
        if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 ||
            e.keyCode === 40) {
            e.preventDefault();
            return;
        }
    };
    SelectComponent.prototype.inputEvent = function (e, isUpMode) {
        if (isUpMode === void 0) { isUpMode = false; }
        if (e.keyCode === 9) {
            return;
        }
        if (isUpMode && e.keyCode === 8) {
            var el = this.element.nativeElement
                .querySelector('div.ui-select-container > input');
            if (!el.value || el.value.length <= 0) {
                if (this.active.length > 0) {
                    this.remove(this.active[this.active.length - 1]);
                }
                e.preventDefault();
            }
        }
        if (isUpMode && e.keyCode === 27) {
            this.hideOptions();
            this.element.nativeElement.children[0].focus();
            e.preventDefault();
            return;
        }
        if (isUpMode && e.keyCode === 46) {
            if (this.active.length > 0) {
                this.remove(this.active[this.active.length - 1]);
            }
            e.preventDefault();
        }
        if (isUpMode && e.keyCode === 37 && this._items.length > 0) {
            this.behavior.first();
            e.preventDefault();
            return;
        }
        if (isUpMode && e.keyCode === 39 && this._items.length > 0) {
            this.behavior.last();
            e.preventDefault();
            return;
        }
        if (isUpMode && e.keyCode === 38) {
            this.behavior.prev();
            e.preventDefault();
            return;
        }
        if (isUpMode && e.keyCode === 40) {
            this.behavior.next();
            e.preventDefault();
            return;
        }
        var char = e.key || String.fromCharCode(e.charCode);
        var keyCode = e.charCode;
        var val = '';
        if (e.target) {
            val = e.target.value
                .replace(SelectComponent_1.KEYMAP[keyCode], '')
                .replace(char, '')
                .trim();
        }
        if (!isUpMode && this.tagging && val.length > 0) {
            var tagged = false;
            this.taggingTokens.forEach(function (token) {
                if (token === SelectComponent_1.KEYMAP[keyCode] || token.toLowerCase() === char.toLowerCase()) {
                    tagged = true;
                }
            });
            if (tagged) {
                this.itemObjects.push(new select_item_1.SelectItem(val));
                this.options = this.itemObjects;
                this.activeOption = this.itemObjects[this.itemObjects.length - 1];
                this._items.push(val);
                this.selectActiveMatch();
                this.open();
                e.preventDefault();
                return;
            }
        }
        if (!isUpMode && e.keyCode === 13) {
            if (this.active.indexOf(this.activeOption) == -1) {
                this.selectActiveMatch();
                this.behavior.next();
            }
            e.preventDefault();
            return;
        }
        if (e.target) {
            this.inputValue = e.target.value;
            this.behavior.filter(this.inputValue);
            this.doEvent('typed', this.inputValue);
        }
    };
    SelectComponent.prototype.selectActiveMatch = function () {
        this.selectMatch(this.activeOption);
    };
    SelectComponent.prototype.selectMatch = function (value, e) {
        if (e === void 0) { e = null; }
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (this.options.length <= 0) {
            return;
        }
        if (this.multiple === true) {
            this.active.push(value);
            this.data.next(this.active);
        }
        if (this.multiple === false) {
            this.active[0] = value;
            this.data.next(this.active[0]);
        }
        this.doEvent('selected', value);
        this.hideOptions();
        if (this.multiple === true) {
            this.focusToInput('');
        }
        else {
            this.element.nativeElement.querySelector('.ui-select-container').focus();
        }
    };
    SelectComponent.prototype.selectActive = function (value) {
        this.activeOption = value;
    };
    SelectComponent.prototype.isActive = function (value) {
        return this.activeOption.text === value.text;
    };
    SelectComponent.KEYMAP = {
        91: "COMMAND",
        8: "BACKSPACE",
        9: "TAB",
        13: "ENTER",
        27: "ESC",
        188: ",",
        32: "SPACE"
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SelectComponent.prototype, "allowClear", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SelectComponent.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SelectComponent.prototype, "itemClass", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], SelectComponent.prototype, "initData", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SelectComponent.prototype, "multiple", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SelectComponent.prototype, "tagging", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], SelectComponent.prototype, "taggingTokens", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], SelectComponent.prototype, "items", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], SelectComponent.prototype, "disabled", null);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], SelectComponent.prototype, "data", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], SelectComponent.prototype, "selected", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], SelectComponent.prototype, "removed", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], SelectComponent.prototype, "typed", void 0);
    SelectComponent = SelectComponent_1 = __decorate([
        core_1.Component({
            selector: 'ng-select',
            template: "\n  <div tabindex=\"0\"\n     *ngIf=\"multiple === false\"\n     (keyup)=\"mainClick($event)\"\n     class=\"ui-select-container ui-select-bootstrap dropdown open\">\n    <div [class.ui-disabled]=\"disabled\"></div>\n    <div class=\"ui-select-match\"\n         *ngIf=\"!inputMode\">\n      <span tabindex=\"-1\"\n          class=\"btn btn-default btn-secondary form-control ui-select-toggle\"\n          (^click)=\"matchClick()\"\n          style=\"outline: 0;\">\n        <span *ngIf=\"active.length <= 0\" class=\"ui-select-placeholder text-muted\">{{placeholder}}</span>\n        <span *ngIf=\"active.length > 0\" class=\"ui-select-match-text pull-left\"\n            [class.ui-select-allow-clear]=\"allowClear && active.length > 0\">{{active[0].text}}</span>\n        <i class=\"dropdown-toggle pull-right\"></i>\n        <i class=\"caret pull-right\"></i>\n        <a *ngIf=\"allowClear && active.length>0\" style=\"margin-right: 10px; padding: 0;\"\n          (click)=\"remove(activeOption)\" class=\"btn btn-xs btn-link pull-right\">\n          <i class=\"glyphicon glyphicon-remove\"></i>\n        </a>\n      </span>\n    </div>\n    <input type=\"text\" autocomplete=\"false\" tabindex=\"-1\"\n           (keydown)=\"keydownEvent($event)\"\n           (keypress)=\"inputEvent($event)\"\n           (keyup)=\"inputEvent($event, true)\"\n           [disabled]=\"disabled\"\n           class=\"form-control ui-select-search\"\n           *ngIf=\"inputMode\"\n           placeholder=\"{{active.length <= 0 ? placeholder : ''}}\">\n      <ul *ngIf=\"optionsOpened && options && options.length > 0 && !itemObjects[0].hasChildren()\"\n        class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\">\n      <li class=\"ui-select-choices-group\">\n        <div *ngFor=\"let o of options\"\n             class=\"ui-select-choices-row\"\n             [class.active]=\"isActive(o)\"\n             (mouseenter)=\"selectActive(o)\"\n             (click)=\"selectMatch(o, $event)\">\n          <a href=\"javascript:void(0)\" class=\"ui-select-choices-row-inner\">\n            <div [innerHtml]=\"o.text | hightlight:inputValue\"></div>\n          </a>\n        </div>\n      </li>\n    </ul>\n\n    <ul *ngIf=\"optionsOpened && options && options.length > 0 && itemObjects[0].hasChildren()\"\n        class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\">\n      <li *ngFor=\"let c of options; let index=index\" class=\"ui-select-choices-group\">\n        <div class=\"divider\" *ngIf=\"index > 0\"></div>\n        <div class=\"ui-select-choices-group-label dropdown-header\">{{c.text}}</div>\n\n        <div *ngFor=\"let o of c.children\"\n             class=\"ui-select-choices-row\"\n             [class.active]=\"isActive(o)\"\n             (mouseenter)=\"selectActive(o)\"\n             (click)=\"selectMatch(o, $event)\"\n             [class.active]=\"isActive(o)\">\n          <a href=\"javascript:void(0)\" class=\"ui-select-choices-row-inner\">\n            <div [innerHtml]=\"o.text | hightlight:inputValue\"></div>\n          </a>\n        </div>\n      </li>\n    </ul>\n  </div>\n\n  <div tabindex=\"0\"\n     *ngIf=\"multiple === true\"\n     (keyup)=\"mainClick($event)\"\n     (focus)=\"focusToInput('')\"\n     class=\"ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control open\">\n    <div [class.ui-disabled]=\"disabled\"></div>\n    <span class=\"ui-select-match\">\n        <span *ngFor=\"let a of active\">\n            <span class=\"ui-select-match-item btn {{itemClass}} btn-secondary btn-xs\"\n                  tabindex=\"-1\"\n                  type=\"button\">\n               <a class=\"close ui-select-match-close\"\n                  (click)=\"remove(a)\">&nbsp;&times;</a>\n               <span>{{a.text}}</span>\n           </span>\n        </span>\n    </span>\n    <input type=\"text\"\n           (keydown)=\"keydownEvent($event)\"\n           (keypress)=\"inputEvent($event)\"\n           (keyup)=\"inputEvent($event, true)\"\n           (click)=\"matchClick($event)\"\n           [disabled]=\"disabled\"\n           autocomplete=\"false\"\n           autocorrect=\"off\"\n           autocapitalize=\"off\"\n           spellcheck=\"false\"\n           class=\"ui-select-search input-xs\"\n           placeholder=\"{{active.length <= 0 ? placeholder : ''}}\"\n           role=\"combobox\">\n      <ul *ngIf=\"optionsOpened && options && options.length > 0 && !itemObjects[0].hasChildren()\"\n          class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\">\n        <li class=\"ui-select-choices-group\">\n          <div *ngFor=\"let o of options\"\n               class=\"ui-select-choices-row\"\n               [class.active]=\"isActive(o)\"\n               (mouseenter)=\"selectActive(o)\"\n               (click)=\"selectMatch(o, $event)\">\n            <a href=\"javascript:void(0)\" class=\"ui-select-choices-row-inner\">\n              <div [innerHtml]=\"o.text | hightlight:inputValue\"></div>\n            </a>\n          </div>\n        </li>\n      </ul>\n  \n      <ul *ngIf=\"optionsOpened && options && options.length > 0 && itemObjects[0].hasChildren()\"\n          class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\">\n        <li *ngFor=\"let c of options; let index=index\" class=\"ui-select-choices-group\">\n          <div class=\"divider\" *ngIf=\"index > 0\"></div>\n          <div class=\"ui-select-choices-group-label dropdown-header\">{{c.text}}</div>\n  \n          <div *ngFor=\"let o of c.children\"\n               class=\"ui-select-choices-row\"\n               [class.active]=\"isActive(o)\"\n               (mouseenter)=\"selectActive(o)\"\n               (click)=\"selectMatch(o, $event)\"\n               [class.active]=\"isActive(o)\">\n            <a href=\"javascript:void(0)\" class=\"ui-select-choices-row-inner\">\n              <div [innerHtml]=\"o.text | hightlight:inputValue\"></div>\n            </a>\n          </div>\n        </li>\n      </ul>\n  </div>\n  "
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], SelectComponent);
    return SelectComponent;
    var SelectComponent_1;
}());
exports.SelectComponent = SelectComponent;
var Behavior = (function () {
    function Behavior(actor) {
        this.actor = actor;
        this.optionsMap = new Map();
    }
    Behavior.prototype.getActiveIndex = function (optionsMap) {
        if (optionsMap === void 0) { optionsMap = null; }
        var ai = this.actor.options.indexOf(this.actor.activeOption);
        if (ai < 0 && optionsMap !== null) {
            ai = optionsMap.get(this.actor.activeOption.id);
        }
        return ai;
    };
    Behavior.prototype.fillOptionsMap = function () {
        var _this = this;
        this.optionsMap.clear();
        var startPos = 0;
        this.actor.itemObjects.map(function (i) {
            startPos = i.fillChildrenHash(_this.optionsMap, startPos);
        });
    };
    Behavior.prototype.ensureHighlightVisible = function (optionsMap) {
        if (optionsMap === void 0) { optionsMap = null; }
        var container = this.actor.element.nativeElement.querySelector('.ui-select-choices-content');
        if (!container) {
            return;
        }
        var choices = container.querySelectorAll('.ui-select-choices-row');
        if (choices.length < 1) {
            return;
        }
        var activeIndex = this.getActiveIndex(optionsMap);
        if (activeIndex < 0) {
            return;
        }
        var highlighted = choices[activeIndex];
        if (!highlighted) {
            return;
        }
        var posY = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
        var height = container.offsetHeight;
        if (posY > height) {
            container.scrollTop += posY - height;
        }
        else if (posY < highlighted.clientHeight) {
            container.scrollTop -= highlighted.clientHeight - posY;
        }
    };
    return Behavior;
}());
exports.Behavior = Behavior;
var GenericBehavior = (function (_super) {
    __extends(GenericBehavior, _super);
    function GenericBehavior(actor) {
        var _this = _super.call(this, actor) || this;
        _this.actor = actor;
        return _this;
    }
    GenericBehavior.prototype.first = function () {
        this.actor.activeOption = this.actor.options[0];
        _super.prototype.ensureHighlightVisible.call(this);
    };
    GenericBehavior.prototype.last = function () {
        this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
        _super.prototype.ensureHighlightVisible.call(this);
    };
    GenericBehavior.prototype.prev = function () {
        var index = this.actor.options.indexOf(this.actor.activeOption);
        this.actor.activeOption = this.actor
            .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
        _super.prototype.ensureHighlightVisible.call(this);
    };
    GenericBehavior.prototype.next = function () {
        var index = this.actor.options.indexOf(this.actor.activeOption);
        this.actor.activeOption = this.actor
            .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
        _super.prototype.ensureHighlightVisible.call(this);
    };
    GenericBehavior.prototype.filter = function (query) {
        var _this = this;
        var options = this.actor.itemObjects
            .filter(function (option) { return (option.text.indexOf(query) > -1) &&
            (_this.actor.multiple === false ||
                (_this.actor.multiple === true && _this.actor.active.indexOf(option) < 0)); });
        this.actor.options = options;
        if (this.actor.options.length > 0) {
            this.actor.activeOption = this.actor.options[0];
            _super.prototype.ensureHighlightVisible.call(this);
        }
    };
    return GenericBehavior;
}(Behavior));
exports.GenericBehavior = GenericBehavior;
var ChildrenBehavior = (function (_super) {
    __extends(ChildrenBehavior, _super);
    function ChildrenBehavior(actor) {
        var _this = _super.call(this, actor) || this;
        _this.actor = actor;
        return _this;
    }
    ChildrenBehavior.prototype.first = function () {
        this.actor.activeOption = this.actor.options[0].children[0];
        this.fillOptionsMap();
        this.ensureHighlightVisible(this.optionsMap);
    };
    ChildrenBehavior.prototype.last = function () {
        this.actor.activeOption =
            this.actor
                .options[this.actor.options.length - 1]
                .children[this.actor.options[this.actor.options.length - 1].children.length - 1];
        this.fillOptionsMap();
        this.ensureHighlightVisible(this.optionsMap);
    };
    ChildrenBehavior.prototype.prev = function () {
        var _this = this;
        var indexParent = this.actor.options
            .findIndex(function (a) { return _this.actor.activeOption.parent && _this.actor.activeOption.parent.id === a.id; });
        var index = this.actor.options[indexParent].children
            .findIndex(function (a) { return _this.actor.activeOption && _this.actor.activeOption.id === a.id; });
        this.actor.activeOption = this.actor.options[indexParent].children[index - 1];
        if (!this.actor.activeOption) {
            if (this.actor.options[indexParent - 1]) {
                this.actor.activeOption = this.actor
                    .options[indexParent - 1]
                    .children[this.actor.options[indexParent - 1].children.length - 1];
            }
        }
        if (!this.actor.activeOption) {
            this.last();
        }
        this.fillOptionsMap();
        this.ensureHighlightVisible(this.optionsMap);
    };
    ChildrenBehavior.prototype.next = function () {
        var _this = this;
        var indexParent = this.actor.options
            .findIndex(function (a) { return _this.actor.activeOption.parent && _this.actor.activeOption.parent.id === a.id; });
        var index = this.actor.options[indexParent].children
            .findIndex(function (a) { return _this.actor.activeOption && _this.actor.activeOption.id === a.id; });
        this.actor.activeOption = this.actor.options[indexParent].children[index + 1];
        if (!this.actor.activeOption) {
            if (this.actor.options[indexParent + 1]) {
                this.actor.activeOption = this.actor.options[indexParent + 1].children[0];
            }
        }
        if (!this.actor.activeOption) {
            this.first();
        }
        this.fillOptionsMap();
        this.ensureHighlightVisible(this.optionsMap);
    };
    ChildrenBehavior.prototype.filter = function (query) {
        var options = [];
        var optionsMap = new Map();
        var startPos = 0;
        for (var _i = 0, _a = this.actor.itemObjects; _i < _a.length; _i++) {
            var si = _a[_i];
            var children = si.children.filter(function (option) { return option.text.indexOf(query) > -1; });
            startPos = si.fillChildrenHash(optionsMap, startPos);
            if (children.length > 0) {
                var newSi = si.getSimilar();
                newSi.children = children;
                options.push(newSi);
            }
        }
        this.actor.options = options;
        if (this.actor.options.length > 0) {
            this.actor.activeOption = this.actor.options[0].children[0];
            _super.prototype.ensureHighlightVisible.call(this, optionsMap);
        }
    };
    return ChildrenBehavior;
}(Behavior));
exports.ChildrenBehavior = ChildrenBehavior;
//# sourceMappingURL=select.js.map