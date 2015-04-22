System.register([], function (_export) {
  var _prototypeProperties, _classCallCheck, DataSource;

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

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      ;;

      DataSource = _export("DataSource", (function () {
        function DataSource() {
          _classCallCheck(this, DataSource);
        }

        _prototypeProperties(DataSource, null, {
          load: {
            value: function load(path) {
              console.log(path);
              return fsReadFilePromise(path);
            },
            writable: true,
            configurable: true
          },
          save: {
            value: function save(path, jsonData) {
              return fsWriteFilePromise(path, jsonData);
            },
            writable: true,
            configurable: true
          }
        });

        return DataSource;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGEtc291cmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7NkNBdUNhLFVBQVU7O0FBdEN2QixXQUFTLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDNUMsUUFBSSxPQUFPLENBQUM7QUFDWixRQUFJLE1BQU0sQ0FBQzs7QUFFWCxRQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsTUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUNoRCxVQUFJLEdBQUcsRUFBRTtBQUNQLGNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLGVBQU87T0FDUjtBQUNELGFBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUN6QixDQUFDLENBQUM7O0FBRUgsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDN0MsYUFBTyxHQUFHLFFBQVEsQ0FBQztBQUNuQixZQUFNLEdBQUcsT0FBTyxDQUFDO0tBQ2xCLENBQUMsQ0FBQztHQUNKOztBQUVELFdBQVMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzlELFFBQUksT0FBTyxDQUFDO0FBQ1osUUFBSSxNQUFNLENBQUM7O0FBRVgsUUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLE1BQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVMsR0FBRyxFQUFFLE9BQU8sRUFBRTtBQUN0RSxVQUFJLEdBQUcsRUFBRTtBQUNQLGNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLGVBQU87T0FDUjtBQUNELGFBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsQixDQUFDLENBQUM7O0FBRUgsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDN0MsYUFBTyxHQUFHLFFBQVEsQ0FBQztBQUNuQixZQUFNLEdBQUcsT0FBTyxDQUFDO0tBQ2xCLENBQUMsQ0FBQztHQUNKOzs7Ozs7Ozs7QUFuQkEsT0FBQyxBQW1CRCxDQUFDOztBQUVXLGdCQUFVO0FBQ1YsaUJBREEsVUFBVTtnQ0FBVixVQUFVO1NBRXBCOzs2QkFGVSxVQUFVO0FBSXJCLGNBQUk7bUJBQUEsY0FBQyxJQUFJLEVBQUU7QUFDVixxQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNoQixxQkFBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoQzs7OztBQUVELGNBQUk7bUJBQUEsY0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ25CLHFCQUFPLGtCQUFrQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMzQzs7Ozs7O2VBWFUsVUFBVSIsImZpbGUiOiJkYXRhLXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9