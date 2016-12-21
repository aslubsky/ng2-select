import {SelectComponent} from './components/select/select';
import {HightlightPipe} from './components/select/select-pipes';
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

export * from './components/select/select';
export * from './components/select/select-pipes';
