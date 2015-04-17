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
        function Tile(common, utility) {
          _classCallCheck(this, Tile);

          this.common = common;
          this.utility = utility;
        }

        _inherits(Tile, Node);

        _prototypeProperties(Tile, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            },
            writable: true,
            configurable: true
          }
        }, {
          activate: {
            value: function activate(model) {
              this.parentVM = model.parentVM;
              this.rootVM = this.parentVM.rootVM;
              this.row = model.row;
            },
            writable: true,
            configurable: true
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
            },
            writable: true,
            configurable: true
          },
          removeRow: {
            value: function removeRow() {
              this.parentVM.removeRow(this.row.id);
            },
            writable: true,
            configurable: true
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
            },
            writable: true,
            configurable: true
          },
          resetRow: {
            value: function resetRow() {
              for (var i = this.row.tiles.length - 1; i >= 0; i--) {
                this.row.tiles[i].flex = 1;
              };
              this.updateRow();
            },
            writable: true,
            configurable: true
          },
          setHeight: {
            value: function setHeight() {
              var height = prompt("Row height", this.row.height);

              if (height != null) {
                this.row.height = parseInt(height);
                this.updateRow();
              }
            },
            writable: true,
            configurable: true
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
//# sourceMappingURL=data:application/json;base64,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