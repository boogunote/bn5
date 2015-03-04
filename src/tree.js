import {DataSource} from './data-source';

export class Flat{
  static inject() { return [DataSource]; }
  constructor(dataSource){
    this.dataSource = dataSource;
    // this.node = {"content" : "", "children" : []};
  }

  activate(params, queryString, routeConfig) {
    this.id = params.id;
    console.log("activate")
    console.log(params.id);
    return this.dataSource.getData(this.id)
        .then(data => {
          this.node = JSON.parse(data);
          console.log(this.node)
        }).catch(err => {
          console.log(err);
        });
  }

  attached(){
    console.log("attached")
  }
}
