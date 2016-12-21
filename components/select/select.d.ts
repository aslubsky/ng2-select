/// <reference types="es6-shim" />
import { EventEmitter, ElementRef } from '@angular/core';
import { SelectItem } from './select-item';
import { IOptionsBehavior } from './select-interfaces';
export declare class SelectComponent {
    element: ElementRef;
    allowClear: boolean;
    placeholder: string;
    itemClass: string;
    initData: Array<any>;
    multiple: boolean;
    tagging: boolean;
    taggingTokens: string[];
    items: Array<any>;
    disabled: boolean;
    data: EventEmitter<any>;
    selected: EventEmitter<any>;
    removed: EventEmitter<any>;
    typed: EventEmitter<any>;
    options: Array<SelectItem>;
    itemObjects: Array<SelectItem>;
    active: Array<SelectItem>;
    activeOption: SelectItem;
    private offSideClickHandler;
    private inputMode;
    private optionsOpened;
    private behavior;
    private inputValue;
    private _initData;
    private _items;
    private _disabled;
    private static KEYMAP;
    constructor(element: ElementRef);
    private focusToInput(value?);
    private matchClick(e);
    private mainClick(e);
    open(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private getOffSideClickHandler(context);
    remove(item: SelectItem): void;
    doEvent(type: string, value: any): void;
    private hideOptions();
    inputEvent(e: any, isUpMode?: boolean): void;
    private selectActiveMatch();
    private selectMatch(value, e?);
    private selectActive(value);
    private isActive(value);
}
export declare class Behavior {
    actor: SelectComponent;
    optionsMap: Map<string, number>;
    constructor(actor: SelectComponent);
    private getActiveIndex(optionsMap?);
    fillOptionsMap(): void;
    ensureHighlightVisible(optionsMap?: Map<string, number>): void;
}
export declare class GenericBehavior extends Behavior implements IOptionsBehavior {
    actor: SelectComponent;
    constructor(actor: SelectComponent);
    first(): void;
    last(): void;
    prev(): void;
    next(): void;
    filter(query: RegExp): void;
}
export declare class ChildrenBehavior extends Behavior implements IOptionsBehavior {
    actor: SelectComponent;
    constructor(actor: SelectComponent);
    first(): void;
    last(): void;
    prev(): void;
    next(): void;
    filter(query: RegExp): void;
}
