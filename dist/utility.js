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
              System["import"]("amd/interact.min").then(function (interact) {
                interact("#" + id).allowFrom(".flat-titlebar").draggable({
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

                interact("#" + id + " .flat-body").resizable({
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
//# sourceMappingURL=data:application/json;base64,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QUFlLEdBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUNwQixxQkFBcUIsQ0FBQztBQUN4QiwyQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxHQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxHQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2hILHFCQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUNwQyxzQkFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzQixzQkFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7OztBQUkxQiwyQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxHQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxHQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBOzs7Ozs7Ozs7O0FBVWhILDBCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqQywwQkFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7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