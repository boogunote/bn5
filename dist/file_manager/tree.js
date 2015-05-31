System.register(["../common", "./node", "../utility"], function (_export) {
  var Common, Node, Utility, _createClass, _get, _inherits, _classCallCheck, Tree;

  return {
    setters: [function (_common) {
      Common = _common.Common;
    }, function (_node) {
      Node = _node.Node;
    }, function (_utility) {
      Utility = _utility.Utility;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Tree = _export("Tree", (function (_Node) {
        function Tree(common, element, utility) {
          _classCallCheck(this, Tree);

          _get(Object.getPrototypeOf(Tree.prototype), "constructor", this).call(this);
          this.common = common;
          this.element = element;
          this.utility = utility;

          this.rootVM = this;
          this.node = null;
          this.dirNodesRef = null;
          this.filesRef = null;

          this.editing = false;
          this.updating = false;
          this.localChangedTime = 0;
          this.setToRemoteTime = 0;
          this.receiveRemoteTime = 0;
          this.localChangeWaitTime = 200;
          this.localChangeWaitEpsilon = 10;
          this.remoteChangeWaitTime = 1000;
          this.remoteChangeWaitEpsilon = 50;

          this.selectedVMList = [];
          this.clippedVMList = [];
          this.clipping = false;
        }

        _inherits(Tree, _Node);

        _createClass(Tree, {
          activate: {
            value: function activate(params, queryString, routeConfig) {
              console.log("activate");
              var ref = new Firebase(this.common.firebase_url);
              var authData = ref.getAuth();
              if (!authData) {
                console.log("Please login!");
                return;
              }

              this.user_id = params.user_id;

              var filesPath = "/notes/users/" + this.utility.getRealUserId(this.user_id) + "/files";
              this.filesRef = ref.child(filesPath);

              var dirNodesPath = "/notes/users/" + this.utility.getRealUserId(this.user_id) + "/directories/nodes";
              this.dirNodesRef = ref.child(dirNodesPath);
              var that = this;
              this.dirNodesRef.child("root").on("value", function (dataSnapshot) {
                if (that.rootVM.editing) return;
                // console.log("dataSnapshot.val()")
                that.node = dataSnapshot.val();
                // console.log(that.node)
              });

              if (params.frameVM) {
                this.frameVM = params.frameVM;
              };
            }
          },
          cut: {
            value: function cut() {
              this.clipping = true;
              this.clippedVMList = [];
              var copiedFileList = [];
              for (var i = 0; i < this.selectedVMList.length; i++) {
                var file = {
                  file_id: this.selectedVMList[i].node.id,
                  node_id: "root" };
                copiedFileList.push(file);
                this.clippedVMList.push(this.selectedVMList[i]);
              };
              this.selectedVMList = [];
              delete localStorage.clipboardData;
              localStorage.clipboardData = undefined;
              localStorage.clipboardData = JSON.stringify(copiedFileList);
              console.log(localStorage.clipboardData);
            }
          },
          cleanStatus: {
            value: function cleanStatus() {
              this.clipping = false;
            }
          },
          newTemporaryMosaic: {
            value: function newTemporaryMosaic() {
              window.open(window.location.origin + "#mosaic");
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Element, Utility];
            }
          }
        });

        return Tree;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUU7QUFDaEUsb0JBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTzs7QUFFaEMsb0JBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDOztlQUVoQyxDQUFDLENBQUM7O0FBRUgsa0JBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUNsQixvQkFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO2VBQy9CLENBQUM7YUFDSDs7QUFFRCxhQUFHO21CQUFBLGVBQUc7QUFDSixrQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsa0JBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLGtCQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDeEIsbUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuRCxvQkFBSSxJQUFJLEdBQUc7QUFDVCx5QkFBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkMseUJBQU8sRUFBRSxNQUFNLEVBQ2hCLENBQUM7QUFDRiw4QkFBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQixvQkFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2VBQ2hELENBQUM7QUFDRixrQkFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDekIscUJBQU8sWUFBWSxDQUFDLGFBQWEsQ0FBQztBQUNsQywwQkFBWSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7QUFDdkMsMEJBQVksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1RCxxQkFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDekM7O0FBRUQscUJBQVc7bUJBQUEsdUJBQUc7QUFDWixrQkFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7YUFDdkI7O0FBRUQsNEJBQWtCO21CQUFBLDhCQUFHO0FBQ25CLG9CQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDO2FBQ2pEOzs7QUFqRk0sZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFBRTs7OztlQUQzQyxJQUFJO1NBQVMsSUFBSSIsImZpbGUiOiJmaWxlX21hbmFnZXIvdHJlZS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9