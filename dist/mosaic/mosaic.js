System.register(["../utility", "../common", "./node"], function (_export) {
  var Utility, Common, Node, _prototypeProperties, _inherits, _classCallCheck, Mosaic;

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

      Mosaic = _export("Mosaic", (function (Node) {
        function Mosaic(common, utility) {
          _classCallCheck(this, Mosaic);

          this.common = common;
          this.utility = utility;

          this.file = null;
          this.rootVM = this;

          this.editing = false;
          this.updating = false;
          this.localChangedTime = 0;
          this.setToRemoteTime = 0;
          this.receiveRemoteTime = 0;
          this.localChangeWaitTime = 2000;
          this.localChangeWaitEpsilon = 10;
          this.remoteChangeWaitTime = 1000;
          this.remoteChangeWaitEpsilon = 50;

          // this.file = {
          //   rows: [
          //     {
          //       id: "1",
          //       height: 500,
          //       tiles: [
          //         {
          //           id: "1",
          //           flex: 1,
          //           url: "http://www.baidu.com"
          //         },
          //         {
          //           id: "2",
          //           flex: 2,
          //           url: "http://www.sina.com.cn"
          //         },
          //         {
          //           id: "3",
          //           flex: 1,
          //           url: "http://www.aol.com"
          //         }
          //       ]
          //     }
          //   ]
          // }
        }

        _inherits(Mosaic, Node);

        _prototypeProperties(Mosaic, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            },
            writable: true,
            configurable: true
          }
        }, {
          activate: {
            value: function activate(params) {
              if (!params.file_id) {
                this.file = this.utility.clone(this.common.new_mosaic_skeleton);
              } else {
                this.file_id = params.file_id;
                if ("online" == params.type) {
                  this.rootRef = new Firebase(this.common.firebase_url);
                  var authData = this.rootRef.getAuth();
                  if (!authData) {
                    console.log("Please login!");
                    return;
                  }
                  this.user_id = params.user_id;
                  this.fileRef = this.rootRef.child("/notes/users/" + this.utility.getRealUserId(this.user_id) + "/files/" + this.file_id);

                  var that = this;
                  this.fileRef.on("value", function (dataSnapshot) {
                    console.log("dataSnapshot.val() " + that.rootVM.editing);
                    if (that.rootVM.editing) return;
                    // console.log("dataSnapshot.val()")
                    var file = dataSnapshot.val();
                    // console.log(that.file);
                    if (file) {
                      if (!file.rows) file.rows = [];
                      for (var i = 0; i < file.rows.length; i++) {
                        if (!file.rows[i].tiles) file.rows[i].tiles = [];
                        // for (var j = 0; j < that.file.rows[i].tiles.length; j++) {
                        //   that.file.rows[i].tiles[j]
                        // };
                      };
                      that.file = file;
                    }
                  });
                }
              }
            },
            writable: true,
            configurable: true
          },
          newRow: {
            value: function newRow() {
              var row = {
                height: 500,
                id: this.utility.getUniqueId(),
                tiles: [{
                  id: this.utility.getUniqueId(),
                  url: "",
                  flex: 1
                }]
              };
              this.file.rows.push(row);
              this.updateFile();
            },
            writable: true,
            configurable: true
          },
          newTemporaryMosaic: {
            value: function newTemporaryMosaic() {
              window.open(window.location.origin + "#mosaic");
            },
            writable: true,
            configurable: true
          },
          removeRow: {
            value: function removeRow(id) {
              var position = -1;
              for (var i = 0; i < this.file.rows.length; i++) {
                if (id == this.file.rows[i].id) {
                  position = i;
                  break;
                }
              };
              this.file.rows.splice(position, 1);
              this.updateFile();
            },
            writable: true,
            configurable: true
          },
          updateFile: {
            value: function updateFile() {
              var that = this;
              this.doEdit(function () {
                if (that.fileRef) that.fileRef.set(that.getCleanMosaic(that.file));
              });
            },
            writable: true,
            configurable: true
          }
        });

        return Mosaic;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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