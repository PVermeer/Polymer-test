import { customElement } from '@polymer/decorators';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { template } from '../../services/service';
import * as sharedStyles from '../../shared-styles.css';
import * as styles from './view2.css';
import * as view from './view2.html';

@customElement('app-view2')
export class View2 extends PolymerElement {
  static get template() {
    return template`<style>${sharedStyles}${styles}</style>${view}`;
  }

}
