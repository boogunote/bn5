System.register(["./bundle", "aurelia-framework", "aurelia-logging-console", "aurelia-bootstrapper"], function (_export) {
  var LogManager, ConsoleAppender, bootstrap;
  return {
    setters: [function (_bundle) {}, function (_aureliaFramework) {
      LogManager = _aureliaFramework.LogManager;
    }, function (_aureliaLoggingConsole) {
      ConsoleAppender = _aureliaLoggingConsole.ConsoleAppender;
    }, function (_aureliaBootstrapper) {
      bootstrap = _aureliaBootstrapper.bootstrap;
    }],
    execute: function () {
      "use strict";

      LogManager.addAppender(new ConsoleAppender());
      LogManager.setLevel(LogManager.levels.debug);

      bootstrap(function (aurelia) {
        aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator();

        aurelia.start().then(function (a) {
          return a.setRoot("dist/app", document.body);
        });
      });
    }
  };
});
// import the bundle file so that the bundler knows what our dependencies are
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUdRLFVBQVUsRUFDVixlQUFlLEVBQ2YsU0FBUzs7O0FBRlQsZ0JBQVUscUJBQVYsVUFBVTs7QUFDVixxQkFBZSwwQkFBZixlQUFlOztBQUNmLGVBQVMsd0JBQVQsU0FBUzs7Ozs7QUFFakIsZ0JBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxlQUFlLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLGdCQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTdDLGVBQVMsQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNuQixlQUFPLENBQUMsR0FBRyxDQUNSLHNCQUFzQixFQUFFLENBQ3hCLGdCQUFnQixFQUFFLENBQ2xCLE1BQU0sRUFBRSxDQUNSLGVBQWUsRUFBRSxDQUFDOztBQUVyQixlQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztpQkFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDO1NBQUEsQ0FBQyxDQUFDO09BQ2pFLENBQUMsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=