import { customElement } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

@customElement('app-view404')
export class MyView404 extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;

          padding: 10px 20px;
        }
      </style>

      Oops you hit a 404. <a href="[[rootPath]]">Head back to home.</a>
    `;
  }
}
