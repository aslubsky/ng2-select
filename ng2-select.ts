import {SelectComponent} from './components/select/select';
import {HightlightPipe} from './components/select/select-pipes';
import {CommonModule} from '@angular/common';


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
    CommonModule
  ]
})
export class Ng2SelectModule {
}
