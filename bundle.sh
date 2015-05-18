jspm unbundle

jspm  bundle \
      bn5/app + \
      bn5/common + \
      bn5/data-source + \
      bn5/flat + \
      bn5/login + \
      bn5/node + \
      bn5/tree-node + \
      bn5/tree-params + \
      bn5/tree + \
      bn5/utility + \
      aurelia-bootstrapper + \
      aurelia-http-client + \
      aurelia-dependency-injection + \
      aurelia-router + \
      github:aurelia/loader-default@0.5.0 + \
      npm:core-js@0.4.10 + \
      github:jspm/nodelibs-process@0.1.1 + \
      npm:process@0.10.1 + \
      github:aurelia/templating-router@0.10.0 + \
      github:aurelia/templating-router@0.10.0/index + \
      github:aurelia/templating-binding@0.9.0 + \
      github:aurelia/templating-resources@0.9.1 + \
      github:aurelia/history-browser@0.2.5 + \
      github:components/jquery@2.1.3 + \
      github:jspm/nodelibs-events@0.1.0  \
      app-bundle.js --inject --minify

mv app-bundle.js* ./dist/