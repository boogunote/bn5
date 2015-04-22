System.register(["../utility", "../common"], function (_export) {
  var Utility, Common, _prototypeProperties, _classCallCheck, Node;

  return {
    setters: [function (_utility) {
      Utility = _utility.Utility;
    }, function (_common) {
      Common = _common.Common;
    }],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Node = _export("Node", (function () {
        function Node(common, utility) {
          _classCallCheck(this, Node);

          this.common = common;
          this.utility = utility;
        }

        _prototypeProperties(Node, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            },
            writable: true,
            configurable: true
          }
        }, {
          getRowAndColomeById: {
            value: function getRowAndColomeById(id) {
              for (var i = 0; i < this.rootVM.file.rows.length; i++) {
                for (var j = 0; j < this.rootVM.file.rows[i].tiles.length; j++) {
                  if (id == this.rootVM.file.rows[i].tiles[j].id) {
                    return { row: i, column: j };
                  }
                }
              };
            },
            writable: true,
            configurable: true
          },
          getCleanTile: {
            value: function getCleanTile(tile) {
              return {
                id: tile.id,
                flex: tile.flex,
                url: tile.url
              };
            },
            writable: true,
            configurable: true
          },
          getCleanRow: {
            value: function getCleanRow(row) {
              var tiles = [];
              for (var i = 0; i < row.tiles.length; i++) {
                tiles.push(this.getCleanTile(row.tiles[i]));
              };
              return {
                id: row.id,
                height: row.height,
                tiles: tiles
              };
            },
            writable: true,
            configurable: true
          },
          getCleanMosaic: {
            value: function getCleanMosaic(file) {
              var rows = [];
              for (var i = 0; i < file.rows.length; i++) {
                rows.push(this.getCleanRow(file.rows[i]));
              };
              return {
                meta: {
                  id: file.meta.id,
                  create_time: file.meta.create_time,
                  name: file.meta.name,
                  type: file.meta.type
                },
                rows: rows
              };
            },
            writable: true,
            configurable: true
          },
          doEdit: {
            value: function doEdit(realEdit) {
              var that = this;
              var edit = (function (_edit) {
                var _editWrapper = function edit() {
                  return _edit.apply(this, arguments);
                };

                _editWrapper.toString = function () {
                  return _edit.toString();
                };

                return _editWrapper;
              })(function () {
                if (that.rootVM.editing && that.utility.now() - that.rootVM.localChangedTime < that.rootVM.localChangeWaitTime - that.rootVM.localChangeWaitEpsilon) {
                  setTimeout(edit, that.rootVM.localChangeWaitTime);
                  // console.log("setTimeout2")
                } else {
                  that.rootVM.editing = false;
                }
              });
              this.rootVM.localChangedTime = this.utility.now();
              if (!this.rootVM.editing) {
                this.rootVM.editing = true;
                setTimeout(edit, that.rootVM.localChangeWaitTime);
                // console.log("setTimeout1")
              };
              realEdit();
            },
            writable: true,
            configurable: true
          }
        });

        return Node;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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