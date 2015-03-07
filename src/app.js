import {Router} from 'aurelia-router';
import bootstrap from 'bootstrap';

export class App {
  static inject() { return [Router]; }
  constructor(router) {
    var is_nodewebkit = (typeof process == "object");
    if (is_nodewebkit) {
      window.require = function(moduleName) {
        var tmp = window.global;
        window.global = window.node_global;
        var module = window.global.require(moduleName);
        window.global = tmp;
        return module;
      }
    }

    this.router = router;
    this.router.configure(config => {
      config.title = 'Aurelia';
      config.map([
        {route: ['','index'],  moduleId: 'index', nav: true},
        {route: ['flat/:id'],  moduleId: 'flat', nav: true},
        {route: ['tree/:id'],     moduleId: 'tree', nav: true}
      ]);
    });
  }
}
