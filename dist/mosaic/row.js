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
              this.row = model.row;
            }
          },
          newTile: {
            value: function newTile() {
              var tile = {
                id: this.utility.getUniqueId(),
                flex: 1,
                url: ""
              };
              this.row.tiles.push(tile);
              this.updateRow();
            }
          },
          removeRow: {
            value: function removeRow() {
              this.parentVM.removeRow(this.row.id);
            }
          },
          removeTile: {
            value: function removeTile(id) {
              var position = -1;
              for (var i = 0; i < this.row.tiles.length; i++) {
                if (id == this.row.tiles[i].id) {
                  position = i;
                  break;
                }
              };

              this.row.tiles.splice(position, 1);
              this.updateRow();
            }
          },
          resetRow: {
            value: function resetRow() {
              for (var i = this.row.tiles.length - 1; i >= 0; i--) {
                this.row.tiles[i].flex = 1;
              };
              this.updateRow();
            }
          },
          setHeight: {
            value: function setHeight() {
              var height = prompt("Row height", this.row.height);

              if (height != null) {
                this.row.height = parseInt(height);
                this.updateRow();
              }
            }
          },
          updateRow: {
            value: function updateRow() {
              var position = -1;
              for (var i = 0; i < this.rootVM.file.rows.length; i++) {
                if (this.row.id == this.rootVM.file.rows[i].id) {
                  position = i;
                  break;
                }
              };

              var that = this;
              this.doEdit(function () {
                if (that.rootVM.fileRef) that.rootVM.fileRef.child("rows/" + position).set(that.getCleanRow(that.row));
              });
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