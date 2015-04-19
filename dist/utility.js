System.register(["firebase"], function (_export) {
  var _createClass, _classCallCheck, Utility;

  return {
    setters: [function (_firebase) {}],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Utility = _export("Utility", (function () {
        function Utility() {
          _classCallCheck(this, Utility);
        }

        _createClass(Utility, {
          clone: {
            value: function clone(obj) {
              return JSON.parse(JSON.stringify(obj));
            }
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
            }
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
            }
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
            }
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
            }
          },
          getChildrenPosition: {
            value: function getChildrenPosition(node, id) {
              for (var i = 0; i < node.children.length; i++) {
                if (node.children[i] == id) {
                  return i;
                }
              };
            }
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
            }
          },
          getCleanChildren: {
            value: function getCleanChildren(node) {
              var children = [];
              for (var i = 0; node.children && i < node.children.length; i++) {
                children.push(node.children[i]);
              };
              return children;
            }
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
            }
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
            }
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
            }
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
            }
          },
          now: {
            value: function now() {
              return new Date().getTime();
            }
          }
        });

        return Utility;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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