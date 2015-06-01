System.register(["../utility", "../common", "./node"], function (_export) {
  var Utility, Common, Node, _prototypeProperties, _inherits, _classCallCheck, Tile;

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

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Tile = _export("Tile", (function (Node) {
        function Tile(common, element, utility) {
          _classCallCheck(this, Tile);

          this.common = common;
          this.element = element;
          this.utility = utility;

          this.iframe_id = this.utility.getUniqueId();
        }

        _inherits(Tile, Node);

        _prototypeProperties(Tile, {
          inject: {
            value: function inject() {
              return [Common, Element, Utility];
            },
            writable: true,
            configurable: true
          }
        }, {
          activate: {
            value: function activate(model) {
              this.parentVM = model.parentVM;
              this.rootVM = this.parentVM.rootVM;
              this.tile = model.tile;
              this.showUrl = this.tile.url;
            },
            writable: true,
            configurable: true
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
            },
            writable: true,
            configurable: true
          },
          out: {
            value: function out() {
              window.open(this.tile.url);
            },
            writable: true,
            configurable: true
          },
          remove: {
            value: function remove() {
              this.parentVM.removeTile(this.tile.id);
            },
            writable: true,
            configurable: true
          },
          wider: {
            value: function wider() {
              this.tile.flex += 0.1;
              this.updateTile();
            },
            writable: true,
            configurable: true
          },
          smaller: {
            value: function smaller() {
              this.tile.flex -= 0.1;
              this.updateTile();
            },
            writable: true,
            configurable: true
          },
          updateFlex: {
            value: function updateFlex() {
              var position = this.getRowAndColomeById(this.tile.id);
              this.rootVM.fileRef.child("rows/" + position.row + "/tiles/" + position.column + "/flex").set(this.tile.flex);
            },
            writable: true,
            configurable: true
          },
          updateTile: {
            value: function updateTile() {
              var position = this.getRowAndColomeById(this.tile.id);
              var that = this;
              this.doEdit(function () {
                if (that.rootVM.fileRef) that.rootVM.fileRef.child("rows/" + position.row + "/tiles/" + position.column).set(that.getCleanTile(that.tile));
              });
            },
            writable: true,
            configurable: true
          }
        });

        return Tile;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vc2FpYy90aWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7TUFBUSxPQUFPLEVBQ1AsTUFBTSxFQUNOLElBQUksb0RBRUMsSUFBSTs7OztBQUpULGFBQU8sWUFBUCxPQUFPOztBQUNQLFlBQU0sV0FBTixNQUFNOztBQUNOLFVBQUksU0FBSixJQUFJOzs7Ozs7Ozs7OztBQUVDLFVBQUksOEJBQVMsSUFBSTtBQUVqQixpQkFGQSxJQUFJLENBRUgsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPO2dDQUZ6QixJQUFJOztBQUdiLGNBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLGNBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUV2QixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDN0M7O2tCQVJVLElBQUksRUFBUyxJQUFJOzs2QkFBakIsSUFBSTtBQUNSLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQUU7Ozs7O0FBU3RELGtCQUFRO21CQUFBLGtCQUFDLEtBQUssRUFBQztBQUNiLGtCQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDL0Isa0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDbkMsa0JBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN2QixrQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzthQUM5Qjs7OztBQUVELGlCQUFPO21CQUFBLG1CQUFHO0FBQ1Isa0JBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7O0FBRTdCLHNCQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7OztBQU0vRSxrQkFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ25COzs7O0FBRUQsYUFBRzttQkFBQSxlQUFHO0FBQ0osb0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM1Qjs7OztBQUVELGdCQUFNO21CQUFBLGtCQUFHO0FBQ1Asa0JBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDeEM7Ozs7QUFFRCxlQUFLO21CQUFBLGlCQUFHO0FBQ04sa0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQztBQUN0QixrQkFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ25COzs7O0FBRUQsaUJBQU87bUJBQUEsbUJBQUc7QUFDUixrQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDO0FBQ3RCLGtCQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDbkI7Ozs7QUFFRCxvQkFBVTttQkFBQSxzQkFBRztBQUNYLGtCQUFJLFFBQVEsR0FBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxrQkFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQ2QsS0FBSyxDQUFDLE9BQU8sR0FBQyxRQUFRLENBQUMsR0FBRyxHQUFDLFNBQVMsR0FBQyxRQUFRLENBQUMsTUFBTSxHQUFDLE9BQU8sQ0FBQyxDQUM3RCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUN6Qjs7OztBQUVELG9CQUFVO21CQUFBLHNCQUFHO0FBQ1gsa0JBQUksUUFBUSxHQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELGtCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsa0JBQUksQ0FBQyxNQUFNLENBQUMsWUFBVztBQUNyQixvQkFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQ2QsS0FBSyxDQUFDLE9BQU8sR0FBQyxRQUFRLENBQUMsR0FBRyxHQUFDLFNBQVMsR0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQ3JELEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2VBQzFDLENBQUMsQ0FBQzthQUNKOzs7Ozs7ZUEvRFUsSUFBSTtTQUFTLElBQUkiLCJmaWxlIjoibW9zYWljL3RpbGUuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==