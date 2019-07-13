# Polymer 3 TypeScript Webpack template

## Includes:
- Firebase as service with RxJs
- Polymer 3 starter kit
- Seperate HTML, CSS and TypeScript if needed
- Service worker

## General info:
- Seperate code example:

  When seperating code use template\`...\` instead of html\`...\`

  import * as styles from './style.css';
  import * as view from './view.html';

  static get template() {
    return template\`<style>${styles}</style>${view}\` ;
  }

- Imports:
  Imported webcomponents can be imported where needed or in a general import file.
  
- Config file:
  Contains firebase config.

- Cloud functions:
  Express based: <base url>\main + <express route>
