import { customElement, property, observe } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';

// Types
export interface Route {
  path: string;
  prefix: string;
  __queryParams: {};
}

@customElement('router-service')
export class Router extends PolymerElement {

  // Variables
  @property({ type: String, reflectToAttribute: true, notify: true, observer: Router.prototype._pageChanged })
  public page: string;

  @property({ type: Object, notify: true })
  public currentRoute: Route;

  // Observer methods
  @observe('routeData.page')
  _pageChangedObserved(page: string) {
    this._routePageChanged(page);
  }

  _routePageChanged(page: string) {
    if (!page) {
      this.page = 'view1';
    } else if (['view1', 'view2', 'view3'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'view404';
    }
  }

  _pageChanged() {
    const page = this.page;
    import(
      /* webpackChunkName: "page" */
      /* webpackMode: "lazy" */
      `../../pages/${page}/${page}`
    ).catch(() => {
      import(
        /* webpackChunkName: "page" */
        /* webpackMode: "lazy" */
        '../../pages/view404/view404'
      );
    });
  }

  // Template
  static get template() {
    return html`
    <app-location route="{{currentRoute}}" url-space-regex="^[[rootPath]]"></app-location>
    <app-route route="{{currentRoute}}" pattern="[[rootPath]]:page" data="{{routeData}}"></app-route>
    `;
  }

}
