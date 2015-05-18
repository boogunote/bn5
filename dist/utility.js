System.register(["firebase"], function (_export) {
  var _prototypeProperties, _classCallCheck, Utility;

  return {
    setters: [function (_firebase) {}],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Utility = _export("Utility", (function () {
        function Utility() {
          _classCallCheck(this, Utility);
        }

        _prototypeProperties(Utility, null, {
          clone: {
            value: function clone(obj) {
              return JSON.parse(JSON.stringify(obj));
            },
            writable: true,
            configurable: true
          },
          copyAttributesWithoutChildren: {
            value: function copyAttributesWithoutChildren(newNode, node) {
              function copyAttributes(newNode, node, attrName) {
                if (typeof node[attrName] != "undefined") newNode[attrName] = node[attrName];
              }
              var attrList = ["collapsed", "content", "fold", "icon", "id", "create_time", "x", "y", "width", "height"];
              for (var i = 0; i < attrList.length; i++) {
                copyAttributes(newNode, node, attrList[i]);
              };
            },
            writable: true,
            configurable: true
          },
          copyAttributes: {
            value: function copyAttributes(newNode, node) {
              function copyAttributes(newNode, node, attrName) {
                if (typeof node[attrName] != "undefined") newNode[attrName] = node[attrName];
              }
              var attrList = ["collapsed", "content", "fold", "icon", "id", "create_time", "x", "y", "width", "height"];
              for (var i = 0; i < attrList.length; i++) {
                copyAttributes(newNode, node, attrList[i]);
              };

              newNode.children = [];
              for (var i = 0; node.children && i < node.children.length; i++) {
                newNode.children.push(node.children[i]);
              };
            },
            writable: true,
            configurable: true
          },
          createNewNode: {
            value: function createNewNode() {
              return {
                id: this.getUniqueId(),
                content: "",
                collapsed: false,
                fold: false,
                icon: 0,
                children: []
              };
            },
            writable: true,
            configurable: true
          },
          createNewFlatNode: {
            value: function createNewFlatNode() {
              return {
                id: this.getUniqueId(),
                content: "",
                collapsed: false,
                fold: false,
                icon: 0,
                x: 100,
                y: 30,
                width: 400,
                height: 247,
                children: []
              };
            },
            writable: true,
            configurable: true
          },
          getChildrenPosition: {
            value: function getChildrenPosition(node, id) {
              for (var i = 0; i < node.children.length; i++) {
                if (node.children[i] == id) {
                  return i;
                }
              };
            },
            writable: true,
            configurable: true
          },
          getUniqueId: {
            value: function getUniqueId() {
              function randomString(length, chars) {
                var result = "";
                for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
                return result;
              }
              // TODO: Replace with Firebase.ServerValue.TIMESTAMP.
              // Add BN here to prevent the css selector error.
              return "BN-" + new Date().getTime().toString() + "-" + randomString(5, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
            },
            writable: true,
            configurable: true
          },
          getCleanChildren: {
            value: function getCleanChildren(node) {
              var children = [];
              for (var i = 0; node.children && i < node.children.length; i++) {
                children.push(node.children[i]);
              };
              return children;
            },
            writable: true,
            configurable: true
          },
          initInteract: {
            value: function initInteract(id, vm) {
              interact("#" + id).allowFrom(".flat-titlebar").draggable({
                onstart: function onstart(event) {
                  var target = event.target;
                  target.setAttribute("start-x", vm.file.nodes[id].x);
                  target.setAttribute("start-y", vm.file.nodes[id].y);
                },
                onmove: function dragMoveListener(event) {
                  // console.log(event)
                  var target = event.target,

                  // keep the dragged position in the data-x/data-y attributes
                  dx = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
                      dy = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

                  // vm.file.nodes[id].x = (parseFloat(target.getAttribute('start-x')) || 0) + dx;
                  // vm.file.nodes[id].y = (parseFloat(target.getAttribute('start-y')) || 0) + dy;
                  // translate the element
                  target.style.webkitTransform = target.style.transform = "translate(" + dx + "px, " + dy + "px)";

                  // update the posiion attributes
                  target.setAttribute("data-x", dx);
                  target.setAttribute("data-y", dy);
                },
                onend: function onend(event) {
                  var target = event.target;
                  var dx = parseFloat(target.getAttribute("data-x")) || 0;
                  var dy = parseFloat(target.getAttribute("data-y")) || 0;
                  console.log("dx:" + dx + " dy:" + dy + " vm.file.nodes[id].x:" + vm.file.nodes[id].x + " vm.file.nodes[id].y:" + vm.file.nodes[id].y);
                  vm.file.nodes[id].x += dx;
                  vm.file.nodes[id].y += dy;
                  console.log("dx:" + dx + " dy:" + dy + " vm.file.nodes[id].x:" + vm.file.nodes[id].x + " vm.file.nodes[id].y:" + vm.file.nodes[id].y);
                  target.setAttribute("data-x", 0);
                  target.setAttribute("data-y", 0);
                  // // var target = event.target;
                  // target.style.webkitTransform =
                  // target.style.transform = "translate(0px, 0px)";
                  // // var element = $("#"+id);
                  // // setTimeout(function() {
                  // //   vm.file.nodes[id].x = element.position().left +
                  // //       (parseFloat(target.getAttribute('data-x')) || 0);
                  // //   vm.file.nodes[id].y = element.position().top +
                  // //       (parseFloat(target.getAttribute('data-y')) || 0) ;
                  // // }, 0);

                  vm.setPositionToRemoteServer(id);
                }
                // this is used later in the resizing demo
                // window.dragMoveListener = dragMoveListener;
              });

              interact("#" + id + " .flat-body").resizable({
                edges: { left: true, right: true, bottom: true, top: false }
              }).on("resizemove", function (event) {
                var target = event.target.parentElement,
                    x = parseFloat(target.getAttribute("data-x")) || 0,
                    y = parseFloat(target.getAttribute("data-y")) || 0;

                // // update the element's style
                target.style.width = event.rect.width + "px";
                target.style.height = event.rect.height + $("#" + id + " .flat-titlebar").height() + "px";

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform = "translate(" + x + "px," + y + "px)";

                target.setAttribute("data-x", x);
                target.setAttribute("data-y", y);
                // // target.textContent = event.rect.width + '×' + event.rect.height;
                // vm.setPositionToRemoteServer(id);
              }).on("resizeend", function (event) {
                var target = event.target;
                var dx = parseFloat(target.getAttribute("data-x")) || 0;
                var dy = parseFloat(target.getAttribute("data-y")) || 0;
                // console.log("dx:"+dx+" dy:"+dy+" vm.file.nodes[id].x:"+vm.file.nodes[id].x+" vm.file.nodes[id].y:"+vm.file.nodes[id].y)
                vm.file.nodes[id].x += dx;
                vm.file.nodes[id].y += dy;
                vm.file.nodes[id].width = target.style.width;
                vm.file.nodes[id].height = target.style.height;
                // console.log("dx:"+dx+" dy:"+dy+" vm.file.nodes[id].x:"+vm.file.nodes[id].x+" vm.file.nodes[id].y:"+vm.file.nodes[id].y)
                target.setAttribute("data-x", 0);
                target.setAttribute("data-y", 0);
                vm.setPositionToRemoteServer(id);
              });
            },
            writable: true,
            configurable: true
          },
          isSameNode: {
            value: function isSameNode(node1, node2) {
              var attrList = ["collapsed", "content", "fold", "icon", "id", "create_time", "x", "y", "width", "height"];
              for (var i = 0; i < attrList.length; i++) {
                if (node1[attrList[i]] != node2[attrList[i]]) {
                  return false;
                }
              };

              if (!node1.children && !node2.children) {
                return true;
              }if (node1.children && !node2.children) {
                return false;
              }if (!node1.children && node2.children) {
                return false;
              }if (node1.children.length != node2.children.length) {
                return false;
              }for (var i = 0; i < node1.children.length; i++) {
                if (node1.children[i] != node2.children[i]) {
                  return false;
                }
              };

              return true;
            },
            writable: true,
            configurable: true
          },
          listToTree: {
            value: function listToTree(nodes, root_id) {
              var that = this;
              var visit = (function (_visit) {
                var _visitWrapper = function visit(_x) {
                  return _visit.apply(this, arguments);
                };

                _visitWrapper.toString = function () {
                  return _visit.toString();
                };

                return _visitWrapper;
              })(function (node_id) {
                var node = nodes[node_id];
                var newNode = new Object();
                that.copyAttributesWithoutChildren(newNode, node);
                newNode.children = [];
                for (var i = 0; i < node.children.length; i++) {
                  newNode.children.push(visit(node.children[i]));
                };
                return newNode;
              });

              return visit(root_id);
            },
            writable: true,
            configurable: true
          },
          treeToList: {
            value: function treeToList(root) {
              var nodes = [];
              var that = this;
              var visit = (function (_visit) {
                var _visitWrapper = function visit(_x) {
                  return _visit.apply(this, arguments);
                };

                _visitWrapper.toString = function () {
                  return _visit.toString();
                };

                return _visitWrapper;
              })(function (node) {
                var newNode = new Object();
                newNode.children = [];
                that.copyAttributesWithoutChildren(newNode, node);
                for (var i = 0; i < node.children.length; i++) {
                  newNode.children.push(visit(node.children[i]));
                };
                newNode.id = that.getUniqueId();
                nodes.push(newNode);
                return newNode.id;
              });

              var newRootId = visit(root);
              return {
                root_id: newRootId,
                nodes: nodes
              };
            },
            writable: true,
            configurable: true
          },
          now: {
            value: function now() {
              return new Date().getTime();
            },
            writable: true,
            configurable: true
          },
          millisecondsToString: {
            value: function millisecondsToString(milliseconds) {
              var seconds = milliseconds / 1000;
              var numyears = Math.floor(seconds / 31536000);
              var numdays = Math.floor(seconds % 31536000 / 86400);
              var numhours = Math.floor(seconds % 31536000 % 86400 / 3600);
              var numminutes = Math.floor(seconds % 31536000 % 86400 % 3600 / 60);
              var numseconds = Math.floor(seconds % 31536000 % 86400 % 3600 % 60);
              return (numyears != 0 ? numyears + " years " : "") + (numdays != 0 ? numdays + " days " : "") + (numhours != 0 ? numhours + " hours " : "") + (numminutes != 0 ? numminutes + " minutes " : "") + numseconds + " seconds";
            },
            writable: true,
            configurable: true
          }
        });

        return Utility;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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