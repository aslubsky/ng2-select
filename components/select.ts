import {NgModule, forwardRef} from '@angular/core';

import {SelectComponent} from './select/select';
// export const SELECT_DIRECTIVES: Array<any> = [Select];


@NgModule({
  imports: [
    SelectComponent
  ],
  declarations: [
    SelectComponent
  ]
})
export class UiSelectModule {
}
