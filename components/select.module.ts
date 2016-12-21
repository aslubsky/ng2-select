import {SelectComponent} from './select/select';
import {HightlightPipe} from './select/select-pipes';
import {BrowserModule} from '@angular/platform-browser';


import {NgModule} from '@angular/core';

@NgModule({
  exports: [
    SelectComponent,
    HightlightPipe
  ],
  declarations: [
    SelectComponent,
    HightlightPipe
  ],
  imports: [
    BrowserModule
  ]
})
export class Ng2SelectModule {
}

export * from './select/select';
export * from './select/select-pipes';
