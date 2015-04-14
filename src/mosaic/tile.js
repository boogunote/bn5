import {Utility} from '../utility';
import {Common} from '../common';
import {Node} from './node';

export class Tile extends Node{
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.common = common;
    this.utility = utility;
  }

  activate(model){
    this.parentVM = model.parentVM;
    this.rootVM = this.parentVM.rootVM;
    this.tile = model.tile;
    this.showUrl = this.tile.url;
  }

  loadUrl() {
    this.tile.url = this.showUrl;
    // var position =  this.getRowAndColomeById(this.tile.id);
    // this.rootVM.fileRef
    //     .child("rows/"+position.row+"/tiles/"+position.column+"/url")
    //     .set(this.tile.url)
    this.updateTile();
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
      that.rootVM.fileRef
          .child("rows/"+position.row+"/tiles/"+position.column)
          .set(that.getCleanTile(that.tile));
    });
  }
}