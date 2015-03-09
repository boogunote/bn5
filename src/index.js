import {Behavior,Parent} from 'aurelia-framework';
import {TreeParams} from './tree-params';
import {Router} from 'aurelia-router'

export class Index {
  static inject() { return [TreeParams, Parent.of(Router)]; }
  constructor(treeParams, parentRouter) {
    this.treeParams = treeParams;
    this.parentRouter = parentRouter;
  }

  open(path) {
    console.log(path);
    this.treeParams.path = path;
    // window.location.href = "#/tree/root"
    this.parentRouter.navigate('tree');
  }

  new(path) {
    console.log(path);
  }
}

export class SelectAttachedBehavior {
  static inject() { return [Element]; }
  constructor(element) {
    this.element = element;
  }

  bind(observer) {
    this.observer = observer;
    this.element.addEventListener('change', (event) => {
        this.observer[event.srcElement.id](this.element.value);
      });
  }
}
