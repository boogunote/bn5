System.register(["firebase", "aurelia-router"], function (_export) {
  var Router, _createClass, _classCallCheck, App;

  return {
    setters: [function (_firebase) {}, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      // import 'bootstrap';
      // import 'bootstrap/css/bootstrap.css!';

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
            { route: ["tree/:type/:file_id/:root_id"], moduleId: "tree", nav: true }, { route: ["", "login"], moduleId: "login", nav: true }, { route: ["fm"], moduleId: "./file_manager/tree", nav: true }, { route: ["flat/:type/:file_id/:root_id"], moduleId: "flat", nav: true, title: "aaaa" }, { route: ["mosaic/:type/:file_id", "mosaic"], moduleId: "mosaic/mosaic", nav: true }]);
          });
        }

        _createClass(App, null, {
          inject: {
            value: function inject() {
              return [Router];
            }
          }
        });

        return App;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO01BRVEsTUFBTSxpQ0FJRCxHQUFHOzs7O0FBSlIsWUFBTSxrQkFBTixNQUFNOzs7Ozs7Ozs7Ozs7QUFJRCxTQUFHO0FBRUgsaUJBRkEsR0FBRyxDQUVGLE1BQU0sRUFBRTtnQ0FGVCxHQUFHOztBQUdaLGdCQUFNLENBQUMsYUFBYSxHQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsQUFBQyxDQUFDO0FBQ3BELGNBQUksTUFBTSxDQUFDLGFBQWEsRUFBRTtBQUN4QixrQkFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLFVBQVUsRUFBRTtBQUNwQyxrQkFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUN4QixvQkFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ25DLGtCQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxvQkFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDcEIscUJBQU8sTUFBTSxDQUFDO2FBQ2YsQ0FBQTtXQUNGOztBQUVELGNBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQzlCLGtCQUFNLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztBQUM1QixrQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUNULEVBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUcsUUFBUSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDOztBQUVqRCxjQUFDLEtBQUssRUFBRSxDQUFDLDhCQUE4QixDQUFDLEVBQU0sUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQzFFLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFDLE9BQU8sQ0FBQyxFQUFNLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUN2RCxFQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFNLFFBQVEsRUFBRSxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQy9ELEVBQUMsS0FBSyxFQUFFLENBQUMsOEJBQThCLENBQUMsRUFBTSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLE1BQU0sRUFBQyxFQUN4RixFQUFDLEtBQUssRUFBRSxDQUFDLHVCQUF1QixFQUFFLFFBQVEsQ0FBQyxFQUFNLFFBQVEsRUFBRSxlQUFlLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUN2RixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7U0FDSjs7cUJBM0JVLEdBQUc7QUFDUCxnQkFBTTttQkFBQSxrQkFBRztBQUFFLHFCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7YUFBRTs7OztlQUR6QixHQUFHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9