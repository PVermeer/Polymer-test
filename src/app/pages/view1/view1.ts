import { customElement } from '@polymer/decorators';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { template } from '../../services/service';
import * as sharedStyles from '../../shared-styles.css';
import * as styles from './view1.css';
import * as view from './view1.html';

@customElement('app-view1')
export class View1 extends PolymerElement {
  static get template() {
    return template`<style>${sharedStyles}${styles}</style>${view}`;
  }

}
