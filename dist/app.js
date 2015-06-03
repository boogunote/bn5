System.register(["firebase", "./common", "./utility", "aurelia-router", "bootstrap/css/bootstrap.css!"], function (_export) {
  var Common, Utility, Router, _prototypeProperties, _classCallCheck, App;

  return {
    setters: [function (_firebase) {}, function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_bootstrapCssBootstrapCss) {}],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      App = _export("App", (function () {
        function App(common, utility, router) {
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

          this.common = common;
          this.utility = utility;
          this.router = router;
          this.router.configure(function (config) {
            config.title = "BooguNote5";
            config.map([{ route: ["index"], moduleId: "index", nav: true },
            // {route: ['flat/:id'],  moduleId: 'flat', nav: true},
            { route: ["tree/:type/:user_id/:file_id/:root_id"], moduleId: "tree", nav: true }, { route: ["", "login"], moduleId: "login", nav: true }, { route: ["fm"], moduleId: "./file_manager/tree/:user_id", nav: true }, { route: ["flat/:type/:user_id/:file_id/:root_id"], moduleId: "flat", nav: true }, { route: ["mosaic/:type/:user_id/:file_id", "mosaic"], moduleId: "mosaic/mosaic", nav: true }, { route: ["main"], moduleId: "main", nav: true }, { route: ["timeline"], moduleId: "timeline/timeline", nav: true }]);
          });

          this.isOffline = false;

          var that = this;
          new Firebase(this.common.firebase_url).child(".info/connected").on("value", function (connectedSnap) {
            if (connectedSnap.val() === true) {
              that.isOffline = false;
            } else {
              that.isOffline = true;
            }
          });
        }

        _prototypeProperties(App, {
          inject: {
            value: function inject() {
              return [Common, Utility, Router];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO01BQ1EsTUFBTSxFQUNOLE9BQU8sRUFFUCxNQUFNLHlDQUlELEdBQUc7Ozs7QUFQUixZQUFNLFdBQU4sTUFBTTs7QUFDTixhQUFPLFlBQVAsT0FBTzs7QUFFUCxZQUFNLGtCQUFOLE1BQU07Ozs7Ozs7OztBQUlELFNBQUc7QUFFSCxpQkFGQSxHQUFHLENBRUYsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNO2dDQUZ4QixHQUFHOztBQUdaLGdCQUFNLENBQUMsYUFBYSxHQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsQUFBQyxDQUFDO0FBQ3BELGNBQUksTUFBTSxDQUFDLGFBQWEsRUFBRTtBQUN4QixrQkFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLFVBQVUsRUFBRTtBQUNwQyxrQkFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUN4QixvQkFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ25DLGtCQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxvQkFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDcEIscUJBQU8sTUFBTSxDQUFDO2FBQ2YsQ0FBQTtXQUNGOztBQUVELGNBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLGNBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQzlCLGtCQUFNLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztBQUM1QixrQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUNULEVBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUcsUUFBUSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDOztBQUVqRCxjQUFDLEtBQUssRUFBRSxDQUFDLHVDQUF1QyxDQUFDLEVBQU0sUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQ25GLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFDLE9BQU8sQ0FBQyxFQUFNLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUN2RCxFQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFNLFFBQVEsRUFBRSw4QkFBOEIsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQ3hFLEVBQUMsS0FBSyxFQUFFLENBQUMsdUNBQXVDLENBQUMsRUFBTSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFDbkYsRUFBQyxLQUFLLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxRQUFRLENBQUMsRUFBTSxRQUFRLEVBQUUsZUFBZSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFDL0YsRUFBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFDOUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUNoRSxDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7O0FBRUgsY0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7O0FBRXZCLGNBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixjQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxhQUFhLEVBQUU7QUFDbEcsZ0JBQUksYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLElBQUksRUFBRTtBQUNoQyxrQkFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7YUFDeEIsTUFBTTtBQUNMLGtCQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzthQUN2QjtXQUNGLENBQUMsQ0FBQztTQUVKOzs2QkEzQ1UsR0FBRztBQUNQLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQUU7Ozs7OztlQUQxQyxHQUFHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9