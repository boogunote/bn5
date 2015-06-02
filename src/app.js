import 'firebase';

import {Router} from 'aurelia-router';
// import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class App {
  static inject() { return [Router]; }
  constructor(router) {
    window.is_nodewebkit = (typeof process == "object");
    if (window.is_nodewebkit) {
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
      config.title = 'BooguNote5';
      config.map([
        {route: ['index'],  moduleId: 'index', nav: true},
        // {route: ['flat/:id'],  moduleId: 'flat', nav: true},
        {route: ['tree/:type/:user_id/:file_id/:root_id'],     moduleId: 'tree', nav: true},
        {route: ['','login'],     moduleId: 'login', nav: true},
        {route: ['fm'],     moduleId: './file_manager/tree/:user_id', nav: true},
        {route: ['flat/:type/:user_id/:file_id/:root_id'],     moduleId: 'flat', nav: true},
        {route: ['mosaic/:type/:user_id/:file_id', 'mosaic'],     moduleId: 'mosaic/mosaic', nav: true},
        {route: ['main'], moduleId: 'main', nav: true},
        {route: ['timeline'], moduleId: 'timeline/timeline', nav: true}
      ]);
    });
  }
}
