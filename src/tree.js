import {DataSource} from './data-source';
import {Node} from './node';
import {TreeParams} from './tree-params';
import {Utility} from './utility';

export class Tree extends Node {
  static inject() { return [DataSource, TreeParams, Utility]; }
  constructor(dataSource, treeParams, utility){
    super();
    this.dataSource = dataSource;
    this.operationRecordList = [];
    this.operationRecordList.cursor = -1;
    this.treeParams = treeParams;
    this.utility = utility;
  }

  activate(params, queryString, routeConfig) {
    console.log("activate");
    console.log(this.treeParams.path);
    this.path = this.treeParams.path;
    var that = this;
    return this.dataSource.load(this.path)
        .then(jsonData => {
          this.jsonData = jsonData;
          this.treeVM = this;
          this.node = JSON.parse(jsonData);
        }).catch(err => {
          console.log(err);
        });
  }

  attached(){
    console.log("attached")
  }

  getVMByPositionArray(positionArray) {
    var vm = this;
    for (var i = 0; i < positionArray.length; i++) {
      vm = vm.childVMList[positionArray[i]]
    };

    return vm;
  }

  insertNodeAt(positionArray, node) {
    console.log("insertNodeAt:"+positionArray.toString())
    var positionArray = JSON.parse(JSON.stringify(positionArray)); //clone object
    var insertPosition = positionArray.pop();
    var vm = this.getVMByPositionArray(positionArray);
    vm.node.children.splice(insertPosition, 0, node);
  }

  removeNodeAt(positionArray) {
    console.log("removeNodeAt:"+positionArray.toString())
    var positionArray = JSON.parse(JSON.stringify(positionArray)); //clone object
    var removePosition = positionArray.pop();
    var vm = this.getVMByPositionArray(positionArray);
    setTimeout(function() {
      vm.node.children.splice(removePosition, 1);
    }, 0);
  }

  uncollapsed(positionArray) {
    var node = this.node;
    for (var i = 0; i < positionArray.length; i++) {
      node.collapsed = false;
      node = node.children[positionArray[i]]
    };
  }

  record(nodeDataList, operation) {
    var record = {};
    record.operation = operation;
    record.nodeList = nodeDataList;
    
    this.operationRecordList.splice(this.operationRecordList.cursor+1);
    this.operationRecordList.push(record);
    this.operationRecordList.cursor++;
    //console.log($scope.$operationRecordList)
  }

  save() {
    console.log(this.operationRecordList)
    // this.dataSource.save(this.path, JSON.stringify(this.node))
    //     .catch(err => {
    //       console.log(err);
    //     });
  }

  redo() {
    console.log("redo")
    // console.log($scope.$operationRecordList)
    if (this.operationRecordList.cursor >= this.operationRecordList.length-1) return;

    this.operationRecordList.cursor++;
    var record = this.operationRecordList[this.operationRecordList.cursor];
    var that = this;
    if ("insert" == record.operation) {
      for (var i = 0; i < record.nodeList.length; i++) {
        this.uncollapsed(record.nodeList[i].positionArray);
        this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
      }
      // setTimeout(function() {
      //   for (var i = 0; i < record.nodeList.length; i++) {
      //     that.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
      //   }
      // }, 0);
    } else if ("remove" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0; i--) {
        this.uncollapsed(record.nodeList[i].positionArray);
        this.removeNodeAt(record.nodeList[i].positionArray);
      }
      // setTimeout(function() {
      //   for (var i = 0; i < record.nodeList.length; i++) {
      //     that.removeNodeAt(record.nodeList[i].positionArray);
      //   }
      // }, 0);
    }
  }

  undo() {
    if (this.operationRecordList.cursor < 0) return;
    var record = this.operationRecordList[this.operationRecordList.cursor];
    this.operationRecordList.cursor--;
    var that = this;
    if ("insert" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0; i--) {
        this.uncollapsed(record.nodeList[i].positionArray);
        that.removeNodeAt(record.nodeList[i].positionArray);
      }
      // setTimeout(function() {
      //   for (var i = record.nodeList.length - 1; i >= 0; i--) {
      //     that.removeNodeAt(record.nodeList[i].positionArray);
      //   }
      // }, 0);
    } else if ("remove" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0; i--) {
        this.uncollapsed(record.nodeList[i].positionArray);
        that.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
      }
      // setTimeout(function() {
      //   for (var i = record.nodeList.length - 1; i >= 0; i--) {
      //     that.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
      //   }
      // }, 0);
    }
  }
}
