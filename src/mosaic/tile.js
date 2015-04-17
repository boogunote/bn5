import {Utility} from '../utility';
import {Common} from '../common';
import {Node} from './node';

export class Tile extends Node{
  static inject() { return [Common, Element, Utility]; }
  constructor(common, element, utility){
    this.common = common;
    this.element = element;
    this.utility = utility;

    this.iframe_id = this.utility.getUniqueId();
  }

  activate(model){
    this.parentVM = model.parentVM;
    this.rootVM = this.parentVM.rootVM;
    this.tile = model.tile;
    this.showUrl = this.tile.url;
  }

  loadUrl() {
    this.tile.url = this.showUrl;
    // console.log($("#"+this.iframe_id))
    document.querySelector("#"+this.iframe_id).contentWindow.location.reload(true);
    // $("#"+this.iframe_id).load();
    // var position =  this.getRowAndColomeById(this.tile.id);
    // this.rootVM.fileRef
    //     .child("rows/"+position.row+"/tiles/"+position.column+"/url")
    //     .set(this.tile.url)
    this.updateTile();
  }

  out() {
    window.open(this.tile.url);
  }

  remove() {
    this.parentVM.removeTile(this.tile.id);
  }

  wider() {
    this.tile.flex += 0.1;
    this.updateTile();
  }

  smaller() {
    this.tile.flex -= 0.1;
    this.updateTile();
  }

  updateFlex() {
    var position =  this.getRowAndColomeById(this.tile.id);
    this.rootVM.fileRef
        .child("rows/"+position.row+"/tiles/"+position.column+"/flex")
        .set(this.tile.flex)
  }

  updateTile() {
    var position =  this.getRowAndColomeById(this.tile.id);
    var that = this;
    this.doEdit(function() {
      if (that.rootVM.fileRef)
        that.rootVM.fileRef
            .child("rows/"+position.row+"/tiles/"+position.column)
            .set(that.getCleanTile(that.tile));
    });
  }
}