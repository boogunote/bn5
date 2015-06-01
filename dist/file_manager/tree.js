System.register(["../common", "./node", "../utility"], function (_export) {
  var Common, Node, Utility, _prototypeProperties, _get, _inherits, _classCallCheck, Tree;

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

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Tree = _export("Tree", (function (Node) {
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

        _inherits(Tree, Node);

        _prototypeProperties(Tree, {
          inject: {
            value: function inject() {
              return [Common, Element, Utility];
            },
            writable: true,
            configurable: true
          }
        }, {
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
            },
            writable: true,
            configurable: true
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
            },
            writable: true,
            configurable: true
          },
          cleanStatus: {
            value: function cleanStatus() {
              this.clipping = false;
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
          }
        });

        return Tree;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUksR0FBRyxJQUFJLENBQUM7QUFDaEIsa0JBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxZQUFZLEVBQUU7QUFDaEUsb0JBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTzs7QUFFaEMsb0JBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDOztlQUVoQyxDQUFDLENBQUM7O0FBRUgsa0JBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUNsQixvQkFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO2VBQy9CLENBQUM7YUFDSDs7OztBQUVELGFBQUc7bUJBQUEsZUFBRztBQUNKLGtCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixrQkFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDeEIsa0JBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUN4QixtQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25ELG9CQUFJLElBQUksR0FBRztBQUNULHlCQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2Qyx5QkFBTyxFQUFFLE1BQU0sRUFDaEIsQ0FBQztBQUNGLDhCQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFCLG9CQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7ZUFDaEQsQ0FBQztBQUNGLGtCQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUN6QixxQkFBTyxZQUFZLENBQUMsYUFBYSxDQUFDO0FBQ2xDLDBCQUFZLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztBQUN2QywwQkFBWSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzVELHFCQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN6Qzs7OztBQUVELHFCQUFXO21CQUFBLHVCQUFHO0FBQ1osa0JBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2FBQ3ZCOzs7O0FBRUQsNEJBQWtCO21CQUFBLDhCQUFHO0FBQ25CLG9CQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDO2FBQ2pEOzs7Ozs7ZUFsRlUsSUFBSTtTQUFTLElBQUkiLCJmaWxlIjoiZmlsZV9tYW5hZ2VyL3RyZWUuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==