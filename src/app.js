import {Router} from 'aurelia-router';
import bootstrap from 'bootstrap';

export class App {
  static inject() { return [Router]; }
  constructor(router) {
    this.router = router;
    this.router.configure(config => {
      config.title = 'Aurelia';
      config.map([
        {route: ['','flat/:id'],  moduleId: 'flat', nav: true},
        {route: ['tree/:id'],     moduleId: 'tree', nav: true}
      ]);
    });
  }
}
