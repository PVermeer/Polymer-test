import { PolymerElement } from "@polymer/polymer/";

declare namespace app.events {
  export interface EventDomRepeat extends Event {
    model: {
      get(index: 'index'): number;
      get(itemsIndex: 'itemsIndex'): number
      get(item: 'item'): any
      get(parentModel: 'parentModel'): PolymerElement;
      get(rootPath: 'rootPath'): string;
  
      get(property: string): any;
  
      set(property: string, value: any): void;
    }
  }

  export interface LangEvent extends Event{
  }
}
