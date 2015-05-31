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
              var attrList = ["collapsed", "content", "fold", "icon", "id", "create_time", "x", "y", "width", "height", "zindex"];
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
              var attrList = ["collapsed", "content", "fold", "icon", "id", "create_time", "x", "y", "width", "height", "zindex"];
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
          getRealUserId: {
            value: function getRealUserId(id) {
              return "simplelogin:" + id;
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
              System["import"]("amd/interact.min").then(function (interact) {
                interact("#" + vm.file_id + " #" + id).allowFrom(".flat-titlebar").draggable({
                  restrict: {
                    restriction: "parent" },
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
                    var left = $(target).position().left;
                    var top = $(target).position().top;
                    // var dx = (parseFloat(target.getAttribute('data-x')) || 0);
                    // var dy = (parseFloat(target.getAttribute('data-y')) || 0);
                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                    console.log($(target).position().left + " " + $(target).position().top + " " + $(target).height() + " " + $(target).width());
                    target.style.webkitTransform = target.style.transform = "translate(0px, 0px)";
                    console.log($(target).position().left + " " + $(target).position().top + " " + $(target).height() + " " + $(target).width());
                    $(target).css({ top: top, left: left });
                    vm.file.nodes[id].x = left;
                    vm.file.nodes[id].y = top;
                    // vm.nodesRef.child(id).set(newNode);
                    // target.style.left = left;
                    // target.style.top = top;
                    console.log($(target).position().left + " " + $(target).position().top + " " + $(target).height() + " " + $(target).width());
                    // var element = $("#"+id);
                    // console.log("1- "+element.position().left+" "+element.position().top+" "+element.width()+" "+element.height())
                    // var pos = $(target).position()
                    // vm.file.nodes[id].x = pos.left;
                    // vm.file.nodes[id].y = pos.top;
                    // console.log("dx:"+dx+" dy:"+dy+" vm.file.nodes[id].x:"+vm.file.nodes[id].x+" vm.file.nodes[id].y:"+vm.file.nodes[id].y)
                    // vm.file.nodes[id].x += dx;
                    // vm.file.nodes[id].y += dy;
                    // console.log("dx:"+dx+" dy:"+dy+" vm.file.nodes[id].x:"+vm.file.nodes[id].x+" vm.file.nodes[id].y:"+vm.file.nodes[id].y)
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
                    // console.log(target)
                    // var element = $("#"+id);
                    // console.log("1- "+element.position().left+" "+element.position().top+" "+element.width()+" "+element.height())
                    // setTimeout(function() {vm.setPositionToRemoteServer(id);}, 10);
                    vm.setPositionToRemoteServer(id);
                  }
                  // this is used later in the resizing demo
                  // window.dragMoveListener = dragMoveListener;
                });

                interact("#" + vm.file_id + " #" + id + " .flat-body").resizable({
                  edges: { left: true, right: true, bottom: true, top: false }
                }).on("resizemove", function (event) {
                  var target = event.target.parentElement,
                      dx = parseFloat(target.getAttribute("data-x")) || 0,
                      dy = parseFloat(target.getAttribute("data-y")) || 0;

                  // // update the element's style
                  target.style.width = event.rect.width + 2 + "px";
                  target.style.height = event.rect.height + 2 + $("#" + id + " .flat-titlebar").height() + "px";
                  console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee");
                  console.log(target);

                  // translate when resizing from top or left edges
                  dx += event.deltaRect.left;
                  dy += event.deltaRect.top;

                  target.style.webkitTransform = target.style.transform = "translate(" + dx + "px," + dy + "px)";

                  target.setAttribute("data-x", dx);
                  target.setAttribute("data-y", dy);
                  // // target.textContent = event.rect.width + '×' + event.rect.height;
                  // vm.setPositionToRemoteServer(id);
                }).on("resizeend", function (event) {
                  var target = event.target.parentElement,
                      dx = parseFloat(target.getAttribute("data-x")) || 0,
                      dy = parseFloat(target.getAttribute("data-y")) || 0;
                  // console.log("dx:"+dx+" dy:"+dy+" vm.file.nodes[id].x:"+vm.file.nodes[id].x+" vm.file.nodes[id].y:"+vm.file.nodes[id].y)
                  vm.file.nodes[id].x += dx;
                  vm.file.nodes[id].y += dy;
                  console.log("dddddddddddddddddddddddddddddddddddddddd");
                  console.log(target);
                  vm.file.nodes[id].width = parseInt(target.style.width.slice(0, -2));
                  vm.file.nodes[id].height = parseInt(target.style.height.slice(0, -2));
                  // console.log("dx:"+dx+" dy:"+dy+" vm.file.nodes[id].x:"+vm.file.nodes[id].x+" vm.file.nodes[id].y:"+vm.file.nodes[id].y)
                  target.setAttribute("data-x", 0);
                  target.setAttribute("data-y", 0);
                  vm.setPositionToRemoteServer(id);
                });
              });
            }
          },
          isSameNode: {
            value: function isSameNode(node1, node2) {
              var attrList = ["collapsed", "content", "fold", "icon", "id", "create_time", "x", "y", "width", "height", "zindex"];
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
            }
          }
        });

        return Utility;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7QUFDaEgsMEJBQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FDcEIscUJBQXFCLENBQUM7QUFDeEIsMkJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksR0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsR0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUNoSCxxQkFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7QUFDcEMsc0JBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDM0Isc0JBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7Ozs7QUFJMUIsMkJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksR0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsR0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTs7Ozs7Ozs7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