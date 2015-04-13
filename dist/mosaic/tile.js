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
        function Tile(common, utility) {
          _classCallCheck(this, Tile);

          this.common = common;
          this.utility = utility;
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
              // var position =  this.getRowAndColomeById(this.tile.id);
              // this.rootVM.fileRef
              //     .child("rows/"+position.row+"/tiles/"+position.column+"/url")
              //     .set(this.tile.url)
              this.updateTile();
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
              this.rootVM.fileRef.child("rows/" + position.row + "/tiles/" + position.column).set(this.getCleanTile(this.tile));
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            }
          }
        });

        return Tile;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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