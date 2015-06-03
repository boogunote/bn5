import {Behavior} from 'aurelia-framework';
import {Common} from './common'
import {DataSource} from './data-source';
import {Node} from './node';
import {Utility} from './utility';
import autosize from 'jquery-autosize';

export class TreeNode extends Node {
  static inject() { return [Common, Element, DataSource, Utility]; }
  constructor(common, element, dataSource, utility){
    super();
    this.common = common;
    this.selected = false;
    this.element = element;
    // console.log(element)
    this.dataSource = dataSource;
    this.utility = utility;
    this.ta = null;
  }

  activate(model){
     // console.log("TreeNode activate");
     // console.log(model.node_id)
    // this.node = model.node;
    this.parentVM = model.parentVM;
    this.rootVM = model.parentVM.rootVM;
    this.parentVM.addChildVM(this, model.node_id);
    this.loadNode(model.node_id, false);
    // this.loadNodeDataById(this.rootVM.file_id, model.node_id);
  }

  foldNode() {
    if (this.node && !this.node.fold) {
      // console.log("autosize-----------------------------------------------------")
      autosize(this.ta);
    }
    else {
      var evt = document.createEvent('Event');
      evt.initEvent('autosize.destroy', true, false);
      this.ta.dispatchEvent(evt);
      this.ta.style.height = '24px'; //this.ta.scrollHeight;
    }
  }

  attached() {
    // console.log("attached!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    // this.ta = this.element.children[0].children[1];
    if (this.element.children[0].children[1])
      this.ta = this.element.children[0].children[1];
    if (this.ta && this.node)
      this.foldNode();
  }

  deactivate() {
    console.log("deactivate")

  }

  detached() {
    // console.log("detached: "+this.node.content+" "+this.node.id);
    this.removeObserver(this.node.id);
    this.parentVM.removeChildVM(this);
  }

  fold() {
    this.node.fold = !this.node.fold;
    this.foldNode(this.node.fold);
    this.setNodeToServer(this.node.id);
  }

  stepIcon(direction) {
    if (direction)
      this.node.icon++;
    else
      this.node.icon--;
    if (this.node.icon > 7) this.node.icon = 0;
    if (this.node.icon < 0) this.node.icon = 7;
    this.setNodeToServer(this.node.id);
  }

  toggle() {
    // console.log("toggle")
    this.node.collapsed = !this.node.collapsed;
    this.setNodeToServer(this.node.id);
  }

  getPositionArray() {
    var positionArray = [];
    var vm = this;
    while (vm.parentVM) {
      for (var i = 0; i < vm.parentVM.node.children.length; i++) {
        if (vm.parentVM.node.children[i].id == vm.node.id) {
          positionArray.unshift(i);
          break;
        }
      };
      vm = vm.parentVM;
    }
    return positionArray;
  }

  onBlur(event) {
    this.rootVM.focusedVM = null;
  }

  onClick(event) {
    if (event.ctrlKey) {
      this.select(!this.selected);
      return true;
    }
  }

  onFocus(event) {
    this.rootVM.focusedVM = this;
  }

  onKeyDown(event) {
    if (event.ctrlKey && 192 == event.keyCode) {
      this.openSubTreeInNewWindow(this.node.id);
      return false;
    }

    return true;
  }

  onKeyUp(event) {
    var keyList = [
      {start:9, end:9},
      {start:16, end:27},
      {start:33, end:40},
      {start:144, end:145},
    ]
    var combindKeyList = [
      {key:13, alt:true, ctrl:false, shift:false},
      {key:13, alt:false, ctrl:true, shift:false},
      {key:13, alt:false, ctrl:false, shift:true},
      {key:46, alt:false, ctrl:true, shift:false},
      {key:27, alt:false, ctrl:false, shift:false},
      {key:67, alt:false, ctrl:true, shift:true},
      {key:88, alt:false, ctrl:true, shift:true},
      {key:86, alt:false, ctrl:true, shift:true},
      {key:83, alt:false, ctrl:true, shift:false},
      {key:70, alt:true, ctrl:false, shift:false},
      {key:90, alt:false, ctrl:true, shift:true},
      {key:89, alt:false, ctrl:true, shift:true},
      {key:187, alt:true, ctrl:false, shift:false},
      {key:189, alt:true, ctrl:false, shift:false}
    ]

    var needUpdate = true;
    for (var i = 0; i < keyList.length; i++) {
      if(event.keyCode >= keyList[i].start && event.keyCode <= keyList[i].end){
        needUpdate = false;
        break;
      }
    };

    if (needUpdate) {
      for (var i = 0; i < combindKeyList.length; i++) {
        if (event.keyCode == combindKeyList[i].key &&
            event.altKey == combindKeyList[i].alt &&
            event.ctrlKey == combindKeyList[i].ctrl &&
            event.shiftKey == combindKeyList[i].shift) {
          needUpdate = false;
          break;
        }
      };
    }

    if (needUpdate) {
      this.setNodeToServer(this.node.id);
    };

    return true;
  }

  resize() {
    if (!this.ta) return;
    // console.log("resize")
    var evt = document.createEvent('Event');
    evt.initEvent('autosize.update', true, false);
    this.ta.dispatchEvent(evt);
    this.ta.style.height = this.ta.scrollHeight;
  }

  select(selected) {
    this.selected = selected;
    for (var i = 0; i < this.childVMList.length; i++) {
      this.childVMList[i].select(selected);
    };
  }
}