System.register(["../utility", "../common", "./node"], function (_export) {
  var Utility, Common, Node, _createClass, _inherits, _classCallCheck, Mosaic;

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

      Mosaic = _export("Mosaic", (function (_Node) {
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

        _inherits(Mosaic, _Node);

        _createClass(Mosaic, {
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
                  this.fileRef = this.rootRef.child("/notes/users/" + authData.uid + "/files/" + this.file_id);

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
            }
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
            }
          },
          newTemporaryMosaic: {
            value: function newTemporaryMosaic() {
              window.open(window.location.origin + "#mosaic");
            }
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
            }
          },
          updateFile: {
            value: function updateFile() {
              var that = this;
              this.doEdit(function () {
                if (that.fileRef) that.fileRef.set(that.getCleanMosaic(that.file));
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

        return Mosaic;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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SUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDN0IsMEJBQVEsR0FBRyxDQUFDLENBQUM7QUFDYix3QkFBTTtpQkFDUDtlQUNGLENBQUM7QUFDRixrQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQyxrQkFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ25COztBQUVELG9CQUFVO21CQUFBLHNCQUFHO0FBQ1gsa0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixrQkFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFXO0FBQ3JCLG9CQUFJLElBQUksQ0FBQyxPQUFPLEVBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztlQUNwRCxDQUFDLENBQUE7YUFDSDs7O0FBeEhNLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFBRTs7OztlQURsQyxNQUFNO1NBQVMsSUFBSSIsImZpbGUiOiJtb3NhaWMvbW9zYWljLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=