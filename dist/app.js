System.register(["firebase", "aurelia-router", "bootstrap/css/bootstrap.css!"], function (_export) {
  var Router, _prototypeProperties, _classCallCheck, App;

  return {
    setters: [function (_firebase) {}, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_bootstrapCssBootstrapCss) {}],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      App = _export("App", (function () {
        function App(router) {
          _classCallCheck(this, App);

          window.is_nodewebkit = typeof process == "object";
          if (window.is_nodewebkit) {
            window.require = function (moduleName) {
              var tmp = window.global;
              window.global = window.node_global;
              var module = window.global.require(moduleName);
              window.global = tmp;
              return module;
            };
          }

          this.router = router;
          this.router.configure(function (config) {
            config.title = "BooguNote5";
            config.map([{ route: ["index"], moduleId: "index", nav: true },
            // {route: ['flat/:id'],  moduleId: 'flat', nav: true},
            { route: ["tree/:type/:file_id/:root_id"], moduleId: "tree", nav: true }, { route: ["", "login"], moduleId: "login", nav: true }, { route: ["fm"], moduleId: "./file_manager/tree", nav: true }, { route: ["flat/:type/:file_id/:root_id"], moduleId: "flat", nav: true }, { route: ["mosaic/:type/:file_id", "mosaic"], moduleId: "mosaic/mosaic", nav: true }, { route: ["mainwindow"], moduleId: "mainwindow", nav: true }, { route: ["timeline"], moduleId: "timeline/timeline", nav: true }]);
          });
        }

        _prototypeProperties(App, {
          inject: {
            value: function inject() {
              return [Router];
            },
            writable: true,
            configurable: true
          }
        });

        return App;
      })());
    }
  };
});

// import 'bootstrap';
//# sourceMappingURL=data:application/json;base64,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