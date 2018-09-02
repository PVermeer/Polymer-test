import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import * as sharedStyles from '../shared-styles.css';
import * as styles from './view3.css';
import * as view from './view3.html';
import { customElement } from '@polymer/decorators';
import { template } from '../../services/service';

@customElement('app-view3')
export class View3 extends PolymerElement {
  static get template() {
    return template`<style>${sharedStyles}${styles}</style>${view}`;
  }

}
