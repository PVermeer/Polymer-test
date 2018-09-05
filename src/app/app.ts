import { AppDrawerElement } from '@polymer/app-layout/app-drawer/app-drawer.js';
import { customElement, property, query } from '@polymer/decorators';
import { PolymerElement } from '@polymer/polymer';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings';
import { Subscription } from 'rxjs';
import * as styles from './app.css';
import * as view from './app.html';
import './imports';
import { firebaseService } from './services/firebase/firebase';
import { UserDb } from './services/firebase/types';
import { Route } from './services/router/router';
import { AppGlobals, serviceWorker, template } from './services/service';

setPassiveTouchGestures(true);
setRootPath(AppGlobals.rootPath);
serviceWorker();

@customElement('app-wrapper')
export class AppWrapper extends PolymerElement {

  private subscriptions = new Subscription;

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

  @query('app-drawer')
  private appDrawer: AppDrawerElement;

  public user: UserDb | null;

  // Observers
  private _pageChanged() {
    if (!this.appDrawer.persistent) {
      this.appDrawer.close();
    }
  }

  // Methods
  public _toPrevPage() {
    return history.go(-1);
  }

  public login() {
    firebaseService.fireAuth.loginGoogle();
  }
  public logout() {
    firebaseService.fireAuth.logout();
  }

  // Life cycle
  connectedCallback() {
    super.connectedCallback();

    const userSub = firebaseService.fireAuth.user$.subscribe(user => {
      this.user = user;
      this.user ? this.userLoggedIn = true : this.userLoggedIn = false;
    });

    this.subscriptions.add(userSub);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.subscriptions.unsubscribe();
  }

}
