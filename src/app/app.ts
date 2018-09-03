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
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item';
import '@polymer/paper-listbox';
import '@polymer/paper-menu-button';
import { PolymerElement } from '@polymer/polymer';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings';
import * as styles from './app.css';
import * as view from './app.html';
import './pages/my-icons';
import './services/firebase/firebase';
import './services/router/router';
import { Route } from './services/router/router';
import { AppGlobals, serviceWorker, template } from './services/service';
import { UserDb } from './services/firebase/types';
import { FirebaseService } from './services/firebase/firebase';

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
  @property({ type: Boolean })
  public userLoggedIn = false;
  @property({ type: Object, observer: AppWrapper.prototype._userChanged })
  public user: UserDb | null;
  @property({ type: Boolean })
  public displayReturn = false;
  @property({ type: Boolean })
  public displayMenu = false;
  @property({ type: String })
  public returnText = 'Eindhoven';

  @query('app-drawer')
  private appDrawer: AppDrawerElement;
  @query('firebase-service')
  private firebaseService: FirebaseService & PolymerElement;

  // Observers
  private _pageChanged() {
    if (!this.appDrawer.persistent) {
      this.appDrawer.close();
    }
  }
  private _userChanged() {
    console.log(this.user);
    this.user ? this.userLoggedIn = true : this.userLoggedIn = false;
  }

  // Methods
  public _toPrevPage() {
    return history.go(-1);
  }

  public login() {
    this.firebaseService.login();
  }
  public logout() {
    this.firebaseService.fireAuth.logout();
  }

    // Life cycle
    constructor() {
      super();
    }

}
