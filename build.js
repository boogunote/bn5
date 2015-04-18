"format register";
System.register("github:aurelia/route-recognizer@0.2.4/dsl", [], function(_export) {
  _export("map", map);
  function Target(path, matcher, delegate) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
  }
  function Matcher(target) {
    this.routes = {};
    this.children = {};
    this.target = target;
  }
  function generateMatch(startingPath, matcher, delegate) {
    return function(path, nestedCallback) {
      var fullPath = startingPath + path;
      if (nestedCallback) {
        nestedCallback(generateMatch(fullPath, matcher, delegate));
      } else {
        return new Target(startingPath + path, matcher, delegate);
      }
    };
  }
  function addRoute(routeArray, path, handler) {
    var len = 0;
    for (var i = 0,
        l = routeArray.length; i < l; i++) {
      len += routeArray[i].path.length;
    }
    path = path.substr(len);
    var route = {
      path: path,
      handler: handler
    };
    routeArray.push(route);
  }
  function eachRoute(baseRoute, matcher, callback, binding) {
    var routes = matcher.routes;
    for (var path in routes) {
      if (routes.hasOwnProperty(path)) {
        var routeArray = baseRoute.slice();
        addRoute(routeArray, path, routes[path]);
        if (matcher.children[path]) {
          eachRoute(routeArray, matcher.children[path], callback, binding);
        } else {
          callback.call(binding, routeArray);
        }
      }
    }
  }
  function map(callback, addRouteCallback) {
    var matcher = new Matcher();
    callback(generateMatch("", matcher, this.delegate));
    eachRoute([], matcher, function(route) {
      if (addRouteCallback) {
        addRouteCallback(this, route);
      } else {
        this.add(route);
      }
    }, this);
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      Target.prototype = {to: function to(target, callback) {
          var delegate = this.delegate;
          if (delegate && delegate.willAddRoute) {
            target = delegate.willAddRoute(this.matcher.target, target);
          }
          this.matcher.add(this.path, target);
          if (callback) {
            if (callback.length === 0) {
              throw new Error("You must have an argument in the function passed to `to`");
            }
            this.matcher.addChild(this.path, target, callback, this.delegate);
          }
          return this;
        }};
      Matcher.prototype = {
        add: function add(path, handler) {
          this.routes[path] = handler;
        },
        addChild: function addChild(path, target, callback, delegate) {
          var matcher = new Matcher(target);
          this.children[path] = matcher;
          var match = generateMatch(path, matcher, delegate);
          if (delegate && delegate.contextEntered) {
            delegate.contextEntered(target, match);
          }
          callback(match);
        }
      };
    }
  };
});

System.register("github:aurelia/path@0.4.6/index", [], function(_export) {
  var r20,
      rbracket,
      class2type;
  _export("relativeToFile", relativeToFile);
  _export("join", join);
  _export("buildQueryString", buildQueryString);
  function trimDots(ary) {
    var i,
        part;
    for (i = 0; i < ary.length; ++i) {
      part = ary[i];
      if (part === ".") {
        ary.splice(i, 1);
        i -= 1;
      } else if (part === "..") {
        if (i === 0 || i == 1 && ary[2] === ".." || ary[i - 1] === "..") {
          continue;
        } else if (i > 0) {
          ary.splice(i - 1, 2);
          i -= 2;
        }
      }
    }
  }
  function relativeToFile(name, file) {
    var lastIndex,
        normalizedBaseParts,
        fileParts = file && file.split("/");
    name = name.trim();
    name = name.split("/");
    if (name[0].charAt(0) === "." && fileParts) {
      normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
      name = normalizedBaseParts.concat(name);
    }
    trimDots(name);
    return name.join("/");
  }
  function join(path1, path2) {
    var url1,
        url2,
        url3,
        i,
        ii,
        urlPrefix;
    if (!path1) {
      return path2;
    }
    if (!path2) {
      return path1;
    }
    urlPrefix = path1.indexOf("//") === 0 ? "//" : path1.indexOf("/") === 0 ? "/" : "";
    url1 = path1.split("/");
    url2 = path2.split("/");
    url3 = [];
    for (i = 0, ii = url1.length; i < ii; ++i) {
      if (url1[i] == "..") {
        url3.pop();
      } else if (url1[i] == "." || url1[i] == "") {
        continue;
      } else {
        url3.push(url1[i]);
      }
    }
    for (i = 0, ii = url2.length; i < ii; ++i) {
      if (url2[i] == "..") {
        url3.pop();
      } else if (url2[i] == "." || url2[i] == "") {
        continue;
      } else {
        url3.push(url2[i]);
      }
    }
    return urlPrefix + url3.join("/").replace(/\:\//g, "://");
    ;
  }
  function type(obj) {
    if (obj == null) {
      return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
  }
  function buildQueryString(a, traditional) {
    var prefix,
        s = [],
        add = function add(key, value) {
          value = typeof value === "function" ? value() : value == null ? "" : value;
          s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
    for (prefix in a) {
      _buildQueryString(prefix, a[prefix], traditional, add);
    }
    return s.join("&").replace(r20, "+");
  }
  function _buildQueryString(prefix, obj, traditional, add) {
    var name;
    if (Array.isArray(obj)) {
      obj.forEach(function(v, i) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          _buildQueryString(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
        }
      });
    } else if (!traditional && type(obj) === "object") {
      for (name in obj) {
        _buildQueryString(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      r20 = /%20/g;
      rbracket = /\[\]$/;
      class2type = {};
      "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name, i) {
        class2type["[object " + name + "]"] = name.toLowerCase();
      });
    }
  };
});

System.register("github:aurelia/router@0.6.0/navigation-commands", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      Redirect;
  _export("isNavigationCommand", isNavigationCommand);
  function isNavigationCommand(obj) {
    return obj && typeof obj.navigate === "function";
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Redirect = _export("Redirect", (function() {
        function Redirect(url, options) {
          _classCallCheck(this, Redirect);
          this.url = url;
          this.options = Object.assign({
            trigger: true,
            replace: true
          }, options || {});
          this.shouldContinueProcessing = false;
        }
        _prototypeProperties(Redirect, null, {
          setRouter: {
            value: function setRouter(router) {
              this.router = router;
            },
            writable: true,
            configurable: true
          },
          navigate: {
            value: function navigate(appRouter) {
              var navigatingRouter = this.options.useAppRouter ? appRouter : this.router || appRouter;
              navigatingRouter.navigate(this.url, this.options);
            },
            writable: true,
            configurable: true
          }
        });
        return Redirect;
      })());
    }
  };
});

System.register("github:aurelia/router@0.6.0/navigation-instruction", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      NavigationInstruction;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      NavigationInstruction = _export("NavigationInstruction", (function() {
        function NavigationInstruction(fragment, queryString, params, queryParams, config, parentInstruction) {
          _classCallCheck(this, NavigationInstruction);
          this.fragment = fragment;
          this.queryString = queryString;
          this.params = params || {};
          this.queryParams = queryParams;
          this.config = config;
          this.lifecycleArgs = [params, queryParams, config, this];
          this.viewPortInstructions = {};
          if (parentInstruction) {
            this.params.$parent = parentInstruction.params;
          }
        }
        _prototypeProperties(NavigationInstruction, null, {
          addViewPortInstruction: {
            value: function addViewPortInstruction(viewPortName, strategy, moduleId, component) {
              return this.viewPortInstructions[viewPortName] = {
                name: viewPortName,
                strategy: strategy,
                moduleId: moduleId,
                component: component,
                childRouter: component.executionContext.router,
                lifecycleArgs: this.lifecycleArgs.slice()
              };
            },
            writable: true,
            configurable: true
          },
          getWildCardName: {
            value: function getWildCardName() {
              var wildcardIndex = this.config.route.lastIndexOf("*");
              return this.config.route.substr(wildcardIndex + 1);
            },
            writable: true,
            configurable: true
          },
          getWildcardPath: {
            value: function getWildcardPath() {
              var wildcardName = this.getWildCardName(),
                  path = this.params[wildcardName];
              if (this.queryString) {
                path += "?" + this.queryString;
              }
              return path;
            },
            writable: true,
            configurable: true
          },
          getBaseUrl: {
            value: function getBaseUrl() {
              if (!this.params) {
                return this.fragment;
              }
              var wildcardName = this.getWildCardName(),
                  path = this.params[wildcardName];
              if (!path) {
                return this.fragment;
              }
              return this.fragment.substr(0, this.fragment.lastIndexOf(path));
            },
            writable: true,
            configurable: true
          }
        });
        return NavigationInstruction;
      })());
    }
  };
});

System.register("github:aurelia/metadata@0.3.4/origin", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      originStorage,
      Origin;
  function ensureType(value) {
    if (value instanceof Origin) {
      return value;
    }
    return new Origin(value);
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      originStorage = new Map();
      Origin = _export("Origin", (function() {
        function Origin(moduleId, moduleMember) {
          _classCallCheck(this, Origin);
          this.moduleId = moduleId;
          this.moduleMember = moduleMember;
        }
        _prototypeProperties(Origin, {
          get: {
            value: function get(fn) {
              var origin = originStorage.get(fn);
              if (origin !== undefined) {
                return origin;
              }
              if (typeof fn.origin === "function") {
                originStorage.set(fn, origin = ensureType(fn.origin()));
              } else if (fn.origin !== undefined) {
                originStorage.set(fn, origin = ensureType(fn.origin));
              }
              return origin;
            },
            writable: true,
            configurable: true
          },
          set: {
            value: function set(fn, origin) {
              if (Origin.get(fn) === undefined) {
                originStorage.set(fn, origin);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return Origin;
      })());
    }
  };
});

System.register("github:aurelia/metadata@0.3.4/resource-type", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      ResourceType;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ResourceType = _export("ResourceType", (function() {
        function ResourceType() {
          _classCallCheck(this, ResourceType);
        }
        _prototypeProperties(ResourceType, null, {
          load: {
            value: function load(container, target) {
              return this;
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              throw new Error("All descendents of \"ResourceType\" must implement the \"register\" method.");
            },
            writable: true,
            configurable: true
          }
        });
        return ResourceType;
      })());
    }
  };
});

System.register("github:aurelia/metadata@0.3.4/metadata", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      functionMetadataStorage,
      emptyArray,
      locateFunctionMetadataElsewhere,
      MetadataStorage,
      Metadata;
  function normalize(metadata, fn, replace) {
    if (metadata instanceof MetadataStorage) {
      if (replace) {
        fn.metadata = function() {
          return metadata;
        };
      }
      metadata.owner = fn;
      return metadata;
    }
    if (Array.isArray(metadata)) {
      return new MetadataStorage(metadata, fn);
    }
    throw new Error("Incorrect metadata format for " + metadata + ".");
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      functionMetadataStorage = new Map();
      emptyArray = Object.freeze([]);
      MetadataStorage = (function() {
        function MetadataStorage(metadata, owner) {
          _classCallCheck(this, MetadataStorage);
          this.metadata = metadata;
          this.owner = owner;
        }
        _prototypeProperties(MetadataStorage, null, {
          first: {
            value: function first(type, searchPrototype) {
              var metadata = this.metadata,
                  i,
                  ii,
                  potential;
              if (metadata === undefined || metadata.length === 0) {
                if (searchPrototype && this.owner !== undefined) {
                  return Metadata.on(Object.getPrototypeOf(this.owner)).first(type, searchPrototype);
                }
                return null;
              }
              for (i = 0, ii = metadata.length; i < ii; ++i) {
                potential = metadata[i];
                if (potential instanceof type) {
                  return potential;
                }
              }
              if (searchPrototype && this.owner !== undefined) {
                return Metadata.on(Object.getPrototypeOf(this.owner)).first(type, searchPrototype);
              }
              return null;
            },
            writable: true,
            configurable: true
          },
          has: {
            value: function has(type, searchPrototype) {
              return this.first(type, searchPrototype) !== null;
            },
            writable: true,
            configurable: true
          },
          all: {
            value: function all(type, searchPrototype) {
              var metadata = this.metadata,
                  i,
                  ii,
                  found,
                  potential;
              if (metadata === undefined || metadata.length === 0) {
                if (searchPrototype && this.owner !== undefined) {
                  return Metadata.on(Object.getPrototypeOf(this.owner)).all(type, searchPrototype);
                }
                return emptyArray;
              }
              found = [];
              for (i = 0, ii = metadata.length; i < ii; ++i) {
                potential = metadata[i];
                if (potential instanceof type) {
                  found.push(potential);
                }
              }
              if (searchPrototype && this.owner !== undefined) {
                found = found.concat(Metadata.on(Object.getPrototypeOf(this.owner)).all(type, searchPrototype));
              }
              return found;
            },
            writable: true,
            configurable: true
          },
          add: {
            value: function add(instance) {
              if (this.metadata === undefined) {
                this.metadata = [];
              }
              this.last = instance;
              this.metadata.push(instance);
              return this;
            },
            writable: true,
            configurable: true
          },
          and: {
            value: function and(func) {
              func(this.last);
              return this;
            },
            writable: true,
            configurable: true
          }
        });
        return MetadataStorage;
      })();
      MetadataStorage.empty = Object.freeze(new MetadataStorage());
      Metadata = _export("Metadata", {
        on: function on(owner) {
          var metadata;
          if (!owner) {
            return MetadataStorage.empty;
          }
          metadata = functionMetadataStorage.get(owner);
          if (metadata === undefined) {
            if ("metadata" in owner) {
              if (typeof owner.metadata === "function") {
                functionMetadataStorage.set(owner, metadata = normalize(owner.metadata(), owner, true));
              } else {
                functionMetadataStorage.set(owner, metadata = normalize(owner.metadata, owner));
              }
            } else if (locateFunctionMetadataElsewhere !== undefined) {
              metadata = locateFunctionMetadataElsewhere(owner);
              if (metadata === undefined) {
                functionMetadataStorage.set(owner, metadata = new MetadataStorage(undefined, owner));
              } else {
                functionMetadataStorage.set(owner, metadata = normalize(metadata, owner));
              }
            } else {
              functionMetadataStorage.set(owner, metadata = new MetadataStorage(undefined, owner));
            }
          }
          return metadata;
        },
        add: function add(instance) {
          var storage = new MetadataStorage([]);
          return storage.add(instance);
        },
        configure: {
          location: function location(staticPropertyName) {
            this.locator(function(fn) {
              return fn[staticPropertyName];
            });
          },
          locator: function locator(loc) {
            if (locateFunctionMetadataElsewhere === undefined) {
              locateFunctionMetadataElsewhere = loc;
              return ;
            }
            var original = locateFunctionMetadataElsewhere;
            locateFunctionMetadataElsewhere = function(fn) {
              return original(fn) || loc(fn);
            };
          },
          classHelper: function classHelper(name, fn) {
            MetadataStorage.prototype[name] = function() {
              var context = Object.create(fn.prototype);
              var metadata = fn.apply(context, arguments) || context;
              this.add(metadata);
              return this;
            };
            Metadata[name] = function() {
              var storage = new MetadataStorage([]);
              return storage[name].apply(storage, arguments);
            };
          },
          functionHelper: function functionHelper(name, fn) {
            MetadataStorage.prototype[name] = function() {
              fn.apply(this, arguments);
              return this;
            };
            Metadata[name] = function() {
              var storage = new MetadataStorage([]);
              return storage[name].apply(storage, arguments);
            };
          }
        }
      });
    }
  };
});

System.register("github:aurelia/dependency-injection@0.5.0/metadata", [], function(_export) {
  var _inherits,
      _prototypeProperties,
      _classCallCheck,
      Registration,
      Transient,
      Singleton,
      Resolver,
      Lazy,
      All,
      Optional,
      Parent,
      Factory;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Registration = _export("Registration", (function() {
        function Registration() {
          _classCallCheck(this, Registration);
        }
        _prototypeProperties(Registration, null, {register: {
            value: function register(container, key, fn) {
              throw new Error("A custom Registration must implement register(container, key, fn).");
            },
            writable: true,
            configurable: true
          }});
        return Registration;
      })());
      Transient = _export("Transient", (function(Registration) {
        function Transient(key) {
          _classCallCheck(this, Transient);
          this.key = key;
        }
        _inherits(Transient, Registration);
        _prototypeProperties(Transient, null, {register: {
            value: function register(container, key, fn) {
              container.registerTransient(this.key || key, fn);
            },
            writable: true,
            configurable: true
          }});
        return Transient;
      })(Registration));
      Singleton = _export("Singleton", (function(Registration) {
        function Singleton(keyOrRegisterInChild) {
          var registerInChild = arguments[1] === undefined ? false : arguments[1];
          _classCallCheck(this, Singleton);
          if (typeof keyOrRegisterInChild === "boolean") {
            this.registerInChild = keyOrRegisterInChild;
          } else {
            this.key = keyOrRegisterInChild;
            this.registerInChild = registerInChild;
          }
        }
        _inherits(Singleton, Registration);
        _prototypeProperties(Singleton, null, {register: {
            value: function register(container, key, fn) {
              var destination = this.registerInChild ? container : container.root;
              destination.registerSingleton(this.key || key, fn);
            },
            writable: true,
            configurable: true
          }});
        return Singleton;
      })(Registration));
      Resolver = _export("Resolver", (function() {
        function Resolver() {
          _classCallCheck(this, Resolver);
        }
        _prototypeProperties(Resolver, null, {get: {
            value: function get(container) {
              throw new Error("A custom Resolver must implement get(container) and return the resolved instance(s).");
            },
            writable: true,
            configurable: true
          }});
        return Resolver;
      })());
      Lazy = _export("Lazy", (function(Resolver) {
        function Lazy(key) {
          _classCallCheck(this, Lazy);
          this.key = key;
        }
        _inherits(Lazy, Resolver);
        _prototypeProperties(Lazy, {of: {
            value: function of(key) {
              return new Lazy(key);
            },
            writable: true,
            configurable: true
          }}, {get: {
            value: function get(container) {
              var _this = this;
              return function() {
                return container.get(_this.key);
              };
            },
            writable: true,
            configurable: true
          }});
        return Lazy;
      })(Resolver));
      All = _export("All", (function(Resolver) {
        function All(key) {
          _classCallCheck(this, All);
          this.key = key;
        }
        _inherits(All, Resolver);
        _prototypeProperties(All, {of: {
            value: function of(key) {
              return new All(key);
            },
            writable: true,
            configurable: true
          }}, {get: {
            value: function get(container) {
              return container.getAll(this.key);
            },
            writable: true,
            configurable: true
          }});
        return All;
      })(Resolver));
      Optional = _export("Optional", (function(Resolver) {
        function Optional(key) {
          var checkParent = arguments[1] === undefined ? false : arguments[1];
          _classCallCheck(this, Optional);
          this.key = key;
          this.checkParent = checkParent;
        }
        _inherits(Optional, Resolver);
        _prototypeProperties(Optional, {of: {
            value: function of(key) {
              var checkParent = arguments[1] === undefined ? false : arguments[1];
              return new Optional(key, checkParent);
            },
            writable: true,
            configurable: true
          }}, {get: {
            value: function get(container) {
              if (container.hasHandler(this.key, this.checkParent)) {
                return container.get(this.key);
              }
              return null;
            },
            writable: true,
            configurable: true
          }});
        return Optional;
      })(Resolver));
      Parent = _export("Parent", (function(Resolver) {
        function Parent(key) {
          _classCallCheck(this, Parent);
          this.key = key;
        }
        _inherits(Parent, Resolver);
        _prototypeProperties(Parent, {of: {
            value: function of(key) {
              return new Parent(key);
            },
            writable: true,
            configurable: true
          }}, {get: {
            value: function get(container) {
              return container.parent ? container.parent.get(this.key) : null;
            },
            writable: true,
            configurable: true
          }});
        return Parent;
      })(Resolver));
      Factory = _export("Factory", function Factory() {
        _classCallCheck(this, Factory);
      });
    }
  };
});

System.register("github:aurelia/logging@0.2.6/index", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      levels,
      loggers,
      logLevel,
      appenders,
      slice,
      loggerConstructionKey,
      Logger;
  _export("AggregateError", AggregateError);
  _export("getLogger", getLogger);
  _export("addAppender", addAppender);
  _export("setLevel", setLevel);
  function AggregateError(msg, inner) {
    if (inner && inner.stack) {
      msg += "\n------------------------------------------------\ninner error: " + inner.stack;
    }
    var err = new Error(msg);
    if (inner) {
      err.innerError = inner;
    }
    return err;
  }
  function log(logger, level, args) {
    var i = appenders.length,
        current;
    args = slice.call(args);
    args.unshift(logger);
    while (i--) {
      current = appenders[i];
      current[level].apply(current, args);
    }
  }
  function debug() {
    if (logLevel < 4) {
      return ;
    }
    log(this, "debug", arguments);
  }
  function info() {
    if (logLevel < 3) {
      return ;
    }
    log(this, "info", arguments);
  }
  function warn() {
    if (logLevel < 2) {
      return ;
    }
    log(this, "warn", arguments);
  }
  function error() {
    if (logLevel < 1) {
      return ;
    }
    log(this, "error", arguments);
  }
  function connectLogger(logger) {
    logger.debug = debug;
    logger.info = info;
    logger.warn = warn;
    logger.error = error;
  }
  function createLogger(id) {
    var logger = new Logger(id, loggerConstructionKey);
    if (appenders.length) {
      connectLogger(logger);
    }
    return logger;
  }
  function getLogger(id) {
    return loggers[id] || (loggers[id] = createLogger(id));
  }
  function addAppender(appender) {
    appenders.push(appender);
    if (appenders.length === 1) {
      for (var key in loggers) {
        connectLogger(loggers[key]);
      }
    }
  }
  function setLevel(level) {
    logLevel = level;
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      levels = _export("levels", {
        none: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
      });
      loggers = {};
      logLevel = levels.none;
      appenders = [];
      slice = Array.prototype.slice;
      loggerConstructionKey = {};
      Logger = _export("Logger", (function() {
        function Logger(id, key) {
          _classCallCheck(this, Logger);
          if (key !== loggerConstructionKey) {
            throw new Error("You cannot instantiate \"Logger\". Use the \"getLogger\" API instead.");
          }
          this.id = id;
        }
        _prototypeProperties(Logger, null, {
          debug: {
            value: function debug() {},
            writable: true,
            configurable: true
          },
          info: {
            value: function info() {},
            writable: true,
            configurable: true
          },
          warn: {
            value: function warn() {},
            writable: true,
            configurable: true
          },
          error: {
            value: function error() {},
            writable: true,
            configurable: true
          }
        });
        return Logger;
      })());
    }
  };
});

System.register("github:aurelia/router@0.6.0/util", [], function(_export) {
  _export("processPotential", processPotential);
  function processPotential(obj, resolve, reject) {
    if (obj && typeof obj.then === "function") {
      var dfd = obj.then(resolve);
      if (typeof dfd["catch"] === "function") {
        return dfd["catch"](reject);
      } else if (typeof dfd.fail === "function") {
        return dfd.fail(reject);
      }
      return dfd;
    } else {
      try {
        return resolve(obj);
      } catch (error) {
        return reject(error);
      }
    }
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
    }
  };
});

System.register("github:aurelia/history@0.2.4/index", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      History;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      History = _export("History", (function() {
        function History() {
          _classCallCheck(this, History);
        }
        _prototypeProperties(History, null, {
          activate: {
            value: function activate() {
              throw new Error("History must implement activate().");
            },
            writable: true,
            configurable: true
          },
          deactivate: {
            value: function deactivate() {
              throw new Error("History must implement deactivate().");
            },
            writable: true,
            configurable: true
          },
          navigate: {
            value: function navigate() {
              throw new Error("History must implement navigate().");
            },
            writable: true,
            configurable: true
          },
          navigateBack: {
            value: function navigateBack() {
              throw new Error("History must implement navigateBack().");
            },
            writable: true,
            configurable: true
          }
        });
        return History;
      })());
    }
  };
});

System.register("github:aurelia/router@0.6.0/pipeline", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      COMPLETED,
      CANCELLED,
      REJECTED,
      RUNNING,
      Pipeline;
  function createResult(ctx, next) {
    return {
      status: next.status,
      context: ctx,
      output: next.output,
      completed: next.status == COMPLETED
    };
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      COMPLETED = _export("COMPLETED", "completed");
      CANCELLED = _export("CANCELLED", "cancelled");
      REJECTED = _export("REJECTED", "rejected");
      RUNNING = _export("RUNNING", "running");
      Pipeline = _export("Pipeline", (function() {
        function Pipeline() {
          _classCallCheck(this, Pipeline);
          this.steps = [];
        }
        _prototypeProperties(Pipeline, null, {
          withStep: {
            value: function withStep(step) {
              var run,
                  steps,
                  i,
                  l;
              if (typeof step == "function") {
                run = step;
              } else if (step.isMultiStep) {
                steps = step.getSteps();
                for (i = 0, l = steps.length; i < l; i++) {
                  this.withStep(steps[i]);
                }
                return this;
              } else {
                run = step.run.bind(step);
              }
              this.steps.push(run);
              return this;
            },
            writable: true,
            configurable: true
          },
          run: {
            value: function run(ctx) {
              var index = -1,
                  steps = this.steps,
                  next,
                  currentStep;
              next = function() {
                index++;
                if (index < steps.length) {
                  currentStep = steps[index];
                  try {
                    return currentStep(ctx, next);
                  } catch (e) {
                    return next.reject(e);
                  }
                } else {
                  return next.complete();
                }
              };
              next.complete = function(output) {
                next.status = COMPLETED;
                next.output = output;
                return Promise.resolve(createResult(ctx, next));
              };
              next.cancel = function(reason) {
                next.status = CANCELLED;
                next.output = reason;
                return Promise.resolve(createResult(ctx, next));
              };
              next.reject = function(error) {
                next.status = REJECTED;
                next.output = error;
                return Promise.reject(createResult(ctx, next));
              };
              next.status = RUNNING;
              return next();
            },
            writable: true,
            configurable: true
          }
        });
        return Pipeline;
      })());
    }
  };
});

System.register("github:aurelia/router@0.6.0/model-binding", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      ApplyModelBindersStep;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ApplyModelBindersStep = _export("ApplyModelBindersStep", (function() {
        function ApplyModelBindersStep() {
          _classCallCheck(this, ApplyModelBindersStep);
        }
        _prototypeProperties(ApplyModelBindersStep, null, {run: {
            value: function run(navigationContext, next) {
              return next();
            },
            writable: true,
            configurable: true
          }});
        return ApplyModelBindersStep;
      })());
    }
  };
});

System.register("github:aurelia/router@0.6.0/route-loading", ["github:aurelia/router@0.6.0/navigation-plan"], function(_export) {
  var REPLACE,
      buildNavigationPlan,
      _toConsumableArray,
      _prototypeProperties,
      _classCallCheck,
      RouteLoader,
      LoadRouteStep;
  _export("loadNewRoute", loadNewRoute);
  function loadNewRoute(routers, routeLoader, navigationContext) {
    var toLoad = determineWhatToLoad(navigationContext);
    var loadPromises = toLoad.map(function(current) {
      return loadRoute(routers, routeLoader, current.navigationContext, current.viewPortPlan);
    });
    return Promise.all(loadPromises);
  }
  function determineWhatToLoad(navigationContext, toLoad) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;
    toLoad = toLoad || [];
    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];
      if (viewPortPlan.strategy == REPLACE) {
        toLoad.push({
          viewPortPlan: viewPortPlan,
          navigationContext: navigationContext
        });
        if (viewPortPlan.childNavigationContext) {
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      } else {
        var viewPortInstruction = next.addViewPortInstruction(viewPortName, viewPortPlan.strategy, viewPortPlan.prevModuleId, viewPortPlan.prevComponent);
        if (viewPortPlan.childNavigationContext) {
          viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      }
    }
    return toLoad;
  }
  function loadRoute(routers, routeLoader, navigationContext, viewPortPlan) {
    var moduleId = viewPortPlan.config.moduleId;
    var next = navigationContext.nextInstruction;
    routers.push(navigationContext.router);
    return loadComponent(routeLoader, navigationContext, viewPortPlan.config).then(function(component) {
      var viewPortInstruction = next.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, moduleId, component);
      var controller = component.executionContext;
      if (controller.router && controller.router.isConfigured && routers.indexOf(controller.router) === -1) {
        var path = next.getWildcardPath();
        return controller.router.createNavigationInstruction(path, next).then(function(childInstruction) {
          viewPortPlan.childNavigationContext = controller.router.createNavigationContext(childInstruction);
          return buildNavigationPlan(viewPortPlan.childNavigationContext).then(function(childPlan) {
            viewPortPlan.childNavigationContext.plan = childPlan;
            viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
            return loadNewRoute(routers, routeLoader, viewPortPlan.childNavigationContext);
          });
        });
      }
    });
  }
  function loadComponent(routeLoader, navigationContext, config) {
    var router = navigationContext.router,
        lifecycleArgs = navigationContext.nextInstruction.lifecycleArgs;
    return routeLoader.loadRoute(router, config).then(function(component) {
      if ("configureRouter" in component.executionContext) {
        var _component$executionContext;
        var result = (_component$executionContext = component.executionContext).configureRouter.apply(_component$executionContext, _toConsumableArray(lifecycleArgs)) || Promise.resolve();
        return result.then(function() {
          return component;
        });
      }
      component.router = router;
      component.config = config;
      return component;
    });
  }
  return {
    setters: [function(_navigationPlan) {
      REPLACE = _navigationPlan.REPLACE;
      buildNavigationPlan = _navigationPlan.buildNavigationPlan;
    }],
    execute: function() {
      "use strict";
      _toConsumableArray = function(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0,
              arr2 = Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i];
          return arr2;
        } else {
          return Array.from(arr);
        }
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      RouteLoader = _export("RouteLoader", (function() {
        function RouteLoader() {
          _classCallCheck(this, RouteLoader);
        }
        _prototypeProperties(RouteLoader, null, {loadRoute: {
            value: function loadRoute(router, config) {
              throw Error("Route loaders must implment \"loadRoute(router, config)\".");
            },
            writable: true,
            configurable: true
          }});
        return RouteLoader;
      })());
      LoadRouteStep = _export("LoadRouteStep", (function() {
        function LoadRouteStep(routeLoader) {
          _classCallCheck(this, LoadRouteStep);
          this.routeLoader = routeLoader;
        }
        _prototypeProperties(LoadRouteStep, {inject: {
            value: function inject() {
              return [RouteLoader];
            },
            writable: true,
            configurable: true
          }}, {run: {
            value: function run(navigationContext, next) {
              return loadNewRoute([], this.routeLoader, navigationContext).then(next)["catch"](next.cancel);
            },
            writable: true,
            configurable: true
          }});
        return LoadRouteStep;
      })());
    }
  };
});

System.register("github:aurelia/router@0.6.0/activation", ["github:aurelia/router@0.6.0/navigation-plan", "github:aurelia/router@0.6.0/navigation-commands", "github:aurelia/router@0.6.0/util"], function(_export) {
  var INVOKE_LIFECYCLE,
      REPLACE,
      isNavigationCommand,
      processPotential,
      _toConsumableArray,
      _prototypeProperties,
      _classCallCheck,
      affirmations,
      CanDeactivatePreviousStep,
      CanActivateNextStep,
      DeactivatePreviousStep,
      ActivateNextStep;
  function processDeactivatable(plan, callbackName, next, ignoreResult) {
    var infos = findDeactivatable(plan, callbackName),
        i = infos.length;
    function inspect(val) {
      if (ignoreResult || shouldContinue(val)) {
        return iterate();
      } else {
        return next.cancel(val);
      }
    }
    function iterate() {
      if (i--) {
        try {
          var controller = infos[i];
          var result = controller[callbackName]();
          return processPotential(result, inspect, next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      } else {
        return next();
      }
    }
    return iterate();
  }
  function findDeactivatable(plan, callbackName, list) {
    list = list || [];
    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];
      var prevComponent = viewPortPlan.prevComponent;
      if ((viewPortPlan.strategy == INVOKE_LIFECYCLE || viewPortPlan.strategy == REPLACE) && prevComponent) {
        var controller = prevComponent.executionContext;
        if (callbackName in controller) {
          list.push(controller);
        }
      }
      if (viewPortPlan.childNavigationContext) {
        findDeactivatable(viewPortPlan.childNavigationContext.plan, callbackName, list);
      } else if (prevComponent) {
        addPreviousDeactivatable(prevComponent, callbackName, list);
      }
    }
    return list;
  }
  function addPreviousDeactivatable(component, callbackName, list) {
    var controller = component.executionContext;
    if (controller.router && controller.router.currentInstruction) {
      var viewPortInstructions = controller.router.currentInstruction.viewPortInstructions;
      for (var viewPortName in viewPortInstructions) {
        var viewPortInstruction = viewPortInstructions[viewPortName];
        var prevComponent = viewPortInstruction.component;
        var prevController = prevComponent.executionContext;
        if (callbackName in prevController) {
          list.push(prevController);
        }
        addPreviousDeactivatable(prevComponent, callbackName, list);
      }
    }
  }
  function processActivatable(navigationContext, callbackName, next, ignoreResult) {
    var infos = findActivatable(navigationContext, callbackName),
        length = infos.length,
        i = -1;
    function inspect(val, router) {
      if (ignoreResult || shouldContinue(val, router)) {
        return iterate();
      } else {
        return next.cancel(val);
      }
    }
    function iterate() {
      i++;
      if (i < length) {
        try {
          var _current$controller;
          var current = infos[i];
          var result = (_current$controller = current.controller)[callbackName].apply(_current$controller, _toConsumableArray(current.lifecycleArgs));
          return processPotential(result, function(val) {
            return inspect(val, current.router);
          }, next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      } else {
        return next();
      }
    }
    return iterate();
  }
  function findActivatable(navigationContext, callbackName, list, router) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;
    list = list || [];
    Object.keys(plan).filter(function(viewPortName) {
      var viewPortPlan = plan[viewPortName];
      var viewPortInstruction = next.viewPortInstructions[viewPortName];
      var controller = viewPortInstruction.component.executionContext;
      if ((viewPortPlan.strategy === INVOKE_LIFECYCLE || viewPortPlan.strategy === REPLACE) && callbackName in controller) {
        list.push({
          controller: controller,
          lifecycleArgs: viewPortInstruction.lifecycleArgs,
          router: router
        });
      }
      if (viewPortPlan.childNavigationContext) {
        findActivatable(viewPortPlan.childNavigationContext, callbackName, list, controller.router || router);
      }
    });
    return list;
  }
  function shouldContinue(output, router) {
    if (output instanceof Error) {
      return false;
    }
    if (isNavigationCommand(output)) {
      if (typeof output.setRouter === "function") {
        output.setRouter(router);
      }
      return !!output.shouldContinueProcessing;
    }
    if (typeof output === "string") {
      return affirmations.indexOf(value.toLowerCase()) !== -1;
    }
    if (typeof output === "undefined") {
      return true;
    }
    return output;
  }
  return {
    setters: [function(_navigationPlan) {
      INVOKE_LIFECYCLE = _navigationPlan.INVOKE_LIFECYCLE;
      REPLACE = _navigationPlan.REPLACE;
    }, function(_navigationCommands) {
      isNavigationCommand = _navigationCommands.isNavigationCommand;
    }, function(_util) {
      processPotential = _util.processPotential;
    }],
    execute: function() {
      "use strict";
      _toConsumableArray = function(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0,
              arr2 = Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i];
          return arr2;
        } else {
          return Array.from(arr);
        }
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      affirmations = _export("affirmations", ["yes", "ok", "true"]);
      CanDeactivatePreviousStep = _export("CanDeactivatePreviousStep", (function() {
        function CanDeactivatePreviousStep() {
          _classCallCheck(this, CanDeactivatePreviousStep);
        }
        _prototypeProperties(CanDeactivatePreviousStep, null, {run: {
            value: function run(navigationContext, next) {
              return processDeactivatable(navigationContext.plan, "canDeactivate", next);
            },
            writable: true,
            configurable: true
          }});
        return CanDeactivatePreviousStep;
      })());
      CanActivateNextStep = _export("CanActivateNextStep", (function() {
        function CanActivateNextStep() {
          _classCallCheck(this, CanActivateNextStep);
        }
        _prototypeProperties(CanActivateNextStep, null, {run: {
            value: function run(navigationContext, next) {
              return processActivatable(navigationContext, "canActivate", next);
            },
            writable: true,
            configurable: true
          }});
        return CanActivateNextStep;
      })());
      DeactivatePreviousStep = _export("DeactivatePreviousStep", (function() {
        function DeactivatePreviousStep() {
          _classCallCheck(this, DeactivatePreviousStep);
        }
        _prototypeProperties(DeactivatePreviousStep, null, {run: {
            value: function run(navigationContext, next) {
              return processDeactivatable(navigationContext.plan, "deactivate", next, true);
            },
            writable: true,
            configurable: true
          }});
        return DeactivatePreviousStep;
      })());
      ActivateNextStep = _export("ActivateNextStep", (function() {
        function ActivateNextStep() {
          _classCallCheck(this, ActivateNextStep);
        }
        _prototypeProperties(ActivateNextStep, null, {run: {
            value: function run(navigationContext, next) {
              return processActivatable(navigationContext, "activate", next, true);
            },
            writable: true,
            configurable: true
          }});
        return ActivateNextStep;
      })());
    }
  };
});

System.register("github:aurelia/event-aggregator@0.2.4/index", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      Handler,
      EventAggregator;
  _export("includeEventsIn", includeEventsIn);
  _export("install", install);
  function includeEventsIn(obj) {
    var ea = new EventAggregator();
    obj.subscribe = function(event, callback) {
      return ea.subscribe(event, callback);
    };
    obj.publish = function(event, data) {
      ea.publish(event, data);
    };
    return ea;
  }
  function install(aurelia) {
    aurelia.withInstance(EventAggregator, includeEventsIn(aurelia));
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Handler = (function() {
        function Handler(messageType, callback) {
          _classCallCheck(this, Handler);
          this.messageType = messageType;
          this.callback = callback;
        }
        _prototypeProperties(Handler, null, {handle: {
            value: function handle(message) {
              if (message instanceof this.messageType) {
                this.callback.call(null, message);
              }
            },
            writable: true,
            configurable: true
          }});
        return Handler;
      })();
      EventAggregator = _export("EventAggregator", (function() {
        function EventAggregator() {
          _classCallCheck(this, EventAggregator);
          this.eventLookup = {};
          this.messageHandlers = [];
        }
        _prototypeProperties(EventAggregator, null, {
          publish: {
            value: function publish(event, data) {
              var subscribers,
                  i,
                  handler;
              if (typeof event === "string") {
                subscribers = this.eventLookup[event];
                if (subscribers) {
                  subscribers = subscribers.slice();
                  i = subscribers.length;
                  while (i--) {
                    subscribers[i](data, event);
                  }
                }
              } else {
                subscribers = this.messageHandlers.slice();
                i = subscribers.length;
                while (i--) {
                  subscribers[i].handle(event);
                }
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(event, callback) {
              var subscribers,
                  handler;
              if (typeof event === "string") {
                subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
                subscribers.push(callback);
                return function() {
                  subscribers.splice(subscribers.indexOf(callback), 1);
                };
              } else {
                handler = new Handler(event, callback);
                subscribers = this.messageHandlers;
                subscribers.push(handler);
                return function() {
                  subscribers.splice(subscribers.indexOf(handler), 1);
                };
              }
            },
            writable: true,
            configurable: true
          }
        });
        return EventAggregator;
      })());
    }
  };
});

System.register("github:aurelia/route-recognizer@0.2.4/index", ["github:aurelia/route-recognizer@0.2.4/dsl"], function(_export) {
  var map,
      specials,
      escapeRegex,
      oCreate,
      RouteRecognizer;
  function isArray(test) {
    return Object.prototype.toString.call(test) === "[object Array]";
  }
  function StaticSegment(string) {
    this.string = string;
  }
  function DynamicSegment(name) {
    this.name = name;
  }
  function StarSegment(name) {
    this.name = name;
  }
  function EpsilonSegment() {}
  function parse(route, names, types) {
    if (route.charAt(0) === "/") {
      route = route.substr(1);
    }
    var segments = route.split("/"),
        results = [];
    for (var i = 0,
        l = segments.length; i < l; i++) {
      var segment = segments[i],
          match;
      if (match = segment.match(/^:([^\/]+)$/)) {
        results.push(new DynamicSegment(match[1]));
        names.push(match[1]);
        types.dynamics++;
      } else if (match = segment.match(/^\*([^\/]+)$/)) {
        results.push(new StarSegment(match[1]));
        names.push(match[1]);
        types.stars++;
      } else if (segment === "") {
        results.push(new EpsilonSegment());
      } else {
        results.push(new StaticSegment(segment));
        types.statics++;
      }
    }
    return results;
  }
  function State(charSpec) {
    this.charSpec = charSpec;
    this.nextStates = [];
  }
  function sortSolutions(states) {
    return states.sort(function(a, b) {
      if (a.types.stars !== b.types.stars) {
        return a.types.stars - b.types.stars;
      }
      if (a.types.stars) {
        if (a.types.statics !== b.types.statics) {
          return b.types.statics - a.types.statics;
        }
        if (a.types.dynamics !== b.types.dynamics) {
          return b.types.dynamics - a.types.dynamics;
        }
      }
      if (a.types.dynamics !== b.types.dynamics) {
        return a.types.dynamics - b.types.dynamics;
      }
      if (a.types.statics !== b.types.statics) {
        return b.types.statics - a.types.statics;
      }
      return 0;
    });
  }
  function recognizeChar(states, ch) {
    var nextStates = [];
    for (var i = 0,
        l = states.length; i < l; i++) {
      var state = states[i];
      nextStates = nextStates.concat(state.match(ch));
    }
    return nextStates;
  }
  function RecognizeResults(queryParams) {
    this.queryParams = queryParams || {};
  }
  function findHandler(state, path, queryParams) {
    var handlers = state.handlers,
        regex = state.regex;
    var captures = path.match(regex),
        currentCapture = 1;
    var result = new RecognizeResults(queryParams);
    for (var i = 0,
        l = handlers.length; i < l; i++) {
      var handler = handlers[i],
          names = handler.names,
          params = {};
      for (var j = 0,
          m = names.length; j < m; j++) {
        params[names[j]] = captures[currentCapture++];
      }
      result.push({
        handler: handler.handler,
        params: params,
        isDynamic: !!names.length
      });
    }
    return result;
  }
  function addSegment(currentState, segment) {
    segment.eachChar(function(ch) {
      var state;
      currentState = currentState.put(ch);
    });
    return currentState;
  }
  return {
    setters: [function(_dsl) {
      map = _dsl.map;
    }],
    execute: function() {
      "use strict";
      specials = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
      escapeRegex = new RegExp("(\\" + specials.join("|\\") + ")", "g");
      StaticSegment.prototype = {
        eachChar: function eachChar(callback) {
          var string = this.string,
              ch;
          for (var i = 0,
              l = string.length; i < l; i++) {
            ch = string.charAt(i);
            callback({validChars: ch});
          }
        },
        regex: function regex() {
          return this.string.replace(escapeRegex, "\\$1");
        },
        generate: function generate() {
          return this.string;
        }
      };
      DynamicSegment.prototype = {
        eachChar: function eachChar(callback) {
          callback({
            invalidChars: "/",
            repeat: true
          });
        },
        regex: function regex() {
          return "([^/]+)";
        },
        generate: function generate(params) {
          return params[this.name];
        }
      };
      StarSegment.prototype = {
        eachChar: function eachChar(callback) {
          callback({
            invalidChars: "",
            repeat: true
          });
        },
        regex: function regex() {
          return "(.+)";
        },
        generate: function generate(params) {
          return params[this.name];
        }
      };
      EpsilonSegment.prototype = {
        eachChar: function eachChar() {},
        regex: function regex() {
          return "";
        },
        generate: function generate() {
          return "";
        }
      };
      State.prototype = {
        get: function get(charSpec) {
          var nextStates = this.nextStates;
          for (var i = 0,
              l = nextStates.length; i < l; i++) {
            var child = nextStates[i];
            var isEqual = child.charSpec.validChars === charSpec.validChars;
            isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;
            if (isEqual) {
              return child;
            }
          }
        },
        put: function put(charSpec) {
          var state;
          if (state = this.get(charSpec)) {
            return state;
          }
          state = new State(charSpec);
          this.nextStates.push(state);
          if (charSpec.repeat) {
            state.nextStates.push(state);
          }
          return state;
        },
        match: function match(ch) {
          var nextStates = this.nextStates,
              child,
              charSpec,
              chars;
          var returned = [];
          for (var i = 0,
              l = nextStates.length; i < l; i++) {
            child = nextStates[i];
            charSpec = child.charSpec;
            if (typeof(chars = charSpec.validChars) !== "undefined") {
              if (chars.indexOf(ch) !== -1) {
                returned.push(child);
              }
            } else if (typeof(chars = charSpec.invalidChars) !== "undefined") {
              if (chars.indexOf(ch) === -1) {
                returned.push(child);
              }
            }
          }
          return returned;
        }
      };
      oCreate = Object.create || function(proto) {
        function F() {}
        F.prototype = proto;
        return new F();
      };
      RecognizeResults.prototype = oCreate({
        splice: Array.prototype.splice,
        slice: Array.prototype.slice,
        push: Array.prototype.push,
        length: 0,
        queryParams: null
      });
      RouteRecognizer = _export("RouteRecognizer", function RouteRecognizer() {
        this.rootState = new State();
        this.names = {};
      });
      RouteRecognizer.prototype = {
        add: function add(routes, options) {
          var currentState = this.rootState,
              regex = "^",
              types = {
                statics: 0,
                dynamics: 0,
                stars: 0
              },
              handlers = [],
              allSegments = [],
              name;
          var isEmpty = true;
          for (var i = 0,
              l = routes.length; i < l; i++) {
            var route = routes[i],
                names = [];
            var segments = parse(route.path, names, types);
            allSegments = allSegments.concat(segments);
            for (var j = 0,
                m = segments.length; j < m; j++) {
              var segment = segments[j];
              if (segment instanceof EpsilonSegment) {
                continue;
              }
              isEmpty = false;
              currentState = currentState.put({validChars: "/"});
              regex += "/";
              currentState = addSegment(currentState, segment);
              regex += segment.regex();
            }
            var handler = {
              handler: route.handler,
              names: names
            };
            handlers.push(handler);
          }
          if (isEmpty) {
            currentState = currentState.put({validChars: "/"});
            regex += "/";
          }
          currentState.handlers = handlers;
          currentState.regex = new RegExp(regex + "$");
          currentState.types = types;
          if (name = options && options.as) {
            this.names[name] = {
              segments: allSegments,
              handlers: handlers
            };
          }
        },
        handlersFor: function handlersFor(name) {
          var route = this.names[name],
              result = [];
          if (!route) {
            throw new Error("There is no route named " + name);
          }
          for (var i = 0,
              l = route.handlers.length; i < l; i++) {
            result.push(route.handlers[i]);
          }
          return result;
        },
        hasRoute: function hasRoute(name) {
          return !!this.names[name];
        },
        generate: function generate(name, params) {
          var route = this.names[name],
              output = "";
          if (!route) {
            throw new Error("There is no route named " + name);
          }
          var segments = route.segments;
          for (var i = 0,
              l = segments.length; i < l; i++) {
            var segment = segments[i];
            if (segment instanceof EpsilonSegment) {
              continue;
            }
            output += "/";
            output += segment.generate(params);
          }
          if (output.charAt(0) !== "/") {
            output = "/" + output;
          }
          if (params && params.queryParams) {
            output += this.generateQueryString(params.queryParams, route.handlers);
          }
          return output;
        },
        generateQueryString: function generateQueryString(params, handlers) {
          var pairs = [];
          var keys = [];
          for (var key in params) {
            if (params.hasOwnProperty(key)) {
              keys.push(key);
            }
          }
          keys.sort();
          for (var i = 0,
              len = keys.length; i < len; i++) {
            key = keys[i];
            var value = params[key];
            if (value === null) {
              continue;
            }
            var pair = encodeURIComponent(key);
            if (isArray(value)) {
              for (var j = 0,
                  l = value.length; j < l; j++) {
                var arrayPair = key + "[]" + "=" + encodeURIComponent(value[j]);
                pairs.push(arrayPair);
              }
            } else {
              pair += "=" + encodeURIComponent(value);
              pairs.push(pair);
            }
          }
          if (pairs.length === 0) {
            return "";
          }
          return "?" + pairs.join("&");
        },
        parseQueryString: function parseQueryString(queryString) {
          var pairs = queryString.split("&"),
              queryParams = {};
          for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("="),
                key = decodeURIComponent(pair[0]),
                keyLength = key.length,
                isArray = false,
                value;
            if (pair.length === 1) {
              value = "true";
            } else {
              if (keyLength > 2 && key.slice(keyLength - 2) === "[]") {
                isArray = true;
                key = key.slice(0, keyLength - 2);
                if (!queryParams[key]) {
                  queryParams[key] = [];
                }
              }
              value = pair[1] ? decodeURIComponent(pair[1]) : "";
            }
            if (isArray) {
              queryParams[key].push(value);
            } else {
              queryParams[key] = value;
            }
          }
          return queryParams;
        },
        recognize: function recognize(path) {
          var states = [this.rootState],
              pathLen,
              i,
              l,
              queryStart,
              queryParams = {},
              isSlashDropped = false;
          queryStart = path.indexOf("?");
          if (queryStart !== -1) {
            var queryString = path.substr(queryStart + 1, path.length);
            path = path.substr(0, queryStart);
            queryParams = this.parseQueryString(queryString);
          }
          path = decodeURI(path);
          if (path.charAt(0) !== "/") {
            path = "/" + path;
          }
          pathLen = path.length;
          if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
            path = path.substr(0, pathLen - 1);
            isSlashDropped = true;
          }
          for (i = 0, l = path.length; i < l; i++) {
            states = recognizeChar(states, path.charAt(i));
            if (!states.length) {
              break;
            }
          }
          var solutions = [];
          for (i = 0, l = states.length; i < l; i++) {
            if (states[i].handlers) {
              solutions.push(states[i]);
            }
          }
          states = sortSolutions(solutions);
          var state = solutions[0];
          if (state && state.handlers) {
            if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
              path = path + "/";
            }
            return findHandler(state, path, queryParams);
          }
        }
      };
      RouteRecognizer.prototype.map = map;
    }
  };
});

System.register("github:aurelia/path@0.4.6", ["github:aurelia/path@0.4.6/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/router@0.6.0/navigation-plan", ["github:aurelia/router@0.6.0/navigation-commands"], function(_export) {
  var Redirect,
      _toConsumableArray,
      _prototypeProperties,
      _classCallCheck,
      NO_CHANGE,
      INVOKE_LIFECYCLE,
      REPLACE,
      BuildNavigationPlanStep;
  _export("buildNavigationPlan", buildNavigationPlan);
  function buildNavigationPlan(navigationContext, forceLifecycleMinimum) {
    var prev = navigationContext.prevInstruction;
    var next = navigationContext.nextInstruction;
    var plan = {},
        viewPortName;
    if (prev) {
      var newParams = hasDifferentParameterValues(prev, next);
      var pending = [];
      for (viewPortName in prev.viewPortInstructions) {
        var prevViewPortInstruction = prev.viewPortInstructions[viewPortName];
        var nextViewPortConfig = next.config.viewPorts[viewPortName];
        var viewPortPlan = plan[viewPortName] = {
          name: viewPortName,
          config: nextViewPortConfig,
          prevComponent: prevViewPortInstruction.component,
          prevModuleId: prevViewPortInstruction.moduleId
        };
        if (prevViewPortInstruction.moduleId != nextViewPortConfig.moduleId) {
          viewPortPlan.strategy = REPLACE;
        } else if ("determineActivationStrategy" in prevViewPortInstruction.component.executionContext) {
          var _prevViewPortInstruction$component$executionContext;
          viewPortPlan.strategy = (_prevViewPortInstruction$component$executionContext = prevViewPortInstruction.component.executionContext).determineActivationStrategy.apply(_prevViewPortInstruction$component$executionContext, _toConsumableArray(next.lifecycleArgs));
        } else if (newParams || forceLifecycleMinimum) {
          viewPortPlan.strategy = INVOKE_LIFECYCLE;
        } else {
          viewPortPlan.strategy = NO_CHANGE;
        }
        if (viewPortPlan.strategy !== REPLACE && prevViewPortInstruction.childRouter) {
          var path = next.getWildcardPath();
          var task = prevViewPortInstruction.childRouter.createNavigationInstruction(path, next).then(function(childInstruction) {
            viewPortPlan.childNavigationContext = prevViewPortInstruction.childRouter.createNavigationContext(childInstruction);
            return buildNavigationPlan(viewPortPlan.childNavigationContext, viewPortPlan.strategy == INVOKE_LIFECYCLE).then(function(childPlan) {
              viewPortPlan.childNavigationContext.plan = childPlan;
            });
          });
          pending.push(task);
        }
      }
      return Promise.all(pending).then(function() {
        return plan;
      });
    } else {
      for (viewPortName in next.config.viewPorts) {
        plan[viewPortName] = {
          name: viewPortName,
          strategy: REPLACE,
          config: next.config.viewPorts[viewPortName]
        };
      }
      return Promise.resolve(plan);
    }
  }
  function hasDifferentParameterValues(prev, next) {
    var prevParams = prev.params,
        nextParams = next.params,
        nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;
    for (var key in nextParams) {
      if (key == nextWildCardName) {
        continue;
      }
      if (prevParams[key] != nextParams[key]) {
        return true;
      }
    }
    return false;
  }
  return {
    setters: [function(_navigationCommands) {
      Redirect = _navigationCommands.Redirect;
    }],
    execute: function() {
      "use strict";
      _toConsumableArray = function(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0,
              arr2 = Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i];
          return arr2;
        } else {
          return Array.from(arr);
        }
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      NO_CHANGE = _export("NO_CHANGE", "no-change");
      INVOKE_LIFECYCLE = _export("INVOKE_LIFECYCLE", "invoke-lifecycle");
      REPLACE = _export("REPLACE", "replace");
      BuildNavigationPlanStep = _export("BuildNavigationPlanStep", (function() {
        function BuildNavigationPlanStep() {
          _classCallCheck(this, BuildNavigationPlanStep);
        }
        _prototypeProperties(BuildNavigationPlanStep, null, {run: {
            value: function run(navigationContext, next) {
              if (navigationContext.nextInstruction.config.redirect) {
                return next.cancel(new Redirect(navigationContext.nextInstruction.config.redirect));
              }
              return buildNavigationPlan(navigationContext).then(function(plan) {
                navigationContext.plan = plan;
                return next();
              })["catch"](next.cancel);
            },
            writable: true,
            configurable: true
          }});
        return BuildNavigationPlanStep;
      })());
    }
  };
});

System.register("github:aurelia/metadata@0.3.4/index", ["github:aurelia/metadata@0.3.4/origin", "github:aurelia/metadata@0.3.4/resource-type", "github:aurelia/metadata@0.3.4/metadata"], function(_export) {
  return {
    setters: [function(_origin) {
      _export("Origin", _origin.Origin);
    }, function(_resourceType) {
      _export("ResourceType", _resourceType.ResourceType);
    }, function(_metadata) {
      _export("Metadata", _metadata.Metadata);
    }],
    execute: function() {
      "use strict";
    }
  };
});

System.register("github:aurelia/logging@0.2.6", ["github:aurelia/logging@0.2.6/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/history@0.2.4", ["github:aurelia/history@0.2.4/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/router@0.6.0/pipeline-provider", ["github:aurelia/dependency-injection@0.5.0", "github:aurelia/router@0.6.0/pipeline", "github:aurelia/router@0.6.0/navigation-plan", "github:aurelia/router@0.6.0/model-binding", "github:aurelia/router@0.6.0/route-loading", "github:aurelia/router@0.6.0/navigation-context", "github:aurelia/router@0.6.0/activation", "github:aurelia/router@0.6.0/route-filters"], function(_export) {
  var Container,
      Pipeline,
      BuildNavigationPlanStep,
      ApplyModelBindersStep,
      LoadRouteStep,
      CommitChangesStep,
      CanDeactivatePreviousStep,
      CanActivateNextStep,
      DeactivatePreviousStep,
      ActivateNextStep,
      createRouteFilterStep,
      _prototypeProperties,
      _classCallCheck,
      PipelineProvider;
  return {
    setters: [function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_pipeline) {
      Pipeline = _pipeline.Pipeline;
    }, function(_navigationPlan) {
      BuildNavigationPlanStep = _navigationPlan.BuildNavigationPlanStep;
    }, function(_modelBinding) {
      ApplyModelBindersStep = _modelBinding.ApplyModelBindersStep;
    }, function(_routeLoading) {
      LoadRouteStep = _routeLoading.LoadRouteStep;
    }, function(_navigationContext) {
      CommitChangesStep = _navigationContext.CommitChangesStep;
    }, function(_activation) {
      CanDeactivatePreviousStep = _activation.CanDeactivatePreviousStep;
      CanActivateNextStep = _activation.CanActivateNextStep;
      DeactivatePreviousStep = _activation.DeactivatePreviousStep;
      ActivateNextStep = _activation.ActivateNextStep;
    }, function(_routeFilters) {
      createRouteFilterStep = _routeFilters.createRouteFilterStep;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      PipelineProvider = _export("PipelineProvider", (function() {
        function PipelineProvider(container) {
          _classCallCheck(this, PipelineProvider);
          this.container = container;
          this.steps = [BuildNavigationPlanStep, CanDeactivatePreviousStep, LoadRouteStep, createRouteFilterStep("authorize"), createRouteFilterStep("modelbind"), CanActivateNextStep, DeactivatePreviousStep, ActivateNextStep, createRouteFilterStep("precommit"), CommitChangesStep];
        }
        _prototypeProperties(PipelineProvider, {inject: {
            value: function inject() {
              return [Container];
            },
            writable: true,
            configurable: true
          }}, {createPipeline: {
            value: function createPipeline(navigationContext) {
              var _this = this;
              var pipeline = new Pipeline();
              this.steps.forEach(function(step) {
                return pipeline.withStep(_this.container.get(step));
              });
              return pipeline;
            },
            writable: true,
            configurable: true
          }});
        return PipelineProvider;
      })());
    }
  };
});

System.register("github:aurelia/event-aggregator@0.2.4", ["github:aurelia/event-aggregator@0.2.4/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/route-recognizer@0.2.4", ["github:aurelia/route-recognizer@0.2.4/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/router@0.6.0/navigation-context", ["github:aurelia/router@0.6.0/navigation-plan"], function(_export) {
  var REPLACE,
      _prototypeProperties,
      _classCallCheck,
      NavigationContext,
      CommitChangesStep;
  return {
    setters: [function(_navigationPlan) {
      REPLACE = _navigationPlan.REPLACE;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      NavigationContext = _export("NavigationContext", (function() {
        function NavigationContext(router, nextInstruction) {
          _classCallCheck(this, NavigationContext);
          this.router = router;
          this.nextInstruction = nextInstruction;
          this.currentInstruction = router.currentInstruction;
          this.prevInstruction = router.currentInstruction;
        }
        _prototypeProperties(NavigationContext, null, {
          getAllContexts: {
            value: function getAllContexts() {
              var acc = arguments[0] === undefined ? [] : arguments[0];
              acc.push(this);
              if (this.plan) {
                for (var key in this.plan) {
                  this.plan[key].childNavigationContext && this.plan[key].childNavigationContext.getAllContexts(acc);
                }
              }
              return acc;
            },
            writable: true,
            configurable: true
          },
          nextInstructions: {
            get: function() {
              return this.getAllContexts().map(function(c) {
                return c.nextInstruction;
              }).filter(function(c) {
                return c;
              });
            },
            configurable: true
          },
          currentInstructions: {
            get: function() {
              return this.getAllContexts().map(function(c) {
                return c.currentInstruction;
              }).filter(function(c) {
                return c;
              });
            },
            configurable: true
          },
          prevInstructions: {
            get: function() {
              return this.getAllContexts().map(function(c) {
                return c.prevInstruction;
              }).filter(function(c) {
                return c;
              });
            },
            configurable: true
          },
          commitChanges: {
            value: function commitChanges(waitToSwap) {
              var next = this.nextInstruction,
                  prev = this.prevInstruction,
                  viewPortInstructions = next.viewPortInstructions,
                  router = this.router,
                  loads = [],
                  delaySwaps = [];
              router.currentInstruction = next;
              if (prev) {
                prev.config.navModel.isActive = false;
              }
              next.config.navModel.isActive = true;
              router.refreshBaseUrl();
              router.refreshNavigation();
              for (var viewPortName in viewPortInstructions) {
                var viewPortInstruction = viewPortInstructions[viewPortName];
                var viewPort = router.viewPorts[viewPortName];
                if (!viewPort) {
                  throw new Error("There was no router-view found in the view for " + viewPortInstruction.moduleId + ".");
                }
                if (viewPortInstruction.strategy === REPLACE) {
                  if (waitToSwap) {
                    delaySwaps.push({
                      viewPort: viewPort,
                      viewPortInstruction: viewPortInstruction
                    });
                  }
                  loads.push(viewPort.process(viewPortInstruction, waitToSwap).then(function(x) {
                    if ("childNavigationContext" in viewPortInstruction) {
                      return viewPortInstruction.childNavigationContext.commitChanges();
                    }
                  }));
                } else {
                  if ("childNavigationContext" in viewPortInstruction) {
                    loads.push(viewPortInstruction.childNavigationContext.commitChanges(waitToSwap));
                  }
                }
              }
              return Promise.all(loads).then(function() {
                delaySwaps.forEach(function(x) {
                  return x.viewPort.swap(x.viewPortInstruction);
                });
              });
            },
            writable: true,
            configurable: true
          },
          buildTitle: {
            value: function buildTitle() {
              var separator = arguments[0] === undefined ? " | " : arguments[0];
              var next = this.nextInstruction,
                  title = next.config.navModel.title || "",
                  viewPortInstructions = next.viewPortInstructions,
                  childTitles = [];
              for (var viewPortName in viewPortInstructions) {
                var viewPortInstruction = viewPortInstructions[viewPortName];
                if ("childNavigationContext" in viewPortInstruction) {
                  var childTitle = viewPortInstruction.childNavigationContext.buildTitle(separator);
                  if (childTitle) {
                    childTitles.push(childTitle);
                  }
                }
              }
              if (childTitles.length) {
                title = childTitles.join(separator) + (title ? separator : "") + title;
              }
              if (this.router.title) {
                title += (title ? separator : "") + this.router.title;
              }
              return title;
            },
            writable: true,
            configurable: true
          }
        });
        return NavigationContext;
      })());
      CommitChangesStep = _export("CommitChangesStep", (function() {
        function CommitChangesStep() {
          _classCallCheck(this, CommitChangesStep);
        }
        _prototypeProperties(CommitChangesStep, null, {run: {
            value: function run(navigationContext, next) {
              return navigationContext.commitChanges(true).then(function() {
                var title = navigationContext.buildTitle();
                if (title) {
                  document.title = title;
                }
                return next();
              });
            },
            writable: true,
            configurable: true
          }});
        return CommitChangesStep;
      })());
    }
  };
});

System.register("github:aurelia/metadata@0.3.4", ["github:aurelia/metadata@0.3.4/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/dependency-injection@0.5.0/container", ["github:aurelia/metadata@0.3.4", "github:aurelia/logging@0.2.6", "github:aurelia/dependency-injection@0.5.0/metadata"], function(_export) {
  var Metadata,
      AggregateError,
      Resolver,
      Registration,
      Factory,
      _prototypeProperties,
      _classCallCheck,
      emptyParameters,
      Container;
  function test() {}
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_aureliaLogging) {
      AggregateError = _aureliaLogging.AggregateError;
    }, function(_metadata) {
      Resolver = _metadata.Resolver;
      Registration = _metadata.Registration;
      Factory = _metadata.Factory;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      emptyParameters = Object.freeze([]);
      if (!test.name) {
        Object.defineProperty(Function.prototype, "name", {get: function get() {
            var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
            Object.defineProperty(this, "name", {value: name});
            return name;
          }});
      }
      Container = _export("Container", (function() {
        function Container(constructionInfo) {
          _classCallCheck(this, Container);
          this.constructionInfo = constructionInfo || new Map();
          this.entries = new Map();
          this.root = this;
        }
        _prototypeProperties(Container, null, {
          supportAtScript: {
            value: function supportAtScript() {
              this.addParameterInfoLocator(function(fn) {
                var parameters = fn.parameters,
                    keys,
                    i,
                    ii;
                if (parameters) {
                  keys = new Array(parameters.length);
                  for (i = 0, ii = parameters.length; i < ii; ++i) {
                    keys[i] = parameters[i].is || parameters[i][0];
                  }
                }
                return keys;
              });
            },
            writable: true,
            configurable: true
          },
          addParameterInfoLocator: {
            value: function addParameterInfoLocator(locator) {
              if (this.locateParameterInfoElsewhere === undefined) {
                this.locateParameterInfoElsewhere = locator;
                return ;
              }
              var original = this.locateParameterInfoElsewhere;
              this.locateParameterInfoElsewhere = function(fn) {
                return original(fn) || locator(fn);
              };
            },
            writable: true,
            configurable: true
          },
          registerInstance: {
            value: function registerInstance(key, instance) {
              this.registerHandler(key, function(x) {
                return instance;
              });
            },
            writable: true,
            configurable: true
          },
          registerTransient: {
            value: function registerTransient(key, fn) {
              fn = fn || key;
              this.registerHandler(key, function(x) {
                return x.invoke(fn);
              });
            },
            writable: true,
            configurable: true
          },
          registerSingleton: {
            value: function registerSingleton(key, fn) {
              var singleton = null;
              fn = fn || key;
              this.registerHandler(key, function(x) {
                return singleton || (singleton = x.invoke(fn));
              });
            },
            writable: true,
            configurable: true
          },
          autoRegister: {
            value: function autoRegister(fn, key) {
              var registration;
              if (fn === null || fn === undefined) {
                throw new Error("fn cannot be null or undefined.");
              }
              registration = Metadata.on(fn).first(Registration, true);
              if (registration) {
                registration.register(this, key || fn, fn);
              } else {
                this.registerSingleton(key || fn, fn);
              }
            },
            writable: true,
            configurable: true
          },
          autoRegisterAll: {
            value: function autoRegisterAll(fns) {
              var i = fns.length;
              while (i--) {
                this.autoRegister(fns[i]);
              }
            },
            writable: true,
            configurable: true
          },
          registerHandler: {
            value: function registerHandler(key, handler) {
              this.getOrCreateEntry(key).push(handler);
            },
            writable: true,
            configurable: true
          },
          unregister: {
            value: function unregister(key) {
              this.entries["delete"](key);
            },
            writable: true,
            configurable: true
          },
          get: {
            value: function get(key) {
              var entry;
              if (key === null || key === undefined) {
                throw new Error("key cannot be null or undefined.");
              }
              if (key instanceof Resolver) {
                return key.get(this);
              }
              if (key === Container) {
                return this;
              }
              entry = this.entries.get(key);
              if (entry !== undefined) {
                return entry[0](this);
              }
              if (this.parent) {
                return this.parent.get(key);
              }
              this.autoRegister(key);
              entry = this.entries.get(key);
              return entry[0](this);
            },
            writable: true,
            configurable: true
          },
          getAll: {
            value: function getAll(key) {
              var _this = this;
              var entry;
              if (key === null || key === undefined) {
                throw new Error("key cannot be null or undefined.");
              }
              entry = this.entries.get(key);
              if (entry !== undefined) {
                return entry.map(function(x) {
                  return x(_this);
                });
              }
              if (this.parent) {
                return this.parent.getAll(key);
              }
              return [];
            },
            writable: true,
            configurable: true
          },
          hasHandler: {
            value: function hasHandler(key) {
              var checkParent = arguments[1] === undefined ? false : arguments[1];
              if (key === null || key === undefined) {
                throw new Error("key cannot be null or undefined.");
              }
              return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
            },
            writable: true,
            configurable: true
          },
          createChild: {
            value: function createChild() {
              var childContainer = new Container(this.constructionInfo);
              childContainer.parent = this;
              childContainer.root = this.root;
              childContainer.locateParameterInfoElsewhere = this.locateParameterInfoElsewhere;
              return childContainer;
            },
            writable: true,
            configurable: true
          },
          invoke: {
            value: function invoke(fn) {
              var info = this.getOrCreateConstructionInfo(fn),
                  keys = info.keys,
                  args = new Array(keys.length),
                  context,
                  key,
                  keyName,
                  i,
                  ii;
              try {
                for (i = 0, ii = keys.length; i < ii; ++i) {
                  key = keys[i];
                  args[i] = this.get(key);
                }
              } catch (e) {
                keyName = typeof key === "function" ? key.name : key;
                throw new AggregateError("Error resolving dependency [" + keyName + "] required by [" + fn.name + "].", e);
              }
              if (info.isFactory) {
                return fn.apply(undefined, args);
              } else {
                context = Object.create(fn.prototype);
                if ("initialize" in fn) {
                  fn.initialize(context);
                }
                return fn.apply(context, args) || context;
              }
            },
            writable: true,
            configurable: true
          },
          getOrCreateEntry: {
            value: function getOrCreateEntry(key) {
              var entry;
              if (key === null || key === undefined) {
                throw new Error("key cannot be null or undefined.");
              }
              entry = this.entries.get(key);
              if (entry === undefined) {
                entry = [];
                this.entries.set(key, entry);
              }
              return entry;
            },
            writable: true,
            configurable: true
          },
          getOrCreateConstructionInfo: {
            value: function getOrCreateConstructionInfo(fn) {
              var info = this.constructionInfo.get(fn);
              if (info === undefined) {
                info = this.createConstructionInfo(fn);
                this.constructionInfo.set(fn, info);
              }
              return info;
            },
            writable: true,
            configurable: true
          },
          createConstructionInfo: {
            value: function createConstructionInfo(fn) {
              var info = {isFactory: Metadata.on(fn).has(Factory)};
              if (fn.inject !== undefined) {
                if (typeof fn.inject === "function") {
                  info.keys = fn.inject();
                } else {
                  info.keys = fn.inject;
                }
                return info;
              }
              if (this.locateParameterInfoElsewhere !== undefined) {
                info.keys = this.locateParameterInfoElsewhere(fn) || emptyParameters;
              } else {
                info.keys = emptyParameters;
              }
              return info;
            },
            writable: true,
            configurable: true
          }
        });
        return Container;
      })());
    }
  };
});

System.register("github:aurelia/router@0.6.0/app-router", ["github:aurelia/dependency-injection@0.5.0", "github:aurelia/history@0.2.4", "github:aurelia/router@0.6.0/router", "github:aurelia/router@0.6.0/pipeline-provider", "github:aurelia/router@0.6.0/navigation-commands", "github:aurelia/event-aggregator@0.2.4"], function(_export) {
  var Container,
      History,
      Router,
      PipelineProvider,
      isNavigationCommand,
      EventAggregator,
      _prototypeProperties,
      _get,
      _inherits,
      _classCallCheck,
      AppRouter;
  function findAnchor(el) {
    while (el) {
      if (el.tagName === "A") {
        return el;
      }
      el = el.parentNode;
    }
  }
  function handleLinkClick(evt) {
    if (!this.isActive) {
      return ;
    }
    var target = findAnchor(evt.target);
    if (!target) {
      return ;
    }
    if (this.history._hasPushState) {
      if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && targetIsThisWindow(target)) {
        var href = target.getAttribute("href");
        if (href !== null && !(href.charAt(0) === "#" || /^[a-z]+:/i.test(href))) {
          evt.preventDefault();
          this.history.navigate(href);
        }
      }
    }
  }
  function targetIsThisWindow(target) {
    var targetWindow = target.getAttribute("target");
    return !targetWindow || targetWindow === window.name || targetWindow === "_self" || targetWindow === "top" && window === window.top;
  }
  return {
    setters: [function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_aureliaHistory) {
      History = _aureliaHistory.History;
    }, function(_router) {
      Router = _router.Router;
    }, function(_pipelineProvider) {
      PipelineProvider = _pipelineProvider.PipelineProvider;
    }, function(_navigationCommands) {
      isNavigationCommand = _navigationCommands.isNavigationCommand;
    }, function(_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      AppRouter = _export("AppRouter", (function(Router) {
        function AppRouter(container, history, pipelineProvider, events) {
          _classCallCheck(this, AppRouter);
          _get(Object.getPrototypeOf(AppRouter.prototype), "constructor", this).call(this, container, history);
          this.pipelineProvider = pipelineProvider;
          document.addEventListener("click", handleLinkClick.bind(this), true);
          this.events = events;
        }
        _inherits(AppRouter, Router);
        _prototypeProperties(AppRouter, {inject: {
            value: function inject() {
              return [Container, History, PipelineProvider, EventAggregator];
            },
            writable: true,
            configurable: true
          }}, {
          isRoot: {
            get: function() {
              return true;
            },
            configurable: true
          },
          loadUrl: {
            value: function loadUrl(url) {
              var _this = this;
              return this.createNavigationInstruction(url).then(function(instruction) {
                return _this.queueInstruction(instruction);
              })["catch"](function(error) {
                console.error(error);
                if (_this.history.previousFragment) {
                  _this.navigate(_this.history.previousFragment, false);
                }
              });
            },
            writable: true,
            configurable: true
          },
          queueInstruction: {
            value: function queueInstruction(instruction) {
              var _this = this;
              return new Promise(function(resolve) {
                instruction.resolve = resolve;
                _this.queue.unshift(instruction);
                _this.dequeueInstruction();
              });
            },
            writable: true,
            configurable: true
          },
          dequeueInstruction: {
            value: function dequeueInstruction() {
              var _this = this;
              if (this.isNavigating) {
                return ;
              }
              var instruction = this.queue.shift();
              this.queue = [];
              if (!instruction) {
                return ;
              }
              this.isNavigating = true;
              this.events.publish("router:navigation:processing", instruction);
              var context = this.createNavigationContext(instruction);
              var pipeline = this.pipelineProvider.createPipeline(context);
              pipeline.run(context).then(function(result) {
                _this.isNavigating = false;
                if (result.completed) {
                  _this.history.previousFragment = instruction.fragment;
                }
                if (result.output instanceof Error) {
                  console.error(result.output);
                  _this.events.publish("router:navigation:error", {
                    instruction: instruction,
                    result: result
                  });
                }
                if (isNavigationCommand(result.output)) {
                  result.output.navigate(_this);
                } else if (!result.completed) {
                  _this.navigate(_this.history.previousFragment || "", false);
                  _this.events.publish("router:navigation:cancelled", instruction);
                }
                instruction.resolve(result);
                _this.dequeueInstruction();
              }).then(function(result) {
                return _this.events.publish("router:navigation:complete", instruction);
              })["catch"](function(error) {
                console.error(error);
              });
            },
            writable: true,
            configurable: true
          },
          registerViewPort: {
            value: function registerViewPort(viewPort, name) {
              var _this = this;
              _get(Object.getPrototypeOf(AppRouter.prototype), "registerViewPort", this).call(this, viewPort, name);
              if (!this.isActive) {
                if ("configureRouter" in this.container.viewModel) {
                  var result = this.container.viewModel.configureRouter() || Promise.resolve();
                  return result.then(function() {
                    return _this.activate();
                  });
                } else {
                  this.activate();
                }
              } else {
                this.dequeueInstruction();
              }
            },
            writable: true,
            configurable: true
          },
          activate: {
            value: function activate(options) {
              if (this.isActive) {
                return ;
              }
              this.isActive = true;
              this.options = Object.assign({routeHandler: this.loadUrl.bind(this)}, this.options, options);
              this.history.activate(this.options);
              this.dequeueInstruction();
            },
            writable: true,
            configurable: true
          },
          deactivate: {
            value: function deactivate() {
              this.isActive = false;
              this.history.deactivate();
            },
            writable: true,
            configurable: true
          },
          reset: {
            value: function reset() {
              _get(Object.getPrototypeOf(AppRouter.prototype), "reset", this).call(this);
              this.queue = [];
              this.options = null;
            },
            writable: true,
            configurable: true
          }
        });
        return AppRouter;
      })(Router));
    }
  };
});

System.register("github:aurelia/dependency-injection@0.5.0/index", ["github:aurelia/metadata@0.3.4", "github:aurelia/dependency-injection@0.5.0/metadata", "github:aurelia/dependency-injection@0.5.0/container"], function(_export) {
  var Metadata,
      Transient,
      Singleton;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_metadata) {
      Transient = _metadata.Transient;
      Singleton = _metadata.Singleton;
      _export("Registration", _metadata.Registration);
      _export("Transient", _metadata.Transient);
      _export("Singleton", _metadata.Singleton);
      _export("Resolver", _metadata.Resolver);
      _export("Lazy", _metadata.Lazy);
      _export("All", _metadata.All);
      _export("Optional", _metadata.Optional);
      _export("Parent", _metadata.Parent);
      _export("Factory", _metadata.Factory);
    }, function(_container) {
      _export("Container", _container.Container);
    }],
    execute: function() {
      "use strict";
      Metadata.configure.classHelper("transient", Transient);
      Metadata.configure.classHelper("singleton", Singleton);
    }
  };
});

System.register("github:aurelia/dependency-injection@0.5.0", ["github:aurelia/dependency-injection@0.5.0/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/router@0.6.0/route-filters", ["github:aurelia/dependency-injection@0.5.0"], function(_export) {
  var Container,
      _toConsumableArray,
      _prototypeProperties,
      _classCallCheck,
      RouteFilterContainer,
      RouteFilterStep;
  _export("createRouteFilterStep", createRouteFilterStep);
  function createRouteFilterStep(name) {
    function create(routeFilterContainer) {
      return new RouteFilterStep(name, routeFilterContainer);
    }
    ;
    create.inject = function() {
      return [RouteFilterContainer];
    };
    return create;
  }
  return {
    setters: [function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }],
    execute: function() {
      "use strict";
      _toConsumableArray = function(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0,
              arr2 = Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i];
          return arr2;
        } else {
          return Array.from(arr);
        }
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      RouteFilterContainer = _export("RouteFilterContainer", (function() {
        function RouteFilterContainer(container) {
          _classCallCheck(this, RouteFilterContainer);
          this.container = container;
          this.filters = {};
          this.filterCache = {};
        }
        _prototypeProperties(RouteFilterContainer, {inject: {
            value: function inject() {
              return [Container];
            },
            writable: true,
            configurable: true
          }}, {
          addStep: {
            value: function addStep(name, step) {
              var index = arguments[2] === undefined ? -1 : arguments[2];
              var filter = this.filters[name];
              if (!filter) {
                filter = this.filters[name] = [];
              }
              if (index === -1) {
                index = filter.length;
              }
              filter.splice(index, 0, step);
              this.filterCache = {};
            },
            writable: true,
            configurable: true
          },
          getFilterSteps: {
            value: function getFilterSteps(name) {
              if (this.filterCache[name]) {
                return this.filterCache[name];
              }
              var steps = [];
              var filter = this.filters[name];
              if (!filter) {
                return steps;
              }
              for (var i = 0,
                  l = filter.length; i < l; i++) {
                if (typeof filter[i] === "string") {
                  steps.push.apply(steps, _toConsumableArray(this.getFilterSteps(filter[i])));
                } else {
                  steps.push(this.container.get(filter[i]));
                }
              }
              return this.filterCache[name] = steps;
            },
            writable: true,
            configurable: true
          }
        });
        return RouteFilterContainer;
      })());
      RouteFilterStep = (function() {
        function RouteFilterStep(name, routeFilterContainer) {
          _classCallCheck(this, RouteFilterStep);
          this.name = name;
          this.routeFilterContainer = routeFilterContainer;
          this.isMultiStep = true;
        }
        _prototypeProperties(RouteFilterStep, null, {getSteps: {
            value: function getSteps() {
              return this.routeFilterContainer.getFilterSteps(this.name);
            },
            writable: true,
            configurable: true
          }});
        return RouteFilterStep;
      })();
    }
  };
});

System.register("github:aurelia/router@0.6.0/router-configuration", ["github:aurelia/router@0.6.0/route-filters"], function(_export) {
  var RouteFilterContainer,
      _prototypeProperties,
      _classCallCheck,
      RouterConfiguration;
  function ensureConfigValue(config, property, getter) {
    var value = config[property];
    if (value || value === "") {
      return value;
    }
    return getter(config);
  }
  function stripParametersFromRoute(route) {
    var colonIndex = route.indexOf(":");
    var length = colonIndex > 0 ? colonIndex - 1 : route.length;
    return route.substr(0, length);
  }
  return {
    setters: [function(_routeFilters) {
      RouteFilterContainer = _routeFilters.RouteFilterContainer;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      RouterConfiguration = _export("RouterConfiguration", (function() {
        function RouterConfiguration() {
          _classCallCheck(this, RouterConfiguration);
          this.instructions = [];
          this.options = {};
          this.pipelineSteps = [];
        }
        _prototypeProperties(RouterConfiguration, null, {
          addPipelineStep: {
            value: function addPipelineStep(name, step) {
              this.pipelineSteps.push({
                name: name,
                step: step
              });
            },
            writable: true,
            configurable: true
          },
          map: {
            value: function map(route, config) {
              if (Array.isArray(route)) {
                for (var i = 0; i < route.length; i++) {
                  this.map(route[i]);
                }
                return this;
              }
              if (typeof route == "string") {
                if (!config) {
                  config = {};
                } else if (typeof config == "string") {
                  config = {moduleId: config};
                }
                config.route = route;
              } else {
                config = route;
              }
              return this.mapRoute(config);
            },
            writable: true,
            configurable: true
          },
          mapRoute: {
            value: function mapRoute(config) {
              var _this = this;
              this.instructions.push(function(router) {
                if (Array.isArray(config.route)) {
                  var navModel = {},
                      i,
                      ii,
                      current;
                  for (i = 0, ii = config.route.length; i < ii; ++i) {
                    current = Object.assign({}, config);
                    current.route = config.route[i];
                    _this.configureRoute(router, current, navModel);
                  }
                } else {
                  _this.configureRoute(router, Object.assign({}, config));
                }
              });
              return this;
            },
            writable: true,
            configurable: true
          },
          mapUnknownRoutes: {
            value: function mapUnknownRoutes(config) {
              this.unknownRouteConfig = config;
              return this;
            },
            writable: true,
            configurable: true
          },
          exportToRouter: {
            value: function exportToRouter(router) {
              var instructions = this.instructions,
                  pipelineSteps = this.pipelineSteps,
                  i,
                  ii,
                  filterContainer;
              for (i = 0, ii = instructions.length; i < ii; ++i) {
                instructions[i](router);
              }
              if (this.title) {
                router.title = this.title;
              }
              if (this.unknownRouteConfig) {
                router.handleUnknownRoutes(this.unknownRouteConfig);
              }
              router.options = this.options;
              if (pipelineSteps.length) {
                if (!router.isRoot) {
                  throw new Error("Pipeline steps can only be added to the root router");
                }
                filterContainer = router.container.get(RouteFilterContainer);
                for (i = 0, ii = pipelineSteps.length; i < ii; ++i) {
                  var _pipelineSteps$i = pipelineSteps[i];
                  var name = _pipelineSteps$i.name;
                  var step = _pipelineSteps$i.step;
                  filterContainer.addStep(name, step);
                }
              }
            },
            writable: true,
            configurable: true
          },
          configureRoute: {
            value: function configureRoute(router, config, navModel) {
              this.ensureDefaultsForRouteConfig(config);
              router.addRoute(config, navModel);
            },
            writable: true,
            configurable: true
          },
          ensureDefaultsForRouteConfig: {
            value: function ensureDefaultsForRouteConfig(config) {
              config.name = ensureConfigValue(config, "name", this.deriveName);
              config.route = ensureConfigValue(config, "route", this.deriveRoute);
              config.title = ensureConfigValue(config, "title", this.deriveTitle);
              config.moduleId = ensureConfigValue(config, "moduleId", this.deriveModuleId);
            },
            writable: true,
            configurable: true
          },
          deriveName: {
            value: function deriveName(config) {
              return config.title || (config.route ? stripParametersFromRoute(config.route) : config.moduleId);
            },
            writable: true,
            configurable: true
          },
          deriveRoute: {
            value: function deriveRoute(config) {
              return config.moduleId || config.name;
            },
            writable: true,
            configurable: true
          },
          deriveTitle: {
            value: function deriveTitle(config) {
              var value = config.name;
              return value ? value.substr(0, 1).toUpperCase() + value.substr(1) : null;
            },
            writable: true,
            configurable: true
          },
          deriveModuleId: {
            value: function deriveModuleId(config) {
              return stripParametersFromRoute(config.route);
            },
            writable: true,
            configurable: true
          }
        });
        return RouterConfiguration;
      })());
    }
  };
});

System.register("github:aurelia/router@0.6.0/router", ["github:aurelia/route-recognizer@0.2.4", "github:aurelia/path@0.4.6", "github:aurelia/router@0.6.0/navigation-context", "github:aurelia/router@0.6.0/navigation-instruction", "github:aurelia/router@0.6.0/router-configuration", "github:aurelia/router@0.6.0/util"], function(_export) {
  var RouteRecognizer,
      join,
      NavigationContext,
      NavigationInstruction,
      RouterConfiguration,
      processPotential,
      _prototypeProperties,
      _classCallCheck,
      Router;
  return {
    setters: [function(_aureliaRouteRecognizer) {
      RouteRecognizer = _aureliaRouteRecognizer.RouteRecognizer;
    }, function(_aureliaPath) {
      join = _aureliaPath.join;
    }, function(_navigationContext) {
      NavigationContext = _navigationContext.NavigationContext;
    }, function(_navigationInstruction) {
      NavigationInstruction = _navigationInstruction.NavigationInstruction;
    }, function(_routerConfiguration) {
      RouterConfiguration = _routerConfiguration.RouterConfiguration;
    }, function(_util) {
      processPotential = _util.processPotential;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Router = _export("Router", (function() {
        function Router(container, history) {
          _classCallCheck(this, Router);
          this.container = container;
          this.history = history;
          this.viewPorts = {};
          this.reset();
          this.baseUrl = "";
          this.isConfigured = false;
        }
        _prototypeProperties(Router, null, {
          isRoot: {
            get: function() {
              return false;
            },
            configurable: true
          },
          registerViewPort: {
            value: function registerViewPort(viewPort, name) {
              name = name || "default";
              this.viewPorts[name] = viewPort;
            },
            writable: true,
            configurable: true
          },
          refreshBaseUrl: {
            value: function refreshBaseUrl() {
              if (this.parent) {
                var baseUrl = this.parent.currentInstruction.getBaseUrl();
                this.baseUrl = this.parent.baseUrl + baseUrl;
              }
            },
            writable: true,
            configurable: true
          },
          refreshNavigation: {
            value: function refreshNavigation() {
              var nav = this.navigation;
              for (var i = 0,
                  length = nav.length; i < length; i++) {
                var current = nav[i];
                if (!this.history._hasPushState) {
                  if (this.baseUrl[0] == "/") {
                    current.href = "#" + this.baseUrl;
                  } else {
                    current.href = "#/" + this.baseUrl;
                  }
                } else {
                  current.href = "/" + this.baseUrl;
                }
                if (current.href[current.href.length - 1] != "/") {
                  current.href += "/";
                }
                current.href += current.relativeHref;
              }
            },
            writable: true,
            configurable: true
          },
          configure: {
            value: function configure(callbackOrConfig) {
              this.isConfigured = true;
              if (typeof callbackOrConfig == "function") {
                var config = new RouterConfiguration();
                callbackOrConfig(config);
                config.exportToRouter(this);
              } else {
                callbackOrConfig.exportToRouter(this);
              }
              return this;
            },
            writable: true,
            configurable: true
          },
          navigate: {
            value: function navigate(fragment, options) {
              if (!this.isConfigured && this.parent) {
                return this.parent.navigate(fragment, options);
              }
              fragment = join(this.baseUrl, fragment);
              if (fragment === "")
                fragment = "/";
              return this.history.navigate(fragment, options);
            },
            writable: true,
            configurable: true
          },
          navigateBack: {
            value: function navigateBack() {
              this.history.navigateBack();
            },
            writable: true,
            configurable: true
          },
          createChild: {
            value: function createChild(container) {
              var childRouter = new Router(container || this.container.createChild(), this.history);
              childRouter.parent = this;
              return childRouter;
            },
            writable: true,
            configurable: true
          },
          createNavigationInstruction: {
            value: function createNavigationInstruction() {
              var url = arguments[0] === undefined ? "" : arguments[0];
              var parentInstruction = arguments[1] === undefined ? null : arguments[1];
              var results = this.recognizer.recognize(url);
              var fragment,
                  queryIndex,
                  queryString;
              if (!results || !results.length) {
                results = this.childRecognizer.recognize(url);
              }
              fragment = url;
              queryIndex = fragment.indexOf("?");
              if (queryIndex != -1) {
                fragment = url.substr(0, queryIndex);
                queryString = url.substr(queryIndex + 1);
              }
              if ((!results || !results.length) && this.catchAllHandler) {
                results = [{
                  config: {navModel: {}},
                  handler: this.catchAllHandler,
                  params: {path: fragment}
                }];
              }
              if (results && results.length) {
                var first = results[0],
                    fragment = url,
                    queryIndex = fragment.indexOf("?"),
                    queryString;
                if (queryIndex != -1) {
                  fragment = url.substr(0, queryIndex);
                  queryString = url.substr(queryIndex + 1);
                }
                var instruction = new NavigationInstruction(fragment, queryString, first.params, first.queryParams || results.queryParams, first.config || first.handler, parentInstruction);
                if (typeof first.handler == "function") {
                  return first.handler(instruction).then(function(instruction) {
                    if (!("viewPorts" in instruction.config)) {
                      instruction.config.viewPorts = {"default": {moduleId: instruction.config.moduleId}};
                    }
                    return instruction;
                  });
                }
                return Promise.resolve(instruction);
              } else {
                return Promise.reject(new Error("Route Not Found: " + url));
              }
            },
            writable: true,
            configurable: true
          },
          createNavigationContext: {
            value: function createNavigationContext(instruction) {
              return new NavigationContext(this, instruction);
            },
            writable: true,
            configurable: true
          },
          generate: {
            value: function generate(name, params) {
              if (!this.isConfigured && this.parent) {
                return this.parent.generate(name, params);
              }
              return this.recognizer.generate(name, params);
            },
            writable: true,
            configurable: true
          },
          addRoute: {
            value: function addRoute(config) {
              var navModel = arguments[1] === undefined ? {} : arguments[1];
              if (!("viewPorts" in config)) {
                config.viewPorts = {"default": {
                    moduleId: config.moduleId,
                    view: config.view
                  }};
              }
              navModel.title = navModel.title || config.title;
              navModel.settings = config.settings || (config.settings = {});
              this.routes.push(config);
              this.recognizer.add([{
                path: config.route,
                handler: config
              }]);
              if (config.route) {
                var withChild,
                    settings = config.settings;
                delete config.settings;
                withChild = JSON.parse(JSON.stringify(config));
                config.settings = settings;
                withChild.route += "/*childRoute";
                withChild.hasChildRouter = true;
                this.childRecognizer.add([{
                  path: withChild.route,
                  handler: withChild
                }]);
                withChild.navModel = navModel;
                withChild.settings = config.settings;
              }
              config.navModel = navModel;
              if ((config.nav || "order" in navModel) && this.navigation.indexOf(navModel) === -1) {
                navModel.order = navModel.order || config.nav;
                navModel.href = navModel.href || config.href;
                navModel.isActive = false;
                navModel.config = config;
                if (!config.href) {
                  navModel.relativeHref = config.route;
                  navModel.href = "";
                }
                if (typeof navModel.order != "number") {
                  navModel.order = ++this.fallbackOrder;
                }
                this.navigation.push(navModel);
                this.navigation = this.navigation.sort(function(a, b) {
                  return a.order - b.order;
                });
              }
            },
            writable: true,
            configurable: true
          },
          handleUnknownRoutes: {
            value: function handleUnknownRoutes(config) {
              var callback = function(instruction) {
                return new Promise(function(resolve, reject) {
                  function done(inst) {
                    inst = inst || instruction;
                    inst.config.route = inst.params.path;
                    resolve(inst);
                  }
                  if (!config) {
                    instruction.config.moduleId = instruction.fragment;
                    done(instruction);
                  } else if (typeof config == "string") {
                    instruction.config.moduleId = config;
                    done(instruction);
                  } else if (typeof config == "function") {
                    processPotential(config(instruction), done, reject);
                  } else {
                    instruction.config = config;
                    done(instruction);
                  }
                });
              };
              this.catchAllHandler = callback;
            },
            writable: true,
            configurable: true
          },
          reset: {
            value: function reset() {
              this.fallbackOrder = 100;
              this.recognizer = new RouteRecognizer();
              this.childRecognizer = new RouteRecognizer();
              this.routes = [];
              this.isNavigating = false;
              this.navigation = [];
              this.isConfigured = false;
            },
            writable: true,
            configurable: true
          }
        });
        return Router;
      })());
    }
  };
});

System.register("github:aurelia/router@0.6.0/index", ["github:aurelia/router@0.6.0/router", "github:aurelia/router@0.6.0/app-router", "github:aurelia/router@0.6.0/pipeline-provider", "github:aurelia/router@0.6.0/navigation-commands", "github:aurelia/router@0.6.0/route-loading", "github:aurelia/router@0.6.0/router-configuration", "github:aurelia/router@0.6.0/navigation-plan", "github:aurelia/router@0.6.0/route-filters"], function(_export) {
  return {
    setters: [function(_router) {
      _export("Router", _router.Router);
    }, function(_appRouter) {
      _export("AppRouter", _appRouter.AppRouter);
    }, function(_pipelineProvider) {
      _export("PipelineProvider", _pipelineProvider.PipelineProvider);
    }, function(_navigationCommands) {
      _export("Redirect", _navigationCommands.Redirect);
    }, function(_routeLoading) {
      _export("RouteLoader", _routeLoading.RouteLoader);
    }, function(_routerConfiguration) {
      _export("RouterConfiguration", _routerConfiguration.RouterConfiguration);
    }, function(_navigationPlan) {
      _export("NO_CHANGE", _navigationPlan.NO_CHANGE);
      _export("INVOKE_LIFECYCLE", _navigationPlan.INVOKE_LIFECYCLE);
      _export("REPLACE", _navigationPlan.REPLACE);
    }, function(_routeFilters) {
      _export("RouteFilterContainer", _routeFilters.RouteFilterContainer);
      _export("createRouteFilterStep", _routeFilters.createRouteFilterStep);
    }],
    execute: function() {
      "use strict";
    }
  };
});

System.register("github:aurelia/router@0.6.0", ["github:aurelia/router@0.6.0/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/http-client@0.6.0/headers", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      Headers;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Headers = _export("Headers", (function() {
        function Headers() {
          var headers = arguments[0] === undefined ? {} : arguments[0];
          _classCallCheck(this, Headers);
          this.headers = headers;
        }
        _prototypeProperties(Headers, {parse: {
            value: function parse(headerStr) {
              var headers = new Headers();
              if (!headerStr) {
                return headers;
              }
              var headerPairs = headerStr.split("\r\n");
              for (var i = 0; i < headerPairs.length; i++) {
                var headerPair = headerPairs[i];
                var index = headerPair.indexOf(": ");
                if (index > 0) {
                  var key = headerPair.substring(0, index);
                  var val = headerPair.substring(index + 2);
                  headers.add(key, val);
                }
              }
              return headers;
            },
            writable: true,
            configurable: true
          }}, {
          add: {
            value: function add(key, value) {
              this.headers[key] = value;
            },
            writable: true,
            configurable: true
          },
          get: {
            value: function get(key) {
              return this.headers[key];
            },
            writable: true,
            configurable: true
          },
          clear: {
            value: function clear() {
              this.headers = {};
            },
            writable: true,
            configurable: true
          },
          configureXHR: {
            value: function configureXHR(xhr) {
              var headers = this.headers,
                  key;
              for (key in headers) {
                xhr.setRequestHeader(key, headers[key]);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return Headers;
      })());
    }
  };
});

System.register("github:aurelia/http-client@0.6.0/http-response-message", ["github:aurelia/http-client@0.6.0/headers"], function(_export) {
  var Headers,
      _prototypeProperties,
      _classCallCheck,
      HttpResponseMessage;
  return {
    setters: [function(_headers) {
      Headers = _headers.Headers;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      HttpResponseMessage = _export("HttpResponseMessage", (function() {
        function HttpResponseMessage(requestMessage, xhr, responseType, reviver) {
          _classCallCheck(this, HttpResponseMessage);
          this.requestMessage = requestMessage;
          this.statusCode = xhr.status;
          this.response = xhr.response;
          this.isSuccess = xhr.status >= 200 && xhr.status < 400;
          this.statusText = xhr.statusText;
          this.responseType = responseType;
          this.reviver = reviver;
          if (xhr.getAllResponseHeaders) {
            this.headers = Headers.parse(xhr.getAllResponseHeaders());
          } else {
            this.headers = new Headers();
          }
        }
        _prototypeProperties(HttpResponseMessage, null, {content: {
            get: function() {
              try {
                if (this._content !== undefined) {
                  return this._content;
                }
                if (this.response === undefined || this.response === null) {
                  return this._content = this.response;
                }
                if (this.responseType === "json") {
                  return this._content = JSON.parse(this.response, this.reviver);
                }
                if (this.reviver) {
                  return this._content = this.reviver(this.response);
                }
                return this._content = this.response;
              } catch (e) {
                if (this.isSuccess) {
                  throw e;
                }
                return this._content = null;
              }
            },
            configurable: true
          }});
        return HttpResponseMessage;
      })());
    }
  };
});

System.register("github:aurelia/http-client@0.6.0/transformers", [], function(_export) {
  _export("timeoutTransformer", timeoutTransformer);
  _export("callbackParameterNameTransformer", callbackParameterNameTransformer);
  _export("credentialsTransformer", credentialsTransformer);
  _export("progressTransformer", progressTransformer);
  _export("responseTypeTransformer", responseTypeTransformer);
  _export("headerTransformer", headerTransformer);
  _export("contentTransformer", contentTransformer);
  function timeoutTransformer(client, processor, message, xhr) {
    if (message.timeout !== undefined) {
      xhr.timeout = message.timeout;
    }
  }
  function callbackParameterNameTransformer(client, processor, message, xhr) {
    if (message.callbackParameterName !== undefined) {
      xhr.callbackParameterName = message.callbackParameterName;
    }
  }
  function credentialsTransformer(client, processor, message, xhr) {
    if (message.withCredentials !== undefined) {
      xhr.withCredentials = message.withCredentials;
    }
  }
  function progressTransformer(client, processor, message, xhr) {
    if (message.progressCallback) {
      xhr.upload.onprogress = message.progressCallback;
    }
  }
  function responseTypeTransformer(client, processor, message, xhr) {
    var responseType = message.responseType;
    if (responseType === "json") {
      responseType = "text";
    }
    xhr.responseType = responseType;
  }
  function headerTransformer(client, processor, message, xhr) {
    message.headers.configureXHR(xhr);
  }
  function contentTransformer(client, processor, message, xhr) {
    if (window.FormData && message.content instanceof FormData) {
      return ;
    }
    if (window.Blob && message.content instanceof Blob) {
      return ;
    }
    if (window.ArrayBufferView && message.content instanceof ArrayBufferView) {
      return ;
    }
    if (message.content instanceof Document) {
      return ;
    }
    if (typeof message.content === "string") {
      return ;
    }
    if (message.content === null || message.content === undefined) {
      return ;
    }
    message.content = JSON.stringify(message.content, message.replacer);
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
    }
  };
});

System.register("github:aurelia/http-client@0.6.0/jsonp-request-message", ["github:aurelia/http-client@0.6.0/headers", "github:aurelia/http-client@0.6.0/request-message-processor", "github:aurelia/http-client@0.6.0/transformers"], function(_export) {
  var Headers,
      RequestMessageProcessor,
      timeoutTransformer,
      callbackParameterNameTransformer,
      _prototypeProperties,
      _classCallCheck,
      JSONPRequestMessage,
      JSONPXHR;
  _export("createJSONPRequestMessageProcessor", createJSONPRequestMessageProcessor);
  function createJSONPRequestMessageProcessor() {
    return new RequestMessageProcessor(JSONPXHR, [timeoutTransformer, callbackParameterNameTransformer]);
  }
  return {
    setters: [function(_headers) {
      Headers = _headers.Headers;
    }, function(_requestMessageProcessor) {
      RequestMessageProcessor = _requestMessageProcessor.RequestMessageProcessor;
    }, function(_transformers) {
      timeoutTransformer = _transformers.timeoutTransformer;
      callbackParameterNameTransformer = _transformers.callbackParameterNameTransformer;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      JSONPRequestMessage = _export("JSONPRequestMessage", function JSONPRequestMessage(uri, callbackParameterName) {
        _classCallCheck(this, JSONPRequestMessage);
        this.method = "JSONP";
        this.uri = uri;
        this.content = undefined;
        this.headers = new Headers();
        this.responseType = "jsonp";
        this.callbackParameterName = callbackParameterName;
      });
      JSONPXHR = (function() {
        function JSONPXHR() {
          _classCallCheck(this, JSONPXHR);
        }
        _prototypeProperties(JSONPXHR, null, {
          open: {
            value: function open(method, uri) {
              this.method = method;
              this.uri = uri;
              this.callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
            },
            writable: true,
            configurable: true
          },
          send: {
            value: function send() {
              var _this = this;
              var uri = this.uri + (this.uri.indexOf("?") >= 0 ? "&" : "?") + this.callbackParameterName + "=" + this.callbackName;
              window[this.callbackName] = function(data) {
                delete window[_this.callbackName];
                document.body.removeChild(script);
                if (_this.status === undefined) {
                  _this.status = 200;
                  _this.statusText = "OK";
                  _this.response = data;
                  _this.onload(_this);
                }
              };
              var script = document.createElement("script");
              script.src = uri;
              document.body.appendChild(script);
              if (this.timeout !== undefined) {
                setTimeout(function() {
                  if (_this.status === undefined) {
                    _this.status = 0;
                    _this.ontimeout(new Error("timeout"));
                  }
                }, this.timeout);
              }
            },
            writable: true,
            configurable: true
          },
          abort: {
            value: function abort() {
              if (this.status === undefined) {
                this.status = 0;
                this.onabort(new Error("abort"));
              }
            },
            writable: true,
            configurable: true
          },
          setRequestHeader: {
            value: function setRequestHeader() {},
            writable: true,
            configurable: true
          }
        });
        return JSONPXHR;
      })();
    }
  };
});

System.register("github:aurelia/http-client@0.6.0/request-message-processor", ["github:aurelia/http-client@0.6.0/http-response-message", "github:aurelia/path@0.4.6"], function(_export) {
  var HttpResponseMessage,
      join,
      buildQueryString,
      _prototypeProperties,
      _classCallCheck,
      RequestMessageProcessor;
  function buildFullUri(message) {
    var uri = join(message.baseUri, message.uri),
        qs;
    if (message.params) {
      qs = buildQueryString(message.params);
      uri = qs ? "" + uri + "?" + qs : uri;
    }
    message.fullUri = uri;
  }
  return {
    setters: [function(_httpResponseMessage) {
      HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
    }, function(_aureliaPath) {
      join = _aureliaPath.join;
      buildQueryString = _aureliaPath.buildQueryString;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      RequestMessageProcessor = _export("RequestMessageProcessor", (function() {
        function RequestMessageProcessor(xhrType, transformers) {
          _classCallCheck(this, RequestMessageProcessor);
          this.XHRType = xhrType;
          this.transformers = transformers;
        }
        _prototypeProperties(RequestMessageProcessor, null, {
          abort: {
            value: function abort() {
              if (this.xhr) {
                this.xhr.abort();
              }
            },
            writable: true,
            configurable: true
          },
          process: {
            value: function process(client, message) {
              var _this = this;
              return new Promise(function(resolve, reject) {
                var xhr = _this.xhr = new _this.XHRType(),
                    transformers = _this.transformers,
                    i,
                    ii;
                buildFullUri(message);
                xhr.open(message.method, message.fullUri, true);
                for (i = 0, ii = transformers.length; i < ii; ++i) {
                  transformers[i](client, _this, message, xhr);
                }
                xhr.onload = function(e) {
                  var response = new HttpResponseMessage(message, xhr, message.responseType, message.reviver);
                  if (response.isSuccess) {
                    resolve(response);
                  } else {
                    reject(response);
                  }
                };
                xhr.ontimeout = function(e) {
                  reject(new HttpResponseMessage(message, {
                    response: e,
                    status: xhr.status,
                    statusText: xhr.statusText
                  }, "timeout"));
                };
                xhr.onerror = function(e) {
                  reject(new HttpResponseMessage(message, {
                    response: e,
                    status: xhr.status,
                    statusText: xhr.statusText
                  }, "error"));
                };
                xhr.onabort = function(e) {
                  reject(new HttpResponseMessage(message, {
                    response: e,
                    status: xhr.status,
                    statusText: xhr.statusText
                  }, "abort"));
                };
                xhr.send(message.content);
              });
            },
            writable: true,
            configurable: true
          }
        });
        return RequestMessageProcessor;
      })());
    }
  };
});

System.register("github:aurelia/http-client@0.6.0/http-request-message", ["github:aurelia/http-client@0.6.0/headers", "github:aurelia/http-client@0.6.0/request-message-processor", "github:aurelia/http-client@0.6.0/transformers"], function(_export) {
  var Headers,
      RequestMessageProcessor,
      timeoutTransformer,
      credentialsTransformer,
      progressTransformer,
      responseTypeTransformer,
      headerTransformer,
      contentTransformer,
      _classCallCheck,
      HttpRequestMessage;
  _export("createHttpRequestMessageProcessor", createHttpRequestMessageProcessor);
  function createHttpRequestMessageProcessor() {
    return new RequestMessageProcessor(XMLHttpRequest, [timeoutTransformer, credentialsTransformer, progressTransformer, responseTypeTransformer, headerTransformer, contentTransformer]);
  }
  return {
    setters: [function(_headers) {
      Headers = _headers.Headers;
    }, function(_requestMessageProcessor) {
      RequestMessageProcessor = _requestMessageProcessor.RequestMessageProcessor;
    }, function(_transformers) {
      timeoutTransformer = _transformers.timeoutTransformer;
      credentialsTransformer = _transformers.credentialsTransformer;
      progressTransformer = _transformers.progressTransformer;
      responseTypeTransformer = _transformers.responseTypeTransformer;
      headerTransformer = _transformers.headerTransformer;
      contentTransformer = _transformers.contentTransformer;
    }],
    execute: function() {
      "use strict";
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      HttpRequestMessage = _export("HttpRequestMessage", function HttpRequestMessage(method, uri, content, headers) {
        _classCallCheck(this, HttpRequestMessage);
        this.method = method;
        this.uri = uri;
        this.content = content;
        this.headers = headers || new Headers();
        this.responseType = "json";
      });
    }
  };
});

System.register("github:aurelia/http-client@0.6.0/request-builder", ["github:aurelia/path@0.4.6", "github:aurelia/http-client@0.6.0/http-request-message", "github:aurelia/http-client@0.6.0/jsonp-request-message"], function(_export) {
  var join,
      HttpRequestMessage,
      JSONPRequestMessage,
      _prototypeProperties,
      _classCallCheck,
      RequestBuilder;
  return {
    setters: [function(_aureliaPath) {
      join = _aureliaPath.join;
    }, function(_httpRequestMessage) {
      HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
    }, function(_jsonpRequestMessage) {
      JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      RequestBuilder = _export("RequestBuilder", (function() {
        function RequestBuilder(client) {
          _classCallCheck(this, RequestBuilder);
          this.client = client;
          this.transformers = client.requestTransformers.slice(0);
          this.useJsonp = false;
        }
        _prototypeProperties(RequestBuilder, {addHelper: {
            value: function addHelper(name, fn) {
              RequestBuilder.prototype[name] = function() {
                this.transformers.push(fn.apply(this, arguments));
                return this;
              };
            },
            writable: true,
            configurable: true
          }}, {send: {
            value: function send() {
              var message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
              return this.client.send(message, this.transformers);
            },
            writable: true,
            configurable: true
          }});
        return RequestBuilder;
      })());
      RequestBuilder.addHelper("asDelete", function() {
        return function(client, processor, message) {
          message.method = "DELETE";
        };
      });
      RequestBuilder.addHelper("asGet", function() {
        return function(client, processor, message) {
          message.method = "GET";
        };
      });
      RequestBuilder.addHelper("asHead", function() {
        return function(client, processor, message) {
          message.method = "HEAD";
        };
      });
      RequestBuilder.addHelper("asOptions", function() {
        return function(client, processor, message) {
          message.method = "OPTIONS";
        };
      });
      RequestBuilder.addHelper("asPatch", function() {
        return function(client, processor, message) {
          message.method = "PATCH";
        };
      });
      RequestBuilder.addHelper("asPost", function() {
        return function(client, processor, message) {
          message.method = "POST";
        };
      });
      RequestBuilder.addHelper("asPut", function() {
        return function(client, processor, message) {
          message.method = "PUT";
        };
      });
      RequestBuilder.addHelper("asJsonp", function(callbackParameterName) {
        this.useJsonp = true;
        return function(client, processor, message) {
          message.callbackParameterName = callbackParameterName;
        };
      });
      RequestBuilder.addHelper("withUri", function(uri) {
        return function(client, processor, message) {
          message.uri = uri;
        };
      });
      RequestBuilder.addHelper("withContent", function(content) {
        return function(client, processor, message) {
          message.content = content;
        };
      });
      RequestBuilder.addHelper("withBaseUri", function(baseUri) {
        return function(client, processor, message) {
          message.baseUri = baseUri;
        };
      });
      RequestBuilder.addHelper("withParams", function(params) {
        return function(client, processor, message) {
          message.params = params;
        };
      });
      RequestBuilder.addHelper("withResponseType", function(responseType) {
        return function(client, processor, message) {
          message.responseType = responseType;
        };
      });
      RequestBuilder.addHelper("withTimeout", function(timeout) {
        return function(client, processor, message) {
          message.timeout = timeout;
        };
      });
      RequestBuilder.addHelper("withHeader", function(key, value) {
        return function(client, processor, message) {
          message.headers.add(key, value);
        };
      });
      RequestBuilder.addHelper("withCredentials", function(value) {
        return function(client, processor, message) {
          message.withCredentials = value;
        };
      });
      RequestBuilder.addHelper("withReviver", function(reviver) {
        return function(client, processor, message) {
          message.reviver = reviver;
        };
      });
      RequestBuilder.addHelper("withReplacer", function(replacer) {
        return function(client, processor, message) {
          message.replacer = replacer;
        };
      });
      RequestBuilder.addHelper("withProgressCallback", function(progressCallback) {
        return function(client, processor, message) {
          message.progressCallback = progressCallback;
        };
      });
      RequestBuilder.addHelper("withCallbackParameterName", function(callbackParameterName) {
        return function(client, processor, message) {
          message.callbackParameterName = callbackParameterName;
        };
      });
    }
  };
});

System.register("github:aurelia/http-client@0.6.0/http-client", ["github:aurelia/http-client@0.6.0/headers", "github:aurelia/http-client@0.6.0/request-builder", "github:aurelia/http-client@0.6.0/http-request-message", "github:aurelia/http-client@0.6.0/jsonp-request-message"], function(_export) {
  var Headers,
      RequestBuilder,
      HttpRequestMessage,
      createHttpRequestMessageProcessor,
      JSONPRequestMessage,
      createJSONPRequestMessageProcessor,
      _prototypeProperties,
      _classCallCheck,
      HttpClient;
  function trackRequestStart(client, processor) {
    client.pendingRequests.push(processor);
    client.isRequesting = true;
  }
  function trackRequestEnd(client, processor) {
    var index = client.pendingRequests.indexOf(processor);
    client.pendingRequests.splice(index, 1);
    client.isRequesting = client.pendingRequests.length > 0;
    if (!client.isRequesting) {
      var evt = new window.CustomEvent("aurelia-http-client-requests-drained", {
        bubbles: true,
        cancelable: true
      });
      setTimeout(function() {
        return document.dispatchEvent(evt);
      }, 1);
    }
  }
  return {
    setters: [function(_headers) {
      Headers = _headers.Headers;
    }, function(_requestBuilder) {
      RequestBuilder = _requestBuilder.RequestBuilder;
    }, function(_httpRequestMessage) {
      HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
      createHttpRequestMessageProcessor = _httpRequestMessage.createHttpRequestMessageProcessor;
    }, function(_jsonpRequestMessage) {
      JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
      createJSONPRequestMessageProcessor = _jsonpRequestMessage.createJSONPRequestMessageProcessor;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      HttpClient = _export("HttpClient", (function() {
        function HttpClient() {
          _classCallCheck(this, HttpClient);
          this.requestTransformers = [];
          this.requestProcessorFactories = new Map();
          this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
          this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
          this.pendingRequests = [];
          this.isRequesting = false;
        }
        _prototypeProperties(HttpClient, null, {
          configure: {
            value: function configure(fn) {
              var builder = new RequestBuilder(this);
              fn(builder);
              this.requestTransformers = builder.transformers;
              return this;
            },
            writable: true,
            configurable: true
          },
          createRequest: {
            value: function createRequest(uri) {
              var builder = new RequestBuilder(this);
              if (uri) {
                builder.withUri(uri);
              }
              return builder;
            },
            writable: true,
            configurable: true
          },
          send: {
            value: function send(message, transformers) {
              var _this = this;
              var createProcessor = this.requestProcessorFactories.get(message.constructor),
                  processor,
                  promise,
                  i,
                  ii;
              if (!createProcessor) {
                throw new Error("No request message processor factory for " + message.constructor + ".");
              }
              processor = createProcessor();
              trackRequestStart(this, processor);
              transformers = transformers || this.requestTransformers;
              for (i = 0, ii = transformers.length; i < ii; ++i) {
                transformers[i](this, processor, message);
              }
              promise = processor.process(this, message);
              promise.abort = promise.cancel = function() {
                processor.abort();
              };
              return promise.then(function(response) {
                trackRequestEnd(_this, processor);
                return response;
              })["catch"](function(response) {
                trackRequestEnd(_this, processor);
                throw response;
              });
            },
            writable: true,
            configurable: true
          },
          "delete": {
            value: function _delete(uri) {
              return this.createRequest(uri).asDelete().send();
            },
            writable: true,
            configurable: true
          },
          get: {
            value: function get(uri) {
              return this.createRequest(uri).asGet().send();
            },
            writable: true,
            configurable: true
          },
          head: {
            value: function head(uri) {
              return this.createRequest(uri).asHead().send();
            },
            writable: true,
            configurable: true
          },
          jsonp: {
            value: function jsonp(uri) {
              var callbackParameterName = arguments[1] === undefined ? "jsoncallback" : arguments[1];
              return this.createRequest(uri).asJsonp(callbackParameterName).send();
            },
            writable: true,
            configurable: true
          },
          options: {
            value: function options(uri) {
              return this.createRequest(uri).asOptions().send();
            },
            writable: true,
            configurable: true
          },
          put: {
            value: function put(uri, content) {
              return this.createRequest(uri).asPut().withContent(content).send();
            },
            writable: true,
            configurable: true
          },
          patch: {
            value: function patch(uri, content) {
              return this.createRequest(uri).asPatch().withContent(content).send();
            },
            writable: true,
            configurable: true
          },
          post: {
            value: function post(uri, content) {
              return this.createRequest(uri).asPost().withContent(content).send();
            },
            writable: true,
            configurable: true
          }
        });
        return HttpClient;
      })());
    }
  };
});

System.register("github:aurelia/http-client@0.6.0/index", ["github:aurelia/http-client@0.6.0/http-client", "github:aurelia/http-client@0.6.0/http-request-message", "github:aurelia/http-client@0.6.0/http-response-message", "github:aurelia/http-client@0.6.0/jsonp-request-message", "github:aurelia/http-client@0.6.0/headers", "github:aurelia/http-client@0.6.0/request-builder"], function(_export) {
  return {
    setters: [function(_httpClient) {
      _export("HttpClient", _httpClient.HttpClient);
    }, function(_httpRequestMessage) {
      _export("HttpRequestMessage", _httpRequestMessage.HttpRequestMessage);
    }, function(_httpResponseMessage) {
      _export("HttpResponseMessage", _httpResponseMessage.HttpResponseMessage);
    }, function(_jsonpRequestMessage) {
      _export("JSONPRequestMessage", _jsonpRequestMessage.JSONPRequestMessage);
    }, function(_headers) {
      _export("Headers", _headers.Headers);
    }, function(_requestBuilder) {
      _export("RequestBuilder", _requestBuilder.RequestBuilder);
    }],
    execute: function() {
      "use strict";
    }
  };
});

System.register("github:aurelia/http-client@0.6.0", ["github:aurelia/http-client@0.6.0/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/loader@0.4.0/loader", ["github:aurelia/loader@0.4.0/template-registry-entry"], function(_export) {
  var TemplateRegistryEntry,
      _prototypeProperties,
      _classCallCheck,
      hasTemplateElement,
      Loader;
  function importElements(frag, link, callback) {
    document.head.appendChild(frag);
    if (window.Polymer && Polymer.whenReady) {
      Polymer.whenReady(callback);
    } else {
      link.addEventListener("load", callback);
    }
  }
  return {
    setters: [function(_templateRegistryEntry) {
      TemplateRegistryEntry = _templateRegistryEntry.TemplateRegistryEntry;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      hasTemplateElement = "content" in document.createElement("template");
      Loader = _export("Loader", (function() {
        function Loader() {
          _classCallCheck(this, Loader);
          this.templateRegistry = {};
        }
        _prototypeProperties(Loader, null, {
          loadModule: {
            value: function loadModule(id) {
              throw new Error("Loaders must implement loadModule(id).");
            },
            writable: true,
            configurable: true
          },
          loadAllModules: {
            value: function loadAllModules(ids) {
              throw new Error("Loader must implement loadAllModules(ids).");
            },
            writable: true,
            configurable: true
          },
          loadTemplate: {
            value: function loadTemplate(url) {
              throw new Error("Loader must implement loadTemplate(url).");
            },
            writable: true,
            configurable: true
          },
          getOrCreateTemplateRegistryEntry: {
            value: function getOrCreateTemplateRegistryEntry(id) {
              var entry = this.templateRegistry[id];
              if (entry === undefined) {
                this.templateRegistry[id] = entry = new TemplateRegistryEntry(id);
              }
              return entry;
            },
            writable: true,
            configurable: true
          },
          importDocument: {
            value: function importDocument(url) {
              return new Promise(function(resolve, reject) {
                var frag = document.createDocumentFragment();
                var link = document.createElement("link");
                link.rel = "import";
                link.href = url;
                frag.appendChild(link);
                importElements(frag, link, function() {
                  return resolve(link["import"]);
                });
              });
            },
            writable: true,
            configurable: true
          },
          importTemplate: {
            value: function importTemplate(url) {
              var _this = this;
              return this.importDocument(url).then(function(doc) {
                return _this.findTemplate(doc, url);
              });
            },
            writable: true,
            configurable: true
          },
          findTemplate: {
            value: function findTemplate(doc, url) {
              if (!hasTemplateElement) {
                HTMLTemplateElement.bootstrap(doc);
              }
              var template = doc.querySelector("template");
              if (!template) {
                throw new Error("There was no template element found in '" + url + "'.");
              }
              return template;
            },
            writable: true,
            configurable: true
          }
        });
        return Loader;
      })());
    }
  };
});

System.register("github:aurelia/framework@0.9.0/plugins", ["github:aurelia/logging@0.2.6", "github:aurelia/metadata@0.3.4"], function(_export) {
  var LogManager,
      Metadata,
      _prototypeProperties,
      _classCallCheck,
      logger,
      Plugins;
  function loadPlugin(aurelia, loader, info) {
    logger.debug("Loading plugin " + info.moduleId + ".");
    aurelia.currentPluginId = info.moduleId;
    return loader.loadModule(info.moduleId).then(function(exportedValue) {
      if ("install" in exportedValue) {
        var result = exportedValue.install(aurelia, info.config || {});
        if (result) {
          return result.then(function() {
            aurelia.currentPluginId = null;
            logger.debug("Installed plugin " + info.moduleId + ".");
          });
        } else {
          logger.debug("Installed plugin " + info.moduleId + ".");
        }
      } else {
        logger.debug("Loaded plugin " + info.moduleId + ".");
      }
      aurelia.currentPluginId = null;
    });
  }
  return {
    setters: [function(_aureliaLogging) {
      LogManager = _aureliaLogging;
    }, function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      logger = LogManager.getLogger("aurelia");
      Plugins = _export("Plugins", (function() {
        function Plugins(aurelia) {
          _classCallCheck(this, Plugins);
          this.aurelia = aurelia;
          this.info = [];
          this.processed = false;
        }
        _prototypeProperties(Plugins, null, {
          plugin: {
            value: (function(_plugin) {
              var _pluginWrapper = function plugin(_x, _x2) {
                return _plugin.apply(this, arguments);
              };
              _pluginWrapper.toString = function() {
                return _plugin.toString();
              };
              return _pluginWrapper;
            })(function(moduleId, config) {
              var plugin = {
                moduleId: moduleId,
                config: config || {}
              };
              if (this.processed) {
                loadPlugin(this.aurelia, this.aurelia.loader, plugin);
              } else {
                this.info.push(plugin);
              }
              return this;
            }),
            writable: true,
            configurable: true
          },
          es5: {
            value: function es5() {
              Function.prototype.computed = function(computedProperties) {
                for (var key in computedProperties) {
                  if (computedProperties.hasOwnProperty(key)) {
                    Object.defineProperty(this.prototype, key, {
                      get: computedProperties[key],
                      enumerable: true
                    });
                  }
                }
              };
              return this;
            },
            writable: true,
            configurable: true
          },
          atscript: {
            value: function atscript() {
              this.aurelia.container.supportAtScript();
              Metadata.configure.locator(function(fn) {
                return fn.annotate || fn.annotations;
              });
              return this;
            },
            writable: true,
            configurable: true
          },
          _process: {
            value: function _process() {
              var _this = this;
              var aurelia = this.aurelia,
                  loader = aurelia.loader,
                  info = this.info,
                  current;
              if (this.processed) {
                return ;
              }
              var next = function() {
                if (current = info.shift()) {
                  return loadPlugin(aurelia, loader, current).then(next);
                }
                _this.processed = true;
                return Promise.resolve();
              };
              return next();
            },
            writable: true,
            configurable: true
          }
        });
        return Plugins;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/util", [], function(_export) {
  var capitalMatcher;
  _export("hyphenate", hyphenate);
  function addHyphenAndLower(char) {
    return "-" + char.toLowerCase();
  }
  function hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      capitalMatcher = /([A-Z])/g;
    }
  };
});

System.register("github:aurelia/binding@0.4.0/value-converter", ["github:aurelia/metadata@0.3.4"], function(_export) {
  var ResourceType,
      _prototypeProperties,
      _inherits,
      _classCallCheck,
      ValueConverter;
  function camelCase(name) {
    return name.charAt(0).toLowerCase() + name.slice(1);
  }
  return {
    setters: [function(_aureliaMetadata) {
      ResourceType = _aureliaMetadata.ResourceType;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      if (typeof String.prototype.endsWith !== "function") {
        String.prototype.endsWith = function(suffix) {
          return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
      }
      ValueConverter = _export("ValueConverter", (function(ResourceType) {
        function ValueConverter(name) {
          _classCallCheck(this, ValueConverter);
          this.name = name;
        }
        _inherits(ValueConverter, ResourceType);
        _prototypeProperties(ValueConverter, {convention: {
            value: function convention(name) {
              if (name.endsWith("ValueConverter")) {
                return new ValueConverter(camelCase(name.substring(0, name.length - 14)));
              }
            },
            writable: true,
            configurable: true
          }}, {
          analyze: {
            value: function analyze(container, target) {
              this.instance = container.get(target);
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              registry.registerValueConverter(name || this.name, this.instance);
            },
            writable: true,
            configurable: true
          },
          load: {
            value: function load(container, target) {
              return Promise.resolve(this);
            },
            writable: true,
            configurable: true
          }
        });
        return ValueConverter;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/binding@0.4.0/event-manager", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      DefaultEventStrategy,
      EventManager;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      DefaultEventStrategy = (function() {
        function DefaultEventStrategy() {
          _classCallCheck(this, DefaultEventStrategy);
          this.delegatedEvents = {};
        }
        _prototypeProperties(DefaultEventStrategy, null, {
          ensureDelegatedEvent: {
            value: function ensureDelegatedEvent(eventName) {
              if (this.delegatedEvents[eventName]) {
                return ;
              }
              this.delegatedEvents[eventName] = true;
              document.addEventListener(eventName, this.handleDelegatedEvent.bind(this), false);
            },
            writable: true,
            configurable: true
          },
          handleCallbackResult: {
            value: function handleCallbackResult(result) {},
            writable: true,
            configurable: true
          },
          handleDelegatedEvent: {
            value: function handleDelegatedEvent(event) {
              event = event || window.event;
              var target = event.target || event.srcElement,
                  callback;
              while (target && !callback) {
                if (target.delegatedEvents) {
                  callback = target.delegatedEvents[event.type];
                }
                if (!callback) {
                  target = target.parentNode;
                }
              }
              if (callback) {
                this.handleCallbackResult(callback(event));
              }
            },
            writable: true,
            configurable: true
          },
          createDirectEventCallback: {
            value: function createDirectEventCallback(callback) {
              var _this = this;
              return function(event) {
                _this.handleCallbackResult(callback(event));
              };
            },
            writable: true,
            configurable: true
          },
          subscribeToDelegatedEvent: {
            value: function subscribeToDelegatedEvent(target, targetEvent, callback) {
              var lookup = target.delegatedEvents || (target.delegatedEvents = {});
              this.ensureDelegatedEvent(targetEvent);
              lookup[targetEvent] = callback;
              return function() {
                lookup[targetEvent] = null;
              };
            },
            writable: true,
            configurable: true
          },
          subscribeToDirectEvent: {
            value: function subscribeToDirectEvent(target, targetEvent, callback) {
              var directEventCallback = this.createDirectEventCallback(callback);
              target.addEventListener(targetEvent, directEventCallback, false);
              return function() {
                target.removeEventListener(targetEvent, directEventCallback);
              };
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(target, targetEvent, callback, delegate) {
              if (delegate) {
                return this.subscribeToDirectEvent(target, targetEvent, callback);
              } else {
                return this.subscribeToDelegatedEvent(target, targetEvent, callback);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return DefaultEventStrategy;
      })();
      EventManager = _export("EventManager", (function() {
        function EventManager() {
          _classCallCheck(this, EventManager);
          this.elementHandlerLookup = {};
          this.eventStrategyLookup = {};
          this.registerElementConfig({
            tagName: "input",
            properties: {
              value: ["change", "input"],
              checked: ["change", "input"]
            }
          });
          this.registerElementConfig({
            tagName: "textarea",
            properties: {value: ["change", "input"]}
          });
          this.registerElementConfig({
            tagName: "select",
            properties: {value: ["change"]}
          });
          this.defaultEventStrategy = new DefaultEventStrategy();
        }
        _prototypeProperties(EventManager, null, {
          registerElementConfig: {
            value: function registerElementConfig(config) {
              var tagName = config.tagName.toLowerCase(),
                  properties = config.properties,
                  propertyName;
              this.elementHandlerLookup[tagName] = {};
              for (propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                  this.registerElementPropertyConfig(tagName, propertyName, properties[propertyName]);
                }
              }
            },
            writable: true,
            configurable: true
          },
          registerElementPropertyConfig: {
            value: function registerElementPropertyConfig(tagName, propertyName, events) {
              this.elementHandlerLookup[tagName][propertyName] = {subscribe: function subscribe(target, callback) {
                  events.forEach(function(changeEvent) {
                    target.addEventListener(changeEvent, callback, false);
                  });
                  return function() {
                    events.forEach(function(changeEvent) {
                      target.removeEventListener(changeEvent, callback);
                    });
                  };
                }};
            },
            writable: true,
            configurable: true
          },
          registerElementHandler: {
            value: function registerElementHandler(tagName, handler) {
              this.elementHandlerLookup[tagName.toLowerCase()] = handler;
            },
            writable: true,
            configurable: true
          },
          registerEventStrategy: {
            value: function registerEventStrategy(eventName, strategy) {
              this.eventStrategyLookup[eventName] = strategy;
            },
            writable: true,
            configurable: true
          },
          getElementHandler: {
            value: function getElementHandler(target, propertyName) {
              var tagName,
                  lookup = this.elementHandlerLookup;
              if (target.tagName) {
                tagName = target.tagName.toLowerCase();
                if (lookup[tagName] && lookup[tagName][propertyName]) {
                  return lookup[tagName][propertyName];
                }
                if (propertyName === "textContent" || propertyName === "innerHTML") {
                  return lookup.input.value;
                }
              }
              return null;
            },
            writable: true,
            configurable: true
          },
          addEventListener: {
            value: function addEventListener(target, targetEvent, callback, delegate) {
              return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callback, delegate);
            },
            writable: true,
            configurable: true
          }
        });
        return EventManager;
      })());
    }
  };
});

System.register("github:aurelia/task-queue@0.2.5/index", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      BrowserMutationObserver,
      hasSetImmediate,
      TaskQueue;
  function makeRequestFlushFromMutationObserver(flush) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestFlush() {
      toggle = -toggle;
      node.data = toggle;
    };
  }
  function makeRequestFlushFromTimer(flush) {
    return function requestFlush() {
      var timeoutHandle = setTimeout(handleFlushTimer, 0);
      var intervalHandle = setInterval(handleFlushTimer, 50);
      function handleFlushTimer() {
        clearTimeout(timeoutHandle);
        clearInterval(intervalHandle);
        flush();
      }
    };
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      hasSetImmediate = typeof setImmediate === "function";
      TaskQueue = _export("TaskQueue", (function() {
        function TaskQueue() {
          var _this = this;
          _classCallCheck(this, TaskQueue);
          this.microTaskQueue = [];
          this.microTaskQueueCapacity = 1024;
          this.taskQueue = [];
          if (typeof BrowserMutationObserver === "function") {
            this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(function() {
              return _this.flushMicroTaskQueue();
            });
          } else {
            this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(function() {
              return _this.flushMicroTaskQueue();
            });
          }
          this.requestFlushTaskQueue = makeRequestFlushFromTimer(function() {
            return _this.flushTaskQueue();
          });
        }
        _prototypeProperties(TaskQueue, null, {
          queueMicroTask: {
            value: function queueMicroTask(task) {
              if (this.microTaskQueue.length < 1) {
                this.requestFlushMicroTaskQueue();
              }
              this.microTaskQueue.push(task);
            },
            writable: true,
            configurable: true
          },
          queueTask: {
            value: function queueTask(task) {
              if (this.taskQueue.length < 1) {
                this.requestFlushTaskQueue();
              }
              this.taskQueue.push(task);
            },
            writable: true,
            configurable: true
          },
          flushTaskQueue: {
            value: function flushTaskQueue() {
              var queue = this.taskQueue,
                  index = 0,
                  task;
              this.taskQueue = [];
              while (index < queue.length) {
                task = queue[index];
                try {
                  task.call();
                } catch (error) {
                  this.onError(error, task);
                }
                index++;
              }
            },
            writable: true,
            configurable: true
          },
          flushMicroTaskQueue: {
            value: function flushMicroTaskQueue() {
              var queue = this.microTaskQueue,
                  capacity = this.microTaskQueueCapacity,
                  index = 0,
                  task;
              while (index < queue.length) {
                task = queue[index];
                try {
                  task.call();
                } catch (error) {
                  this.onError(error, task);
                }
                index++;
                if (index > capacity) {
                  for (var scan = 0; scan < index; scan++) {
                    queue[scan] = queue[scan + index];
                  }
                  queue.length -= index;
                  index = 0;
                }
              }
              queue.length = 0;
            },
            writable: true,
            configurable: true
          },
          onError: {
            value: function onError(error, task) {
              if ("onError" in task) {
                task.onError(error);
              } else if (hasSetImmediate) {
                setImmediate(function() {
                  throw error;
                });
              } else {
                setTimeout(function() {
                  throw error;
                }, 0);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return TaskQueue;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.4.0/array-change-records", [], function(_export) {
  var EDIT_LEAVE,
      EDIT_UPDATE,
      EDIT_ADD,
      EDIT_DELETE,
      arraySplice;
  _export("calcSplices", calcSplices);
  _export("projectArraySplices", projectArraySplices);
  function isIndex(s) {
    return +s === s >>> 0;
  }
  function toNumber(s) {
    return +s;
  }
  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }
  function ArraySplice() {}
  function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd);
  }
  function intersect(start1, end1, start2, end2) {
    if (end1 < start2 || end2 < start1) {
      return -1;
    }
    if (end1 == start2 || end2 == start1) {
      return 0;
    }
    if (start1 < start2) {
      if (end1 < end2) {
        return end1 - start2;
      } else {
        return end2 - start2;
      }
    } else {
      if (end2 < end1) {
        return end2 - start1;
      } else {
        return end1 - start1;
      }
    }
  }
  function mergeSplice(splices, index, removed, addedCount) {
    var splice = newSplice(index, removed, addedCount);
    var inserted = false;
    var insertionOffset = 0;
    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;
      if (inserted)
        continue;
      var intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);
      if (intersectCount >= 0) {
        splices.splice(i, 1);
        i--;
        insertionOffset -= current.addedCount - current.removed.length;
        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length + current.removed.length - intersectCount;
        if (!splice.addedCount && !deleteCount) {
          inserted = true;
        } else {
          var removed = current.removed;
          if (splice.index < current.index) {
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }
          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }
          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        inserted = true;
        splices.splice(i, 0, splice);
        i++;
        var offset = splice.addedCount - splice.removed.length;
        current.index += offset;
        insertionOffset += offset;
      }
    }
    if (!inserted)
      splices.push(splice);
  }
  function createInitialSplices(array, changeRecords) {
    var splices = [];
    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch (record.type) {
        case "splice":
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case "add":
        case "update":
        case "delete":
          if (!isIndex(record.name))
            continue;
          var index = toNumber(record.name);
          if (index < 0)
            continue;
          mergeSplice(splices, index, [record.oldValue], record.type === "delete" ? 0 : 1);
          break;
        default:
          console.error("Unexpected record type: " + JSON.stringify(record));
          break;
      }
    }
    return splices;
  }
  function projectArraySplices(array, changeRecords) {
    var splices = [];
    createInitialSplices(array, changeRecords).forEach(function(splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index])
          splices.push(splice);
        return ;
      }
      ;
      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
    });
    return splices;
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      EDIT_LEAVE = 0;
      EDIT_UPDATE = 1;
      EDIT_ADD = 2;
      EDIT_DELETE = 3;
      ArraySplice.prototype = {
        calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
          var rowCount = oldEnd - oldStart + 1;
          var columnCount = currentEnd - currentStart + 1;
          var distances = new Array(rowCount);
          var i,
              j,
              north,
              west;
          for (i = 0; i < rowCount; ++i) {
            distances[i] = new Array(columnCount);
            distances[i][0] = i;
          }
          for (j = 0; j < columnCount; ++j) {
            distances[0][j] = j;
          }
          for (i = 1; i < rowCount; ++i) {
            for (j = 1; j < columnCount; ++j) {
              if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
                distances[i][j] = distances[i - 1][j - 1];
              else {
                north = distances[i - 1][j] + 1;
                west = distances[i][j - 1] + 1;
                distances[i][j] = north < west ? north : west;
              }
            }
          }
          return distances;
        },
        spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
          var i = distances.length - 1;
          var j = distances[0].length - 1;
          var current = distances[i][j];
          var edits = [];
          while (i > 0 || j > 0) {
            if (i == 0) {
              edits.push(EDIT_ADD);
              j--;
              continue;
            }
            if (j == 0) {
              edits.push(EDIT_DELETE);
              i--;
              continue;
            }
            var northWest = distances[i - 1][j - 1];
            var west = distances[i - 1][j];
            var north = distances[i][j - 1];
            var min;
            if (west < north)
              min = west < northWest ? west : northWest;
            else
              min = north < northWest ? north : northWest;
            if (min == northWest) {
              if (northWest == current) {
                edits.push(EDIT_LEAVE);
              } else {
                edits.push(EDIT_UPDATE);
                current = northWest;
              }
              i--;
              j--;
            } else if (min == west) {
              edits.push(EDIT_DELETE);
              i--;
              current = west;
            } else {
              edits.push(EDIT_ADD);
              j--;
              current = north;
            }
          }
          edits.reverse();
          return edits;
        },
        calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
          var prefixCount = 0;
          var suffixCount = 0;
          var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
          if (currentStart == 0 && oldStart == 0)
            prefixCount = this.sharedPrefix(current, old, minLength);
          if (currentEnd == current.length && oldEnd == old.length)
            suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);
          currentStart += prefixCount;
          oldStart += prefixCount;
          currentEnd -= suffixCount;
          oldEnd -= suffixCount;
          if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0) {
            return [];
          }
          if (currentStart == currentEnd) {
            var splice = newSplice(currentStart, [], 0);
            while (oldStart < oldEnd)
              splice.removed.push(old[oldStart++]);
            return [splice];
          } else if (oldStart == oldEnd) {
            return [newSplice(currentStart, [], currentEnd - currentStart)];
          }
          var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
          var splice = undefined;
          var splices = [];
          var index = currentStart;
          var oldIndex = oldStart;
          for (var i = 0; i < ops.length; ++i) {
            switch (ops[i]) {
              case EDIT_LEAVE:
                if (splice) {
                  splices.push(splice);
                  splice = undefined;
                }
                index++;
                oldIndex++;
                break;
              case EDIT_UPDATE:
                if (!splice)
                  splice = newSplice(index, [], 0);
                splice.addedCount++;
                index++;
                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
              case EDIT_ADD:
                if (!splice)
                  splice = newSplice(index, [], 0);
                splice.addedCount++;
                index++;
                break;
              case EDIT_DELETE:
                if (!splice)
                  splice = newSplice(index, [], 0);
                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            }
          }
          if (splice) {
            splices.push(splice);
          }
          return splices;
        },
        sharedPrefix: function sharedPrefix(current, old, searchLength) {
          for (var i = 0; i < searchLength; ++i)
            if (!this.equals(current[i], old[i])) {
              return i;
            }
          return searchLength;
        },
        sharedSuffix: function sharedSuffix(current, old, searchLength) {
          var index1 = current.length;
          var index2 = old.length;
          var count = 0;
          while (count < searchLength && this.equals(current[--index1], old[--index2]))
            count++;
          return count;
        },
        calculateSplices: function calculateSplices(current, previous) {
          return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
        },
        equals: function equals(currentValue, previousValue) {
          return currentValue === previousValue;
        }
      };
      arraySplice = new ArraySplice();
    }
  };
});

System.register("github:aurelia/binding@0.4.0/collection-observation", ["github:aurelia/binding@0.4.0/array-change-records"], function(_export) {
  var calcSplices,
      projectArraySplices,
      _prototypeProperties,
      _classCallCheck,
      ModifyCollectionObserver,
      CollectionLengthObserver;
  return {
    setters: [function(_arrayChangeRecords) {
      calcSplices = _arrayChangeRecords.calcSplices;
      projectArraySplices = _arrayChangeRecords.projectArraySplices;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ModifyCollectionObserver = _export("ModifyCollectionObserver", (function() {
        function ModifyCollectionObserver(taskQueue, collection) {
          _classCallCheck(this, ModifyCollectionObserver);
          this.taskQueue = taskQueue;
          this.queued = false;
          this.callbacks = [];
          this.changeRecords = [];
          this.oldCollection = null;
          this.collection = collection;
          this.lengthPropertyName = collection instanceof Map ? "size" : "length";
        }
        _prototypeProperties(ModifyCollectionObserver, null, {
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks;
              callbacks.push(callback);
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          addChangeRecord: {
            value: function addChangeRecord(changeRecord) {
              if (this.callbacks.length === 0) {
                return ;
              }
              this.changeRecords.push(changeRecord);
              if (!this.queued) {
                this.queued = true;
                this.taskQueue.queueMicroTask(this);
              }
            },
            writable: true,
            configurable: true
          },
          reset: {
            value: function reset(oldCollection) {
              if (!this.callbacks.length) {
                return ;
              }
              this.oldCollection = oldCollection;
              if (!this.queued) {
                this.queued = true;
                this.taskQueue.queueMicroTask(this);
              }
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(propertyName) {
              if (propertyName == this.lengthPropertyName) {
                return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.collection, this.lengthPropertyName));
              } else {
                throw new Error("You cannot observe the " + propertyName + " property of an array.");
              }
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  changeRecords = this.changeRecords,
                  oldCollection = this.oldCollection,
                  records;
              this.queued = false;
              this.changeRecords = [];
              this.oldCollection = null;
              if (i) {
                if (oldCollection) {
                  if (this.collection instanceof Map) {
                    records = getChangeRecords(oldCollection);
                  } else {
                    records = calcSplices(this.collection, 0, this.collection.length, oldCollection, 0, oldCollection.length);
                  }
                } else {
                  if (this.collection instanceof Map) {
                    records = changeRecords;
                  } else {
                    records = projectArraySplices(this.collection, changeRecords);
                  }
                }
                while (i--) {
                  callbacks[i](records);
                }
              }
              if (this.lengthObserver) {
                this.lengthObserver(this.array.length);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return ModifyCollectionObserver;
      })());
      CollectionLengthObserver = _export("CollectionLengthObserver", (function() {
        function CollectionLengthObserver(collection) {
          _classCallCheck(this, CollectionLengthObserver);
          this.collection = collection;
          this.callbacks = [];
          this.lengthPropertyName = collection instanceof Map ? "size" : "length";
          this.currentValue = collection[this.lengthPropertyName];
        }
        _prototypeProperties(CollectionLengthObserver, null, {
          getValue: {
            value: function getValue() {
              return this.collection[this.lengthPropertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              this.collection[this.lengthPropertyName] = newValue;
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks;
              callbacks.push(callback);
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call(newValue) {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.currentValue;
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
              this.currentValue = newValue;
            },
            writable: true,
            configurable: true
          }
        });
        return CollectionLengthObserver;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.4.0/map-change-records", [], function(_export) {
  _export("getChangeRecords", getChangeRecords);
  function newRecord(type, object, key, oldValue) {
    return {
      type: type,
      object: object,
      key: key,
      oldValue: oldValue
    };
  }
  function getChangeRecords(map) {
    var entries = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
    try {
      for (var _iterator = map.keys()[Symbol.iterator](),
          _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;
        entries.push(newRecord("added", map, key));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    return entries;
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
    }
  };
});

System.register("github:aurelia/binding@0.4.0/dirty-checking", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      DirtyChecker,
      DirtyCheckProperty;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      DirtyChecker = _export("DirtyChecker", (function() {
        function DirtyChecker() {
          _classCallCheck(this, DirtyChecker);
          this.tracked = [];
          this.checkDelay = 120;
        }
        _prototypeProperties(DirtyChecker, null, {
          addProperty: {
            value: function addProperty(property) {
              var tracked = this.tracked;
              tracked.push(property);
              if (tracked.length === 1) {
                this.scheduleDirtyCheck();
              }
            },
            writable: true,
            configurable: true
          },
          removeProperty: {
            value: function removeProperty(property) {
              var tracked = this.tracked;
              tracked.splice(tracked.indexOf(property), 1);
            },
            writable: true,
            configurable: true
          },
          scheduleDirtyCheck: {
            value: function scheduleDirtyCheck() {
              var _this = this;
              setTimeout(function() {
                return _this.check();
              }, this.checkDelay);
            },
            writable: true,
            configurable: true
          },
          check: {
            value: function check() {
              var tracked = this.tracked,
                  i = tracked.length;
              while (i--) {
                var current = tracked[i];
                if (current.isDirty()) {
                  current.call();
                }
              }
              if (tracked.length) {
                this.scheduleDirtyCheck();
              }
            },
            writable: true,
            configurable: true
          }
        });
        return DirtyChecker;
      })());
      DirtyCheckProperty = _export("DirtyCheckProperty", (function() {
        function DirtyCheckProperty(dirtyChecker, obj, propertyName) {
          _classCallCheck(this, DirtyCheckProperty);
          this.dirtyChecker = dirtyChecker;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbacks = [];
          this.isSVG = obj instanceof SVGElement;
        }
        _prototypeProperties(DirtyCheckProperty, null, {
          getValue: {
            value: function getValue() {
              return this.obj[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              if (this.isSVG) {
                this.obj.setAttributeNS(null, this.propertyName, newValue);
              } else {
                this.obj[this.propertyName] = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.oldValue,
                  newValue = this.getValue();
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
              this.oldValue = newValue;
            },
            writable: true,
            configurable: true
          },
          isDirty: {
            value: function isDirty() {
              return this.oldValue !== this.getValue();
            },
            writable: true,
            configurable: true
          },
          beginTracking: {
            value: function beginTracking() {
              this.tracking = true;
              this.oldValue = this.newValue = this.getValue();
              this.dirtyChecker.addProperty(this);
            },
            writable: true,
            configurable: true
          },
          endTracking: {
            value: function endTracking() {
              this.tracking = false;
              this.dirtyChecker.removeProperty(this);
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks,
                  that = this;
              callbacks.push(callback);
              if (!this.tracking) {
                this.beginTracking();
              }
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
                if (callbacks.length === 0) {
                  that.endTracking();
                }
              };
            },
            writable: true,
            configurable: true
          }
        });
        return DirtyCheckProperty;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.4.0/property-observation", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      SetterObserver,
      OoObjectObserver,
      OoPropertyObserver,
      UndefinedPropertyObserver,
      ElementObserver,
      SelectValueObserver;
  function flattenCss(object) {
    var s = "";
    for (var propertyName in object) {
      if (object.hasOwnProperty(propertyName)) {
        s += propertyName + ": " + object[propertyName] + "; ";
      }
    }
    return s;
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      SetterObserver = _export("SetterObserver", (function() {
        function SetterObserver(taskQueue, obj, propertyName) {
          _classCallCheck(this, SetterObserver);
          this.taskQueue = taskQueue;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbacks = [];
          this.queued = false;
          this.observing = false;
        }
        _prototypeProperties(SetterObserver, null, {
          getValue: {
            value: function getValue() {
              return this.obj[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              this.obj[this.propertyName] = newValue;
            },
            writable: true,
            configurable: true
          },
          getterValue: {
            value: function getterValue() {
              return this.currentValue;
            },
            writable: true,
            configurable: true
          },
          setterValue: {
            value: function setterValue(newValue) {
              var oldValue = this.currentValue;
              if (oldValue != newValue) {
                if (!this.queued) {
                  this.oldValue = oldValue;
                  this.queued = true;
                  this.taskQueue.queueMicroTask(this);
                }
                this.currentValue = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.oldValue,
                  newValue = this.currentValue;
              this.queued = false;
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks;
              callbacks.push(callback);
              if (!this.observing) {
                this.convertProperty();
              }
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          convertProperty: {
            value: function convertProperty() {
              this.observing = true;
              this.currentValue = this.obj[this.propertyName];
              this.setValue = this.setterValue;
              this.getValue = this.getterValue;
              try {
                Object.defineProperty(this.obj, this.propertyName, {
                  configurable: true,
                  enumerable: true,
                  get: this.getValue.bind(this),
                  set: this.setValue.bind(this)
                });
              } catch (_) {}
            },
            writable: true,
            configurable: true
          }
        });
        return SetterObserver;
      })());
      OoObjectObserver = _export("OoObjectObserver", (function() {
        function OoObjectObserver(obj, observerLocator) {
          _classCallCheck(this, OoObjectObserver);
          this.obj = obj;
          this.observers = {};
          this.observerLocator = observerLocator;
        }
        _prototypeProperties(OoObjectObserver, null, {
          subscribe: {
            value: function subscribe(propertyObserver, callback) {
              var _this = this;
              var callbacks = propertyObserver.callbacks;
              callbacks.push(callback);
              if (!this.observing) {
                this.observing = true;
                try {
                  Object.observe(this.obj, function(changes) {
                    return _this.handleChanges(changes);
                  }, ["update", "add"]);
                } catch (_) {}
              }
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(propertyName, descriptor) {
              var propertyObserver = this.observers[propertyName];
              if (!propertyObserver) {
                if (descriptor) {
                  propertyObserver = this.observers[propertyName] = new OoPropertyObserver(this, this.obj, propertyName);
                } else {
                  propertyObserver = this.observers[propertyName] = new UndefinedPropertyObserver(this, this.obj, propertyName);
                }
              }
              return propertyObserver;
            },
            writable: true,
            configurable: true
          },
          handleChanges: {
            value: function handleChanges(changeRecords) {
              var updates = {},
                  observers = this.observers,
                  i = changeRecords.length;
              while (i--) {
                var change = changeRecords[i],
                    name = change.name;
                if (!(name in updates)) {
                  var observer = observers[name];
                  updates[name] = true;
                  if (observer) {
                    observer.trigger(change.object[name], change.oldValue);
                  }
                }
              }
            },
            writable: true,
            configurable: true
          }
        });
        return OoObjectObserver;
      })());
      OoPropertyObserver = _export("OoPropertyObserver", (function() {
        function OoPropertyObserver(owner, obj, propertyName) {
          _classCallCheck(this, OoPropertyObserver);
          this.owner = owner;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbacks = [];
        }
        _prototypeProperties(OoPropertyObserver, null, {
          getValue: {
            value: function getValue() {
              return this.obj[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              this.obj[this.propertyName] = newValue;
            },
            writable: true,
            configurable: true
          },
          trigger: {
            value: function trigger(newValue, oldValue) {
              var callbacks = this.callbacks,
                  i = callbacks.length;
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              return this.owner.subscribe(this, callback);
            },
            writable: true,
            configurable: true
          }
        });
        return OoPropertyObserver;
      })());
      UndefinedPropertyObserver = _export("UndefinedPropertyObserver", (function() {
        function UndefinedPropertyObserver(owner, obj, propertyName) {
          _classCallCheck(this, UndefinedPropertyObserver);
          this.owner = owner;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbackMap = new Map();
          this.callbacks = [];
        }
        _prototypeProperties(UndefinedPropertyObserver, null, {
          getValue: {
            value: function getValue() {
              if (this.actual) {
                return this.actual.getValue();
              }
              return this.obj[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              if (this.actual) {
                this.actual.setValue(newValue);
                return ;
              }
              this.obj[this.propertyName] = newValue;
              this.trigger(newValue, undefined);
            },
            writable: true,
            configurable: true
          },
          trigger: {
            value: function trigger(newValue, oldValue) {
              var callback;
              if (this.subscription) {
                this.subscription();
              }
              this.getObserver();
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;
              try {
                for (var _iterator = this.callbackMap.keys()[Symbol.iterator](),
                    _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  callback = _step.value;
                  callback(newValue, oldValue);
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver() {
              var callback,
                  observerLocator;
              if (!Object.getOwnPropertyDescriptor(this.obj, this.propertyName)) {
                return ;
              }
              observerLocator = this.owner.observerLocator;
              delete this.owner.observers[this.propertyName];
              delete observerLocator.getObserversLookup(this.obj, observerLocator)[this.propertyName];
              this.actual = observerLocator.getObserver(this.obj, this.propertyName);
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;
              try {
                for (var _iterator = this.callbackMap.keys()[Symbol.iterator](),
                    _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  callback = _step.value;
                  this.callbackMap.set(callback, this.actual.subscribe(callback));
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var _this = this;
              if (!this.actual) {
                this.getObserver();
              }
              if (this.actual) {
                return this.actual.subscribe(callback);
              }
              if (!this.subscription) {
                this.subscription = this.owner.subscribe(this);
              }
              this.callbackMap.set(callback, null);
              return function() {
                var actualDispose = _this.callbackMap.get(callback);
                if (actualDispose)
                  actualDispose();
                _this.callbackMap["delete"](callback);
              };
            },
            writable: true,
            configurable: true
          }
        });
        return UndefinedPropertyObserver;
      })());
      ElementObserver = _export("ElementObserver", (function() {
        function ElementObserver(element, propertyName, handler) {
          var _this = this;
          _classCallCheck(this, ElementObserver);
          var xlinkResult = /^xlink:(.+)$/.exec(propertyName);
          this.element = element;
          this.propertyName = propertyName;
          this.handler = handler;
          this.callbacks = [];
          if (xlinkResult) {
            propertyName = xlinkResult[1];
            this.getValue = function() {
              return element.getAttributeNS("http://www.w3.org/1999/xlink", propertyName);
            };
            this.setValue = function(newValue) {
              return element.setAttributeNS("http://www.w3.org/1999/xlink", propertyName, newValue);
            };
          } else if (/^\w+:|^data-|^aria-/.test(propertyName) || element instanceof SVGElement) {
            this.getValue = function() {
              return element.getAttribute(propertyName);
            };
            this.setValue = function(newValue) {
              return element.setAttribute(propertyName, newValue);
            };
          } else if (propertyName === "style" || propertyName === "css") {
            this.getValue = function() {
              return element.style.cssText;
            };
            this.setValue = function(newValue) {
              if (newValue instanceof Object) {
                newValue = flattenCss(newValue);
              }
              element.style.cssText = newValue;
            };
          } else {
            this.getValue = function() {
              return element[propertyName];
            };
            this.setValue = function(newValue) {
              element[propertyName] = newValue;
              if (handler) {
                _this.call();
              }
            };
          }
          this.oldValue = this.getValue();
        }
        _prototypeProperties(ElementObserver, null, {
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.oldValue,
                  newValue = this.getValue();
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
              this.oldValue = newValue;
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var that = this;
              if (!this.handler) {
                throw new Error("Observation of an Element's \"" + this.propertyName + "\" property is not supported.");
              }
              if (!this.disposeHandler) {
                this.disposeHandler = this.handler.subscribe(this.element, this.call.bind(this));
              }
              var callbacks = this.callbacks;
              callbacks.push(callback);
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
                if (callbacks.length === 0) {
                  that.disposeHandler();
                  that.disposeHandler = null;
                }
              };
            },
            writable: true,
            configurable: true
          }
        });
        return ElementObserver;
      })());
      SelectValueObserver = _export("SelectValueObserver", (function() {
        function SelectValueObserver(element, handler, observerLocator) {
          _classCallCheck(this, SelectValueObserver);
          this.element = element;
          this.handler = handler;
          this.observerLocator = observerLocator;
        }
        _prototypeProperties(SelectValueObserver, null, {
          getValue: {
            value: function getValue() {
              return this.value;
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              if (newValue !== null && newValue !== undefined && this.element.multiple && !Array.isArray(newValue)) {
                throw new Error("Only null or Array instances can be bound to a multi-select.");
              }
              if (this.value === newValue) {
                return ;
              }
              if (this.arraySubscription) {
                this.arraySubscription();
                this.arraySubscription = null;
              }
              if (Array.isArray(newValue)) {
                this.arraySubscription = this.observerLocator.getArrayObserver(newValue).subscribe(this.synchronizeOptions.bind(this));
              }
              this.value = newValue;
              this.synchronizeOptions();
            },
            writable: true,
            configurable: true
          },
          synchronizeOptions: {
            value: function synchronizeOptions() {
              var value = this.value,
                  i,
                  options,
                  option,
                  optionValue,
                  clear,
                  isArray;
              if (value === null || value === undefined) {
                clear = true;
              } else if (Array.isArray(value)) {
                isArray = true;
              }
              options = this.element.options;
              i = options.length;
              while (i--) {
                option = options.item(i);
                if (clear) {
                  option.selected = false;
                  continue;
                }
                optionValue = option.hasOwnProperty("model") ? option.model : option.value;
                if (isArray) {
                  option.selected = value.indexOf(optionValue) !== -1;
                  continue;
                }
                option.selected = value === optionValue;
              }
            },
            writable: true,
            configurable: true
          },
          synchronizeValue: {
            value: function synchronizeValue() {
              var options = this.element.options,
                  option,
                  i,
                  ii,
                  count = 0,
                  value = [];
              for (i = 0, ii = options.length; i < ii; i++) {
                option = options.item(i);
                if (!option.selected) {
                  continue;
                }
                value[count] = option.hasOwnProperty("model") ? option.model : option.value;
                count++;
              }
              if (!this.element.multiple) {
                if (count === 0) {
                  value = null;
                } else {
                  value = value[0];
                }
              }
              this.oldValue = this.value;
              this.value = value;
              this.call();
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.oldValue,
                  newValue = this.value;
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              if (!this.callbacks) {
                this.callbacks = [];
                this.disposeHandler = this.handler.subscribe(this.element, this.synchronizeValue.bind(this, false));
              }
              this.callbacks.push(callback);
              return this.unsubscribe.bind(this, callback);
            },
            writable: true,
            configurable: true
          },
          unsubscribe: {
            value: function unsubscribe(callback) {
              var callbacks = this.callbacks;
              callbacks.splice(callbacks.indexOf(callback), 1);
              if (callbacks.length === 0) {
                this.disposeHandler();
                this.disposeHandler = null;
                this.callbacks = null;
              }
            },
            writable: true,
            configurable: true
          },
          bind: {
            value: function bind() {
              this.domObserver = new MutationObserver(this.synchronizeOptions.bind(this));
              this.domObserver.observe(this.element, {
                childList: true,
                subtree: true
              });
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              this.domObserver.disconnect();
              this.domObserver = null;
              if (this.arraySubscription) {
                this.arraySubscription();
                this.arraySubscription = null;
              }
            },
            writable: true,
            configurable: true
          }
        });
        return SelectValueObserver;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.4.0/computed-observation", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      ComputedPropertyObserver;
  _export("hasDeclaredDependencies", hasDeclaredDependencies);
  _export("declarePropertyDependencies", declarePropertyDependencies);
  function hasDeclaredDependencies(descriptor) {
    return descriptor && descriptor.get && !descriptor.set && descriptor.get.dependencies && descriptor.get.dependencies.length;
  }
  function declarePropertyDependencies(ctor, propertyName, dependencies) {
    var descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, propertyName);
    if (descriptor.set)
      throw new Error("The property cannot have a setter function.");
    descriptor.get.dependencies = dependencies;
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ComputedPropertyObserver = _export("ComputedPropertyObserver", (function() {
        function ComputedPropertyObserver(obj, propertyName, descriptor, observerLocator) {
          _classCallCheck(this, ComputedPropertyObserver);
          this.obj = obj;
          this.propertyName = propertyName;
          this.descriptor = descriptor;
          this.observerLocator = observerLocator;
          this.callbacks = [];
        }
        _prototypeProperties(ComputedPropertyObserver, null, {
          getValue: {
            value: function getValue() {
              return this.obj[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              throw new Error("Computed properties cannot be assigned.");
            },
            writable: true,
            configurable: true
          },
          trigger: {
            value: function trigger(newValue, oldValue) {
              var callbacks = this.callbacks,
                  i = callbacks.length;
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
            },
            writable: true,
            configurable: true
          },
          evaluate: {
            value: function evaluate() {
              var newValue = this.getValue();
              if (this.oldValue === newValue) {
                return ;
              }
              this.trigger(newValue, this.oldValue);
              this.oldValue = newValue;
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var _this = this;
              var dependencies,
                  i,
                  ii;
              this.callbacks.push(callback);
              if (this.oldValue === undefined) {
                this.oldValue = this.getValue();
                this.subscriptions = [];
                dependencies = this.descriptor.get.dependencies;
                for (i = 0, ii = dependencies.length; i < ii; i++) {
                  this.subscriptions.push(this.observerLocator.getObserver(this.obj, dependencies[i]).subscribe(function() {
                    return _this.evaluate();
                  }));
                }
              }
              return function() {
                _this.callbacks.splice(_this.callbacks.indexOf(callback), 1);
                if (_this.callbacks.length > 0)
                  return ;
                while (_this.subscriptions.length) {
                  _this.subscriptions.pop()();
                }
                _this.oldValue = undefined;
              };
            },
            writable: true,
            configurable: true
          }
        });
        return ComputedPropertyObserver;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.4.0/binding-modes", [], function(_export) {
  var ONE_WAY,
      TWO_WAY,
      ONE_TIME;
  return {
    setters: [],
    execute: function() {
      "use strict";
      ONE_WAY = _export("ONE_WAY", 1);
      TWO_WAY = _export("TWO_WAY", 2);
      ONE_TIME = _export("ONE_TIME", 3);
    }
  };
});

System.register("github:aurelia/binding@0.4.0/lexer", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      Token,
      Lexer,
      Scanner,
      OPERATORS,
      $EOF,
      $TAB,
      $LF,
      $VTAB,
      $FF,
      $CR,
      $SPACE,
      $BANG,
      $DQ,
      $$,
      $PERCENT,
      $AMPERSAND,
      $SQ,
      $LPAREN,
      $RPAREN,
      $STAR,
      $PLUS,
      $COMMA,
      $MINUS,
      $PERIOD,
      $SLASH,
      $COLON,
      $SEMICOLON,
      $LT,
      $EQ,
      $GT,
      $QUESTION,
      $0,
      $9,
      $A,
      $E,
      $Z,
      $LBRACKET,
      $BACKSLASH,
      $RBRACKET,
      $CARET,
      $_,
      $a,
      $e,
      $f,
      $n,
      $r,
      $t,
      $u,
      $v,
      $z,
      $LBRACE,
      $BAR,
      $RBRACE,
      $NBSP;
  function isWhitespace(code) {
    return code >= $TAB && code <= $SPACE || code === $NBSP;
  }
  function isIdentifierStart(code) {
    return $a <= code && code <= $z || $A <= code && code <= $Z || code === $_ || code === $$;
  }
  function isIdentifierPart(code) {
    return $a <= code && code <= $z || $A <= code && code <= $Z || $0 <= code && code <= $9 || code === $_ || code === $$;
  }
  function isDigit(code) {
    return $0 <= code && code <= $9;
  }
  function isExponentStart(code) {
    return code === $e || code === $E;
  }
  function isExponentSign(code) {
    return code === $MINUS || code === $PLUS;
  }
  function unescape(code) {
    switch (code) {
      case $n:
        return $LF;
      case $f:
        return $FF;
      case $r:
        return $CR;
      case $t:
        return $TAB;
      case $v:
        return $VTAB;
      default:
        return code;
    }
  }
  function assert(condition, message) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Token = _export("Token", (function() {
        function Token(index, text) {
          _classCallCheck(this, Token);
          this.index = index;
          this.text = text;
        }
        _prototypeProperties(Token, null, {
          withOp: {
            value: function withOp(op) {
              this.opKey = op;
              return this;
            },
            writable: true,
            configurable: true
          },
          withGetterSetter: {
            value: function withGetterSetter(key) {
              this.key = key;
              return this;
            },
            writable: true,
            configurable: true
          },
          withValue: {
            value: function withValue(value) {
              this.value = value;
              return this;
            },
            writable: true,
            configurable: true
          },
          toString: {
            value: function toString() {
              return "Token(" + this.text + ")";
            },
            writable: true,
            configurable: true
          }
        });
        return Token;
      })());
      Lexer = _export("Lexer", (function() {
        function Lexer() {
          _classCallCheck(this, Lexer);
        }
        _prototypeProperties(Lexer, null, {lex: {
            value: function lex(text) {
              var scanner = new Scanner(text);
              var tokens = [];
              var token = scanner.scanToken();
              while (token) {
                tokens.push(token);
                token = scanner.scanToken();
              }
              return tokens;
            },
            writable: true,
            configurable: true
          }});
        return Lexer;
      })());
      Scanner = _export("Scanner", (function() {
        function Scanner(input) {
          _classCallCheck(this, Scanner);
          this.input = input;
          this.length = input.length;
          this.peek = 0;
          this.index = -1;
          this.advance();
        }
        _prototypeProperties(Scanner, null, {
          scanToken: {
            value: function scanToken() {
              while (this.peek <= $SPACE) {
                if (++this.index >= this.length) {
                  this.peek = $EOF;
                  return null;
                } else {
                  this.peek = this.input.charCodeAt(this.index);
                }
              }
              if (isIdentifierStart(this.peek)) {
                return this.scanIdentifier();
              }
              if (isDigit(this.peek)) {
                return this.scanNumber(this.index);
              }
              var start = this.index;
              switch (this.peek) {
                case $PERIOD:
                  this.advance();
                  return isDigit(this.peek) ? this.scanNumber(start) : new Token(start, ".");
                case $LPAREN:
                case $RPAREN:
                case $LBRACE:
                case $RBRACE:
                case $LBRACKET:
                case $RBRACKET:
                case $COMMA:
                case $COLON:
                case $SEMICOLON:
                  return this.scanCharacter(start, String.fromCharCode(this.peek));
                case $SQ:
                case $DQ:
                  return this.scanString();
                case $PLUS:
                case $MINUS:
                case $STAR:
                case $SLASH:
                case $PERCENT:
                case $CARET:
                case $QUESTION:
                  return this.scanOperator(start, String.fromCharCode(this.peek));
                case $LT:
                case $GT:
                case $BANG:
                case $EQ:
                  return this.scanComplexOperator(start, $EQ, String.fromCharCode(this.peek), "=");
                case $AMPERSAND:
                  return this.scanComplexOperator(start, $AMPERSAND, "&", "&");
                case $BAR:
                  return this.scanComplexOperator(start, $BAR, "|", "|");
                case $NBSP:
                  while (isWhitespace(this.peek)) {
                    this.advance();
                  }
                  return this.scanToken();
              }
              var character = String.fromCharCode(this.peek);
              this.error("Unexpected character [" + character + "]");
              return null;
            },
            writable: true,
            configurable: true
          },
          scanCharacter: {
            value: function scanCharacter(start, text) {
              assert(this.peek === text.charCodeAt(0));
              this.advance();
              return new Token(start, text);
            },
            writable: true,
            configurable: true
          },
          scanOperator: {
            value: function scanOperator(start, text) {
              assert(this.peek === text.charCodeAt(0));
              assert(OPERATORS.indexOf(text) !== -1);
              this.advance();
              return new Token(start, text).withOp(text);
            },
            writable: true,
            configurable: true
          },
          scanComplexOperator: {
            value: function scanComplexOperator(start, code, one, two) {
              assert(this.peek === one.charCodeAt(0));
              this.advance();
              var text = one;
              if (this.peek === code) {
                this.advance();
                text += two;
              }
              if (this.peek === code) {
                this.advance();
                text += two;
              }
              assert(OPERATORS.indexOf(text) != -1);
              return new Token(start, text).withOp(text);
            },
            writable: true,
            configurable: true
          },
          scanIdentifier: {
            value: function scanIdentifier() {
              assert(isIdentifierStart(this.peek));
              var start = this.index;
              this.advance();
              while (isIdentifierPart(this.peek)) {
                this.advance();
              }
              var text = this.input.substring(start, this.index);
              var result = new Token(start, text);
              if (OPERATORS.indexOf(text) !== -1) {
                result.withOp(text);
              } else {
                result.withGetterSetter(text);
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          scanNumber: {
            value: function scanNumber(start) {
              assert(isDigit(this.peek));
              var simple = this.index === start;
              this.advance();
              while (true) {
                if (isDigit(this.peek)) {} else if (this.peek === $PERIOD) {
                  simple = false;
                } else if (isExponentStart(this.peek)) {
                  this.advance();
                  if (isExponentSign(this.peek)) {
                    this.advance();
                  }
                  if (!isDigit(this.peek)) {
                    this.error("Invalid exponent", -1);
                  }
                  simple = false;
                } else {
                  break;
                }
                this.advance();
              }
              var text = this.input.substring(start, this.index);
              var value = simple ? parseInt(text) : parseFloat(text);
              return new Token(start, text).withValue(value);
            },
            writable: true,
            configurable: true
          },
          scanString: {
            value: function scanString() {
              assert(this.peek === $SQ || this.peek === $DQ);
              var start = this.index;
              var quote = this.peek;
              this.advance();
              var buffer;
              var marker = this.index;
              while (this.peek !== quote) {
                if (this.peek === $BACKSLASH) {
                  if (buffer === null) {
                    buffer = [];
                  }
                  buffer.push(this.input.substring(marker, this.index));
                  this.advance();
                  var unescaped;
                  if (this.peek === $u) {
                    var hex = this.input.substring(this.index + 1, this.index + 5);
                    if (!/[A-Z0-9]{4}/.test(hex)) {
                      this.error("Invalid unicode escape [\\u" + hex + "]");
                    }
                    unescaped = parseInt(hex, 16);
                    for (var i = 0; i < 5; ++i) {
                      this.advance();
                    }
                  } else {
                    unescaped = decodeURIComponent(this.peek);
                    this.advance();
                  }
                  buffer.push(String.fromCharCode(unescaped));
                  marker = this.index;
                } else if (this.peek === $EOF) {
                  this.error("Unterminated quote");
                } else {
                  this.advance();
                }
              }
              var last = this.input.substring(marker, this.index);
              this.advance();
              var text = this.input.substring(start, this.index);
              var unescaped = last;
              if (buffer != null) {
                buffer.push(last);
                unescaped = buffer.join("");
              }
              return new Token(start, text).withValue(unescaped);
            },
            writable: true,
            configurable: true
          },
          advance: {
            value: function advance() {
              if (++this.index >= this.length) {
                this.peek = $EOF;
              } else {
                this.peek = this.input.charCodeAt(this.index);
              }
            },
            writable: true,
            configurable: true
          },
          error: {
            value: function error(message) {
              var offset = arguments[1] === undefined ? 0 : arguments[1];
              var position = this.index + offset;
              throw new Error("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
            },
            writable: true,
            configurable: true
          }
        });
        return Scanner;
      })());
      OPERATORS = ["undefined", "null", "true", "false", "+", "-", "*", "/", "%", "^", "=", "==", "===", "!=", "!==", "<", ">", "<=", ">=", "&&", "||", "&", "|", "!", "?"];
      $EOF = 0;
      $TAB = 9;
      $LF = 10;
      $VTAB = 11;
      $FF = 12;
      $CR = 13;
      $SPACE = 32;
      $BANG = 33;
      $DQ = 34;
      $$ = 36;
      $PERCENT = 37;
      $AMPERSAND = 38;
      $SQ = 39;
      $LPAREN = 40;
      $RPAREN = 41;
      $STAR = 42;
      $PLUS = 43;
      $COMMA = 44;
      $MINUS = 45;
      $PERIOD = 46;
      $SLASH = 47;
      $COLON = 58;
      $SEMICOLON = 59;
      $LT = 60;
      $EQ = 61;
      $GT = 62;
      $QUESTION = 63;
      $0 = 48;
      $9 = 57;
      $A = 65;
      $E = 69;
      $Z = 90;
      $LBRACKET = 91;
      $BACKSLASH = 92;
      $RBRACKET = 93;
      $CARET = 94;
      $_ = 95;
      $a = 97;
      $e = 101;
      $f = 102;
      $n = 110;
      $r = 114;
      $t = 116;
      $u = 117;
      $v = 118;
      $z = 122;
      $LBRACE = 123;
      $BAR = 124;
      $RBRACE = 125;
      $NBSP = 160;
    }
  };
});

System.register("github:aurelia/binding@0.4.0/path-observer", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      PathObserver;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      PathObserver = _export("PathObserver", (function() {
        function PathObserver(leftObserver, getRightObserver, value) {
          var _this = this;
          _classCallCheck(this, PathObserver);
          this.leftObserver = leftObserver;
          this.disposeLeft = leftObserver.subscribe(function(newValue) {
            var newRightValue = _this.updateRight(getRightObserver(newValue));
            _this.notify(newRightValue);
          });
          this.updateRight(getRightObserver(value));
        }
        _prototypeProperties(PathObserver, null, {
          updateRight: {
            value: function updateRight(observer) {
              var _this = this;
              this.rightObserver = observer;
              if (this.disposeRight) {
                this.disposeRight();
              }
              if (!observer) {
                return null;
              }
              this.disposeRight = observer.subscribe(function(newValue) {
                return _this.notify(newValue);
              });
              return observer.getValue();
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var that = this;
              that.callback = callback;
              return function() {
                that.callback = null;
              };
            },
            writable: true,
            configurable: true
          },
          notify: {
            value: function notify(newValue) {
              var callback = this.callback;
              if (callback) {
                callback(newValue);
              }
            },
            writable: true,
            configurable: true
          },
          dispose: {
            value: function dispose() {
              if (this.disposeLeft) {
                this.disposeLeft();
              }
              if (this.disposeRight) {
                this.disposeRight();
              }
            },
            writable: true,
            configurable: true
          }
        });
        return PathObserver;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.4.0/composite-observer", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      CompositeObserver;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      CompositeObserver = _export("CompositeObserver", (function() {
        function CompositeObserver(observers, evaluate) {
          var _this = this;
          _classCallCheck(this, CompositeObserver);
          this.subscriptions = new Array(observers.length);
          this.evaluate = evaluate;
          for (var i = 0,
              ii = observers.length; i < ii; i++) {
            this.subscriptions[i] = observers[i].subscribe(function(newValue) {
              _this.notify(_this.evaluate());
            });
          }
        }
        _prototypeProperties(CompositeObserver, null, {
          subscribe: {
            value: function subscribe(callback) {
              var that = this;
              that.callback = callback;
              return function() {
                that.callback = null;
              };
            },
            writable: true,
            configurable: true
          },
          notify: {
            value: function notify(newValue) {
              var callback = this.callback;
              if (callback) {
                callback(newValue);
              }
            },
            writable: true,
            configurable: true
          },
          dispose: {
            value: function dispose() {
              var subscriptions = this.subscriptions;
              while (i--) {
                subscriptions[i]();
              }
            },
            writable: true,
            configurable: true
          }
        });
        return CompositeObserver;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.4.0/binding-expression", ["github:aurelia/binding@0.4.0/binding-modes"], function(_export) {
  var ONE_WAY,
      TWO_WAY,
      _prototypeProperties,
      _classCallCheck,
      BindingExpression,
      Binding;
  return {
    setters: [function(_bindingModes) {
      ONE_WAY = _bindingModes.ONE_WAY;
      TWO_WAY = _bindingModes.TWO_WAY;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      BindingExpression = _export("BindingExpression", (function() {
        function BindingExpression(observerLocator, targetProperty, sourceExpression, mode, valueConverterLookupFunction, attribute) {
          _classCallCheck(this, BindingExpression);
          this.observerLocator = observerLocator;
          this.targetProperty = targetProperty;
          this.sourceExpression = sourceExpression;
          this.mode = mode;
          this.valueConverterLookupFunction = valueConverterLookupFunction;
          this.attribute = attribute;
          this.discrete = false;
        }
        _prototypeProperties(BindingExpression, null, {createBinding: {
            value: function createBinding(target) {
              return new Binding(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
            },
            writable: true,
            configurable: true
          }});
        return BindingExpression;
      })());
      Binding = (function() {
        function Binding(observerLocator, sourceExpression, target, targetProperty, mode, valueConverterLookupFunction) {
          _classCallCheck(this, Binding);
          this.observerLocator = observerLocator;
          this.sourceExpression = sourceExpression;
          this.targetProperty = observerLocator.getObserver(target, targetProperty);
          this.mode = mode;
          this.valueConverterLookupFunction = valueConverterLookupFunction;
        }
        _prototypeProperties(Binding, null, {
          getObserver: {
            value: function getObserver(obj, propertyName) {
              return this.observerLocator.getObserver(obj, propertyName);
            },
            writable: true,
            configurable: true
          },
          bind: {
            value: function bind(source) {
              var _this = this;
              var targetProperty = this.targetProperty,
                  info;
              if ("bind" in targetProperty) {
                targetProperty.bind();
              }
              if (this.mode == ONE_WAY || this.mode == TWO_WAY) {
                if (this._disposeObserver) {
                  if (this.source === source) {
                    return ;
                  }
                  this.unbind();
                }
                info = this.sourceExpression.connect(this, source);
                if (info.observer) {
                  this._disposeObserver = info.observer.subscribe(function(newValue) {
                    var existing = targetProperty.getValue();
                    if (newValue !== existing) {
                      targetProperty.setValue(newValue);
                    }
                  });
                }
                if (info.value !== undefined) {
                  targetProperty.setValue(info.value);
                }
                if (this.mode == TWO_WAY) {
                  this._disposeListener = targetProperty.subscribe(function(newValue) {
                    _this.sourceExpression.assign(source, newValue, _this.valueConverterLookupFunction);
                  });
                }
                this.source = source;
              } else {
                var value = this.sourceExpression.evaluate(source, this.valueConverterLookupFunction);
                if (value !== undefined) {
                  targetProperty.setValue(value);
                }
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              if ("unbind" in this.targetProperty) {
                this.targetProperty.unbind();
              }
              if (this._disposeObserver) {
                this._disposeObserver();
                this._disposeObserver = null;
              }
              if (this._disposeListener) {
                this._disposeListener();
                this._disposeListener = null;
              }
            },
            writable: true,
            configurable: true
          }
        });
        return Binding;
      })();
    }
  };
});

System.register("github:aurelia/binding@0.4.0/listener-expression", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      ListenerExpression,
      Listener;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ListenerExpression = _export("ListenerExpression", (function() {
        function ListenerExpression(eventManager, targetEvent, sourceExpression, delegate, preventDefault) {
          _classCallCheck(this, ListenerExpression);
          this.eventManager = eventManager;
          this.targetEvent = targetEvent;
          this.sourceExpression = sourceExpression;
          this.delegate = delegate;
          this.discrete = true;
          this.preventDefault = preventDefault;
        }
        _prototypeProperties(ListenerExpression, null, {createBinding: {
            value: function createBinding(target) {
              return new Listener(this.eventManager, this.targetEvent, this.delegate, this.sourceExpression, target, this.preventDefault);
            },
            writable: true,
            configurable: true
          }});
        return ListenerExpression;
      })());
      Listener = (function() {
        function Listener(eventManager, targetEvent, delegate, sourceExpression, target, preventDefault) {
          _classCallCheck(this, Listener);
          this.eventManager = eventManager;
          this.targetEvent = targetEvent;
          this.delegate = delegate;
          this.sourceExpression = sourceExpression;
          this.target = target;
          this.preventDefault = preventDefault;
        }
        _prototypeProperties(Listener, null, {
          bind: {
            value: function bind(source) {
              var _this = this;
              if (this._disposeListener) {
                if (this.source === source) {
                  return ;
                }
                this.unbind();
              }
              this.source = source;
              this._disposeListener = this.eventManager.addEventListener(this.target, this.targetEvent, function(event) {
                var prevEvent = source.$event;
                source.$event = event;
                var result = _this.sourceExpression.evaluate(source);
                source.$event = prevEvent;
                if (result !== true && _this.preventDefault) {
                  event.preventDefault();
                }
                return result;
              }, this.delegate);
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              if (this._disposeListener) {
                this._disposeListener();
                this._disposeListener = null;
              }
            },
            writable: true,
            configurable: true
          }
        });
        return Listener;
      })();
    }
  };
});

System.register("github:aurelia/binding@0.4.0/name-expression", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      NameExpression,
      NameBinder;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      NameExpression = _export("NameExpression", (function() {
        function NameExpression(name, mode) {
          _classCallCheck(this, NameExpression);
          this.property = name;
          this.discrete = true;
          this.mode = (mode || "view-model").toLowerCase();
        }
        _prototypeProperties(NameExpression, null, {createBinding: {
            value: function createBinding(target) {
              return new NameBinder(this.property, target, this.mode);
            },
            writable: true,
            configurable: true
          }});
        return NameExpression;
      })());
      NameBinder = (function() {
        function NameBinder(property, target, mode) {
          _classCallCheck(this, NameBinder);
          this.property = property;
          switch (mode) {
            case "element":
              this.target = target;
              break;
            case "view-model":
              this.target = target.primaryBehavior ? target.primaryBehavior.executionContext : target;
              break;
            default:
              throw new Error("Name expressions do not support mode: " + mode);
          }
        }
        _prototypeProperties(NameBinder, null, {
          bind: {
            value: function bind(source) {
              if (this.source) {
                if (this.source === source) {
                  return ;
                }
                this.unbind();
              }
              this.source = source;
              source[this.property] = this.target;
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              this.source[this.property] = null;
            },
            writable: true,
            configurable: true
          }
        });
        return NameBinder;
      })();
    }
  };
});

System.register("github:aurelia/binding@0.4.0/call-expression", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      CallExpression,
      Call;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      CallExpression = _export("CallExpression", (function() {
        function CallExpression(observerLocator, targetProperty, sourceExpression, valueConverterLookupFunction) {
          _classCallCheck(this, CallExpression);
          this.observerLocator = observerLocator;
          this.targetProperty = targetProperty;
          this.sourceExpression = sourceExpression;
          this.valueConverterLookupFunction = valueConverterLookupFunction;
        }
        _prototypeProperties(CallExpression, null, {createBinding: {
            value: function createBinding(target) {
              return new Call(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.valueConverterLookupFunction);
            },
            writable: true,
            configurable: true
          }});
        return CallExpression;
      })());
      Call = (function() {
        function Call(observerLocator, sourceExpression, target, targetProperty, valueConverterLookupFunction) {
          _classCallCheck(this, Call);
          this.sourceExpression = sourceExpression;
          this.target = target;
          this.targetProperty = observerLocator.getObserver(target, targetProperty);
          this.valueConverterLookupFunction = valueConverterLookupFunction;
        }
        _prototypeProperties(Call, null, {
          bind: {
            value: function bind(source) {
              var _this = this;
              if (this.source === source) {
                return ;
              }
              if (this.source) {
                this.unbind();
              }
              this.source = source;
              this.targetProperty.setValue(function() {
                for (var _len = arguments.length,
                    rest = Array(_len),
                    _key = 0; _key < _len; _key++) {
                  rest[_key] = arguments[_key];
                }
                return _this.sourceExpression.evaluate(source, _this.valueConverterLookupFunction, rest);
              });
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              this.targetProperty.setValue(null);
            },
            writable: true,
            configurable: true
          }
        });
        return Call;
      })();
    }
  };
});

System.register("github:aurelia/templating@0.9.0/behavior-instance", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      BehaviorInstance;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      BehaviorInstance = _export("BehaviorInstance", (function() {
        function BehaviorInstance(behavior, executionContext, instruction) {
          _classCallCheck(this, BehaviorInstance);
          this.behavior = behavior;
          this.executionContext = executionContext;
          this.isAttached = false;
          var observerLookup = behavior.observerLocator.getObserversLookup(executionContext),
              handlesBind = behavior.handlesBind,
              attributes = instruction.attributes,
              boundProperties = this.boundProperties = [],
              properties = behavior.properties,
              i,
              ii;
          for (i = 0, ii = properties.length; i < ii; ++i) {
            properties[i].initialize(executionContext, observerLookup, attributes, handlesBind, boundProperties);
          }
        }
        _prototypeProperties(BehaviorInstance, null, {
          created: {
            value: function created(context) {
              if (this.behavior.handlesCreated) {
                this.executionContext.created(context);
              }
            },
            writable: true,
            configurable: true
          },
          bind: {
            value: function bind(context) {
              var skipSelfSubscriber = this.behavior.handlesBind,
                  boundProperties = this.boundProperties,
                  i,
                  ii,
                  x,
                  observer,
                  selfSubscriber;
              for (i = 0, ii = boundProperties.length; i < ii; ++i) {
                x = boundProperties[i];
                observer = x.observer;
                selfSubscriber = observer.selfSubscriber;
                observer.publishing = false;
                if (skipSelfSubscriber) {
                  observer.selfSubscriber = null;
                }
                x.binding.bind(context);
                observer.call();
                observer.publishing = true;
                observer.selfSubscriber = selfSubscriber;
              }
              if (skipSelfSubscriber) {
                this.executionContext.bind(context);
              }
              if (this.view) {
                this.view.bind(this.executionContext);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              var boundProperties = this.boundProperties,
                  i,
                  ii;
              if (this.view) {
                this.view.unbind();
              }
              if (this.behavior.handlesUnbind) {
                this.executionContext.unbind();
              }
              for (i = 0, ii = boundProperties.length; i < ii; ++i) {
                boundProperties[i].binding.unbind();
              }
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              if (this.isAttached) {
                return ;
              }
              this.isAttached = true;
              if (this.behavior.handlesAttached) {
                this.executionContext.attached();
              }
              if (this.view) {
                this.view.attached();
              }
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              if (this.isAttached) {
                this.isAttached = false;
                if (this.view) {
                  this.view.detached();
                }
                if (this.behavior.handlesDetached) {
                  this.executionContext.detached();
                }
              }
            },
            writable: true,
            configurable: true
          }
        });
        return BehaviorInstance;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/children", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      noMutations,
      ChildObserver,
      ChildObserverBinder;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      noMutations = [];
      ChildObserver = _export("ChildObserver", (function() {
        function ChildObserver(property, changeHandler, selector) {
          _classCallCheck(this, ChildObserver);
          this.selector = selector;
          this.changeHandler = changeHandler;
          this.property = property;
        }
        _prototypeProperties(ChildObserver, null, {createBinding: {
            value: function createBinding(target, behavior) {
              return new ChildObserverBinder(this.selector, target, this.property, behavior, this.changeHandler);
            },
            writable: true,
            configurable: true
          }});
        return ChildObserver;
      })());
      ChildObserverBinder = _export("ChildObserverBinder", (function() {
        function ChildObserverBinder(selector, target, property, behavior, changeHandler) {
          _classCallCheck(this, ChildObserverBinder);
          this.selector = selector;
          this.target = target;
          this.property = property;
          this.target = target;
          this.behavior = behavior;
          this.changeHandler = changeHandler;
          this.observer = new MutationObserver(this.onChange.bind(this));
        }
        _prototypeProperties(ChildObserverBinder, null, {
          bind: {
            value: function bind(source) {
              var items,
                  results,
                  i,
                  ii,
                  node,
                  behavior = this.behavior;
              this.observer.observe(this.target, {
                childList: true,
                subtree: true
              });
              items = behavior[this.property];
              if (!items) {
                items = behavior[this.property] = [];
              } else {
                items.length = 0;
              }
              results = this.target.querySelectorAll(this.selector);
              for (i = 0, ii = results.length; i < ii; ++i) {
                node = results[i];
                items.push(node.primaryBehavior ? node.primaryBehavior.executionContext : node);
              }
              if (this.changeHandler) {
                this.behavior[this.changeHandler](noMutations);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              this.observer.disconnect();
            },
            writable: true,
            configurable: true
          },
          onChange: {
            value: function onChange(mutations) {
              var items = this.behavior[this.property],
                  selector = this.selector;
              mutations.forEach(function(record) {
                var added = record.addedNodes,
                    removed = record.removedNodes,
                    prev = record.previousSibling,
                    i,
                    ii,
                    primary,
                    index,
                    node;
                for (i = 0, ii = removed.length; i < ii; ++i) {
                  node = removed[i];
                  if (node.nodeType === 1 && node.matches(selector)) {
                    primary = node.primaryBehavior ? node.primaryBehavior.executionContext : node;
                    index = items.indexOf(primary);
                    if (index != -1) {
                      items.splice(index, 1);
                    }
                  }
                }
                for (i = 0, ii = added.length; i < ii; ++i) {
                  node = added[i];
                  if (node.nodeType === 1 && node.matches(selector)) {
                    primary = node.primaryBehavior ? node.primaryBehavior.executionContext : node;
                    index = 0;
                    while (prev) {
                      if (prev.nodeType === 1 && prev.matches(selector)) {
                        index++;
                      }
                      prev = prev.previousSibling;
                    }
                    items.splice(index, 0, primary);
                  }
                }
              });
              if (this.changeHandler) {
                this.behavior[this.changeHandler](mutations);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return ChildObserverBinder;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/content-selector", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      proto,
      placeholder,
      ContentSelector;
  function findInsertionPoint(groups, index) {
    var insertionPoint;
    while (!insertionPoint && index >= 0) {
      insertionPoint = groups[index][0];
      index--;
    }
    return insertionPoint || anchor;
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      if (Element && !Element.prototype.matches) {
        proto = Element.prototype;
        proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
      }
      placeholder = [];
      ContentSelector = _export("ContentSelector", (function() {
        function ContentSelector(anchor, selector) {
          _classCallCheck(this, ContentSelector);
          this.anchor = anchor;
          this.selector = selector;
          this.all = !this.selector;
          this.groups = [];
        }
        _prototypeProperties(ContentSelector, {applySelectors: {
            value: function applySelectors(view, contentSelectors, callback) {
              var currentChild = view.fragment.firstChild,
                  contentMap = new Map(),
                  nextSibling,
                  i,
                  ii,
                  contentSelector;
              while (currentChild) {
                nextSibling = currentChild.nextSibling;
                if (currentChild.viewSlot) {
                  var viewSlotSelectors = contentSelectors.map(function(x) {
                    return x.copyForViewSlot();
                  });
                  currentChild.viewSlot.installContentSelectors(viewSlotSelectors);
                } else {
                  for (i = 0, ii = contentSelectors.length; i < ii; i++) {
                    contentSelector = contentSelectors[i];
                    if (contentSelector.matches(currentChild)) {
                      var elements = contentMap.get(contentSelector);
                      if (!elements) {
                        elements = [];
                        contentMap.set(contentSelector, elements);
                      }
                      elements.push(currentChild);
                      break;
                    }
                  }
                }
                currentChild = nextSibling;
              }
              for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
                contentSelector = contentSelectors[i];
                callback(contentSelector, contentMap.get(contentSelector) || placeholder);
              }
            },
            writable: true,
            configurable: true
          }}, {
          copyForViewSlot: {
            value: function copyForViewSlot() {
              return new ContentSelector(this.anchor, this.selector);
            },
            writable: true,
            configurable: true
          },
          matches: {
            value: function matches(node) {
              return this.all || node.nodeType === 1 && node.matches(this.selector);
            },
            writable: true,
            configurable: true
          },
          add: {
            value: function add(group) {
              var anchor = this.anchor,
                  parent = anchor.parentNode,
                  i,
                  ii;
              for (i = 0, ii = group.length; i < ii; ++i) {
                parent.insertBefore(group[i], anchor);
              }
              this.groups.push(group);
            },
            writable: true,
            configurable: true
          },
          insert: {
            value: function insert(index, group) {
              if (group.length) {
                var anchor = findInsertionPoint(this.groups, index) || this.anchor,
                    parent = anchor.parentNode,
                    i,
                    ii;
                for (i = 0, ii = group.length; i < ii; ++i) {
                  parent.insertBefore(group[i], anchor);
                }
              }
              this.groups.splice(index, 0, group);
            },
            writable: true,
            configurable: true
          },
          removeAt: {
            value: function removeAt(index, fragment) {
              var group = this.groups[index],
                  i,
                  ii;
              for (i = 0, ii = group.length; i < ii; ++i) {
                fragment.appendChild(group[i]);
              }
              this.groups.splice(index, 1);
            },
            writable: true,
            configurable: true
          }
        });
        return ContentSelector;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/resource-registry", ["github:aurelia/path@0.4.6"], function(_export) {
  var relativeToFile,
      _get,
      _inherits,
      _prototypeProperties,
      _classCallCheck,
      ResourceRegistry,
      ViewResources;
  function register(lookup, name, resource, type) {
    if (!name) {
      return ;
    }
    var existing = lookup[name];
    if (existing) {
      if (existing != resource) {
        throw new Error("Attempted to register " + type + " when one with the same name already exists. Name: " + name + ".");
      }
      return ;
    }
    lookup[name] = resource;
  }
  return {
    setters: [function(_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }],
    execute: function() {
      "use strict";
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ResourceRegistry = _export("ResourceRegistry", (function() {
        function ResourceRegistry() {
          _classCallCheck(this, ResourceRegistry);
          this.attributes = {};
          this.elements = {};
          this.valueConverters = {};
          this.attributeMap = {};
          this.baseResourceUrl = "";
        }
        _prototypeProperties(ResourceRegistry, null, {
          registerElement: {
            value: function registerElement(tagName, behavior) {
              register(this.elements, tagName, behavior, "an Element");
            },
            writable: true,
            configurable: true
          },
          getElement: {
            value: function getElement(tagName) {
              return this.elements[tagName];
            },
            writable: true,
            configurable: true
          },
          registerAttribute: {
            value: function registerAttribute(attribute, behavior, knownAttribute) {
              this.attributeMap[attribute] = knownAttribute;
              register(this.attributes, attribute, behavior, "an Attribute");
            },
            writable: true,
            configurable: true
          },
          getAttribute: {
            value: function getAttribute(attribute) {
              return this.attributes[attribute];
            },
            writable: true,
            configurable: true
          },
          registerValueConverter: {
            value: function registerValueConverter(name, valueConverter) {
              register(this.valueConverters, name, valueConverter, "a ValueConverter");
            },
            writable: true,
            configurable: true
          },
          getValueConverter: {
            value: function getValueConverter(name) {
              return this.valueConverters[name];
            },
            writable: true,
            configurable: true
          }
        });
        return ResourceRegistry;
      })());
      ViewResources = _export("ViewResources", (function(ResourceRegistry) {
        function ViewResources(parent, viewUrl) {
          _classCallCheck(this, ViewResources);
          _get(Object.getPrototypeOf(ViewResources.prototype), "constructor", this).call(this);
          this.parent = parent;
          this.viewUrl = viewUrl;
          this.valueConverterLookupFunction = this.getValueConverter.bind(this);
        }
        _inherits(ViewResources, ResourceRegistry);
        _prototypeProperties(ViewResources, null, {
          relativeToView: {
            value: function relativeToView(path) {
              return relativeToFile(path, this.viewUrl);
            },
            writable: true,
            configurable: true
          },
          getElement: {
            value: function getElement(tagName) {
              return this.elements[tagName] || this.parent.getElement(tagName);
            },
            writable: true,
            configurable: true
          },
          mapAttribute: {
            value: function mapAttribute(attribute) {
              return this.attributeMap[attribute] || this.parent.attributeMap[attribute];
            },
            writable: true,
            configurable: true
          },
          getAttribute: {
            value: function getAttribute(attribute) {
              return this.attributes[attribute] || this.parent.getAttribute(attribute);
            },
            writable: true,
            configurable: true
          },
          getValueConverter: {
            value: function getValueConverter(name) {
              return this.valueConverters[name] || this.parent.getValueConverter(name);
            },
            writable: true,
            configurable: true
          }
        });
        return ViewResources;
      })(ResourceRegistry));
    }
  };
});

System.register("github:aurelia/templating@0.9.0/view", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      View;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      View = _export("View", (function() {
        function View(fragment, behaviors, bindings, children, systemControlled, contentSelectors) {
          _classCallCheck(this, View);
          this.fragment = fragment;
          this.behaviors = behaviors;
          this.bindings = bindings;
          this.children = children;
          this.systemControlled = systemControlled;
          this.contentSelectors = contentSelectors;
          this.firstChild = fragment.firstChild;
          this.lastChild = fragment.lastChild;
          this.isBound = false;
          this.isAttached = false;
        }
        _prototypeProperties(View, null, {
          created: {
            value: function created(executionContext) {
              var i,
                  ii,
                  behaviors = this.behaviors;
              for (i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].created(executionContext);
              }
            },
            writable: true,
            configurable: true
          },
          bind: {
            value: function bind(executionContext, systemUpdate) {
              var context,
                  behaviors,
                  bindings,
                  children,
                  i,
                  ii;
              if (systemUpdate && !this.systemControlled) {
                context = this.executionContext || executionContext;
              } else {
                context = executionContext || this.executionContext;
              }
              if (this.isBound) {
                if (this.executionContext === context) {
                  return ;
                }
                this.unbind();
              }
              this.isBound = true;
              this.executionContext = context;
              if (this.owner) {
                this.owner.bind(context);
              }
              bindings = this.bindings;
              for (i = 0, ii = bindings.length; i < ii; ++i) {
                bindings[i].bind(context);
              }
              behaviors = this.behaviors;
              for (i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(context);
              }
              children = this.children;
              for (i = 0, ii = children.length; i < ii; ++i) {
                children[i].bind(context, true);
              }
            },
            writable: true,
            configurable: true
          },
          addBinding: {
            value: function addBinding(binding) {
              this.bindings.push(binding);
              if (this.isBound) {
                binding.bind(this.executionContext);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              var behaviors,
                  bindings,
                  children,
                  i,
                  ii;
              if (this.isBound) {
                this.isBound = false;
                if (this.owner) {
                  this.owner.unbind();
                }
                bindings = this.bindings;
                for (i = 0, ii = bindings.length; i < ii; ++i) {
                  bindings[i].unbind();
                }
                behaviors = this.behaviors;
                for (i = 0, ii = behaviors.length; i < ii; ++i) {
                  behaviors[i].unbind();
                }
                children = this.children;
                for (i = 0, ii = children.length; i < ii; ++i) {
                  children[i].unbind();
                }
              }
            },
            writable: true,
            configurable: true
          },
          insertNodesBefore: {
            value: function insertNodesBefore(refNode) {
              var parent = refNode.parentNode;
              parent.insertBefore(this.fragment, refNode);
            },
            writable: true,
            configurable: true
          },
          appendNodesTo: {
            value: function appendNodesTo(parent) {
              parent.appendChild(this.fragment);
            },
            writable: true,
            configurable: true
          },
          removeNodes: {
            value: function removeNodes() {
              var start = this.firstChild,
                  end = this.lastChild,
                  fragment = this.fragment,
                  next;
              var current = start,
                  loop = true,
                  nodes = [];
              while (loop) {
                if (current === end) {
                  loop = false;
                }
                next = current.nextSibling;
                this.fragment.appendChild(current);
                current = next;
              }
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              var behaviors,
                  children,
                  i,
                  ii;
              if (this.isAttached) {
                return ;
              }
              this.isAttached = true;
              if (this.owner) {
                this.owner.attached();
              }
              behaviors = this.behaviors;
              for (i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].attached();
              }
              children = this.children;
              for (i = 0, ii = children.length; i < ii; ++i) {
                children[i].attached();
              }
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              var behaviors,
                  children,
                  i,
                  ii;
              if (this.isAttached) {
                this.isAttached = false;
                if (this.owner) {
                  this.owner.detached();
                }
                behaviors = this.behaviors;
                for (i = 0, ii = behaviors.length; i < ii; ++i) {
                  behaviors[i].detached();
                }
                children = this.children;
                for (i = 0, ii = children.length; i < ii; ++i) {
                  children[i].detached();
                }
              }
            },
            writable: true,
            configurable: true
          }
        });
        return View;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/animator", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      Animator;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Animator = _export("Animator", (function() {
        function Animator() {
          _classCallCheck(this, Animator);
        }
        _prototypeProperties(Animator, {configureDefault: {
            value: function configureDefault(container, animatorInstance) {
              container.registerInstance(Animator, Animator.instance = animatorInstance || new Animator());
            },
            writable: true,
            configurable: true
          }}, {
          move: {
            value: function move() {
              return Promise.resolve(false);
            },
            writable: true,
            configurable: true
          },
          enter: {
            value: function enter(element) {
              return Promise.resolve(false);
            },
            writable: true,
            configurable: true
          },
          leave: {
            value: function leave(element) {
              return Promise.resolve(false);
            },
            writable: true,
            configurable: true
          },
          removeClass: {
            value: function removeClass(element, className) {
              return Promise.resolve(false);
            },
            writable: true,
            configurable: true
          },
          addClass: {
            value: function addClass(element, className) {
              return Promise.resolve(false);
            },
            writable: true,
            configurable: true
          }
        });
        return Animator;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/binding-language", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      BindingLanguage;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      BindingLanguage = _export("BindingLanguage", (function() {
        function BindingLanguage() {
          _classCallCheck(this, BindingLanguage);
        }
        _prototypeProperties(BindingLanguage, null, {
          inspectAttribute: {
            value: function inspectAttribute(resources, attrName, attrValue) {
              throw new Error("A BindingLanguage must implement inspectAttribute(...)");
            },
            writable: true,
            configurable: true
          },
          createAttributeInstruction: {
            value: function createAttributeInstruction(resources, element, info, existingInstruction) {
              throw new Error("A BindingLanguage must implement createAttributeInstruction(...)");
            },
            writable: true,
            configurable: true
          },
          parseText: {
            value: function parseText(resources, value) {
              throw new Error("A BindingLanguage must implement parseText(...)");
            },
            writable: true,
            configurable: true
          }
        });
        return BindingLanguage;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/template-controller", ["github:aurelia/metadata@0.3.4", "github:aurelia/templating@0.9.0/behavior-instance", "github:aurelia/templating@0.9.0/behaviors", "github:aurelia/templating@0.9.0/util"], function(_export) {
  var ResourceType,
      BehaviorInstance,
      configureBehavior,
      hyphenate,
      _prototypeProperties,
      _inherits,
      _classCallCheck,
      TemplateController;
  return {
    setters: [function(_aureliaMetadata) {
      ResourceType = _aureliaMetadata.ResourceType;
    }, function(_behaviorInstance) {
      BehaviorInstance = _behaviorInstance.BehaviorInstance;
    }, function(_behaviors) {
      configureBehavior = _behaviors.configureBehavior;
    }, function(_util) {
      hyphenate = _util.hyphenate;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      TemplateController = _export("TemplateController", (function(ResourceType) {
        function TemplateController(attribute) {
          _classCallCheck(this, TemplateController);
          this.name = attribute;
          this.properties = [];
          this.attributes = {};
          this.liftsContent = true;
        }
        _inherits(TemplateController, ResourceType);
        _prototypeProperties(TemplateController, {convention: {
            value: function convention(name) {
              if (name.endsWith("TemplateController")) {
                return new TemplateController(hyphenate(name.substring(0, name.length - 18)));
              }
            },
            writable: true,
            configurable: true
          }}, {
          analyze: {
            value: function analyze(container, target) {
              configureBehavior(container, this, target);
            },
            writable: true,
            configurable: true
          },
          load: {
            value: function load(container, target) {
              return Promise.resolve(this);
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              registry.registerAttribute(name || this.name, this, this.name);
            },
            writable: true,
            configurable: true
          },
          compile: {
            value: function compile(compiler, resources, node, instruction, parentNode) {
              if (!instruction.viewFactory) {
                var template = document.createElement("template"),
                    fragment = document.createDocumentFragment();
                node.removeAttribute(instruction.originalAttrName);
                if (node.parentNode) {
                  node.parentNode.replaceChild(template, node);
                } else if (window.ShadowDOMPolyfill) {
                  ShadowDOMPolyfill.unwrap(parentNode).replaceChild(ShadowDOMPolyfill.unwrap(template), ShadowDOMPolyfill.unwrap(node));
                } else {
                  parentNode.replaceChild(template, node);
                }
                fragment.appendChild(node);
                instruction.viewFactory = compiler.compile(fragment, resources);
                node = template;
              }
              instruction.suppressBind = true;
              return node;
            },
            writable: true,
            configurable: true
          },
          create: {
            value: function create(container, instruction, element) {
              var executionContext = instruction.executionContext || container.get(this.target),
                  behaviorInstance = new BehaviorInstance(this, executionContext, instruction);
              element.primaryBehavior = behaviorInstance;
              if (!(this.apiName in element)) {
                element[this.apiName] = behaviorInstance.executionContext;
              }
              return behaviorInstance;
            },
            writable: true,
            configurable: true
          }
        });
        return TemplateController;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/templating@0.9.0/view-strategy", ["github:aurelia/metadata@0.3.4", "github:aurelia/path@0.4.6"], function(_export) {
  var Metadata,
      Origin,
      relativeToFile,
      _inherits,
      _prototypeProperties,
      _classCallCheck,
      ViewStrategy,
      UseView,
      ConventionalView,
      NoView,
      TemplateRegistryViewStrategy;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
      Origin = _aureliaMetadata.Origin;
    }, function(_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }],
    execute: function() {
      "use strict";
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ViewStrategy = _export("ViewStrategy", (function() {
        function ViewStrategy() {
          _classCallCheck(this, ViewStrategy);
        }
        _prototypeProperties(ViewStrategy, {
          normalize: {
            value: function normalize(value) {
              if (typeof value === "string") {
                value = new UseView(value);
              }
              if (value && !(value instanceof ViewStrategy)) {
                throw new Error("The view must be a string or an instance of ViewStrategy.");
              }
              return value;
            },
            writable: true,
            configurable: true
          },
          getDefault: {
            value: function getDefault(target) {
              var strategy,
                  annotation;
              if (typeof target !== "function") {
                target = target.constructor;
              }
              annotation = Origin.get(target);
              strategy = Metadata.on(target).first(ViewStrategy);
              if (!strategy) {
                if (!annotation) {
                  throw new Error("Cannot determinte default view strategy for object.", target);
                }
                strategy = new ConventionalView(annotation.moduleId);
              } else if (annotation) {
                strategy.moduleId = annotation.moduleId;
              }
              return strategy;
            },
            writable: true,
            configurable: true
          }
        }, {
          makeRelativeTo: {
            value: function makeRelativeTo(baseUrl) {},
            writable: true,
            configurable: true
          },
          loadViewFactory: {
            value: function loadViewFactory(viewEngine, options) {
              throw new Error("A ViewStrategy must implement loadViewFactory(viewEngine, options).");
            },
            writable: true,
            configurable: true
          }
        });
        return ViewStrategy;
      })());
      UseView = _export("UseView", (function(ViewStrategy) {
        function UseView(path) {
          _classCallCheck(this, UseView);
          this.path = path;
        }
        _inherits(UseView, ViewStrategy);
        _prototypeProperties(UseView, null, {
          loadViewFactory: {
            value: function loadViewFactory(viewEngine, options) {
              if (!this.absolutePath && this.moduleId) {
                this.absolutePath = relativeToFile(this.path, this.moduleId);
              }
              return viewEngine.loadViewFactory(this.absolutePath || this.path, options, this.moduleId);
            },
            writable: true,
            configurable: true
          },
          makeRelativeTo: {
            value: function makeRelativeTo(file) {
              this.absolutePath = relativeToFile(this.path, file);
            },
            writable: true,
            configurable: true
          }
        });
        return UseView;
      })(ViewStrategy));
      ConventionalView = _export("ConventionalView", (function(ViewStrategy) {
        function ConventionalView(moduleId) {
          _classCallCheck(this, ConventionalView);
          this.moduleId = moduleId;
          this.viewUrl = ConventionalView.convertModuleIdToViewUrl(moduleId);
        }
        _inherits(ConventionalView, ViewStrategy);
        _prototypeProperties(ConventionalView, {convertModuleIdToViewUrl: {
            value: function convertModuleIdToViewUrl(moduleId) {
              return moduleId + ".html";
            },
            writable: true,
            configurable: true
          }}, {loadViewFactory: {
            value: function loadViewFactory(viewEngine, options) {
              return viewEngine.loadViewFactory(this.viewUrl, options, this.moduleId);
            },
            writable: true,
            configurable: true
          }});
        return ConventionalView;
      })(ViewStrategy));
      NoView = _export("NoView", (function(ViewStrategy) {
        function NoView() {
          _classCallCheck(this, NoView);
          if (ViewStrategy != null) {
            ViewStrategy.apply(this, arguments);
          }
        }
        _inherits(NoView, ViewStrategy);
        _prototypeProperties(NoView, null, {loadViewFactory: {
            value: function loadViewFactory() {
              return Promise.resolve(null);
            },
            writable: true,
            configurable: true
          }});
        return NoView;
      })(ViewStrategy));
      TemplateRegistryViewStrategy = _export("TemplateRegistryViewStrategy", (function(ViewStrategy) {
        function TemplateRegistryViewStrategy(moduleId, registryEntry) {
          _classCallCheck(this, TemplateRegistryViewStrategy);
          this.moduleId = moduleId;
          this.registryEntry = registryEntry;
        }
        _inherits(TemplateRegistryViewStrategy, ViewStrategy);
        _prototypeProperties(TemplateRegistryViewStrategy, null, {loadViewFactory: {
            value: function loadViewFactory(viewEngine, options) {
              if (this.registryEntry.isReady) {
                return Promise.resolve(this.registryEntry.factory);
              }
              return viewEngine.loadViewFactory(this.registryEntry, options, this.moduleId);
            },
            writable: true,
            configurable: true
          }});
        return TemplateRegistryViewStrategy;
      })(ViewStrategy));
    }
  };
});

System.register("github:aurelia/templating@0.9.0/element-config", ["github:aurelia/metadata@0.3.4", "github:aurelia/binding@0.4.0"], function(_export) {
  var ResourceType,
      EventManager,
      _prototypeProperties,
      _inherits,
      _classCallCheck,
      ElementConfig;
  return {
    setters: [function(_aureliaMetadata) {
      ResourceType = _aureliaMetadata.ResourceType;
    }, function(_aureliaBinding) {
      EventManager = _aureliaBinding.EventManager;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ElementConfig = _export("ElementConfig", (function(ResourceType) {
        function ElementConfig() {
          _classCallCheck(this, ElementConfig);
          if (ResourceType != null) {
            ResourceType.apply(this, arguments);
          }
        }
        _inherits(ElementConfig, ResourceType);
        _prototypeProperties(ElementConfig, null, {
          load: {
            value: function load(container, target) {
              var config = new target(),
                  eventManager = container.get(EventManager);
              eventManager.registerElementConfig(config);
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register() {},
            writable: true,
            configurable: true
          }
        });
        return ElementConfig;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/templating@0.9.0/composition-engine", ["github:aurelia/metadata@0.3.4", "github:aurelia/templating@0.9.0/view-strategy", "github:aurelia/templating@0.9.0/view-engine", "github:aurelia/templating@0.9.0/custom-element"], function(_export) {
  var Origin,
      Metadata,
      ViewStrategy,
      UseView,
      ViewEngine,
      CustomElement,
      _prototypeProperties,
      _classCallCheck,
      CompositionEngine;
  return {
    setters: [function(_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
      Metadata = _aureliaMetadata.Metadata;
    }, function(_viewStrategy) {
      ViewStrategy = _viewStrategy.ViewStrategy;
      UseView = _viewStrategy.UseView;
    }, function(_viewEngine) {
      ViewEngine = _viewEngine.ViewEngine;
    }, function(_customElement) {
      CustomElement = _customElement.CustomElement;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      CompositionEngine = _export("CompositionEngine", (function() {
        function CompositionEngine(viewEngine) {
          _classCallCheck(this, CompositionEngine);
          this.viewEngine = viewEngine;
        }
        _prototypeProperties(CompositionEngine, {inject: {
            value: function inject() {
              return [ViewEngine];
            },
            writable: true,
            configurable: true
          }}, {
          activate: {
            value: function activate(instruction) {
              if (instruction.skipActivation || typeof instruction.viewModel.activate !== "function") {
                return Promise.resolve();
              }
              return instruction.viewModel.activate(instruction.model) || Promise.resolve();
            },
            writable: true,
            configurable: true
          },
          createBehaviorAndSwap: {
            value: function createBehaviorAndSwap(instruction) {
              return this.createBehavior(instruction).then(function(behavior) {
                behavior.view.bind(behavior.executionContext);
                instruction.viewSlot.swap(behavior.view);
                if (instruction.currentBehavior) {
                  instruction.currentBehavior.unbind();
                }
                return behavior;
              });
            },
            writable: true,
            configurable: true
          },
          createBehavior: {
            value: function createBehavior(instruction) {
              var childContainer = instruction.childContainer,
                  viewModelResource = instruction.viewModelResource,
                  viewModel = instruction.viewModel,
                  metadata;
              return this.activate(instruction).then(function() {
                var doneLoading,
                    viewStrategyFromViewModel,
                    origin;
                if ("getViewStrategy" in viewModel && !instruction.view) {
                  viewStrategyFromViewModel = true;
                  instruction.view = ViewStrategy.normalize(viewModel.getViewStrategy());
                }
                if (instruction.view) {
                  if (viewStrategyFromViewModel) {
                    origin = Origin.get(viewModel.constructor);
                    if (origin) {
                      instruction.view.makeRelativeTo(origin.moduleId);
                    }
                  } else if (instruction.viewResources) {
                    instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
                  }
                }
                if (viewModelResource) {
                  metadata = viewModelResource.metadata;
                  doneLoading = metadata.load(childContainer, viewModelResource.value, instruction.view, true);
                } else {
                  metadata = new CustomElement();
                  doneLoading = metadata.load(childContainer, viewModel.constructor, instruction.view, true);
                }
                return doneLoading.then(function(viewFactory) {
                  return metadata.create(childContainer, {
                    executionContext: viewModel,
                    viewFactory: viewFactory,
                    suppressBind: true
                  });
                });
              });
            },
            writable: true,
            configurable: true
          },
          createViewModel: {
            value: function createViewModel(instruction) {
              var childContainer = instruction.childContainer || instruction.container.createChild();
              instruction.viewModel = instruction.viewResources ? instruction.viewResources.relativeToView(instruction.viewModel) : instruction.viewModel;
              return this.viewEngine.importViewModelResource(instruction.viewModel).then(function(viewModelResource) {
                childContainer.autoRegister(viewModelResource.value);
                instruction.viewModel = childContainer.viewModel = childContainer.get(viewModelResource.value);
                instruction.viewModelResource = viewModelResource;
                return instruction;
              });
            },
            writable: true,
            configurable: true
          },
          compose: {
            value: function compose(instruction) {
              var _this = this;
              instruction.childContainer = instruction.childContainer || instruction.container.createChild();
              instruction.view = ViewStrategy.normalize(instruction.view);
              if (instruction.viewModel) {
                if (typeof instruction.viewModel === "string") {
                  return this.createViewModel(instruction).then(function(instruction) {
                    return _this.createBehaviorAndSwap(instruction);
                  });
                } else {
                  return this.createBehaviorAndSwap(instruction);
                }
              } else if (instruction.view) {
                if (instruction.viewResources) {
                  instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
                }
                return instruction.view.loadViewFactory(this.viewEngine).then(function(viewFactory) {
                  var result = viewFactory.create(instruction.childContainer, instruction.executionContext);
                  instruction.viewSlot.swap(result);
                  return result;
                });
              } else if (instruction.viewSlot) {
                instruction.viewSlot.removeAll();
                return Promise.resolve(null);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return CompositionEngine;
      })());
    }
  };
});

System.register("github:aurelia/logging-console@0.2.4/index", [], function(_export) {
  var _prototypeProperties,
      _classCallCheck,
      ConsoleAppender;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ConsoleAppender = _export("ConsoleAppender", (function() {
        function ConsoleAppender() {
          _classCallCheck(this, ConsoleAppender);
        }
        _prototypeProperties(ConsoleAppender, null, {
          debug: {
            value: function debug(logger, message) {
              for (var _len = arguments.length,
                  rest = Array(_len > 2 ? _len - 2 : 0),
                  _key = 2; _key < _len; _key++) {
                rest[_key - 2] = arguments[_key];
              }
              console.debug.apply(console, ["DEBUG [" + logger.id + "] " + message].concat(rest));
            },
            writable: true,
            configurable: true
          },
          info: {
            value: function info(logger, message) {
              for (var _len = arguments.length,
                  rest = Array(_len > 2 ? _len - 2 : 0),
                  _key = 2; _key < _len; _key++) {
                rest[_key - 2] = arguments[_key];
              }
              console.info.apply(console, ["INFO [" + logger.id + "] " + message].concat(rest));
            },
            writable: true,
            configurable: true
          },
          warn: {
            value: function warn(logger, message) {
              for (var _len = arguments.length,
                  rest = Array(_len > 2 ? _len - 2 : 0),
                  _key = 2; _key < _len; _key++) {
                rest[_key - 2] = arguments[_key];
              }
              console.warn.apply(console, ["WARN [" + logger.id + "] " + message].concat(rest));
            },
            writable: true,
            configurable: true
          },
          error: {
            value: function error(logger, message) {
              for (var _len = arguments.length,
                  rest = Array(_len > 2 ? _len - 2 : 0),
                  _key = 2; _key < _len; _key++) {
                rest[_key - 2] = arguments[_key];
              }
              console.error.apply(console, ["ERROR [" + logger.id + "] " + message].concat(rest));
            },
            writable: true,
            configurable: true
          }
        });
        return ConsoleAppender;
      })());
    }
  };
});

System.register("github:aurelia/task-queue@0.2.5", ["github:aurelia/task-queue@0.2.5/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/binding@0.4.0/array-observation", ["github:aurelia/binding@0.4.0/array-change-records", "github:aurelia/binding@0.4.0/collection-observation"], function(_export) {
  var projectArraySplices,
      ModifyCollectionObserver,
      CollectionLengthObserver,
      _prototypeProperties,
      _get,
      _inherits,
      _classCallCheck,
      arrayProto,
      hasArrayObserve,
      ModifyArrayObserver,
      ArrayObserveObserver;
  _export("getArrayObserver", getArrayObserver);
  function getArrayObserver(taskQueue, array) {
    if (hasArrayObserve) {
      return new ArrayObserveObserver(array);
    } else {
      return ModifyArrayObserver.create(taskQueue, array);
    }
  }
  return {
    setters: [function(_arrayChangeRecords) {
      projectArraySplices = _arrayChangeRecords.projectArraySplices;
    }, function(_collectionObservation) {
      ModifyCollectionObserver = _collectionObservation.ModifyCollectionObserver;
      CollectionLengthObserver = _collectionObservation.CollectionLengthObserver;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      arrayProto = Array.prototype;
      hasArrayObserve = (function detectArrayObserve() {
        if (typeof Array.observe !== "function") {
          return false;
        }
        var records = [];
        function callback(recs) {
          records = recs;
        }
        var arr = [];
        Array.observe(arr, callback);
        arr.push(1, 2);
        arr.length = 0;
        Object.deliverChangeRecords(callback);
        if (records.length !== 2) {
          return false;
        }
        if (records[0].type != "splice" || records[1].type != "splice") {
          return false;
        }
        Array.unobserve(arr, callback);
        return true;
      })();
      ModifyArrayObserver = (function(ModifyCollectionObserver) {
        function ModifyArrayObserver(taskQueue, array) {
          _classCallCheck(this, ModifyArrayObserver);
          _get(Object.getPrototypeOf(ModifyArrayObserver.prototype), "constructor", this).call(this, taskQueue, array);
        }
        _inherits(ModifyArrayObserver, ModifyCollectionObserver);
        _prototypeProperties(ModifyArrayObserver, {create: {
            value: function create(taskQueue, array) {
              var observer = new ModifyArrayObserver(taskQueue, array);
              array.pop = function() {
                var methodCallResult = arrayProto.pop.apply(array, arguments);
                observer.addChangeRecord({
                  type: "delete",
                  object: array,
                  name: array.length,
                  oldValue: methodCallResult
                });
                return methodCallResult;
              };
              array.push = function() {
                var methodCallResult = arrayProto.push.apply(array, arguments);
                observer.addChangeRecord({
                  type: "splice",
                  object: array,
                  index: array.length - arguments.length,
                  removed: [],
                  addedCount: arguments.length
                });
                return methodCallResult;
              };
              array.reverse = function() {
                var oldArray = array.slice();
                var methodCallResult = arrayProto.reverse.apply(array, arguments);
                observer.reset(oldArray);
                return methodCallResult;
              };
              array.shift = function() {
                var methodCallResult = arrayProto.shift.apply(array, arguments);
                observer.addChangeRecord({
                  type: "delete",
                  object: array,
                  name: 0,
                  oldValue: methodCallResult
                });
                return methodCallResult;
              };
              array.sort = function() {
                var oldArray = array.slice();
                var methodCallResult = arrayProto.sort.apply(array, arguments);
                observer.reset(oldArray);
                return methodCallResult;
              };
              array.splice = function() {
                var methodCallResult = arrayProto.splice.apply(array, arguments);
                observer.addChangeRecord({
                  type: "splice",
                  object: array,
                  index: arguments[0],
                  removed: methodCallResult,
                  addedCount: arguments.length > 2 ? arguments.length - 2 : 0
                });
                return methodCallResult;
              };
              array.unshift = function() {
                var methodCallResult = arrayProto.unshift.apply(array, arguments);
                observer.addChangeRecord({
                  type: "splice",
                  object: array,
                  index: 0,
                  removed: [],
                  addedCount: arguments.length
                });
                return methodCallResult;
              };
              return observer;
            },
            writable: true,
            configurable: true
          }});
        return ModifyArrayObserver;
      })(ModifyCollectionObserver);
      ArrayObserveObserver = (function() {
        function ArrayObserveObserver(array) {
          _classCallCheck(this, ArrayObserveObserver);
          this.array = array;
          this.callbacks = [];
          this.observing = false;
        }
        _prototypeProperties(ArrayObserveObserver, null, {
          subscribe: {
            value: function subscribe(callback) {
              var _this = this;
              var callbacks = this.callbacks;
              callbacks.push(callback);
              if (!this.observing) {
                this.observing = true;
                Array.observe(this.array, function(changes) {
                  return _this.handleChanges(changes);
                });
              }
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(propertyName) {
              if (propertyName == "length") {
                return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.array));
              } else {
                throw new Error("You cannot observe the " + propertyName + " property of an array.");
              }
            },
            writable: true,
            configurable: true
          },
          handleChanges: {
            value: function handleChanges(changeRecords) {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  splices;
              if (!i) {
                return ;
              }
              splices = projectArraySplices(this.array, changeRecords);
              while (i--) {
                callbacks[i](splices);
              }
              if (this.lengthObserver) {
                this.lengthObserver.call(this.array.length);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return ArrayObserveObserver;
      })();
    }
  };
});

System.register("github:aurelia/binding@0.4.0/map-observation", ["github:aurelia/binding@0.4.0/map-change-records", "github:aurelia/binding@0.4.0/collection-observation"], function(_export) {
  var getEntries,
      getChangeRecords,
      ModifyCollectionObserver,
      _prototypeProperties,
      _get,
      _inherits,
      _classCallCheck,
      mapProto,
      ModifyMapObserver;
  _export("getMapObserver", getMapObserver);
  function getMapObserver(taskQueue, map) {
    return ModifyMapObserver.create(taskQueue, map);
  }
  return {
    setters: [function(_mapChangeRecords) {
      getEntries = _mapChangeRecords.getEntries;
      getChangeRecords = _mapChangeRecords.getChangeRecords;
    }, function(_collectionObservation) {
      ModifyCollectionObserver = _collectionObservation.ModifyCollectionObserver;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      mapProto = Map.prototype;
      ModifyMapObserver = (function(ModifyCollectionObserver) {
        function ModifyMapObserver(taskQueue, map) {
          _classCallCheck(this, ModifyMapObserver);
          _get(Object.getPrototypeOf(ModifyMapObserver.prototype), "constructor", this).call(this, taskQueue, map);
        }
        _inherits(ModifyMapObserver, ModifyCollectionObserver);
        _prototypeProperties(ModifyMapObserver, {create: {
            value: function create(taskQueue, map) {
              var observer = new ModifyMapObserver(taskQueue, map);
              map.set = function() {
                var oldValue = map.get(arguments[0]);
                var type = oldValue ? "update" : "add";
                var methodCallResult = mapProto.set.apply(map, arguments);
                observer.addChangeRecord({
                  type: type,
                  object: map,
                  key: arguments[0],
                  oldValue: oldValue
                });
                return methodCallResult;
              };
              map["delete"] = function() {
                var oldValue = map.get(arguments[0]);
                var methodCallResult = mapProto["delete"].apply(map, arguments);
                observer.addChangeRecord({
                  type: "delete",
                  object: map,
                  key: arguments[0],
                  oldValue: oldValue
                });
                return methodCallResult;
              };
              map.clear = function() {
                var methodCallResult = mapProto.clear.apply(map, arguments);
                observer.addChangeRecord({
                  type: "clear",
                  object: map
                });
                return methodCallResult;
              };
              return observer;
            },
            writable: true,
            configurable: true
          }});
        return ModifyMapObserver;
      })(ModifyCollectionObserver);
    }
  };
});

System.register("github:aurelia/binding@0.4.0/ast", ["github:aurelia/binding@0.4.0/path-observer", "github:aurelia/binding@0.4.0/composite-observer"], function(_export) {
  var PathObserver,
      CompositeObserver,
      _get,
      _inherits,
      _prototypeProperties,
      _classCallCheck,
      Expression,
      Chain,
      ValueConverter,
      Assign,
      Conditional,
      AccessScope,
      AccessMember,
      AccessKeyed,
      CallScope,
      CallMember,
      CallFunction,
      Binary,
      PrefixNot,
      LiteralPrimitive,
      LiteralString,
      LiteralArray,
      LiteralObject,
      Unparser,
      evalListCache;
  function evalList(scope, list, valueConverters) {
    var length = list.length,
        cacheLength,
        i;
    for (cacheLength = evalListCache.length; cacheLength <= length; ++cacheLength) {
      _evalListCache.push([]);
    }
    var result = evalListCache[length];
    for (i = 0; i < length; ++i) {
      result[i] = list[i].evaluate(scope, valueConverters);
    }
    return result;
  }
  function autoConvertAdd(a, b) {
    if (a != null && b != null) {
      if (typeof a == "string" && typeof b != "string") {
        return a + b.toString();
      }
      if (typeof a != "string" && typeof b == "string") {
        return a.toString() + b;
      }
      return a + b;
    }
    if (a != null) {
      return a;
    }
    if (b != null) {
      return b;
    }
    return 0;
  }
  function ensureFunctionFromMap(obj, name) {
    var func = obj[name];
    if (typeof func === "function") {
      return func;
    }
    if (func === null) {
      throw new Error("Undefined function " + name);
    } else {
      throw new Error("" + name + " is not a function");
    }
  }
  function getKeyed(obj, key) {
    if (Array.isArray(obj)) {
      return obj[parseInt(key)];
    } else if (obj) {
      return obj[key];
    } else if (obj === null) {
      throw new Error("Accessing null object");
    } else {
      return obj[key];
    }
  }
  function setKeyed(obj, key, value) {
    if (Array.isArray(obj)) {
      var index = parseInt(key);
      if (obj.length <= index) {
        obj.length = index + 1;
      }
      obj[index] = value;
    } else {
      obj[key] = value;
    }
    return value;
  }
  return {
    setters: [function(_pathObserver) {
      PathObserver = _pathObserver.PathObserver;
    }, function(_compositeObserver) {
      CompositeObserver = _compositeObserver.CompositeObserver;
    }],
    execute: function() {
      "use strict";
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Expression = _export("Expression", (function() {
        function Expression() {
          _classCallCheck(this, Expression);
          this.isChain = false;
          this.isAssignable = false;
        }
        _prototypeProperties(Expression, null, {
          evaluate: {
            value: function evaluate() {
              throw new Error("Cannot evaluate " + this);
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign() {
              throw new Error("Cannot assign to " + this);
            },
            writable: true,
            configurable: true
          },
          toString: {
            value: function toString() {
              return Unparser.unparse(this);
            },
            writable: true,
            configurable: true
          }
        });
        return Expression;
      })());
      Chain = _export("Chain", (function(Expression) {
        function Chain(expressions) {
          _classCallCheck(this, Chain);
          _get(Object.getPrototypeOf(Chain.prototype), "constructor", this).call(this);
          this.expressions = expressions;
          this.isChain = true;
        }
        _inherits(Chain, Expression);
        _prototypeProperties(Chain, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var result,
                  expressions = this.expressions,
                  length = expressions.length,
                  i,
                  last;
              for (i = 0; i < length; ++i) {
                last = expressions[i].evaluate(scope, valueConverters);
                if (last !== null) {
                  result = last;
                }
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitChain(this);
            },
            writable: true,
            configurable: true
          }
        });
        return Chain;
      })(Expression));
      ValueConverter = _export("ValueConverter", (function(Expression) {
        function ValueConverter(expression, name, args, allArgs) {
          _classCallCheck(this, ValueConverter);
          _get(Object.getPrototypeOf(ValueConverter.prototype), "constructor", this).call(this);
          this.expression = expression;
          this.name = name;
          this.args = args;
          this.allArgs = allArgs;
        }
        _inherits(ValueConverter, Expression);
        _prototypeProperties(ValueConverter, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var converter = valueConverters(this.name);
              if (!converter) {
                throw new Error("No ValueConverter named \"" + this.name + "\" was found!");
              }
              if ("toView" in converter) {
                return converter.toView.apply(converter, evalList(scope, this.allArgs, valueConverters));
              }
              return this.allArgs[0].evaluate(scope, valueConverters);
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign(scope, value, valueConverters) {
              var converter = valueConverters(this.name);
              if (!converter) {
                throw new Error("No ValueConverter named \"" + this.name + "\" was found!");
              }
              if ("fromView" in converter) {
                value = converter.fromView.apply(converter, [value].concat(evalList(scope, this.args, valueConverters)));
              }
              return this.allArgs[0].assign(scope, value, valueConverters);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitValueConverter(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  childObservers = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              for (i = 0, ii = this.allArgs.length; i < ii; ++i) {
                exp = this.allArgs[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return ValueConverter;
      })(Expression));
      Assign = _export("Assign", (function(Expression) {
        function Assign(target, value) {
          _classCallCheck(this, Assign);
          _get(Object.getPrototypeOf(Assign.prototype), "constructor", this).call(this);
          this.target = target;
          this.value = value;
        }
        _inherits(Assign, Expression);
        _prototypeProperties(Assign, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return this.target.assign(scope, this.value.evaluate(scope, valueConverters));
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(vistor) {
              vistor.visitAssign(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              return {value: this.evaluate(scope, binding.valueConverterLookupFunction)};
            },
            writable: true,
            configurable: true
          }
        });
        return Assign;
      })(Expression));
      Conditional = _export("Conditional", (function(Expression) {
        function Conditional(condition, yes, no) {
          _classCallCheck(this, Conditional);
          _get(Object.getPrototypeOf(Conditional.prototype), "constructor", this).call(this);
          this.condition = condition;
          this.yes = yes;
          this.no = no;
        }
        _inherits(Conditional, Expression);
        _prototypeProperties(Conditional, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return !!this.condition.evaluate(scope) ? this.yes.evaluate(scope) : this.no.evaluate(scope);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitConditional(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var conditionInfo = this.condition.connect(binding, scope),
                  yesInfo = this.yes.connect(binding, scope),
                  noInfo = this.no.connect(binding, scope),
                  childObservers = [],
                  observer;
              if (conditionInfo.observer) {
                childObservers.push(conditionInfo.observer);
              }
              if (yesInfo.observer) {
                childObservers.push(yesInfo.observer);
              }
              if (noInfo.observer) {
                childObservers.push(noInfo.observer);
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: !!conditionInfo.value ? yesInfo.value : noInfo.value,
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return Conditional;
      })(Expression));
      AccessScope = _export("AccessScope", (function(Expression) {
        function AccessScope(name) {
          _classCallCheck(this, AccessScope);
          _get(Object.getPrototypeOf(AccessScope.prototype), "constructor", this).call(this);
          this.name = name;
          this.isAssignable = true;
        }
        _inherits(AccessScope, Expression);
        _prototypeProperties(AccessScope, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return scope[this.name];
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign(scope, value) {
              return scope[this.name] = value;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitAccessScope(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var observer = binding.getObserver(scope, this.name);
              return {
                value: observer.getValue(),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return AccessScope;
      })(Expression));
      AccessMember = _export("AccessMember", (function(Expression) {
        function AccessMember(object, name) {
          _classCallCheck(this, AccessMember);
          _get(Object.getPrototypeOf(AccessMember.prototype), "constructor", this).call(this);
          this.object = object;
          this.name = name;
          this.isAssignable = true;
        }
        _inherits(AccessMember, Expression);
        _prototypeProperties(AccessMember, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var instance = this.object.evaluate(scope, valueConverters);
              return instance === null || instance === undefined ? instance : instance[this.name];
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign(scope, value) {
              var instance = this.object.evaluate(scope);
              if (instance === null || instance === undefined) {
                instance = {};
                this.object.assign(scope, instance);
              }
              return instance[this.name] = value;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitAccessMember(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var info = this.object.connect(binding, scope),
                  objectInstance = info.value,
                  objectObserver = info.observer,
                  observer;
              if (objectObserver) {
                observer = new PathObserver(objectObserver, function(value) {
                  if (value == null || value == undefined) {
                    return value;
                  }
                  return binding.getObserver(value, _this.name);
                }, objectInstance);
              } else {
                observer = binding.getObserver(objectInstance, this.name);
              }
              return {
                value: objectInstance == null ? null : objectInstance[this.name],
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return AccessMember;
      })(Expression));
      AccessKeyed = _export("AccessKeyed", (function(Expression) {
        function AccessKeyed(object, key) {
          _classCallCheck(this, AccessKeyed);
          _get(Object.getPrototypeOf(AccessKeyed.prototype), "constructor", this).call(this);
          this.object = object;
          this.key = key;
          this.isAssignable = true;
        }
        _inherits(AccessKeyed, Expression);
        _prototypeProperties(AccessKeyed, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var instance = this.object.evaluate(scope, valueConverters);
              var lookup = this.key.evaluate(scope, valueConverters);
              return getKeyed(instance, lookup);
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign(scope, value) {
              var instance = this.object.evaluate(scope);
              var lookup = this.key.evaluate(scope);
              return setKeyed(instance, lookup, value);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitAccessKeyed(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var objectInfo = this.object.connect(binding, scope),
                  keyInfo = this.key.connect(binding, scope),
                  childObservers = [],
                  observer;
              if (objectInfo.observer) {
                childObservers.push(objectInfo.observer);
              }
              if (keyInfo.observer) {
                childObservers.push(keyInfo.observer);
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return AccessKeyed;
      })(Expression));
      CallScope = _export("CallScope", (function(Expression) {
        function CallScope(name, args) {
          _classCallCheck(this, CallScope);
          _get(Object.getPrototypeOf(CallScope.prototype), "constructor", this).call(this);
          this.name = name;
          this.args = args;
        }
        _inherits(CallScope, Expression);
        _prototypeProperties(CallScope, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters, args) {
              args = args || evalList(scope, this.args, valueConverters);
              return ensureFunctionFromMap(scope, this.name).apply(scope, args);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitCallScope(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  childObservers = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              for (i = 0, ii = this.args.length; i < ii; ++i) {
                exp = this.args[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return CallScope;
      })(Expression));
      CallMember = _export("CallMember", (function(Expression) {
        function CallMember(object, name, args) {
          _classCallCheck(this, CallMember);
          _get(Object.getPrototypeOf(CallMember.prototype), "constructor", this).call(this);
          this.object = object;
          this.name = name;
          this.args = args;
        }
        _inherits(CallMember, Expression);
        _prototypeProperties(CallMember, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters, args) {
              var instance = this.object.evaluate(scope, valueConverters);
              args = args || evalList(scope, this.args, valueConverters);
              return ensureFunctionFromMap(instance, this.name).apply(instance, args);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitCallMember(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  objectInfo = this.object.connect(binding, scope),
                  childObservers = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              if (objectInfo.observer) {
                childObservers.push(objectInfo.observer);
              }
              for (i = 0, ii = this.args.length; i < ii; ++i) {
                exp = this.args[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return CallMember;
      })(Expression));
      CallFunction = _export("CallFunction", (function(Expression) {
        function CallFunction(func, args) {
          _classCallCheck(this, CallFunction);
          _get(Object.getPrototypeOf(CallFunction.prototype), "constructor", this).call(this);
          this.func = func;
          this.args = args;
        }
        _inherits(CallFunction, Expression);
        _prototypeProperties(CallFunction, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters, args) {
              var func = this.func.evaluate(scope, valueConverters);
              if (typeof func !== "function") {
                throw new Error("" + this.func + " is not a function");
              } else {
                return func.apply(null, args || evalList(scope, this.args, valueConverters));
              }
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitCallFunction(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  funcInfo = this.func.connect(binding, scope),
                  childObservers = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              if (funcInfo.observer) {
                childObservers.push(funcInfo.observer);
              }
              for (i = 0, ii = this.args.length; i < ii; ++i) {
                exp = this.args[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return CallFunction;
      })(Expression));
      Binary = _export("Binary", (function(Expression) {
        function Binary(operation, left, right) {
          _classCallCheck(this, Binary);
          _get(Object.getPrototypeOf(Binary.prototype), "constructor", this).call(this);
          this.operation = operation;
          this.left = left;
          this.right = right;
        }
        _inherits(Binary, Expression);
        _prototypeProperties(Binary, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var left = this.left.evaluate(scope);
              switch (this.operation) {
                case "&&":
                  return !!left && !!this.right.evaluate(scope);
                case "||":
                  return !!left || !!this.right.evaluate(scope);
              }
              var right = this.right.evaluate(scope);
              switch (this.operation) {
                case "==":
                  return left == right;
                case "===":
                  return left === right;
                case "!=":
                  return left != right;
                case "!==":
                  return left !== right;
              }
              if (left === null || right === null) {
                switch (this.operation) {
                  case "+":
                    if (left != null) {
                      return left;
                    }
                    if (right != null) {
                      return right;
                    }
                    return 0;
                  case "-":
                    if (left != null) {
                      return left;
                    }
                    if (right != null) {
                      return 0 - right;
                    }
                    return 0;
                }
                return null;
              }
              switch (this.operation) {
                case "+":
                  return autoConvertAdd(left, right);
                case "-":
                  return left - right;
                case "*":
                  return left * right;
                case "/":
                  return left / right;
                case "%":
                  return left % right;
                case "<":
                  return left < right;
                case ">":
                  return left > right;
                case "<=":
                  return left <= right;
                case ">=":
                  return left >= right;
                case "^":
                  return left ^ right;
                case "&":
                  return left & right;
              }
              throw new Error("Internal error [" + this.operation + "] not handled");
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitBinary(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var leftInfo = this.left.connect(binding, scope),
                  rightInfo = this.right.connect(binding, scope),
                  childObservers = [],
                  observer;
              if (leftInfo.observer) {
                childObservers.push(leftInfo.observer);
              }
              if (rightInfo.observer) {
                childObservers.push(rightInfo.observer);
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return Binary;
      })(Expression));
      PrefixNot = _export("PrefixNot", (function(Expression) {
        function PrefixNot(operation, expression) {
          _classCallCheck(this, PrefixNot);
          _get(Object.getPrototypeOf(PrefixNot.prototype), "constructor", this).call(this);
          this.operation = operation;
          this.expression = expression;
        }
        _inherits(PrefixNot, Expression);
        _prototypeProperties(PrefixNot, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return !this.expression.evaluate(scope);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitPrefix(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var info = this.expression.connect(binding, scope),
                  observer;
              if (info.observer) {
                observer = new CompositeObserver([info.observer], function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: !info.value,
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return PrefixNot;
      })(Expression));
      LiteralPrimitive = _export("LiteralPrimitive", (function(Expression) {
        function LiteralPrimitive(value) {
          _classCallCheck(this, LiteralPrimitive);
          _get(Object.getPrototypeOf(LiteralPrimitive.prototype), "constructor", this).call(this);
          this.value = value;
        }
        _inherits(LiteralPrimitive, Expression);
        _prototypeProperties(LiteralPrimitive, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return this.value;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitLiteralPrimitive(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              return {value: this.value};
            },
            writable: true,
            configurable: true
          }
        });
        return LiteralPrimitive;
      })(Expression));
      LiteralString = _export("LiteralString", (function(Expression) {
        function LiteralString(value) {
          _classCallCheck(this, LiteralString);
          _get(Object.getPrototypeOf(LiteralString.prototype), "constructor", this).call(this);
          this.value = value;
        }
        _inherits(LiteralString, Expression);
        _prototypeProperties(LiteralString, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return this.value;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitLiteralString(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              return {value: this.value};
            },
            writable: true,
            configurable: true
          }
        });
        return LiteralString;
      })(Expression));
      LiteralArray = _export("LiteralArray", (function(Expression) {
        function LiteralArray(elements) {
          _classCallCheck(this, LiteralArray);
          _get(Object.getPrototypeOf(LiteralArray.prototype), "constructor", this).call(this);
          this.elements = elements;
        }
        _inherits(LiteralArray, Expression);
        _prototypeProperties(LiteralArray, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var elements = this.elements,
                  length = elements.length,
                  result = [],
                  i;
              for (i = 0; i < length; ++i) {
                result[i] = elements[i].evaluate(scope, valueConverters);
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitLiteralArray(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  childObservers = [],
                  results = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              for (i = 0, ii = this.elements.length; i < ii; ++i) {
                exp = this.elements[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
                results[i] = expInfo.value;
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: results,
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return LiteralArray;
      })(Expression));
      LiteralObject = _export("LiteralObject", (function(Expression) {
        function LiteralObject(keys, values) {
          _classCallCheck(this, LiteralObject);
          _get(Object.getPrototypeOf(LiteralObject.prototype), "constructor", this).call(this);
          this.keys = keys;
          this.values = values;
        }
        _inherits(LiteralObject, Expression);
        _prototypeProperties(LiteralObject, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var instance = {},
                  keys = this.keys,
                  values = this.values,
                  length = keys.length,
                  i;
              for (i = 0; i < length; ++i) {
                instance[keys[i]] = values[i].evaluate(scope, valueConverters);
              }
              return instance;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitLiteralObject(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  childObservers = [],
                  instance = {},
                  keys = this.keys,
                  values = this.values,
                  length = keys.length,
                  i,
                  valueInfo;
              for (i = 0; i < length; ++i) {
                valueInfo = values[i].connect(binding, scope);
                if (valueInfo.observer) {
                  childObservers.push(valueInfo.observer);
                }
                instance[keys[i]] = valueInfo.value;
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: instance,
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return LiteralObject;
      })(Expression));
      Unparser = _export("Unparser", (function() {
        function Unparser(buffer) {
          _classCallCheck(this, Unparser);
          this.buffer = buffer;
        }
        _prototypeProperties(Unparser, {unparse: {
            value: function unparse(expression) {
              var buffer = [],
                  visitor = new Unparser(buffer);
              expression.accept(visitor);
              return buffer.join("");
            },
            writable: true,
            configurable: true
          }}, {
          write: {
            value: function write(text) {
              this.buffer.push(text);
            },
            writable: true,
            configurable: true
          },
          writeArgs: {
            value: function writeArgs(args) {
              var i,
                  length;
              this.write("(");
              for (i = 0, length = args.length; i < length; ++i) {
                if (i !== 0) {
                  this.write(",");
                }
                args[i].accept(this);
              }
              this.write(")");
            },
            writable: true,
            configurable: true
          },
          visitChain: {
            value: function visitChain(chain) {
              var expressions = chain.expressions,
                  length = expressions.length,
                  i;
              for (i = 0; i < length; ++i) {
                if (i !== 0) {
                  this.write(";");
                }
                expressions[i].accept(this);
              }
            },
            writable: true,
            configurable: true
          },
          visitValueConverter: {
            value: function visitValueConverter(converter) {
              var args = converter.args,
                  length = args.length,
                  i;
              this.write("(");
              converter.expression.accept(this);
              this.write("|" + converter.name);
              for (i = 0; i < length; ++i) {
                this.write(" :");
                args[i].accept(this);
              }
              this.write(")");
            },
            writable: true,
            configurable: true
          },
          visitAssign: {
            value: function visitAssign(assign) {
              assign.target.accept(this);
              this.write("=");
              assign.value.accept(this);
            },
            writable: true,
            configurable: true
          },
          visitConditional: {
            value: function visitConditional(conditional) {
              conditional.condition.accept(this);
              this.write("?");
              conditional.yes.accept(this);
              this.write(":");
              conditional.no.accept(this);
            },
            writable: true,
            configurable: true
          },
          visitAccessScope: {
            value: function visitAccessScope(access) {
              this.write(access.name);
            },
            writable: true,
            configurable: true
          },
          visitAccessMember: {
            value: function visitAccessMember(access) {
              access.object.accept(this);
              this.write("." + access.name);
            },
            writable: true,
            configurable: true
          },
          visitAccessKeyed: {
            value: function visitAccessKeyed(access) {
              access.object.accept(this);
              this.write("[");
              access.key.accept(this);
              this.write("]");
            },
            writable: true,
            configurable: true
          },
          visitCallScope: {
            value: function visitCallScope(call) {
              this.write(call.name);
              this.writeArgs(call.args);
            },
            writable: true,
            configurable: true
          },
          visitCallFunction: {
            value: function visitCallFunction(call) {
              call.func.accept(this);
              this.writeArgs(call.args);
            },
            writable: true,
            configurable: true
          },
          visitCallMember: {
            value: function visitCallMember(call) {
              call.object.accept(this);
              this.write("." + call.name);
              this.writeArgs(call.args);
            },
            writable: true,
            configurable: true
          },
          visitPrefix: {
            value: function visitPrefix(prefix) {
              this.write("(" + prefix.operation);
              prefix.expression.accept(this);
              this.write(")");
            },
            writable: true,
            configurable: true
          },
          visitBinary: {
            value: function visitBinary(binary) {
              this.write("(");
              binary.left.accept(this);
              this.write(binary.operation);
              binary.right.accept(this);
              this.write(")");
            },
            writable: true,
            configurable: true
          },
          visitLiteralPrimitive: {
            value: function visitLiteralPrimitive(literal) {
              this.write("" + literal.value);
            },
            writable: true,
            configurable: true
          },
          visitLiteralArray: {
            value: function visitLiteralArray(literal) {
              var elements = literal.elements,
                  length = elements.length,
                  i;
              this.write("[");
              for (i = 0; i < length; ++i) {
                if (i !== 0) {
                  this.write(",");
                }
                elements[i].accept(this);
              }
              this.write("]");
            },
            writable: true,
            configurable: true
          },
          visitLiteralObject: {
            value: function visitLiteralObject(literal) {
              var keys = literal.keys,
                  values = literal.values,
                  length = keys.length,
                  i;
              this.write("{");
              for (i = 0; i < length; ++i) {
                if (i !== 0) {
                  this.write(",");
                }
                this.write("'" + keys[i] + "':");
                values[i].accept(this);
              }
              this.write("}");
            },
            writable: true,
            configurable: true
          },
          visitLiteralString: {
            value: function visitLiteralString(literal) {
              var escaped = literal.value.replace(/'/g, "'");
              this.write("'" + escaped + "'");
            },
            writable: true,
            configurable: true
          }
        });
        return Unparser;
      })());
      evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];
    }
  };
});

System.register("github:aurelia/templating@0.9.0/behaviors", ["github:aurelia/metadata@0.3.4", "github:aurelia/task-queue@0.2.5", "github:aurelia/binding@0.4.0", "github:aurelia/templating@0.9.0/children", "github:aurelia/templating@0.9.0/property", "github:aurelia/templating@0.9.0/util"], function(_export) {
  var Metadata,
      TaskQueue,
      ObserverLocator,
      ChildObserver,
      BehaviorProperty,
      hyphenate;
  _export("configureBehavior", configureBehavior);
  function configureBehavior(container, behavior, target, valuePropertyName) {
    var proto = target.prototype,
        taskQueue = container.get(TaskQueue),
        meta = Metadata.on(target),
        observerLocator = container.get(ObserverLocator),
        i,
        ii,
        properties;
    if (!behavior.name) {
      behavior.name = hyphenate(target.name);
    }
    behavior.target = target;
    behavior.observerLocator = observerLocator;
    behavior.handlesCreated = "created" in proto;
    behavior.handlesBind = "bind" in proto;
    behavior.handlesUnbind = "unbind" in proto;
    behavior.handlesAttached = "attached" in proto;
    behavior.handlesDetached = "detached" in proto;
    behavior.apiName = behavior.name.replace(/-([a-z])/g, function(m, w) {
      return w.toUpperCase();
    });
    properties = meta.all(BehaviorProperty);
    for (i = 0, ii = properties.length; i < ii; ++i) {
      properties[i].define(taskQueue, behavior);
    }
    properties = behavior.properties;
    if (properties.length === 0 && "valueChanged" in target.prototype) {
      new BehaviorProperty("value", "valueChanged", valuePropertyName || behavior.name).define(taskQueue, behavior);
    }
    if (properties.length !== 0) {
      target.initialize = function(executionContext) {
        var observerLookup = observerLocator.getObserversLookup(executionContext),
            i,
            ii,
            observer;
        for (i = 0, ii = properties.length; i < ii; ++i) {
          observer = properties[i].createObserver(executionContext);
          if (observer !== undefined) {
            observerLookup[observer.propertyName] = observer;
          }
        }
      };
    }
    behavior.childExpression = meta.first(ChildObserver);
  }
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }, function(_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function(_children) {
      ChildObserver = _children.ChildObserver;
    }, function(_property) {
      BehaviorProperty = _property.BehaviorProperty;
    }, function(_util) {
      hyphenate = _util.hyphenate;
    }],
    execute: function() {
      "use strict";
    }
  };
});

System.register("github:aurelia/templating@0.9.0/view-slot", ["github:aurelia/templating@0.9.0/content-selector", "github:aurelia/templating@0.9.0/animator"], function(_export) {
  var ContentSelector,
      Animator,
      _prototypeProperties,
      _classCallCheck,
      ViewSlot;
  return {
    setters: [function(_contentSelector) {
      ContentSelector = _contentSelector.ContentSelector;
    }, function(_animator) {
      Animator = _animator.Animator;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ViewSlot = _export("ViewSlot", (function() {
        function ViewSlot(anchor, anchorIsContainer, executionContext) {
          var animator = arguments[3] === undefined ? Animator.instance : arguments[3];
          _classCallCheck(this, ViewSlot);
          this.anchor = anchor;
          this.viewAddMethod = anchorIsContainer ? "appendNodesTo" : "insertNodesBefore";
          this.executionContext = executionContext;
          this.animator = animator;
          this.children = [];
          this.isBound = false;
          this.isAttached = false;
          anchor.viewSlot = this;
        }
        _prototypeProperties(ViewSlot, null, {
          transformChildNodesIntoView: {
            value: function transformChildNodesIntoView() {
              var parent = this.anchor;
              this.children.push({
                fragment: parent,
                firstChild: parent.firstChild,
                lastChild: parent.lastChild,
                removeNodes: function removeNodes() {
                  var last;
                  while (last = parent.lastChild) {
                    parent.removeChild(last);
                  }
                },
                created: function created() {},
                bind: function bind() {},
                unbind: function unbind() {},
                attached: function attached() {},
                detached: function detached() {}
              });
            },
            writable: true,
            configurable: true
          },
          bind: {
            value: function bind(executionContext) {
              var i,
                  ii,
                  children;
              if (this.isBound) {
                if (this.executionContext === executionContext) {
                  return ;
                }
                this.unbind();
              }
              this.isBound = true;
              this.executionContext = executionContext = executionContext || this.executionContext;
              children = this.children;
              for (i = 0, ii = children.length; i < ii; ++i) {
                children[i].bind(executionContext, true);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              var i,
                  ii,
                  children = this.children;
              this.isBound = false;
              for (i = 0, ii = children.length; i < ii; ++i) {
                children[i].unbind();
              }
            },
            writable: true,
            configurable: true
          },
          add: {
            value: function add(view) {
              view[this.viewAddMethod](this.anchor);
              this.children.push(view);
              if (this.isAttached) {
                view.attached();
                var element = view.firstChild ? view.firstChild.nextElementSibling : null;
                if (view.firstChild && view.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains("au-animate")) {
                  this.animator.enter(element);
                }
              }
            },
            writable: true,
            configurable: true
          },
          insert: {
            value: function insert(index, view) {
              if (index === 0 && !this.children.length || index >= this.children.length) {
                this.add(view);
              } else {
                view.insertNodesBefore(this.children[index].firstChild);
                this.children.splice(index, 0, view);
                if (this.isAttached) {
                  view.attached();
                }
              }
            },
            writable: true,
            configurable: true
          },
          remove: {
            value: function remove(view) {
              view.removeNodes();
              this.children.splice(this.children.indexOf(view), 1);
              if (this.isAttached) {
                view.detached();
              }
            },
            writable: true,
            configurable: true
          },
          removeAt: {
            value: function removeAt(index) {
              var _this = this;
              var view = this.children[index];
              var removeAction = function() {
                view.removeNodes();
                _this.children.splice(index, 1);
                if (_this.isAttached) {
                  view.detached();
                }
                return view;
              };
              var element = view.firstChild && view.firstChild.nextElementSibling ? view.firstChild.nextElementSibling : null;
              if (view.firstChild && view.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains("au-animate")) {
                return this.animator.leave(element).then(function() {
                  return removeAction();
                });
              } else {
                return removeAction();
              }
            },
            writable: true,
            configurable: true
          },
          removeAll: {
            value: function removeAll() {
              var _this = this;
              var children = this.children,
                  ii = children.length,
                  i;
              var rmPromises = [];
              children.forEach(function(child) {
                var element = child.firstChild ? child.firstChild.nextElementSibling : null;
                if (child.firstChild && child.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains("au-animate")) {
                  rmPromises.push(_this.animator.leave(element).then(function() {
                    child.removeNodes();
                  }));
                } else {
                  child.removeNodes();
                }
              });
              var removeAction = function() {
                if (_this.isAttached) {
                  for (i = 0; i < ii; ++i) {
                    children[i].detached();
                  }
                }
                _this.children = [];
              };
              if (rmPromises.length > 0) {
                return Promise.all(rmPromises).then(function() {
                  removeAction();
                });
              } else {
                removeAction();
              }
            },
            writable: true,
            configurable: true
          },
          swap: {
            value: function swap(view) {
              var _this = this;
              var removeResponse = this.removeAll();
              if (removeResponse !== undefined) {
                removeResponse.then(function() {
                  _this.add(view);
                });
              } else {
                this.add(view);
              }
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              var i,
                  ii,
                  children,
                  child;
              if (this.isAttached) {
                return ;
              }
              this.isAttached = true;
              children = this.children;
              for (i = 0, ii = children.length; i < ii; ++i) {
                child = children[i];
                child.attached();
                var element = child.firstChild ? child.firstChild.nextElementSibling : null;
                if (child.firstChild && child.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains("au-animate")) {
                  this.animator.enter(element);
                }
              }
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              var i,
                  ii,
                  children;
              if (this.isAttached) {
                this.isAttached = false;
                children = this.children;
                for (i = 0, ii = children.length; i < ii; ++i) {
                  children[i].detached();
                }
              }
            },
            writable: true,
            configurable: true
          },
          installContentSelectors: {
            value: function installContentSelectors(contentSelectors) {
              this.contentSelectors = contentSelectors;
              this.add = this.contentSelectorAdd;
              this.insert = this.contentSelectorInsert;
              this.remove = this.contentSelectorRemove;
              this.removeAt = this.contentSelectorRemoveAt;
              this.removeAll = this.contentSelectorRemoveAll;
            },
            writable: true,
            configurable: true
          },
          contentSelectorAdd: {
            value: function contentSelectorAdd(view) {
              ContentSelector.applySelectors(view, this.contentSelectors, function(contentSelector, group) {
                return contentSelector.add(group);
              });
              this.children.push(view);
              if (this.isAttached) {
                view.attached();
              }
            },
            writable: true,
            configurable: true
          },
          contentSelectorInsert: {
            value: function contentSelectorInsert(index, view) {
              if (index === 0 && !this.children.length || index >= this.children.length) {
                this.add(view);
              } else {
                ContentSelector.applySelectors(view, this.contentSelectors, function(contentSelector, group) {
                  return contentSelector.insert(index, group);
                });
                this.children.splice(index, 0, view);
                if (this.isAttached) {
                  view.attached();
                }
              }
            },
            writable: true,
            configurable: true
          },
          contentSelectorRemove: {
            value: function contentSelectorRemove(view) {
              var index = this.children.indexOf(view),
                  contentSelectors = this.contentSelectors,
                  i,
                  ii;
              for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
                contentSelectors[i].removeAt(index, view.fragment);
              }
              this.children.splice(index, 1);
              if (this.isAttached) {
                view.detached();
              }
            },
            writable: true,
            configurable: true
          },
          contentSelectorRemoveAt: {
            value: function contentSelectorRemoveAt(index) {
              var view = this.children[index],
                  contentSelectors = this.contentSelectors,
                  i,
                  ii;
              for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
                contentSelectors[i].removeAt(index, view.fragment);
              }
              this.children.splice(index, 1);
              if (this.isAttached) {
                view.detached();
              }
              return view;
            },
            writable: true,
            configurable: true
          },
          contentSelectorRemoveAll: {
            value: function contentSelectorRemoveAll() {
              var children = this.children,
                  contentSelectors = this.contentSelectors,
                  ii = children.length,
                  jj = contentSelectors.length,
                  i,
                  j,
                  view;
              for (i = 0; i < ii; ++i) {
                view = children[i];
                for (j = 0; j < jj; ++j) {
                  contentSelectors[j].removeAt(i, view.fragment);
                }
              }
              if (this.isAttached) {
                for (i = 0; i < ii; ++i) {
                  children[i].detached();
                }
              }
              this.children = [];
            },
            writable: true,
            configurable: true
          }
        });
        return ViewSlot;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/module-analyzer", ["github:aurelia/metadata@0.3.4", "github:aurelia/loader@0.4.0", "github:aurelia/binding@0.4.0", "github:aurelia/templating@0.9.0/custom-element", "github:aurelia/templating@0.9.0/attached-behavior", "github:aurelia/templating@0.9.0/template-controller", "github:aurelia/templating@0.9.0/view-strategy", "github:aurelia/templating@0.9.0/util"], function(_export) {
  var Metadata,
      ResourceType,
      TemplateRegistryEntry,
      ValueConverter,
      CustomElement,
      AttachedBehavior,
      TemplateController,
      ViewStrategy,
      TemplateRegistryViewStrategy,
      hyphenate,
      _prototypeProperties,
      _classCallCheck,
      ResourceModule,
      ResourceDescription,
      ModuleAnalyzer;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
      ResourceType = _aureliaMetadata.ResourceType;
    }, function(_aureliaLoader) {
      TemplateRegistryEntry = _aureliaLoader.TemplateRegistryEntry;
    }, function(_aureliaBinding) {
      ValueConverter = _aureliaBinding.ValueConverter;
    }, function(_customElement) {
      CustomElement = _customElement.CustomElement;
    }, function(_attachedBehavior) {
      AttachedBehavior = _attachedBehavior.AttachedBehavior;
    }, function(_templateController) {
      TemplateController = _templateController.TemplateController;
    }, function(_viewStrategy) {
      ViewStrategy = _viewStrategy.ViewStrategy;
      TemplateRegistryViewStrategy = _viewStrategy.TemplateRegistryViewStrategy;
    }, function(_util) {
      hyphenate = _util.hyphenate;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ResourceModule = (function() {
        function ResourceModule(moduleId) {
          _classCallCheck(this, ResourceModule);
          this.id = moduleId;
          this.moduleInstance = null;
          this.mainResource = null;
          this.resources = null;
          this.viewStrategy = null;
          this.isAnalyzed = false;
        }
        _prototypeProperties(ResourceModule, null, {
          analyze: {
            value: function analyze(container) {
              var current = this.mainResource,
                  resources = this.resources,
                  viewStrategy = this.viewStrategy,
                  i,
                  ii,
                  metadata;
              if (this.isAnalyzed) {
                return ;
              }
              this.isAnalyzed = true;
              if (current) {
                metadata = current.metadata;
                metadata.viewStrategy = viewStrategy;
                if ("analyze" in metadata && !metadata.isAnalyzed) {
                  metadata.isAnalyzed = true;
                  metadata.analyze(container, current.value);
                }
              }
              for (i = 0, ii = resources.length; i < ii; ++i) {
                current = resources[i];
                metadata = current.metadata;
                metadata.viewStrategy = viewStrategy;
                if ("analyze" in metadata && !metadata.isAnalyzed) {
                  metadata.isAnalyzed = true;
                  metadata.analyze(container, current.value);
                }
              }
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              var i,
                  ii,
                  resources = this.resources;
              if (this.mainResource) {
                this.mainResource.metadata.register(registry, name);
                name = null;
              }
              for (i = 0, ii = resources.length; i < ii; ++i) {
                resources[i].metadata.register(registry, name);
                name = null;
              }
            },
            writable: true,
            configurable: true
          },
          load: {
            value: function load(container) {
              var current = this.mainResource,
                  resources = this.resources,
                  i,
                  ii,
                  metadata,
                  loads;
              if (this.isLoaded) {
                return Promise.resolve();
              }
              this.isLoaded = true;
              loads = [];
              if (current) {
                metadata = current.metadata;
                if ("load" in metadata && !metadata.isLoaded) {
                  metadata.isLoaded = true;
                  loads.push(metadata.load(container, current.value));
                }
              }
              for (i = 0, ii = resources.length; i < ii; ++i) {
                current = resources[i];
                metadata = current.metadata;
                if ("load" in metadata && !metadata.isLoaded) {
                  metadata.isLoaded = true;
                  loads.push(metadata.load(container, current.value));
                }
              }
              return Promise.all(loads);
            },
            writable: true,
            configurable: true
          }
        });
        return ResourceModule;
      })();
      ResourceDescription = function ResourceDescription(key, exportedValue, allMetadata, resourceTypeMeta) {
        _classCallCheck(this, ResourceDescription);
        if (!resourceTypeMeta) {
          if (!allMetadata) {
            allMetadata = Metadata.on(exportedValue);
          }
          resourceTypeMeta = allMetadata.first(ResourceType);
          if (!resourceTypeMeta) {
            resourceTypeMeta = new CustomElement(hyphenate(key));
            allMetadata.add(resourceTypeMeta);
          }
        }
        if (!resourceTypeMeta.name) {
          resourceTypeMeta.name = hyphenate(key);
        }
        this.metadata = resourceTypeMeta;
        this.value = exportedValue;
      };
      ModuleAnalyzer = _export("ModuleAnalyzer", (function() {
        function ModuleAnalyzer() {
          _classCallCheck(this, ModuleAnalyzer);
          this.cache = {};
        }
        _prototypeProperties(ModuleAnalyzer, null, {
          getAnalysis: {
            value: function getAnalysis(moduleId) {
              return this.cache[moduleId];
            },
            writable: true,
            configurable: true
          },
          analyze: {
            value: function analyze(moduleId, moduleInstance, viewModelMember) {
              var mainResource,
                  fallbackValue,
                  fallbackKey,
                  fallbackMetadata,
                  resourceTypeMeta,
                  key,
                  allMetadata,
                  exportedValue,
                  resources = [],
                  conventional,
                  viewStrategy,
                  resourceModule;
              resourceModule = this.cache[moduleId];
              if (resourceModule) {
                return resourceModule;
              }
              resourceModule = new ResourceModule(moduleId);
              this.cache[moduleId] = resourceModule;
              if (typeof moduleInstance === "function") {
                moduleInstance = {"default": moduleInstance};
              }
              if (viewModelMember) {
                mainResource = new ResourceDescription(viewModelMember, moduleInstance[viewModelMember]);
              }
              for (key in moduleInstance) {
                exportedValue = moduleInstance[key];
                if (key === viewModelMember || typeof exportedValue !== "function") {
                  continue;
                }
                allMetadata = Metadata.on(exportedValue);
                resourceTypeMeta = allMetadata.first(ResourceType);
                if (resourceTypeMeta) {
                  if (!mainResource && resourceTypeMeta instanceof CustomElement) {
                    mainResource = new ResourceDescription(key, exportedValue, allMetadata, resourceTypeMeta);
                  } else {
                    resources.push(new ResourceDescription(key, exportedValue, allMetadata, resourceTypeMeta));
                  }
                } else if (exportedValue instanceof ViewStrategy) {
                  viewStrategy = exportedValue;
                } else if (exportedValue instanceof TemplateRegistryEntry) {
                  viewStrategy = new TemplateRegistryViewStrategy(moduleId, exportedValue);
                } else {
                  if (conventional = CustomElement.convention(key)) {
                    if (!mainResource) {
                      mainResource = new ResourceDescription(key, exportedValue, allMetadata, conventional);
                    } else {
                      resources.push(new ResourceDescription(key, exportedValue, allMetadata, conventional));
                    }
                    allMetadata.add(conventional);
                  } else if (conventional = AttachedBehavior.convention(key)) {
                    resources.push(new ResourceDescription(key, exportedValue, allMetadata, conventional));
                    allMetadata.add(conventional);
                  } else if (conventional = TemplateController.convention(key)) {
                    resources.push(new ResourceDescription(key, exportedValue, allMetadata, conventional));
                    allMetadata.add(conventional);
                  } else if (conventional = ValueConverter.convention(key)) {
                    resources.push(new ResourceDescription(key, exportedValue, allMetadata, conventional));
                    allMetadata.add(conventional);
                  } else if (!fallbackValue) {
                    fallbackValue = exportedValue;
                    fallbackKey = key;
                    fallbackMetadata = allMetadata;
                  }
                }
              }
              if (!mainResource && fallbackValue) {
                mainResource = new ResourceDescription(fallbackKey, fallbackValue, fallbackMetadata);
              }
              resourceModule.moduleInstance = moduleInstance;
              resourceModule.mainResource = mainResource;
              resourceModule.resources = resources;
              resourceModule.viewStrategy = viewStrategy;
              return resourceModule;
            },
            writable: true,
            configurable: true
          }
        });
        return ModuleAnalyzer;
      })());
    }
  };
});

System.register("github:aurelia/logging-console@0.2.4", ["github:aurelia/logging-console@0.2.4/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/loader@0.4.0/template-registry-entry", ["github:aurelia/path@0.4.6"], function(_export) {
  var relativeToFile,
      _prototypeProperties,
      _classCallCheck,
      TemplateDependency,
      TemplateRegistryEntry;
  return {
    setters: [function(_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      TemplateDependency = _export("TemplateDependency", function TemplateDependency(src, name) {
        _classCallCheck(this, TemplateDependency);
        this.src = src;
        this.name = name;
      });
      TemplateRegistryEntry = _export("TemplateRegistryEntry", (function() {
        function TemplateRegistryEntry(id) {
          _classCallCheck(this, TemplateRegistryEntry);
          this.id = id;
          this.template = null;
          this.dependencies = null;
          this.resources = null;
          this.factory = null;
        }
        _prototypeProperties(TemplateRegistryEntry, null, {
          templateIsLoaded: {
            get: function() {
              return this.template !== null;
            },
            configurable: true
          },
          isReady: {
            get: function() {
              return this.factory !== null;
            },
            configurable: true
          },
          setTemplate: {
            value: function setTemplate(template) {
              var id = this.id,
                  useResources,
                  i,
                  ii,
                  current,
                  src;
              this.template = template;
              useResources = template.content.querySelectorAll("require");
              this.dependencies = new Array(useResources.length);
              if (useResources.length === 0) {
                return ;
              }
              for (i = 0, ii = useResources.length; i < ii; ++i) {
                current = useResources[i];
                src = current.getAttribute("from");
                if (!src) {
                  throw new Error("<require> element in " + this.id + " has no \"from\" attribute.");
                }
                this.dependencies[i] = new TemplateDependency(relativeToFile(src, id), current.getAttribute("as"));
                if (current.parentNode) {
                  current.parentNode.removeChild(current);
                }
              }
            },
            writable: true,
            configurable: true
          },
          setResources: {
            value: function setResources(resources) {
              this.resources = resources;
            },
            writable: true,
            configurable: true
          },
          setFactory: {
            value: function setFactory(factory) {
              this.factory = factory;
            },
            writable: true,
            configurable: true
          }
        });
        return TemplateRegistryEntry;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.4.0/observer-locator", ["github:aurelia/task-queue@0.2.5", "github:aurelia/binding@0.4.0/array-observation", "github:aurelia/binding@0.4.0/map-observation", "github:aurelia/binding@0.4.0/event-manager", "github:aurelia/binding@0.4.0/dirty-checking", "github:aurelia/binding@0.4.0/property-observation", "github:aurelia/dependency-injection@0.5.0", "github:aurelia/binding@0.4.0/computed-observation"], function(_export) {
  var TaskQueue,
      getArrayObserver,
      getMapObserver,
      EventManager,
      DirtyChecker,
      DirtyCheckProperty,
      SetterObserver,
      OoObjectObserver,
      OoPropertyObserver,
      ElementObserver,
      SelectValueObserver,
      All,
      hasDeclaredDependencies,
      ComputedPropertyObserver,
      _prototypeProperties,
      _classCallCheck,
      hasObjectObserve,
      ObserverLocator,
      ObjectObservationAdapter;
  function createObserversLookup(obj) {
    var value = {};
    try {
      Object.defineProperty(obj, "__observers__", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      });
    } catch (_) {}
    return value;
  }
  function createObserverLookup(obj, observerLocator) {
    var value = new OoObjectObserver(obj, observerLocator);
    try {
      Object.defineProperty(obj, "__observer__", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      });
    } catch (_) {}
    return value;
  }
  return {
    setters: [function(_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }, function(_arrayObservation) {
      getArrayObserver = _arrayObservation.getArrayObserver;
    }, function(_mapObservation) {
      getMapObserver = _mapObservation.getMapObserver;
    }, function(_eventManager) {
      EventManager = _eventManager.EventManager;
    }, function(_dirtyChecking) {
      DirtyChecker = _dirtyChecking.DirtyChecker;
      DirtyCheckProperty = _dirtyChecking.DirtyCheckProperty;
    }, function(_propertyObservation) {
      SetterObserver = _propertyObservation.SetterObserver;
      OoObjectObserver = _propertyObservation.OoObjectObserver;
      OoPropertyObserver = _propertyObservation.OoPropertyObserver;
      ElementObserver = _propertyObservation.ElementObserver;
      SelectValueObserver = _propertyObservation.SelectValueObserver;
    }, function(_aureliaDependencyInjection) {
      All = _aureliaDependencyInjection.All;
    }, function(_computedObservation) {
      hasDeclaredDependencies = _computedObservation.hasDeclaredDependencies;
      ComputedPropertyObserver = _computedObservation.ComputedPropertyObserver;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      if (typeof Object.getPropertyDescriptor !== "function") {
        Object.getPropertyDescriptor = function(subject, name) {
          var pd = Object.getOwnPropertyDescriptor(subject, name);
          var proto = Object.getPrototypeOf(subject);
          while (typeof pd === "undefined" && proto !== null) {
            pd = Object.getOwnPropertyDescriptor(proto, name);
            proto = Object.getPrototypeOf(proto);
          }
          return pd;
        };
      }
      hasObjectObserve = (function detectObjectObserve() {
        if (typeof Object.observe !== "function") {
          return false;
        }
        var records = [];
        function callback(recs) {
          records = recs;
        }
        var test = {};
        Object.observe(test, callback);
        test.id = 1;
        test.id = 2;
        delete test.id;
        Object.deliverChangeRecords(callback);
        if (records.length !== 3) {
          return false;
        }
        if (records[0].type != "add" || records[1].type != "update" || records[2].type != "delete") {
          return false;
        }
        Object.unobserve(test, callback);
        return true;
      })();
      ObserverLocator = _export("ObserverLocator", (function() {
        function ObserverLocator(taskQueue, eventManager, dirtyChecker, observationAdapters) {
          _classCallCheck(this, ObserverLocator);
          this.taskQueue = taskQueue;
          this.eventManager = eventManager;
          this.dirtyChecker = dirtyChecker;
          this.observationAdapters = observationAdapters;
        }
        _prototypeProperties(ObserverLocator, {inject: {
            value: function inject() {
              return [TaskQueue, EventManager, DirtyChecker, All.of(ObjectObservationAdapter)];
            },
            writable: true,
            configurable: true
          }}, {
          getObserversLookup: {
            value: function getObserversLookup(obj) {
              return obj.__observers__ || createObserversLookup(obj);
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(obj, propertyName) {
              var observersLookup = this.getObserversLookup(obj);
              if (propertyName in observersLookup) {
                return observersLookup[propertyName];
              }
              return observersLookup[propertyName] = this.createPropertyObserver(obj, propertyName);
            },
            writable: true,
            configurable: true
          },
          getObservationAdapter: {
            value: function getObservationAdapter(obj, propertyName, descriptor) {
              var i,
                  ii,
                  observationAdapter;
              for (i = 0, ii = this.observationAdapters.length; i < ii; i++) {
                observationAdapter = this.observationAdapters[i];
                if (observationAdapter.handlesProperty(obj, propertyName, descriptor)) {
                  return observationAdapter;
                }
              }
              return null;
            },
            writable: true,
            configurable: true
          },
          createPropertyObserver: {
            value: function createPropertyObserver(obj, propertyName) {
              var observerLookup,
                  descriptor,
                  handler,
                  observationAdapter;
              if (obj instanceof Element) {
                handler = this.eventManager.getElementHandler(obj, propertyName);
                if (propertyName === "value" && obj.tagName.toLowerCase() === "select") {
                  return new SelectValueObserver(obj, handler, this);
                }
                return new ElementObserver(obj, propertyName, handler);
              }
              descriptor = Object.getPropertyDescriptor(obj, propertyName);
              if (hasDeclaredDependencies(descriptor)) {
                return new ComputedPropertyObserver(obj, propertyName, descriptor, this);
              }
              if (descriptor && (descriptor.get || descriptor.set)) {
                observationAdapter = this.getObservationAdapter(obj, propertyName, descriptor);
                if (observationAdapter) {
                  return observationAdapter.getObserver(obj, propertyName, descriptor);
                }
                return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
              }
              if (hasObjectObserve) {
                observerLookup = obj.__observer__ || createObserverLookup(obj, this);
                return observerLookup.getObserver(propertyName, descriptor);
              }
              if (obj instanceof Array) {
                observerLookup = this.getArrayObserver(obj);
                return observerLookup.getObserver(propertyName);
              } else if (obj instanceof Map) {
                observerLookup = this.getMapObserver(obj);
                return observerLookup.getObserver(propertyName);
              }
              return new SetterObserver(this.taskQueue, obj, propertyName);
            },
            writable: true,
            configurable: true
          },
          getArrayObserver: {
            value: (function(_getArrayObserver) {
              var _getArrayObserverWrapper = function getArrayObserver(_x) {
                return _getArrayObserver.apply(this, arguments);
              };
              _getArrayObserverWrapper.toString = function() {
                return _getArrayObserver.toString();
              };
              return _getArrayObserverWrapper;
            })(function(array) {
              if ("__array_observer__" in array) {
                return array.__array_observer__;
              }
              return array.__array_observer__ = getArrayObserver(this.taskQueue, array);
            }),
            writable: true,
            configurable: true
          },
          getMapObserver: {
            value: (function(_getMapObserver) {
              var _getMapObserverWrapper = function getMapObserver(_x2) {
                return _getMapObserver.apply(this, arguments);
              };
              _getMapObserverWrapper.toString = function() {
                return _getMapObserver.toString();
              };
              return _getMapObserverWrapper;
            })(function(map) {
              if ("__map_observer__" in map) {
                return map.__map_observer__;
              }
              return map.__map_observer__ = getMapObserver(this.taskQueue, map);
            }),
            writable: true,
            configurable: true
          }
        });
        return ObserverLocator;
      })());
      ObjectObservationAdapter = _export("ObjectObservationAdapter", (function() {
        function ObjectObservationAdapter() {
          _classCallCheck(this, ObjectObservationAdapter);
        }
        _prototypeProperties(ObjectObservationAdapter, null, {
          handlesProperty: {
            value: function handlesProperty(object, propertyName, descriptor) {
              throw new Error("BindingAdapters must implement handlesProperty(object, propertyName).");
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(object, propertyName, descriptor) {
              throw new Error("BindingAdapters must implement createObserver(object, propertyName).");
            },
            writable: true,
            configurable: true
          }
        });
        return ObjectObservationAdapter;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.4.0/parser", ["github:aurelia/binding@0.4.0/lexer", "github:aurelia/binding@0.4.0/ast"], function(_export) {
  var Lexer,
      Token,
      Expression,
      ArrayOfExpression,
      Chain,
      ValueConverter,
      Assign,
      Conditional,
      AccessScope,
      AccessMember,
      AccessKeyed,
      CallScope,
      CallFunction,
      CallMember,
      PrefixNot,
      Binary,
      LiteralPrimitive,
      LiteralArray,
      LiteralObject,
      LiteralString,
      _prototypeProperties,
      _classCallCheck,
      EOF,
      Parser,
      ParserImplementation;
  return {
    setters: [function(_lexer) {
      Lexer = _lexer.Lexer;
      Token = _lexer.Token;
    }, function(_ast) {
      Expression = _ast.Expression;
      ArrayOfExpression = _ast.ArrayOfExpression;
      Chain = _ast.Chain;
      ValueConverter = _ast.ValueConverter;
      Assign = _ast.Assign;
      Conditional = _ast.Conditional;
      AccessScope = _ast.AccessScope;
      AccessMember = _ast.AccessMember;
      AccessKeyed = _ast.AccessKeyed;
      CallScope = _ast.CallScope;
      CallFunction = _ast.CallFunction;
      CallMember = _ast.CallMember;
      PrefixNot = _ast.PrefixNot;
      Binary = _ast.Binary;
      LiteralPrimitive = _ast.LiteralPrimitive;
      LiteralArray = _ast.LiteralArray;
      LiteralObject = _ast.LiteralObject;
      LiteralString = _ast.LiteralString;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      EOF = new Token(-1, null);
      Parser = _export("Parser", (function() {
        function Parser() {
          _classCallCheck(this, Parser);
          this.cache = {};
          this.lexer = new Lexer();
        }
        _prototypeProperties(Parser, null, {parse: {
            value: function parse(input) {
              input = input || "";
              return this.cache[input] || (this.cache[input] = new ParserImplementation(this.lexer, input).parseChain());
            },
            writable: true,
            configurable: true
          }});
        return Parser;
      })());
      ParserImplementation = _export("ParserImplementation", (function() {
        function ParserImplementation(lexer, input) {
          _classCallCheck(this, ParserImplementation);
          this.index = 0;
          this.input = input;
          this.tokens = lexer.lex(input);
        }
        _prototypeProperties(ParserImplementation, null, {
          peek: {
            get: function() {
              return this.index < this.tokens.length ? this.tokens[this.index] : EOF;
            },
            configurable: true
          },
          parseChain: {
            value: function parseChain() {
              var isChain = false,
                  expressions = [];
              while (this.optional(";")) {
                isChain = true;
              }
              while (this.index < this.tokens.length) {
                if (this.peek.text === ")" || this.peek.text === "}" || this.peek.text === "]") {
                  this.error("Unconsumed token " + this.peek.text);
                }
                var expr = this.parseValueConverter();
                expressions.push(expr);
                while (this.optional(";")) {
                  isChain = true;
                }
                if (isChain && expr instanceof ValueConverter) {
                  this.error("cannot have a value converter in a chain");
                }
              }
              return expressions.length === 1 ? expressions[0] : new Chain(expressions);
            },
            writable: true,
            configurable: true
          },
          parseValueConverter: {
            value: function parseValueConverter() {
              var result = this.parseExpression();
              while (this.optional("|")) {
                var name = this.peek.text,
                    args = [];
                this.advance();
                while (this.optional(":")) {
                  args.push(this.parseExpression());
                }
                result = new ValueConverter(result, name, args, [result].concat(args));
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseExpression: {
            value: function parseExpression() {
              var start = this.peek.index,
                  result = this.parseConditional();
              while (this.peek.text === "=") {
                if (!result.isAssignable) {
                  var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
                  var expression = this.input.substring(start, end);
                  this.error("Expression " + expression + " is not assignable");
                }
                this.expect("=");
                result = new Assign(result, this.parseConditional());
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseConditional: {
            value: function parseConditional() {
              var start = this.peek.index,
                  result = this.parseLogicalOr();
              if (this.optional("?")) {
                var yes = this.parseExpression();
                if (!this.optional(":")) {
                  var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
                  var expression = this.input.substring(start, end);
                  this.error("Conditional expression " + expression + " requires all 3 expressions");
                }
                var no = this.parseExpression();
                result = new Conditional(result, yes, no);
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseLogicalOr: {
            value: function parseLogicalOr() {
              var result = this.parseLogicalAnd();
              while (this.optional("||")) {
                result = new Binary("||", result, this.parseLogicalAnd());
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseLogicalAnd: {
            value: function parseLogicalAnd() {
              var result = this.parseEquality();
              while (this.optional("&&")) {
                result = new Binary("&&", result, this.parseEquality());
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseEquality: {
            value: function parseEquality() {
              var result = this.parseRelational();
              while (true) {
                if (this.optional("==")) {
                  result = new Binary("==", result, this.parseRelational());
                } else if (this.optional("!=")) {
                  result = new Binary("!=", result, this.parseRelational());
                } else if (this.optional("===")) {
                  result = new Binary("===", result, this.parseRelational());
                } else if (this.optional("!==")) {
                  result = new Binary("!==", result, this.parseRelational());
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parseRelational: {
            value: function parseRelational() {
              var result = this.parseAdditive();
              while (true) {
                if (this.optional("<")) {
                  result = new Binary("<", result, this.parseAdditive());
                } else if (this.optional(">")) {
                  result = new Binary(">", result, this.parseAdditive());
                } else if (this.optional("<=")) {
                  result = new Binary("<=", result, this.parseAdditive());
                } else if (this.optional(">=")) {
                  result = new Binary(">=", result, this.parseAdditive());
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parseAdditive: {
            value: function parseAdditive() {
              var result = this.parseMultiplicative();
              while (true) {
                if (this.optional("+")) {
                  result = new Binary("+", result, this.parseMultiplicative());
                } else if (this.optional("-")) {
                  result = new Binary("-", result, this.parseMultiplicative());
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parseMultiplicative: {
            value: function parseMultiplicative() {
              var result = this.parsePrefix();
              while (true) {
                if (this.optional("*")) {
                  result = new Binary("*", result, this.parsePrefix());
                } else if (this.optional("%")) {
                  result = new Binary("%", result, this.parsePrefix());
                } else if (this.optional("/")) {
                  result = new Binary("/", result, this.parsePrefix());
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parsePrefix: {
            value: function parsePrefix() {
              if (this.optional("+")) {
                return this.parsePrefix();
              } else if (this.optional("-")) {
                return new Binary("-", new LiteralPrimitive(0), this.parsePrefix());
              } else if (this.optional("!")) {
                return new PrefixNot("!", this.parsePrefix());
              } else {
                return this.parseAccessOrCallMember();
              }
            },
            writable: true,
            configurable: true
          },
          parseAccessOrCallMember: {
            value: function parseAccessOrCallMember() {
              var result = this.parsePrimary();
              while (true) {
                if (this.optional(".")) {
                  var name = this.peek.text;
                  this.advance();
                  if (this.optional("(")) {
                    var args = this.parseExpressionList(")");
                    this.expect(")");
                    result = new CallMember(result, name, args);
                  } else {
                    result = new AccessMember(result, name);
                  }
                } else if (this.optional("[")) {
                  var key = this.parseExpression();
                  this.expect("]");
                  result = new AccessKeyed(result, key);
                } else if (this.optional("(")) {
                  var args = this.parseExpressionList(")");
                  this.expect(")");
                  result = new CallFunction(result, args);
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parsePrimary: {
            value: function parsePrimary() {
              if (this.optional("(")) {
                var result = this.parseExpression();
                this.expect(")");
                return result;
              } else if (this.optional("null") || this.optional("undefined")) {
                return new LiteralPrimitive(null);
              } else if (this.optional("true")) {
                return new LiteralPrimitive(true);
              } else if (this.optional("false")) {
                return new LiteralPrimitive(false);
              } else if (this.optional("[")) {
                var elements = this.parseExpressionList("]");
                this.expect("]");
                return new LiteralArray(elements);
              } else if (this.peek.text == "{") {
                return this.parseObject();
              } else if (this.peek.key != null) {
                return this.parseAccessOrCallScope();
              } else if (this.peek.value != null) {
                var value = this.peek.value;
                this.advance();
                return isNaN(value) ? new LiteralString(value) : new LiteralPrimitive(value);
              } else if (this.index >= this.tokens.length) {
                throw new Error("Unexpected end of expression: " + this.input);
              } else {
                this.error("Unexpected token " + this.peek.text);
              }
            },
            writable: true,
            configurable: true
          },
          parseAccessOrCallScope: {
            value: function parseAccessOrCallScope() {
              var name = this.peek.key;
              this.advance();
              if (!this.optional("(")) {
                return new AccessScope(name);
              }
              var args = this.parseExpressionList(")");
              this.expect(")");
              return new CallScope(name, args);
            },
            writable: true,
            configurable: true
          },
          parseObject: {
            value: function parseObject() {
              var keys = [],
                  values = [];
              this.expect("{");
              if (this.peek.text !== "}") {
                do {
                  var value = this.peek.value;
                  keys.push(typeof value === "string" ? value : this.peek.text);
                  this.advance();
                  this.expect(":");
                  values.push(this.parseExpression());
                } while (this.optional(","));
              }
              this.expect("}");
              return new LiteralObject(keys, values);
            },
            writable: true,
            configurable: true
          },
          parseExpressionList: {
            value: function parseExpressionList(terminator) {
              var result = [];
              if (this.peek.text != terminator) {
                do {
                  result.push(this.parseExpression());
                } while (this.optional(","));
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          optional: {
            value: function optional(text) {
              if (this.peek.text === text) {
                this.advance();
                return true;
              }
              return false;
            },
            writable: true,
            configurable: true
          },
          expect: {
            value: function expect(text) {
              if (this.peek.text === text) {
                this.advance();
              } else {
                this.error("Missing expected " + text);
              }
            },
            writable: true,
            configurable: true
          },
          advance: {
            value: function advance() {
              this.index++;
            },
            writable: true,
            configurable: true
          },
          error: {
            value: function error(message) {
              var location = this.index < this.tokens.length ? "at column " + (this.tokens[this.index].index + 1) + " in" : "at the end of the expression";
              throw new Error("Parser Error: " + message + " " + location + " [" + this.input + "]");
            },
            writable: true,
            configurable: true
          }
        });
        return ParserImplementation;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/attached-behavior", ["github:aurelia/metadata@0.3.4", "github:aurelia/templating@0.9.0/behavior-instance", "github:aurelia/templating@0.9.0/behaviors", "github:aurelia/templating@0.9.0/util"], function(_export) {
  var ResourceType,
      BehaviorInstance,
      configureBehavior,
      hyphenate,
      _prototypeProperties,
      _inherits,
      _classCallCheck,
      AttachedBehavior;
  return {
    setters: [function(_aureliaMetadata) {
      ResourceType = _aureliaMetadata.ResourceType;
    }, function(_behaviorInstance) {
      BehaviorInstance = _behaviorInstance.BehaviorInstance;
    }, function(_behaviors) {
      configureBehavior = _behaviors.configureBehavior;
    }, function(_util) {
      hyphenate = _util.hyphenate;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      AttachedBehavior = _export("AttachedBehavior", (function(ResourceType) {
        function AttachedBehavior(attribute) {
          _classCallCheck(this, AttachedBehavior);
          this.name = attribute;
          this.properties = [];
          this.attributes = {};
        }
        _inherits(AttachedBehavior, ResourceType);
        _prototypeProperties(AttachedBehavior, {convention: {
            value: function convention(name) {
              if (name.endsWith("AttachedBehavior")) {
                return new AttachedBehavior(hyphenate(name.substring(0, name.length - 16)));
              }
            },
            writable: true,
            configurable: true
          }}, {
          analyze: {
            value: function analyze(container, target) {
              configureBehavior(container, this, target);
            },
            writable: true,
            configurable: true
          },
          load: {
            value: function load(container, target) {
              return Promise.resolve(this);
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              registry.registerAttribute(name || this.name, this, this.name);
            },
            writable: true,
            configurable: true
          },
          compile: {
            value: function compile(compiler, resources, node, instruction) {
              instruction.suppressBind = true;
              return node;
            },
            writable: true,
            configurable: true
          },
          create: {
            value: function create(container, instruction, element, bindings) {
              var executionContext = instruction.executionContext || container.get(this.target),
                  behaviorInstance = new BehaviorInstance(this, executionContext, instruction);
              if (!(this.apiName in element)) {
                element[this.apiName] = behaviorInstance.executionContext;
              }
              if (this.childExpression) {
                bindings.push(this.childExpression.createBinding(element, behaviorInstance.executionContext));
              }
              return behaviorInstance;
            },
            writable: true,
            configurable: true
          }
        });
        return AttachedBehavior;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/templating@0.9.0/view-factory", ["github:aurelia/dependency-injection@0.5.0", "github:aurelia/templating@0.9.0/view", "github:aurelia/templating@0.9.0/view-slot", "github:aurelia/templating@0.9.0/content-selector", "github:aurelia/templating@0.9.0/resource-registry"], function(_export) {
  var Container,
      View,
      ViewSlot,
      ContentSelector,
      ViewResources,
      _prototypeProperties,
      _classCallCheck,
      BoundViewFactory,
      defaultFactoryOptions,
      ViewFactory;
  function elementContainerGet(key) {
    if (key === Element) {
      return this.element;
    }
    if (key === BoundViewFactory) {
      return this.boundViewFactory || (this.boundViewFactory = new BoundViewFactory(this, this.instruction.viewFactory, this.executionContext));
    }
    if (key === ViewSlot) {
      if (this.viewSlot === undefined) {
        this.viewSlot = new ViewSlot(this.element, this.instruction.anchorIsContainer, this.executionContext);
        this.children.push(this.viewSlot);
      }
      return this.viewSlot;
    }
    if (key === ViewResources) {
      return this.viewResources;
    }
    return this.superGet(key);
  }
  function createElementContainer(parent, element, instruction, executionContext, children, resources) {
    var container = parent.createChild(),
        providers,
        i;
    container.element = element;
    container.instruction = instruction;
    container.executionContext = executionContext;
    container.children = children;
    container.viewResources = resources;
    providers = instruction.providers;
    i = providers.length;
    while (i--) {
      container.registerSingleton(providers[i]);
    }
    container.superGet = container.get;
    container.get = elementContainerGet;
    return container;
  }
  function applyInstructions(containers, executionContext, element, instruction, behaviors, bindings, children, contentSelectors, resources) {
    var behaviorInstructions = instruction.behaviorInstructions,
        expressions = instruction.expressions,
        elementContainer,
        i,
        ii,
        current,
        instance;
    if (instruction.contentExpression) {
      bindings.push(instruction.contentExpression.createBinding(element.nextSibling));
      element.parentNode.removeChild(element);
      return ;
    }
    if (instruction.contentSelector) {
      contentSelectors.push(new ContentSelector(element, instruction.selector));
      return ;
    }
    if (behaviorInstructions.length) {
      containers[instruction.injectorId] = elementContainer = createElementContainer(containers[instruction.parentInjectorId], element, instruction, executionContext, children, resources);
      for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
        current = behaviorInstructions[i];
        instance = current.type.create(elementContainer, current, element, bindings);
        if (instance.contentView) {
          children.push(instance.contentView);
        }
        behaviors.push(instance);
      }
    }
    for (i = 0, ii = expressions.length; i < ii; ++i) {
      bindings.push(expressions[i].createBinding(element));
    }
  }
  return {
    setters: [function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_view) {
      View = _view.View;
    }, function(_viewSlot) {
      ViewSlot = _viewSlot.ViewSlot;
    }, function(_contentSelector) {
      ContentSelector = _contentSelector.ContentSelector;
    }, function(_resourceRegistry) {
      ViewResources = _resourceRegistry.ViewResources;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      BoundViewFactory = _export("BoundViewFactory", (function() {
        function BoundViewFactory(parentContainer, viewFactory, executionContext) {
          _classCallCheck(this, BoundViewFactory);
          this.parentContainer = parentContainer;
          this.viewFactory = viewFactory;
          this.executionContext = executionContext;
          this.factoryOptions = {behaviorInstance: false};
        }
        _prototypeProperties(BoundViewFactory, null, {create: {
            value: function create(executionContext) {
              var childContainer = this.parentContainer.createChild(),
                  context = executionContext || this.executionContext;
              this.factoryOptions.systemControlled = !executionContext;
              return this.viewFactory.create(childContainer, context, this.factoryOptions);
            },
            writable: true,
            configurable: true
          }});
        return BoundViewFactory;
      })());
      defaultFactoryOptions = {
        systemControlled: false,
        suppressBind: false
      };
      ViewFactory = _export("ViewFactory", (function() {
        function ViewFactory(template, instructions, resources) {
          _classCallCheck(this, ViewFactory);
          this.template = template;
          this.instructions = instructions;
          this.resources = resources;
        }
        _prototypeProperties(ViewFactory, null, {create: {
            value: function create(container, executionContext) {
              var options = arguments[2] === undefined ? defaultFactoryOptions : arguments[2];
              var fragment = this.template.cloneNode(true),
                  instructables = fragment.querySelectorAll(".au-target"),
                  instructions = this.instructions,
                  resources = this.resources,
                  behaviors = [],
                  bindings = [],
                  children = [],
                  contentSelectors = [],
                  containers = {root: container},
                  i,
                  ii,
                  view;
              for (i = 0, ii = instructables.length; i < ii; ++i) {
                applyInstructions(containers, executionContext, instructables[i], instructions[i], behaviors, bindings, children, contentSelectors, resources);
              }
              view = new View(fragment, behaviors, bindings, children, options.systemControlled, contentSelectors);
              view.created(executionContext);
              if (!options.suppressBind) {
                view.bind(executionContext);
              }
              return view;
            },
            writable: true,
            configurable: true
          }});
        return ViewFactory;
      })());
    }
  };
});

System.register("github:aurelia/loader@0.4.0/index", ["github:aurelia/loader@0.4.0/template-registry-entry", "github:aurelia/loader@0.4.0/loader"], function(_export) {
  return {
    setters: [function(_templateRegistryEntry) {
      _export("TemplateRegistryEntry", _templateRegistryEntry.TemplateRegistryEntry);
      _export("TemplateDependency", _templateRegistryEntry.TemplateDependency);
    }, function(_loader) {
      _export("Loader", _loader.Loader);
    }],
    execute: function() {
      "use strict";
    }
  };
});

System.register("github:aurelia/binding@0.4.0/index", ["github:aurelia/metadata@0.3.4", "github:aurelia/binding@0.4.0/value-converter", "github:aurelia/binding@0.4.0/event-manager", "github:aurelia/binding@0.4.0/observer-locator", "github:aurelia/binding@0.4.0/array-change-records", "github:aurelia/binding@0.4.0/binding-modes", "github:aurelia/binding@0.4.0/parser", "github:aurelia/binding@0.4.0/binding-expression", "github:aurelia/binding@0.4.0/listener-expression", "github:aurelia/binding@0.4.0/name-expression", "github:aurelia/binding@0.4.0/call-expression", "github:aurelia/binding@0.4.0/dirty-checking", "github:aurelia/binding@0.4.0/map-change-records", "github:aurelia/binding@0.4.0/computed-observation"], function(_export) {
  var Metadata,
      ValueConverter;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_valueConverter) {
      ValueConverter = _valueConverter.ValueConverter;
      _export("ValueConverter", _valueConverter.ValueConverter);
    }, function(_eventManager) {
      _export("EventManager", _eventManager.EventManager);
    }, function(_observerLocator) {
      _export("ObserverLocator", _observerLocator.ObserverLocator);
      _export("ObjectObservationAdapter", _observerLocator.ObjectObservationAdapter);
    }, function(_arrayChangeRecords) {
      _export("calcSplices", _arrayChangeRecords.calcSplices);
    }, function(_bindingModes) {
      for (var _key in _bindingModes) {
        _export(_key, _bindingModes[_key]);
      }
    }, function(_parser) {
      _export("Parser", _parser.Parser);
    }, function(_bindingExpression) {
      _export("BindingExpression", _bindingExpression.BindingExpression);
    }, function(_listenerExpression) {
      _export("ListenerExpression", _listenerExpression.ListenerExpression);
    }, function(_nameExpression) {
      _export("NameExpression", _nameExpression.NameExpression);
    }, function(_callExpression) {
      _export("CallExpression", _callExpression.CallExpression);
    }, function(_dirtyChecking) {
      _export("DirtyChecker", _dirtyChecking.DirtyChecker);
    }, function(_mapChangeRecords) {
      _export("getChangeRecords", _mapChangeRecords.getChangeRecords);
    }, function(_computedObservation) {
      _export("ComputedObservationAdapter", _computedObservation.ComputedObservationAdapter);
      _export("declarePropertyDependencies", _computedObservation.declarePropertyDependencies);
    }],
    execute: function() {
      "use strict";
      Metadata.configure.classHelper("valueConverter", ValueConverter);
    }
  };
});

System.register("github:aurelia/templating@0.9.0/view-compiler", ["github:aurelia/templating@0.9.0/resource-registry", "github:aurelia/templating@0.9.0/view-factory", "github:aurelia/templating@0.9.0/binding-language"], function(_export) {
  var ResourceRegistry,
      ViewFactory,
      BindingLanguage,
      _prototypeProperties,
      _classCallCheck,
      nextInjectorId,
      defaultCompileOptions,
      hasShadowDOM,
      ViewCompiler;
  function getNextInjectorId() {
    return ++nextInjectorId;
  }
  function configureProperties(instruction, resources) {
    var type = instruction.type,
        attrName = instruction.attrName,
        attributes = instruction.attributes,
        property,
        key,
        value;
    var knownAttribute = resources.mapAttribute(attrName);
    if (knownAttribute && attrName in attributes && knownAttribute !== attrName) {
      attributes[knownAttribute] = attributes[attrName];
      delete attributes[attrName];
    }
    for (key in attributes) {
      value = attributes[key];
      if (typeof value !== "string") {
        property = type.attributes[key];
        if (property !== undefined) {
          value.targetProperty = property.name;
        } else {
          value.targetProperty = key;
        }
      }
    }
  }
  function makeIntoInstructionTarget(element) {
    var value = element.getAttribute("class");
    element.setAttribute("class", value ? value += " au-target" : "au-target");
  }
  return {
    setters: [function(_resourceRegistry) {
      ResourceRegistry = _resourceRegistry.ResourceRegistry;
    }, function(_viewFactory) {
      ViewFactory = _viewFactory.ViewFactory;
    }, function(_bindingLanguage) {
      BindingLanguage = _bindingLanguage.BindingLanguage;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      nextInjectorId = 0;
      defaultCompileOptions = {targetShadowDOM: false};
      hasShadowDOM = !!HTMLElement.prototype.createShadowRoot;
      ViewCompiler = _export("ViewCompiler", (function() {
        function ViewCompiler(bindingLanguage) {
          _classCallCheck(this, ViewCompiler);
          this.bindingLanguage = bindingLanguage;
        }
        _prototypeProperties(ViewCompiler, {inject: {
            value: function inject() {
              return [BindingLanguage];
            },
            writable: true,
            configurable: true
          }}, {
          compile: {
            value: function compile(templateOrFragment, resources) {
              var options = arguments[2] === undefined ? defaultCompileOptions : arguments[2];
              var instructions = [],
                  targetShadowDOM = options.targetShadowDOM,
                  content;
              targetShadowDOM = targetShadowDOM && hasShadowDOM;
              if (options.beforeCompile) {
                options.beforeCompile(templateOrFragment);
              }
              if (templateOrFragment.content) {
                content = document.adoptNode(templateOrFragment.content, true);
              } else {
                content = templateOrFragment;
              }
              this.compileNode(content, resources, instructions, templateOrFragment, "root", !targetShadowDOM);
              content.insertBefore(document.createComment("<view>"), content.firstChild);
              content.appendChild(document.createComment("</view>"));
              return new ViewFactory(content, instructions, resources);
            },
            writable: true,
            configurable: true
          },
          compileNode: {
            value: function compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
              switch (node.nodeType) {
                case 1:
                  return this.compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);
                case 3:
                  var expression = this.bindingLanguage.parseText(resources, node.textContent);
                  if (expression) {
                    var marker = document.createElement("au-marker");
                    marker.className = "au-target";
                    (node.parentNode || parentNode).insertBefore(marker, node);
                    node.textContent = " ";
                    instructions.push({contentExpression: expression});
                  }
                  return node.nextSibling;
                case 11:
                  var currentChild = node.firstChild;
                  while (currentChild) {
                    currentChild = this.compileNode(currentChild, resources, instructions, node, parentInjectorId, targetLightDOM);
                  }
                  break;
              }
              return node.nextSibling;
            },
            writable: true,
            configurable: true
          },
          compileElement: {
            value: function compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
              var tagName = node.tagName.toLowerCase(),
                  attributes = node.attributes,
                  expressions = [],
                  behaviorInstructions = [],
                  providers = [],
                  bindingLanguage = this.bindingLanguage,
                  liftingInstruction,
                  viewFactory,
                  type,
                  elementInstruction,
                  elementProperty,
                  i,
                  ii,
                  attr,
                  attrName,
                  attrValue,
                  instruction,
                  info,
                  property,
                  knownAttribute;
              if (tagName === "content") {
                if (targetLightDOM) {
                  instructions.push({
                    parentInjectorId: parentInjectorId,
                    contentSelector: true,
                    selector: node.getAttribute("select"),
                    suppressBind: true
                  });
                  makeIntoInstructionTarget(node);
                }
                return node.nextSibling;
              } else if (tagName === "template") {
                viewFactory = this.compile(node, resources);
              } else {
                type = resources.getElement(tagName);
                if (type) {
                  elementInstruction = {
                    type: type,
                    attributes: {}
                  };
                  behaviorInstructions.push(elementInstruction);
                }
              }
              for (i = 0, ii = attributes.length; i < ii; ++i) {
                attr = attributes[i];
                attrName = attr.name;
                attrValue = attr.value;
                info = bindingLanguage.inspectAttribute(resources, attrName, attrValue);
                type = resources.getAttribute(info.attrName);
                elementProperty = null;
                if (type) {
                  knownAttribute = resources.mapAttribute(info.attrName);
                  if (knownAttribute) {
                    property = type.attributes[knownAttribute];
                    if (property) {
                      info.defaultBindingMode = property.defaultBindingMode;
                      if (!info.command && !info.expression) {
                        info.command = property.hasOptions ? "options" : null;
                      }
                    }
                  }
                } else if (elementInstruction) {
                  elementProperty = elementInstruction.type.attributes[info.attrName];
                  if (elementProperty) {
                    info.defaultBindingMode = elementProperty.defaultBindingMode;
                    if (!info.command && !info.expression) {
                      info.command = elementProperty.hasOptions ? "options" : null;
                    }
                  }
                }
                if (elementProperty) {
                  instruction = bindingLanguage.createAttributeInstruction(resources, node, info, elementInstruction);
                } else {
                  instruction = bindingLanguage.createAttributeInstruction(resources, node, info);
                }
                if (instruction) {
                  if (instruction.alteredAttr) {
                    type = resources.getAttribute(instruction.attrName);
                  }
                  if (instruction.discrete) {
                    expressions.push(instruction);
                  } else {
                    if (type) {
                      instruction.type = type;
                      configureProperties(instruction, resources);
                      if (type.liftsContent) {
                        instruction.originalAttrName = attrName;
                        liftingInstruction = instruction;
                        break;
                      } else {
                        behaviorInstructions.push(instruction);
                      }
                    } else if (elementProperty) {
                      elementInstruction.attributes[info.attrName].targetProperty = elementProperty.name;
                    } else {
                      expressions.push(instruction.attributes[instruction.attrName]);
                    }
                  }
                } else {
                  if (type) {
                    instruction = {
                      attrName: attrName,
                      type: type,
                      attributes: {}
                    };
                    instruction.attributes[resources.mapAttribute(attrName)] = attrValue;
                    if (type.liftsContent) {
                      instruction.originalAttrName = attrName;
                      liftingInstruction = instruction;
                      break;
                    } else {
                      behaviorInstructions.push(instruction);
                    }
                  } else if (elementProperty) {
                    elementInstruction.attributes[attrName] = attrValue;
                  }
                }
              }
              if (liftingInstruction) {
                liftingInstruction.viewFactory = viewFactory;
                node = liftingInstruction.type.compile(this, resources, node, liftingInstruction, parentNode);
                makeIntoInstructionTarget(node);
                instructions.push({
                  anchorIsContainer: false,
                  parentInjectorId: parentInjectorId,
                  expressions: [],
                  behaviorInstructions: [liftingInstruction],
                  viewFactory: liftingInstruction.viewFactory,
                  providers: [liftingInstruction.type.target]
                });
              } else {
                for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
                  instruction = behaviorInstructions[i];
                  instruction.type.compile(this, resources, node, instruction, parentNode);
                  providers.push(instruction.type.target);
                }
                var injectorId = behaviorInstructions.length ? getNextInjectorId() : false;
                if (expressions.length || behaviorInstructions.length) {
                  makeIntoInstructionTarget(node);
                  instructions.push({
                    anchorIsContainer: true,
                    injectorId: injectorId,
                    parentInjectorId: parentInjectorId,
                    expressions: expressions,
                    behaviorInstructions: behaviorInstructions,
                    providers: providers
                  });
                }
                if (elementInstruction && elementInstruction.type.skipContentProcessing) {
                  return node.nextSibling;
                }
                var currentChild = node.firstChild;
                while (currentChild) {
                  currentChild = this.compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
                }
              }
              return node.nextSibling;
            },
            writable: true,
            configurable: true
          }
        });
        return ViewCompiler;
      })());
    }
  };
});

System.register("github:aurelia/loader@0.4.0", ["github:aurelia/loader@0.4.0/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/binding@0.4.0", ["github:aurelia/binding@0.4.0/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/templating@0.9.0/view-engine", ["github:aurelia/logging@0.2.6", "github:aurelia/metadata@0.3.4", "github:aurelia/loader@0.4.0", "github:aurelia/dependency-injection@0.5.0", "github:aurelia/templating@0.9.0/view-compiler", "github:aurelia/templating@0.9.0/resource-registry", "github:aurelia/templating@0.9.0/module-analyzer"], function(_export) {
  var LogManager,
      Origin,
      Loader,
      TemplateRegistryEntry,
      Container,
      ViewCompiler,
      ResourceRegistry,
      ViewResources,
      ModuleAnalyzer,
      _prototypeProperties,
      _classCallCheck,
      logger,
      ViewEngine;
  function ensureRegistryEntry(loader, urlOrRegistryEntry) {
    if (urlOrRegistryEntry instanceof TemplateRegistryEntry) {
      return Promise.resolve(urlOrRegistryEntry);
    }
    return loader.loadTemplate(urlOrRegistryEntry);
  }
  return {
    setters: [function(_aureliaLogging) {
      LogManager = _aureliaLogging;
    }, function(_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }, function(_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
      TemplateRegistryEntry = _aureliaLoader.TemplateRegistryEntry;
    }, function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_viewCompiler) {
      ViewCompiler = _viewCompiler.ViewCompiler;
    }, function(_resourceRegistry) {
      ResourceRegistry = _resourceRegistry.ResourceRegistry;
      ViewResources = _resourceRegistry.ViewResources;
    }, function(_moduleAnalyzer) {
      ModuleAnalyzer = _moduleAnalyzer.ModuleAnalyzer;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      logger = LogManager.getLogger("templating");
      ViewEngine = _export("ViewEngine", (function() {
        function ViewEngine(loader, container, viewCompiler, moduleAnalyzer, appResources) {
          _classCallCheck(this, ViewEngine);
          this.loader = loader;
          this.container = container;
          this.viewCompiler = viewCompiler;
          this.moduleAnalyzer = moduleAnalyzer;
          this.appResources = appResources;
        }
        _prototypeProperties(ViewEngine, {inject: {
            value: function inject() {
              return [Loader, Container, ViewCompiler, ModuleAnalyzer, ResourceRegistry];
            },
            writable: true,
            configurable: true
          }}, {
          loadViewFactory: {
            value: function loadViewFactory(urlOrRegistryEntry, compileOptions, associatedModuleId) {
              var _this = this;
              return ensureRegistryEntry(this.loader, urlOrRegistryEntry).then(function(viewRegistryEntry) {
                if (viewRegistryEntry.isReady) {
                  return viewRegistryEntry.factory;
                }
                return _this.loadTemplateResources(viewRegistryEntry, associatedModuleId).then(function(resources) {
                  if (viewRegistryEntry.isReady) {
                    return viewRegistryEntry.factory;
                  }
                  viewRegistryEntry.setResources(resources);
                  var viewFactory = _this.viewCompiler.compile(viewRegistryEntry.template, resources, compileOptions);
                  viewRegistryEntry.setFactory(viewFactory);
                  return viewFactory;
                });
              });
            },
            writable: true,
            configurable: true
          },
          loadTemplateResources: {
            value: function loadTemplateResources(viewRegistryEntry, associatedModuleId) {
              var resources = new ViewResources(this.appResources, viewRegistryEntry.id),
                  dependencies = viewRegistryEntry.dependencies,
                  importIds,
                  names;
              if (dependencies.length === 0 && !associatedModuleId) {
                return Promise.resolve(resources);
              }
              importIds = dependencies.map(function(x) {
                return x.src;
              });
              names = dependencies.map(function(x) {
                return x.name;
              });
              logger.debug("importing resources for " + viewRegistryEntry.id, importIds);
              return this.importViewResources(importIds, names, resources, associatedModuleId);
            },
            writable: true,
            configurable: true
          },
          importViewModelResource: {
            value: function importViewModelResource(moduleImport, moduleMember) {
              var _this = this;
              return this.loader.loadModule(moduleImport).then(function(viewModelModule) {
                var normalizedId = Origin.get(viewModelModule).moduleId,
                    resourceModule = _this.moduleAnalyzer.analyze(normalizedId, viewModelModule, moduleMember);
                if (!resourceModule.mainResource) {
                  throw new Error("No view model found in module \"" + moduleImport + "\".");
                }
                resourceModule.analyze(_this.container);
                return resourceModule.mainResource;
              });
            },
            writable: true,
            configurable: true
          },
          importViewResources: {
            value: function importViewResources(moduleIds, names, resources, associatedModuleId) {
              var _this = this;
              return this.loader.loadAllModules(moduleIds).then(function(imports) {
                var i,
                    ii,
                    analysis,
                    normalizedId,
                    current,
                    associatedModule,
                    container = _this.container,
                    moduleAnalyzer = _this.moduleAnalyzer,
                    allAnalysis = new Array(imports.length);
                for (i = 0, ii = imports.length; i < ii; ++i) {
                  current = imports[i];
                  normalizedId = Origin.get(current).moduleId;
                  analysis = moduleAnalyzer.analyze(normalizedId, current);
                  analysis.analyze(container);
                  analysis.register(resources, names[i]);
                  allAnalysis[i] = analysis;
                }
                if (associatedModuleId) {
                  associatedModule = moduleAnalyzer.getAnalysis(associatedModuleId);
                  if (associatedModule) {
                    associatedModule.register(resources);
                  }
                }
                for (i = 0, ii = allAnalysis.length; i < ii; ++i) {
                  allAnalysis[i] = allAnalysis[i].load(container);
                }
                return Promise.all(allAnalysis).then(function() {
                  return resources;
                });
              });
            },
            writable: true,
            configurable: true
          }
        });
        return ViewEngine;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.9.0/property", ["github:aurelia/templating@0.9.0/util", "github:aurelia/binding@0.4.0"], function(_export) {
  var hyphenate,
      ONE_WAY,
      TWO_WAY,
      ONE_TIME,
      _inherits,
      _prototypeProperties,
      _classCallCheck,
      BehaviorProperty,
      OptionsProperty,
      BehaviorPropertyObserver;
  return {
    setters: [function(_util) {
      hyphenate = _util.hyphenate;
    }, function(_aureliaBinding) {
      ONE_WAY = _aureliaBinding.ONE_WAY;
      TWO_WAY = _aureliaBinding.TWO_WAY;
      ONE_TIME = _aureliaBinding.ONE_TIME;
    }],
    execute: function() {
      "use strict";
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      BehaviorProperty = _export("BehaviorProperty", (function() {
        function BehaviorProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode) {
          _classCallCheck(this, BehaviorProperty);
          this.name = name;
          this.changeHandler = changeHandler;
          this.attribute = attribute || hyphenate(name);
          this.defaultValue = defaultValue;
          this.defaultBindingMode = defaultBindingMode || ONE_WAY;
        }
        _prototypeProperties(BehaviorProperty, null, {
          bindingIsTwoWay: {
            value: function bindingIsTwoWay() {
              this.defaultBindingMode = TWO_WAY;
              return this;
            },
            writable: true,
            configurable: true
          },
          bindingIsOneWay: {
            value: function bindingIsOneWay() {
              this.defaultBindingMode = ONE_WAY;
              return this;
            },
            writable: true,
            configurable: true
          },
          bindingIsOneTime: {
            value: function bindingIsOneTime() {
              this.defaultBindingMode = ONE_TIME;
              return this;
            },
            writable: true,
            configurable: true
          },
          define: {
            value: function define(taskQueue, behavior) {
              var that = this,
                  handlerName;
              this.taskQueue = taskQueue;
              if (!this.changeHandler) {
                handlerName = this.name + "Changed";
                if (handlerName in behavior.target.prototype) {
                  this.changeHandler = handlerName;
                }
              }
              behavior.properties.push(this);
              behavior.attributes[this.attribute] = this;
              Object.defineProperty(behavior.target.prototype, this.name, {
                configurable: true,
                enumerable: true,
                get: function get() {
                  return this.__observers__[that.name].getValue();
                },
                set: function set(value) {
                  this.__observers__[that.name].setValue(value);
                }
              });
            },
            writable: true,
            configurable: true
          },
          createObserver: {
            value: function createObserver(executionContext) {
              var _this = this;
              var selfSubscriber = null;
              if (this.changeHandler) {
                selfSubscriber = function(newValue, oldValue) {
                  return executionContext[_this.changeHandler](newValue, oldValue);
                };
              }
              return new BehaviorPropertyObserver(this.taskQueue, executionContext, this.name, selfSubscriber);
            },
            writable: true,
            configurable: true
          },
          initialize: {
            value: function initialize(executionContext, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
              var selfSubscriber,
                  observer,
                  attribute;
              observer = observerLookup[this.name];
              if (attributes !== undefined) {
                selfSubscriber = observer.selfSubscriber;
                attribute = attributes[this.attribute];
                if (behaviorHandlesBind) {
                  observer.selfSubscriber = null;
                }
                if (typeof attribute === "string") {
                  executionContext[this.name] = attribute;
                  observer.call();
                } else if (attribute) {
                  boundProperties.push({
                    observer: observer,
                    binding: attribute.createBinding(executionContext)
                  });
                } else if (this.defaultValue) {
                  executionContext[this.name] = this.defaultValue;
                  observer.call();
                }
                observer.selfSubscriber = selfSubscriber;
              }
              observer.publishing = true;
            },
            writable: true,
            configurable: true
          }
        });
        return BehaviorProperty;
      })());
      OptionsProperty = _export("OptionsProperty", (function(BehaviorProperty) {
        function OptionsProperty(attribute) {
          for (var _len = arguments.length,
              rest = Array(_len > 1 ? _len - 1 : 0),
              _key = 1; _key < _len; _key++) {
            rest[_key - 1] = arguments[_key];
          }
          _classCallCheck(this, OptionsProperty);
          if (typeof attribute === "string") {
            this.attribute = attribute;
          } else if (attribute) {
            rest.unshift(attribute);
          }
          this.properties = rest;
          this.hasOptions = true;
        }
        _inherits(OptionsProperty, BehaviorProperty);
        _prototypeProperties(OptionsProperty, null, {
          dynamic: {
            value: function dynamic() {
              this.isDynamic = true;
              return this;
            },
            writable: true,
            configurable: true
          },
          withProperty: {
            value: function withProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode) {
              this.properties.push(new BehaviorProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode));
              return this;
            },
            writable: true,
            configurable: true
          },
          define: {
            value: function define(taskQueue, behavior) {
              var i,
                  ii,
                  properties = this.properties;
              this.taskQueue = taskQueue;
              this.attribute = this.attribute || behavior.name;
              behavior.properties.push(this);
              behavior.attributes[this.attribute] = this;
              for (i = 0, ii = properties.length; i < ii; ++i) {
                properties[i].define(taskQueue, behavior);
              }
            },
            writable: true,
            configurable: true
          },
          createObserver: {
            value: function createObserver(executionContext) {},
            writable: true,
            configurable: true
          },
          initialize: {
            value: function initialize(executionContext, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
              var value,
                  key,
                  info;
              if (!this.isDynamic) {
                return ;
              }
              for (key in attributes) {
                this.createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, key, attributes[key], boundProperties);
              }
            },
            writable: true,
            configurable: true
          },
          createDynamicProperty: {
            value: function createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, name, attribute, boundProperties) {
              var changeHandlerName = name + "Changed",
                  selfSubscriber = null,
                  observer,
                  info;
              if (changeHandlerName in executionContext) {
                selfSubscriber = function(newValue, oldValue) {
                  return executionContext[changeHandlerName](newValue, oldValue);
                };
              } else if ("dynamicPropertyChanged" in executionContext) {
                selfSubscriber = function(newValue, oldValue) {
                  return executionContext.dynamicPropertyChanged(name, newValue, oldValue);
                };
              }
              observer = observerLookup[name] = new BehaviorPropertyObserver(this.taskQueue, executionContext, name, selfSubscriber);
              Object.defineProperty(executionContext, name, {
                configurable: true,
                enumerable: true,
                get: observer.getValue.bind(observer),
                set: observer.setValue.bind(observer)
              });
              if (behaviorHandlesBind) {
                observer.selfSubscriber = null;
              }
              if (typeof attribute === "string") {
                executionContext[name] = attribute;
                observer.call();
              } else if (attribute) {
                info = {
                  observer: observer,
                  binding: attribute.createBinding(executionContext)
                };
                boundProperties.push(info);
              }
              observer.publishing = true;
              observer.selfSubscriber = selfSubscriber;
            },
            writable: true,
            configurable: true
          }
        });
        return OptionsProperty;
      })(BehaviorProperty));
      BehaviorPropertyObserver = (function() {
        function BehaviorPropertyObserver(taskQueue, obj, propertyName, selfSubscriber) {
          _classCallCheck(this, BehaviorPropertyObserver);
          this.taskQueue = taskQueue;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbacks = [];
          this.notqueued = true;
          this.publishing = false;
          this.selfSubscriber = selfSubscriber;
        }
        _prototypeProperties(BehaviorPropertyObserver, null, {
          getValue: {
            value: function getValue() {
              return this.currentValue;
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              var oldValue = this.currentValue;
              if (oldValue != newValue) {
                if (this.publishing && this.notqueued) {
                  this.notqueued = false;
                  this.taskQueue.queueMicroTask(this);
                }
                this.oldValue = oldValue;
                this.currentValue = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.oldValue,
                  newValue = this.currentValue;
              this.notqueued = true;
              if (newValue != oldValue) {
                if (this.selfSubscriber !== null) {
                  this.selfSubscriber(newValue, oldValue);
                }
                while (i--) {
                  callbacks[i](newValue, oldValue);
                }
                this.oldValue = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks;
              callbacks.push(callback);
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          }
        });
        return BehaviorPropertyObserver;
      })();
    }
  };
});

System.register("github:aurelia/templating@0.9.0/custom-element", ["github:aurelia/metadata@0.3.4", "github:aurelia/templating@0.9.0/behavior-instance", "github:aurelia/templating@0.9.0/behaviors", "github:aurelia/templating@0.9.0/content-selector", "github:aurelia/templating@0.9.0/view-engine", "github:aurelia/templating@0.9.0/view-strategy", "github:aurelia/templating@0.9.0/util"], function(_export) {
  var Metadata,
      Origin,
      ResourceType,
      BehaviorInstance,
      configureBehavior,
      ContentSelector,
      ViewEngine,
      ViewStrategy,
      hyphenate,
      _prototypeProperties,
      _inherits,
      _classCallCheck,
      defaultInstruction,
      contentSelectorFactoryOptions,
      hasShadowDOM,
      valuePropertyName,
      UseShadowDOM,
      SkipContentProcessing,
      CustomElement;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
      Origin = _aureliaMetadata.Origin;
      ResourceType = _aureliaMetadata.ResourceType;
    }, function(_behaviorInstance) {
      BehaviorInstance = _behaviorInstance.BehaviorInstance;
    }, function(_behaviors) {
      configureBehavior = _behaviors.configureBehavior;
    }, function(_contentSelector) {
      ContentSelector = _contentSelector.ContentSelector;
    }, function(_viewEngine) {
      ViewEngine = _viewEngine.ViewEngine;
    }, function(_viewStrategy) {
      ViewStrategy = _viewStrategy.ViewStrategy;
    }, function(_util) {
      hyphenate = _util.hyphenate;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      defaultInstruction = {suppressBind: false};
      contentSelectorFactoryOptions = {suppressBind: true};
      hasShadowDOM = !!HTMLElement.prototype.createShadowRoot;
      valuePropertyName = "value";
      UseShadowDOM = _export("UseShadowDOM", function UseShadowDOM() {
        _classCallCheck(this, UseShadowDOM);
      });
      SkipContentProcessing = _export("SkipContentProcessing", function SkipContentProcessing() {
        _classCallCheck(this, SkipContentProcessing);
      });
      CustomElement = _export("CustomElement", (function(ResourceType) {
        function CustomElement(tagName) {
          _classCallCheck(this, CustomElement);
          this.name = tagName;
          this.properties = [];
          this.attributes = {};
        }
        _inherits(CustomElement, ResourceType);
        _prototypeProperties(CustomElement, {convention: {
            value: function convention(name) {
              if (name.endsWith("CustomElement")) {
                return new CustomElement(hyphenate(name.substring(0, name.length - 13)));
              }
            },
            writable: true,
            configurable: true
          }}, {
          analyze: {
            value: function analyze(container, target) {
              var meta = Metadata.on(target);
              configureBehavior(container, this, target, valuePropertyName);
              this.targetShadowDOM = meta.has(UseShadowDOM);
              this.skipContentProcessing = meta.has(SkipContentProcessing);
              this.usesShadowDOM = this.targetShadowDOM && hasShadowDOM;
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              registry.registerElement(name || this.name, this);
            },
            writable: true,
            configurable: true
          },
          load: {
            value: function load(container, target, viewStrategy, transientView) {
              var _this = this;
              var options;
              viewStrategy = viewStrategy || this.viewStrategy || ViewStrategy.getDefault(target);
              options = {
                targetShadowDOM: this.targetShadowDOM,
                beforeCompile: target.beforeCompile
              };
              if (!viewStrategy.moduleId) {
                viewStrategy.moduleId = Origin.get(target).moduleId;
              }
              return viewStrategy.loadViewFactory(container.get(ViewEngine), options).then(function(viewFactory) {
                if (!transientView) {
                  _this.viewFactory = viewFactory;
                }
                return viewFactory;
              });
            },
            writable: true,
            configurable: true
          },
          compile: {
            value: function compile(compiler, resources, node, instruction) {
              if (!this.usesShadowDOM && !this.skipContentProcessing && node.hasChildNodes()) {
                var fragment = document.createDocumentFragment(),
                    currentChild = node.firstChild,
                    nextSibling;
                while (currentChild) {
                  nextSibling = currentChild.nextSibling;
                  fragment.appendChild(currentChild);
                  currentChild = nextSibling;
                }
                instruction.contentFactory = compiler.compile(fragment, resources);
              }
              instruction.suppressBind = true;
              return node;
            },
            writable: true,
            configurable: true
          },
          create: {
            value: function create(container) {
              var instruction = arguments[1] === undefined ? defaultInstruction : arguments[1];
              var element = arguments[2] === undefined ? null : arguments[2];
              var executionContext = instruction.executionContext || container.get(this.target),
                  behaviorInstance = new BehaviorInstance(this, executionContext, instruction),
                  viewFactory = instruction.viewFactory || this.viewFactory,
                  host;
              if (viewFactory) {
                behaviorInstance.view = viewFactory.create(container, behaviorInstance.executionContext, instruction);
              }
              if (element) {
                element.primaryBehavior = behaviorInstance;
                if (!(this.apiName in element)) {
                  element[this.apiName] = behaviorInstance.executionContext;
                }
                if (behaviorInstance.view) {
                  if (this.usesShadowDOM) {
                    host = element.createShadowRoot();
                  } else {
                    host = element;
                    if (instruction.contentFactory) {
                      var contentView = instruction.contentFactory.create(container, null, contentSelectorFactoryOptions);
                      ContentSelector.applySelectors(contentView, behaviorInstance.view.contentSelectors, function(contentSelector, group) {
                        return contentSelector.add(group);
                      });
                      behaviorInstance.contentView = contentView;
                    }
                  }
                  if (this.childExpression) {
                    behaviorInstance.view.addBinding(this.childExpression.createBinding(host, behaviorInstance.executionContext));
                  }
                  behaviorInstance.view.appendNodesTo(host);
                }
              } else if (behaviorInstance.view) {
                behaviorInstance.view.owner = behaviorInstance;
              }
              return behaviorInstance;
            },
            writable: true,
            configurable: true
          }
        });
        return CustomElement;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/templating@0.9.0/index", ["github:aurelia/metadata@0.3.4", "github:aurelia/templating@0.9.0/property", "github:aurelia/templating@0.9.0/attached-behavior", "github:aurelia/templating@0.9.0/children", "github:aurelia/templating@0.9.0/custom-element", "github:aurelia/templating@0.9.0/element-config", "github:aurelia/templating@0.9.0/template-controller", "github:aurelia/templating@0.9.0/view-strategy", "github:aurelia/templating@0.9.0/resource-registry", "github:aurelia/templating@0.9.0/view-compiler", "github:aurelia/templating@0.9.0/view-engine", "github:aurelia/templating@0.9.0/view-factory", "github:aurelia/templating@0.9.0/view-slot", "github:aurelia/templating@0.9.0/binding-language", "github:aurelia/templating@0.9.0/composition-engine", "github:aurelia/templating@0.9.0/animator"], function(_export) {
  var Metadata,
      BehaviorProperty,
      OptionsProperty,
      AttachedBehavior,
      ChildObserver,
      CustomElement,
      UseShadowDOM,
      SkipContentProcessing,
      ElementConfig,
      TemplateController,
      UseView,
      NoView,
      Behavior,
      Behaviour;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_property) {
      BehaviorProperty = _property.BehaviorProperty;
      OptionsProperty = _property.OptionsProperty;
      _export("BehaviorProperty", _property.BehaviorProperty);
      _export("OptionsProperty", _property.OptionsProperty);
    }, function(_attachedBehavior) {
      AttachedBehavior = _attachedBehavior.AttachedBehavior;
      _export("AttachedBehavior", _attachedBehavior.AttachedBehavior);
    }, function(_children) {
      ChildObserver = _children.ChildObserver;
      _export("ChildObserver", _children.ChildObserver);
    }, function(_customElement) {
      CustomElement = _customElement.CustomElement;
      UseShadowDOM = _customElement.UseShadowDOM;
      SkipContentProcessing = _customElement.SkipContentProcessing;
      _export("CustomElement", _customElement.CustomElement);
      _export("UseShadowDOM", _customElement.UseShadowDOM);
      _export("SkipContentProcessing", _customElement.SkipContentProcessing);
    }, function(_elementConfig) {
      ElementConfig = _elementConfig.ElementConfig;
      _export("ElementConfig", _elementConfig.ElementConfig);
    }, function(_templateController) {
      TemplateController = _templateController.TemplateController;
      _export("TemplateController", _templateController.TemplateController);
    }, function(_viewStrategy) {
      UseView = _viewStrategy.UseView;
      NoView = _viewStrategy.NoView;
      _export("ViewStrategy", _viewStrategy.ViewStrategy);
      _export("UseView", _viewStrategy.UseView);
      _export("ConventionalView", _viewStrategy.ConventionalView);
      _export("NoView", _viewStrategy.NoView);
    }, function(_resourceRegistry) {
      _export("ResourceRegistry", _resourceRegistry.ResourceRegistry);
      _export("ViewResources", _resourceRegistry.ViewResources);
    }, function(_viewCompiler) {
      _export("ViewCompiler", _viewCompiler.ViewCompiler);
    }, function(_viewEngine) {
      _export("ViewEngine", _viewEngine.ViewEngine);
    }, function(_viewFactory) {
      _export("ViewFactory", _viewFactory.ViewFactory);
      _export("BoundViewFactory", _viewFactory.BoundViewFactory);
    }, function(_viewSlot) {
      _export("ViewSlot", _viewSlot.ViewSlot);
    }, function(_bindingLanguage) {
      _export("BindingLanguage", _bindingLanguage.BindingLanguage);
    }, function(_compositionEngine) {
      _export("CompositionEngine", _compositionEngine.CompositionEngine);
    }, function(_animator) {
      _export("Animator", _animator.Animator);
    }],
    execute: function() {
      "use strict";
      Behavior = _export("Behavior", Metadata);
      Behaviour = _export("Behaviour", Metadata);
      Metadata.configure.classHelper("withProperty", BehaviorProperty);
      Metadata.configure.classHelper("withOptions", OptionsProperty);
      Metadata.configure.classHelper("attachedBehavior", AttachedBehavior);
      Metadata.configure.classHelper("syncChildren", ChildObserver);
      Metadata.configure.classHelper("customElement", CustomElement);
      Metadata.configure.classHelper("useShadowDOM", UseShadowDOM);
      Metadata.configure.classHelper("elementConfig", ElementConfig);
      Metadata.configure.classHelper("templateController", TemplateController);
      Metadata.configure.classHelper("useView", UseView);
      Metadata.configure.classHelper("noView", NoView);
      Metadata.configure.classHelper("skipContentProcessing", SkipContentProcessing);
    }
  };
});

System.register("github:aurelia/templating@0.9.0", ["github:aurelia/templating@0.9.0/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/framework@0.9.0/aurelia", ["github:aurelia/logging@0.2.6", "github:aurelia/dependency-injection@0.5.0", "github:aurelia/loader@0.4.0", "github:aurelia/path@0.4.6", "github:aurelia/framework@0.9.0/plugins", "github:aurelia/templating@0.9.0"], function(_export) {
  var LogManager,
      Container,
      Loader,
      join,
      relativeToFile,
      Plugins,
      BindingLanguage,
      ViewEngine,
      ViewSlot,
      ResourceRegistry,
      CompositionEngine,
      Animator,
      _prototypeProperties,
      _classCallCheck,
      logger,
      slice,
      CustomEvent,
      Aurelia;
  function preventActionlessFormSubmit() {
    document.body.addEventListener("submit", function(evt) {
      var target = evt.target;
      var action = target.action;
      if (target.tagName.toLowerCase() === "form" && !action) {
        evt.preventDefault();
      }
    });
  }
  function loadResources(container, resourcesToLoad, appResources) {
    var viewEngine = container.get(ViewEngine),
        importIds = Object.keys(resourcesToLoad),
        names = new Array(importIds.length),
        i,
        ii;
    for (i = 0, ii = importIds.length; i < ii; ++i) {
      names[i] = resourcesToLoad[importIds[i]];
    }
    return viewEngine.importViewResources(importIds, names, appResources);
  }
  return {
    setters: [function(_aureliaLogging) {
      LogManager = _aureliaLogging;
    }, function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
    }, function(_aureliaPath) {
      join = _aureliaPath.join;
      relativeToFile = _aureliaPath.relativeToFile;
    }, function(_plugins) {
      Plugins = _plugins.Plugins;
    }, function(_aureliaTemplating) {
      BindingLanguage = _aureliaTemplating.BindingLanguage;
      ViewEngine = _aureliaTemplating.ViewEngine;
      ViewSlot = _aureliaTemplating.ViewSlot;
      ResourceRegistry = _aureliaTemplating.ResourceRegistry;
      CompositionEngine = _aureliaTemplating.CompositionEngine;
      Animator = _aureliaTemplating.Animator;
    }],
    execute: function() {
      "use strict";
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      logger = LogManager.getLogger("aurelia");
      slice = Array.prototype.slice;
      if (!window.CustomEvent || typeof window.CustomEvent !== "function") {
        CustomEvent = function CustomEvent(event, params) {
          var params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };
          var evt = document.createEvent("CustomEvent");
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
      }
      Aurelia = _export("Aurelia", (function() {
        function Aurelia(loader, container, resources) {
          _classCallCheck(this, Aurelia);
          this.loader = loader || new window.AureliaLoader();
          this.container = container || new Container();
          this.resources = resources || new ResourceRegistry();
          this.use = new Plugins(this);
          this.resourcesToLoad = {};
          this.withInstance(Aurelia, this);
          this.withInstance(Loader, this.loader);
          this.withInstance(ResourceRegistry, this.resources);
        }
        _prototypeProperties(Aurelia, null, {
          withInstance: {
            value: function withInstance(type, instance) {
              this.container.registerInstance(type, instance);
              return this;
            },
            writable: true,
            configurable: true
          },
          withSingleton: {
            value: function withSingleton(type, implementation) {
              this.container.registerSingleton(type, implementation);
              return this;
            },
            writable: true,
            configurable: true
          },
          globalizeResources: {
            value: function globalizeResources(resources) {
              var toAdd = Array.isArray(resources) ? resources : arguments,
                  i,
                  ii,
                  pluginPath = this.currentPluginId || "",
                  path,
                  internalPlugin = pluginPath.startsWith("./");
              for (i = 0, ii = toAdd.length; i < ii; ++i) {
                path = internalPlugin ? relativeToFile(toAdd[i], pluginPath) : join(pluginPath, toAdd[i]);
                this.resourcesToLoad[path] = this.resourcesToLoad[path];
              }
              return this;
            },
            writable: true,
            configurable: true
          },
          renameGlobalResource: {
            value: function renameGlobalResource(resourcePath, newName) {
              this.resourcesToLoad[resourcePath] = newName;
              return this;
            },
            writable: true,
            configurable: true
          },
          start: {
            value: function start() {
              var _this = this;
              if (this.started) {
                return Promise.resolve(this);
              }
              this.started = true;
              logger.info("Aurelia Starting");
              preventActionlessFormSubmit();
              return this.use._process().then(function() {
                if (!_this.container.hasHandler(BindingLanguage)) {
                  var message = "You must configure Aurelia with a BindingLanguage implementation.";
                  logger.error(message);
                  throw new Error(message);
                }
                if (!_this.container.hasHandler(Animator)) {
                  Animator.configureDefault(_this.container);
                }
                return loadResources(_this.container, _this.resourcesToLoad, _this.resources).then(function() {
                  logger.info("Aurelia Started");
                  var evt = new window.CustomEvent("aurelia-started", {
                    bubbles: true,
                    cancelable: true
                  });
                  document.dispatchEvent(evt);
                  return _this;
                });
              });
            },
            writable: true,
            configurable: true
          },
          setRoot: {
            value: function setRoot() {
              var _this = this;
              var root = arguments[0] === undefined ? "app" : arguments[0];
              var applicationHost = arguments[1] === undefined ? null : arguments[1];
              var compositionEngine,
                  instruction = {};
              if (!applicationHost || typeof applicationHost == "string") {
                this.host = document.getElementById(applicationHost || "applicationHost") || document.body;
              } else {
                this.host = applicationHost;
              }
              this.host.aurelia = this;
              this.container.registerInstance(Element, this.host);
              compositionEngine = this.container.get(CompositionEngine);
              instruction.viewModel = root;
              instruction.container = instruction.childContainer = this.container;
              instruction.viewSlot = new ViewSlot(this.host, true);
              instruction.viewSlot.transformChildNodesIntoView();
              return compositionEngine.compose(instruction).then(function(root) {
                _this.root = root;
                instruction.viewSlot.attached();
                var evt = new window.CustomEvent("aurelia-composed", {
                  bubbles: true,
                  cancelable: true
                });
                setTimeout(function() {
                  return document.dispatchEvent(evt);
                }, 1);
                return _this;
              });
            },
            writable: true,
            configurable: true
          }
        });
        return Aurelia;
      })());
    }
  };
});

System.register("github:aurelia/framework@0.9.0/index", ["github:aurelia/framework@0.9.0/aurelia", "github:aurelia/dependency-injection@0.5.0", "github:aurelia/binding@0.4.0", "github:aurelia/metadata@0.3.4", "github:aurelia/templating@0.9.0", "github:aurelia/loader@0.4.0", "github:aurelia/task-queue@0.2.5", "github:aurelia/logging@0.2.6"], function(_export) {
  var TheLogManager,
      LogManager;
  return {
    setters: [function(_aurelia) {
      _export("Aurelia", _aurelia.Aurelia);
    }, function(_aureliaDependencyInjection) {
      for (var _key in _aureliaDependencyInjection) {
        _export(_key, _aureliaDependencyInjection[_key]);
      }
    }, function(_aureliaBinding) {
      for (var _key2 in _aureliaBinding) {
        _export(_key2, _aureliaBinding[_key2]);
      }
    }, function(_aureliaMetadata) {
      for (var _key3 in _aureliaMetadata) {
        _export(_key3, _aureliaMetadata[_key3]);
      }
    }, function(_aureliaTemplating) {
      for (var _key4 in _aureliaTemplating) {
        _export(_key4, _aureliaTemplating[_key4]);
      }
    }, function(_aureliaLoader) {
      for (var _key5 in _aureliaLoader) {
        _export(_key5, _aureliaLoader[_key5]);
      }
    }, function(_aureliaTaskQueue) {
      for (var _key6 in _aureliaTaskQueue) {
        _export(_key6, _aureliaTaskQueue[_key6]);
      }
    }, function(_aureliaLogging) {
      TheLogManager = _aureliaLogging;
    }],
    execute: function() {
      "use strict";
      LogManager = _export("LogManager", TheLogManager);
    }
  };
});

System.register("github:aurelia/framework@0.9.0", ["github:aurelia/framework@0.9.0/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/bootstrapper@0.10.0/index", ["github:aurelia/framework@0.9.0", "github:aurelia/logging-console@0.2.4"], function(_export) {
  var Aurelia,
      LogManager,
      ConsoleAppender,
      logger,
      readyQueue,
      isReady,
      installedDevelopmentLogging;
  _export("bootstrap", bootstrap);
  function onReady(callback) {
    return new Promise(function(resolve, reject) {
      if (!isReady) {
        readyQueue.push(function() {
          try {
            resolve(callback());
          } catch (e) {
            reject(e);
          }
        });
      } else {
        resolve(callback());
      }
    });
  }
  function bootstrap(configure) {
    return onReady(function() {
      var loader = new window.AureliaLoader(),
          aurelia = new Aurelia(loader);
      return configureAurelia(aurelia).then(function() {
        return configure(aurelia);
      });
    });
  }
  function ready(global) {
    return new Promise(function(resolve, reject) {
      if (global.document.readyState === "complete") {
        resolve(global.document);
      } else {
        global.document.addEventListener("DOMContentLoaded", completed, false);
        global.addEventListener("load", completed, false);
      }
      function completed() {
        global.document.removeEventListener("DOMContentLoaded", completed, false);
        global.removeEventListener("load", completed, false);
        resolve(global.document);
      }
    });
  }
  function ensureLoader() {
    if (!window.AureliaLoader) {
      return System.normalize("aurelia-bootstrapper").then(function(bootstrapperName) {
        return System.normalize("aurelia-loader-default", bootstrapperName).then(function(loaderName) {
          return System["import"](loaderName);
        });
      });
    }
    return Promise.resolve();
  }
  function preparePlatform() {
    return System.normalize("aurelia-bootstrapper").then(function(bootstrapperName) {
      return System.normalize("aurelia-framework", bootstrapperName).then(function(frameworkName) {
        System.map["aurelia-framework"] = frameworkName;
        return System.normalize("aurelia-loader", frameworkName).then(function(loaderName) {
          var toLoad = [];
          if (!System.polyfilled) {
            logger.debug("loading core-js");
            toLoad.push(System.normalize("core-js", loaderName).then(function(name) {
              return System["import"](name);
            }));
          }
          toLoad.push(System.normalize("aurelia-depedency-injection", frameworkName).then(function(name) {
            System.map["aurelia-depedency-injection"] = name;
          }));
          toLoad.push(System.normalize("aurelia-router", bootstrapperName).then(function(name) {
            System.map["aurelia-router"] = name;
          }));
          toLoad.push(System.normalize("aurelia-logging-console", bootstrapperName).then(function(name) {
            System.map["aurelia-logging-console"] = name;
          }));
          if (!("import" in document.createElement("link"))) {
            logger.debug("loading the HTMLImports polyfill");
            toLoad.push(System.normalize("webcomponentsjs/HTMLImports.min", loaderName).then(function(name) {
              return System["import"](name);
            }));
          }
          if (!("content" in document.createElement("template"))) {
            logger.debug("loading the HTMLTemplateElement polyfill");
            toLoad.push(System.normalize("aurelia-html-template-element", loaderName).then(function(name) {
              return System["import"](name);
            }));
          }
          return Promise.all(toLoad);
        });
      });
    });
  }
  function configureAurelia(aurelia) {
    return System.normalize("aurelia-bootstrapper").then(function(bName) {
      var toLoad = [];
      toLoad.push(System.normalize("aurelia-templating-binding", bName).then(function(templatingBinding) {
        aurelia.use.defaultBindingLanguage = function() {
          aurelia.use.plugin(templatingBinding);
          return this;
        };
      }));
      toLoad.push(System.normalize("aurelia-history-browser", bName).then(function(historyBrowser) {
        return System.normalize("aurelia-templating-router", bName).then(function(templatingRouter) {
          aurelia.use.router = function() {
            aurelia.use.plugin(historyBrowser);
            aurelia.use.plugin(templatingRouter);
            return this;
          };
        });
      }));
      toLoad.push(System.normalize("aurelia-templating-resources", bName).then(function(name) {
        System.map["aurelia-templating-resources"] = name;
        aurelia.use.defaultResources = function() {
          aurelia.use.plugin(name);
          return this;
        };
      }));
      toLoad.push(System.normalize("aurelia-event-aggregator", bName).then(function(eventAggregator) {
        System.map["aurelia-event-aggregator"] = eventAggregator;
        aurelia.use.eventAggregator = function() {
          aurelia.use.plugin(eventAggregator);
          return this;
        };
      }));
      aurelia.use.standardConfiguration = function() {
        aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator();
        return this;
      };
      aurelia.use.developmentLogging = function() {
        if (!installedDevelopmentLogging) {
          installedDevelopmentLogging = true;
          LogManager.addAppender(new ConsoleAppender());
          LogManager.setLevel(LogManager.levels.debug);
        }
        return this;
      };
      return Promise.all(toLoad);
    });
  }
  function runningLocally() {
    return window.location.protocol !== "http" && window.location.protocol !== "https";
  }
  function handleApp(appHost) {
    var configModuleId = appHost.getAttribute("aurelia-app"),
        aurelia,
        loader;
    if (configModuleId) {
      loader = new window.AureliaLoader();
      return loader.loadModule(configModuleId).then(function(m) {
        aurelia = new Aurelia(loader);
        return configureAurelia(aurelia).then(function() {
          return m.configure(aurelia);
        });
      })["catch"](function(e) {
        setTimeout(function() {
          throw e;
        }, 0);
      });
    } else {
      aurelia = new Aurelia();
      return configureAurelia(aurelia).then(function() {
        if (runningLocally()) {
          aurelia.use.developmentLogging();
        }
        aurelia.use.standardConfiguration();
        if (appHost.hasAttribute("es5")) {
          aurelia.use.es5();
        } else if (appHost.hasAttribute("atscript")) {
          aurelia.use.atscript();
        }
        return aurelia.start().then(function(a) {
          return a.setRoot(undefined, appHost);
        });
      })["catch"](function(e) {
        setTimeout(function() {
          throw e;
        }, 0);
      });
    }
  }
  function run() {
    return ready(window).then(function(doc) {
      var appHost = doc.querySelectorAll("[aurelia-app]");
      return ensureLoader().then(function() {
        return preparePlatform().then(function() {
          var i,
              ii;
          for (i = 0, ii = appHost.length; i < ii; ++i) {
            handleApp(appHost[i]);
          }
          isReady = true;
          for (i = 0, ii = readyQueue.length; i < ii; ++i) {
            readyQueue[i]();
          }
          readyQueue = [];
        });
      });
    });
  }
  return {
    setters: [function(_aureliaFramework) {
      Aurelia = _aureliaFramework.Aurelia;
      LogManager = _aureliaFramework.LogManager;
    }, function(_aureliaLoggingConsole) {
      ConsoleAppender = _aureliaLoggingConsole.ConsoleAppender;
    }],
    execute: function() {
      "use strict";
      logger = LogManager.getLogger("bootstrapper");
      readyQueue = [];
      isReady = false;
      installedDevelopmentLogging = false;
      run();
    }
  };
});

System.register("github:aurelia/bootstrapper@0.10.0", ["github:aurelia/bootstrapper@0.10.0/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:firebase/firebase-bower@2.2.3/firebase", [], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, []);
  (function() {
    (function() {
      var h,
          aa = this;
      function n(a) {
        return void 0 !== a;
      }
      function ba() {}
      function ca(a) {
        a.Wb = function() {
          return a.qf ? a.qf : a.qf = new a;
        };
      }
      function da(a) {
        var b = typeof a;
        if ("object" == b)
          if (a) {
            if (a instanceof Array)
              return "array";
            if (a instanceof Object)
              return b;
            var c = Object.prototype.toString.call(a);
            if ("[object Window]" == c)
              return "object";
            if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice"))
              return "array";
            if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call"))
              return "function";
          } else
            return "null";
        else if ("function" == b && "undefined" == typeof a.call)
          return "object";
        return b;
      }
      function ea(a) {
        return "array" == da(a);
      }
      function fa(a) {
        var b = da(a);
        return "array" == b || "object" == b && "number" == typeof a.length;
      }
      function p(a) {
        return "string" == typeof a;
      }
      function ga(a) {
        return "number" == typeof a;
      }
      function ha(a) {
        return "function" == da(a);
      }
      function ia(a) {
        var b = typeof a;
        return "object" == b && null != a || "function" == b;
      }
      function ja(a, b, c) {
        return a.call.apply(a.bind, arguments);
      }
      function ka(a, b, c) {
        if (!a)
          throw Error();
        if (2 < arguments.length) {
          var d = Array.prototype.slice.call(arguments, 2);
          return function() {
            var c = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(c, d);
            return a.apply(b, c);
          };
        }
        return function() {
          return a.apply(b, arguments);
        };
      }
      function q(a, b, c) {
        q = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ja : ka;
        return q.apply(null, arguments);
      }
      var la = Date.now || function() {
        return +new Date;
      };
      function ma(a, b) {
        function c() {}
        c.prototype = b.prototype;
        a.Wg = b.prototype;
        a.prototype = new c;
        a.prototype.constructor = a;
        a.Sg = function(a, c, f) {
          for (var g = Array(arguments.length - 2),
              k = 2; k < arguments.length; k++)
            g[k - 2] = arguments[k];
          return b.prototype[c].apply(a, g);
        };
      }
      ;
      function r(a, b) {
        for (var c in a)
          b.call(void 0, a[c], c, a);
      }
      function na(a, b) {
        var c = {},
            d;
        for (d in a)
          c[d] = b.call(void 0, a[d], d, a);
        return c;
      }
      function oa(a, b) {
        for (var c in a)
          if (!b.call(void 0, a[c], c, a))
            return !1;
        return !0;
      }
      function pa(a) {
        var b = 0,
            c;
        for (c in a)
          b++;
        return b;
      }
      function qa(a) {
        for (var b in a)
          return b;
      }
      function ra(a) {
        var b = [],
            c = 0,
            d;
        for (d in a)
          b[c++] = a[d];
        return b;
      }
      function sa(a) {
        var b = [],
            c = 0,
            d;
        for (d in a)
          b[c++] = d;
        return b;
      }
      function ta(a, b) {
        for (var c in a)
          if (a[c] == b)
            return !0;
        return !1;
      }
      function ua(a, b, c) {
        for (var d in a)
          if (b.call(c, a[d], d, a))
            return d;
      }
      function va(a, b) {
        var c = ua(a, b, void 0);
        return c && a[c];
      }
      function wa(a) {
        for (var b in a)
          return !1;
        return !0;
      }
      function xa(a) {
        var b = {},
            c;
        for (c in a)
          b[c] = a[c];
        return b;
      }
      var ya = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
      function za(a, b) {
        for (var c,
            d,
            e = 1; e < arguments.length; e++) {
          d = arguments[e];
          for (c in d)
            a[c] = d[c];
          for (var f = 0; f < ya.length; f++)
            c = ya[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
        }
      }
      ;
      function Aa(a) {
        a = String(a);
        if (/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, "")))
          try {
            return eval("(" + a + ")");
          } catch (b) {}
        throw Error("Invalid JSON string: " + a);
      }
      function Ba() {
        this.Rd = void 0;
      }
      function Ca(a, b, c) {
        switch (typeof b) {
          case "string":
            Da(b, c);
            break;
          case "number":
            c.push(isFinite(b) && !isNaN(b) ? b : "null");
            break;
          case "boolean":
            c.push(b);
            break;
          case "undefined":
            c.push("null");
            break;
          case "object":
            if (null == b) {
              c.push("null");
              break;
            }
            if (ea(b)) {
              var d = b.length;
              c.push("[");
              for (var e = "",
                  f = 0; f < d; f++)
                c.push(e), e = b[f], Ca(a, a.Rd ? a.Rd.call(b, String(f), e) : e, c), e = ",";
              c.push("]");
              break;
            }
            c.push("{");
            d = "";
            for (f in b)
              Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], "function" != typeof e && (c.push(d), Da(f, c), c.push(":"), Ca(a, a.Rd ? a.Rd.call(b, f, e) : e, c), d = ","));
            c.push("}");
            break;
          case "function":
            break;
          default:
            throw Error("Unknown type: " + typeof b);
        }
      }
      var Ea = {
        '"': '\\"',
        "\\": "\\\\",
        "/": "\\/",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\x0B": "\\u000b"
      },
          Fa = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
      function Da(a, b) {
        b.push('"', a.replace(Fa, function(a) {
          if (a in Ea)
            return Ea[a];
          var b = a.charCodeAt(0),
              e = "\\u";
          16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
          return Ea[a] = e + b.toString(16);
        }), '"');
      }
      ;
      function Ga() {
        return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ la()).toString(36);
      }
      ;
      var Ha;
      a: {
        var Ia = aa.navigator;
        if (Ia) {
          var Ja = Ia.userAgent;
          if (Ja) {
            Ha = Ja;
            break a;
          }
        }
        Ha = "";
      }
      ;
      function Ka() {
        this.Wa = -1;
      }
      ;
      function La() {
        this.Wa = -1;
        this.Wa = 64;
        this.R = [];
        this.me = [];
        this.Qf = [];
        this.Kd = [];
        this.Kd[0] = 128;
        for (var a = 1; a < this.Wa; ++a)
          this.Kd[a] = 0;
        this.ce = this.ac = 0;
        this.reset();
      }
      ma(La, Ka);
      La.prototype.reset = function() {
        this.R[0] = 1732584193;
        this.R[1] = 4023233417;
        this.R[2] = 2562383102;
        this.R[3] = 271733878;
        this.R[4] = 3285377520;
        this.ce = this.ac = 0;
      };
      function Ma(a, b, c) {
        c || (c = 0);
        var d = a.Qf;
        if (p(b))
          for (var e = 0; 16 > e; e++)
            d[e] = b.charCodeAt(c) << 24 | b.charCodeAt(c + 1) << 16 | b.charCodeAt(c + 2) << 8 | b.charCodeAt(c + 3), c += 4;
        else
          for (e = 0; 16 > e; e++)
            d[e] = b[c] << 24 | b[c + 1] << 16 | b[c + 2] << 8 | b[c + 3], c += 4;
        for (e = 16; 80 > e; e++) {
          var f = d[e - 3] ^ d[e - 8] ^ d[e - 14] ^ d[e - 16];
          d[e] = (f << 1 | f >>> 31) & 4294967295;
        }
        b = a.R[0];
        c = a.R[1];
        for (var g = a.R[2],
            k = a.R[3],
            l = a.R[4],
            m,
            e = 0; 80 > e; e++)
          40 > e ? 20 > e ? (f = k ^ c & (g ^ k), m = 1518500249) : (f = c ^ g ^ k, m = 1859775393) : 60 > e ? (f = c & g | k & (c | g), m = 2400959708) : (f = c ^ g ^ k, m = 3395469782), f = (b << 5 | b >>> 27) + f + l + m + d[e] & 4294967295, l = k, k = g, g = (c << 30 | c >>> 2) & 4294967295, c = b, b = f;
        a.R[0] = a.R[0] + b & 4294967295;
        a.R[1] = a.R[1] + c & 4294967295;
        a.R[2] = a.R[2] + g & 4294967295;
        a.R[3] = a.R[3] + k & 4294967295;
        a.R[4] = a.R[4] + l & 4294967295;
      }
      La.prototype.update = function(a, b) {
        if (null != a) {
          n(b) || (b = a.length);
          for (var c = b - this.Wa,
              d = 0,
              e = this.me,
              f = this.ac; d < b; ) {
            if (0 == f)
              for (; d <= c; )
                Ma(this, a, d), d += this.Wa;
            if (p(a))
              for (; d < b; ) {
                if (e[f] = a.charCodeAt(d), ++f, ++d, f == this.Wa) {
                  Ma(this, e);
                  f = 0;
                  break;
                }
              }
            else
              for (; d < b; )
                if (e[f] = a[d], ++f, ++d, f == this.Wa) {
                  Ma(this, e);
                  f = 0;
                  break;
                }
          }
          this.ac = f;
          this.ce += b;
        }
      };
      var t = Array.prototype,
          Na = t.indexOf ? function(a, b, c) {
            return t.indexOf.call(a, b, c);
          } : function(a, b, c) {
            c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
            if (p(a))
              return p(b) && 1 == b.length ? a.indexOf(b, c) : -1;
            for (; c < a.length; c++)
              if (c in a && a[c] === b)
                return c;
            return -1;
          },
          Oa = t.forEach ? function(a, b, c) {
            t.forEach.call(a, b, c);
          } : function(a, b, c) {
            for (var d = a.length,
                e = p(a) ? a.split("") : a,
                f = 0; f < d; f++)
              f in e && b.call(c, e[f], f, a);
          },
          Pa = t.filter ? function(a, b, c) {
            return t.filter.call(a, b, c);
          } : function(a, b, c) {
            for (var d = a.length,
                e = [],
                f = 0,
                g = p(a) ? a.split("") : a,
                k = 0; k < d; k++)
              if (k in g) {
                var l = g[k];
                b.call(c, l, k, a) && (e[f++] = l);
              }
            return e;
          },
          Qa = t.map ? function(a, b, c) {
            return t.map.call(a, b, c);
          } : function(a, b, c) {
            for (var d = a.length,
                e = Array(d),
                f = p(a) ? a.split("") : a,
                g = 0; g < d; g++)
              g in f && (e[g] = b.call(c, f[g], g, a));
            return e;
          },
          Ra = t.reduce ? function(a, b, c, d) {
            for (var e = [],
                f = 1,
                g = arguments.length; f < g; f++)
              e.push(arguments[f]);
            d && (e[0] = q(b, d));
            return t.reduce.apply(a, e);
          } : function(a, b, c, d) {
            var e = c;
            Oa(a, function(c, g) {
              e = b.call(d, e, c, g, a);
            });
            return e;
          },
          Sa = t.every ? function(a, b, c) {
            return t.every.call(a, b, c);
          } : function(a, b, c) {
            for (var d = a.length,
                e = p(a) ? a.split("") : a,
                f = 0; f < d; f++)
              if (f in e && !b.call(c, e[f], f, a))
                return !1;
            return !0;
          };
      function Ta(a, b) {
        var c = Ua(a, b, void 0);
        return 0 > c ? null : p(a) ? a.charAt(c) : a[c];
      }
      function Ua(a, b, c) {
        for (var d = a.length,
            e = p(a) ? a.split("") : a,
            f = 0; f < d; f++)
          if (f in e && b.call(c, e[f], f, a))
            return f;
        return -1;
      }
      function Va(a, b) {
        var c = Na(a, b);
        0 <= c && t.splice.call(a, c, 1);
      }
      function Wa(a, b, c) {
        return 2 >= arguments.length ? t.slice.call(a, b) : t.slice.call(a, b, c);
      }
      function Xa(a, b) {
        a.sort(b || Ya);
      }
      function Ya(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      }
      ;
      var Za = -1 != Ha.indexOf("Opera") || -1 != Ha.indexOf("OPR"),
          $a = -1 != Ha.indexOf("Trident") || -1 != Ha.indexOf("MSIE"),
          ab = -1 != Ha.indexOf("Gecko") && -1 == Ha.toLowerCase().indexOf("webkit") && !(-1 != Ha.indexOf("Trident") || -1 != Ha.indexOf("MSIE")),
          bb = -1 != Ha.toLowerCase().indexOf("webkit");
      (function() {
        var a = "",
            b;
        if (Za && aa.opera)
          return a = aa.opera.version, ha(a) ? a() : a;
        ab ? b = /rv\:([^\);]+)(\)|;)/ : $a ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : bb && (b = /WebKit\/(\S+)/);
        b && (a = (a = b.exec(Ha)) ? a[1] : "");
        return $a && (b = (b = aa.document) ? b.documentMode : void 0, b > parseFloat(a)) ? String(b) : a;
      })();
      var cb = null,
          db = null,
          eb = null;
      function fb(a, b) {
        if (!fa(a))
          throw Error("encodeByteArray takes an array as a parameter");
        gb();
        for (var c = b ? db : cb,
            d = [],
            e = 0; e < a.length; e += 3) {
          var f = a[e],
              g = e + 1 < a.length,
              k = g ? a[e + 1] : 0,
              l = e + 2 < a.length,
              m = l ? a[e + 2] : 0,
              v = f >> 2,
              f = (f & 3) << 4 | k >> 4,
              k = (k & 15) << 2 | m >> 6,
              m = m & 63;
          l || (m = 64, g || (k = 64));
          d.push(c[v], c[f], c[k], c[m]);
        }
        return d.join("");
      }
      function gb() {
        if (!cb) {
          cb = {};
          db = {};
          eb = {};
          for (var a = 0; 65 > a; a++)
            cb[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a), db[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a), eb[db[a]] = a, 62 <= a && (eb["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)] = a);
        }
      }
      ;
      function u(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
      }
      function w(a, b) {
        if (Object.prototype.hasOwnProperty.call(a, b))
          return a[b];
      }
      function hb(a, b) {
        for (var c in a)
          Object.prototype.hasOwnProperty.call(a, c) && b(c, a[c]);
      }
      function ib(a) {
        var b = {};
        hb(a, function(a, d) {
          b[a] = d;
        });
        return b;
      }
      ;
      function jb(a) {
        var b = [];
        hb(a, function(a, d) {
          ea(d) ? Oa(d, function(d) {
            b.push(encodeURIComponent(a) + "=" + encodeURIComponent(d));
          }) : b.push(encodeURIComponent(a) + "=" + encodeURIComponent(d));
        });
        return b.length ? "&" + b.join("&") : "";
      }
      function kb(a) {
        var b = {};
        a = a.replace(/^\?/, "").split("&");
        Oa(a, function(a) {
          a && (a = a.split("="), b[a[0]] = a[1]);
        });
        return b;
      }
      ;
      function x(a, b, c, d) {
        var e;
        d < b ? e = "at least " + b : d > c && (e = 0 === c ? "none" : "no more than " + c);
        if (e)
          throw Error(a + " failed: Was called with " + d + (1 === d ? " argument." : " arguments.") + " Expects " + e + ".");
      }
      function z(a, b, c) {
        var d = "";
        switch (b) {
          case 1:
            d = c ? "first" : "First";
            break;
          case 2:
            d = c ? "second" : "Second";
            break;
          case 3:
            d = c ? "third" : "Third";
            break;
          case 4:
            d = c ? "fourth" : "Fourth";
            break;
          default:
            throw Error("errorPrefix called with argumentNumber > 4.  Need to update it?");
        }
        return a = a + " failed: " + (d + " argument ");
      }
      function A(a, b, c, d) {
        if ((!d || n(c)) && !ha(c))
          throw Error(z(a, b, d) + "must be a valid function.");
      }
      function lb(a, b, c) {
        if (n(c) && (!ia(c) || null === c))
          throw Error(z(a, b, !0) + "must be a valid context object.");
      }
      ;
      function mb(a) {
        return "undefined" !== typeof JSON && n(JSON.parse) ? JSON.parse(a) : Aa(a);
      }
      function B(a) {
        if ("undefined" !== typeof JSON && n(JSON.stringify))
          a = JSON.stringify(a);
        else {
          var b = [];
          Ca(new Ba, a, b);
          a = b.join("");
        }
        return a;
      }
      ;
      function nb() {
        this.Td = C;
      }
      nb.prototype.j = function(a) {
        return this.Td.oa(a);
      };
      nb.prototype.toString = function() {
        return this.Td.toString();
      };
      function ob() {}
      ob.prototype.mf = function() {
        return null;
      };
      ob.prototype.ye = function() {
        return null;
      };
      var pb = new ob;
      function qb(a, b, c) {
        this.Nf = a;
        this.Ka = b;
        this.Jd = c;
      }
      qb.prototype.mf = function(a) {
        var b = this.Ka.D;
        if (rb(b, a))
          return b.j().M(a);
        b = null != this.Jd ? new sb(this.Jd, !0, !1) : this.Ka.u();
        return this.Nf.Xa(a, b);
      };
      qb.prototype.ye = function(a, b, c) {
        var d = null != this.Jd ? this.Jd : tb(this.Ka);
        a = this.Nf.ne(d, b, 1, c, a);
        return 0 === a.length ? null : a[0];
      };
      function ub() {
        this.tb = [];
      }
      function vb(a, b) {
        for (var c = null,
            d = 0; d < b.length; d++) {
          var e = b[d],
              f = e.Zb();
          null === c || f.Z(c.Zb()) || (a.tb.push(c), c = null);
          null === c && (c = new wb(f));
          c.add(e);
        }
        c && a.tb.push(c);
      }
      function xb(a, b, c) {
        vb(a, c);
        yb(a, function(a) {
          return a.Z(b);
        });
      }
      function zb(a, b, c) {
        vb(a, c);
        yb(a, function(a) {
          return a.contains(b) || b.contains(a);
        });
      }
      function yb(a, b) {
        for (var c = !0,
            d = 0; d < a.tb.length; d++) {
          var e = a.tb[d];
          if (e)
            if (e = e.Zb(), b(e)) {
              for (var e = a.tb[d],
                  f = 0; f < e.ud.length; f++) {
                var g = e.ud[f];
                if (null !== g) {
                  e.ud[f] = null;
                  var k = g.Ub();
                  Ab && Bb("event: " + g.toString());
                  Cb(k);
                }
              }
              a.tb[d] = null;
            } else
              c = !1;
        }
        c && (a.tb = []);
      }
      function wb(a) {
        this.qa = a;
        this.ud = [];
      }
      wb.prototype.add = function(a) {
        this.ud.push(a);
      };
      wb.prototype.Zb = function() {
        return this.qa;
      };
      function D(a, b, c, d) {
        this.type = a;
        this.Ja = b;
        this.Ya = c;
        this.Je = d;
        this.Pd = void 0;
      }
      function Db(a) {
        return new D(Eb, a);
      }
      var Eb = "value";
      function Fb(a, b, c, d) {
        this.ue = b;
        this.Xd = c;
        this.Pd = d;
        this.td = a;
      }
      Fb.prototype.Zb = function() {
        var a = this.Xd.lc();
        return "value" === this.td ? a.path : a.parent().path;
      };
      Fb.prototype.ze = function() {
        return this.td;
      };
      Fb.prototype.Ub = function() {
        return this.ue.Ub(this);
      };
      Fb.prototype.toString = function() {
        return this.Zb().toString() + ":" + this.td + ":" + B(this.Xd.jf());
      };
      function Gb(a, b, c) {
        this.ue = a;
        this.error = b;
        this.path = c;
      }
      Gb.prototype.Zb = function() {
        return this.path;
      };
      Gb.prototype.ze = function() {
        return "cancel";
      };
      Gb.prototype.Ub = function() {
        return this.ue.Ub(this);
      };
      Gb.prototype.toString = function() {
        return this.path.toString() + ":cancel";
      };
      function sb(a, b, c) {
        this.B = a;
        this.$ = b;
        this.Tb = c;
      }
      function Hb(a) {
        return a.$;
      }
      function rb(a, b) {
        return a.$ && !a.Tb || a.B.Ha(b);
      }
      sb.prototype.j = function() {
        return this.B;
      };
      function Ib(a) {
        this.ag = a;
        this.Cd = null;
      }
      Ib.prototype.get = function() {
        var a = this.ag.get(),
            b = xa(a);
        if (this.Cd)
          for (var c in this.Cd)
            b[c] -= this.Cd[c];
        this.Cd = a;
        return b;
      };
      function Jb(a, b) {
        this.Jf = {};
        this.Zd = new Ib(a);
        this.ca = b;
        var c = 1E4 + 2E4 * Math.random();
        setTimeout(q(this.Ef, this), Math.floor(c));
      }
      Jb.prototype.Ef = function() {
        var a = this.Zd.get(),
            b = {},
            c = !1,
            d;
        for (d in a)
          0 < a[d] && u(this.Jf, d) && (b[d] = a[d], c = !0);
        c && this.ca.Df(b);
        setTimeout(q(this.Ef, this), Math.floor(6E5 * Math.random()));
      };
      function Kb() {
        this.Dc = {};
      }
      function Lb(a, b, c) {
        n(c) || (c = 1);
        u(a.Dc, b) || (a.Dc[b] = 0);
        a.Dc[b] += c;
      }
      Kb.prototype.get = function() {
        return xa(this.Dc);
      };
      var Mb = {},
          Nb = {};
      function Ob(a) {
        a = a.toString();
        Mb[a] || (Mb[a] = new Kb);
        return Mb[a];
      }
      function Pb(a, b) {
        var c = a.toString();
        Nb[c] || (Nb[c] = b());
        return Nb[c];
      }
      ;
      function E(a, b) {
        this.name = a;
        this.S = b;
      }
      function Qb(a, b) {
        return new E(a, b);
      }
      ;
      function Rb(a, b) {
        return Sb(a.name, b.name);
      }
      function Tb(a, b) {
        return Sb(a, b);
      }
      ;
      function Ub(a, b, c) {
        this.type = Vb;
        this.source = a;
        this.path = b;
        this.Ia = c;
      }
      Ub.prototype.Xc = function(a) {
        return this.path.e() ? new Ub(this.source, F, this.Ia.M(a)) : new Ub(this.source, G(this.path), this.Ia);
      };
      Ub.prototype.toString = function() {
        return "Operation(" + this.path + ": " + this.source.toString() + " overwrite: " + this.Ia.toString() + ")";
      };
      function Wb(a, b) {
        this.type = Xb;
        this.source = Yb;
        this.path = a;
        this.Te = b;
      }
      Wb.prototype.Xc = function() {
        return this.path.e() ? this : new Wb(G(this.path), this.Te);
      };
      Wb.prototype.toString = function() {
        return "Operation(" + this.path + ": " + this.source.toString() + " ack write revert=" + this.Te + ")";
      };
      function Zb(a, b) {
        this.type = $b;
        this.source = a;
        this.path = b;
      }
      Zb.prototype.Xc = function() {
        return this.path.e() ? new Zb(this.source, F) : new Zb(this.source, G(this.path));
      };
      Zb.prototype.toString = function() {
        return "Operation(" + this.path + ": " + this.source.toString() + " listen_complete)";
      };
      function ac(a, b) {
        this.La = a;
        this.xa = b ? b : bc;
      }
      h = ac.prototype;
      h.Na = function(a, b) {
        return new ac(this.La, this.xa.Na(a, b, this.La).X(null, null, !1, null, null));
      };
      h.remove = function(a) {
        return new ac(this.La, this.xa.remove(a, this.La).X(null, null, !1, null, null));
      };
      h.get = function(a) {
        for (var b,
            c = this.xa; !c.e(); ) {
          b = this.La(a, c.key);
          if (0 === b)
            return c.value;
          0 > b ? c = c.left : 0 < b && (c = c.right);
        }
        return null;
      };
      function cc(a, b) {
        for (var c,
            d = a.xa,
            e = null; !d.e(); ) {
          c = a.La(b, d.key);
          if (0 === c) {
            if (d.left.e())
              return e ? e.key : null;
            for (d = d.left; !d.right.e(); )
              d = d.right;
            return d.key;
          }
          0 > c ? d = d.left : 0 < c && (e = d, d = d.right);
        }
        throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");
      }
      h.e = function() {
        return this.xa.e();
      };
      h.count = function() {
        return this.xa.count();
      };
      h.Rc = function() {
        return this.xa.Rc();
      };
      h.fc = function() {
        return this.xa.fc();
      };
      h.ha = function(a) {
        return this.xa.ha(a);
      };
      h.Xb = function(a) {
        return new dc(this.xa, null, this.La, !1, a);
      };
      h.Yb = function(a, b) {
        return new dc(this.xa, a, this.La, !1, b);
      };
      h.$b = function(a, b) {
        return new dc(this.xa, a, this.La, !0, b);
      };
      h.of = function(a) {
        return new dc(this.xa, null, this.La, !0, a);
      };
      function dc(a, b, c, d, e) {
        this.Sd = e || null;
        this.Ee = d;
        this.Pa = [];
        for (e = 1; !a.e(); )
          if (e = b ? c(a.key, b) : 1, d && (e *= -1), 0 > e)
            a = this.Ee ? a.left : a.right;
          else if (0 === e) {
            this.Pa.push(a);
            break;
          } else
            this.Pa.push(a), a = this.Ee ? a.right : a.left;
      }
      function H(a) {
        if (0 === a.Pa.length)
          return null;
        var b = a.Pa.pop(),
            c;
        c = a.Sd ? a.Sd(b.key, b.value) : {
          key: b.key,
          value: b.value
        };
        if (a.Ee)
          for (b = b.left; !b.e(); )
            a.Pa.push(b), b = b.right;
        else
          for (b = b.right; !b.e(); )
            a.Pa.push(b), b = b.left;
        return c;
      }
      function ec(a) {
        if (0 === a.Pa.length)
          return null;
        var b;
        b = a.Pa;
        b = b[b.length - 1];
        return a.Sd ? a.Sd(b.key, b.value) : {
          key: b.key,
          value: b.value
        };
      }
      function fc(a, b, c, d, e) {
        this.key = a;
        this.value = b;
        this.color = null != c ? c : !0;
        this.left = null != d ? d : bc;
        this.right = null != e ? e : bc;
      }
      h = fc.prototype;
      h.X = function(a, b, c, d, e) {
        return new fc(null != a ? a : this.key, null != b ? b : this.value, null != c ? c : this.color, null != d ? d : this.left, null != e ? e : this.right);
      };
      h.count = function() {
        return this.left.count() + 1 + this.right.count();
      };
      h.e = function() {
        return !1;
      };
      h.ha = function(a) {
        return this.left.ha(a) || a(this.key, this.value) || this.right.ha(a);
      };
      function gc(a) {
        return a.left.e() ? a : gc(a.left);
      }
      h.Rc = function() {
        return gc(this).key;
      };
      h.fc = function() {
        return this.right.e() ? this.key : this.right.fc();
      };
      h.Na = function(a, b, c) {
        var d,
            e;
        e = this;
        d = c(a, e.key);
        e = 0 > d ? e.X(null, null, null, e.left.Na(a, b, c), null) : 0 === d ? e.X(null, b, null, null, null) : e.X(null, null, null, null, e.right.Na(a, b, c));
        return hc(e);
      };
      function ic(a) {
        if (a.left.e())
          return bc;
        a.left.fa() || a.left.left.fa() || (a = jc(a));
        a = a.X(null, null, null, ic(a.left), null);
        return hc(a);
      }
      h.remove = function(a, b) {
        var c,
            d;
        c = this;
        if (0 > b(a, c.key))
          c.left.e() || c.left.fa() || c.left.left.fa() || (c = jc(c)), c = c.X(null, null, null, c.left.remove(a, b), null);
        else {
          c.left.fa() && (c = kc(c));
          c.right.e() || c.right.fa() || c.right.left.fa() || (c = lc(c), c.left.left.fa() && (c = kc(c), c = lc(c)));
          if (0 === b(a, c.key)) {
            if (c.right.e())
              return bc;
            d = gc(c.right);
            c = c.X(d.key, d.value, null, null, ic(c.right));
          }
          c = c.X(null, null, null, null, c.right.remove(a, b));
        }
        return hc(c);
      };
      h.fa = function() {
        return this.color;
      };
      function hc(a) {
        a.right.fa() && !a.left.fa() && (a = mc(a));
        a.left.fa() && a.left.left.fa() && (a = kc(a));
        a.left.fa() && a.right.fa() && (a = lc(a));
        return a;
      }
      function jc(a) {
        a = lc(a);
        a.right.left.fa() && (a = a.X(null, null, null, null, kc(a.right)), a = mc(a), a = lc(a));
        return a;
      }
      function mc(a) {
        return a.right.X(null, null, a.color, a.X(null, null, !0, null, a.right.left), null);
      }
      function kc(a) {
        return a.left.X(null, null, a.color, null, a.X(null, null, !0, a.left.right, null));
      }
      function lc(a) {
        return a.X(null, null, !a.color, a.left.X(null, null, !a.left.color, null, null), a.right.X(null, null, !a.right.color, null, null));
      }
      function nc() {}
      h = nc.prototype;
      h.X = function() {
        return this;
      };
      h.Na = function(a, b) {
        return new fc(a, b, null);
      };
      h.remove = function() {
        return this;
      };
      h.count = function() {
        return 0;
      };
      h.e = function() {
        return !0;
      };
      h.ha = function() {
        return !1;
      };
      h.Rc = function() {
        return null;
      };
      h.fc = function() {
        return null;
      };
      h.fa = function() {
        return !1;
      };
      var bc = new nc;
      function oc(a, b) {
        return a && "object" === typeof a ? (J(".sv" in a, "Unexpected leaf node or priority contents"), b[a[".sv"]]) : a;
      }
      function pc(a, b) {
        var c = new qc;
        rc(a, new K(""), function(a, e) {
          c.mc(a, sc(e, b));
        });
        return c;
      }
      function sc(a, b) {
        var c = a.A().K(),
            c = oc(c, b),
            d;
        if (a.N()) {
          var e = oc(a.Ba(), b);
          return e !== a.Ba() || c !== a.A().K() ? new tc(e, L(c)) : a;
        }
        d = a;
        c !== a.A().K() && (d = d.da(new tc(c)));
        a.U(M, function(a, c) {
          var e = sc(c, b);
          e !== c && (d = d.Q(a, e));
        });
        return d;
      }
      ;
      function K(a, b) {
        if (1 == arguments.length) {
          this.o = a.split("/");
          for (var c = 0,
              d = 0; d < this.o.length; d++)
            0 < this.o[d].length && (this.o[c] = this.o[d], c++);
          this.o.length = c;
          this.Y = 0;
        } else
          this.o = a, this.Y = b;
      }
      function N(a, b) {
        var c = O(a);
        if (null === c)
          return b;
        if (c === O(b))
          return N(G(a), G(b));
        throw Error("INTERNAL ERROR: innerPath (" + b + ") is not within outerPath (" + a + ")");
      }
      function O(a) {
        return a.Y >= a.o.length ? null : a.o[a.Y];
      }
      function uc(a) {
        return a.o.length - a.Y;
      }
      function G(a) {
        var b = a.Y;
        b < a.o.length && b++;
        return new K(a.o, b);
      }
      function vc(a) {
        return a.Y < a.o.length ? a.o[a.o.length - 1] : null;
      }
      h = K.prototype;
      h.toString = function() {
        for (var a = "",
            b = this.Y; b < this.o.length; b++)
          "" !== this.o[b] && (a += "/" + this.o[b]);
        return a || "/";
      };
      h.slice = function(a) {
        return this.o.slice(this.Y + (a || 0));
      };
      h.parent = function() {
        if (this.Y >= this.o.length)
          return null;
        for (var a = [],
            b = this.Y; b < this.o.length - 1; b++)
          a.push(this.o[b]);
        return new K(a, 0);
      };
      h.w = function(a) {
        for (var b = [],
            c = this.Y; c < this.o.length; c++)
          b.push(this.o[c]);
        if (a instanceof K)
          for (c = a.Y; c < a.o.length; c++)
            b.push(a.o[c]);
        else
          for (a = a.split("/"), c = 0; c < a.length; c++)
            0 < a[c].length && b.push(a[c]);
        return new K(b, 0);
      };
      h.e = function() {
        return this.Y >= this.o.length;
      };
      h.Z = function(a) {
        if (uc(this) !== uc(a))
          return !1;
        for (var b = this.Y,
            c = a.Y; b <= this.o.length; b++, c++)
          if (this.o[b] !== a.o[c])
            return !1;
        return !0;
      };
      h.contains = function(a) {
        var b = this.Y,
            c = a.Y;
        if (uc(this) > uc(a))
          return !1;
        for (; b < this.o.length; ) {
          if (this.o[b] !== a.o[c])
            return !1;
          ++b;
          ++c;
        }
        return !0;
      };
      var F = new K("");
      function wc(a, b) {
        this.Qa = a.slice();
        this.Ea = Math.max(1, this.Qa.length);
        this.hf = b;
        for (var c = 0; c < this.Qa.length; c++)
          this.Ea += xc(this.Qa[c]);
        yc(this);
      }
      wc.prototype.push = function(a) {
        0 < this.Qa.length && (this.Ea += 1);
        this.Qa.push(a);
        this.Ea += xc(a);
        yc(this);
      };
      wc.prototype.pop = function() {
        var a = this.Qa.pop();
        this.Ea -= xc(a);
        0 < this.Qa.length && --this.Ea;
      };
      function yc(a) {
        if (768 < a.Ea)
          throw Error(a.hf + "has a key path longer than 768 bytes (" + a.Ea + ").");
        if (32 < a.Qa.length)
          throw Error(a.hf + "path specified exceeds the maximum depth that can be written (32) or object contains a cycle " + zc(a));
      }
      function zc(a) {
        return 0 == a.Qa.length ? "" : "in property '" + a.Qa.join(".") + "'";
      }
      ;
      function Ac() {
        this.wc = {};
      }
      Ac.prototype.set = function(a, b) {
        null == b ? delete this.wc[a] : this.wc[a] = b;
      };
      Ac.prototype.get = function(a) {
        return u(this.wc, a) ? this.wc[a] : null;
      };
      Ac.prototype.remove = function(a) {
        delete this.wc[a];
      };
      Ac.prototype.rf = !0;
      function Bc(a) {
        this.Ec = a;
        this.Od = "firebase:";
      }
      h = Bc.prototype;
      h.set = function(a, b) {
        null == b ? this.Ec.removeItem(this.Od + a) : this.Ec.setItem(this.Od + a, B(b));
      };
      h.get = function(a) {
        a = this.Ec.getItem(this.Od + a);
        return null == a ? null : mb(a);
      };
      h.remove = function(a) {
        this.Ec.removeItem(this.Od + a);
      };
      h.rf = !1;
      h.toString = function() {
        return this.Ec.toString();
      };
      function Cc(a) {
        try {
          if ("undefined" !== typeof window && "undefined" !== typeof window[a]) {
            var b = window[a];
            b.setItem("firebase:sentinel", "cache");
            b.removeItem("firebase:sentinel");
            return new Bc(b);
          }
        } catch (c) {}
        return new Ac;
      }
      var Dc = Cc("localStorage"),
          P = Cc("sessionStorage");
      function Ec(a, b, c, d, e) {
        this.host = a.toLowerCase();
        this.domain = this.host.substr(this.host.indexOf(".") + 1);
        this.lb = b;
        this.Bb = c;
        this.Qg = d;
        this.Nd = e || "";
        this.Oa = Dc.get("host:" + a) || this.host;
      }
      function Fc(a, b) {
        b !== a.Oa && (a.Oa = b, "s-" === a.Oa.substr(0, 2) && Dc.set("host:" + a.host, a.Oa));
      }
      Ec.prototype.toString = function() {
        var a = (this.lb ? "https://" : "http://") + this.host;
        this.Nd && (a += "<" + this.Nd + ">");
        return a;
      };
      var Gc = function() {
        var a = 1;
        return function() {
          return a++;
        };
      }();
      function J(a, b) {
        if (!a)
          throw Hc(b);
      }
      function Hc(a) {
        return Error("Firebase (2.2.3) INTERNAL ASSERT FAILED: " + a);
      }
      function Ic(a) {
        try {
          var b;
          if ("undefined" !== typeof atob)
            b = atob(a);
          else {
            gb();
            for (var c = eb,
                d = [],
                e = 0; e < a.length; ) {
              var f = c[a.charAt(e++)],
                  g = e < a.length ? c[a.charAt(e)] : 0;
              ++e;
              var k = e < a.length ? c[a.charAt(e)] : 64;
              ++e;
              var l = e < a.length ? c[a.charAt(e)] : 64;
              ++e;
              if (null == f || null == g || null == k || null == l)
                throw Error();
              d.push(f << 2 | g >> 4);
              64 != k && (d.push(g << 4 & 240 | k >> 2), 64 != l && d.push(k << 6 & 192 | l));
            }
            if (8192 > d.length)
              b = String.fromCharCode.apply(null, d);
            else {
              a = "";
              for (c = 0; c < d.length; c += 8192)
                a += String.fromCharCode.apply(null, Wa(d, c, c + 8192));
              b = a;
            }
          }
          return b;
        } catch (m) {
          Bb("base64Decode failed: ", m);
        }
        return null;
      }
      function Jc(a) {
        var b = Kc(a);
        a = new La;
        a.update(b);
        var b = [],
            c = 8 * a.ce;
        56 > a.ac ? a.update(a.Kd, 56 - a.ac) : a.update(a.Kd, a.Wa - (a.ac - 56));
        for (var d = a.Wa - 1; 56 <= d; d--)
          a.me[d] = c & 255, c /= 256;
        Ma(a, a.me);
        for (d = c = 0; 5 > d; d++)
          for (var e = 24; 0 <= e; e -= 8)
            b[c] = a.R[d] >> e & 255, ++c;
        return fb(b);
      }
      function Lc(a) {
        for (var b = "",
            c = 0; c < arguments.length; c++)
          b = fa(arguments[c]) ? b + Lc.apply(null, arguments[c]) : "object" === typeof arguments[c] ? b + B(arguments[c]) : b + arguments[c], b += " ";
        return b;
      }
      var Ab = null,
          Mc = !0;
      function Bb(a) {
        !0 === Mc && (Mc = !1, null === Ab && !0 === P.get("logging_enabled") && Nc(!0));
        if (Ab) {
          var b = Lc.apply(null, arguments);
          Ab(b);
        }
      }
      function Oc(a) {
        return function() {
          Bb(a, arguments);
        };
      }
      function Pc(a) {
        if ("undefined" !== typeof console) {
          var b = "FIREBASE INTERNAL ERROR: " + Lc.apply(null, arguments);
          "undefined" !== typeof console.error ? console.error(b) : console.log(b);
        }
      }
      function Qc(a) {
        var b = Lc.apply(null, arguments);
        throw Error("FIREBASE FATAL ERROR: " + b);
      }
      function Q(a) {
        if ("undefined" !== typeof console) {
          var b = "FIREBASE WARNING: " + Lc.apply(null, arguments);
          "undefined" !== typeof console.warn ? console.warn(b) : console.log(b);
        }
      }
      function Rc(a) {
        var b = "",
            c = "",
            d = "",
            e = "",
            f = !0,
            g = "https",
            k = 443;
        if (p(a)) {
          var l = a.indexOf("//");
          0 <= l && (g = a.substring(0, l - 1), a = a.substring(l + 2));
          l = a.indexOf("/");
          -1 === l && (l = a.length);
          b = a.substring(0, l);
          e = "";
          a = a.substring(l).split("/");
          for (l = 0; l < a.length; l++)
            if (0 < a[l].length) {
              var m = a[l];
              try {
                m = decodeURIComponent(m.replace(/\+/g, " "));
              } catch (v) {}
              e += "/" + m;
            }
          a = b.split(".");
          3 === a.length ? (c = a[1], d = a[0].toLowerCase()) : 2 === a.length && (c = a[0]);
          l = b.indexOf(":");
          0 <= l && (f = "https" === g || "wss" === g, k = b.substring(l + 1), isFinite(k) && (k = String(k)), k = p(k) ? /^\s*-?0x/i.test(k) ? parseInt(k, 16) : parseInt(k, 10) : NaN);
        }
        return {
          host: b,
          port: k,
          domain: c,
          Ng: d,
          lb: f,
          scheme: g,
          $c: e
        };
      }
      function Sc(a) {
        return ga(a) && (a != a || a == Number.POSITIVE_INFINITY || a == Number.NEGATIVE_INFINITY);
      }
      function Tc(a) {
        if ("complete" === document.readyState)
          a();
        else {
          var b = !1,
              c = function() {
                document.body ? b || (b = !0, a()) : setTimeout(c, Math.floor(10));
              };
          document.addEventListener ? (document.addEventListener("DOMContentLoaded", c, !1), window.addEventListener("load", c, !1)) : document.attachEvent && (document.attachEvent("onreadystatechange", function() {
            "complete" === document.readyState && c();
          }), window.attachEvent("onload", c));
        }
      }
      function Sb(a, b) {
        if (a === b)
          return 0;
        if ("[MIN_NAME]" === a || "[MAX_NAME]" === b)
          return -1;
        if ("[MIN_NAME]" === b || "[MAX_NAME]" === a)
          return 1;
        var c = Uc(a),
            d = Uc(b);
        return null !== c ? null !== d ? 0 == c - d ? a.length - b.length : c - d : -1 : null !== d ? 1 : a < b ? -1 : 1;
      }
      function Vc(a, b) {
        if (b && a in b)
          return b[a];
        throw Error("Missing required key (" + a + ") in object: " + B(b));
      }
      function Wc(a) {
        if ("object" !== typeof a || null === a)
          return B(a);
        var b = [],
            c;
        for (c in a)
          b.push(c);
        b.sort();
        c = "{";
        for (var d = 0; d < b.length; d++)
          0 !== d && (c += ","), c += B(b[d]), c += ":", c += Wc(a[b[d]]);
        return c + "}";
      }
      function Xc(a, b) {
        if (a.length <= b)
          return [a];
        for (var c = [],
            d = 0; d < a.length; d += b)
          d + b > a ? c.push(a.substring(d, a.length)) : c.push(a.substring(d, d + b));
        return c;
      }
      function Yc(a, b) {
        if (ea(a))
          for (var c = 0; c < a.length; ++c)
            b(c, a[c]);
        else
          r(a, b);
      }
      function Zc(a) {
        J(!Sc(a), "Invalid JSON number");
        var b,
            c,
            d,
            e;
        0 === a ? (d = c = 0, b = -Infinity === 1 / a ? 1 : 0) : (b = 0 > a, a = Math.abs(a), a >= Math.pow(2, -1022) ? (d = Math.min(Math.floor(Math.log(a) / Math.LN2), 1023), c = d + 1023, d = Math.round(a * Math.pow(2, 52 - d) - Math.pow(2, 52))) : (c = 0, d = Math.round(a / Math.pow(2, -1074))));
        e = [];
        for (a = 52; a; --a)
          e.push(d % 2 ? 1 : 0), d = Math.floor(d / 2);
        for (a = 11; a; --a)
          e.push(c % 2 ? 1 : 0), c = Math.floor(c / 2);
        e.push(b ? 1 : 0);
        e.reverse();
        b = e.join("");
        c = "";
        for (a = 0; 64 > a; a += 8)
          d = parseInt(b.substr(a, 8), 2).toString(16), 1 === d.length && (d = "0" + d), c += d;
        return c.toLowerCase();
      }
      var $c = /^-?\d{1,10}$/;
      function Uc(a) {
        return $c.test(a) && (a = Number(a), -2147483648 <= a && 2147483647 >= a) ? a : null;
      }
      function Cb(a) {
        try {
          a();
        } catch (b) {
          setTimeout(function() {
            Q("Exception was thrown by user callback.", b.stack || "");
            throw b;
          }, Math.floor(0));
        }
      }
      function R(a, b) {
        if (ha(a)) {
          var c = Array.prototype.slice.call(arguments, 1).slice();
          Cb(function() {
            a.apply(null, c);
          });
        }
      }
      ;
      function Kc(a) {
        for (var b = [],
            c = 0,
            d = 0; d < a.length; d++) {
          var e = a.charCodeAt(d);
          55296 <= e && 56319 >= e && (e -= 55296, d++, J(d < a.length, "Surrogate pair missing trail surrogate."), e = 65536 + (e << 10) + (a.charCodeAt(d) - 56320));
          128 > e ? b[c++] = e : (2048 > e ? b[c++] = e >> 6 | 192 : (65536 > e ? b[c++] = e >> 12 | 224 : (b[c++] = e >> 18 | 240, b[c++] = e >> 12 & 63 | 128), b[c++] = e >> 6 & 63 | 128), b[c++] = e & 63 | 128);
        }
        return b;
      }
      function xc(a) {
        for (var b = 0,
            c = 0; c < a.length; c++) {
          var d = a.charCodeAt(c);
          128 > d ? b++ : 2048 > d ? b += 2 : 55296 <= d && 56319 >= d ? (b += 4, c++) : b += 3;
        }
        return b;
      }
      ;
      function ad(a) {
        var b = {},
            c = {},
            d = {},
            e = "";
        try {
          var f = a.split("."),
              b = mb(Ic(f[0]) || ""),
              c = mb(Ic(f[1]) || ""),
              e = f[2],
              d = c.d || {};
          delete c.d;
        } catch (g) {}
        return {
          Tg: b,
          Ac: c,
          data: d,
          Kg: e
        };
      }
      function bd(a) {
        a = ad(a).Ac;
        return "object" === typeof a && a.hasOwnProperty("iat") ? w(a, "iat") : null;
      }
      function cd(a) {
        a = ad(a);
        var b = a.Ac;
        return !!a.Kg && !!b && "object" === typeof b && b.hasOwnProperty("iat");
      }
      ;
      function dd(a) {
        this.V = a;
        this.g = a.n.g;
      }
      function ed(a, b, c, d) {
        var e = [],
            f = [];
        Oa(b, function(b) {
          "child_changed" === b.type && a.g.zd(b.Je, b.Ja) && f.push(new D("child_moved", b.Ja, b.Ya));
        });
        fd(a, e, "child_removed", b, d, c);
        fd(a, e, "child_added", b, d, c);
        fd(a, e, "child_moved", f, d, c);
        fd(a, e, "child_changed", b, d, c);
        fd(a, e, Eb, b, d, c);
        return e;
      }
      function fd(a, b, c, d, e, f) {
        d = Pa(d, function(a) {
          return a.type === c;
        });
        Xa(d, q(a.bg, a));
        Oa(d, function(c) {
          var d = gd(a, c, f);
          Oa(e, function(e) {
            e.Gf(c.type) && b.push(e.createEvent(d, a.V));
          });
        });
      }
      function gd(a, b, c) {
        "value" !== b.type && "child_removed" !== b.type && (b.Pd = c.nf(b.Ya, b.Ja, a.g));
        return b;
      }
      dd.prototype.bg = function(a, b) {
        if (null == a.Ya || null == b.Ya)
          throw Hc("Should only compare child_ events.");
        return this.g.compare(new E(a.Ya, a.Ja), new E(b.Ya, b.Ja));
      };
      function hd() {
        this.eb = {};
      }
      function id(a, b) {
        var c = b.type,
            d = b.Ya;
        J("child_added" == c || "child_changed" == c || "child_removed" == c, "Only child changes supported for tracking");
        J(".priority" !== d, "Only non-priority child changes can be tracked.");
        var e = w(a.eb, d);
        if (e) {
          var f = e.type;
          if ("child_added" == c && "child_removed" == f)
            a.eb[d] = new D("child_changed", b.Ja, d, e.Ja);
          else if ("child_removed" == c && "child_added" == f)
            delete a.eb[d];
          else if ("child_removed" == c && "child_changed" == f)
            a.eb[d] = new D("child_removed", e.Je, d);
          else if ("child_changed" == c && "child_added" == f)
            a.eb[d] = new D("child_added", b.Ja, d);
          else if ("child_changed" == c && "child_changed" == f)
            a.eb[d] = new D("child_changed", b.Ja, d, e.Je);
          else
            throw Hc("Illegal combination of changes: " + b + " occurred after " + e);
        } else
          a.eb[d] = b;
      }
      ;
      function jd(a, b, c) {
        this.Pb = a;
        this.qb = b;
        this.sb = c || null;
      }
      h = jd.prototype;
      h.Gf = function(a) {
        return "value" === a;
      };
      h.createEvent = function(a, b) {
        var c = b.n.g;
        return new Fb("value", this, new S(a.Ja, b.lc(), c));
      };
      h.Ub = function(a) {
        var b = this.sb;
        if ("cancel" === a.ze()) {
          J(this.qb, "Raising a cancel event on a listener with no cancel callback");
          var c = this.qb;
          return function() {
            c.call(b, a.error);
          };
        }
        var d = this.Pb;
        return function() {
          d.call(b, a.Xd);
        };
      };
      h.df = function(a, b) {
        return this.qb ? new Gb(this, a, b) : null;
      };
      h.matches = function(a) {
        return a instanceof jd ? a.Pb && this.Pb ? a.Pb === this.Pb && a.sb === this.sb : !0 : !1;
      };
      h.pf = function() {
        return null !== this.Pb;
      };
      function kd(a, b, c) {
        this.ga = a;
        this.qb = b;
        this.sb = c;
      }
      h = kd.prototype;
      h.Gf = function(a) {
        a = "children_added" === a ? "child_added" : a;
        return ("children_removed" === a ? "child_removed" : a) in this.ga;
      };
      h.df = function(a, b) {
        return this.qb ? new Gb(this, a, b) : null;
      };
      h.createEvent = function(a, b) {
        J(null != a.Ya, "Child events should have a childName.");
        var c = b.lc().w(a.Ya);
        return new Fb(a.type, this, new S(a.Ja, c, b.n.g), a.Pd);
      };
      h.Ub = function(a) {
        var b = this.sb;
        if ("cancel" === a.ze()) {
          J(this.qb, "Raising a cancel event on a listener with no cancel callback");
          var c = this.qb;
          return function() {
            c.call(b, a.error);
          };
        }
        var d = this.ga[a.td];
        return function() {
          d.call(b, a.Xd, a.Pd);
        };
      };
      h.matches = function(a) {
        if (a instanceof kd) {
          if (!this.ga || !a.ga)
            return !0;
          if (this.sb === a.sb) {
            var b = pa(a.ga);
            if (b === pa(this.ga)) {
              if (1 === b) {
                var b = qa(a.ga),
                    c = qa(this.ga);
                return c === b && (!a.ga[b] || !this.ga[c] || a.ga[b] === this.ga[c]);
              }
              return oa(this.ga, function(b, c) {
                return a.ga[c] === b;
              });
            }
          }
        }
        return !1;
      };
      h.pf = function() {
        return null !== this.ga;
      };
      function ld(a) {
        this.g = a;
      }
      h = ld.prototype;
      h.G = function(a, b, c, d, e) {
        J(a.Ic(this.g), "A node must be indexed if only a child is updated");
        d = a.M(b);
        if (d.Z(c))
          return a;
        null != e && (c.e() ? a.Ha(b) ? id(e, new D("child_removed", d, b)) : J(a.N(), "A child remove without an old child only makes sense on a leaf node") : d.e() ? id(e, new D("child_added", c, b)) : id(e, new D("child_changed", c, b, d)));
        return a.N() && c.e() ? a : a.Q(b, c).mb(this.g);
      };
      h.ta = function(a, b, c) {
        null != c && (a.N() || a.U(M, function(a, e) {
          b.Ha(a) || id(c, new D("child_removed", e, a));
        }), b.N() || b.U(M, function(b, e) {
          if (a.Ha(b)) {
            var f = a.M(b);
            f.Z(e) || id(c, new D("child_changed", e, b, f));
          } else
            id(c, new D("child_added", e, b));
        }));
        return b.mb(this.g);
      };
      h.da = function(a, b) {
        return a.e() ? C : a.da(b);
      };
      h.Ga = function() {
        return !1;
      };
      h.Vb = function() {
        return this;
      };
      function md(a) {
        this.Be = new ld(a.g);
        this.g = a.g;
        var b;
        a.la ? (b = nd(a), b = a.g.Oc(od(a), b)) : b = a.g.Sc();
        this.fd = b;
        a.na ? (b = pd(a), a = a.g.Oc(qd(a), b)) : a = a.g.Pc();
        this.Fc = a;
      }
      h = md.prototype;
      h.matches = function(a) {
        return 0 >= this.g.compare(this.fd, a) && 0 >= this.g.compare(a, this.Fc);
      };
      h.G = function(a, b, c, d, e) {
        this.matches(new E(b, c)) || (c = C);
        return this.Be.G(a, b, c, d, e);
      };
      h.ta = function(a, b, c) {
        b.N() && (b = C);
        var d = b.mb(this.g),
            d = d.da(C),
            e = this;
        b.U(M, function(a, b) {
          e.matches(new E(a, b)) || (d = d.Q(a, C));
        });
        return this.Be.ta(a, d, c);
      };
      h.da = function(a) {
        return a;
      };
      h.Ga = function() {
        return !0;
      };
      h.Vb = function() {
        return this.Be;
      };
      function rd(a) {
        this.ra = new md(a);
        this.g = a.g;
        J(a.ia, "Only valid if limit has been set");
        this.ja = a.ja;
        this.Ib = !sd(a);
      }
      h = rd.prototype;
      h.G = function(a, b, c, d, e) {
        this.ra.matches(new E(b, c)) || (c = C);
        return a.M(b).Z(c) ? a : a.Cb() < this.ja ? this.ra.Vb().G(a, b, c, d, e) : td(this, a, b, c, d, e);
      };
      h.ta = function(a, b, c) {
        var d;
        if (b.N() || b.e())
          d = C.mb(this.g);
        else if (2 * this.ja < b.Cb() && b.Ic(this.g)) {
          d = C.mb(this.g);
          b = this.Ib ? b.$b(this.ra.Fc, this.g) : b.Yb(this.ra.fd, this.g);
          for (var e = 0; 0 < b.Pa.length && e < this.ja; ) {
            var f = H(b),
                g;
            if (g = this.Ib ? 0 >= this.g.compare(this.ra.fd, f) : 0 >= this.g.compare(f, this.ra.Fc))
              d = d.Q(f.name, f.S), e++;
            else
              break;
          }
        } else {
          d = b.mb(this.g);
          d = d.da(C);
          var k,
              l,
              m;
          if (this.Ib) {
            b = d.of(this.g);
            k = this.ra.Fc;
            l = this.ra.fd;
            var v = vd(this.g);
            m = function(a, b) {
              return v(b, a);
            };
          } else
            b = d.Xb(this.g), k = this.ra.fd, l = this.ra.Fc, m = vd(this.g);
          for (var e = 0,
              y = !1; 0 < b.Pa.length; )
            f = H(b), !y && 0 >= m(k, f) && (y = !0), (g = y && e < this.ja && 0 >= m(f, l)) ? e++ : d = d.Q(f.name, C);
        }
        return this.ra.Vb().ta(a, d, c);
      };
      h.da = function(a) {
        return a;
      };
      h.Ga = function() {
        return !0;
      };
      h.Vb = function() {
        return this.ra.Vb();
      };
      function td(a, b, c, d, e, f) {
        var g;
        if (a.Ib) {
          var k = vd(a.g);
          g = function(a, b) {
            return k(b, a);
          };
        } else
          g = vd(a.g);
        J(b.Cb() == a.ja, "");
        var l = new E(c, d),
            m = a.Ib ? wd(b, a.g) : xd(b, a.g),
            v = a.ra.matches(l);
        if (b.Ha(c)) {
          var y = b.M(c),
              m = e.ye(a.g, m, a.Ib);
          null != m && m.name == c && (m = e.ye(a.g, m, a.Ib));
          e = null == m ? 1 : g(m, l);
          if (v && !d.e() && 0 <= e)
            return null != f && id(f, new D("child_changed", d, c, y)), b.Q(c, d);
          null != f && id(f, new D("child_removed", y, c));
          b = b.Q(c, C);
          return null != m && a.ra.matches(m) ? (null != f && id(f, new D("child_added", m.S, m.name)), b.Q(m.name, m.S)) : b;
        }
        return d.e() ? b : v && 0 <= g(m, l) ? (null != f && (id(f, new D("child_removed", m.S, m.name)), id(f, new D("child_added", d, c))), b.Q(c, d).Q(m.name, C)) : b;
      }
      ;
      function yd(a, b) {
        this.ie = a;
        this.$f = b;
      }
      function zd(a) {
        this.I = a;
      }
      zd.prototype.bb = function(a, b, c, d) {
        var e = new hd,
            f;
        if (b.type === Vb)
          b.source.we ? c = Ad(this, a, b.path, b.Ia, c, d, e) : (J(b.source.lf, "Unknown source."), f = b.source.Ze, c = Bd(this, a, b.path, b.Ia, c, d, f, e));
        else if (b.type === Cd)
          b.source.we ? c = Dd(this, a, b.path, b.children, c, d, e) : (J(b.source.lf, "Unknown source."), f = b.source.Ze, c = Ed(this, a, b.path, b.children, c, d, f, e));
        else if (b.type === Xb)
          if (b.Te)
            if (f = b.path, null != c.sc(f))
              c = a;
            else {
              b = new qb(c, a, d);
              d = a.D.j();
              if (f.e() || ".priority" === O(f))
                Hb(a.u()) ? b = c.ua(tb(a)) : (b = a.u().j(), J(b instanceof T, "serverChildren would be complete if leaf node"), b = c.xc(b)), b = this.I.ta(d, b, e);
              else {
                f = O(f);
                var g = c.Xa(f, a.u());
                null == g && rb(a.u(), f) && (g = d.M(f));
                b = null != g ? this.I.G(d, f, g, b, e) : a.D.j().Ha(f) ? this.I.G(d, f, C, b, e) : d;
                b.e() && Hb(a.u()) && (d = c.ua(tb(a)), d.N() && (b = this.I.ta(b, d, e)));
              }
              d = Hb(a.u()) || null != c.sc(F);
              c = Fd(a, b, d, this.I.Ga());
            }
          else
            c = Gd(this, a, b.path, c, d, e);
        else if (b.type === $b)
          d = b.path, b = a.u(), f = b.j(), g = b.$ || d.e(), c = Hd(this, new Id(a.D, new sb(f, g, b.Tb)), d, c, pb, e);
        else
          throw Hc("Unknown operation type: " + b.type);
        e = ra(e.eb);
        d = c;
        b = d.D;
        b.$ && (f = b.j().N() || b.j().e(), g = Jd(a), (0 < e.length || !a.D.$ || f && !b.j().Z(g) || !b.j().A().Z(g.A())) && e.push(Db(Jd(d))));
        return new yd(c, e);
      };
      function Hd(a, b, c, d, e, f) {
        var g = b.D;
        if (null != d.sc(c))
          return b;
        var k;
        if (c.e())
          J(Hb(b.u()), "If change path is empty, we must have complete server data"), b.u().Tb ? (e = tb(b), d = d.xc(e instanceof T ? e : C)) : d = d.ua(tb(b)), f = a.I.ta(b.D.j(), d, f);
        else {
          var l = O(c);
          if (".priority" == l)
            J(1 == uc(c), "Can't have a priority with additional path components"), f = g.j(), k = b.u().j(), d = d.kd(c, f, k), f = null != d ? a.I.da(f, d) : g.j();
          else {
            var m = G(c);
            rb(g, l) ? (k = b.u().j(), d = d.kd(c, g.j(), k), d = null != d ? g.j().M(l).G(m, d) : g.j().M(l)) : d = d.Xa(l, b.u());
            f = null != d ? a.I.G(g.j(), l, d, e, f) : g.j();
          }
        }
        return Fd(b, f, g.$ || c.e(), a.I.Ga());
      }
      function Bd(a, b, c, d, e, f, g, k) {
        var l = b.u();
        g = g ? a.I : a.I.Vb();
        if (c.e())
          d = g.ta(l.j(), d, null);
        else if (g.Ga() && !l.Tb)
          d = l.j().G(c, d), d = g.ta(l.j(), d, null);
        else {
          var m = O(c);
          if ((c.e() ? !l.$ || l.Tb : !rb(l, O(c))) && 1 < uc(c))
            return b;
          d = l.j().M(m).G(G(c), d);
          d = ".priority" == m ? g.da(l.j(), d) : g.G(l.j(), m, d, pb, null);
        }
        l = l.$ || c.e();
        b = new Id(b.D, new sb(d, l, g.Ga()));
        return Hd(a, b, c, e, new qb(e, b, f), k);
      }
      function Ad(a, b, c, d, e, f, g) {
        var k = b.D;
        e = new qb(e, b, f);
        if (c.e())
          g = a.I.ta(b.D.j(), d, g), a = Fd(b, g, !0, a.I.Ga());
        else if (f = O(c), ".priority" === f)
          g = a.I.da(b.D.j(), d), a = Fd(b, g, k.$, k.Tb);
        else {
          var l = G(c);
          c = k.j().M(f);
          if (!l.e()) {
            var m = e.mf(f);
            d = null != m ? ".priority" === vc(l) && m.oa(l.parent()).e() ? m : m.G(l, d) : C;
          }
          c.Z(d) ? a = b : (g = a.I.G(k.j(), f, d, e, g), a = Fd(b, g, k.$, a.I.Ga()));
        }
        return a;
      }
      function Dd(a, b, c, d, e, f, g) {
        var k = b;
        Kd(d, function(d, m) {
          var v = c.w(d);
          rb(b.D, O(v)) && (k = Ad(a, k, v, m, e, f, g));
        });
        Kd(d, function(d, m) {
          var v = c.w(d);
          rb(b.D, O(v)) || (k = Ad(a, k, v, m, e, f, g));
        });
        return k;
      }
      function Ld(a, b) {
        Kd(b, function(b, d) {
          a = a.G(b, d);
        });
        return a;
      }
      function Ed(a, b, c, d, e, f, g, k) {
        if (b.u().j().e() && !Hb(b.u()))
          return b;
        var l = b;
        c = c.e() ? d : Md(Nd, c, d);
        var m = b.u().j();
        c.children.ha(function(c, d) {
          if (m.Ha(c)) {
            var I = b.u().j().M(c),
                I = Ld(I, d);
            l = Bd(a, l, new K(c), I, e, f, g, k);
          }
        });
        c.children.ha(function(c, d) {
          var I = !Hb(b.u()) && null == d.value;
          m.Ha(c) || I || (I = b.u().j().M(c), I = Ld(I, d), l = Bd(a, l, new K(c), I, e, f, g, k));
        });
        return l;
      }
      function Gd(a, b, c, d, e, f) {
        if (null != d.sc(c))
          return b;
        var g = new qb(d, b, e),
            k = e = b.D.j();
        if (Hb(b.u())) {
          if (c.e())
            e = d.ua(tb(b)), k = a.I.ta(b.D.j(), e, f);
          else if (".priority" === O(c)) {
            var l = d.Xa(O(c), b.u());
            null == l || e.e() || e.A().Z(l) || (k = a.I.da(e, l));
          } else
            l = O(c), e = d.Xa(l, b.u()), null != e && (k = a.I.G(b.D.j(), l, e, g, f));
          e = !0;
        } else if (b.D.$ || c.e())
          k = e, e = b.D.j(), e.N() || e.U(M, function(c) {
            var e = d.Xa(c, b.u());
            null != e && (k = a.I.G(k, c, e, g, f));
          }), e = b.D.$;
        else {
          l = O(c);
          if (1 == uc(c) || rb(b.D, l))
            c = d.Xa(l, b.u()), null != c && (k = a.I.G(e, l, c, g, f));
          e = !1;
        }
        return Fd(b, k, e, a.I.Ga());
      }
      ;
      function Od() {}
      var Pd = {};
      function vd(a) {
        return q(a.compare, a);
      }
      Od.prototype.zd = function(a, b) {
        return 0 !== this.compare(new E("[MIN_NAME]", a), new E("[MIN_NAME]", b));
      };
      Od.prototype.Sc = function() {
        return Qd;
      };
      function Rd(a) {
        this.cc = a;
      }
      ma(Rd, Od);
      h = Rd.prototype;
      h.Hc = function(a) {
        return !a.M(this.cc).e();
      };
      h.compare = function(a, b) {
        var c = a.S.M(this.cc),
            d = b.S.M(this.cc),
            c = c.Cc(d);
        return 0 === c ? Sb(a.name, b.name) : c;
      };
      h.Oc = function(a, b) {
        var c = L(a),
            c = C.Q(this.cc, c);
        return new E(b, c);
      };
      h.Pc = function() {
        var a = C.Q(this.cc, Sd);
        return new E("[MAX_NAME]", a);
      };
      h.toString = function() {
        return this.cc;
      };
      function Td() {}
      ma(Td, Od);
      h = Td.prototype;
      h.compare = function(a, b) {
        var c = a.S.A(),
            d = b.S.A(),
            c = c.Cc(d);
        return 0 === c ? Sb(a.name, b.name) : c;
      };
      h.Hc = function(a) {
        return !a.A().e();
      };
      h.zd = function(a, b) {
        return !a.A().Z(b.A());
      };
      h.Sc = function() {
        return Qd;
      };
      h.Pc = function() {
        return new E("[MAX_NAME]", new tc("[PRIORITY-POST]", Sd));
      };
      h.Oc = function(a, b) {
        var c = L(a);
        return new E(b, new tc("[PRIORITY-POST]", c));
      };
      h.toString = function() {
        return ".priority";
      };
      var M = new Td;
      function Ud() {}
      ma(Ud, Od);
      h = Ud.prototype;
      h.compare = function(a, b) {
        return Sb(a.name, b.name);
      };
      h.Hc = function() {
        throw Hc("KeyIndex.isDefinedOn not expected to be called.");
      };
      h.zd = function() {
        return !1;
      };
      h.Sc = function() {
        return Qd;
      };
      h.Pc = function() {
        return new E("[MAX_NAME]", C);
      };
      h.Oc = function(a) {
        J(p(a), "KeyIndex indexValue must always be a string.");
        return new E(a, C);
      };
      h.toString = function() {
        return ".key";
      };
      var Vd = new Ud;
      function Wd() {}
      ma(Wd, Od);
      h = Wd.prototype;
      h.compare = function(a, b) {
        var c = a.S.Cc(b.S);
        return 0 === c ? Sb(a.name, b.name) : c;
      };
      h.Hc = function() {
        return !0;
      };
      h.zd = function(a, b) {
        return !a.Z(b);
      };
      h.Sc = function() {
        return Qd;
      };
      h.Pc = function() {
        return Xd;
      };
      h.Oc = function(a, b) {
        var c = L(a);
        return new E(b, c);
      };
      h.toString = function() {
        return ".value";
      };
      var Yd = new Wd;
      function Zd() {
        this.Rb = this.na = this.Lb = this.la = this.ia = !1;
        this.ja = 0;
        this.Nb = "";
        this.ec = null;
        this.wb = "";
        this.bc = null;
        this.ub = "";
        this.g = M;
      }
      var $d = new Zd;
      function sd(a) {
        return "" === a.Nb ? a.la : "l" === a.Nb;
      }
      function od(a) {
        J(a.la, "Only valid if start has been set");
        return a.ec;
      }
      function nd(a) {
        J(a.la, "Only valid if start has been set");
        return a.Lb ? a.wb : "[MIN_NAME]";
      }
      function qd(a) {
        J(a.na, "Only valid if end has been set");
        return a.bc;
      }
      function pd(a) {
        J(a.na, "Only valid if end has been set");
        return a.Rb ? a.ub : "[MAX_NAME]";
      }
      function ae(a) {
        var b = new Zd;
        b.ia = a.ia;
        b.ja = a.ja;
        b.la = a.la;
        b.ec = a.ec;
        b.Lb = a.Lb;
        b.wb = a.wb;
        b.na = a.na;
        b.bc = a.bc;
        b.Rb = a.Rb;
        b.ub = a.ub;
        b.g = a.g;
        return b;
      }
      h = Zd.prototype;
      h.Ge = function(a) {
        var b = ae(this);
        b.ia = !0;
        b.ja = a;
        b.Nb = "";
        return b;
      };
      h.He = function(a) {
        var b = ae(this);
        b.ia = !0;
        b.ja = a;
        b.Nb = "l";
        return b;
      };
      h.Ie = function(a) {
        var b = ae(this);
        b.ia = !0;
        b.ja = a;
        b.Nb = "r";
        return b;
      };
      h.Yd = function(a, b) {
        var c = ae(this);
        c.la = !0;
        n(a) || (a = null);
        c.ec = a;
        null != b ? (c.Lb = !0, c.wb = b) : (c.Lb = !1, c.wb = "");
        return c;
      };
      h.sd = function(a, b) {
        var c = ae(this);
        c.na = !0;
        n(a) || (a = null);
        c.bc = a;
        n(b) ? (c.Rb = !0, c.ub = b) : (c.Vg = !1, c.ub = "");
        return c;
      };
      function be(a, b) {
        var c = ae(a);
        c.g = b;
        return c;
      }
      function ce(a) {
        var b = {};
        a.la && (b.sp = a.ec, a.Lb && (b.sn = a.wb));
        a.na && (b.ep = a.bc, a.Rb && (b.en = a.ub));
        if (a.ia) {
          b.l = a.ja;
          var c = a.Nb;
          "" === c && (c = sd(a) ? "l" : "r");
          b.vf = c;
        }
        a.g !== M && (b.i = a.g.toString());
        return b;
      }
      function de(a) {
        return !(a.la || a.na || a.ia);
      }
      function ee(a) {
        var b = {};
        if (de(a) && a.g == M)
          return b;
        var c;
        a.g === M ? c = "$priority" : a.g === Yd ? c = "$value" : (J(a.g instanceof Rd, "Unrecognized index type!"), c = a.g.toString());
        b.orderBy = B(c);
        a.la && (b.startAt = B(a.ec), a.Lb && (b.startAt += "," + B(a.wb)));
        a.na && (b.endAt = B(a.bc), a.Rb && (b.endAt += "," + B(a.ub)));
        a.ia && (sd(a) ? b.limitToFirst = a.ja : b.limitToLast = a.ja);
        return b;
      }
      h.toString = function() {
        return B(ce(this));
      };
      function fe(a, b) {
        this.Ad = a;
        this.dc = b;
      }
      fe.prototype.get = function(a) {
        var b = w(this.Ad, a);
        if (!b)
          throw Error("No index defined for " + a);
        return b === Pd ? null : b;
      };
      function ge(a, b, c) {
        var d = na(a.Ad, function(d, f) {
          var g = w(a.dc, f);
          J(g, "Missing index implementation for " + f);
          if (d === Pd) {
            if (g.Hc(b.S)) {
              for (var k = [],
                  l = c.Xb(Qb),
                  m = H(l); m; )
                m.name != b.name && k.push(m), m = H(l);
              k.push(b);
              return he(k, vd(g));
            }
            return Pd;
          }
          g = c.get(b.name);
          k = d;
          g && (k = k.remove(new E(b.name, g)));
          return k.Na(b, b.S);
        });
        return new fe(d, a.dc);
      }
      function ie(a, b, c) {
        var d = na(a.Ad, function(a) {
          if (a === Pd)
            return a;
          var d = c.get(b.name);
          return d ? a.remove(new E(b.name, d)) : a;
        });
        return new fe(d, a.dc);
      }
      var je = new fe({".priority": Pd}, {".priority": M});
      function tc(a, b) {
        this.C = a;
        J(n(this.C) && null !== this.C, "LeafNode shouldn't be created with null/undefined value.");
        this.ba = b || C;
        ke(this.ba);
        this.Ab = null;
      }
      h = tc.prototype;
      h.N = function() {
        return !0;
      };
      h.A = function() {
        return this.ba;
      };
      h.da = function(a) {
        return new tc(this.C, a);
      };
      h.M = function(a) {
        return ".priority" === a ? this.ba : C;
      };
      h.oa = function(a) {
        return a.e() ? this : ".priority" === O(a) ? this.ba : C;
      };
      h.Ha = function() {
        return !1;
      };
      h.nf = function() {
        return null;
      };
      h.Q = function(a, b) {
        return ".priority" === a ? this.da(b) : b.e() && ".priority" !== a ? this : C.Q(a, b).da(this.ba);
      };
      h.G = function(a, b) {
        var c = O(a);
        if (null === c)
          return b;
        if (b.e() && ".priority" !== c)
          return this;
        J(".priority" !== c || 1 === uc(a), ".priority must be the last token in a path");
        return this.Q(c, C.G(G(a), b));
      };
      h.e = function() {
        return !1;
      };
      h.Cb = function() {
        return 0;
      };
      h.K = function(a) {
        return a && !this.A().e() ? {
          ".value": this.Ba(),
          ".priority": this.A().K()
        } : this.Ba();
      };
      h.hash = function() {
        if (null === this.Ab) {
          var a = "";
          this.ba.e() || (a += "priority:" + le(this.ba.K()) + ":");
          var b = typeof this.C,
              a = a + (b + ":"),
              a = "number" === b ? a + Zc(this.C) : a + this.C;
          this.Ab = Jc(a);
        }
        return this.Ab;
      };
      h.Ba = function() {
        return this.C;
      };
      h.Cc = function(a) {
        if (a === C)
          return 1;
        if (a instanceof T)
          return -1;
        J(a.N(), "Unknown node type");
        var b = typeof a.C,
            c = typeof this.C,
            d = Na(me, b),
            e = Na(me, c);
        J(0 <= d, "Unknown leaf type: " + b);
        J(0 <= e, "Unknown leaf type: " + c);
        return d === e ? "object" === c ? 0 : this.C < a.C ? -1 : this.C === a.C ? 0 : 1 : e - d;
      };
      var me = ["object", "boolean", "number", "string"];
      tc.prototype.mb = function() {
        return this;
      };
      tc.prototype.Ic = function() {
        return !0;
      };
      tc.prototype.Z = function(a) {
        return a === this ? !0 : a.N() ? this.C === a.C && this.ba.Z(a.ba) : !1;
      };
      tc.prototype.toString = function() {
        return B(this.K(!0));
      };
      function T(a, b, c) {
        this.m = a;
        (this.ba = b) && ke(this.ba);
        a.e() && J(!this.ba || this.ba.e(), "An empty node cannot have a priority");
        this.vb = c;
        this.Ab = null;
      }
      h = T.prototype;
      h.N = function() {
        return !1;
      };
      h.A = function() {
        return this.ba || C;
      };
      h.da = function(a) {
        return this.m.e() ? this : new T(this.m, a, this.vb);
      };
      h.M = function(a) {
        if (".priority" === a)
          return this.A();
        a = this.m.get(a);
        return null === a ? C : a;
      };
      h.oa = function(a) {
        var b = O(a);
        return null === b ? this : this.M(b).oa(G(a));
      };
      h.Ha = function(a) {
        return null !== this.m.get(a);
      };
      h.Q = function(a, b) {
        J(b, "We should always be passing snapshot nodes");
        if (".priority" === a)
          return this.da(b);
        var c = new E(a, b),
            d,
            e;
        b.e() ? (d = this.m.remove(a), c = ie(this.vb, c, this.m)) : (d = this.m.Na(a, b), c = ge(this.vb, c, this.m));
        e = d.e() ? C : this.ba;
        return new T(d, e, c);
      };
      h.G = function(a, b) {
        var c = O(a);
        if (null === c)
          return b;
        J(".priority" !== O(a) || 1 === uc(a), ".priority must be the last token in a path");
        var d = this.M(c).G(G(a), b);
        return this.Q(c, d);
      };
      h.e = function() {
        return this.m.e();
      };
      h.Cb = function() {
        return this.m.count();
      };
      var ne = /^(0|[1-9]\d*)$/;
      h = T.prototype;
      h.K = function(a) {
        if (this.e())
          return null;
        var b = {},
            c = 0,
            d = 0,
            e = !0;
        this.U(M, function(f, g) {
          b[f] = g.K(a);
          c++;
          e && ne.test(f) ? d = Math.max(d, Number(f)) : e = !1;
        });
        if (!a && e && d < 2 * c) {
          var f = [],
              g;
          for (g in b)
            f[g] = b[g];
          return f;
        }
        a && !this.A().e() && (b[".priority"] = this.A().K());
        return b;
      };
      h.hash = function() {
        if (null === this.Ab) {
          var a = "";
          this.A().e() || (a += "priority:" + le(this.A().K()) + ":");
          this.U(M, function(b, c) {
            var d = c.hash();
            "" !== d && (a += ":" + b + ":" + d);
          });
          this.Ab = "" === a ? "" : Jc(a);
        }
        return this.Ab;
      };
      h.nf = function(a, b, c) {
        return (c = oe(this, c)) ? (a = cc(c, new E(a, b))) ? a.name : null : cc(this.m, a);
      };
      function wd(a, b) {
        var c;
        c = (c = oe(a, b)) ? (c = c.Rc()) && c.name : a.m.Rc();
        return c ? new E(c, a.m.get(c)) : null;
      }
      function xd(a, b) {
        var c;
        c = (c = oe(a, b)) ? (c = c.fc()) && c.name : a.m.fc();
        return c ? new E(c, a.m.get(c)) : null;
      }
      h.U = function(a, b) {
        var c = oe(this, a);
        return c ? c.ha(function(a) {
          return b(a.name, a.S);
        }) : this.m.ha(b);
      };
      h.Xb = function(a) {
        return this.Yb(a.Sc(), a);
      };
      h.Yb = function(a, b) {
        var c = oe(this, b);
        if (c)
          return c.Yb(a, function(a) {
            return a;
          });
        for (var c = this.m.Yb(a.name, Qb),
            d = ec(c); null != d && 0 > b.compare(d, a); )
          H(c), d = ec(c);
        return c;
      };
      h.of = function(a) {
        return this.$b(a.Pc(), a);
      };
      h.$b = function(a, b) {
        var c = oe(this, b);
        if (c)
          return c.$b(a, function(a) {
            return a;
          });
        for (var c = this.m.$b(a.name, Qb),
            d = ec(c); null != d && 0 < b.compare(d, a); )
          H(c), d = ec(c);
        return c;
      };
      h.Cc = function(a) {
        return this.e() ? a.e() ? 0 : -1 : a.N() || a.e() ? 1 : a === Sd ? -1 : 0;
      };
      h.mb = function(a) {
        if (a === Vd || ta(this.vb.dc, a.toString()))
          return this;
        var b = this.vb,
            c = this.m;
        J(a !== Vd, "KeyIndex always exists and isn't meant to be added to the IndexMap.");
        for (var d = [],
            e = !1,
            c = c.Xb(Qb),
            f = H(c); f; )
          e = e || a.Hc(f.S), d.push(f), f = H(c);
        d = e ? he(d, vd(a)) : Pd;
        e = a.toString();
        c = xa(b.dc);
        c[e] = a;
        a = xa(b.Ad);
        a[e] = d;
        return new T(this.m, this.ba, new fe(a, c));
      };
      h.Ic = function(a) {
        return a === Vd || ta(this.vb.dc, a.toString());
      };
      h.Z = function(a) {
        if (a === this)
          return !0;
        if (a.N())
          return !1;
        if (this.A().Z(a.A()) && this.m.count() === a.m.count()) {
          var b = this.Xb(M);
          a = a.Xb(M);
          for (var c = H(b),
              d = H(a); c && d; ) {
            if (c.name !== d.name || !c.S.Z(d.S))
              return !1;
            c = H(b);
            d = H(a);
          }
          return null === c && null === d;
        }
        return !1;
      };
      function oe(a, b) {
        return b === Vd ? null : a.vb.get(b.toString());
      }
      h.toString = function() {
        return B(this.K(!0));
      };
      function L(a, b) {
        if (null === a)
          return C;
        var c = null;
        "object" === typeof a && ".priority" in a ? c = a[".priority"] : "undefined" !== typeof b && (c = b);
        J(null === c || "string" === typeof c || "number" === typeof c || "object" === typeof c && ".sv" in c, "Invalid priority type found: " + typeof c);
        "object" === typeof a && ".value" in a && null !== a[".value"] && (a = a[".value"]);
        if ("object" !== typeof a || ".sv" in a)
          return new tc(a, L(c));
        if (a instanceof Array) {
          var d = C,
              e = a;
          r(e, function(a, b) {
            if (u(e, b) && "." !== b.substring(0, 1)) {
              var c = L(a);
              if (c.N() || !c.e())
                d = d.Q(b, c);
            }
          });
          return d.da(L(c));
        }
        var f = [],
            g = !1,
            k = a;
        hb(k, function(a) {
          if ("string" !== typeof a || "." !== a.substring(0, 1)) {
            var b = L(k[a]);
            b.e() || (g = g || !b.A().e(), f.push(new E(a, b)));
          }
        });
        if (0 == f.length)
          return C;
        var l = he(f, Rb, function(a) {
          return a.name;
        }, Tb);
        if (g) {
          var m = he(f, vd(M));
          return new T(l, L(c), new fe({".priority": m}, {".priority": M}));
        }
        return new T(l, L(c), je);
      }
      var pe = Math.log(2);
      function qe(a) {
        this.count = parseInt(Math.log(a + 1) / pe, 10);
        this.ff = this.count - 1;
        this.Zf = a + 1 & parseInt(Array(this.count + 1).join("1"), 2);
      }
      function re(a) {
        var b = !(a.Zf & 1 << a.ff);
        a.ff--;
        return b;
      }
      function he(a, b, c, d) {
        function e(b, d) {
          var f = d - b;
          if (0 == f)
            return null;
          if (1 == f) {
            var m = a[b],
                v = c ? c(m) : m;
            return new fc(v, m.S, !1, null, null);
          }
          var m = parseInt(f / 2, 10) + b,
              f = e(b, m),
              y = e(m + 1, d),
              m = a[m],
              v = c ? c(m) : m;
          return new fc(v, m.S, !1, f, y);
        }
        a.sort(b);
        var f = function(b) {
          function d(b, g) {
            var k = v - b,
                y = v;
            v -= b;
            var y = e(k + 1, y),
                k = a[k],
                I = c ? c(k) : k,
                y = new fc(I, k.S, g, null, y);
            f ? f.left = y : m = y;
            f = y;
          }
          for (var f = null,
              m = null,
              v = a.length,
              y = 0; y < b.count; ++y) {
            var I = re(b),
                ud = Math.pow(2, b.count - (y + 1));
            I ? d(ud, !1) : (d(ud, !1), d(ud, !0));
          }
          return m;
        }(new qe(a.length));
        return null !== f ? new ac(d || b, f) : new ac(d || b);
      }
      function le(a) {
        return "number" === typeof a ? "number:" + Zc(a) : "string:" + a;
      }
      function ke(a) {
        if (a.N()) {
          var b = a.K();
          J("string" === typeof b || "number" === typeof b || "object" === typeof b && u(b, ".sv"), "Priority must be a string or number.");
        } else
          J(a === Sd || a.e(), "priority of unexpected type.");
        J(a === Sd || a.A().e(), "Priority nodes can't have a priority of their own.");
      }
      var C = new T(new ac(Tb), null, je);
      function se() {
        T.call(this, new ac(Tb), C, je);
      }
      ma(se, T);
      h = se.prototype;
      h.Cc = function(a) {
        return a === this ? 0 : 1;
      };
      h.Z = function(a) {
        return a === this;
      };
      h.A = function() {
        return this;
      };
      h.M = function() {
        return C;
      };
      h.e = function() {
        return !1;
      };
      var Sd = new se,
          Qd = new E("[MIN_NAME]", C),
          Xd = new E("[MAX_NAME]", Sd);
      function Id(a, b) {
        this.D = a;
        this.Vd = b;
      }
      function Fd(a, b, c, d) {
        return new Id(new sb(b, c, d), a.Vd);
      }
      function Jd(a) {
        return a.D.$ ? a.D.j() : null;
      }
      Id.prototype.u = function() {
        return this.Vd;
      };
      function tb(a) {
        return a.Vd.$ ? a.Vd.j() : null;
      }
      ;
      function te(a, b) {
        this.V = a;
        var c = a.n,
            d = new ld(c.g),
            c = de(c) ? new ld(c.g) : c.ia ? new rd(c) : new md(c);
        this.Cf = new zd(c);
        var e = b.u(),
            f = b.D,
            g = d.ta(C, e.j(), null),
            k = c.ta(C, f.j(), null);
        this.Ka = new Id(new sb(k, f.$, c.Ga()), new sb(g, e.$, d.Ga()));
        this.Za = [];
        this.fg = new dd(a);
      }
      function ue(a) {
        return a.V;
      }
      h = te.prototype;
      h.u = function() {
        return this.Ka.u().j();
      };
      h.hb = function(a) {
        var b = tb(this.Ka);
        return b && (de(this.V.n) || !a.e() && !b.M(O(a)).e()) ? b.oa(a) : null;
      };
      h.e = function() {
        return 0 === this.Za.length;
      };
      h.Ob = function(a) {
        this.Za.push(a);
      };
      h.kb = function(a, b) {
        var c = [];
        if (b) {
          J(null == a, "A cancel should cancel all event registrations.");
          var d = this.V.path;
          Oa(this.Za, function(a) {
            (a = a.df(b, d)) && c.push(a);
          });
        }
        if (a) {
          for (var e = [],
              f = 0; f < this.Za.length; ++f) {
            var g = this.Za[f];
            if (!g.matches(a))
              e.push(g);
            else if (a.pf()) {
              e = e.concat(this.Za.slice(f + 1));
              break;
            }
          }
          this.Za = e;
        } else
          this.Za = [];
        return c;
      };
      h.bb = function(a, b, c) {
        a.type === Cd && null !== a.source.Hb && (J(tb(this.Ka), "We should always have a full cache before handling merges"), J(Jd(this.Ka), "Missing event cache, even though we have a server cache"));
        var d = this.Ka;
        a = this.Cf.bb(d, a, b, c);
        b = this.Cf;
        c = a.ie;
        J(c.D.j().Ic(b.I.g), "Event snap not indexed");
        J(c.u().j().Ic(b.I.g), "Server snap not indexed");
        J(Hb(a.ie.u()) || !Hb(d.u()), "Once a server snap is complete, it should never go back");
        this.Ka = a.ie;
        return ve(this, a.$f, a.ie.D.j(), null);
      };
      function we(a, b) {
        var c = a.Ka.D,
            d = [];
        c.j().N() || c.j().U(M, function(a, b) {
          d.push(new D("child_added", b, a));
        });
        c.$ && d.push(Db(c.j()));
        return ve(a, d, c.j(), b);
      }
      function ve(a, b, c, d) {
        return ed(a.fg, b, c, d ? [d] : a.Za);
      }
      ;
      function xe(a, b, c) {
        this.type = Cd;
        this.source = a;
        this.path = b;
        this.children = c;
      }
      xe.prototype.Xc = function(a) {
        if (this.path.e())
          return a = this.children.subtree(new K(a)), a.e() ? null : a.value ? new Ub(this.source, F, a.value) : new xe(this.source, F, a);
        J(O(this.path) === a, "Can't get a merge for a child not on the path of the operation");
        return new xe(this.source, G(this.path), this.children);
      };
      xe.prototype.toString = function() {
        return "Operation(" + this.path + ": " + this.source.toString() + " merge: " + this.children.toString() + ")";
      };
      var Vb = 0,
          Cd = 1,
          Xb = 2,
          $b = 3;
      function ye(a, b, c, d) {
        this.we = a;
        this.lf = b;
        this.Hb = c;
        this.Ze = d;
        J(!d || b, "Tagged queries must be from server.");
      }
      var Yb = new ye(!0, !1, null, !1),
          ze = new ye(!1, !0, null, !1);
      ye.prototype.toString = function() {
        return this.we ? "user" : this.Ze ? "server(queryID=" + this.Hb + ")" : "server";
      };
      function Ae(a, b) {
        this.f = Oc("p:rest:");
        this.H = a;
        this.Fb = b;
        this.Fa = null;
        this.aa = {};
      }
      function Be(a, b) {
        if (n(b))
          return "tag$" + b;
        var c = a.n;
        J(de(c) && c.g == M, "should have a tag if it's not a default query.");
        return a.path.toString();
      }
      h = Ae.prototype;
      h.sf = function(a, b, c, d) {
        var e = a.path.toString();
        this.f("Listen called for " + e + " " + a.wa());
        var f = Be(a, c),
            g = {};
        this.aa[f] = g;
        a = ee(a.n);
        var k = this;
        Ce(this, e + ".json", a, function(a, b) {
          var v = b;
          404 === a && (a = v = null);
          null === a && k.Fb(e, v, !1, c);
          w(k.aa, f) === g && d(a ? 401 == a ? "permission_denied" : "rest_error:" + a : "ok", null);
        });
      };
      h.Lf = function(a, b) {
        var c = Be(a, b);
        delete this.aa[c];
      };
      h.P = function(a, b) {
        this.Fa = a;
        var c = ad(a),
            d = c.data,
            c = c.Ac && c.Ac.exp;
        b && b("ok", {
          auth: d,
          expires: c
        });
      };
      h.fe = function(a) {
        this.Fa = null;
        a("ok", null);
      };
      h.Le = function() {};
      h.xf = function() {};
      h.Id = function() {};
      h.put = function() {};
      h.tf = function() {};
      h.Df = function() {};
      function Ce(a, b, c, d) {
        c = c || {};
        c.format = "export";
        a.Fa && (c.auth = a.Fa);
        var e = (a.H.lb ? "https://" : "http://") + a.H.host + b + "?" + jb(c);
        a.f("Sending REST request for " + e);
        var f = new XMLHttpRequest;
        f.onreadystatechange = function() {
          if (d && 4 === f.readyState) {
            a.f("REST Response for " + e + " received. status:", f.status, "response:", f.responseText);
            var b = null;
            if (200 <= f.status && 300 > f.status) {
              try {
                b = mb(f.responseText);
              } catch (c) {
                Q("Failed to parse JSON response for " + e + ": " + f.responseText);
              }
              d(null, b);
            } else
              401 !== f.status && 404 !== f.status && Q("Got unsuccessful REST response for " + e + " Status: " + f.status), d(f.status);
            d = null;
          }
        };
        f.open("GET", e, !0);
        f.send();
      }
      ;
      function De(a, b) {
        this.value = a;
        this.children = b || Ee;
      }
      var Ee = new ac(function(a, b) {
        return a === b ? 0 : a < b ? -1 : 1;
      });
      function Fe(a) {
        var b = Nd;
        r(a, function(a, d) {
          b = b.set(new K(d), a);
        });
        return b;
      }
      h = De.prototype;
      h.e = function() {
        return null === this.value && this.children.e();
      };
      function Ge(a, b, c) {
        if (null != a.value && c(a.value))
          return {
            path: F,
            value: a.value
          };
        if (b.e())
          return null;
        var d = O(b);
        a = a.children.get(d);
        return null !== a ? (b = Ge(a, G(b), c), null != b ? {
          path: (new K(d)).w(b.path),
          value: b.value
        } : null) : null;
      }
      function He(a, b) {
        return Ge(a, b, function() {
          return !0;
        });
      }
      h.subtree = function(a) {
        if (a.e())
          return this;
        var b = this.children.get(O(a));
        return null !== b ? b.subtree(G(a)) : Nd;
      };
      h.set = function(a, b) {
        if (a.e())
          return new De(b, this.children);
        var c = O(a),
            d = (this.children.get(c) || Nd).set(G(a), b),
            c = this.children.Na(c, d);
        return new De(this.value, c);
      };
      h.remove = function(a) {
        if (a.e())
          return this.children.e() ? Nd : new De(null, this.children);
        var b = O(a),
            c = this.children.get(b);
        return c ? (a = c.remove(G(a)), b = a.e() ? this.children.remove(b) : this.children.Na(b, a), null === this.value && b.e() ? Nd : new De(this.value, b)) : this;
      };
      h.get = function(a) {
        if (a.e())
          return this.value;
        var b = this.children.get(O(a));
        return b ? b.get(G(a)) : null;
      };
      function Md(a, b, c) {
        if (b.e())
          return c;
        var d = O(b);
        b = Md(a.children.get(d) || Nd, G(b), c);
        d = b.e() ? a.children.remove(d) : a.children.Na(d, b);
        return new De(a.value, d);
      }
      function Ie(a, b) {
        return Je(a, F, b);
      }
      function Je(a, b, c) {
        var d = {};
        a.children.ha(function(a, f) {
          d[a] = Je(f, b.w(a), c);
        });
        return c(b, a.value, d);
      }
      function Ke(a, b, c) {
        return Le(a, b, F, c);
      }
      function Le(a, b, c, d) {
        var e = a.value ? d(c, a.value) : !1;
        if (e)
          return e;
        if (b.e())
          return null;
        e = O(b);
        return (a = a.children.get(e)) ? Le(a, G(b), c.w(e), d) : null;
      }
      function Me(a, b, c) {
        var d = F;
        if (!b.e()) {
          var e = !0;
          a.value && (e = c(d, a.value));
          !0 === e && (e = O(b), (a = a.children.get(e)) && Ne(a, G(b), d.w(e), c));
        }
      }
      function Ne(a, b, c, d) {
        if (b.e())
          return a;
        a.value && d(c, a.value);
        var e = O(b);
        return (a = a.children.get(e)) ? Ne(a, G(b), c.w(e), d) : Nd;
      }
      function Kd(a, b) {
        Oe(a, F, b);
      }
      function Oe(a, b, c) {
        a.children.ha(function(a, e) {
          Oe(e, b.w(a), c);
        });
        a.value && c(b, a.value);
      }
      function Pe(a, b) {
        a.children.ha(function(a, d) {
          d.value && b(a, d.value);
        });
      }
      var Nd = new De(null);
      De.prototype.toString = function() {
        var a = {};
        Kd(this, function(b, c) {
          a[b.toString()] = c.toString();
        });
        return B(a);
      };
      function Qe(a) {
        this.W = a;
      }
      var Re = new Qe(new De(null));
      function Se(a, b, c) {
        if (b.e())
          return new Qe(new De(c));
        var d = He(a.W, b);
        if (null != d) {
          var e = d.path,
              d = d.value;
          b = N(e, b);
          d = d.G(b, c);
          return new Qe(a.W.set(e, d));
        }
        a = Md(a.W, b, new De(c));
        return new Qe(a);
      }
      function Te(a, b, c) {
        var d = a;
        hb(c, function(a, c) {
          d = Se(d, b.w(a), c);
        });
        return d;
      }
      Qe.prototype.Qd = function(a) {
        if (a.e())
          return Re;
        a = Md(this.W, a, Nd);
        return new Qe(a);
      };
      function Ue(a, b) {
        var c = He(a.W, b);
        return null != c ? a.W.get(c.path).oa(N(c.path, b)) : null;
      }
      function Ve(a) {
        var b = [],
            c = a.W.value;
        null != c ? c.N() || c.U(M, function(a, c) {
          b.push(new E(a, c));
        }) : a.W.children.ha(function(a, c) {
          null != c.value && b.push(new E(a, c.value));
        });
        return b;
      }
      function We(a, b) {
        if (b.e())
          return a;
        var c = Ue(a, b);
        return null != c ? new Qe(new De(c)) : new Qe(a.W.subtree(b));
      }
      Qe.prototype.e = function() {
        return this.W.e();
      };
      Qe.prototype.apply = function(a) {
        return Xe(F, this.W, a);
      };
      function Xe(a, b, c) {
        if (null != b.value)
          return c.G(a, b.value);
        var d = null;
        b.children.ha(function(b, f) {
          ".priority" === b ? (J(null !== f.value, "Priority writes must always be leaf nodes"), d = f.value) : c = Xe(a.w(b), f, c);
        });
        c.oa(a).e() || null === d || (c = c.G(a.w(".priority"), d));
        return c;
      }
      ;
      function Ye() {
        this.T = Re;
        this.za = [];
        this.Lc = -1;
      }
      h = Ye.prototype;
      h.Qd = function(a) {
        var b = Ua(this.za, function(b) {
          return b.je === a;
        });
        J(0 <= b, "removeWrite called with nonexistent writeId.");
        var c = this.za[b];
        this.za.splice(b, 1);
        for (var d = c.visible,
            e = !1,
            f = this.za.length - 1; d && 0 <= f; ) {
          var g = this.za[f];
          g.visible && (f >= b && Ze(g, c.path) ? d = !1 : c.path.contains(g.path) && (e = !0));
          f--;
        }
        if (d) {
          if (e)
            this.T = $e(this.za, af, F), this.Lc = 0 < this.za.length ? this.za[this.za.length - 1].je : -1;
          else if (c.Ia)
            this.T = this.T.Qd(c.path);
          else {
            var k = this;
            r(c.children, function(a, b) {
              k.T = k.T.Qd(c.path.w(b));
            });
          }
          return c.path;
        }
        return null;
      };
      h.ua = function(a, b, c, d) {
        if (c || d) {
          var e = We(this.T, a);
          return !d && e.e() ? b : d || null != b || null != Ue(e, F) ? (e = $e(this.za, function(b) {
            return (b.visible || d) && (!c || !(0 <= Na(c, b.je))) && (b.path.contains(a) || a.contains(b.path));
          }, a), b = b || C, e.apply(b)) : null;
        }
        e = Ue(this.T, a);
        if (null != e)
          return e;
        e = We(this.T, a);
        return e.e() ? b : null != b || null != Ue(e, F) ? (b = b || C, e.apply(b)) : null;
      };
      h.xc = function(a, b) {
        var c = C,
            d = Ue(this.T, a);
        if (d)
          d.N() || d.U(M, function(a, b) {
            c = c.Q(a, b);
          });
        else if (b) {
          var e = We(this.T, a);
          b.U(M, function(a, b) {
            var d = We(e, new K(a)).apply(b);
            c = c.Q(a, d);
          });
          Oa(Ve(e), function(a) {
            c = c.Q(a.name, a.S);
          });
        } else
          e = We(this.T, a), Oa(Ve(e), function(a) {
            c = c.Q(a.name, a.S);
          });
        return c;
      };
      h.kd = function(a, b, c, d) {
        J(c || d, "Either existingEventSnap or existingServerSnap must exist");
        a = a.w(b);
        if (null != Ue(this.T, a))
          return null;
        a = We(this.T, a);
        return a.e() ? d.oa(b) : a.apply(d.oa(b));
      };
      h.Xa = function(a, b, c) {
        a = a.w(b);
        var d = Ue(this.T, a);
        return null != d ? d : rb(c, b) ? We(this.T, a).apply(c.j().M(b)) : null;
      };
      h.sc = function(a) {
        return Ue(this.T, a);
      };
      h.ne = function(a, b, c, d, e, f) {
        var g;
        a = We(this.T, a);
        g = Ue(a, F);
        if (null == g)
          if (null != b)
            g = a.apply(b);
          else
            return [];
        g = g.mb(f);
        if (g.e() || g.N())
          return [];
        b = [];
        a = vd(f);
        e = e ? g.$b(c, f) : g.Yb(c, f);
        for (f = H(e); f && b.length < d; )
          0 !== a(f, c) && b.push(f), f = H(e);
        return b;
      };
      function Ze(a, b) {
        return a.Ia ? a.path.contains(b) : !!ua(a.children, function(c, d) {
          return a.path.w(d).contains(b);
        });
      }
      function af(a) {
        return a.visible;
      }
      function $e(a, b, c) {
        for (var d = Re,
            e = 0; e < a.length; ++e) {
          var f = a[e];
          if (b(f)) {
            var g = f.path;
            if (f.Ia)
              c.contains(g) ? (g = N(c, g), d = Se(d, g, f.Ia)) : g.contains(c) && (g = N(g, c), d = Se(d, F, f.Ia.oa(g)));
            else if (f.children)
              if (c.contains(g))
                g = N(c, g), d = Te(d, g, f.children);
              else {
                if (g.contains(c))
                  if (g = N(g, c), g.e())
                    d = Te(d, F, f.children);
                  else if (f = w(f.children, O(g)))
                    f = f.oa(G(g)), d = Se(d, F, f);
              }
            else
              throw Hc("WriteRecord should have .snap or .children");
          }
        }
        return d;
      }
      function bf(a, b) {
        this.Mb = a;
        this.W = b;
      }
      h = bf.prototype;
      h.ua = function(a, b, c) {
        return this.W.ua(this.Mb, a, b, c);
      };
      h.xc = function(a) {
        return this.W.xc(this.Mb, a);
      };
      h.kd = function(a, b, c) {
        return this.W.kd(this.Mb, a, b, c);
      };
      h.sc = function(a) {
        return this.W.sc(this.Mb.w(a));
      };
      h.ne = function(a, b, c, d, e) {
        return this.W.ne(this.Mb, a, b, c, d, e);
      };
      h.Xa = function(a, b) {
        return this.W.Xa(this.Mb, a, b);
      };
      h.w = function(a) {
        return new bf(this.Mb.w(a), this.W);
      };
      function cf() {
        this.ya = {};
      }
      h = cf.prototype;
      h.e = function() {
        return wa(this.ya);
      };
      h.bb = function(a, b, c) {
        var d = a.source.Hb;
        if (null !== d)
          return d = w(this.ya, d), J(null != d, "SyncTree gave us an op for an invalid query."), d.bb(a, b, c);
        var e = [];
        r(this.ya, function(d) {
          e = e.concat(d.bb(a, b, c));
        });
        return e;
      };
      h.Ob = function(a, b, c, d, e) {
        var f = a.wa(),
            g = w(this.ya, f);
        if (!g) {
          var g = c.ua(e ? d : null),
              k = !1;
          g ? k = !0 : (g = d instanceof T ? c.xc(d) : C, k = !1);
          g = new te(a, new Id(new sb(g, k, !1), new sb(d, e, !1)));
          this.ya[f] = g;
        }
        g.Ob(b);
        return we(g, b);
      };
      h.kb = function(a, b, c) {
        var d = a.wa(),
            e = [],
            f = [],
            g = null != df(this);
        if ("default" === d) {
          var k = this;
          r(this.ya, function(a, d) {
            f = f.concat(a.kb(b, c));
            a.e() && (delete k.ya[d], de(a.V.n) || e.push(a.V));
          });
        } else {
          var l = w(this.ya, d);
          l && (f = f.concat(l.kb(b, c)), l.e() && (delete this.ya[d], de(l.V.n) || e.push(l.V)));
        }
        g && null == df(this) && e.push(new U(a.k, a.path));
        return {
          Eg: e,
          gg: f
        };
      };
      function ef(a) {
        return Pa(ra(a.ya), function(a) {
          return !de(a.V.n);
        });
      }
      h.hb = function(a) {
        var b = null;
        r(this.ya, function(c) {
          b = b || c.hb(a);
        });
        return b;
      };
      function ff(a, b) {
        if (de(b.n))
          return df(a);
        var c = b.wa();
        return w(a.ya, c);
      }
      function df(a) {
        return va(a.ya, function(a) {
          return de(a.V.n);
        }) || null;
      }
      ;
      function gf(a) {
        this.sa = Nd;
        this.Gb = new Ye;
        this.Ye = {};
        this.kc = {};
        this.Mc = a;
      }
      function hf(a, b, c, d, e) {
        var f = a.Gb,
            g = e;
        J(d > f.Lc, "Stacking an older write on top of newer ones");
        n(g) || (g = !0);
        f.za.push({
          path: b,
          Ia: c,
          je: d,
          visible: g
        });
        g && (f.T = Se(f.T, b, c));
        f.Lc = d;
        return e ? jf(a, new Ub(Yb, b, c)) : [];
      }
      function kf(a, b, c, d) {
        var e = a.Gb;
        J(d > e.Lc, "Stacking an older merge on top of newer ones");
        e.za.push({
          path: b,
          children: c,
          je: d,
          visible: !0
        });
        e.T = Te(e.T, b, c);
        e.Lc = d;
        c = Fe(c);
        return jf(a, new xe(Yb, b, c));
      }
      function lf(a, b, c) {
        c = c || !1;
        b = a.Gb.Qd(b);
        return null == b ? [] : jf(a, new Wb(b, c));
      }
      function mf(a, b, c) {
        c = Fe(c);
        return jf(a, new xe(ze, b, c));
      }
      function nf(a, b, c, d) {
        d = of(a, d);
        if (null != d) {
          var e = pf(d);
          d = e.path;
          e = e.Hb;
          b = N(d, b);
          c = new Ub(new ye(!1, !0, e, !0), b, c);
          return qf(a, d, c);
        }
        return [];
      }
      function rf(a, b, c, d) {
        if (d = of(a, d)) {
          var e = pf(d);
          d = e.path;
          e = e.Hb;
          b = N(d, b);
          c = Fe(c);
          c = new xe(new ye(!1, !0, e, !0), b, c);
          return qf(a, d, c);
        }
        return [];
      }
      gf.prototype.Ob = function(a, b) {
        var c = a.path,
            d = null,
            e = !1;
        Me(this.sa, c, function(a, b) {
          var f = N(a, c);
          d = b.hb(f);
          e = e || null != df(b);
          return !d;
        });
        var f = this.sa.get(c);
        f ? (e = e || null != df(f), d = d || f.hb(F)) : (f = new cf, this.sa = this.sa.set(c, f));
        var g;
        null != d ? g = !0 : (g = !1, d = C, Pe(this.sa.subtree(c), function(a, b) {
          var c = b.hb(F);
          c && (d = d.Q(a, c));
        }));
        var k = null != ff(f, a);
        if (!k && !de(a.n)) {
          var l = sf(a);
          J(!(l in this.kc), "View does not exist, but we have a tag");
          var m = tf++;
          this.kc[l] = m;
          this.Ye["_" + m] = l;
        }
        g = f.Ob(a, b, new bf(c, this.Gb), d, g);
        k || e || (f = ff(f, a), g = g.concat(uf(this, a, f)));
        return g;
      };
      gf.prototype.kb = function(a, b, c) {
        var d = a.path,
            e = this.sa.get(d),
            f = [];
        if (e && ("default" === a.wa() || null != ff(e, a))) {
          f = e.kb(a, b, c);
          e.e() && (this.sa = this.sa.remove(d));
          e = f.Eg;
          f = f.gg;
          b = -1 !== Ua(e, function(a) {
            return de(a.n);
          });
          var g = Ke(this.sa, d, function(a, b) {
            return null != df(b);
          });
          if (b && !g && (d = this.sa.subtree(d), !d.e()))
            for (var d = vf(d),
                k = 0; k < d.length; ++k) {
              var l = d[k],
                  m = l.V,
                  l = wf(this, l);
              this.Mc.Ve(m, xf(this, m), l.wd, l.J);
            }
          if (!g && 0 < e.length && !c)
            if (b)
              this.Mc.$d(a, null);
            else {
              var v = this;
              Oa(e, function(a) {
                a.wa();
                var b = v.kc[sf(a)];
                v.Mc.$d(a, b);
              });
            }
          yf(this, e);
        }
        return f;
      };
      gf.prototype.ua = function(a, b) {
        var c = this.Gb,
            d = Ke(this.sa, a, function(b, c) {
              var d = N(b, a);
              if (d = c.hb(d))
                return d;
            });
        return c.ua(a, d, b, !0);
      };
      function vf(a) {
        return Ie(a, function(a, c, d) {
          if (c && null != df(c))
            return [df(c)];
          var e = [];
          c && (e = ef(c));
          r(d, function(a) {
            e = e.concat(a);
          });
          return e;
        });
      }
      function yf(a, b) {
        for (var c = 0; c < b.length; ++c) {
          var d = b[c];
          if (!de(d.n)) {
            var d = sf(d),
                e = a.kc[d];
            delete a.kc[d];
            delete a.Ye["_" + e];
          }
        }
      }
      function uf(a, b, c) {
        var d = b.path,
            e = xf(a, b);
        c = wf(a, c);
        b = a.Mc.Ve(b, e, c.wd, c.J);
        d = a.sa.subtree(d);
        if (e)
          J(null == df(d.value), "If we're adding a query, it shouldn't be shadowed");
        else
          for (e = Ie(d, function(a, b, c) {
            if (!a.e() && b && null != df(b))
              return [ue(df(b))];
            var d = [];
            b && (d = d.concat(Qa(ef(b), function(a) {
              return a.V;
            })));
            r(c, function(a) {
              d = d.concat(a);
            });
            return d;
          }), d = 0; d < e.length; ++d)
            c = e[d], a.Mc.$d(c, xf(a, c));
        return b;
      }
      function wf(a, b) {
        var c = b.V,
            d = xf(a, c);
        return {
          wd: function() {
            return (b.u() || C).hash();
          },
          J: function(b) {
            if ("ok" === b) {
              if (d) {
                var f = c.path;
                if (b = of(a, d)) {
                  var g = pf(b);
                  b = g.path;
                  g = g.Hb;
                  f = N(b, f);
                  f = new Zb(new ye(!1, !0, g, !0), f);
                  b = qf(a, b, f);
                } else
                  b = [];
              } else
                b = jf(a, new Zb(ze, c.path));
              return b;
            }
            f = "Unknown Error";
            "too_big" === b ? f = "The data requested exceeds the maximum size that can be accessed with a single request." : "permission_denied" == b ? f = "Client doesn't have permission to access the desired data." : "unavailable" == b && (f = "The service is unavailable");
            f = Error(b + ": " + f);
            f.code = b.toUpperCase();
            return a.kb(c, null, f);
          }
        };
      }
      function sf(a) {
        return a.path.toString() + "$" + a.wa();
      }
      function pf(a) {
        var b = a.indexOf("$");
        J(-1 !== b && b < a.length - 1, "Bad queryKey.");
        return {
          Hb: a.substr(b + 1),
          path: new K(a.substr(0, b))
        };
      }
      function of(a, b) {
        var c = a.Ye,
            d = "_" + b;
        return d in c ? c[d] : void 0;
      }
      function xf(a, b) {
        var c = sf(b);
        return w(a.kc, c);
      }
      var tf = 1;
      function qf(a, b, c) {
        var d = a.sa.get(b);
        J(d, "Missing sync point for query tag that we're tracking");
        return d.bb(c, new bf(b, a.Gb), null);
      }
      function jf(a, b) {
        return zf(a, b, a.sa, null, new bf(F, a.Gb));
      }
      function zf(a, b, c, d, e) {
        if (b.path.e())
          return Af(a, b, c, d, e);
        var f = c.get(F);
        null == d && null != f && (d = f.hb(F));
        var g = [],
            k = O(b.path),
            l = b.Xc(k);
        if ((c = c.children.get(k)) && l)
          var m = d ? d.M(k) : null,
              k = e.w(k),
              g = g.concat(zf(a, l, c, m, k));
        f && (g = g.concat(f.bb(b, e, d)));
        return g;
      }
      function Af(a, b, c, d, e) {
        var f = c.get(F);
        null == d && null != f && (d = f.hb(F));
        var g = [];
        c.children.ha(function(c, f) {
          var m = d ? d.M(c) : null,
              v = e.w(c),
              y = b.Xc(c);
          y && (g = g.concat(Af(a, y, f, m, v)));
        });
        f && (g = g.concat(f.bb(b, e, d)));
        return g;
      }
      ;
      function Bf() {
        this.children = {};
        this.md = 0;
        this.value = null;
      }
      function Cf(a, b, c) {
        this.Fd = a ? a : "";
        this.Zc = b ? b : null;
        this.B = c ? c : new Bf;
      }
      function Df(a, b) {
        for (var c = b instanceof K ? b : new K(b),
            d = a,
            e; null !== (e = O(c)); )
          d = new Cf(e, d, w(d.B.children, e) || new Bf), c = G(c);
        return d;
      }
      h = Cf.prototype;
      h.Ba = function() {
        return this.B.value;
      };
      function Ef(a, b) {
        J("undefined" !== typeof b, "Cannot set value to undefined");
        a.B.value = b;
        Ff(a);
      }
      h.clear = function() {
        this.B.value = null;
        this.B.children = {};
        this.B.md = 0;
        Ff(this);
      };
      h.vd = function() {
        return 0 < this.B.md;
      };
      h.e = function() {
        return null === this.Ba() && !this.vd();
      };
      h.U = function(a) {
        var b = this;
        r(this.B.children, function(c, d) {
          a(new Cf(d, b, c));
        });
      };
      function Gf(a, b, c, d) {
        c && !d && b(a);
        a.U(function(a) {
          Gf(a, b, !0, d);
        });
        c && d && b(a);
      }
      function Hf(a, b) {
        for (var c = a.parent(); null !== c && !b(c); )
          c = c.parent();
      }
      h.path = function() {
        return new K(null === this.Zc ? this.Fd : this.Zc.path() + "/" + this.Fd);
      };
      h.name = function() {
        return this.Fd;
      };
      h.parent = function() {
        return this.Zc;
      };
      function Ff(a) {
        if (null !== a.Zc) {
          var b = a.Zc,
              c = a.Fd,
              d = a.e(),
              e = u(b.B.children, c);
          d && e ? (delete b.B.children[c], b.B.md--, Ff(b)) : d || e || (b.B.children[c] = a.B, b.B.md++, Ff(b));
        }
      }
      ;
      function If(a) {
        J(ea(a) && 0 < a.length, "Requires a non-empty array");
        this.Rf = a;
        this.Nc = {};
      }
      If.prototype.ee = function(a, b) {
        for (var c = this.Nc[a] || [],
            d = 0; d < c.length; d++)
          c[d].yc.apply(c[d].Ma, Array.prototype.slice.call(arguments, 1));
      };
      If.prototype.Db = function(a, b, c) {
        Jf(this, a);
        this.Nc[a] = this.Nc[a] || [];
        this.Nc[a].push({
          yc: b,
          Ma: c
        });
        (a = this.Ae(a)) && b.apply(c, a);
      };
      If.prototype.hc = function(a, b, c) {
        Jf(this, a);
        a = this.Nc[a] || [];
        for (var d = 0; d < a.length; d++)
          if (a[d].yc === b && (!c || c === a[d].Ma)) {
            a.splice(d, 1);
            break;
          }
      };
      function Jf(a, b) {
        J(Ta(a.Rf, function(a) {
          return a === b;
        }), "Unknown event: " + b);
      }
      ;
      var Kf = function() {
        var a = 0,
            b = [];
        return function(c) {
          var d = c === a;
          a = c;
          for (var e = Array(8),
              f = 7; 0 <= f; f--)
            e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64), c = Math.floor(c / 64);
          J(0 === c, "Cannot push at time == 0");
          c = e.join("");
          if (d) {
            for (f = 11; 0 <= f && 63 === b[f]; f--)
              b[f] = 0;
            b[f]++;
          } else
            for (f = 0; 12 > f; f++)
              b[f] = Math.floor(64 * Math.random());
          for (f = 0; 12 > f; f++)
            c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
          J(20 === c.length, "nextPushId: Length should be 20.");
          return c;
        };
      }();
      function Lf() {
        If.call(this, ["online"]);
        this.Wc = !0;
        if ("undefined" !== typeof window && "undefined" !== typeof window.addEventListener) {
          var a = this;
          window.addEventListener("online", function() {
            a.Wc || a.ee("online", !0);
            a.Wc = !0;
          }, !1);
          window.addEventListener("offline", function() {
            a.Wc && a.ee("online", !1);
            a.Wc = !1;
          }, !1);
        }
      }
      ma(Lf, If);
      Lf.prototype.Ae = function(a) {
        J("online" === a, "Unknown event type: " + a);
        return [this.Wc];
      };
      ca(Lf);
      function Mf() {
        If.call(this, ["visible"]);
        var a,
            b;
        "undefined" !== typeof document && "undefined" !== typeof document.addEventListener && ("undefined" !== typeof document.hidden ? (b = "visibilitychange", a = "hidden") : "undefined" !== typeof document.mozHidden ? (b = "mozvisibilitychange", a = "mozHidden") : "undefined" !== typeof document.msHidden ? (b = "msvisibilitychange", a = "msHidden") : "undefined" !== typeof document.webkitHidden && (b = "webkitvisibilitychange", a = "webkitHidden"));
        this.uc = !0;
        if (b) {
          var c = this;
          document.addEventListener(b, function() {
            var b = !document[a];
            b !== c.uc && (c.uc = b, c.ee("visible", b));
          }, !1);
        }
      }
      ma(Mf, If);
      Mf.prototype.Ae = function(a) {
        J("visible" === a, "Unknown event type: " + a);
        return [this.uc];
      };
      ca(Mf);
      var Nf = /[\[\].#$\/\u0000-\u001F\u007F]/,
          Of = /[\[\].#$\u0000-\u001F\u007F]/;
      function Pf(a) {
        return p(a) && 0 !== a.length && !Nf.test(a);
      }
      function Qf(a) {
        return null === a || p(a) || ga(a) && !Sc(a) || ia(a) && u(a, ".sv");
      }
      function Rf(a, b, c, d) {
        d && !n(b) || Sf(z(a, 1, d), b, c);
      }
      function Sf(a, b, c) {
        c instanceof K && (c = new wc(c, a));
        if (!n(b))
          throw Error(a + "contains undefined " + zc(c));
        if (ha(b))
          throw Error(a + "contains a function " + zc(c) + " with contents: " + b.toString());
        if (Sc(b))
          throw Error(a + "contains " + b.toString() + " " + zc(c));
        if (p(b) && b.length > 10485760 / 3 && 10485760 < xc(b))
          throw Error(a + "contains a string greater than 10485760 utf8 bytes " + zc(c) + " ('" + b.substring(0, 50) + "...')");
        if (ia(b)) {
          var d = !1,
              e = !1;
          hb(b, function(b, g) {
            if (".value" === b)
              d = !0;
            else if (".priority" !== b && ".sv" !== b && (e = !0, !Pf(b)))
              throw Error(a + " contains an invalid key (" + b + ") " + zc(c) + '.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');
            c.push(b);
            Sf(a, g, c);
            c.pop();
          });
          if (d && e)
            throw Error(a + ' contains ".value" child ' + zc(c) + " in addition to actual children.");
        }
      }
      function Tf(a, b, c) {
        if (!ia(b) || ea(b))
          throw Error(z(a, 1, !1) + " must be an Object containing the children to replace.");
        if (u(b, ".value"))
          throw Error(z(a, 1, !1) + ' must not contain ".value".  To overwrite with a leaf value, just use .set() instead.');
        Rf(a, b, c, !1);
      }
      function Uf(a, b, c) {
        if (Sc(c))
          throw Error(z(a, b, !1) + "is " + c.toString() + ", but must be a valid Firebase priority (a string, finite number, server value, or null).");
        if (!Qf(c))
          throw Error(z(a, b, !1) + "must be a valid Firebase priority (a string, finite number, server value, or null).");
      }
      function Vf(a, b, c) {
        if (!c || n(b))
          switch (b) {
            case "value":
            case "child_added":
            case "child_removed":
            case "child_changed":
            case "child_moved":
              break;
            default:
              throw Error(z(a, 1, c) + 'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');
          }
      }
      function Wf(a, b, c, d) {
        if ((!d || n(c)) && !Pf(c))
          throw Error(z(a, b, d) + 'was an invalid key: "' + c + '".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');
      }
      function Xf(a, b) {
        if (!p(b) || 0 === b.length || Of.test(b))
          throw Error(z(a, 1, !1) + 'was an invalid path: "' + b + '". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');
      }
      function Yf(a, b) {
        if (".info" === O(b))
          throw Error(a + " failed: Can't modify data under /.info/");
      }
      function Zf(a, b) {
        if (!p(b))
          throw Error(z(a, 1, !1) + "must be a valid credential (a string).");
      }
      function $f(a, b, c) {
        if (!p(c))
          throw Error(z(a, b, !1) + "must be a valid string.");
      }
      function ag(a, b, c, d) {
        if (!d || n(c))
          if (!ia(c) || null === c)
            throw Error(z(a, b, d) + "must be a valid object.");
      }
      function bg(a, b, c) {
        if (!ia(b) || null === b || !u(b, c))
          throw Error(z(a, 1, !1) + 'must contain the key "' + c + '"');
        if (!p(w(b, c)))
          throw Error(z(a, 1, !1) + 'must contain the key "' + c + '" with type "string"');
      }
      ;
      function cg() {
        this.set = {};
      }
      h = cg.prototype;
      h.add = function(a, b) {
        this.set[a] = null !== b ? b : !0;
      };
      h.contains = function(a) {
        return u(this.set, a);
      };
      h.get = function(a) {
        return this.contains(a) ? this.set[a] : void 0;
      };
      h.remove = function(a) {
        delete this.set[a];
      };
      h.clear = function() {
        this.set = {};
      };
      h.e = function() {
        return wa(this.set);
      };
      h.count = function() {
        return pa(this.set);
      };
      function dg(a, b) {
        r(a.set, function(a, d) {
          b(d, a);
        });
      }
      h.keys = function() {
        var a = [];
        r(this.set, function(b, c) {
          a.push(c);
        });
        return a;
      };
      function qc() {
        this.m = this.C = null;
      }
      qc.prototype.find = function(a) {
        if (null != this.C)
          return this.C.oa(a);
        if (a.e() || null == this.m)
          return null;
        var b = O(a);
        a = G(a);
        return this.m.contains(b) ? this.m.get(b).find(a) : null;
      };
      qc.prototype.mc = function(a, b) {
        if (a.e())
          this.C = b, this.m = null;
        else if (null !== this.C)
          this.C = this.C.G(a, b);
        else {
          null == this.m && (this.m = new cg);
          var c = O(a);
          this.m.contains(c) || this.m.add(c, new qc);
          c = this.m.get(c);
          a = G(a);
          c.mc(a, b);
        }
      };
      function eg(a, b) {
        if (b.e())
          return a.C = null, a.m = null, !0;
        if (null !== a.C) {
          if (a.C.N())
            return !1;
          var c = a.C;
          a.C = null;
          c.U(M, function(b, c) {
            a.mc(new K(b), c);
          });
          return eg(a, b);
        }
        return null !== a.m ? (c = O(b), b = G(b), a.m.contains(c) && eg(a.m.get(c), b) && a.m.remove(c), a.m.e() ? (a.m = null, !0) : !1) : !0;
      }
      function rc(a, b, c) {
        null !== a.C ? c(b, a.C) : a.U(function(a, e) {
          var f = new K(b.toString() + "/" + a);
          rc(e, f, c);
        });
      }
      qc.prototype.U = function(a) {
        null !== this.m && dg(this.m, function(b, c) {
          a(b, c);
        });
      };
      var fg = "auth.firebase.com";
      function gg(a, b, c) {
        this.nd = a || {};
        this.de = b || {};
        this.ab = c || {};
        this.nd.remember || (this.nd.remember = "default");
      }
      var hg = ["remember", "redirectTo"];
      function ig(a) {
        var b = {},
            c = {};
        hb(a || {}, function(a, e) {
          0 <= Na(hg, a) ? b[a] = e : c[a] = e;
        });
        return new gg(b, {}, c);
      }
      ;
      function jg(a, b) {
        this.Pe = ["session", a.Nd, a.Bb].join(":");
        this.ae = b;
      }
      jg.prototype.set = function(a, b) {
        if (!b)
          if (this.ae.length)
            b = this.ae[0];
          else
            throw Error("fb.login.SessionManager : No storage options available!");
        b.set(this.Pe, a);
      };
      jg.prototype.get = function() {
        var a = Qa(this.ae, q(this.kg, this)),
            a = Pa(a, function(a) {
              return null !== a;
            });
        Xa(a, function(a, c) {
          return bd(c.token) - bd(a.token);
        });
        return 0 < a.length ? a.shift() : null;
      };
      jg.prototype.kg = function(a) {
        try {
          var b = a.get(this.Pe);
          if (b && b.token)
            return b;
        } catch (c) {}
        return null;
      };
      jg.prototype.clear = function() {
        var a = this;
        Oa(this.ae, function(b) {
          b.remove(a.Pe);
        });
      };
      function kg() {
        return !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(navigator.userAgent);
      }
      function lg() {
        var a = navigator.userAgent;
        if ("Microsoft Internet Explorer" === navigator.appName) {
          if ((a = a.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/)) && 1 < a.length)
            return 8 <= parseFloat(a[1]);
        } else if (-1 < a.indexOf("Trident") && (a = a.match(/rv:([0-9]{2,2}[\.0-9]{0,})/)) && 1 < a.length)
          return 8 <= parseFloat(a[1]);
        return !1;
      }
      ;
      function mg() {
        var a = window.opener.frames,
            b;
        for (b = a.length - 1; 0 <= b; b--)
          try {
            if (a[b].location.protocol === window.location.protocol && a[b].location.host === window.location.host && "__winchan_relay_frame" === a[b].name)
              return a[b];
          } catch (c) {}
        return null;
      }
      function ng(a, b, c) {
        a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener && a.addEventListener(b, c, !1);
      }
      function og(a, b, c) {
        a.detachEvent ? a.detachEvent("on" + b, c) : a.removeEventListener && a.removeEventListener(b, c, !1);
      }
      function pg(a) {
        /^https?:\/\//.test(a) || (a = window.location.href);
        var b = /^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);
        return b ? b[1] : a;
      }
      function qg(a) {
        var b = "";
        try {
          a = a.replace("#", "");
          var c = kb(a);
          c && u(c, "__firebase_request_key") && (b = w(c, "__firebase_request_key"));
        } catch (d) {}
        return b;
      }
      function rg() {
        var a = Rc(fg);
        return a.scheme + "://" + a.host + "/v2";
      }
      function sg(a) {
        return rg() + "/" + a + "/auth/channel";
      }
      ;
      function tg(a) {
        var b = this;
        this.zc = a;
        this.be = "*";
        lg() ? this.Qc = this.yd = mg() : (this.Qc = window.opener, this.yd = window);
        if (!b.Qc)
          throw "Unable to find relay frame";
        ng(this.yd, "message", q(this.ic, this));
        ng(this.yd, "message", q(this.wf, this));
        try {
          ug(this, {a: "ready"});
        } catch (c) {
          ng(this.Qc, "load", function() {
            ug(b, {a: "ready"});
          });
        }
        ng(window, "unload", q(this.vg, this));
      }
      function ug(a, b) {
        b = B(b);
        lg() ? a.Qc.doPost(b, a.be) : a.Qc.postMessage(b, a.be);
      }
      tg.prototype.ic = function(a) {
        var b = this,
            c;
        try {
          c = mb(a.data);
        } catch (d) {}
        c && "request" === c.a && (og(window, "message", this.ic), this.be = a.origin, this.zc && setTimeout(function() {
          b.zc(b.be, c.d, function(a, c) {
            b.Yf = !c;
            b.zc = void 0;
            ug(b, {
              a: "response",
              d: a,
              forceKeepWindowOpen: c
            });
          });
        }, 0));
      };
      tg.prototype.vg = function() {
        try {
          og(this.yd, "message", this.wf);
        } catch (a) {}
        this.zc && (ug(this, {
          a: "error",
          d: "unknown closed window"
        }), this.zc = void 0);
        try {
          window.close();
        } catch (b) {}
      };
      tg.prototype.wf = function(a) {
        if (this.Yf && "die" === a.data)
          try {
            window.close();
          } catch (b) {}
      };
      function vg(a) {
        this.oc = Ga() + Ga() + Ga();
        this.zf = a;
      }
      vg.prototype.open = function(a, b) {
        P.set("redirect_request_id", this.oc);
        P.set("redirect_request_id", this.oc);
        b.requestId = this.oc;
        b.redirectTo = b.redirectTo || window.location.href;
        a += (/\?/.test(a) ? "" : "?") + jb(b);
        window.location = a;
      };
      vg.isAvailable = function() {
        return !/^file:\//.test(location.href) && !kg();
      };
      vg.prototype.Bc = function() {
        return "redirect";
      };
      var wg = {
        NETWORK_ERROR: "Unable to contact the Firebase server.",
        SERVER_ERROR: "An unknown server error occurred.",
        TRANSPORT_UNAVAILABLE: "There are no login transports available for the requested method.",
        REQUEST_INTERRUPTED: "The browser redirected the page before the login request could complete.",
        USER_CANCELLED: "The user cancelled authentication."
      };
      function xg(a) {
        var b = Error(w(wg, a), a);
        b.code = a;
        return b;
      }
      ;
      function yg(a) {
        if (!a.window_features || -1 !== navigator.userAgent.indexOf("Fennec/") || -1 !== navigator.userAgent.indexOf("Firefox/") && -1 !== navigator.userAgent.indexOf("Android"))
          a.window_features = void 0;
        a.window_name || (a.window_name = "_blank");
        this.options = a;
      }
      yg.prototype.open = function(a, b, c) {
        function d(a) {
          g && (document.body.removeChild(g), g = void 0);
          v && (v = clearInterval(v));
          og(window, "message", e);
          og(window, "unload", d);
          if (m && !a)
            try {
              m.close();
            } catch (b) {
              k.postMessage("die", l);
            }
          m = k = void 0;
        }
        function e(a) {
          if (a.origin === l)
            try {
              var b = mb(a.data);
              "ready" === b.a ? k.postMessage(y, l) : "error" === b.a ? (d(!1), c && (c(b.d), c = null)) : "response" === b.a && (d(b.forceKeepWindowOpen), c && (c(null, b.d), c = null));
            } catch (e) {}
        }
        var f = lg(),
            g,
            k;
        if (!this.options.relay_url)
          return c(Error("invalid arguments: origin of url and relay_url must match"));
        var l = pg(a);
        if (l !== pg(this.options.relay_url))
          c && setTimeout(function() {
            c(Error("invalid arguments: origin of url and relay_url must match"));
          }, 0);
        else {
          f && (g = document.createElement("iframe"), g.setAttribute("src", this.options.relay_url), g.style.display = "none", g.setAttribute("name", "__winchan_relay_frame"), document.body.appendChild(g), k = g.contentWindow);
          a += (/\?/.test(a) ? "" : "?") + jb(b);
          var m = window.open(a, this.options.window_name, this.options.window_features);
          k || (k = m);
          var v = setInterval(function() {
            m && m.closed && (d(!1), c && (c(xg("USER_CANCELLED")), c = null));
          }, 500),
              y = B({
                a: "request",
                d: b
              });
          ng(window, "unload", d);
          ng(window, "message", e);
        }
      };
      yg.isAvailable = function() {
        return "postMessage" in window && !/^file:\//.test(location.href) && !(kg() || navigator.userAgent.match(/Windows Phone/) || window.Windows && /^ms-appx:/.test(location.href) || navigator.userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i) || navigator.userAgent.match(/CriOS/) || navigator.userAgent.match(/Twitter for iPhone/) || navigator.userAgent.match(/FBAN\/FBIOS/) || window.navigator.standalone) && !navigator.userAgent.match(/PhantomJS/);
      };
      yg.prototype.Bc = function() {
        return "popup";
      };
      function zg(a) {
        a.method || (a.method = "GET");
        a.headers || (a.headers = {});
        a.headers.content_type || (a.headers.content_type = "application/json");
        a.headers.content_type = a.headers.content_type.toLowerCase();
        this.options = a;
      }
      zg.prototype.open = function(a, b, c) {
        function d() {
          c && (c(xg("REQUEST_INTERRUPTED")), c = null);
        }
        var e = new XMLHttpRequest,
            f = this.options.method.toUpperCase(),
            g;
        ng(window, "beforeunload", d);
        e.onreadystatechange = function() {
          if (c && 4 === e.readyState) {
            var a;
            if (200 <= e.status && 300 > e.status) {
              try {
                a = mb(e.responseText);
              } catch (b) {}
              c(null, a);
            } else
              500 <= e.status && 600 > e.status ? c(xg("SERVER_ERROR")) : c(xg("NETWORK_ERROR"));
            c = null;
            og(window, "beforeunload", d);
          }
        };
        if ("GET" === f)
          a += (/\?/.test(a) ? "" : "?") + jb(b), g = null;
        else {
          var k = this.options.headers.content_type;
          "application/json" === k && (g = B(b));
          "application/x-www-form-urlencoded" === k && (g = jb(b));
        }
        e.open(f, a, !0);
        a = {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json;text/plain"
        };
        za(a, this.options.headers);
        for (var l in a)
          e.setRequestHeader(l, a[l]);
        e.send(g);
      };
      zg.isAvailable = function() {
        return !!window.XMLHttpRequest && "string" === typeof(new XMLHttpRequest).responseType && (!(navigator.userAgent.match(/MSIE/) || navigator.userAgent.match(/Trident/)) || lg());
      };
      zg.prototype.Bc = function() {
        return "json";
      };
      function Ag(a) {
        this.oc = Ga() + Ga() + Ga();
        this.zf = a;
      }
      Ag.prototype.open = function(a, b, c) {
        function d() {
          c && (c(xg("USER_CANCELLED")), c = null);
        }
        var e = this,
            f = Rc(fg),
            g;
        b.requestId = this.oc;
        b.redirectTo = f.scheme + "://" + f.host + "/blank/page.html";
        a += /\?/.test(a) ? "" : "?";
        a += jb(b);
        (g = window.open(a, "_blank", "location=no")) && ha(g.addEventListener) ? (g.addEventListener("loadstart", function(a) {
          var b;
          if (b = a && a.url)
            a: {
              try {
                var m = document.createElement("a");
                m.href = a.url;
                b = m.host === f.host && "/blank/page.html" === m.pathname;
                break a;
              } catch (v) {}
              b = !1;
            }
          b && (a = qg(a.url), g.removeEventListener("exit", d), g.close(), a = new gg(null, null, {
            requestId: e.oc,
            requestKey: a
          }), e.zf.requestWithCredential("/auth/session", a, c), c = null);
        }), g.addEventListener("exit", d)) : c(xg("TRANSPORT_UNAVAILABLE"));
      };
      Ag.isAvailable = function() {
        return kg();
      };
      Ag.prototype.Bc = function() {
        return "redirect";
      };
      function Bg(a) {
        a.callback_parameter || (a.callback_parameter = "callback");
        this.options = a;
        window.__firebase_auth_jsonp = window.__firebase_auth_jsonp || {};
      }
      Bg.prototype.open = function(a, b, c) {
        function d() {
          c && (c(xg("REQUEST_INTERRUPTED")), c = null);
        }
        function e() {
          setTimeout(function() {
            window.__firebase_auth_jsonp[f] = void 0;
            wa(window.__firebase_auth_jsonp) && (window.__firebase_auth_jsonp = void 0);
            try {
              var a = document.getElementById(f);
              a && a.parentNode.removeChild(a);
            } catch (b) {}
          }, 1);
          og(window, "beforeunload", d);
        }
        var f = "fn" + (new Date).getTime() + Math.floor(99999 * Math.random());
        b[this.options.callback_parameter] = "__firebase_auth_jsonp." + f;
        a += (/\?/.test(a) ? "" : "?") + jb(b);
        ng(window, "beforeunload", d);
        window.__firebase_auth_jsonp[f] = function(a) {
          c && (c(null, a), c = null);
          e();
        };
        Cg(f, a, c);
      };
      function Cg(a, b, c) {
        setTimeout(function() {
          try {
            var d = document.createElement("script");
            d.type = "text/javascript";
            d.id = a;
            d.async = !0;
            d.src = b;
            d.onerror = function() {
              var b = document.getElementById(a);
              null !== b && b.parentNode.removeChild(b);
              c && c(xg("NETWORK_ERROR"));
            };
            var e = document.getElementsByTagName("head");
            (e && 0 != e.length ? e[0] : document.documentElement).appendChild(d);
          } catch (f) {
            c && c(xg("NETWORK_ERROR"));
          }
        }, 0);
      }
      Bg.isAvailable = function() {
        return !0;
      };
      Bg.prototype.Bc = function() {
        return "json";
      };
      function Dg(a, b, c, d) {
        If.call(this, ["auth_status"]);
        this.H = a;
        this.bf = b;
        this.Pg = c;
        this.Ke = d;
        this.rc = new jg(a, [Dc, P]);
        this.nb = null;
        Eg(this);
      }
      ma(Dg, If);
      h = Dg.prototype;
      h.xe = function() {
        return this.nb || null;
      };
      function Eg(a) {
        P.get("redirect_request_id") && Fg(a);
        var b = a.rc.get();
        b && b.token ? (Gg(a, b), a.bf(b.token, function(c, d) {
          Hg(a, c, d, !1, b.token, b);
        }, function(b, d) {
          Ig(a, "resumeSession()", b, d);
        })) : Gg(a, null);
      }
      function Jg(a, b, c, d, e, f) {
        "firebaseio-demo.com" === a.H.domain && Q("Firebase authentication is not supported on demo Firebases (*.firebaseio-demo.com). To secure your Firebase, create a production Firebase at https://www.firebase.com.");
        a.bf(b, function(f, k) {
          Hg(a, f, k, !0, b, c, d || {}, e);
        }, function(b, c) {
          Ig(a, "auth()", b, c, f);
        });
      }
      function Kg(a, b) {
        a.rc.clear();
        Gg(a, null);
        a.Pg(function(a, d) {
          if ("ok" === a)
            R(b, null);
          else {
            var e = (a || "error").toUpperCase(),
                f = e;
            d && (f += ": " + d);
            f = Error(f);
            f.code = e;
            R(b, f);
          }
        });
      }
      function Hg(a, b, c, d, e, f, g, k) {
        "ok" === b ? (d && (b = c.auth, f.auth = b, f.expires = c.expires, f.token = cd(e) ? e : "", c = null, b && u(b, "uid") ? c = w(b, "uid") : u(f, "uid") && (c = w(f, "uid")), f.uid = c, c = "custom", b && u(b, "provider") ? c = w(b, "provider") : u(f, "provider") && (c = w(f, "provider")), f.provider = c, a.rc.clear(), cd(e) && (g = g || {}, c = Dc, "sessionOnly" === g.remember && (c = P), "none" !== g.remember && a.rc.set(f, c)), Gg(a, f)), R(k, null, f)) : (a.rc.clear(), Gg(a, null), f = a = (b || "error").toUpperCase(), c && (f += ": " + c), f = Error(f), f.code = a, R(k, f));
      }
      function Ig(a, b, c, d, e) {
        Q(b + " was canceled: " + d);
        a.rc.clear();
        Gg(a, null);
        a = Error(d);
        a.code = c.toUpperCase();
        R(e, a);
      }
      function Lg(a, b, c, d, e) {
        Mg(a);
        c = new gg(d || {}, {}, c || {});
        Ng(a, [zg, Bg], "/auth/" + b, c, e);
      }
      function Og(a, b, c, d) {
        Mg(a);
        var e = [yg, Ag];
        c = ig(c);
        "anonymous" === b || "password" === b ? setTimeout(function() {
          R(d, xg("TRANSPORT_UNAVAILABLE"));
        }, 0) : (c.de.window_features = "menubar=yes,modal=yes,alwaysRaised=yeslocation=yes,resizable=yes,scrollbars=yes,status=yes,height=625,width=625,top=" + ("object" === typeof screen ? .5 * (screen.height - 625) : 0) + ",left=" + ("object" === typeof screen ? .5 * (screen.width - 625) : 0), c.de.relay_url = sg(a.H.Bb), c.de.requestWithCredential = q(a.pc, a), Ng(a, e, "/auth/" + b, c, d));
      }
      function Fg(a) {
        var b = P.get("redirect_request_id");
        if (b) {
          var c = P.get("redirect_client_options");
          P.remove("redirect_request_id");
          P.remove("redirect_client_options");
          var d = [zg, Bg],
              b = {
                requestId: b,
                requestKey: qg(document.location.hash)
              },
              c = new gg(c, {}, b);
          try {
            document.location.hash = document.location.hash.replace(/&__firebase_request_key=([a-zA-z0-9]*)/, "");
          } catch (e) {}
          Ng(a, d, "/auth/session", c);
        }
      }
      h.se = function(a, b) {
        Mg(this);
        var c = ig(a);
        c.ab._method = "POST";
        this.pc("/users", c, function(a, c) {
          a ? R(b, a) : R(b, a, c);
        });
      };
      h.Re = function(a, b) {
        var c = this;
        Mg(this);
        var d = "/users/" + encodeURIComponent(a.email),
            e = ig(a);
        e.ab._method = "DELETE";
        this.pc(d, e, function(a, d) {
          !a && d && d.uid && c.nb && c.nb.uid && c.nb.uid === d.uid && Kg(c);
          R(b, a);
        });
      };
      h.pe = function(a, b) {
        Mg(this);
        var c = "/users/" + encodeURIComponent(a.email) + "/password",
            d = ig(a);
        d.ab._method = "PUT";
        d.ab.password = a.newPassword;
        this.pc(c, d, function(a) {
          R(b, a);
        });
      };
      h.oe = function(a, b) {
        Mg(this);
        var c = "/users/" + encodeURIComponent(a.oldEmail) + "/email",
            d = ig(a);
        d.ab._method = "PUT";
        d.ab.email = a.newEmail;
        d.ab.password = a.password;
        this.pc(c, d, function(a) {
          R(b, a);
        });
      };
      h.Se = function(a, b) {
        Mg(this);
        var c = "/users/" + encodeURIComponent(a.email) + "/password",
            d = ig(a);
        d.ab._method = "POST";
        this.pc(c, d, function(a) {
          R(b, a);
        });
      };
      h.pc = function(a, b, c) {
        Pg(this, [zg, Bg], a, b, c);
      };
      function Ng(a, b, c, d, e) {
        Pg(a, b, c, d, function(b, c) {
          !b && c && c.token && c.uid ? Jg(a, c.token, c, d.nd, function(a, b) {
            a ? R(e, a) : R(e, null, b);
          }) : R(e, b || xg("UNKNOWN_ERROR"));
        });
      }
      function Pg(a, b, c, d, e) {
        b = Pa(b, function(a) {
          return "function" === typeof a.isAvailable && a.isAvailable();
        });
        0 === b.length ? setTimeout(function() {
          R(e, xg("TRANSPORT_UNAVAILABLE"));
        }, 0) : (b = new (b.shift())(d.de), d = ib(d.ab), d.v = "js-2.2.3", d.transport = b.Bc(), d.suppress_status_codes = !0, a = rg() + "/" + a.H.Bb + c, b.open(a, d, function(a, b) {
          if (a)
            R(e, a);
          else if (b && b.error) {
            var c = Error(b.error.message);
            c.code = b.error.code;
            c.details = b.error.details;
            R(e, c);
          } else
            R(e, null, b);
        }));
      }
      function Gg(a, b) {
        var c = null !== a.nb || null !== b;
        a.nb = b;
        c && a.ee("auth_status", b);
        a.Ke(null !== b);
      }
      h.Ae = function(a) {
        J("auth_status" === a, 'initial event must be of type "auth_status"');
        return [this.nb];
      };
      function Mg(a) {
        var b = a.H;
        if ("firebaseio.com" !== b.domain && "firebaseio-demo.com" !== b.domain && "auth.firebase.com" === fg)
          throw Error("This custom Firebase server ('" + a.H.domain + "') does not support delegated login.");
      }
      ;
      function Qg(a) {
        this.ic = a;
        this.Md = [];
        this.Qb = 0;
        this.qe = -1;
        this.Eb = null;
      }
      function Rg(a, b, c) {
        a.qe = b;
        a.Eb = c;
        a.qe < a.Qb && (a.Eb(), a.Eb = null);
      }
      function Sg(a, b, c) {
        for (a.Md[b] = c; a.Md[a.Qb]; ) {
          var d = a.Md[a.Qb];
          delete a.Md[a.Qb];
          for (var e = 0; e < d.length; ++e)
            if (d[e]) {
              var f = a;
              Cb(function() {
                f.ic(d[e]);
              });
            }
          if (a.Qb === a.qe) {
            a.Eb && (clearTimeout(a.Eb), a.Eb(), a.Eb = null);
            break;
          }
          a.Qb++;
        }
      }
      ;
      function Tg(a, b, c) {
        this.re = a;
        this.f = Oc(a);
        this.ob = this.pb = 0;
        this.Va = Ob(b);
        this.Wd = c;
        this.Gc = !1;
        this.jd = function(a) {
          b.host !== b.Oa && (a.ns = b.Bb);
          var c = [],
              f;
          for (f in a)
            a.hasOwnProperty(f) && c.push(f + "=" + a[f]);
          return (b.lb ? "https://" : "http://") + b.Oa + "/.lp?" + c.join("&");
        };
      }
      var Ug,
          Vg;
      Tg.prototype.open = function(a, b) {
        this.ef = 0;
        this.ka = b;
        this.uf = new Qg(a);
        this.yb = !1;
        var c = this;
        this.rb = setTimeout(function() {
          c.f("Timed out trying to connect.");
          c.ib();
          c.rb = null;
        }, Math.floor(3E4));
        Tc(function() {
          if (!c.yb) {
            c.Ta = new Wg(function(a, b, d, k, l) {
              Xg(c, arguments);
              if (c.Ta)
                if (c.rb && (clearTimeout(c.rb), c.rb = null), c.Gc = !0, "start" == a)
                  c.id = b, c.Bf = d;
                else if ("close" === a)
                  b ? (c.Ta.Ud = !1, Rg(c.uf, b, function() {
                    c.ib();
                  })) : c.ib();
                else
                  throw Error("Unrecognized command received: " + a);
            }, function(a, b) {
              Xg(c, arguments);
              Sg(c.uf, a, b);
            }, function() {
              c.ib();
            }, c.jd);
            var a = {start: "t"};
            a.ser = Math.floor(1E8 * Math.random());
            c.Ta.ge && (a.cb = c.Ta.ge);
            a.v = "5";
            c.Wd && (a.s = c.Wd);
            "undefined" !== typeof location && location.href && -1 !== location.href.indexOf("firebaseio.com") && (a.r = "f");
            a = c.jd(a);
            c.f("Connecting via long-poll to " + a);
            Yg(c.Ta, a, function() {});
          }
        });
      };
      Tg.prototype.start = function() {
        var a = this.Ta,
            b = this.Bf;
        a.og = this.id;
        a.pg = b;
        for (a.le = !0; Zg(a); )
          ;
        a = this.id;
        b = this.Bf;
        this.gc = document.createElement("iframe");
        var c = {dframe: "t"};
        c.id = a;
        c.pw = b;
        this.gc.src = this.jd(c);
        this.gc.style.display = "none";
        document.body.appendChild(this.gc);
      };
      Tg.isAvailable = function() {
        return !Vg && !("object" === typeof window && window.chrome && window.chrome.extension && !/^chrome/.test(window.location.href)) && !("object" === typeof Windows && "object" === typeof Windows.Rg) && (Ug || !0);
      };
      h = Tg.prototype;
      h.Dd = function() {};
      h.ed = function() {
        this.yb = !0;
        this.Ta && (this.Ta.close(), this.Ta = null);
        this.gc && (document.body.removeChild(this.gc), this.gc = null);
        this.rb && (clearTimeout(this.rb), this.rb = null);
      };
      h.ib = function() {
        this.yb || (this.f("Longpoll is closing itself"), this.ed(), this.ka && (this.ka(this.Gc), this.ka = null));
      };
      h.close = function() {
        this.yb || (this.f("Longpoll is being closed."), this.ed());
      };
      h.send = function(a) {
        a = B(a);
        this.pb += a.length;
        Lb(this.Va, "bytes_sent", a.length);
        a = Kc(a);
        a = fb(a, !0);
        a = Xc(a, 1840);
        for (var b = 0; b < a.length; b++) {
          var c = this.Ta;
          c.ad.push({
            Gg: this.ef,
            Og: a.length,
            gf: a[b]
          });
          c.le && Zg(c);
          this.ef++;
        }
      };
      function Xg(a, b) {
        var c = B(b).length;
        a.ob += c;
        Lb(a.Va, "bytes_received", c);
      }
      function Wg(a, b, c, d) {
        this.jd = d;
        this.jb = c;
        this.Oe = new cg;
        this.ad = [];
        this.te = Math.floor(1E8 * Math.random());
        this.Ud = !0;
        this.ge = Gc();
        window["pLPCommand" + this.ge] = a;
        window["pRTLPCB" + this.ge] = b;
        a = document.createElement("iframe");
        a.style.display = "none";
        if (document.body) {
          document.body.appendChild(a);
          try {
            a.contentWindow.document || Bb("No IE domain setting required");
          } catch (e) {
            a.src = "javascript:void((function(){document.open();document.domain='" + document.domain + "';document.close();})())";
          }
        } else
          throw "Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
        a.contentDocument ? a.gb = a.contentDocument : a.contentWindow ? a.gb = a.contentWindow.document : a.document && (a.gb = a.document);
        this.Ca = a;
        a = "";
        this.Ca.src && "javascript:" === this.Ca.src.substr(0, 11) && (a = '<script>document.domain="' + document.domain + '";\x3c/script>');
        a = "<html><body>" + a + "</body></html>";
        try {
          this.Ca.gb.open(), this.Ca.gb.write(a), this.Ca.gb.close();
        } catch (f) {
          Bb("frame writing exception"), f.stack && Bb(f.stack), Bb(f);
        }
      }
      Wg.prototype.close = function() {
        this.le = !1;
        if (this.Ca) {
          this.Ca.gb.body.innerHTML = "";
          var a = this;
          setTimeout(function() {
            null !== a.Ca && (document.body.removeChild(a.Ca), a.Ca = null);
          }, Math.floor(0));
        }
        var b = this.jb;
        b && (this.jb = null, b());
      };
      function Zg(a) {
        if (a.le && a.Ud && a.Oe.count() < (0 < a.ad.length ? 2 : 1)) {
          a.te++;
          var b = {};
          b.id = a.og;
          b.pw = a.pg;
          b.ser = a.te;
          for (var b = a.jd(b),
              c = "",
              d = 0; 0 < a.ad.length; )
            if (1870 >= a.ad[0].gf.length + 30 + c.length) {
              var e = a.ad.shift(),
                  c = c + "&seg" + d + "=" + e.Gg + "&ts" + d + "=" + e.Og + "&d" + d + "=" + e.gf;
              d++;
            } else
              break;
          $g(a, b + c, a.te);
          return !0;
        }
        return !1;
      }
      function $g(a, b, c) {
        function d() {
          a.Oe.remove(c);
          Zg(a);
        }
        a.Oe.add(c, 1);
        var e = setTimeout(d, Math.floor(25E3));
        Yg(a, b, function() {
          clearTimeout(e);
          d();
        });
      }
      function Yg(a, b, c) {
        setTimeout(function() {
          try {
            if (a.Ud) {
              var d = a.Ca.gb.createElement("script");
              d.type = "text/javascript";
              d.async = !0;
              d.src = b;
              d.onload = d.onreadystatechange = function() {
                var a = d.readyState;
                a && "loaded" !== a && "complete" !== a || (d.onload = d.onreadystatechange = null, d.parentNode && d.parentNode.removeChild(d), c());
              };
              d.onerror = function() {
                Bb("Long-poll script failed to load: " + b);
                a.Ud = !1;
                a.close();
              };
              a.Ca.gb.body.appendChild(d);
            }
          } catch (e) {}
        }, Math.floor(1));
      }
      ;
      var ah = null;
      "undefined" !== typeof MozWebSocket ? ah = MozWebSocket : "undefined" !== typeof WebSocket && (ah = WebSocket);
      function bh(a, b, c) {
        this.re = a;
        this.f = Oc(this.re);
        this.frames = this.Jc = null;
        this.ob = this.pb = this.$e = 0;
        this.Va = Ob(b);
        this.fb = (b.lb ? "wss://" : "ws://") + b.Oa + "/.ws?v=5";
        "undefined" !== typeof location && location.href && -1 !== location.href.indexOf("firebaseio.com") && (this.fb += "&r=f");
        b.host !== b.Oa && (this.fb = this.fb + "&ns=" + b.Bb);
        c && (this.fb = this.fb + "&s=" + c);
      }
      var ch;
      bh.prototype.open = function(a, b) {
        this.jb = b;
        this.tg = a;
        this.f("Websocket connecting to " + this.fb);
        this.Gc = !1;
        Dc.set("previous_websocket_failure", !0);
        try {
          this.va = new ah(this.fb);
        } catch (c) {
          this.f("Error instantiating WebSocket.");
          var d = c.message || c.data;
          d && this.f(d);
          this.ib();
          return ;
        }
        var e = this;
        this.va.onopen = function() {
          e.f("Websocket connected.");
          e.Gc = !0;
        };
        this.va.onclose = function() {
          e.f("Websocket connection was disconnected.");
          e.va = null;
          e.ib();
        };
        this.va.onmessage = function(a) {
          if (null !== e.va)
            if (a = a.data, e.ob += a.length, Lb(e.Va, "bytes_received", a.length), dh(e), null !== e.frames)
              eh(e, a);
            else {
              a: {
                J(null === e.frames, "We already have a frame buffer");
                if (6 >= a.length) {
                  var b = Number(a);
                  if (!isNaN(b)) {
                    e.$e = b;
                    e.frames = [];
                    a = null;
                    break a;
                  }
                }
                e.$e = 1;
                e.frames = [];
              }
              null !== a && eh(e, a);
            }
        };
        this.va.onerror = function(a) {
          e.f("WebSocket error.  Closing connection.");
          (a = a.message || a.data) && e.f(a);
          e.ib();
        };
      };
      bh.prototype.start = function() {};
      bh.isAvailable = function() {
        var a = !1;
        if ("undefined" !== typeof navigator && navigator.userAgent) {
          var b = navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);
          b && 1 < b.length && 4.4 > parseFloat(b[1]) && (a = !0);
        }
        return !a && null !== ah && !ch;
      };
      bh.responsesRequiredToBeHealthy = 2;
      bh.healthyTimeout = 3E4;
      h = bh.prototype;
      h.Dd = function() {
        Dc.remove("previous_websocket_failure");
      };
      function eh(a, b) {
        a.frames.push(b);
        if (a.frames.length == a.$e) {
          var c = a.frames.join("");
          a.frames = null;
          c = mb(c);
          a.tg(c);
        }
      }
      h.send = function(a) {
        dh(this);
        a = B(a);
        this.pb += a.length;
        Lb(this.Va, "bytes_sent", a.length);
        a = Xc(a, 16384);
        1 < a.length && this.va.send(String(a.length));
        for (var b = 0; b < a.length; b++)
          this.va.send(a[b]);
      };
      h.ed = function() {
        this.yb = !0;
        this.Jc && (clearInterval(this.Jc), this.Jc = null);
        this.va && (this.va.close(), this.va = null);
      };
      h.ib = function() {
        this.yb || (this.f("WebSocket is closing itself"), this.ed(), this.jb && (this.jb(this.Gc), this.jb = null));
      };
      h.close = function() {
        this.yb || (this.f("WebSocket is being closed"), this.ed());
      };
      function dh(a) {
        clearInterval(a.Jc);
        a.Jc = setInterval(function() {
          a.va && a.va.send("0");
          dh(a);
        }, Math.floor(45E3));
      }
      ;
      function fh(a) {
        gh(this, a);
      }
      var hh = [Tg, bh];
      function gh(a, b) {
        var c = bh && bh.isAvailable(),
            d = c && !(Dc.rf || !0 === Dc.get("previous_websocket_failure"));
        b.Qg && (c || Q("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."), d = !0);
        if (d)
          a.gd = [bh];
        else {
          var e = a.gd = [];
          Yc(hh, function(a, b) {
            b && b.isAvailable() && e.push(b);
          });
        }
      }
      function ih(a) {
        if (0 < a.gd.length)
          return a.gd[0];
        throw Error("No transports available");
      }
      ;
      function jh(a, b, c, d, e, f) {
        this.id = a;
        this.f = Oc("c:" + this.id + ":");
        this.ic = c;
        this.Vc = d;
        this.ka = e;
        this.Me = f;
        this.H = b;
        this.Ld = [];
        this.cf = 0;
        this.Kf = new fh(b);
        this.Ua = 0;
        this.f("Connection created");
        kh(this);
      }
      function kh(a) {
        var b = ih(a.Kf);
        a.L = new b("c:" + a.id + ":" + a.cf++, a.H);
        a.Qe = b.responsesRequiredToBeHealthy || 0;
        var c = lh(a, a.L),
            d = mh(a, a.L);
        a.hd = a.L;
        a.dd = a.L;
        a.F = null;
        a.zb = !1;
        setTimeout(function() {
          a.L && a.L.open(c, d);
        }, Math.floor(0));
        b = b.healthyTimeout || 0;
        0 < b && (a.xd = setTimeout(function() {
          a.xd = null;
          a.zb || (a.L && 102400 < a.L.ob ? (a.f("Connection exceeded healthy timeout but has received " + a.L.ob + " bytes.  Marking connection healthy."), a.zb = !0, a.L.Dd()) : a.L && 10240 < a.L.pb ? a.f("Connection exceeded healthy timeout but has sent " + a.L.pb + " bytes.  Leaving connection alive.") : (a.f("Closing unhealthy connection after timeout."), a.close()));
        }, Math.floor(b)));
      }
      function mh(a, b) {
        return function(c) {
          b === a.L ? (a.L = null, c || 0 !== a.Ua ? 1 === a.Ua && a.f("Realtime connection lost.") : (a.f("Realtime connection failed."), "s-" === a.H.Oa.substr(0, 2) && (Dc.remove("host:" + a.H.host), a.H.Oa = a.H.host)), a.close()) : b === a.F ? (a.f("Secondary connection lost."), c = a.F, a.F = null, a.hd !== c && a.dd !== c || a.close()) : a.f("closing an old connection");
        };
      }
      function lh(a, b) {
        return function(c) {
          if (2 != a.Ua)
            if (b === a.dd) {
              var d = Vc("t", c);
              c = Vc("d", c);
              if ("c" == d) {
                if (d = Vc("t", c), "d" in c)
                  if (c = c.d, "h" === d) {
                    var d = c.ts,
                        e = c.v,
                        f = c.h;
                    a.Wd = c.s;
                    Fc(a.H, f);
                    0 == a.Ua && (a.L.start(), nh(a, a.L, d), "5" !== e && Q("Protocol version mismatch detected"), c = a.Kf, (c = 1 < c.gd.length ? c.gd[1] : null) && oh(a, c));
                  } else if ("n" === d) {
                    a.f("recvd end transmission on primary");
                    a.dd = a.F;
                    for (c = 0; c < a.Ld.length; ++c)
                      a.Hd(a.Ld[c]);
                    a.Ld = [];
                    ph(a);
                  } else
                    "s" === d ? (a.f("Connection shutdown command received. Shutting down..."), a.Me && (a.Me(c), a.Me = null), a.ka = null, a.close()) : "r" === d ? (a.f("Reset packet received.  New host: " + c), Fc(a.H, c), 1 === a.Ua ? a.close() : (qh(a), kh(a))) : "e" === d ? Pc("Server Error: " + c) : "o" === d ? (a.f("got pong on primary."), rh(a), sh(a)) : Pc("Unknown control packet command: " + d);
              } else
                "d" == d && a.Hd(c);
            } else if (b === a.F)
              if (d = Vc("t", c), c = Vc("d", c), "c" == d)
                "t" in c && (c = c.t, "a" === c ? th(a) : "r" === c ? (a.f("Got a reset on secondary, closing it"), a.F.close(), a.hd !== a.F && a.dd !== a.F || a.close()) : "o" === c && (a.f("got pong on secondary."), a.If--, th(a)));
              else if ("d" == d)
                a.Ld.push(c);
              else
                throw Error("Unknown protocol layer: " + d);
            else
              a.f("message on old connection");
        };
      }
      jh.prototype.Da = function(a) {
        uh(this, {
          t: "d",
          d: a
        });
      };
      function ph(a) {
        a.hd === a.F && a.dd === a.F && (a.f("cleaning up and promoting a connection: " + a.F.re), a.L = a.F, a.F = null);
      }
      function th(a) {
        0 >= a.If ? (a.f("Secondary connection is healthy."), a.zb = !0, a.F.Dd(), a.F.start(), a.f("sending client ack on secondary"), a.F.send({
          t: "c",
          d: {
            t: "a",
            d: {}
          }
        }), a.f("Ending transmission on primary"), a.L.send({
          t: "c",
          d: {
            t: "n",
            d: {}
          }
        }), a.hd = a.F, ph(a)) : (a.f("sending ping on secondary."), a.F.send({
          t: "c",
          d: {
            t: "p",
            d: {}
          }
        }));
      }
      jh.prototype.Hd = function(a) {
        rh(this);
        this.ic(a);
      };
      function rh(a) {
        a.zb || (a.Qe--, 0 >= a.Qe && (a.f("Primary connection is healthy."), a.zb = !0, a.L.Dd()));
      }
      function oh(a, b) {
        a.F = new b("c:" + a.id + ":" + a.cf++, a.H, a.Wd);
        a.If = b.responsesRequiredToBeHealthy || 0;
        a.F.open(lh(a, a.F), mh(a, a.F));
        setTimeout(function() {
          a.F && (a.f("Timed out trying to upgrade."), a.F.close());
        }, Math.floor(6E4));
      }
      function nh(a, b, c) {
        a.f("Realtime connection established.");
        a.L = b;
        a.Ua = 1;
        a.Vc && (a.Vc(c), a.Vc = null);
        0 === a.Qe ? (a.f("Primary connection is healthy."), a.zb = !0) : setTimeout(function() {
          sh(a);
        }, Math.floor(5E3));
      }
      function sh(a) {
        a.zb || 1 !== a.Ua || (a.f("sending ping on primary."), uh(a, {
          t: "c",
          d: {
            t: "p",
            d: {}
          }
        }));
      }
      function uh(a, b) {
        if (1 !== a.Ua)
          throw "Connection is not connected";
        a.hd.send(b);
      }
      jh.prototype.close = function() {
        2 !== this.Ua && (this.f("Closing realtime connection."), this.Ua = 2, qh(this), this.ka && (this.ka(), this.ka = null));
      };
      function qh(a) {
        a.f("Shutting down all connections");
        a.L && (a.L.close(), a.L = null);
        a.F && (a.F.close(), a.F = null);
        a.xd && (clearTimeout(a.xd), a.xd = null);
      }
      ;
      function vh(a, b, c, d) {
        this.id = wh++;
        this.f = Oc("p:" + this.id + ":");
        this.Kb = !0;
        this.aa = {};
        this.pa = [];
        this.Yc = 0;
        this.Uc = [];
        this.ma = !1;
        this.$a = 1E3;
        this.Ed = 3E5;
        this.Fb = b;
        this.Tc = c;
        this.Ne = d;
        this.H = a;
        this.Ue = null;
        this.cd = {};
        this.Fg = 0;
        this.Kc = this.Fe = null;
        xh(this, 0);
        Mf.Wb().Db("visible", this.wg, this);
        -1 === a.host.indexOf("fblocal") && Lf.Wb().Db("online", this.ug, this);
      }
      var wh = 0,
          yh = 0;
      h = vh.prototype;
      h.Da = function(a, b, c) {
        var d = ++this.Fg;
        a = {
          r: d,
          a: a,
          b: b
        };
        this.f(B(a));
        J(this.ma, "sendRequest call when we're not connected not allowed.");
        this.Sa.Da(a);
        c && (this.cd[d] = c);
      };
      h.sf = function(a, b, c, d) {
        var e = a.wa(),
            f = a.path.toString();
        this.f("Listen called for " + f + " " + e);
        this.aa[f] = this.aa[f] || {};
        J(!this.aa[f][e], "listen() called twice for same path/queryId.");
        a = {
          J: d,
          wd: b,
          Cg: a,
          tag: c
        };
        this.aa[f][e] = a;
        this.ma && zh(this, a);
      };
      function zh(a, b) {
        var c = b.Cg,
            d = c.path.toString(),
            e = c.wa();
        a.f("Listen on " + d + " for " + e);
        var f = {p: d};
        b.tag && (f.q = ce(c.n), f.t = b.tag);
        f.h = b.wd();
        a.Da("q", f, function(f) {
          var k = f.d,
              l = f.s;
          if (k && "object" === typeof k && u(k, "w")) {
            var m = w(k, "w");
            ea(m) && 0 <= Na(m, "no_index") && Q("Using an unspecified index. Consider adding " + ('".indexOn": "' + c.n.g.toString() + '"') + " at " + c.path.toString() + " to your security rules for better performance");
          }
          (a.aa[d] && a.aa[d][e]) === b && (a.f("listen response", f), "ok" !== l && Ah(a, d, e), b.J && b.J(l, k));
        });
      }
      h.P = function(a, b, c) {
        this.Fa = {
          cg: a,
          kf: !1,
          yc: b,
          ld: c
        };
        this.f("Authenticating using credential: " + a);
        Bh(this);
        (b = 40 == a.length) || (a = ad(a).Ac, b = "object" === typeof a && !0 === w(a, "admin"));
        b && (this.f("Admin auth credential detected.  Reducing max reconnect time."), this.Ed = 3E4);
      };
      h.fe = function(a) {
        delete this.Fa;
        this.ma && this.Da("unauth", {}, function(b) {
          a(b.s, b.d);
        });
      };
      function Bh(a) {
        var b = a.Fa;
        a.ma && b && a.Da("auth", {cred: b.cg}, function(c) {
          var d = c.s;
          c = c.d || "error";
          "ok" !== d && a.Fa === b && delete a.Fa;
          b.kf ? "ok" !== d && b.ld && b.ld(d, c) : (b.kf = !0, b.yc && b.yc(d, c));
        });
      }
      h.Lf = function(a, b) {
        var c = a.path.toString(),
            d = a.wa();
        this.f("Unlisten called for " + c + " " + d);
        if (Ah(this, c, d) && this.ma) {
          var e = ce(a.n);
          this.f("Unlisten on " + c + " for " + d);
          c = {p: c};
          b && (c.q = e, c.t = b);
          this.Da("n", c);
        }
      };
      h.Le = function(a, b, c) {
        this.ma ? Ch(this, "o", a, b, c) : this.Uc.push({
          $c: a,
          action: "o",
          data: b,
          J: c
        });
      };
      h.xf = function(a, b, c) {
        this.ma ? Ch(this, "om", a, b, c) : this.Uc.push({
          $c: a,
          action: "om",
          data: b,
          J: c
        });
      };
      h.Id = function(a, b) {
        this.ma ? Ch(this, "oc", a, null, b) : this.Uc.push({
          $c: a,
          action: "oc",
          data: null,
          J: b
        });
      };
      function Ch(a, b, c, d, e) {
        c = {
          p: c,
          d: d
        };
        a.f("onDisconnect " + b, c);
        a.Da(b, c, function(a) {
          e && setTimeout(function() {
            e(a.s, a.d);
          }, Math.floor(0));
        });
      }
      h.put = function(a, b, c, d) {
        Dh(this, "p", a, b, c, d);
      };
      h.tf = function(a, b, c, d) {
        Dh(this, "m", a, b, c, d);
      };
      function Dh(a, b, c, d, e, f) {
        d = {
          p: c,
          d: d
        };
        n(f) && (d.h = f);
        a.pa.push({
          action: b,
          Ff: d,
          J: e
        });
        a.Yc++;
        b = a.pa.length - 1;
        a.ma ? Eh(a, b) : a.f("Buffering put: " + c);
      }
      function Eh(a, b) {
        var c = a.pa[b].action,
            d = a.pa[b].Ff,
            e = a.pa[b].J;
        a.pa[b].Dg = a.ma;
        a.Da(c, d, function(d) {
          a.f(c + " response", d);
          delete a.pa[b];
          a.Yc--;
          0 === a.Yc && (a.pa = []);
          e && e(d.s, d.d);
        });
      }
      h.Df = function(a) {
        this.ma && (a = {c: a}, this.f("reportStats", a), this.Da("s", a));
      };
      h.Hd = function(a) {
        if ("r" in a) {
          this.f("from server: " + B(a));
          var b = a.r,
              c = this.cd[b];
          c && (delete this.cd[b], c(a.b));
        } else {
          if ("error" in a)
            throw "A server-side error has occurred: " + a.error;
          "a" in a && (b = a.a, c = a.b, this.f("handleServerMessage", b, c), "d" === b ? this.Fb(c.p, c.d, !1, c.t) : "m" === b ? this.Fb(c.p, c.d, !0, c.t) : "c" === b ? Fh(this, c.p, c.q) : "ac" === b ? (a = c.s, b = c.d, c = this.Fa, delete this.Fa, c && c.ld && c.ld(a, b)) : "sd" === b ? this.Ue ? this.Ue(c) : "msg" in c && "undefined" !== typeof console && console.log("FIREBASE: " + c.msg.replace("\n", "\nFIREBASE: ")) : Pc("Unrecognized action received from server: " + B(b) + "\nAre you using the latest client?"));
        }
      };
      h.Vc = function(a) {
        this.f("connection ready");
        this.ma = !0;
        this.Kc = (new Date).getTime();
        this.Ne({serverTimeOffset: a - (new Date).getTime()});
        Gh(this);
        this.Tc(!0);
      };
      function xh(a, b) {
        J(!a.Sa, "Scheduling a connect when we're already connected/ing?");
        a.Sb && clearTimeout(a.Sb);
        a.Sb = setTimeout(function() {
          a.Sb = null;
          Hh(a);
        }, Math.floor(b));
      }
      h.wg = function(a) {
        a && !this.uc && this.$a === this.Ed && (this.f("Window became visible.  Reducing delay."), this.$a = 1E3, this.Sa || xh(this, 0));
        this.uc = a;
      };
      h.ug = function(a) {
        a ? (this.f("Browser went online.  Reconnecting."), this.$a = 1E3, this.Kb = !0, this.Sa || xh(this, 0)) : (this.f("Browser went offline.  Killing connection; don't reconnect."), this.Kb = !1, this.Sa && this.Sa.close());
      };
      h.yf = function() {
        this.f("data client disconnected");
        this.ma = !1;
        this.Sa = null;
        for (var a = 0; a < this.pa.length; a++) {
          var b = this.pa[a];
          b && "h" in b.Ff && b.Dg && (b.J && b.J("disconnect"), delete this.pa[a], this.Yc--);
        }
        0 === this.Yc && (this.pa = []);
        if (this.Kb)
          this.uc ? this.Kc && (3E4 < (new Date).getTime() - this.Kc && (this.$a = 1E3), this.Kc = null) : (this.f("Window isn't visible.  Delaying reconnect."), this.$a = this.Ed, this.Fe = (new Date).getTime()), a = Math.max(0, this.$a - ((new Date).getTime() - this.Fe)), a *= Math.random(), this.f("Trying to reconnect in " + a + "ms"), xh(this, a), this.$a = Math.min(this.Ed, 1.3 * this.$a);
        else
          for (var c in this.cd)
            delete this.cd[c];
        this.Tc(!1);
      };
      function Hh(a) {
        if (a.Kb) {
          a.f("Making a connection attempt");
          a.Fe = (new Date).getTime();
          a.Kc = null;
          var b = q(a.Hd, a),
              c = q(a.Vc, a),
              d = q(a.yf, a),
              e = a.id + ":" + yh++;
          a.Sa = new jh(e, a.H, b, c, d, function(b) {
            Q(b + " (" + a.H.toString() + ")");
            a.Kb = !1;
          });
        }
      }
      h.xb = function() {
        this.Kb = !1;
        this.Sa ? this.Sa.close() : (this.Sb && (clearTimeout(this.Sb), this.Sb = null), this.ma && this.yf());
      };
      h.qc = function() {
        this.Kb = !0;
        this.$a = 1E3;
        this.Sa || xh(this, 0);
      };
      function Fh(a, b, c) {
        c = c ? Qa(c, function(a) {
          return Wc(a);
        }).join("$") : "default";
        (a = Ah(a, b, c)) && a.J && a.J("permission_denied");
      }
      function Ah(a, b, c) {
        b = (new K(b)).toString();
        var d;
        n(a.aa[b]) ? (d = a.aa[b][c], delete a.aa[b][c], 0 === pa(a.aa[b]) && delete a.aa[b]) : d = void 0;
        return d;
      }
      function Gh(a) {
        Bh(a);
        r(a.aa, function(b) {
          r(b, function(b) {
            zh(a, b);
          });
        });
        for (var b = 0; b < a.pa.length; b++)
          a.pa[b] && Eh(a, b);
        for (; a.Uc.length; )
          b = a.Uc.shift(), Ch(a, b.action, b.$c, b.data, b.J);
      }
      ;
      var V = {ig: function() {
          Ug = ch = !0;
        }};
      V.forceLongPolling = V.ig;
      V.jg = function() {
        Vg = !0;
      };
      V.forceWebSockets = V.jg;
      V.Jg = function(a, b) {
        a.k.Ra.Ue = b;
      };
      V.setSecurityDebugCallback = V.Jg;
      V.We = function(a, b) {
        a.k.We(b);
      };
      V.stats = V.We;
      V.Xe = function(a, b) {
        a.k.Xe(b);
      };
      V.statsIncrementCounter = V.Xe;
      V.rd = function(a) {
        return a.k.rd;
      };
      V.dataUpdateCount = V.rd;
      V.mg = function(a, b) {
        a.k.De = b;
      };
      V.interceptServerData = V.mg;
      V.sg = function(a) {
        new tg(a);
      };
      V.onPopupOpen = V.sg;
      V.Hg = function(a) {
        fg = a;
      };
      V.setAuthenticationServer = V.Hg;
      function S(a, b, c) {
        this.B = a;
        this.V = b;
        this.g = c;
      }
      S.prototype.K = function() {
        x("Firebase.DataSnapshot.val", 0, 0, arguments.length);
        return this.B.K();
      };
      S.prototype.val = S.prototype.K;
      S.prototype.jf = function() {
        x("Firebase.DataSnapshot.exportVal", 0, 0, arguments.length);
        return this.B.K(!0);
      };
      S.prototype.exportVal = S.prototype.jf;
      S.prototype.hg = function() {
        x("Firebase.DataSnapshot.exists", 0, 0, arguments.length);
        return !this.B.e();
      };
      S.prototype.exists = S.prototype.hg;
      S.prototype.w = function(a) {
        x("Firebase.DataSnapshot.child", 0, 1, arguments.length);
        ga(a) && (a = String(a));
        Xf("Firebase.DataSnapshot.child", a);
        var b = new K(a),
            c = this.V.w(b);
        return new S(this.B.oa(b), c, M);
      };
      S.prototype.child = S.prototype.w;
      S.prototype.Ha = function(a) {
        x("Firebase.DataSnapshot.hasChild", 1, 1, arguments.length);
        Xf("Firebase.DataSnapshot.hasChild", a);
        var b = new K(a);
        return !this.B.oa(b).e();
      };
      S.prototype.hasChild = S.prototype.Ha;
      S.prototype.A = function() {
        x("Firebase.DataSnapshot.getPriority", 0, 0, arguments.length);
        return this.B.A().K();
      };
      S.prototype.getPriority = S.prototype.A;
      S.prototype.forEach = function(a) {
        x("Firebase.DataSnapshot.forEach", 1, 1, arguments.length);
        A("Firebase.DataSnapshot.forEach", 1, a, !1);
        if (this.B.N())
          return !1;
        var b = this;
        return !!this.B.U(this.g, function(c, d) {
          return a(new S(d, b.V.w(c), M));
        });
      };
      S.prototype.forEach = S.prototype.forEach;
      S.prototype.vd = function() {
        x("Firebase.DataSnapshot.hasChildren", 0, 0, arguments.length);
        return this.B.N() ? !1 : !this.B.e();
      };
      S.prototype.hasChildren = S.prototype.vd;
      S.prototype.name = function() {
        Q("Firebase.DataSnapshot.name() being deprecated. Please use Firebase.DataSnapshot.key() instead.");
        x("Firebase.DataSnapshot.name", 0, 0, arguments.length);
        return this.key();
      };
      S.prototype.name = S.prototype.name;
      S.prototype.key = function() {
        x("Firebase.DataSnapshot.key", 0, 0, arguments.length);
        return this.V.key();
      };
      S.prototype.key = S.prototype.key;
      S.prototype.Cb = function() {
        x("Firebase.DataSnapshot.numChildren", 0, 0, arguments.length);
        return this.B.Cb();
      };
      S.prototype.numChildren = S.prototype.Cb;
      S.prototype.lc = function() {
        x("Firebase.DataSnapshot.ref", 0, 0, arguments.length);
        return this.V;
      };
      S.prototype.ref = S.prototype.lc;
      function Ih(a, b) {
        this.H = a;
        this.Va = Ob(a);
        this.ea = new ub;
        this.Gd = 1;
        this.Ra = null;
        b || 0 <= ("object" === typeof window && window.navigator && window.navigator.userAgent || "").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i) ? (this.ca = new Ae(this.H, q(this.Fb, this)), setTimeout(q(this.Tc, this, !0), 0)) : this.ca = this.Ra = new vh(this.H, q(this.Fb, this), q(this.Tc, this), q(this.Ne, this));
        this.Mg = Pb(a, q(function() {
          return new Jb(this.Va, this.ca);
        }, this));
        this.tc = new Cf;
        this.Ce = new nb;
        var c = this;
        this.Bd = new gf({
          Ve: function(a, b, f, g) {
            b = [];
            f = c.Ce.j(a.path);
            f.e() || (b = jf(c.Bd, new Ub(ze, a.path, f)), setTimeout(function() {
              g("ok");
            }, 0));
            return b;
          },
          $d: ba
        });
        Jh(this, "connected", !1);
        this.ka = new qc;
        this.P = new Dg(a, q(this.ca.P, this.ca), q(this.ca.fe, this.ca), q(this.Ke, this));
        this.rd = 0;
        this.De = null;
        this.O = new gf({
          Ve: function(a, b, f, g) {
            c.ca.sf(a, f, b, function(b, e) {
              var f = g(b, e);
              zb(c.ea, a.path, f);
            });
            return [];
          },
          $d: function(a, b) {
            c.ca.Lf(a, b);
          }
        });
      }
      h = Ih.prototype;
      h.toString = function() {
        return (this.H.lb ? "https://" : "http://") + this.H.host;
      };
      h.name = function() {
        return this.H.Bb;
      };
      function Kh(a) {
        a = a.Ce.j(new K(".info/serverTimeOffset")).K() || 0;
        return (new Date).getTime() + a;
      }
      function Lh(a) {
        a = a = {timestamp: Kh(a)};
        a.timestamp = a.timestamp || (new Date).getTime();
        return a;
      }
      h.Fb = function(a, b, c, d) {
        this.rd++;
        var e = new K(a);
        b = this.De ? this.De(a, b) : b;
        a = [];
        d ? c ? (b = na(b, function(a) {
          return L(a);
        }), a = rf(this.O, e, b, d)) : (b = L(b), a = nf(this.O, e, b, d)) : c ? (d = na(b, function(a) {
          return L(a);
        }), a = mf(this.O, e, d)) : (d = L(b), a = jf(this.O, new Ub(ze, e, d)));
        d = e;
        0 < a.length && (d = Mh(this, e));
        zb(this.ea, d, a);
      };
      h.Tc = function(a) {
        Jh(this, "connected", a);
        !1 === a && Nh(this);
      };
      h.Ne = function(a) {
        var b = this;
        Yc(a, function(a, d) {
          Jh(b, d, a);
        });
      };
      h.Ke = function(a) {
        Jh(this, "authenticated", a);
      };
      function Jh(a, b, c) {
        b = new K("/.info/" + b);
        c = L(c);
        var d = a.Ce;
        d.Td = d.Td.G(b, c);
        c = jf(a.Bd, new Ub(ze, b, c));
        zb(a.ea, b, c);
      }
      h.Jb = function(a, b, c, d) {
        this.f("set", {
          path: a.toString(),
          value: b,
          Ug: c
        });
        var e = Lh(this);
        b = L(b, c);
        var e = sc(b, e),
            f = this.Gd++,
            e = hf(this.O, a, e, f, !0);
        vb(this.ea, e);
        var g = this;
        this.ca.put(a.toString(), b.K(!0), function(b, c) {
          var e = "ok" === b;
          e || Q("set at " + a + " failed: " + b);
          e = lf(g.O, f, !e);
          zb(g.ea, a, e);
          Oh(d, b, c);
        });
        e = Ph(this, a);
        Mh(this, e);
        zb(this.ea, e, []);
      };
      h.update = function(a, b, c) {
        this.f("update", {
          path: a.toString(),
          value: b
        });
        var d = !0,
            e = Lh(this),
            f = {};
        r(b, function(a, b) {
          d = !1;
          var c = L(a);
          f[b] = sc(c, e);
        });
        if (d)
          Bb("update() called with empty data.  Don't do anything."), Oh(c, "ok");
        else {
          var g = this.Gd++,
              k = kf(this.O, a, f, g);
          vb(this.ea, k);
          var l = this;
          this.ca.tf(a.toString(), b, function(b, d) {
            var e = "ok" === b;
            e || Q("update at " + a + " failed: " + b);
            var e = lf(l.O, g, !e),
                f = a;
            0 < e.length && (f = Mh(l, a));
            zb(l.ea, f, e);
            Oh(c, b, d);
          });
          b = Ph(this, a);
          Mh(this, b);
          zb(this.ea, a, []);
        }
      };
      function Nh(a) {
        a.f("onDisconnectEvents");
        var b = Lh(a),
            c = [];
        rc(pc(a.ka, b), F, function(b, e) {
          c = c.concat(jf(a.O, new Ub(ze, b, e)));
          var f = Ph(a, b);
          Mh(a, f);
        });
        a.ka = new qc;
        zb(a.ea, F, c);
      }
      h.Id = function(a, b) {
        var c = this;
        this.ca.Id(a.toString(), function(d, e) {
          "ok" === d && eg(c.ka, a);
          Oh(b, d, e);
        });
      };
      function Qh(a, b, c, d) {
        var e = L(c);
        a.ca.Le(b.toString(), e.K(!0), function(c, g) {
          "ok" === c && a.ka.mc(b, e);
          Oh(d, c, g);
        });
      }
      function Rh(a, b, c, d, e) {
        var f = L(c, d);
        a.ca.Le(b.toString(), f.K(!0), function(c, d) {
          "ok" === c && a.ka.mc(b, f);
          Oh(e, c, d);
        });
      }
      function Sh(a, b, c, d) {
        var e = !0,
            f;
        for (f in c)
          e = !1;
        e ? (Bb("onDisconnect().update() called with empty data.  Don't do anything."), Oh(d, "ok")) : a.ca.xf(b.toString(), c, function(e, f) {
          if ("ok" === e)
            for (var l in c) {
              var m = L(c[l]);
              a.ka.mc(b.w(l), m);
            }
          Oh(d, e, f);
        });
      }
      function Th(a, b, c) {
        c = ".info" === O(b.path) ? a.Bd.Ob(b, c) : a.O.Ob(b, c);
        xb(a.ea, b.path, c);
      }
      h.xb = function() {
        this.Ra && this.Ra.xb();
      };
      h.qc = function() {
        this.Ra && this.Ra.qc();
      };
      h.We = function(a) {
        if ("undefined" !== typeof console) {
          a ? (this.Zd || (this.Zd = new Ib(this.Va)), a = this.Zd.get()) : a = this.Va.get();
          var b = Ra(sa(a), function(a, b) {
            return Math.max(b.length, a);
          }, 0),
              c;
          for (c in a) {
            for (var d = a[c],
                e = c.length; e < b + 2; e++)
              c += " ";
            console.log(c + d);
          }
        }
      };
      h.Xe = function(a) {
        Lb(this.Va, a);
        this.Mg.Jf[a] = !0;
      };
      h.f = function(a) {
        var b = "";
        this.Ra && (b = this.Ra.id + ":");
        Bb(b, arguments);
      };
      function Oh(a, b, c) {
        a && Cb(function() {
          if ("ok" == b)
            a(null);
          else {
            var d = (b || "error").toUpperCase(),
                e = d;
            c && (e += ": " + c);
            e = Error(e);
            e.code = d;
            a(e);
          }
        });
      }
      ;
      function Uh(a, b, c, d, e) {
        function f() {}
        a.f("transaction on " + b);
        var g = new U(a, b);
        g.Db("value", f);
        c = {
          path: b,
          update: c,
          J: d,
          status: null,
          Af: Gc(),
          af: e,
          Hf: 0,
          he: function() {
            g.hc("value", f);
          },
          ke: null,
          Aa: null,
          od: null,
          pd: null,
          qd: null
        };
        d = a.O.ua(b, void 0) || C;
        c.od = d;
        d = c.update(d.K());
        if (n(d)) {
          Sf("transaction failed: Data returned ", d, c.path);
          c.status = 1;
          e = Df(a.tc, b);
          var k = e.Ba() || [];
          k.push(c);
          Ef(e, k);
          "object" === typeof d && null !== d && u(d, ".priority") ? (k = w(d, ".priority"), J(Qf(k), "Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")) : k = (a.O.ua(b) || C).A().K();
          e = Lh(a);
          d = L(d, k);
          e = sc(d, e);
          c.pd = d;
          c.qd = e;
          c.Aa = a.Gd++;
          c = hf(a.O, b, e, c.Aa, c.af);
          zb(a.ea, b, c);
          Vh(a);
        } else
          c.he(), c.pd = null, c.qd = null, c.J && (a = new S(c.od, new U(a, c.path), M), c.J(null, !1, a));
      }
      function Vh(a, b) {
        var c = b || a.tc;
        b || Wh(a, c);
        if (null !== c.Ba()) {
          var d = Xh(a, c);
          J(0 < d.length, "Sending zero length transaction queue");
          Sa(d, function(a) {
            return 1 === a.status;
          }) && Yh(a, c.path(), d);
        } else
          c.vd() && c.U(function(b) {
            Vh(a, b);
          });
      }
      function Yh(a, b, c) {
        for (var d = Qa(c, function(a) {
          return a.Aa;
        }),
            e = a.O.ua(b, d) || C,
            d = e,
            e = e.hash(),
            f = 0; f < c.length; f++) {
          var g = c[f];
          J(1 === g.status, "tryToSendTransactionQueue_: items in queue should all be run.");
          g.status = 2;
          g.Hf++;
          var k = N(b, g.path),
              d = d.G(k, g.pd);
        }
        d = d.K(!0);
        a.ca.put(b.toString(), d, function(d) {
          a.f("transaction put response", {
            path: b.toString(),
            status: d
          });
          var e = [];
          if ("ok" === d) {
            d = [];
            for (f = 0; f < c.length; f++) {
              c[f].status = 3;
              e = e.concat(lf(a.O, c[f].Aa));
              if (c[f].J) {
                var g = c[f].qd,
                    k = new U(a, c[f].path);
                d.push(q(c[f].J, null, null, !0, new S(g, k, M)));
              }
              c[f].he();
            }
            Wh(a, Df(a.tc, b));
            Vh(a);
            zb(a.ea, b, e);
            for (f = 0; f < d.length; f++)
              Cb(d[f]);
          } else {
            if ("datastale" === d)
              for (f = 0; f < c.length; f++)
                c[f].status = 4 === c[f].status ? 5 : 1;
            else
              for (Q("transaction at " + b.toString() + " failed: " + d), f = 0; f < c.length; f++)
                c[f].status = 5, c[f].ke = d;
            Mh(a, b);
          }
        }, e);
      }
      function Mh(a, b) {
        var c = Zh(a, b),
            d = c.path(),
            c = Xh(a, c);
        $h(a, c, d);
        return d;
      }
      function $h(a, b, c) {
        if (0 !== b.length) {
          for (var d = [],
              e = [],
              f = Qa(b, function(a) {
                return a.Aa;
              }),
              g = 0; g < b.length; g++) {
            var k = b[g],
                l = N(c, k.path),
                m = !1,
                v;
            J(null !== l, "rerunTransactionsUnderNode_: relativePath should not be null.");
            if (5 === k.status)
              m = !0, v = k.ke, e = e.concat(lf(a.O, k.Aa, !0));
            else if (1 === k.status)
              if (25 <= k.Hf)
                m = !0, v = "maxretry", e = e.concat(lf(a.O, k.Aa, !0));
              else {
                var y = a.O.ua(k.path, f) || C;
                k.od = y;
                var I = b[g].update(y.K());
                n(I) ? (Sf("transaction failed: Data returned ", I, k.path), l = L(I), "object" === typeof I && null != I && u(I, ".priority") || (l = l.da(y.A())), y = k.Aa, I = Lh(a), I = sc(l, I), k.pd = l, k.qd = I, k.Aa = a.Gd++, Va(f, y), e = e.concat(hf(a.O, k.path, I, k.Aa, k.af)), e = e.concat(lf(a.O, y, !0))) : (m = !0, v = "nodata", e = e.concat(lf(a.O, k.Aa, !0)));
              }
            zb(a.ea, c, e);
            e = [];
            m && (b[g].status = 3, setTimeout(b[g].he, Math.floor(0)), b[g].J && ("nodata" === v ? (k = new U(a, b[g].path), d.push(q(b[g].J, null, null, !1, new S(b[g].od, k, M)))) : d.push(q(b[g].J, null, Error(v), !1, null))));
          }
          Wh(a, a.tc);
          for (g = 0; g < d.length; g++)
            Cb(d[g]);
          Vh(a);
        }
      }
      function Zh(a, b) {
        for (var c,
            d = a.tc; null !== (c = O(b)) && null === d.Ba(); )
          d = Df(d, c), b = G(b);
        return d;
      }
      function Xh(a, b) {
        var c = [];
        ai(a, b, c);
        c.sort(function(a, b) {
          return a.Af - b.Af;
        });
        return c;
      }
      function ai(a, b, c) {
        var d = b.Ba();
        if (null !== d)
          for (var e = 0; e < d.length; e++)
            c.push(d[e]);
        b.U(function(b) {
          ai(a, b, c);
        });
      }
      function Wh(a, b) {
        var c = b.Ba();
        if (c) {
          for (var d = 0,
              e = 0; e < c.length; e++)
            3 !== c[e].status && (c[d] = c[e], d++);
          c.length = d;
          Ef(b, 0 < c.length ? c : null);
        }
        b.U(function(b) {
          Wh(a, b);
        });
      }
      function Ph(a, b) {
        var c = Zh(a, b).path(),
            d = Df(a.tc, b);
        Hf(d, function(b) {
          bi(a, b);
        });
        bi(a, d);
        Gf(d, function(b) {
          bi(a, b);
        });
        return c;
      }
      function bi(a, b) {
        var c = b.Ba();
        if (null !== c) {
          for (var d = [],
              e = [],
              f = -1,
              g = 0; g < c.length; g++)
            4 !== c[g].status && (2 === c[g].status ? (J(f === g - 1, "All SENT items should be at beginning of queue."), f = g, c[g].status = 4, c[g].ke = "set") : (J(1 === c[g].status, "Unexpected transaction status in abort"), c[g].he(), e = e.concat(lf(a.O, c[g].Aa, !0)), c[g].J && d.push(q(c[g].J, null, Error("set"), !1, null))));
          -1 === f ? Ef(b, null) : c.length = f + 1;
          zb(a.ea, b.path(), e);
          for (g = 0; g < d.length; g++)
            Cb(d[g]);
        }
      }
      ;
      function W() {
        this.nc = {};
        this.Mf = !1;
      }
      ca(W);
      W.prototype.xb = function() {
        for (var a in this.nc)
          this.nc[a].xb();
      };
      W.prototype.interrupt = W.prototype.xb;
      W.prototype.qc = function() {
        for (var a in this.nc)
          this.nc[a].qc();
      };
      W.prototype.resume = W.prototype.qc;
      W.prototype.ve = function() {
        this.Mf = !0;
      };
      function X(a, b) {
        this.bd = a;
        this.qa = b;
      }
      X.prototype.cancel = function(a) {
        x("Firebase.onDisconnect().cancel", 0, 1, arguments.length);
        A("Firebase.onDisconnect().cancel", 1, a, !0);
        this.bd.Id(this.qa, a || null);
      };
      X.prototype.cancel = X.prototype.cancel;
      X.prototype.remove = function(a) {
        x("Firebase.onDisconnect().remove", 0, 1, arguments.length);
        Yf("Firebase.onDisconnect().remove", this.qa);
        A("Firebase.onDisconnect().remove", 1, a, !0);
        Qh(this.bd, this.qa, null, a);
      };
      X.prototype.remove = X.prototype.remove;
      X.prototype.set = function(a, b) {
        x("Firebase.onDisconnect().set", 1, 2, arguments.length);
        Yf("Firebase.onDisconnect().set", this.qa);
        Rf("Firebase.onDisconnect().set", a, this.qa, !1);
        A("Firebase.onDisconnect().set", 2, b, !0);
        Qh(this.bd, this.qa, a, b);
      };
      X.prototype.set = X.prototype.set;
      X.prototype.Jb = function(a, b, c) {
        x("Firebase.onDisconnect().setWithPriority", 2, 3, arguments.length);
        Yf("Firebase.onDisconnect().setWithPriority", this.qa);
        Rf("Firebase.onDisconnect().setWithPriority", a, this.qa, !1);
        Uf("Firebase.onDisconnect().setWithPriority", 2, b);
        A("Firebase.onDisconnect().setWithPriority", 3, c, !0);
        Rh(this.bd, this.qa, a, b, c);
      };
      X.prototype.setWithPriority = X.prototype.Jb;
      X.prototype.update = function(a, b) {
        x("Firebase.onDisconnect().update", 1, 2, arguments.length);
        Yf("Firebase.onDisconnect().update", this.qa);
        if (ea(a)) {
          for (var c = {},
              d = 0; d < a.length; ++d)
            c["" + d] = a[d];
          a = c;
          Q("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.");
        }
        Tf("Firebase.onDisconnect().update", a, this.qa);
        A("Firebase.onDisconnect().update", 2, b, !0);
        Sh(this.bd, this.qa, a, b);
      };
      X.prototype.update = X.prototype.update;
      function Y(a, b, c, d) {
        this.k = a;
        this.path = b;
        this.n = c;
        this.jc = d;
      }
      function ci(a) {
        var b = null,
            c = null;
        a.la && (b = od(a));
        a.na && (c = qd(a));
        if (a.g === Vd) {
          if (a.la) {
            if ("[MIN_NAME]" != nd(a))
              throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");
            if ("string" !== typeof b)
              throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");
          }
          if (a.na) {
            if ("[MAX_NAME]" != pd(a))
              throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");
            if ("string" !== typeof c)
              throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");
          }
        } else if (a.g === M) {
          if (null != b && !Qf(b) || null != c && !Qf(c))
            throw Error("Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string).");
        } else if (J(a.g instanceof Rd || a.g === Yd, "unknown index type."), null != b && "object" === typeof b || null != c && "object" === typeof c)
          throw Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object.");
      }
      function di(a) {
        if (a.la && a.na && a.ia && (!a.ia || "" === a.Nb))
          throw Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");
      }
      function ei(a, b) {
        if (!0 === a.jc)
          throw Error(b + ": You can't combine multiple orderBy calls.");
      }
      Y.prototype.lc = function() {
        x("Query.ref", 0, 0, arguments.length);
        return new U(this.k, this.path);
      };
      Y.prototype.ref = Y.prototype.lc;
      Y.prototype.Db = function(a, b, c, d) {
        x("Query.on", 2, 4, arguments.length);
        Vf("Query.on", a, !1);
        A("Query.on", 2, b, !1);
        var e = fi("Query.on", c, d);
        if ("value" === a)
          Th(this.k, this, new jd(b, e.cancel || null, e.Ma || null));
        else {
          var f = {};
          f[a] = b;
          Th(this.k, this, new kd(f, e.cancel, e.Ma));
        }
        return b;
      };
      Y.prototype.on = Y.prototype.Db;
      Y.prototype.hc = function(a, b, c) {
        x("Query.off", 0, 3, arguments.length);
        Vf("Query.off", a, !0);
        A("Query.off", 2, b, !0);
        lb("Query.off", 3, c);
        var d = null,
            e = null;
        "value" === a ? d = new jd(b || null, null, c || null) : a && (b && (e = {}, e[a] = b), d = new kd(e, null, c || null));
        e = this.k;
        d = ".info" === O(this.path) ? e.Bd.kb(this, d) : e.O.kb(this, d);
        xb(e.ea, this.path, d);
      };
      Y.prototype.off = Y.prototype.hc;
      Y.prototype.xg = function(a, b) {
        function c(g) {
          f && (f = !1, e.hc(a, c), b.call(d.Ma, g));
        }
        x("Query.once", 2, 4, arguments.length);
        Vf("Query.once", a, !1);
        A("Query.once", 2, b, !1);
        var d = fi("Query.once", arguments[2], arguments[3]),
            e = this,
            f = !0;
        this.Db(a, c, function(b) {
          e.hc(a, c);
          d.cancel && d.cancel.call(d.Ma, b);
        });
      };
      Y.prototype.once = Y.prototype.xg;
      Y.prototype.Ge = function(a) {
        Q("Query.limit() being deprecated. Please use Query.limitToFirst() or Query.limitToLast() instead.");
        x("Query.limit", 1, 1, arguments.length);
        if (!ga(a) || Math.floor(a) !== a || 0 >= a)
          throw Error("Query.limit: First argument must be a positive integer.");
        if (this.n.ia)
          throw Error("Query.limit: Limit was already set (by another call to limit, limitToFirst, orlimitToLast.");
        var b = this.n.Ge(a);
        di(b);
        return new Y(this.k, this.path, b, this.jc);
      };
      Y.prototype.limit = Y.prototype.Ge;
      Y.prototype.He = function(a) {
        x("Query.limitToFirst", 1, 1, arguments.length);
        if (!ga(a) || Math.floor(a) !== a || 0 >= a)
          throw Error("Query.limitToFirst: First argument must be a positive integer.");
        if (this.n.ia)
          throw Error("Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");
        return new Y(this.k, this.path, this.n.He(a), this.jc);
      };
      Y.prototype.limitToFirst = Y.prototype.He;
      Y.prototype.Ie = function(a) {
        x("Query.limitToLast", 1, 1, arguments.length);
        if (!ga(a) || Math.floor(a) !== a || 0 >= a)
          throw Error("Query.limitToLast: First argument must be a positive integer.");
        if (this.n.ia)
          throw Error("Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");
        return new Y(this.k, this.path, this.n.Ie(a), this.jc);
      };
      Y.prototype.limitToLast = Y.prototype.Ie;
      Y.prototype.yg = function(a) {
        x("Query.orderByChild", 1, 1, arguments.length);
        if ("$key" === a)
          throw Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');
        if ("$priority" === a)
          throw Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');
        if ("$value" === a)
          throw Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');
        Wf("Query.orderByChild", 1, a, !1);
        ei(this, "Query.orderByChild");
        var b = be(this.n, new Rd(a));
        ci(b);
        return new Y(this.k, this.path, b, !0);
      };
      Y.prototype.orderByChild = Y.prototype.yg;
      Y.prototype.zg = function() {
        x("Query.orderByKey", 0, 0, arguments.length);
        ei(this, "Query.orderByKey");
        var a = be(this.n, Vd);
        ci(a);
        return new Y(this.k, this.path, a, !0);
      };
      Y.prototype.orderByKey = Y.prototype.zg;
      Y.prototype.Ag = function() {
        x("Query.orderByPriority", 0, 0, arguments.length);
        ei(this, "Query.orderByPriority");
        var a = be(this.n, M);
        ci(a);
        return new Y(this.k, this.path, a, !0);
      };
      Y.prototype.orderByPriority = Y.prototype.Ag;
      Y.prototype.Bg = function() {
        x("Query.orderByValue", 0, 0, arguments.length);
        ei(this, "Query.orderByValue");
        var a = be(this.n, Yd);
        ci(a);
        return new Y(this.k, this.path, a, !0);
      };
      Y.prototype.orderByValue = Y.prototype.Bg;
      Y.prototype.Yd = function(a, b) {
        x("Query.startAt", 0, 2, arguments.length);
        Rf("Query.startAt", a, this.path, !0);
        Wf("Query.startAt", 2, b, !0);
        var c = this.n.Yd(a, b);
        di(c);
        ci(c);
        if (this.n.la)
          throw Error("Query.startAt: Starting point was already set (by another call to startAt or equalTo).");
        n(a) || (b = a = null);
        return new Y(this.k, this.path, c, this.jc);
      };
      Y.prototype.startAt = Y.prototype.Yd;
      Y.prototype.sd = function(a, b) {
        x("Query.endAt", 0, 2, arguments.length);
        Rf("Query.endAt", a, this.path, !0);
        Wf("Query.endAt", 2, b, !0);
        var c = this.n.sd(a, b);
        di(c);
        ci(c);
        if (this.n.na)
          throw Error("Query.endAt: Ending point was already set (by another call to endAt or equalTo).");
        return new Y(this.k, this.path, c, this.jc);
      };
      Y.prototype.endAt = Y.prototype.sd;
      Y.prototype.eg = function(a, b) {
        x("Query.equalTo", 1, 2, arguments.length);
        Rf("Query.equalTo", a, this.path, !1);
        Wf("Query.equalTo", 2, b, !0);
        if (this.n.la)
          throw Error("Query.equalTo: Starting point was already set (by another call to endAt or equalTo).");
        if (this.n.na)
          throw Error("Query.equalTo: Ending point was already set (by another call to endAt or equalTo).");
        return this.Yd(a, b).sd(a, b);
      };
      Y.prototype.equalTo = Y.prototype.eg;
      Y.prototype.toString = function() {
        x("Query.toString", 0, 0, arguments.length);
        for (var a = this.path,
            b = "",
            c = a.Y; c < a.o.length; c++)
          "" !== a.o[c] && (b += "/" + encodeURIComponent(String(a.o[c])));
        a = this.k.toString() + (b || "/");
        b = jb(ee(this.n));
        return a += b.replace(/^&/, "");
      };
      Y.prototype.toString = Y.prototype.toString;
      Y.prototype.wa = function() {
        var a = Wc(ce(this.n));
        return "{}" === a ? "default" : a;
      };
      function fi(a, b, c) {
        var d = {
          cancel: null,
          Ma: null
        };
        if (b && c)
          d.cancel = b, A(a, 3, d.cancel, !0), d.Ma = c, lb(a, 4, d.Ma);
        else if (b)
          if ("object" === typeof b && null !== b)
            d.Ma = b;
          else if ("function" === typeof b)
            d.cancel = b;
          else
            throw Error(z(a, 3, !0) + " must either be a cancel callback or a context object.");
        return d;
      }
      ;
      var Z = {};
      Z.vc = vh;
      Z.DataConnection = Z.vc;
      vh.prototype.Lg = function(a, b) {
        this.Da("q", {p: a}, b);
      };
      Z.vc.prototype.simpleListen = Z.vc.prototype.Lg;
      vh.prototype.dg = function(a, b) {
        this.Da("echo", {d: a}, b);
      };
      Z.vc.prototype.echo = Z.vc.prototype.dg;
      vh.prototype.interrupt = vh.prototype.xb;
      Z.Pf = jh;
      Z.RealTimeConnection = Z.Pf;
      jh.prototype.sendRequest = jh.prototype.Da;
      jh.prototype.close = jh.prototype.close;
      Z.lg = function(a) {
        var b = vh.prototype.put;
        vh.prototype.put = function(c, d, e, f) {
          n(f) && (f = a());
          b.call(this, c, d, e, f);
        };
        return function() {
          vh.prototype.put = b;
        };
      };
      Z.hijackHash = Z.lg;
      Z.Of = Ec;
      Z.ConnectionTarget = Z.Of;
      Z.wa = function(a) {
        return a.wa();
      };
      Z.queryIdentifier = Z.wa;
      Z.ng = function(a) {
        return a.k.Ra.aa;
      };
      Z.listens = Z.ng;
      Z.ve = function(a) {
        a.ve();
      };
      Z.forceRestClient = Z.ve;
      function U(a, b) {
        var c,
            d,
            e;
        if (a instanceof Ih)
          c = a, d = b;
        else {
          x("new Firebase", 1, 2, arguments.length);
          d = Rc(arguments[0]);
          c = d.Ng;
          "firebase" === d.domain && Qc(d.host + " is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");
          c || Qc("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");
          d.lb || "undefined" !== typeof window && window.location && window.location.protocol && -1 !== window.location.protocol.indexOf("https:") && Q("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
          c = new Ec(d.host, d.lb, c, "ws" === d.scheme || "wss" === d.scheme);
          d = new K(d.$c);
          e = d.toString();
          var f;
          !(f = !p(c.host) || 0 === c.host.length || !Pf(c.Bb)) && (f = 0 !== e.length) && (e && (e = e.replace(/^\/*\.info(\/|$)/, "/")), f = !(p(e) && 0 !== e.length && !Of.test(e)));
          if (f)
            throw Error(z("new Firebase", 1, !1) + 'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');
          if (b)
            if (b instanceof W)
              e = b;
            else if (p(b))
              e = W.Wb(), c.Nd = b;
            else
              throw Error("Expected a valid Firebase.Context for second argument to new Firebase()");
          else
            e = W.Wb();
          f = c.toString();
          var g = w(e.nc, f);
          g || (g = new Ih(c, e.Mf), e.nc[f] = g);
          c = g;
        }
        Y.call(this, c, d, $d, !1);
      }
      ma(U, Y);
      var gi = U,
          hi = ["Firebase"],
          ii = aa;
      hi[0] in ii || !ii.execScript || ii.execScript("var " + hi[0]);
      for (var ji; hi.length && (ji = hi.shift()); )
        !hi.length && n(gi) ? ii[ji] = gi : ii = ii[ji] ? ii[ji] : ii[ji] = {};
      U.prototype.name = function() {
        Q("Firebase.name() being deprecated. Please use Firebase.key() instead.");
        x("Firebase.name", 0, 0, arguments.length);
        return this.key();
      };
      U.prototype.name = U.prototype.name;
      U.prototype.key = function() {
        x("Firebase.key", 0, 0, arguments.length);
        return this.path.e() ? null : vc(this.path);
      };
      U.prototype.key = U.prototype.key;
      U.prototype.w = function(a) {
        x("Firebase.child", 1, 1, arguments.length);
        if (ga(a))
          a = String(a);
        else if (!(a instanceof K))
          if (null === O(this.path)) {
            var b = a;
            b && (b = b.replace(/^\/*\.info(\/|$)/, "/"));
            Xf("Firebase.child", b);
          } else
            Xf("Firebase.child", a);
        return new U(this.k, this.path.w(a));
      };
      U.prototype.child = U.prototype.w;
      U.prototype.parent = function() {
        x("Firebase.parent", 0, 0, arguments.length);
        var a = this.path.parent();
        return null === a ? null : new U(this.k, a);
      };
      U.prototype.parent = U.prototype.parent;
      U.prototype.root = function() {
        x("Firebase.ref", 0, 0, arguments.length);
        for (var a = this; null !== a.parent(); )
          a = a.parent();
        return a;
      };
      U.prototype.root = U.prototype.root;
      U.prototype.set = function(a, b) {
        x("Firebase.set", 1, 2, arguments.length);
        Yf("Firebase.set", this.path);
        Rf("Firebase.set", a, this.path, !1);
        A("Firebase.set", 2, b, !0);
        this.k.Jb(this.path, a, null, b || null);
      };
      U.prototype.set = U.prototype.set;
      U.prototype.update = function(a, b) {
        x("Firebase.update", 1, 2, arguments.length);
        Yf("Firebase.update", this.path);
        if (ea(a)) {
          for (var c = {},
              d = 0; d < a.length; ++d)
            c["" + d] = a[d];
          a = c;
          Q("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.");
        }
        Tf("Firebase.update", a, this.path);
        A("Firebase.update", 2, b, !0);
        this.k.update(this.path, a, b || null);
      };
      U.prototype.update = U.prototype.update;
      U.prototype.Jb = function(a, b, c) {
        x("Firebase.setWithPriority", 2, 3, arguments.length);
        Yf("Firebase.setWithPriority", this.path);
        Rf("Firebase.setWithPriority", a, this.path, !1);
        Uf("Firebase.setWithPriority", 2, b);
        A("Firebase.setWithPriority", 3, c, !0);
        if (".length" === this.key() || ".keys" === this.key())
          throw "Firebase.setWithPriority failed: " + this.key() + " is a read-only object.";
        this.k.Jb(this.path, a, b, c || null);
      };
      U.prototype.setWithPriority = U.prototype.Jb;
      U.prototype.remove = function(a) {
        x("Firebase.remove", 0, 1, arguments.length);
        Yf("Firebase.remove", this.path);
        A("Firebase.remove", 1, a, !0);
        this.set(null, a);
      };
      U.prototype.remove = U.prototype.remove;
      U.prototype.transaction = function(a, b, c) {
        x("Firebase.transaction", 1, 3, arguments.length);
        Yf("Firebase.transaction", this.path);
        A("Firebase.transaction", 1, a, !1);
        A("Firebase.transaction", 2, b, !0);
        if (n(c) && "boolean" != typeof c)
          throw Error(z("Firebase.transaction", 3, !0) + "must be a boolean.");
        if (".length" === this.key() || ".keys" === this.key())
          throw "Firebase.transaction failed: " + this.key() + " is a read-only object.";
        "undefined" === typeof c && (c = !0);
        Uh(this.k, this.path, a, b || null, c);
      };
      U.prototype.transaction = U.prototype.transaction;
      U.prototype.Ig = function(a, b) {
        x("Firebase.setPriority", 1, 2, arguments.length);
        Yf("Firebase.setPriority", this.path);
        Uf("Firebase.setPriority", 1, a);
        A("Firebase.setPriority", 2, b, !0);
        this.k.Jb(this.path.w(".priority"), a, null, b);
      };
      U.prototype.setPriority = U.prototype.Ig;
      U.prototype.push = function(a, b) {
        x("Firebase.push", 0, 2, arguments.length);
        Yf("Firebase.push", this.path);
        Rf("Firebase.push", a, this.path, !0);
        A("Firebase.push", 2, b, !0);
        var c = Kh(this.k),
            c = Kf(c),
            c = this.w(c);
        "undefined" !== typeof a && null !== a && c.set(a, b);
        return c;
      };
      U.prototype.push = U.prototype.push;
      U.prototype.jb = function() {
        Yf("Firebase.onDisconnect", this.path);
        return new X(this.k, this.path);
      };
      U.prototype.onDisconnect = U.prototype.jb;
      U.prototype.P = function(a, b, c) {
        Q("FirebaseRef.auth() being deprecated. Please use FirebaseRef.authWithCustomToken() instead.");
        x("Firebase.auth", 1, 3, arguments.length);
        Zf("Firebase.auth", a);
        A("Firebase.auth", 2, b, !0);
        A("Firebase.auth", 3, b, !0);
        Jg(this.k.P, a, {}, {remember: "none"}, b, c);
      };
      U.prototype.auth = U.prototype.P;
      U.prototype.fe = function(a) {
        x("Firebase.unauth", 0, 1, arguments.length);
        A("Firebase.unauth", 1, a, !0);
        Kg(this.k.P, a);
      };
      U.prototype.unauth = U.prototype.fe;
      U.prototype.xe = function() {
        x("Firebase.getAuth", 0, 0, arguments.length);
        return this.k.P.xe();
      };
      U.prototype.getAuth = U.prototype.xe;
      U.prototype.rg = function(a, b) {
        x("Firebase.onAuth", 1, 2, arguments.length);
        A("Firebase.onAuth", 1, a, !1);
        lb("Firebase.onAuth", 2, b);
        this.k.P.Db("auth_status", a, b);
      };
      U.prototype.onAuth = U.prototype.rg;
      U.prototype.qg = function(a, b) {
        x("Firebase.offAuth", 1, 2, arguments.length);
        A("Firebase.offAuth", 1, a, !1);
        lb("Firebase.offAuth", 2, b);
        this.k.P.hc("auth_status", a, b);
      };
      U.prototype.offAuth = U.prototype.qg;
      U.prototype.Tf = function(a, b, c) {
        x("Firebase.authWithCustomToken", 2, 3, arguments.length);
        Zf("Firebase.authWithCustomToken", a);
        A("Firebase.authWithCustomToken", 2, b, !1);
        ag("Firebase.authWithCustomToken", 3, c, !0);
        Jg(this.k.P, a, {}, c || {}, b);
      };
      U.prototype.authWithCustomToken = U.prototype.Tf;
      U.prototype.Uf = function(a, b, c) {
        x("Firebase.authWithOAuthPopup", 2, 3, arguments.length);
        $f("Firebase.authWithOAuthPopup", 1, a);
        A("Firebase.authWithOAuthPopup", 2, b, !1);
        ag("Firebase.authWithOAuthPopup", 3, c, !0);
        Og(this.k.P, a, c, b);
      };
      U.prototype.authWithOAuthPopup = U.prototype.Uf;
      U.prototype.Vf = function(a, b, c) {
        x("Firebase.authWithOAuthRedirect", 2, 3, arguments.length);
        $f("Firebase.authWithOAuthRedirect", 1, a);
        A("Firebase.authWithOAuthRedirect", 2, b, !1);
        ag("Firebase.authWithOAuthRedirect", 3, c, !0);
        var d = this.k.P;
        Mg(d);
        var e = [vg],
            f = ig(c);
        "anonymous" === a || "firebase" === a ? R(b, xg("TRANSPORT_UNAVAILABLE")) : (P.set("redirect_client_options", f.nd), Ng(d, e, "/auth/" + a, f, b));
      };
      U.prototype.authWithOAuthRedirect = U.prototype.Vf;
      U.prototype.Wf = function(a, b, c, d) {
        x("Firebase.authWithOAuthToken", 3, 4, arguments.length);
        $f("Firebase.authWithOAuthToken", 1, a);
        A("Firebase.authWithOAuthToken", 3, c, !1);
        ag("Firebase.authWithOAuthToken", 4, d, !0);
        p(b) ? ($f("Firebase.authWithOAuthToken", 2, b), Lg(this.k.P, a + "/token", {access_token: b}, d, c)) : (ag("Firebase.authWithOAuthToken", 2, b, !1), Lg(this.k.P, a + "/token", b, d, c));
      };
      U.prototype.authWithOAuthToken = U.prototype.Wf;
      U.prototype.Sf = function(a, b) {
        x("Firebase.authAnonymously", 1, 2, arguments.length);
        A("Firebase.authAnonymously", 1, a, !1);
        ag("Firebase.authAnonymously", 2, b, !0);
        Lg(this.k.P, "anonymous", {}, b, a);
      };
      U.prototype.authAnonymously = U.prototype.Sf;
      U.prototype.Xf = function(a, b, c) {
        x("Firebase.authWithPassword", 2, 3, arguments.length);
        ag("Firebase.authWithPassword", 1, a, !1);
        bg("Firebase.authWithPassword", a, "email");
        bg("Firebase.authWithPassword", a, "password");
        A("Firebase.authAnonymously", 2, b, !1);
        ag("Firebase.authAnonymously", 3, c, !0);
        Lg(this.k.P, "password", a, c, b);
      };
      U.prototype.authWithPassword = U.prototype.Xf;
      U.prototype.se = function(a, b) {
        x("Firebase.createUser", 2, 2, arguments.length);
        ag("Firebase.createUser", 1, a, !1);
        bg("Firebase.createUser", a, "email");
        bg("Firebase.createUser", a, "password");
        A("Firebase.createUser", 2, b, !1);
        this.k.P.se(a, b);
      };
      U.prototype.createUser = U.prototype.se;
      U.prototype.Re = function(a, b) {
        x("Firebase.removeUser", 2, 2, arguments.length);
        ag("Firebase.removeUser", 1, a, !1);
        bg("Firebase.removeUser", a, "email");
        bg("Firebase.removeUser", a, "password");
        A("Firebase.removeUser", 2, b, !1);
        this.k.P.Re(a, b);
      };
      U.prototype.removeUser = U.prototype.Re;
      U.prototype.pe = function(a, b) {
        x("Firebase.changePassword", 2, 2, arguments.length);
        ag("Firebase.changePassword", 1, a, !1);
        bg("Firebase.changePassword", a, "email");
        bg("Firebase.changePassword", a, "oldPassword");
        bg("Firebase.changePassword", a, "newPassword");
        A("Firebase.changePassword", 2, b, !1);
        this.k.P.pe(a, b);
      };
      U.prototype.changePassword = U.prototype.pe;
      U.prototype.oe = function(a, b) {
        x("Firebase.changeEmail", 2, 2, arguments.length);
        ag("Firebase.changeEmail", 1, a, !1);
        bg("Firebase.changeEmail", a, "oldEmail");
        bg("Firebase.changeEmail", a, "newEmail");
        bg("Firebase.changeEmail", a, "password");
        A("Firebase.changeEmail", 2, b, !1);
        this.k.P.oe(a, b);
      };
      U.prototype.changeEmail = U.prototype.oe;
      U.prototype.Se = function(a, b) {
        x("Firebase.resetPassword", 2, 2, arguments.length);
        ag("Firebase.resetPassword", 1, a, !1);
        bg("Firebase.resetPassword", a, "email");
        A("Firebase.resetPassword", 2, b, !1);
        this.k.P.Se(a, b);
      };
      U.prototype.resetPassword = U.prototype.Se;
      U.goOffline = function() {
        x("Firebase.goOffline", 0, 0, arguments.length);
        W.Wb().xb();
      };
      U.goOnline = function() {
        x("Firebase.goOnline", 0, 0, arguments.length);
        W.Wb().qc();
      };
      function Nc(a, b) {
        J(!b || !0 === a || !1 === a, "Can't turn on custom loggers persistently.");
        !0 === a ? ("undefined" !== typeof console && ("function" === typeof console.log ? Ab = q(console.log, console) : "object" === typeof console.log && (Ab = function(a) {
          console.log(a);
        })), b && P.set("logging_enabled", !0)) : a ? Ab = a : (Ab = null, P.remove("logging_enabled"));
      }
      U.enableLogging = Nc;
      U.ServerValue = {TIMESTAMP: {".sv": "timestamp"}};
      U.SDK_VERSION = "2.2.3";
      U.INTERNAL = V;
      U.Context = W;
      U.TEST_ACCESS = Z;
    })();
  }).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, false);
});

System.register("github:firebase/firebase-bower@2.2.3", ["github:firebase/firebase-bower@2.2.3/firebase"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:firebase/firebase-bower@2.2.3/firebase");
  global.define = __define;
  return module.exports;
});

System.register("utility", ["github:firebase/firebase-bower@2.2.3"], function(_export) {
  var _createClass,
      _classCallCheck,
      Utility;
  return {
    setters: [function(_firebase) {}],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Utility = _export("Utility", (function() {
        function Utility() {
          _classCallCheck(this, Utility);
        }
        _createClass(Utility, {
          clone: {value: function clone(obj) {
              return JSON.parse(JSON.stringify(obj));
            }},
          copyAttributesWithoutChildren: {value: function copyAttributesWithoutChildren(newNode, node) {
              function copyAttributes(newNode, node, attrName) {
                if (typeof node[attrName] != "undefined")
                  newNode[attrName] = node[attrName];
              }
              var attrList = ["collapsed", "content", "fold", "icon", "id", "create_time", "x", "y", "width", "height"];
              for (var i = 0; i < attrList.length; i++) {
                copyAttributes(newNode, node, attrList[i]);
              }
              ;
            }},
          copyAttributes: {value: function copyAttributes(newNode, node) {
              function copyAttributes(newNode, node, attrName) {
                if (typeof node[attrName] != "undefined")
                  newNode[attrName] = node[attrName];
              }
              var attrList = ["collapsed", "content", "fold", "icon", "id", "create_time", "x", "y", "width", "height"];
              for (var i = 0; i < attrList.length; i++) {
                copyAttributes(newNode, node, attrList[i]);
              }
              ;
              newNode.children = [];
              for (var i = 0; node.children && i < node.children.length; i++) {
                newNode.children.push(node.children[i]);
              }
              ;
            }},
          createNewNode: {value: function createNewNode() {
              return {
                id: this.getUniqueId(),
                content: "",
                collapsed: false,
                fold: false,
                icon: 0,
                children: []
              };
            }},
          createNewFlatNode: {value: function createNewFlatNode() {
              return {
                id: this.getUniqueId(),
                content: "",
                collapsed: false,
                fold: false,
                icon: 0,
                x: 100,
                y: 30,
                width: 400,
                height: 247,
                children: []
              };
            }},
          getChildrenPosition: {value: function getChildrenPosition(node, id) {
              for (var i = 0; i < node.children.length; i++) {
                if (node.children[i] == id) {
                  return i;
                }
              }
              ;
            }},
          getUniqueId: {value: function getUniqueId() {
              function randomString(length, chars) {
                var result = "";
                for (var i = length; i > 0; --i)
                  result += chars[Math.round(Math.random() * (chars.length - 1))];
                return result;
              }
              return "BN-" + new Date().getTime().toString() + "-" + randomString(5, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
            }},
          getCleanChildren: {value: function getCleanChildren(node) {
              var children = [];
              for (var i = 0; node.children && i < node.children.length; i++) {
                children.push(node.children[i]);
              }
              ;
              return children;
            }},
          initInteract: {value: function initInteract(id, vm) {
              interact("#" + id).allowFrom(".flat-titlebar").draggable({
                onstart: function onstart(event) {
                  var target = event.target;
                  target.setAttribute("start-x", vm.file.nodes[id].x);
                  target.setAttribute("start-y", vm.file.nodes[id].y);
                },
                onmove: function dragMoveListener(event) {
                  console.log(event);
                  var target = event.target,
                      dx = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
                      dy = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
                  target.style.webkitTransform = target.style.transform = "translate(" + dx + "px, " + dy + "px)";
                  target.setAttribute("data-x", dx);
                  target.setAttribute("data-y", dy);
                },
                onend: function onend(event) {
                  var target = event.target;
                  var dx = parseFloat(target.getAttribute("data-x")) || 0;
                  var dy = parseFloat(target.getAttribute("data-y")) || 0;
                  console.log("dx:" + dx + " dy:" + dy + " vm.file.nodes[id].x:" + vm.file.nodes[id].x + " vm.file.nodes[id].y:" + vm.file.nodes[id].y);
                  vm.file.nodes[id].x += dx;
                  vm.file.nodes[id].y += dy;
                  console.log("dx:" + dx + " dy:" + dy + " vm.file.nodes[id].x:" + vm.file.nodes[id].x + " vm.file.nodes[id].y:" + vm.file.nodes[id].y);
                  target.setAttribute("data-x", 0);
                  target.setAttribute("data-y", 0);
                  vm.setPositionToRemoteServer(id);
                }
              });
              interact("#" + id + " .flat-body").resizable({edges: {
                  left: true,
                  right: true,
                  bottom: true,
                  top: false
                }}).on("resizemove", function(event) {
                var target = event.target.parentElement,
                    x = parseFloat(target.getAttribute("data-x")) || 0,
                    y = parseFloat(target.getAttribute("data-y")) || 0;
                target.style.width = event.rect.width + "px";
                target.style.height = event.rect.height + $("#" + id + " .flat-titlebar").height() + "px";
                x += event.deltaRect.left;
                y += event.deltaRect.top;
                target.style.webkitTransform = target.style.transform = "translate(" + x + "px," + y + "px)";
                target.setAttribute("data-x", x);
                target.setAttribute("data-y", y);
              }).on("resizeend", function(event) {
                var target = event.target;
                var dx = parseFloat(target.getAttribute("data-x")) || 0;
                var dy = parseFloat(target.getAttribute("data-y")) || 0;
                vm.file.nodes[id].x += dx;
                vm.file.nodes[id].y += dy;
                vm.file.nodes[id].width = target.style.width;
                vm.file.nodes[id].height = target.style.height;
                target.setAttribute("data-x", 0);
                target.setAttribute("data-y", 0);
                vm.setPositionToRemoteServer(id);
              });
            }},
          isSameNode: {value: function isSameNode(node1, node2) {
              var attrList = ["collapsed", "content", "fold", "icon", "id", "create_time", "x", "y", "width", "height"];
              for (var i = 0; i < attrList.length; i++) {
                if (node1[attrList[i]] != node2[attrList[i]]) {
                  return false;
                }
              }
              ;
              if (!node1.children && !node2.children) {
                return true;
              }
              if (node1.children && !node2.children) {
                return false;
              }
              if (!node1.children && node2.children) {
                return false;
              }
              if (node1.children.length != node2.children.length) {
                return false;
              }
              for (var i = 0; i < node1.children.length; i++) {
                if (node1.children[i] != node2.children[i]) {
                  return false;
                }
              }
              ;
              return true;
            }},
          listToTree: {value: function listToTree(nodes, root_id) {
              var that = this;
              var visit = (function(_visit) {
                var _visitWrapper = function visit(_x) {
                  return _visit.apply(this, arguments);
                };
                _visitWrapper.toString = function() {
                  return _visit.toString();
                };
                return _visitWrapper;
              })(function(node_id) {
                var node = nodes[node_id];
                var newNode = new Object();
                that.copyAttributesWithoutChildren(newNode, node);
                newNode.children = [];
                for (var i = 0; i < node.children.length; i++) {
                  newNode.children.push(visit(node.children[i]));
                }
                ;
                return newNode;
              });
              return visit(root_id);
            }},
          treeToList: {value: function treeToList(root) {
              var nodes = [];
              var that = this;
              var visit = (function(_visit) {
                var _visitWrapper = function visit(_x) {
                  return _visit.apply(this, arguments);
                };
                _visitWrapper.toString = function() {
                  return _visit.toString();
                };
                return _visitWrapper;
              })(function(node) {
                var newNode = new Object();
                newNode.children = [];
                that.copyAttributesWithoutChildren(newNode, node);
                for (var i = 0; i < node.children.length; i++) {
                  newNode.children.push(visit(node.children[i]));
                }
                ;
                newNode.id = that.getUniqueId();
                nodes.push(newNode);
                return newNode.id;
              });
              var newRootId = visit(root);
              return {
                root_id: newRootId,
                nodes: nodes
              };
            }},
          now: {value: function now() {
              return new Date().getTime();
            }}
        });
        return Utility;
      })());
    }
  };
});

System.register("data-source", [], function(_export) {
  var _createClass,
      _classCallCheck,
      DataSource;
  function fsReadFilePromise(filePath, options) {
    var resolve;
    var reject;
    var fs = require("fs");
    fs.readFile(filePath, options, function(err, buf) {
      if (err) {
        reject(err);
        return ;
      }
      resolve(buf.toString());
    });
    return new Promise(function(_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
  }
  function fsWriteFilePromise(filePath, data, position, encoding) {
    var resolve;
    var reject;
    var fs = require("fs");
    fs.writeFile(filePath, data, position, encoding, function(err, written) {
      if (err) {
        reject(err);
        return ;
      }
      resolve(written);
    });
    return new Promise(function(_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ;
      ;
      DataSource = _export("DataSource", (function() {
        function DataSource() {
          _classCallCheck(this, DataSource);
        }
        _createClass(DataSource, {
          load: {value: function load(path) {
              console.log(path);
              return fsReadFilePromise(path);
            }},
          save: {value: function save(path, jsonData) {
              return fsWriteFilePromise(path, jsonData);
            }}
        });
        return DataSource;
      })());
    }
  };
});

System.register("common", [], function(_export) {
  var _classCallCheck,
      Common;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Common = _export("Common", function Common() {
        _classCallCheck(this, Common);
        this.firebase_url = "https://bn.firebaseio.com";
        this.new_tree_note_skeleton = {
          meta: {
            type: "tree",
            name: "New Tree Note"
          },
          nodes: {
            root: {
              id: "root",
              children: ["first_node"]
            },
            first_node: {
              id: "first_node",
              content: "",
              collapsed: false,
              fold: false,
              icon: 0
            }
          }
        };
        this.new_directory = {meta: {
            type: "directory",
            name: "New Directory",
            collapsed: false
          }};
        this.new_flat_note_skeleton = {
          meta: {
            type: "flat",
            name: "New Flat Note"
          },
          nodes: {
            root: {
              id: "root",
              children: ["first_node"],
              height: 2000,
              width: 2000
            },
            first_node: {
              id: "first_node",
              content: "",
              collapsed: false,
              fold: false,
              icon: 0,
              x: 100,
              y: 30,
              width: 400,
              height: 247
            }
          }
        };
        this.new_mosaic_skeleton = {
          meta: {
            type: "mosaic",
            name: "New Mosaic"
          },
          rows: [{
            id: "1",
            height: 500,
            tiles: [{
              id: "1",
              flex: 1,
              url: ""
            }]
          }]
        };
      });
    }
  };
});

System.register("tree-params", [], function(_export) {
  var _classCallCheck,
      TreeParams;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      TreeParams = _export("TreeParams", function TreeParams() {
        _classCallCheck(this, TreeParams);
      });
    }
  };
});

System.register("node", ["common", "utility"], function(_export) {
  var Common,
      Utility,
      _createClass,
      _classCallCheck,
      Node;
  return {
    setters: [function(_common) {
      Common = _common.Common;
    }, function(_utility) {
      Utility = _utility.Utility;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Node = _export("Node", (function() {
        function Node(common, utility) {
          _classCallCheck(this, Node);
          this.common = common;
          this.utility = utility;
          this.childVMList = [];
        }
        _createClass(Node, {
          addChildVM: {value: function addChildVM(vm, id) {
              var insertPoint = -1;
              for (var i = 0; i < this.node.children.length; i++) {
                if (this.node.children[i] == id) {
                  insertPoint = i;
                  break;
                }
              }
              ;
              if (insertPoint != -1) {
                this.childVMList.splice(insertPoint, 0, vm);
              }
              ;
            }},
          addObserver: {value: function addObserver(node) {
              var that = this;
              if (!this.remoteObserver) {
                this.remoteObserver = function(dataSnapshot) {
                  if (that.rootVM.editing)
                    return ;
                  if (that.utility.now() - that.rootVM.setToRemoteTime < 2000)
                    return ;
                  var newNode = dataSnapshot.val();
                  if (!newNode)
                    return ;
                  if (that.utility.isSameNode(that.node, newNode))
                    return ;
                  that.doUpdate(newNode);
                };
                this.rootVM.nodesRef.child(node.id).on("value", this.remoteObserver);
              }
            }},
          removeObserver: {value: function removeObserver() {
              if (!this.node) {
                return ;
              }
              if (this.localObserver)
                Object.unobserve(this.node, this.localObserver);
              if (this.remoteObserver)
                this.rootVM.nodesRef.child(this.node.id).off("value", this.remoteObserver);
            }},
          setNodeToServer: {value: function setNodeToServer(node_id) {
              var nodeRef = this.rootVM.nodesRef.child(node_id);
              var that = this;
              this.doEdit(function() {
                var newNode = new Object();
                that.utility.copyAttributes(newNode, that.rootVM.file.nodes[node_id]);
                nodeRef.set(newNode);
              });
            }},
          doEdit: {value: function doEdit(realEdit) {
              var that = this;
              var edit = (function(_edit) {
                var _editWrapper = function edit() {
                  return _edit.apply(this, arguments);
                };
                _editWrapper.toString = function() {
                  return _edit.toString();
                };
                return _editWrapper;
              })(function() {
                if (that.rootVM.editing && that.utility.now() - that.rootVM.localChangedTime < that.rootVM.localChangeWaitTime - that.rootVM.localChangeWaitEpsilon) {
                  setTimeout(edit, that.rootVM.localChangeWaitTime);
                } else {
                  that.rootVM.editing = false;
                }
              });
              this.rootVM.localChangedTime = this.utility.now();
              if (!this.rootVM.editing) {
                this.rootVM.editing = true;
                setTimeout(edit, that.rootVM.localChangeWaitTime);
              }
              ;
              realEdit();
            }},
          doUpdate: {value: function doUpdate(newNode) {
              var that = this;
              var update = (function(_update) {
                var _updateWrapper = function update() {
                  return _update.apply(this, arguments);
                };
                _updateWrapper.toString = function() {
                  return _update.toString();
                };
                return _updateWrapper;
              })(function() {
                if (that.utility.now() - that.rootVM.receiveRemoteTime < that.rootVM.remoteChangeWaitTime - that.rootVM.remoteChangeWaitEpsilon) {
                  setTimeout(update, that.remoteChangeWaitTime);
                } else {
                  that.rootVM.updating = false;
                }
              });
              if (!this.rootVM.updating) {
                this.rootVM.updating = true;
                setTimeout(update, that.rootVM.remoteChangeWaitTime);
              }
              ;
              for (var i = this.node.children.length - 1; i >= 0; i--) {
                var removed = true;
                for (var j = 0; newNode.children && j < newNode.children.length; j++) {
                  if (this.node.children[i] == newNode.children[j]) {
                    removed = false;
                    break;
                  }
                }
                if (removed) {
                  var remove_observer = (function(_remove_observer) {
                    var _remove_observerWrapper = function remove_observer(_x) {
                      return _remove_observer.apply(this, arguments);
                    };
                    _remove_observerWrapper.toString = function() {
                      return _remove_observer.toString();
                    };
                    return _remove_observerWrapper;
                  })(function(vm) {
                    vm.removeObserver();
                    for (var i = 0; i < vm.childVMList.length; i++) {
                      remove_observer(vm.childVMList[i]);
                    }
                    ;
                  });
                  remove_observer(this.childVMList[i]);
                }
                ;
              }
              ;
              this.utility.copyAttributes(this.node, newNode);
              this.rootVM.receiveRemoteTime = this.utility.now();
              setTimeout(function() {
                if (that.resize)
                  that.resize();
              }, 0);
            }},
          getNodeListByRootId: {value: function getNodeListByRootId(rootId) {
              var nodeList = [];
              var that = this;
              function visit(node_id) {
                var node = that.file.nodes[node_id];
                nodeList.push(node);
                for (var i = 0; i < node.children.length; i++) {
                  visit(node.children[i]);
                }
                ;
              }
              visit(rootId);
              return nodeList;
            }},
          insertSubTree: {value: function insertSubTree(parent_id, insertPosition, sub_tree, root_id) {
              var parent = this.rootVM.file.nodes[parent_id];
              for (var i = 0; i < sub_tree.length; i++) {
                this.rootVM.file.nodes[sub_tree[i].id] = sub_tree[i];
              }
              ;
              if (!parent.children) {
                parent.children = [];
              }
              ;
              parent.children.splice(insertPosition, 0, root_id);
              this.setNodeListToServer(sub_tree);
              this.setNodeChildrenToServer(this.file.nodes[parent_id]);
              console.log("setNodeChildrenToServer");
              console.log(this.file.nodes[parent_id]);
              this.rootVM.setToRemoteTime = this.utility.now();
            }},
          loadNode: {value: function loadNode(node_id, force) {
              if (force || !this.node) {
                this.node = this.rootVM.file.nodes[node_id];
                if (this.node) {
                  if (!this.node.children)
                    this.node.children = [];
                  this.addObserver(this.node);
                } else {
                  this.loadNodeFromServer(node_id);
                }
              }
            }},
          loadNodeFromServer: {value: function loadNodeFromServer(node_id) {
              console.log("loadNodeFromServer: " + node_id);
              var that = this;
              this.rootVM.nodesRef.child(node_id).once("value", function(dataSnapshot) {
                that.node = dataSnapshot.val();
                console.log("loadNodeFromServer: ");
                console.log(that.node);
                if (!that.node) {
                  that.node = that.utility.createNewNode();
                  that.node.id = node_id;
                }
                if (!that.node.children) {
                  that.node.children = [];
                }
                ;
                that.addObserver(that.node);
                that.rootVM.file.nodes[that.node.id] = that.node;
                if (that.node.id != that.rootVM.root_id) {
                  if (that.element.children[0].children[1])
                    that.ta = that.element.children[0].children[1];
                  if (that.ta)
                    that.foldNode();
                }
              }, function(error) {
                console.log(JSON.stringify(error));
              });
            }},
          openSubTreeInNewWindow: {value: function openSubTreeInNewWindow(node_id) {
              var url = "#tree/online/" + this.rootVM.file_id + "/" + this.node.id;
              window.open(url);
            }},
          removeChildVM: {value: function removeChildVM(vm) {
              var insertPoint = -1;
              for (var i = 0; i < this.node.children.length; i++) {
                if (this.node.children[i].id == vm.node.id) {
                  insertPoint = i;
                  break;
                }
              }
              ;
              if (insertPoint != -1) {
                this.childVMList.splice(insertPoint, 1);
              }
              ;
            }},
          removeSubTree: {value: function removeSubTree(parent_id, node_id) {
              var parent = this.file.nodes[parent_id];
              var position = -1;
              for (var i = 0; i < parent.children.length; i++) {
                if (parent.children[i] == node_id) {
                  position = i;
                  break;
                }
              }
              ;
              if (-1 == position) {
                return ;
              }
              parent.children.splice(position, 1);
              var nodeList = this.getNodeListByRootId(node_id);
              for (var i = 0; i < nodeList.length; i++) {
                this.rootVM.file.nodes[nodeList[i].id] = undefined;
              }
              ;
              console.log("setNodeChildrenToServer");
              console.log(this.file.nodes[parent_id]);
              this.removeNodeListFromServer(nodeList);
              this.setNodeChildrenToServer(this.file.nodes[parent_id]);
              this.rootVM.setToRemoteTime = this.utility.now();
              return position;
            }},
          record: {value: (function(_record) {
              var _recordWrapper = function record(_x, _x2) {
                return _record.apply(this, arguments);
              };
              _recordWrapper.toString = function() {
                return _record.toString();
              };
              return _recordWrapper;
            })(function(nodeDataList, operation) {
              var record = {};
              record.operation = operation;
              record.nodeList = nodeDataList;
              this.operationRecordList.splice(this.operationRecordList.cursor + 1);
              this.operationRecordList.push(record);
              this.operationRecordList.cursor++;
            })},
          redo: {value: function redo() {
              console.log("redo");
              if (this.operationRecordList.cursor >= this.operationRecordList.length - 1) {
                return ;
              }
              this.operationRecordList.cursor++;
              var record = this.operationRecordList[this.operationRecordList.cursor];
              if ("insert" == record.operation) {
                for (var i = 0; i < record.nodeList.length; i++) {
                  var r = record.nodeList[i];
                  var ret = this.utility.treeToList(r.subTree);
                  this.insertSubTree(r.parent_id, r.position, ret.nodes, ret.root_id);
                  r.node_id = ret.root_id;
                }
              } else if ("remove" == record.operation) {
                for (var i = 0; i < record.nodeList.length; i++) {
                  var r = record.nodeList[i];
                  var nodeList = this.getNodeListByRootId(r.node_id);
                  r.subTree = this.utility.listToTree(this.rootVM.file.nodes, r.node_id);
                  this.removeSubTree(r.parent_id, r.node_id);
                }
              }
            }},
          setNodeChildrenToServer: {value: function setNodeChildrenToServer(node) {
              var children = [];
              for (var i = 0; i < node.children.length; i++) {
                children.push(node.children[i]);
              }
              ;
              this.nodesRef.child(node.id).child("children").set(children);
            }},
          removeNodeListFromServer: {value: function removeNodeListFromServer(nodeList) {
              for (var i = 0; i < nodeList.length; i++) {
                this.nodesRef.child(nodeList[i].id).remove();
              }
              ;
            }},
          setNodeListToServer: {value: function setNodeListToServer(nodeList) {
              for (var i = 0; i < nodeList.length; i++) {
                var newNode = new Object();
                this.utility.copyAttributesWithoutChildren(newNode, nodeList[i]);
                var children = [];
                for (var j = 0; j < nodeList[i].children.length; j++) {
                  children.push(nodeList[i].children[j]);
                }
                ;
                newNode.children = children;
                this.nodesRef.child(nodeList[i].id).set(newNode);
              }
              ;
            }},
          undo: {value: function undo() {
              if (this.operationRecordList.cursor < 0) {
                return ;
              }
              var record = this.operationRecordList[this.operationRecordList.cursor];
              this.operationRecordList.cursor--;
              if ("insert" == record.operation) {
                for (var i = record.nodeList.length - 1; i >= 0; i--) {
                  var r = record.nodeList[i];
                  r.subTree = this.utility.listToTree(this.rootVM.file.nodes, r.node_id);
                  this.removeSubTree(r.parent_id, r.node_id);
                }
              } else if ("remove" == record.operation) {
                for (var i = record.nodeList.length - 1; i >= 0; i--) {
                  var r = record.nodeList[i];
                  var ret = this.utility.treeToList(r.subTree);
                  this.insertSubTree(r.parent_id, r.position, ret.nodes, ret.root_id);
                  r.node_id = ret.root_id;
                }
              }
            }}
        }, {inject: {value: function inject() {
              return [Common, Utility];
            }}});
        return Node;
      })());
    }
  };
});

System.register("tree", ["data-source", "node", "tree-params", "utility", "common"], function(_export) {
  var DataSource,
      Node,
      TreeParams,
      Utility,
      Common,
      _createClass,
      _get,
      _inherits,
      _classCallCheck,
      Tree;
  return {
    setters: [function(_dataSource) {
      DataSource = _dataSource.DataSource;
    }, function(_node) {
      Node = _node.Node;
    }, function(_treeParams) {
      TreeParams = _treeParams.TreeParams;
    }, function(_utility) {
      Utility = _utility.Utility;
    }, function(_common) {
      Common = _common.Common;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Tree = _export("Tree", (function(_Node) {
        function Tree(dataSource, element, treeParams, common, utility) {
          _classCallCheck(this, Tree);
          _get(Object.getPrototypeOf(Tree.prototype), "constructor", this).call(this);
          this.dataSource = dataSource;
          this.element = element;
          this.operationRecordList = [];
          this.operationRecordList.cursor = -1;
          this.focusedVM = null;
          this.treeParams = treeParams;
          this.common = common;
          this.utility = utility;
          this.rootVM = this;
          this.parentVM = null;
          this.file_id = null;
          this.root_id = null;
          this.file = null;
          this.title = null;
          this.fileRef = null;
          this.nodesRef = null;
          this.editing = false;
          this.updating = false;
          this.localChangedTime = 0;
          this.setToRemoteTime = 0;
          this.receiveRemoteTime = 0;
          this.localChangeWaitTime = 1000;
          this.localChangeWaitEpsilon = 10;
          this.remoteChangeWaitTime = 1000;
          this.remoteChangeWaitEpsilon = 50;
          this.filePath = null;
        }
        _inherits(Tree, _Node);
        _createClass(Tree, {
          activate: {value: function activate(params, queryString, routeConfig) {
              var _this = this;
              console.log("activate");
              console.log(params);
              this.file_id = params.file_id;
              this.root_id = params.root_id;
              this.flatVM = params.flatVM;
              if ("online" == params.type) {
                this.rootRef = new Firebase(this.common.firebase_url);
                var authData = this.rootRef.getAuth();
                if (!authData) {
                  console.log("Please login!");
                  return ;
                }
                this.fileRef = this.rootRef.child("/notes/users/" + authData.uid + "/files/" + this.file_id);
                this.nodesRef = this.fileRef.child("nodes");
                if (this.flatVM && this.flatVM.file) {
                  this.file = this.flatVM.file;
                  this.loadNode(this.root_id, false);
                  this.loadTitle(this.root_id);
                  this.flatVM.addChildVM(this, this.root_id);
                  this.utility.initInteract(this.root_id, this.flatVM);
                } else {
                  var that = this;
                  this.fileRef.once("value", function(dataSnapshot) {
                    that.file = dataSnapshot.val();
                    if (that.file) {
                      that.loadNode(that.root_id, false);
                      that.loadTitle(that.root_id);
                    }
                  });
                }
              } else if (window.is_nodewebkit) {
                this.path = this.treeParams.path;
                var that = this;
                return this.dataSource.load(this.path).then(function(jsonData) {
                  _this.jsonData = jsonData;
                  _this.node = JSON.parse(jsonData);
                })["catch"](function(err) {
                  console.log(err);
                });
              }
            }},
          attached: {value: function attached() {
              console.log("attached");
            }},
          detached: {value: function detached() {
              console.log("detached");
            }},
          clearNodeState: {value: function clearNodeState() {
              var visite = (function(_visite) {
                var _visiteWrapper = function visite(_x) {
                  return _visite.apply(this, arguments);
                };
                _visiteWrapper.toString = function() {
                  return _visite.toString();
                };
                return _visiteWrapper;
              })(function(vm) {
                vm.selected = false;
                for (var i = 0; i < vm.childVMList.length; i++) {
                  visite(vm.childVMList[i]);
                }
              });
              visite(this);
            }},
          cloneNode: {value: function cloneNode(node) {
              var that = this;
              function visite(node) {
                var newNode = new Object();
                that.copyAttributesWithoutChildren(newNode, node);
                newNode.children = [];
                for (var i = 0; node.children && i < node.children.length; i++) {
                  newNode.children.push(visite(node.children[i]));
                }
                ;
                return newNode;
              }
              return visite(node);
            }},
          copyAttributesWithoutChildren: {value: function copyAttributesWithoutChildren(newNode, node) {
              function copyAttributes(newNode, node, attrName) {
                if (typeof node[attrName] != "undefined")
                  newNode[attrName] = node[attrName];
              }
              var attrList = ["collapsed", "content", "fold", "icon", "id"];
              for (var i = 0; i < attrList.length; i++) {
                copyAttributes(newNode, node, attrList[i]);
              }
              ;
            }},
          copy: {value: function copy() {
              var selectedVMList = this.getSelectedVMList();
              if (0 >= selectedVMList.length && !!this.focusedVM)
                selectedVMList.push(this.focusedVM);
              var copiedSubTreeList = [];
              for (var i = 0; i < selectedVMList.length; i++) {
                var newSubTree = {
                  file_id: this.file_id,
                  subTree: this.utility.listToTree(this.rootVM.file.nodes, selectedVMList[i].node.id),
                  type: "tree_nodes"
                };
                copiedSubTreeList.push(newSubTree);
              }
              ;
              delete localStorage.clipboardData;
              localStorage.clipboardData = undefined;
              localStorage.clipboardData = JSON.stringify(copiedSubTreeList);
              console.log(localStorage.clipboardData);
            }},
          cloneSubTree: {value: function cloneSubTree(root_id) {
              var subTreeNodeList = [];
              var newRootId = null;
              var that = this;
              function visit(node_id) {
                var node = that.file.nodes[node_id];
                var children = [];
                for (var i = 0; node.children && i < node.children.length; i++) {
                  var newChildNode = visit(node.children[i]);
                  children.push(newChildNode.id);
                }
                ;
                var newNode = new Object();
                that.utility.copyAttributesWithoutChildren(newNode, node);
                if (node.id == root_id) {
                  newRootId = that.utility.getUniqueId();
                  newNode.id = newRootId;
                } else
                  newNode.id = that.utility.getUniqueId();
                newNode.children = children;
                subTreeNodeList.push(newNode);
                return newNode;
              }
              visit(root_id);
              return {
                root_id: newRootId,
                nodes: subTreeNodeList
              };
            }},
          createTreeFromOnlineData: {value: function createTreeFromOnlineData(nodeId, onlineNotesList) {
              var that = this;
              function visite(nodeId, onlineNotesList) {
                var node = onlineNotesList[nodeId];
                if (!node) {
                  return null;
                }
                var newNode = new Object();
                that.copyAttributesWithoutChildren(newNode, node);
                newNode.children = [];
                for (var i = 0; node.children && i < node.children.length; i++) {
                  var child = visite(node.children[i], onlineNotesList);
                  if (!child)
                    continue;
                  child.parent = newNode;
                  newNode.children.push(child);
                }
                ;
                return newNode;
              }
              var tree = visite(nodeId, onlineNotesList);
              return tree;
            }},
          createNewNode: {value: function createNewNode(parent_id, insertPosition) {
              var newNode = this.utility.createNewNode();
              var newNodeList = [newNode];
              console.log("insertPosition");
              console.log(insertPosition);
              this.insertSubTree(parent_id, insertPosition, newNodeList, newNode.id);
              var nodeRecordList = [];
              var nodeRecord = {
                parent_id: parent_id,
                position: insertPosition,
                node_id: newNode.id,
                subTree: newNode
              };
              nodeRecordList.push(nodeRecord);
              this.record(nodeRecordList, "insert");
              return newNode;
            }},
          "delete": {value: function _delete() {
              console.log("delete");
              var selectedVMList = this.getSelectedVMList();
              console.log(selectedVMList);
              if (0 >= selectedVMList.length && !!this.focusedVM)
                selectedVMList.push(this.focusedVM);
              console.log(selectedVMList);
              var nodeRecordList = [];
              for (var i = selectedVMList.length - 1; i >= 0; i--) {
                var parentId = selectedVMList[i].parentVM.node.id;
                var nodeId = selectedVMList[i].node.id;
                var subTree = this.utility.listToTree(this.rootVM.file.nodes, nodeId);
                var position = this.removeSubTree(parentId, nodeId);
                var nodeRecord = {
                  parent_id: parentId,
                  position: position,
                  subTree: subTree
                };
                nodeRecordList.push(nodeRecord);
              }
              ;
              this.rootVM.record(nodeRecordList, "remove");
            }},
          focusAt: {value: function focusAt(id) {
              $(this.element).find("#" + id + " textarea").focus();
            }},
          onTitleKeyDown: {value: function onTitleKeyDown(event) {
              if (13 == event.keyCode && event.shiftKey) {
                var node = this.createNewNode(this.root_id, 0);
                var that = this;
                setTimeout(function() {
                  that.focusAt(node.id);
                }, 10);
                return false;
              } else if (event.ctrlKey && 46 == event.keyCode && this.flatVM) {
                this.flatVM["delete"](this.file.nodes[this.root_id]);
                return false;
              } else if (event.ctrlKey && 192 == event.keyCode) {
                this.openSubTreeInNewWindow(this.node.id);
              }
              return true;
            }},
          onTitleKeyUp: {value: function onTitleKeyUp(event) {
              var that = this;
              this.doEdit(function() {
                if ("root" == that.root_id) {
                  that.fileRef.child("meta/name").set(that.title);
                } else {
                  that.nodesRef.child(that.root_id).child("content").set(that.title);
                  that.file.nodes[that.root_id].content = that.title;
                }
              });
              return true;
            }},
          focusNodeAt: {value: function focusNodeAt(positionArray) {
              var vm = this.getVMByPositionArray(positionArray);
              if (vm)
                vm.element.children[0].children[1].focus();
            }},
          paste: {value: function paste() {
              if (!this.focusedVM) {
                return ;
              }
              var clipboardData = localStorage.getItem("clipboardData");
              if (!clipboardData) {
                return ;
              }
              var copiedSubTreeList = JSON.parse(clipboardData);
              this.clearNodeState();
              var parent = this.focusedVM.parentVM.node;
              var position = -1;
              for (var i = 0; i < parent.children.length; i++) {
                console.log("test id: " + parent.children[i].id + " " + this.focusedVM.node.id);
                if (parent.children[i] == this.focusedVM.node.id) {
                  position = i;
                  break;
                }
              }
              ;
              var nodeRecordList = [];
              for (var i = 0; i < copiedSubTreeList.length; i++) {
                var ret = this.utility.treeToList(copiedSubTreeList[i].subTree);
                var insertPosition = position + i + 1;
                this.rootVM.insertSubTree(parent.id, insertPosition, ret.nodes, ret.root_id);
                var nodeRecord = {
                  parent_id: parent.id,
                  position: insertPosition,
                  node_id: ret.root_id,
                  subTree: copiedSubTreeList[i].subTree
                };
                nodeRecordList.push(nodeRecord);
              }
              ;
              this.record(nodeRecordList, "insert");
            }},
          getNodeDataById: {value: function getNodeDataById(tree, id) {
              function visite(node) {
                if (id == node.id) {
                  return node;
                }
                var ret = null;
                for (var i = 0; node.children && i < node.children.length; i++) {
                  ret = visite(node.children[i]);
                  if (!ret)
                    break;
                }
                ;
                return ret;
              }
              return visite(tree);
            }},
          getVMByPositionArray: {value: function getVMByPositionArray(positionArray) {
              var vm = this;
              for (var i = 0; i < positionArray.length; i++) {
                vm = vm.childVMList[positionArray[i]];
              }
              ;
              return vm;
            }},
          getSelectedVMList: {value: function getSelectedVMList() {
              var selectedVMList = [];
              var visite = (function(_visite) {
                var _visiteWrapper = function visite(_x) {
                  return _visite.apply(this, arguments);
                };
                _visiteWrapper.toString = function() {
                  return _visite.toString();
                };
                return _visiteWrapper;
              })(function(vm) {
                if (vm.selected) {
                  selectedVMList.push(vm);
                } else {
                  for (var i = 0; i < vm.childVMList.length; i++) {
                    visite(vm.childVMList[i]);
                  }
                  ;
                }
              });
              visite(this);
              return selectedVMList;
            }},
          insertNodeAt: {value: function insertNodeAt(positionArray, node) {
              console.log("insertNodeAt");
              var positionArray = JSON.parse(JSON.stringify(positionArray));
              var insertPosition = positionArray.pop();
              var vm = this.getVMByPositionArray(positionArray);
              var newNode = this.utility.clone(node);
              this.addObserver(newNode);
              vm.node.children.splice(insertPosition, 0, newNode);
              var that = this;
              var visite = (function(_visite) {
                var _visiteWrapper = function visite(_x) {
                  return _visite.apply(this, arguments);
                };
                _visiteWrapper.toString = function() {
                  return _visite.toString();
                };
                return _visiteWrapper;
              })(function(node) {
                console.log("save");
                console.log("node");
                var newNode = new Object();
                that.copyAttributesWithoutChildren(newNode, node);
                newNode.children = [];
                for (var i = 0; node.children && i < node.children.length; i++) {
                  newNode.children.push(node.children[i].id);
                }
                ;
                var ref = new Firebase(that.common.firebase_url);
                var authData = ref.getAuth();
                var nodeRef = ref.child("notes").child("users").child(authData.uid).child("files").child(that.file_id).child("nodes").child(node.id);
                nodeRef.set(newNode);
                for (var i = 0; i < node.children.length; i++) {
                  visite(node.children[i]);
                }
                ;
              });
              visite(newNode);
            }},
          loadTitle: {value: function loadTitle(root_id) {
              var that = this;
              this.titleUpdate = function(dataSnapshot) {
                that.title = dataSnapshot.val();
              };
              setTimeout(function() {
                var title = $(that.element).find("#title");
                autosize(title);
              }, 10);
              if ("root" == root_id) {
                this.title = this.file.meta.name;
                this.fileRef.child("meta/name").on("value", this.titleUpdate);
              } else {
                this.nodesRef.child(root_id).child("content").on("value", this.titleUpdate);
              }
            }},
          onKeyDown: {value: function onKeyDown(event) {
              if (13 == event.keyCode) {
                var currNodePosition = -1;
                for (var i = 0; i < this.focusedVM.parentVM.node.children.length; i++) {
                  if (this.focusedVM.node.id == this.focusedVM.parentVM.node.children[i]) {
                    currNodePosition = i;
                    break;
                  }
                }
                ;
                var insertParentNodeId = -1;
                var insertPosition = -1;
                if (event.altKey) {
                  insertParentNodeId = this.focusedVM.parentVM.node.id;
                  insertPosition = currNodePosition;
                } else if (event.ctrlKey) {
                  insertParentNodeId = this.focusedVM.parentVM.node.id;
                  insertPosition = currNodePosition + 1;
                } else if (event.shiftKey) {
                  insertParentNodeId = this.focusedVM.node.id;
                  insertPosition = 0;
                } else {
                  return true;
                }
                var node = this.createNewNode(insertParentNodeId, insertPosition);
                var that = this;
                setTimeout(function() {
                  that.focusAt(node.id);
                }, 10);
                return false;
              } else if (event.ctrlKey && 46 == event.keyCode) {
                this["delete"]();
                return false;
              } else if (27 == event.keyCode) {
                this.clearNodeState();
                return false;
              } else if (67 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.copy();
                return false;
              } else if (88 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.copy();
                this["delete"]();
                return false;
              } else if (86 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.paste();
                return false;
              } else if (83 == event.keyCode && event.ctrlKey) {
                this.save();
                return false;
              } else if (83 == event.keyCode && event.altKey) {
                if (this.focusedVM)
                  this.focusedVM.fold();
              } else if (90 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.undo();
                return false;
              } else if (89 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.redo();
                return false;
              } else if (187 == event.keyCode && event.altKey) {
                if (this.focusedVM)
                  this.focusedVM.stepIcon(true);
                return false;
              } else if (189 == event.keyCode && event.altKey) {
                if (this.focusedVM)
                  this.focusedVM.stepIcon(false);
                return false;
              }
              return true;
            }},
          removeNodeAt: {value: function removeNodeAt(positionArray) {
              console.log("removeNodeAt:" + positionArray.toString());
              var parentPositionArray = JSON.parse(JSON.stringify(positionArray));
              var removePosition = parentPositionArray.pop();
              var vm = this.getVMByPositionArray(positionArray);
              var parentVM = this.getVMByPositionArray(parentPositionArray);
              var that = this;
              setTimeout(function() {
                parentVM.removeChildVM(vm);
                var removedNodes = parentVM.node.children.splice(removePosition, 1);
                console.log("removedNodes");
                console.log(removedNodes);
                for (var i = 0; removedNodes && i < removedNodes.length; i++) {
                  that.removeObserver(removedNodes[i]);
                  var visite = (function(_visite) {
                    var _visiteWrapper = function visite(_x) {
                      return _visite.apply(this, arguments);
                    };
                    _visiteWrapper.toString = function() {
                      return _visite.toString();
                    };
                    return _visiteWrapper;
                  })(function(node) {
                    var ref = new Firebase(that.common.firebase_url);
                    var authData = ref.getAuth();
                    var nodeRef = ref.child("notes").child("users").child(authData.uid).child("files").child(that.file_id).child("nodes").child(node.id);
                    nodeRef.remove();
                    for (var i = 0; i < node.children.length; i++) {
                      visite(node.children[i]);
                    }
                    ;
                  });
                  visite(removedNodes[i]);
                }
                ;
              }, 0);
            }},
          uncollapsed: {value: function uncollapsed(positionArray) {
              var node = this.node;
              for (var i = 0; i < positionArray.length; i++) {
                node.collapsed = false;
                node = node.children[positionArray[i]];
              }
              ;
            }},
          save: {value: function save() {
              console.log(this.focusedVM.element);
            }},
          select: {value: function select(positionArray) {
              var vm = getVMByPositionArray(positionArray);
              vm.select();
            }}
        }, {inject: {value: function inject() {
              return [DataSource, Element, TreeParams, Common, Utility];
            }}});
        return Tree;
      })(Node));
    }
  };
});

(function() {
function define(){};  define.amd = {};
(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    System.register("github:jackmoore/autosize@2.0.0/dest/autosize", [], false, function(__require, __exports, __module) {
      return (factory).call(this);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.autosize = factory();
  }
}(this, function() {
  function main(ta) {
    if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || ta.hasAttribute('data-autosize-on')) {
      return ;
    }
    var maxHeight;
    var heightOffset;
    function init() {
      var style = window.getComputedStyle(ta, null);
      if (style.resize === 'vertical') {
        ta.style.resize = 'none';
      } else if (style.resize === 'both') {
        ta.style.resize = 'horizontal';
      }
      ta.style.wordWrap = 'break-word';
      var width = ta.style.width;
      ta.style.width = '0px';
      ta.offsetWidth;
      ta.style.width = width;
      maxHeight = style.maxHeight !== 'none' ? parseFloat(style.maxHeight) : false;
      if (style.boxSizing === 'content-box') {
        heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
      } else {
        heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      }
      adjust();
    }
    function adjust() {
      var startHeight = ta.style.height;
      var htmlTop = document.documentElement.scrollTop;
      var bodyTop = document.body.scrollTop;
      ta.style.height = 'auto';
      var endHeight = ta.scrollHeight + heightOffset;
      if (maxHeight !== false && maxHeight < endHeight) {
        endHeight = maxHeight;
        if (ta.style.overflowY !== 'scroll') {
          ta.style.overflowY = 'scroll';
        }
      } else if (ta.style.overflowY !== 'hidden') {
        ta.style.overflowY = 'hidden';
      }
      ta.style.height = endHeight + 'px';
      document.documentElement.scrollTop = htmlTop;
      document.body.scrollTop = bodyTop;
      if (startHeight !== ta.style.height) {
        var evt = document.createEvent('Event');
        evt.initEvent('autosize.resized', true, false);
        ta.dispatchEvent(evt);
      }
    }
    if ('onpropertychange' in ta && 'oninput' in ta) {
      ta.addEventListener('keyup', adjust);
    }
    window.addEventListener('resize', adjust);
    ta.addEventListener('input', adjust);
    ta.addEventListener('autosize.update', adjust);
    ta.addEventListener('autosize.destroy', function(style) {
      window.removeEventListener('resize', adjust);
      ta.removeEventListener('input', adjust);
      ta.removeEventListener('keyup', adjust);
      ta.removeEventListener('autosize.destroy');
      Object.keys(style).forEach(function(key) {
        ta.style[key] = style[key];
      });
      ta.removeAttribute('data-autosize-on');
    }.bind(ta, {
      height: ta.style.height,
      overflow: ta.style.overflow,
      overflowY: ta.style.overflowY,
      wordWrap: ta.style.wordWrap,
      resize: ta.style.resize
    }));
    ta.setAttribute('data-autosize-on', true);
    ta.style.overflow = 'hidden';
    ta.style.overflowY = 'hidden';
    init();
  }
  if (typeof window.getComputedStyle !== 'function') {
    return function(elements) {
      return elements;
    };
  } else {
    return function(elements) {
      if (elements && elements.length) {
        Array.prototype.forEach.call(elements, main);
      } else if (elements && elements.nodeName) {
        main(elements);
      }
      return elements;
    };
  }
}));
})();
(function() {
function define(){};  define.amd = {};
System.register("github:jackmoore/autosize@2.0.0", ["github:jackmoore/autosize@2.0.0/dest/autosize"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:jackmoore/autosize@2.0.0/dest/autosize'));
});
})();
System.register("tree-node", ["github:aurelia/framework@0.9.0", "common", "data-source", "node", "utility", "github:jackmoore/autosize@2.0.0"], function(_export) {
  var Behavior,
      Common,
      DataSource,
      Node,
      Utility,
      _createClass,
      _get,
      _inherits,
      _classCallCheck,
      TreeNode;
  return {
    setters: [function(_aureliaFramework) {
      Behavior = _aureliaFramework.Behavior;
    }, function(_common) {
      Common = _common.Common;
    }, function(_dataSource) {
      DataSource = _dataSource.DataSource;
    }, function(_node) {
      Node = _node.Node;
    }, function(_utility) {
      Utility = _utility.Utility;
    }, function(_jqueryAutosize) {}],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      TreeNode = _export("TreeNode", (function(_Node) {
        function TreeNode(common, element, dataSource, utility) {
          _classCallCheck(this, TreeNode);
          _get(Object.getPrototypeOf(TreeNode.prototype), "constructor", this).call(this);
          this.common = common;
          this.selected = false;
          this.element = element;
          this.dataSource = dataSource;
          this.utility = utility;
          this.ta = null;
        }
        _inherits(TreeNode, _Node);
        _createClass(TreeNode, {
          activate: {value: function activate(model) {
              this.parentVM = model.parentVM;
              this.rootVM = model.parentVM.rootVM;
              this.parentVM.addChildVM(this, model.node_id);
              this.loadNode(model.node_id, false);
            }},
          foldNode: {value: function foldNode() {
              if (this.node && !this.node.fold) {
                autosize(this.ta);
              } else {
                var evt = document.createEvent("Event");
                evt.initEvent("autosize.destroy", true, false);
                this.ta.dispatchEvent(evt);
                this.ta.style.height = this.ta.scrollHeight;
              }
            }},
          attached: {value: function attached() {
              if (this.element.children[0].children[1])
                this.ta = this.element.children[0].children[1];
              if (this.ta && this.node)
                this.foldNode();
            }},
          deactivate: {value: function deactivate() {
              console.log("deactivate");
            }},
          detached: {value: function detached() {
              this.removeObserver(this.node.id);
              this.parentVM.removeChildVM(this);
            }},
          fold: {value: function fold() {
              this.node.fold = !this.node.fold;
              this.foldNode(this.node.fold);
              this.setNodeToServer(this.node.id);
            }},
          stepIcon: {value: function stepIcon(direction) {
              if (direction)
                this.node.icon++;
              else
                this.node.icon--;
              if (this.node.icon > 7)
                this.node.icon = 0;
              if (this.node.icon < 0)
                this.node.icon = 7;
              this.setNodeToServer(this.node.id);
            }},
          toggle: {value: function toggle() {
              this.node.collapsed = !this.node.collapsed;
              this.setNodeToServer(this.node.id);
            }},
          getPositionArray: {value: function getPositionArray() {
              var positionArray = [];
              var vm = this;
              while (vm.parentVM) {
                for (var i = 0; i < vm.parentVM.node.children.length; i++) {
                  if (vm.parentVM.node.children[i].id == vm.node.id) {
                    positionArray.unshift(i);
                    break;
                  }
                }
                ;
                vm = vm.parentVM;
              }
              return positionArray;
            }},
          onBlur: {value: function onBlur(event) {
              this.rootVM.focusedVM = null;
            }},
          onClick: {value: function onClick(event) {
              if (event.ctrlKey) {
                this.select(!this.selected);
                return true;
              }
            }},
          onFocus: {value: function onFocus(event) {
              this.rootVM.focusedVM = this;
            }},
          onKeyDown: {value: function onKeyDown(event) {
              if (event.ctrlKey && 192 == event.keyCode) {
                this.openSubTreeInNewWindow(this.node.id);
                return false;
              }
              return true;
            }},
          onKeyUp: {value: function onKeyUp(event) {
              var keyList = [{
                start: 9,
                end: 9
              }, {
                start: 16,
                end: 27
              }, {
                start: 33,
                end: 40
              }, {
                start: 144,
                end: 145
              }];
              var combindKeyList = [{
                key: 13,
                alt: true,
                ctrl: false,
                shift: false
              }, {
                key: 13,
                alt: false,
                ctrl: true,
                shift: false
              }, {
                key: 13,
                alt: false,
                ctrl: false,
                shift: true
              }, {
                key: 46,
                alt: false,
                ctrl: true,
                shift: false
              }, {
                key: 27,
                alt: false,
                ctrl: false,
                shift: false
              }, {
                key: 67,
                alt: false,
                ctrl: true,
                shift: true
              }, {
                key: 88,
                alt: false,
                ctrl: true,
                shift: true
              }, {
                key: 86,
                alt: false,
                ctrl: true,
                shift: true
              }, {
                key: 83,
                alt: false,
                ctrl: true,
                shift: false
              }, {
                key: 70,
                alt: true,
                ctrl: false,
                shift: false
              }, {
                key: 90,
                alt: false,
                ctrl: true,
                shift: true
              }, {
                key: 89,
                alt: false,
                ctrl: true,
                shift: true
              }, {
                key: 187,
                alt: true,
                ctrl: false,
                shift: false
              }, {
                key: 189,
                alt: true,
                ctrl: false,
                shift: false
              }];
              var needUpdate = true;
              for (var i = 0; i < keyList.length; i++) {
                if (event.keyCode >= keyList[i].start && event.keyCode <= keyList[i].end) {
                  needUpdate = false;
                  break;
                }
              }
              ;
              if (needUpdate) {
                for (var i = 0; i < combindKeyList.length; i++) {
                  if (event.keyCode == combindKeyList[i].key && event.altKey == combindKeyList[i].alt && event.ctrlKey == combindKeyList[i].ctrl && event.shiftKey == combindKeyList[i].shift) {
                    needUpdate = false;
                    break;
                  }
                }
                ;
              }
              if (needUpdate) {
                this.setNodeToServer(this.node.id);
              }
              ;
              return true;
            }},
          resize: {value: function resize() {
              if (!this.ta) {
                return ;
              }
              var evt = document.createEvent("Event");
              evt.initEvent("autosize.update", true, false);
              this.ta.dispatchEvent(evt);
              this.ta.style.height = this.ta.scrollHeight;
            }},
          select: {value: function select(selected) {
              this.selected = selected;
              for (var i = 0; i < this.childVMList.length; i++) {
                this.childVMList[i].select(selected);
              }
              ;
            }}
        }, {inject: {value: function inject() {
              return [Common, Element, DataSource, Utility];
            }}});
        return TreeNode;
      })(Node));
    }
  };
});

System.register("login", ["github:firebase/firebase-bower@2.2.3", "common", "utility", "github:aurelia/framework@0.9.0", "github:aurelia/router@0.6.0"], function(_export) {
  var Common,
      Utility,
      Parent,
      Router,
      _createClass,
      _classCallCheck,
      Login;
  return {
    setters: [function(_firebase) {}, function(_common) {
      Common = _common.Common;
    }, function(_utility) {
      Utility = _utility.Utility;
    }, function(_aureliaFramework) {
      Parent = _aureliaFramework.Parent;
    }, function(_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Login = _export("Login", (function() {
        function Login(common, utility, router) {
          _classCallCheck(this, Login);
          this.common = common;
          this.utility = utility;
          this.router = router;
        }
        _createClass(Login, {
          login: {value: function login() {
              console.log("login");
              var that = this;
              var ref = new Firebase(this.common.firebase_url);
              ref.authWithPassword({
                email: $("#login-username").val(),
                password: $("#login-password").val()
              }, function(err, authData) {
                console.log(err);
                if (err) {
                  alert("Login Error: " + err.code);
                } else if (authData) {
                  console.log("Logged In! User ID: " + authData.uid);
                  that.router.navigate("fm");
                }
              });
            }},
          signUp: {value: function signUp() {
              var ref = new Firebase(this.common.firebase_url);
              var email = $("#signup-email").val();
              var password = $("#signup-password").val();
              var name = $("#signup-name").val();
              var that = this;
              ref.createUser({
                email: email,
                password: password
              }, function(error, userData) {
                if (error) {
                  console.log("Error creating user:", error);
                } else {
                  console.log("Successfully created user account with uid:", userData.uid);
                  ref.authWithPassword({
                    email: email,
                    password: password
                  }, function(err, authData) {
                    console.log(err);
                    if (err) {
                      alert("Login Error: " + err.code);
                    } else if (authData) {
                      console.log("Logged In! User ID: " + authData.uid);
                      var userNotesRef = ref.child("notes").child("users").child(userData.uid);
                      var file_id = that.utility.getUniqueId();
                      var user_notes_skeleton = {
                        directories: {nodes: {root: {
                              id: "root",
                              children: [file_id]
                            }}},
                        files: {}
                      };
                      var file_item = {id: file_id};
                      user_notes_skeleton.directories.nodes[file_id] = file_item;
                      var new_tree_note_skeleton = that.utility.clone(that.common.new_tree_note_skeleton);
                      new_tree_note_skeleton.meta.create_time = Firebase.ServerValue.TIMESTAMP;
                      user_notes_skeleton.files[file_id] = new_tree_note_skeleton;
                      userNotesRef.set(user_notes_skeleton);
                      var userInfoRef = ref.child("info").child("users").child(userData.uid);
                      var user_info = {
                        email: email,
                        name: name,
                        time: Firebase.ServerValue.TIMESTAMP,
                        id: file_id
                      };
                      userInfoRef.set(user_info);
                      window.location.href = window.location.origin + "/#fm";
                    }
                  });
                }
              });
            }}
        }, {inject: {value: function inject() {
              return [Common, Utility, Router];
            }}});
        return Login;
      })());
    }
  };
});

System.register("flat", ["utility", "common", "node"], function(_export) {
  var Utility,
      Common,
      Node,
      _createClass,
      _get,
      _inherits,
      _classCallCheck,
      Tree;
  return {
    setters: [function(_utility) {
      Utility = _utility.Utility;
    }, function(_common) {
      Common = _common.Common;
    }, function(_node) {
      Node = _node.Node;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Tree = _export("Tree", (function(_Node) {
        function Tree(common, utility) {
          _classCallCheck(this, Tree);
          _get(Object.getPrototypeOf(Tree.prototype), "constructor", this).call(this);
          this.common = common;
          this.utility = utility;
          this.operationRecordList = [];
          this.operationRecordList.cursor = -1;
          this.file_id = null;
          this.root_id = "root";
          this.rootVM = this;
          this.file = null;
          this.title = null;
          this.fileRef = null;
          this.nodesRef = null;
          this.filePath = null;
          this.editing = false;
          this.updating = false;
          this.localChangedTime = 0;
          this.setToRemoteTime = 0;
          this.receiveRemoteTime = 0;
          this.localChangeWaitTime = 200;
          this.localChangeWaitEpsilon = 10;
          this.remoteChangeWaitTime = 1000;
          this.remoteChangeWaitEpsilon = 50;
        }
        _inherits(Tree, _Node);
        _createClass(Tree, {
          activate: {value: function activate(params, queryString, routeConfig) {
              console.log("activate");
              this.file_id = params.file_id;
              this.rootRef = new Firebase(this.common.firebase_url);
              var authData = this.rootRef.getAuth();
              if (!authData) {
                console.log("Please login!");
                return ;
              }
              this.fileRef = this.rootRef.child("/notes/users/" + authData.uid + "/files/" + this.file_id);
              this.nodesRef = this.fileRef.child("nodes");
              if ("online" == params.type) {
                var ref = new Firebase(this.common.firebase_url);
                var authData = ref.getAuth();
                if (!authData) {
                  console.log("Please login!");
                  return ;
                }
                var that = this;
                this.fileRef.once("value", function(dataSnapshot) {
                  console.log("1111111111111dataSnapshot.val()");
                  that.file = dataSnapshot.val();
                  console.log(that.file);
                  if (that.file) {
                    that.node = that.file.nodes.root;
                    that.file_id = that.file.meta.id;
                    that.routeConfig.navModel.title = that.file.meta.name;
                    that.routeConfig.title = that.file.meta.name;
                    that.routeConfig.name = that.file.meta.name;
                    console.log(that.node);
                    console.log(that.file_id);
                    that.loadNode(that.root_id, true);
                    if (!that.node.children)
                      that.node.children = [];
                  }
                });
                this.nodesRef.child("root/children").on("value", function(dataSnapshot) {
                  var children = dataSnapshot.val();
                  for (var i = 0; i < children.length; i++) {
                    if (that.file && !that.file.nodes[children[i]]) {
                      var placeHolder = that.utility.createNewFlatNode();
                      placeHolder.id = children[i];
                      that.file.nodes[children[i]] = placeHolder;
                    }
                  }
                  ;
                });
              }
            }},
          canActivate: {value: function canActivate(params, queryString, routeConfig) {
              this.routeConfig = routeConfig;
              return true;
            }},
          "delete": {value: function _delete(node) {
              var nodeRecordList = [];
              var subTree = this.utility.listToTree(this.rootVM.file.nodes, node.id);
              var position = this.removeSubTree(this.file.nodes.root.id, node.id);
              var nodeRecord = {
                parent_id: this.root_id,
                position: position,
                subTree: subTree
              };
              nodeRecordList.push(nodeRecord);
              this.rootVM.record(nodeRecordList, "remove");
            }},
          newFlatNode: {value: function newFlatNode() {
              var flatNode = this.utility.createNewFlatNode();
              this.nodesRef.child(flatNode.id).set(flatNode);
              var children = this.utility.getCleanChildren(this.node);
              this.file.nodes[flatNode.id] = flatNode;
              this.node.children.push(flatNode.id);
              children.push(flatNode.id);
              this.nodesRef.child("root/children").set(children);
              var nodeRecordList = [];
              var nodeRecord = {
                parent_id: this.root_id,
                position: children.length - 1,
                node_id: flatNode.id,
                subTree: flatNode
              };
              nodeRecordList.push(nodeRecord);
              this.record(nodeRecordList, "insert");
            }},
          newTemporaryMosaic: {value: function newTemporaryMosaic() {
              window.open(window.location.origin + "#mosaic");
            }},
          onClick: {value: function onClick(event) {
              var delta = 100;
              if (!event.ctrlKey) {
                var y = event.pageY;
                var expand = null;
                if (!event.shiftKey) {
                  expand = true;
                } else {
                  expand = false;
                }
                for (var i = 0; i < this.node.children.length; i++) {
                  var node = this.file.nodes[this.node.children[i]];
                  if (node.y > y) {
                    if (expand) {
                      node.y += delta;
                    } else {
                      node.y -= delta;
                    }
                    this.nodesRef.child(node.id + "/y").set(node.y);
                  }
                }
                ;
                if (expand) {
                  this.node.height += delta;
                } else {
                  this.node.height -= delta;
                }
                this.nodesRef.child(this.node.id + "/height").set(this.node.height);
              } else {
                var x = event.pageX;
                var expand = null;
                if (!event.shiftKey) {
                  expand = true;
                } else {
                  expand = false;
                }
                for (var i = 0; i < this.node.children.length; i++) {
                  var node = this.file.nodes[this.node.children[i]];
                  if (node.x > x) {
                    if (expand) {
                      node.x += delta;
                    } else {
                      node.x -= delta;
                    }
                  }
                  this.nodesRef.child(node.id + "/x").set(node.x);
                }
                if (expand) {
                  this.node.width += delta;
                } else {
                  this.node.width -= delta;
                }
                this.nodesRef.child(this.node.id + "/width").set(this.node.width);
              }
              return false;
            }},
          onWindowClick: {value: function onWindowClick(event) {
              event.stopPropagation();
              return false;
            }},
          setPositionToRemoteServer: {value: function setPositionToRemoteServer(id) {
              var element = $("#" + id);
              var that = this;
              this.doEdit(function() {
                var newNode = new Object();
                that.utility.copyAttributes(newNode, that.rootVM.file.nodes[id]);
                newNode.x = element.position().left;
                newNode.y = element.position().top;
                newNode.width = element.width();
                newNode.height = element.height();
                that.nodesRef.child(id).set(newNode);
              });
            }}
        }, {inject: {value: function inject() {
              return [Common, Utility];
            }}});
        return Tree;
      })(Node));
    }
  };
});

System.register("app", ["github:firebase/firebase-bower@2.2.3", "github:aurelia/router@0.6.0"], function(_export) {
  var Router,
      _createClass,
      _classCallCheck,
      App;
  return {
    setters: [function(_firebase) {}, function(_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      App = _export("App", (function() {
        function App(router) {
          _classCallCheck(this, App);
          window.is_nodewebkit = typeof process == "object";
          if (window.is_nodewebkit) {
            window.require = function(moduleName) {
              var tmp = window.global;
              window.global = window.node_global;
              var module = window.global.require(moduleName);
              window.global = tmp;
              return module;
            };
          }
          this.router = router;
          this.router.configure(function(config) {
            config.title = "BooguNote5";
            config.map([{
              route: ["index"],
              moduleId: "index",
              nav: true
            }, {
              route: ["tree/:type/:file_id/:root_id"],
              moduleId: "tree",
              nav: true
            }, {
              route: ["", "login"],
              moduleId: "login",
              nav: true
            }, {
              route: ["fm"],
              moduleId: "./file_manager/tree",
              nav: true
            }, {
              route: ["flat/:type/:file_id/:root_id"],
              moduleId: "flat",
              nav: true,
              title: "aaaa"
            }, {
              route: ["mosaic/:type/:file_id", "mosaic"],
              moduleId: "mosaic/mosaic",
              nav: true
            }]);
          });
        }
        _createClass(App, null, {inject: {value: function inject() {
              return [Router];
            }}});
        return App;
      })());
    }
  };
});

System.register("mosaic/node", ["utility", "common"], function(_export) {
  var Utility,
      Common,
      _createClass,
      _classCallCheck,
      Node;
  return {
    setters: [function(_utility) {
      Utility = _utility.Utility;
    }, function(_common) {
      Common = _common.Common;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Node = _export("Node", (function() {
        function Node(common, utility) {
          _classCallCheck(this, Node);
          this.common = common;
          this.utility = utility;
        }
        _createClass(Node, {
          getRowAndColomeById: {value: function getRowAndColomeById(id) {
              for (var i = 0; i < this.rootVM.file.rows.length; i++) {
                for (var j = 0; j < this.rootVM.file.rows[i].tiles.length; j++) {
                  if (id == this.rootVM.file.rows[i].tiles[j].id) {
                    return {
                      row: i,
                      column: j
                    };
                  }
                }
              }
              ;
            }},
          getCleanTile: {value: function getCleanTile(tile) {
              return {
                id: tile.id,
                flex: tile.flex,
                url: tile.url
              };
            }},
          getCleanRow: {value: function getCleanRow(row) {
              var tiles = [];
              for (var i = 0; i < row.tiles.length; i++) {
                tiles.push(this.getCleanTile(row.tiles[i]));
              }
              ;
              return {
                id: row.id,
                height: row.height,
                tiles: tiles
              };
            }},
          getCleanMosaic: {value: function getCleanMosaic(file) {
              var rows = [];
              for (var i = 0; i < file.rows.length; i++) {
                rows.push(this.getCleanRow(file.rows[i]));
              }
              ;
              return {
                meta: {
                  id: file.meta.id,
                  create_time: file.meta.create_time,
                  name: file.meta.name,
                  type: file.meta.type
                },
                rows: rows
              };
            }},
          doEdit: {value: function doEdit(realEdit) {
              var that = this;
              var edit = (function(_edit) {
                var _editWrapper = function edit() {
                  return _edit.apply(this, arguments);
                };
                _editWrapper.toString = function() {
                  return _edit.toString();
                };
                return _editWrapper;
              })(function() {
                if (that.rootVM.editing && that.utility.now() - that.rootVM.localChangedTime < that.rootVM.localChangeWaitTime - that.rootVM.localChangeWaitEpsilon) {
                  setTimeout(edit, that.rootVM.localChangeWaitTime);
                } else {
                  that.rootVM.editing = false;
                }
              });
              this.rootVM.localChangedTime = this.utility.now();
              if (!this.rootVM.editing) {
                this.rootVM.editing = true;
                setTimeout(edit, that.rootVM.localChangeWaitTime);
              }
              ;
              realEdit();
            }}
        }, {inject: {value: function inject() {
              return [Common, Utility];
            }}});
        return Node;
      })());
    }
  };
});

System.register("mosaic/tile", ["utility", "common", "mosaic/node"], function(_export) {
  var Utility,
      Common,
      Node,
      _createClass,
      _inherits,
      _classCallCheck,
      Tile;
  return {
    setters: [function(_utility) {
      Utility = _utility.Utility;
    }, function(_common) {
      Common = _common.Common;
    }, function(_node) {
      Node = _node.Node;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Tile = _export("Tile", (function(_Node) {
        function Tile(common, element, utility) {
          _classCallCheck(this, Tile);
          this.common = common;
          this.element = element;
          this.utility = utility;
          this.iframe_id = this.utility.getUniqueId();
        }
        _inherits(Tile, _Node);
        _createClass(Tile, {
          activate: {value: function activate(model) {
              this.parentVM = model.parentVM;
              this.rootVM = this.parentVM.rootVM;
              this.tile = model.tile;
              this.showUrl = this.tile.url;
            }},
          loadUrl: {value: function loadUrl() {
              this.tile.url = this.showUrl;
              document.querySelector("#" + this.iframe_id).contentWindow.location.reload(true);
              this.updateTile();
            }},
          out: {value: function out() {
              window.open(this.tile.url);
            }},
          remove: {value: function remove() {
              this.parentVM.removeTile(this.tile.id);
            }},
          wider: {value: function wider() {
              this.tile.flex += 0.1;
              this.updateTile();
            }},
          smaller: {value: function smaller() {
              this.tile.flex -= 0.1;
              this.updateTile();
            }},
          updateFlex: {value: function updateFlex() {
              var position = this.getRowAndColomeById(this.tile.id);
              this.rootVM.fileRef.child("rows/" + position.row + "/tiles/" + position.column + "/flex").set(this.tile.flex);
            }},
          updateTile: {value: function updateTile() {
              var position = this.getRowAndColomeById(this.tile.id);
              var that = this;
              this.doEdit(function() {
                if (that.rootVM.fileRef)
                  that.rootVM.fileRef.child("rows/" + position.row + "/tiles/" + position.column).set(that.getCleanTile(that.tile));
              });
            }}
        }, {inject: {value: function inject() {
              return [Common, Element, Utility];
            }}});
        return Tile;
      })(Node));
    }
  };
});

System.register("mosaic/row", ["utility", "common", "mosaic/node"], function(_export) {
  var Utility,
      Common,
      Node,
      _createClass,
      _inherits,
      _classCallCheck,
      Tile;
  return {
    setters: [function(_utility) {
      Utility = _utility.Utility;
    }, function(_common) {
      Common = _common.Common;
    }, function(_node) {
      Node = _node.Node;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Tile = _export("Tile", (function(_Node) {
        function Tile(common, utility) {
          _classCallCheck(this, Tile);
          this.common = common;
          this.utility = utility;
        }
        _inherits(Tile, _Node);
        _createClass(Tile, {
          activate: {value: function activate(model) {
              this.parentVM = model.parentVM;
              this.rootVM = this.parentVM.rootVM;
              this.row = model.row;
            }},
          newTile: {value: function newTile() {
              var tile = {
                id: this.utility.getUniqueId(),
                flex: 1,
                url: ""
              };
              this.row.tiles.push(tile);
              this.updateRow();
            }},
          removeRow: {value: function removeRow() {
              this.parentVM.removeRow(this.row.id);
            }},
          removeTile: {value: function removeTile(id) {
              var position = -1;
              for (var i = 0; i < this.row.tiles.length; i++) {
                if (id == this.row.tiles[i].id) {
                  position = i;
                  break;
                }
              }
              ;
              this.row.tiles.splice(position, 1);
              this.updateRow();
            }},
          resetRow: {value: function resetRow() {
              for (var i = this.row.tiles.length - 1; i >= 0; i--) {
                this.row.tiles[i].flex = 1;
              }
              ;
              this.updateRow();
            }},
          setHeight: {value: function setHeight(increase) {
              this.row.height += increase ? 100 : -100;
              this.updateRow();
            }},
          updateRow: {value: function updateRow() {
              var position = -1;
              for (var i = 0; i < this.rootVM.file.rows.length; i++) {
                if (this.row.id == this.rootVM.file.rows[i].id) {
                  position = i;
                  break;
                }
              }
              ;
              var that = this;
              this.doEdit(function() {
                if (that.rootVM.fileRef)
                  that.rootVM.fileRef.child("rows/" + position).set(that.getCleanRow(that.row));
              });
            }}
        }, {inject: {value: function inject() {
              return [Common, Utility];
            }}});
        return Tile;
      })(Node));
    }
  };
});

System.register("mosaic/mosaic", ["utility", "common", "mosaic/node"], function(_export) {
  var Utility,
      Common,
      Node,
      _createClass,
      _inherits,
      _classCallCheck,
      Mosaic;
  return {
    setters: [function(_utility) {
      Utility = _utility.Utility;
    }, function(_common) {
      Common = _common.Common;
    }, function(_node) {
      Node = _node.Node;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Mosaic = _export("Mosaic", (function(_Node) {
        function Mosaic(common, utility) {
          _classCallCheck(this, Mosaic);
          this.common = common;
          this.utility = utility;
          this.file = null;
          this.rootVM = this;
          this.editing = false;
          this.updating = false;
          this.localChangedTime = 0;
          this.setToRemoteTime = 0;
          this.receiveRemoteTime = 0;
          this.localChangeWaitTime = 2000;
          this.localChangeWaitEpsilon = 10;
          this.remoteChangeWaitTime = 1000;
          this.remoteChangeWaitEpsilon = 50;
        }
        _inherits(Mosaic, _Node);
        _createClass(Mosaic, {
          activate: {value: function activate(params) {
              if (!params.file_id) {
                this.file = this.utility.clone(this.common.new_mosaic_skeleton);
              } else {
                this.file_id = params.file_id;
                if ("online" == params.type) {
                  this.rootRef = new Firebase(this.common.firebase_url);
                  var authData = this.rootRef.getAuth();
                  if (!authData) {
                    console.log("Please login!");
                    return ;
                  }
                  this.fileRef = this.rootRef.child("/notes/users/" + authData.uid + "/files/" + this.file_id);
                  var that = this;
                  this.fileRef.on("value", function(dataSnapshot) {
                    console.log("dataSnapshot.val() " + that.rootVM.editing);
                    if (that.rootVM.editing)
                      return ;
                    var file = dataSnapshot.val();
                    if (file) {
                      if (!file.rows)
                        file.rows = [];
                      for (var i = 0; i < file.rows.length; i++) {
                        if (!file.rows[i].tiles)
                          file.rows[i].tiles = [];
                      }
                      ;
                      that.file = file;
                    }
                  });
                }
              }
            }},
          newRow: {value: function newRow() {
              var row = {
                height: 500,
                id: this.utility.getUniqueId(),
                tiles: [{
                  id: this.utility.getUniqueId(),
                  url: "",
                  flex: 1
                }]
              };
              this.file.rows.push(row);
              this.updateFile();
            }},
          newTemporaryMosaic: {value: function newTemporaryMosaic() {
              window.open(window.location.origin + "#mosaic");
            }},
          removeRow: {value: function removeRow(id) {
              var position = -1;
              for (var i = 0; i < this.file.rows.length; i++) {
                if (id == this.file.rows[i].id) {
                  position = i;
                  break;
                }
              }
              ;
              this.file.rows.splice(position, 1);
              this.updateFile();
            }},
          updateFile: {value: function updateFile() {
              var that = this;
              this.doEdit(function() {
                if (that.fileRef)
                  that.fileRef.set(that.getCleanMosaic(that.file));
              });
            }}
        }, {inject: {value: function inject() {
              return [Common, Utility];
            }}});
        return Mosaic;
      })(Node));
    }
  };
});

System.register("file_manager/node", ["github:firebase/firebase-bower@2.2.3", "common", "utility"], function(_export) {
  var Common,
      Utility,
      _createClass,
      _classCallCheck,
      Node;
  return {
    setters: [function(_firebase) {}, function(_common) {
      Common = _common.Common;
    }, function(_utility) {
      Utility = _utility.Utility;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Node = _export("Node", (function() {
        function Node(common, utility) {
          _classCallCheck(this, Node);
          this.common = common;
          this.utility = utility;
          this.childVMList = [];
        }
        _createClass(Node, {
          addChildVM: {value: function addChildVM(vm, id) {
              var insertPoint = -1;
              for (var i = 0; i < this.node.children.length; i++) {
                if (this.node.children[i] == id) {
                  insertPoint = i;
                  break;
                }
              }
              ;
              if (insertPoint != -1) {
                this.childVMList.splice(insertPoint, 0, vm);
              }
              ;
            }},
          newItemInDirectory: {value: function newItemInDirectory(newId) {
              this.rootVM.dirNodesRef.child(newId).set({id: newId});
              var children = [];
              for (var i = 0; this.node.children && i < this.node.children.length; i++) {
                children.push(this.node.children[i]);
              }
              ;
              children.push(newId);
              this.rootVM.dirNodesRef.child(this.node.id).child("children").set(children);
            }},
          newDirectory: {value: (function(_newDirectory) {
              var _newDirectoryWrapper = function newDirectory() {
                return _newDirectory.apply(this, arguments);
              };
              _newDirectoryWrapper.toString = function() {
                return _newDirectory.toString();
              };
              return _newDirectoryWrapper;
            })(function() {
              var newId = this.utility.getUniqueId();
              this.newItemInDirectory(newId);
              var newDirectory = this.utility.clone(this.common.new_directory);
              newDirectory.meta.id = newId;
              newDirectory.meta.create_time = Firebase.ServerValue.TIMESTAMP;
              this.rootVM.filesRef.child(newId).set(newDirectory);
            })},
          newTree: {value: (function(_newTree) {
              var _newTreeWrapper = function newTree() {
                return _newTree.apply(this, arguments);
              };
              _newTreeWrapper.toString = function() {
                return _newTree.toString();
              };
              return _newTreeWrapper;
            })(function() {
              var newId = this.utility.getUniqueId();
              this.newItemInDirectory(newId);
              var newTree = this.utility.clone(this.common.new_tree_note_skeleton);
              newTree.meta.id = newId;
              newTree.meta.create_time = Firebase.ServerValue.TIMESTAMP;
              this.rootVM.filesRef.child(newId).set(newTree);
            })},
          newFlat: {value: (function(_newFlat) {
              var _newFlatWrapper = function newFlat() {
                return _newFlat.apply(this, arguments);
              };
              _newFlatWrapper.toString = function() {
                return _newFlat.toString();
              };
              return _newFlatWrapper;
            })(function() {
              var newId = this.utility.getUniqueId();
              this.newItemInDirectory(newId);
              var newFlat = this.utility.clone(this.common.new_flat_note_skeleton);
              newFlat.meta.id = newId;
              newFlat.meta.create_time = Firebase.ServerValue.TIMESTAMP;
              this.rootVM.filesRef.child(newId).set(newFlat);
            })},
          newMosaic: {value: (function(_newMosaic) {
              var _newMosaicWrapper = function newMosaic() {
                return _newMosaic.apply(this, arguments);
              };
              _newMosaicWrapper.toString = function() {
                return _newMosaic.toString();
              };
              return _newMosaicWrapper;
            })(function() {
              var newId = this.utility.getUniqueId();
              this.newItemInDirectory(newId);
              var newMosaic = this.utility.clone(this.common.new_mosaic_skeleton);
              newMosaic.meta.id = newId;
              newMosaic.meta.create_time = Firebase.ServerValue.TIMESTAMP;
              this.rootVM.filesRef.child(newId).set(newMosaic);
            })},
          "delete": {value: function _delete() {
              if (!confirm("Delete?")) {
                return ;
              }
              var subTreeIdList = [];
              var that = this;
              function visit(vm) {
                if (!vm.node) {
                  return ;
                }
                for (var i = 0; i < vm.childVMList.length; i++) {
                  visit(vm.childVMList[i]);
                }
                ;
                console.log(vm.node.id);
                that.rootVM.dirNodesRef.child(vm.node.id).remove();
                that.rootVM.filesRef.child(vm.node.id).remove();
              }
              visit(this);
              var position = -1;
              for (var i = 0; i < this.parentVM.node.children.length; i++) {
                if (this.parentVM.node.children[i] == this.node.id) {
                  position = i;
                  break;
                }
              }
              ;
              if (-1 != position) {
                this.parentVM.node.children.splice(position, 1);
                var children = [];
                for (var i = 0; this.parentVM.node.children && i < this.parentVM.node.children.length; i++) {
                  children.push(this.parentVM.node.children[i]);
                }
                ;
                this.rootVM.dirNodesRef.child(this.parentVM.node.id).child("children").set(children);
              }
              ;
            }},
          rename: {value: function rename() {
              var name = prompt("Please enter name name", this.meta.name);
              if (null == name) {
                return ;
              }
              this.meta.name = name;
              this.rootVM.filesRef.child(this.node.id).child("meta").child("name").set(name);
            }},
          getPositionToParent: {value: function getPositionToParent() {
              var position = null;
              for (var i = 0; i < this.parentVM.node.children.length; i++) {
                if (this.parentVM.node.children[i] == this.node.id) {
                  position = i;
                  break;
                }
              }
              ;
              return position;
            }},
          paste: {value: function paste() {
              if (this.rootVM.clipping) {
                for (var i = 0; i < this.rootVM.clippedVMList.length; i++) {
                  this.node.children.push(this.rootVM.clippedVMList[i].node.id);
                  var oldParentPosition = this.rootVM.clippedVMList[i].getPositionToParent();
                  this.rootVM.clippedVMList[i].parentVM.node.children.splice(oldParentPosition, 1);
                }
                ;
                var updateList = [this];
                for (var i = 0; i < this.rootVM.clippedVMList.length; i++) {
                  var alreadyHere = false;
                  for (var j = 0; j < updateList.length; j++) {
                    if (updateList[j].node.id == this.rootVM.clippedVMList[i].parentVM.node.id) {
                      alreadyHere = true;
                      break;
                    }
                  }
                  ;
                  if (!alreadyHere)
                    updateList.push(this.rootVM.clippedVMList[i].parentVM);
                }
                ;
                for (var i = 0; i < updateList.length; i++) {
                  var children = [];
                  for (var j = 0; j < updateList[i].node.children.length; j++) {
                    children.push(updateList[i].node.children[j]);
                  }
                  ;
                  this.rootVM.dirNodesRef.child(updateList[i].node.id).child("children").set(children);
                }
                ;
                this.rootVM.clipping = false;
                this.rootVM.clippedVMList = [];
              }
              ;
            }}
        }, {inject: {value: function inject() {
              return [Common, Utility];
            }}});
        return Node;
      })());
    }
  };
});

System.register("file_manager/tree", ["common", "file_manager/node", "utility"], function(_export) {
  var Common,
      Node,
      Utility,
      _createClass,
      _get,
      _inherits,
      _classCallCheck,
      Tree;
  return {
    setters: [function(_common) {
      Common = _common.Common;
    }, function(_node) {
      Node = _node.Node;
    }, function(_utility) {
      Utility = _utility.Utility;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Tree = _export("Tree", (function(_Node) {
        function Tree(common, element, utility) {
          _classCallCheck(this, Tree);
          _get(Object.getPrototypeOf(Tree.prototype), "constructor", this).call(this);
          this.common = common;
          this.element = element;
          this.utility = utility;
          this.rootVM = this;
          this.node = null;
          this.dirNodesRef = null;
          this.filesRef = null;
          this.editing = false;
          this.updating = false;
          this.localChangedTime = 0;
          this.setToRemoteTime = 0;
          this.receiveRemoteTime = 0;
          this.localChangeWaitTime = 200;
          this.localChangeWaitEpsilon = 10;
          this.remoteChangeWaitTime = 1000;
          this.remoteChangeWaitEpsilon = 50;
          this.selectedVMList = [];
          this.clippedVMList = [];
          this.clipping = false;
        }
        _inherits(Tree, _Node);
        _createClass(Tree, {
          activate: {value: function activate(params, queryString, routeConfig) {
              console.log("activate");
              var ref = new Firebase(this.common.firebase_url);
              var authData = ref.getAuth();
              if (!authData) {
                console.log("Please login!");
                return ;
              }
              var filesPath = "/notes/users/" + authData.uid + "/files";
              this.filesRef = ref.child(filesPath);
              var dirNodesPath = "/notes/users/" + authData.uid + "/directories/nodes";
              this.dirNodesRef = ref.child(dirNodesPath);
              var that = this;
              this.dirNodesRef.child("root").on("value", function(dataSnapshot) {
                if (that.rootVM.editing)
                  return ;
                that.node = dataSnapshot.val();
              });
            }},
          cut: {value: function cut() {
              this.clipping = true;
              this.clippedVMList = [];
              var copiedFileList = [];
              for (var i = 0; i < this.selectedVMList.length; i++) {
                var file = {
                  file_id: this.selectedVMList[i].node.id,
                  node_id: "root"
                };
                copiedFileList.push(file);
                this.clippedVMList.push(this.selectedVMList[i]);
              }
              ;
              this.selectedVMList = [];
              delete localStorage.clipboardData;
              localStorage.clipboardData = undefined;
              localStorage.clipboardData = JSON.stringify(copiedFileList);
              console.log(localStorage.clipboardData);
            }},
          cleanStatus: {value: function cleanStatus() {
              this.clipping = false;
            }},
          newTemporaryMosaic: {value: function newTemporaryMosaic() {
              window.open(window.location.origin + "#mosaic");
            }}
        }, {inject: {value: function inject() {
              return [Common, Element, Utility];
            }}});
        return Tree;
      })(Node));
    }
  };
});

System.register("file_manager/tree-node", ["common", "file_manager/node", "utility"], function(_export) {
  var Common,
      Node,
      Utility,
      _createClass,
      _get,
      _inherits,
      _classCallCheck,
      TreeNode;
  return {
    setters: [function(_common) {
      Common = _common.Common;
    }, function(_node) {
      Node = _node.Node;
    }, function(_utility) {
      Utility = _utility.Utility;
    }],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      TreeNode = _export("TreeNode", (function(_Node) {
        function TreeNode(common, element, utility) {
          _classCallCheck(this, TreeNode);
          _get(Object.getPrototypeOf(TreeNode.prototype), "constructor", this).call(this);
          this.common = common;
          this.element = element;
          this.utility = utility;
          this.node = null;
          this.node_id = null;
          this.url = "";
          this.title = null;
          this.collapsed = null;
          this.children = null;
          this.metaRef = null;
          this.meta = null;
        }
        _inherits(TreeNode, _Node);
        _createClass(TreeNode, {
          activate: {value: function activate(model) {
              this.node_id = model.node_id;
              this.parentVM = model.parentVM;
              this.rootVM = model.parentVM.rootVM;
              this.parentVM.addChildVM(this, this.node_id);
              var that = this;
              this.nodeRef = this.rootVM.dirNodesRef.child(this.node_id);
              this.nodeRef.on("value", function(dataSnapshot) {
                if (that.rootVM.editing)
                  return ;
                console.log("this.nodeRef.on('value', model.node_id:" + model.node_id);
                var data = dataSnapshot.val();
                console.log(data);
                if (!data)
                  return ;
                that.node = data;
                if (!that.node.children)
                  that.node.children = [];
              });
              this.metaRef = this.rootVM.filesRef.child(this.node_id).child("meta");
              this.metaRef.on("value", function(dataSnapshot) {
                if (that.rootVM.editing)
                  return ;
                var data = dataSnapshot.val();
                if (!data)
                  return ;
                that.meta = data;
                console.log(that.meta);
                if ("tree" == that.meta.type || "flat" == that.meta.type) {
                  that.url = "./#" + that.meta.type + "/online/" + that.meta.id + "/root";
                } else if ("mosaic" == that.meta.type) {
                  that.url = "./#" + that.meta.type + "/online/" + that.meta.id;
                }
              });
            }},
          cut: {value: function cut() {
              this.rootVM.selectedVMList.push(this);
              this.rootVM.cut();
            }},
          toggle: {value: function toggle() {
              if ("directory" != this.meta.type) {
                return ;
              }
              this.meta.collapsed = !this.meta.collapsed;
              this.rootVM.filesRef.child(this.node.id).child("/meta/collapsed").set(this.meta.collapsed);
            }}
        }, {inject: {value: function inject() {
              return [Common, Element, Utility];
            }}});
        return TreeNode;
      })(Node));
    }
  };
});

//# sourceMappingURL=build.js.map