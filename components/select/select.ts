import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  SimpleChanges
} from '@angular/core';

import {SelectItem} from './select-item';
import {IOptionsBehavior} from './select-interfaces';

@Component({
  selector: 'ng-select',
  template: `
  <div tabindex="0"
     *ngIf="multiple === false"
     (keyup)="mainClick($event)"
     class="ui-select-container ui-select-bootstrap dropdown open">
    <div [class.ui-disabled]="disabled"></div>
    <div class="ui-select-match"
         *ngIf="!inputMode">
      <span tabindex="-1"
          class="btn btn-default btn-secondary form-control ui-select-toggle"
          (^click)="matchClick()"
          style="outline: 0;">
        <span *ngIf="active.length <= 0" class="ui-select-placeholder text-muted">{{placeholder}}</span>
        <span *ngIf="active.length > 0" class="ui-select-match-text pull-left"
            [class.ui-select-allow-clear]="allowClear && active.length > 0">{{active[0].text}}</span>
        <i class="dropdown-toggle pull-right"></i>
        <i class="caret pull-right"></i>
        <a *ngIf="allowClear && active.length>0" style="margin-right: 10px; padding: 0;"
          (click)="remove(activeOption)" class="btn btn-xs btn-link pull-right">
          <i class="glyphicon glyphicon-remove"></i>
        </a>
      </span>
    </div>
    <input type="text" autocomplete="false" tabindex="-1"
           (keydown)="keydownEvent($event)"
           (keypress)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           [disabled]="disabled"
           class="form-control ui-select-search"
           *ngIf="inputMode"
           placeholder="{{active.length <= 0 ? placeholder : ''}}">
      <ul *ngIf="optionsOpened && options && options.length > 0 && !itemObjects[0].hasChildren()"
        class="ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu">
      <li class="ui-select-choices-group">
        <div *ngFor="let o of options"
             class="ui-select-choices-row"
             [class.active]="isActive(o)"
             (mouseenter)="selectActive(o)"
             (click)="selectMatch(o, $event)">
          <a href="javascript:void(0)" class="ui-select-choices-row-inner">
            <div [innerHtml]="o.text | hightlight:inputValue"></div>
          </a>
        </div>
      </li>
    </ul>

    <ul *ngIf="optionsOpened && options && options.length > 0 && itemObjects[0].hasChildren()"
        class="ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu">
      <li *ngFor="let c of options; let index=index" class="ui-select-choices-group">
        <div class="divider" *ngIf="index > 0"></div>
        <div class="ui-select-choices-group-label dropdown-header">{{c.text}}</div>

        <div *ngFor="let o of c.children"
             class="ui-select-choices-row"
             [class.active]="isActive(o)"
             (mouseenter)="selectActive(o)"
             (click)="selectMatch(o, $event)"
             [class.active]="isActive(o)">
          <a href="javascript:void(0)" class="ui-select-choices-row-inner">
            <div [innerHtml]="o.text | hightlight:inputValue"></div>
          </a>
        </div>
      </li>
    </ul>
  </div>

  <div tabindex="0"
     *ngIf="multiple === true"
     (keyup)="mainClick($event)"
     (focus)="focusToInput('')"
     class="ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control open">
    <div [class.ui-disabled]="disabled"></div>
    <span class="ui-select-match">
        <span *ngFor="let a of active">
            <span class="ui-select-match-item btn {{itemClass}} btn-secondary btn-xs"
                  tabindex="-1"
                  type="button">
               <a class="close ui-select-match-close"
                  (click)="remove(a)">&nbsp;&times;</a>
               <span>{{a.text}}</span>
           </span>
        </span>
    </span>
    <input type="text"
           (keydown)="keydownEvent($event)"
           (keypress)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           (click)="matchClick($event)"
           [disabled]="disabled"
           autocomplete="false"
           autocorrect="off"
           autocapitalize="off"
           spellcheck="false"
           class="ui-select-search input-xs"
           placeholder="{{active.length <= 0 ? placeholder : ''}}"
           role="combobox">
      <ul *ngIf="optionsOpened && options && options.length > 0 && !itemObjects[0].hasChildren()"
          class="ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu">
        <li class="ui-select-choices-group">
          <div *ngFor="let o of options"
               class="ui-select-choices-row"
               [class.active]="isActive(o)"
               (mouseenter)="selectActive(o)"
               (click)="selectMatch(o, $event)">
            <a href="javascript:void(0)" class="ui-select-choices-row-inner">
              <div [innerHtml]="o.text | hightlight:inputValue"></div>
            </a>
          </div>
        </li>
      </ul>
  
      <ul *ngIf="optionsOpened && options && options.length > 0 && itemObjects[0].hasChildren()"
          class="ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu">
        <li *ngFor="let c of options; let index=index" class="ui-select-choices-group">
          <div class="divider" *ngIf="index > 0"></div>
          <div class="ui-select-choices-group-label dropdown-header">{{c.text}}</div>
  
          <div *ngFor="let o of c.children"
               class="ui-select-choices-row"
               [class.active]="isActive(o)"
               (mouseenter)="selectActive(o)"
               (click)="selectMatch(o, $event)"
               [class.active]="isActive(o)">
            <a href="javascript:void(0)" class="ui-select-choices-row-inner">
              <div [innerHtml]="o.text | hightlight:inputValue"></div>
            </a>
          </div>
        </li>
      </ul>
  </div>
  `
})
export class SelectComponent {

  @Input()
  allowClear:boolean = false;
  @Input()
  placeholder:string = '';
  @Input()
  itemClass:string = 'btn-default';
  @Input() set initData(value:Array<any>) {
    if(Array.isArray(value)) {
      this._initData = value;
      this.active = this._initData.map(d => new SelectItem(d));
      //this.data.emit(this.active);
    }
  }

  @Input()
  multiple:boolean = false;
  @Input()
  tagging:boolean = false;
  @Input()
  taggingTokens:string[] = ['SPACE', 'ENTER'];

  @Input() set items(value:Array<any>) {
    this._items = value;
    this.itemObjects = this._items.map((item:any) => new SelectItem(item));
    if(this.optionsOpened) {//redraw items list
      this.open();
    }
  }

  @Input() set disabled(value:boolean) {
    this._disabled = value;
    if (this._disabled === true) {
      this.hideOptions();
    }
  }

  @Output()  data:EventEmitter<any> = new EventEmitter();
  @Output()  selected:EventEmitter<any> = new EventEmitter();
  @Output()  removed:EventEmitter<any> = new EventEmitter();
  @Output()  typed:EventEmitter<any> = new EventEmitter();

  public options:Array<SelectItem> = [];
  public itemObjects:Array<SelectItem> = [];
  public active:Array<SelectItem> = [];
  public activeOption:SelectItem;
  private offSideClickHandler:any;
  private offSideClickHandlerDocument:any;
  private inputMode:boolean = false;
  private optionsOpened:boolean = false;
  private behavior:IOptionsBehavior;
  private inputValue:string = '';
  private _initData:Array<any> = [];
  private _items:Array<any> = [];
  private _disabled:boolean = false;

  private static KEYMAP:any = {
    91: "COMMAND",
    8: "BACKSPACE",
    9: "TAB",
    13: "ENTER",
    27: "ESC",
    188: ",",
    32: "SPACE"
  };

  constructor(public element:ElementRef) {
  }

  private focusToInput(value:string = '') {
    setTimeout(() => {
      let el = this.element.nativeElement.querySelector('div.ui-select-container > input');
      if (el) {
        el.focus();
        el.value = value;
      } else {
        console.log('focusToInput error ', this.element.nativeElement);
      }

    }, 500);
  }

  private matchClick(e:any) {
    if (this._disabled === true) {
      return;
    }

    this.inputMode = !this.inputMode;
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      this.focusToInput();
      this.open();
    }
  }

  private mainClick(e:any) {
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
    //let value = String
    //  .fromCharCode(96 <= e.keyCode && e.keyCode <= 105 ? e.keyCode - 48 : e.keyCode)
    //  .toLowerCase();
    //
    //if (this.tagging && this.taggingTokens.indexOf(',') != -1 && value == '¼') {
    //  value = '';
    //}

    //this.focusToInput(value);
    this.focusToInput(e.target.value);
    this.open();
    //e.srcElement.value = value;
    this.inputEvent(e);
  }

  private open() {
    this.options = this.itemObjects
      .filter(option => (this.multiple === false ||
      this.multiple === true && !this.active.find(o => option.text === o.text)));

    if (this.options.length > 0) {
      this.behavior.first();
    }

    this.optionsOpened = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.itemObjects.length>0) {
      if (!this.behavior) {
        this.behavior = (this.itemObjects.length>0 && this.itemObjects[0].hasChildren()) ?
            new ChildrenBehavior(this) : new GenericBehavior(this);
        // console.log('**New**', this.behavior, changes);
      } else {
        let typeIsChildrenBehavior = this.behavior instanceof ChildrenBehavior;
        let needChildrenBehavior = this.itemObjects[0].hasChildren();
        if (needChildrenBehavior && !typeIsChildrenBehavior) {
          this.behavior =  new ChildrenBehavior(this);
          // console.log('**ChildrenBehavior**');
        } else if (!needChildrenBehavior && typeIsChildrenBehavior) {
          this.behavior = new GenericBehavior(this);
          // console.log('**GenericBehavior**');
        }
      }

    }
  }

  ngOnInit() {
    this.offSideClickHandler = this.getOffSideClickHandler(this);
    this.offSideClickHandlerDocument = this.getOffSideClickHandlerInDocument(this);
    document.addEventListener('click', this.offSideClickHandlerDocument);
    if (this._initData && this._initData.length > 0) {
      this.active = this._initData.map(d => new SelectItem(d));
      this.data.emit(this.active);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.element.nativeElement.addEventListener('click', this.offSideClickHandler);
    }, 500);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.offSideClickHandlerDocument);
    this.element.nativeElement.removeEventListener('click', this.offSideClickHandler);
    this.offSideClickHandler = null;
  }

  private getOffSideClickHandler(context:any) {
    return function (e:any) {
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
  }

  private getOffSideClickHandlerInDocument(context:any) {
    return function (e:any) {
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
  }

  public remove(item:SelectItem) {
    if (this._disabled === true) {
      return;
    }

    if (this.multiple === true && this.active) {
      let index = this.active.indexOf(item);
      this.active.splice(index, 1);
      this.data.next(this.active);
      this.doEvent('removed', item);
    }

    if (this.multiple === false) {
      this.active = [];
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
  }

  public doEvent(type:string, value:any) {
    if ((<any>this)[type] && value) {
      (<any>this)[type].next(value);
    }
  }

  private hideOptions() {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  public keydownEvent(e:any) {
    // console.log('keydownEvent', e);
    if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 ||
        e.keyCode === 40) {
      e.preventDefault();
      return;
    }
  }

  public inputEvent(e:any, isUpMode:boolean = false) {
    // tab
    if (e.keyCode === 9) {
      return;
    }

    // backspace
    if (isUpMode && e.keyCode === 8) {
      let el:any = this.element.nativeElement
        .querySelector('div.ui-select-container > input');

      if (!el.value || el.value.length <= 0) {
        if (this.active.length > 0) {
          this.remove(this.active[this.active.length - 1]);
        }

        e.preventDefault();
      }
    }

    // esc
    if (isUpMode && e.keyCode === 27) {
      this.hideOptions();
      this.element.nativeElement.children[0].focus();
      e.preventDefault();
      return;
    }

    // del
    if (isUpMode && e.keyCode === 46) {
      if (this.active.length > 0) {
        this.remove(this.active[this.active.length - 1]);
      }
      e.preventDefault();
    }

    // left
    if (isUpMode && e.keyCode === 37 && this._items.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }

    // right
    if (isUpMode && e.keyCode === 39 && this._items.length > 0) {
      this.behavior.last();
      e.preventDefault();
      return;
    }

    // up
    if (isUpMode && e.keyCode === 38) {
      this.behavior.prev();
      e.preventDefault();
      return;
    }

    // down
    if (isUpMode && e.keyCode === 40) {
      this.behavior.next();
      e.preventDefault();
      return;
    }

    var char = e.key || String.fromCharCode(e.charCode);
    var keyCode = e.charCode;
    var val:string = '';
    if (e.target) {
      val = e.target.value
        .replace(SelectComponent.KEYMAP[keyCode], '')
        .replace(char, '')
        .trim();
    }
    if (!isUpMode && this.tagging && val.length > 0) {
      var tagged = false;
      this.taggingTokens.forEach(token => {
        if (token === SelectComponent.KEYMAP[keyCode] || token.toLowerCase() === char.toLowerCase()) {
          tagged = true;
        }
      });

      if (tagged) {
        this.itemObjects.push(new SelectItem(val));
        this.options = this.itemObjects;
        this.activeOption = this.itemObjects[this.itemObjects.length - 1];
        this._items.push(val);

        this.selectActiveMatch();
        this.open();

        e.preventDefault();
        return;
      }
    }

    // enter
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
  }

  private selectActiveMatch() {
    this.selectMatch(this.activeOption);
  }

  private selectMatch(value:SelectItem, e:Event = null) {
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
    } else {
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
  }

  private selectActive(value:SelectItem) {
    this.activeOption = value;
  }

  private isActive(value:SelectItem):boolean {
    return this.activeOption.text === value.text;
  }
}

export class Behavior {
  public optionsMap:Map<string, number> = new Map<string, number>();

  constructor(public actor:SelectComponent) {
  }

  private getActiveIndex(optionsMap:Map<string, number> = null):number {
    let ai = this.actor.options.indexOf(this.actor.activeOption);

    if (ai < 0 && optionsMap !== null) {
      ai = optionsMap.get(this.actor.activeOption.id);
    }

    return ai;
  }

  public fillOptionsMap() {
    this.optionsMap.clear();
    let startPos = 0;
    this.actor.itemObjects.map(i => {
      startPos = i.fillChildrenHash(this.optionsMap, startPos);
    });
  }

  public ensureHighlightVisible(optionsMap:Map<string, number> = null) {
    let container = this.actor.element.nativeElement.querySelector('.ui-select-choices-content');

    if (!container) {
      return;
    }

    let choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }

    let activeIndex = this.getActiveIndex(optionsMap);
    if (activeIndex < 0) {
      return;
    }

    let highlighted:any = choices[activeIndex];
    if (!highlighted) {
      return;
    }

    let posY:number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
    let height:number = container.offsetHeight;

    if (posY > height) {
      container.scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      container.scrollTop -= highlighted.clientHeight - posY;
    }
  }
}

export class GenericBehavior extends Behavior implements IOptionsBehavior {
  constructor(public actor:SelectComponent) {
    super(actor);
  }

  public first() {
    this.actor.activeOption = this.actor.options[0];
    super.ensureHighlightVisible();
  }

  public last() {
    this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
    super.ensureHighlightVisible();
  }

  public prev() {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  public next() {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }

  public filter(query) {
    let options = this.actor.itemObjects
      .filter(option => (option.text.indexOf(query) > -1) &&
      (this.actor.multiple === false ||
      (this.actor.multiple === true && this.actor.active.indexOf(option) < 0)));
    this.actor.options = options;

    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0];
      super.ensureHighlightVisible();
    }
  }
}

export class ChildrenBehavior extends Behavior implements IOptionsBehavior {
  constructor(public actor:SelectComponent) {
    super(actor);
  }

  public first() {
    this.actor.activeOption = this.actor.options[0].children[0];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public last() {
    this.actor.activeOption =
      this.actor
        .options[this.actor.options.length - 1]
        .children[this.actor.options[this.actor.options.length - 1].children.length - 1];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public prev() {
    let indexParent = this.actor.options
      .findIndex(a => this.actor.activeOption.parent && this.actor.activeOption.parent.id === a.id);
    let index = this.actor.options[indexParent].children
      .findIndex(a => this.actor.activeOption && this.actor.activeOption.id === a.id);
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
  }

  public next() {
    let indexParent = this.actor.options
      .findIndex(a => this.actor.activeOption.parent && this.actor.activeOption.parent.id === a.id);
    let index = this.actor.options[indexParent].children
      .findIndex(a => this.actor.activeOption && this.actor.activeOption.id === a.id);
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
  }

  public filter(query) {
    let options:Array<SelectItem> = [];
    let optionsMap:Map<string, number> = new Map<string, number>();
    let startPos = 0;

    for (let si of this.actor.itemObjects) {
      let children:Array<SelectItem> = si.children.filter(option => option.text.indexOf(query) > -1);
      startPos = si.fillChildrenHash(optionsMap, startPos);

      if (children.length > 0) {
        let newSi = si.getSimilar();
        newSi.children = children;
        options.push(newSi);
      }
    }

    this.actor.options = options;

    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0].children[0];
      super.ensureHighlightVisible(optionsMap);
    }
  }
}
