import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import { AppDrawerElement } from '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import { customElement, property, query } from '@polymer/decorators';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { PolymerElement } from '@polymer/polymer';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import * as styles from './app.css';
import * as view from './app.html';
import './pages/my-icons';
import './services/router/router';
import { Route } from './services/router/router';
import { AppGlobals, serviceWorker, template } from './services/service';

setPassiveTouchGestures(true);
setRootPath(AppGlobals.rootPath);
serviceWorker();

@customElement('app-wrapper')
export class AppWrapper extends PolymerElement {

  // Template
  static get template() {
    return template`<style>${styles}</style>${view}`;
  }

  // Variables
  @property({ type: Object })
  public currentRoute: Route;

  @property({ type: String, observer: AppWrapper.prototype._pageChanged })
  public page: string;

  @property({ type: Object })
  public routeData: any;

  @property({ type: Object })
  public subroute: any;

  @query('app-drawer')
  private appDrawer: AppDrawerElement;

  // Observers
  private _pageChanged() {
    if (!this.appDrawer.persistent) {
      this.appDrawer.close();
    }
  }

}
