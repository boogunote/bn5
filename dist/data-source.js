System.register([], function (_export) {
  var _createClass, _classCallCheck, DataSource;

  function fsReadFilePromise(filePath, options) {
    var resolve;
    var reject;

    var fs = require("fs");
    fs.readFile(filePath, options, function (err, buf) {
      if (err) {
        reject(err);
        return;
      }
      resolve(buf.toString());
    });

    return new Promise(function (_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
  }

  function fsWriteFilePromise(filePath, data, position, encoding) {
    var resolve;
    var reject;

    var fs = require("fs");
    fs.writeFile(filePath, data, position, encoding, function (err, written) {
      if (err) {
        reject(err);
        return;
      }
      resolve(written);
    });

    return new Promise(function (_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
  }return {
    setters: [],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      ;;

      DataSource = _export("DataSource", (function () {
        function DataSource() {
          _classCallCheck(this, DataSource);
        }

        _createClass(DataSource, {
          load: {
            value: function load(path) {
              console.log(path);
              return fsReadFilePromise(path);
            }
          },
          save: {
            value: function save(path, jsonData) {
              return fsWriteFilePromise(path, jsonData);
            }
          }
        });

        return DataSource;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGEtc291cmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7cUNBdUNhLFVBQVU7O0FBdEN2QixXQUFTLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDNUMsUUFBSSxPQUFPLENBQUM7QUFDWixRQUFJLE1BQU0sQ0FBQzs7QUFFWCxRQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsTUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUNoRCxVQUFJLEdBQUcsRUFBRTtBQUNQLGNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLGVBQU87T0FDUjtBQUNELGFBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUN6QixDQUFDLENBQUM7O0FBRUgsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDN0MsYUFBTyxHQUFHLFFBQVEsQ0FBQztBQUNuQixZQUFNLEdBQUcsT0FBTyxDQUFDO0tBQ2xCLENBQUMsQ0FBQztHQUNKOztBQUVELFdBQVMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzlELFFBQUksT0FBTyxDQUFDO0FBQ1osUUFBSSxNQUFNLENBQUM7O0FBRVgsUUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLE1BQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVMsR0FBRyxFQUFFLE9BQU8sRUFBRTtBQUN0RSxVQUFJLEdBQUcsRUFBRTtBQUNQLGNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLGVBQU87T0FDUjtBQUNELGFBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsQixDQUFDLENBQUM7O0FBRUgsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDN0MsYUFBTyxHQUFHLFFBQVEsQ0FBQztBQUNuQixZQUFNLEdBQUcsT0FBTyxDQUFDO0tBQ2xCLENBQUMsQ0FBQztHQUNKOzs7Ozs7Ozs7QUFuQkEsT0FBQyxBQW1CRCxDQUFDOztBQUVXLGdCQUFVO0FBQ1YsaUJBREEsVUFBVSxHQUNSO2dDQURGLFVBQVU7U0FFcEI7O3FCQUZVLFVBQVU7QUFJckIsY0FBSTttQkFBQSxjQUFDLElBQUksRUFBRTtBQUNWLHFCQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2hCLHFCQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDOztBQUVELGNBQUk7bUJBQUEsY0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ25CLHFCQUFPLGtCQUFrQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMzQzs7OztlQVhVLFVBQVUiLCJmaWxlIjoiZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==