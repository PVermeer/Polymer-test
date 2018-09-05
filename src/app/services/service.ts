// Set globals
export const AppGlobals = { rootPath: '/' };

// Load and register pre-caching Service Worker
export function serviceWorker() {
  if (location.hostname === 'localhost') { console.warn('I\'ve disabled the service worker on localhost'); }
  if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .catch(registrationError => {
          console.log('SW registration failed: If the app is in debug mode, no worries. I just disabled it.', registrationError);
        });
    });
  }
}

// Load 'get template' with splitted code
export function template(strings: any, ...values: any[]) {
  if (strings.find((x: any) => x.includes('<script>'))) {
    throw new Error(`<script> passed to Polymer's html function. I cannot allow this.`);
  }

  const template2 = (document.createElement('template'));
  template2.innerHTML = values.reduce((acc, v, idx) =>
    acc + v + strings[idx + 1], strings[0]);
  return template2;
}
