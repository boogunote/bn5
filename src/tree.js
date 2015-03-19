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
    this.focusedVM = null;
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

  delete() {
    console.log("delete")
    var selectedVMList = this.getSelectedVMList();
    console.log(selectedVMList)
    if (0 >= selectedVMList.length && !!this.focusedVM)
      selectedVMList.push(this.focusedVM);
    console.log(selectedVMList)
    var recordNodeList = [];
    for (var i = selectedVMList.length - 1; i >= 0 ; i--) {
      var positionArray = selectedVMList[i].getPositionArray();
      var nodeRecord = {
        positionArray : positionArray,
        node : selectedVMList[i].node
      }
      recordNodeList.push(nodeRecord)
      this.removeNodeAt(positionArray);
    };
    this.record(recordNodeList, "remove");
  }

  getVMByPositionArray(positionArray) {
    var vm = this;
    for (var i = 0; i < positionArray.length; i++) {
      vm = vm.childVMList[positionArray[i]]
    };

    return vm;
  }

  getSelectedVMList() {
    console.log(this)
    var selectedVMList = [];
    var visite = function(vm) {
      if (vm.selected) {
        selectedVMList.push(vm);
      } else {
        for (var i = 0; i < vm.childVMList.length; i++) {
          visite(vm.childVMList[i])
        };
      }
    }
    visite(this);
    return selectedVMList;
  }

  insertNodeAt(positionArray, node) {
    var positionArray = JSON.parse(JSON.stringify(positionArray)); //clone object
    var insertPosition = positionArray.pop();
    var vm = this.getVMByPositionArray(positionArray);
    vm.node.children.splice(insertPosition, 0, node);
  }

  onKeyDown(event) {
    console.log(event);
    if (event.ctrlKey && 46 == event.keyCode) {
      this.delete();
      // var positionArray = this.getPositionArray();
      // var nodeRecord = {
      //   positionArray : positionArray,
      //   node : this.node
      // }
      // this.treeVM.record([nodeRecord], "remove");
      // this.treeVM.removeNodeAt(positionArray);
      return false

    } else if (83 == event.keyCode && event.ctrlKey) {
      this.treeVM.save();
      return false;
    } else if (event.ctrlKey && event.shiftKey && 90 == event.keyCode) {
      this.treeVM.undo();
      return false;
    } else if (event.ctrlKey && event.shiftKey && 89 == event.keyCode) {
      this.treeVM.redo();
      return false;
    }
    return true;
  }

  removeNodeAt(positionArray) {
    console.log("removeNodeAt:"+positionArray.toString())
    var parentPositionArray = JSON.parse(JSON.stringify(positionArray)); //clone object
    var removePosition = parentPositionArray.pop();
    var vm = this.getVMByPositionArray(positionArray);
    var parentVM = this.getVMByPositionArray(parentPositionArray);
    setTimeout(function() {
      parentVM.removeChildVM(vm);
      parentVM.node.children.splice(removePosition, 1);
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

  select(positionArray) {
    var vm = getVMByPositionArray(positionArray);
    vm.select();
  }

  redo() {
    console.log("redo")
    // console.log($scope.$operationRecordList)
    if (this.operationRecordList.cursor >= this.operationRecordList.length-1) return;

    this.operationRecordList.cursor++;
    var record = this.operationRecordList[this.operationRecordList.cursor];
    if ("insert" == record.operation) {
      for (var i = 0; i < record.nodeList.length; i++) {
        this.uncollapsed(record.nodeList[i].positionArray);
        this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
      }
    } else if ("remove" == record.operation) {
      for (var i = 0; i < record.nodeList.length; i++) {
        this.uncollapsed(record.nodeList[i].positionArray);
        this.removeNodeAt(record.nodeList[i].positionArray);
      }
    }
  }

  undo() {
    if (this.operationRecordList.cursor < 0) return;
    var record = this.operationRecordList[this.operationRecordList.cursor];
    this.operationRecordList.cursor--;
    if ("insert" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0; i--) {
        this.uncollapsed(record.nodeList[i].positionArray);
        this.removeNodeAt(record.nodeList[i].positionArray);
      }
    } else if ("remove" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0 ; i--) {
        this.uncollapsed(record.nodeList[i].positionArray);
        this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
      }
    }
  }
}
