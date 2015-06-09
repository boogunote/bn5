System.register(["../utility", "../common", "./node"], function (_export) {
  var Utility, Common, Node, _createClass, _inherits, _classCallCheck, Tile;

  return {
    setters: [function (_utility) {
      Utility = _utility.Utility;
    }, function (_common) {
      Common = _common.Common;
    }, function (_node) {
      Node = _node.Node;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Tile = _export("Tile", (function (_Node) {
        function Tile(common, element, utility) {
          _classCallCheck(this, Tile);

          this.common = common;
          this.element = element;
          this.utility = utility;

          this.iframe_id = this.utility.getUniqueId();
        }

        _inherits(Tile, _Node);

        _createClass(Tile, {
          activate: {
            value: function activate(model) {
              this.parentVM = model.parentVM;
              this.rootVM = this.parentVM.rootVM;
              this.tile = model.tile;
              this.showUrl = this.tile.url;
            }
          },
          loadUrl: {
            value: function loadUrl() {
              this.tile.url = this.showUrl;
              // console.log($("#"+this.iframe_id))
              document.querySelector("#" + this.iframe_id).contentWindow.location.reload(true);
              // $("#"+this.iframe_id).load();
              // var position =  this.getRowAndColomeById(this.tile.id);
              // this.rootVM.fileRef
              //     .child("rows/"+position.row+"/tiles/"+position.column+"/url")
              //     .set(this.tile.url)
              this.updateTile();
            }
          },
          out: {
            value: function out() {
              window.open(this.tile.url);
            }
          },
          remove: {
            value: function remove() {
              this.parentVM.removeTile(this.tile.id);
            }
          },
          wider: {
            value: function wider() {
              this.tile.flex += 0.1;
              this.updateTile();
            }
          },
          smaller: {
            value: function smaller() {
              this.tile.flex -= 0.1;
              this.updateTile();
            }
          },
          updateFlex: {
            value: function updateFlex() {
              var position = this.getRowAndColomeById(this.tile.id);
              this.rootVM.fileRef.child("rows/" + position.row + "/tiles/" + position.column + "/flex").set(this.tile.flex);
            }
          },
          updateTile: {
            value: function updateTile() {
              var position = this.getRowAndColomeById(this.tile.id);
              var that = this;
              this.doEdit(function () {
                if (that.rootVM.fileRef) that.rootVM.fileRef.child("rows/" + position.row + "/tiles/" + position.column).set(that.getCleanTile(that.tile));
              });
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Element, Utility];
            }
          }
        });

        return Tile;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vc2FpYy90aWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7TUFBUSxPQUFPLEVBQ1AsTUFBTSxFQUNOLElBQUksNENBRUMsSUFBSTs7OztBQUpULGFBQU8sWUFBUCxPQUFPOztBQUNQLFlBQU0sV0FBTixNQUFNOztBQUNOLFVBQUksU0FBSixJQUFJOzs7Ozs7Ozs7OztBQUVDLFVBQUk7QUFFSixpQkFGQSxJQUFJLENBRUgsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUM7Z0NBRjFCLElBQUk7O0FBR2IsY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsY0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRXZCLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUM3Qzs7a0JBUlUsSUFBSTs7cUJBQUosSUFBSTtBQVVmLGtCQUFRO21CQUFBLGtCQUFDLEtBQUssRUFBQztBQUNiLGtCQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDL0Isa0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDbkMsa0JBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN2QixrQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzthQUM5Qjs7QUFFRCxpQkFBTzttQkFBQSxtQkFBRztBQUNSLGtCQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDOztBQUU3QixzQkFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFNL0Usa0JBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUNuQjs7QUFFRCxhQUFHO21CQUFBLGVBQUc7QUFDSixvQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzVCOztBQUVELGdCQUFNO21CQUFBLGtCQUFHO0FBQ1Asa0JBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDeEM7O0FBRUQsZUFBSzttQkFBQSxpQkFBRztBQUNOLGtCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7QUFDdEIsa0JBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUNuQjs7QUFFRCxpQkFBTzttQkFBQSxtQkFBRztBQUNSLGtCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7QUFDdEIsa0JBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUNuQjs7QUFFRCxvQkFBVTttQkFBQSxzQkFBRztBQUNYLGtCQUFJLFFBQVEsR0FBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxrQkFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQ2QsS0FBSyxDQUFDLE9BQU8sR0FBQyxRQUFRLENBQUMsR0FBRyxHQUFDLFNBQVMsR0FBQyxRQUFRLENBQUMsTUFBTSxHQUFDLE9BQU8sQ0FBQyxDQUM3RCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUN6Qjs7QUFFRCxvQkFBVTttQkFBQSxzQkFBRztBQUNYLGtCQUFJLFFBQVEsR0FBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxrQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGtCQUFJLENBQUMsTUFBTSxDQUFDLFlBQVc7QUFDckIsb0JBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUNkLEtBQUssQ0FBQyxPQUFPLEdBQUMsUUFBUSxDQUFDLEdBQUcsR0FBQyxTQUFTLEdBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUNyRCxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztlQUMxQyxDQUFDLENBQUM7YUFDSjs7O0FBOURNLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQUU7Ozs7ZUFEM0MsSUFBSTtTQUFTLElBQUkiLCJmaWxlIjoibW9zYWljL3RpbGUuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==