import 'firebase'

export class Utility {
  constructor(){
  }

  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  copyAttributesWithoutChildren(newNode, node) {
    function copyAttributes(newNode, node, attrName) {
      if (typeof node[attrName] != "undefined") newNode[attrName] = node[attrName];
    }
    var attrList = ["collapsed", "content", "fold", "icon", "id"];
    for (var i = 0; i < attrList.length; i++) {
      copyAttributes(newNode, node, attrList[i]);
    };
  }

  copyAttributes(newNode, node) {
    function copyAttributes(newNode, node, attrName) {
      if (typeof node[attrName] != "undefined") newNode[attrName] = node[attrName];
    }
    var attrList = ["collapsed", "content", "fold", "icon", "id"];
    for (var i = 0; i < attrList.length; i++) {
      copyAttributes(newNode, node, attrList[i]);
    };

    newNode.children = [];
    for (var i = 0; node.children && i < node.children.length; i++) {
      newNode.children.push(node.children[i]);
    };
  }

  createNewNode() {
    return {
      id : this.getUniqueId(),
      content : "",
      collapsed : false,
      fold : false,
      icon : 0,
      children : []
    }
  }

  createNewFlatNode() {
    return {
      id : this.getUniqueId(),
      content : "",
      collapsed : false,
      fold : false,
      icon : 0,
      x:100,
      y:30,
      width:400,
      height:247,
      children : []
    }
  }

  getChildrenPosition(node, id) {
    for (var i = 0; i < node.children.length; i++) {
      if (node.children[i] == id) {
        return i;
      }
    };
  }

  getUniqueId() {
    function randomString(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
    }
    // TODO: Replace with Firebase.ServerValue.TIMESTAMP.
    // Add BN here to prevent the css selector error.
    return "BN-" + new Date().getTime().toString() + "-" + randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }

  getCleanChildren(node) {
    var children = [];
    for (var i = 0; node.children && i < node.children.length; i++) {
      children.push(node.children[i]);
    };
    return children;
  }

  now() {
    return new Date().getTime();
  }
}