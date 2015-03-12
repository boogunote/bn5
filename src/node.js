export class Node {
  constructor(){
  }

  addChild(nodeId, before) {
    var targetId = -1;
    if (arguments.length == 0) {
      this.node.children.splice(0, 0, this.utility.createNewNode());
    } else {
      for (var i = 0; i < this.node.children.length; i++) {
        if (this.node.children[i].id == nodeId) {
          this.node.children.splice(before?i:i+1, 0, this.utility.createNewNode());
          break;
        }
      };
    }
  }
}