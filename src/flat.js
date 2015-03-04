import {DataSource} from './data-source';

export class Flat{
  static inject() { return [DataSource]; }
  constructor(dataSource){
    this.dataSource = dataSource;
    // this.data = ""
  }

  activate(params, queryString, routeConfig) {
    console.log(params.id);
    var that = this;
    this.dataSource.getData(params.id)
        .then(data => {
          that.content = data;
        }).catch(err => {
          console.log(err);
        });
  }
}
