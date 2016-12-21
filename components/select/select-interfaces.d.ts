/// <reference types="es6-shim" />
export interface IOptionsBehavior {
    first(): any;
    last(): any;
    prev(): any;
    next(): any;
    filter(query: RegExp): any;
}
