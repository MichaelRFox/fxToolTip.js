var fxToolTip = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global$L = // eslint-disable-next-line es/no-global-this -- safe
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
	check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func -- fallback
	function () {
	  return this;
	}() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$s = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$r = fails$s; // Detect IE8's incomplete defineProperty implementation

	var descriptors = !fails$r(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var fails$q = fails$s;
	var functionBindNative = !fails$q(function () {
	  var test = function () {
	    /* empty */
	  }.bind(); // eslint-disable-next-line no-prototype-builtins -- safe


	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var NATIVE_BIND$3 = functionBindNative;
	var call$f = Function.prototype.call;
	var functionCall = NATIVE_BIND$3 ? call$f.bind(call$f) : function () {
	  return call$f.apply(call$f, arguments);
	};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable = {}.propertyIsEnumerable; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$1(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var createPropertyDescriptor$4 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var NATIVE_BIND$2 = functionBindNative;
	var FunctionPrototype$3 = Function.prototype;
	var bind$3 = FunctionPrototype$3.bind;
	var call$e = FunctionPrototype$3.call;
	var uncurryThis$v = NATIVE_BIND$2 && bind$3.bind(call$e, call$e);
	var functionUncurryThis = NATIVE_BIND$2 ? function (fn) {
	  return fn && uncurryThis$v(fn);
	} : function (fn) {
	  return fn && function () {
	    return call$e.apply(fn, arguments);
	  };
	};

	var uncurryThis$u = functionUncurryThis;
	var toString$d = uncurryThis$u({}.toString);
	var stringSlice$6 = uncurryThis$u(''.slice);

	var classofRaw$1 = function (it) {
	  return stringSlice$6(toString$d(it), 8, -1);
	};

	var global$K = global$L;
	var uncurryThis$t = functionUncurryThis;
	var fails$p = fails$s;
	var classof$b = classofRaw$1;
	var Object$5 = global$K.Object;
	var split = uncurryThis$t(''.split); // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails$p(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object$5('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$b(it) == 'String' ? split(it, '') : Object$5(it);
	} : Object$5;

	var global$J = global$L;
	var TypeError$g = global$J.TypeError; // `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible

	var requireObjectCoercible$8 = function (it) {
	  if (it == undefined) throw TypeError$g("Can't call method on " + it);
	  return it;
	};

	var IndexedObject$3 = indexedObject;
	var requireObjectCoercible$7 = requireObjectCoercible$8;

	var toIndexedObject$6 = function (it) {
	  return IndexedObject$3(requireObjectCoercible$7(it));
	};

	// https://tc39.es/ecma262/#sec-iscallable

	var isCallable$j = function (argument) {
	  return typeof argument == 'function';
	};

	var isCallable$i = isCallable$j;

	var isObject$e = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$i(it);
	};

	var global$I = global$L;
	var isCallable$h = isCallable$j;

	var aFunction = function (argument) {
	  return isCallable$h(argument) ? argument : undefined;
	};

	var getBuiltIn$5 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$I[namespace]) : global$I[namespace] && global$I[namespace][method];
	};

	var uncurryThis$s = functionUncurryThis;
	var objectIsPrototypeOf = uncurryThis$s({}.isPrototypeOf);

	var getBuiltIn$4 = getBuiltIn$5;
	var engineUserAgent = getBuiltIn$4('navigator', 'userAgent') || '';

	var global$H = global$L;
	var userAgent = engineUserAgent;
	var process = global$H.process;
	var Deno = global$H.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us

	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	} // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0


	if (!version && userAgent) {
	  match = userAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = userAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION$2 = engineV8Version;
	var fails$o = fails$s; // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$o(function () {
	  var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

	  return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	  !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL$1 = nativeSymbol;
	var useSymbolAsUid = NATIVE_SYMBOL$1 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

	var global$G = global$L;
	var getBuiltIn$3 = getBuiltIn$5;
	var isCallable$g = isCallable$j;
	var isPrototypeOf$2 = objectIsPrototypeOf;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
	var Object$4 = global$G.Object;
	var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$3('Symbol');
	  return isCallable$g($Symbol) && isPrototypeOf$2($Symbol.prototype, Object$4(it));
	};

	var global$F = global$L;
	var String$5 = global$F.String;

	var tryToString$4 = function (argument) {
	  try {
	    return String$5(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var global$E = global$L;
	var isCallable$f = isCallable$j;
	var tryToString$3 = tryToString$4;
	var TypeError$f = global$E.TypeError; // `Assert: IsCallable(argument) is true`

	var aCallable$4 = function (argument) {
	  if (isCallable$f(argument)) return argument;
	  throw TypeError$f(tryToString$3(argument) + ' is not a function');
	};

	var aCallable$3 = aCallable$4; // `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod

	var getMethod$6 = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable$3(func);
	};

	var global$D = global$L;
	var call$d = functionCall;
	var isCallable$e = isCallable$j;
	var isObject$d = isObject$e;
	var TypeError$e = global$D.TypeError; // `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive

	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$e(fn = input.toString) && !isObject$d(val = call$d(fn, input))) return val;
	  if (isCallable$e(fn = input.valueOf) && !isObject$d(val = call$d(fn, input))) return val;
	  if (pref !== 'string' && isCallable$e(fn = input.toString) && !isObject$d(val = call$d(fn, input))) return val;
	  throw TypeError$e("Can't convert object to primitive value");
	};

	var shared$4 = {exports: {}};

	var global$C = global$L; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var defineProperty$5 = Object.defineProperty;

	var setGlobal$3 = function (key, value) {
	  try {
	    defineProperty$5(global$C, key, {
	      value: value,
	      configurable: true,
	      writable: true
	    });
	  } catch (error) {
	    global$C[key] = value;
	  }

	  return value;
	};

	var global$B = global$L;
	var setGlobal$2 = setGlobal$3;
	var SHARED = '__core-js_shared__';
	var store$3 = global$B[SHARED] || setGlobal$2(SHARED, {});
	var sharedStore = store$3;

	var store$2 = sharedStore;
	(shared$4.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.21.0',
	  mode: 'global',
	  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.21.0/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});

	var global$A = global$L;
	var requireObjectCoercible$6 = requireObjectCoercible$8;
	var Object$3 = global$A.Object; // `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject

	var toObject$8 = function (argument) {
	  return Object$3(requireObjectCoercible$6(argument));
	};

	var uncurryThis$r = functionUncurryThis;
	var toObject$7 = toObject$8;
	var hasOwnProperty = uncurryThis$r({}.hasOwnProperty); // `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty

	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject$7(it), key);
	};

	var uncurryThis$q = functionUncurryThis;
	var id$2 = 0;
	var postfix = Math.random();
	var toString$c = uncurryThis$q(1.0.toString);

	var uid$3 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$c(++id$2 + postfix, 36);
	};

	var global$z = global$L;
	var shared$3 = shared$4.exports;
	var hasOwn$a = hasOwnProperty_1;
	var uid$2 = uid$3;
	var NATIVE_SYMBOL = nativeSymbol;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;
	var WellKnownSymbolsStore = shared$3('wks');
	var Symbol$3 = global$z.Symbol;
	var symbolFor = Symbol$3 && Symbol$3['for'];
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$3 : Symbol$3 && Symbol$3.withoutSetter || uid$2;

	var wellKnownSymbol$i = function (name) {
	  if (!hasOwn$a(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
	    var description = 'Symbol.' + name;

	    if (NATIVE_SYMBOL && hasOwn$a(Symbol$3, name)) {
	      WellKnownSymbolsStore[name] = Symbol$3[name];
	    } else if (USE_SYMBOL_AS_UID && symbolFor) {
	      WellKnownSymbolsStore[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
	    }
	  }

	  return WellKnownSymbolsStore[name];
	};

	var global$y = global$L;
	var call$c = functionCall;
	var isObject$c = isObject$e;
	var isSymbol$1 = isSymbol$2;
	var getMethod$5 = getMethod$6;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$h = wellKnownSymbol$i;
	var TypeError$d = global$y.TypeError;
	var TO_PRIMITIVE = wellKnownSymbol$h('toPrimitive'); // `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive

	var toPrimitive$1 = function (input, pref) {
	  if (!isObject$c(input) || isSymbol$1(input)) return input;
	  var exoticToPrim = getMethod$5(input, TO_PRIMITIVE);
	  var result;

	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call$c(exoticToPrim, input, pref);
	    if (!isObject$c(result) || isSymbol$1(result)) return result;
	    throw TypeError$d("Can't convert object to primitive value");
	  }

	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;
	var isSymbol = isSymbol$2; // `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey

	var toPropertyKey$3 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var global$x = global$L;
	var isObject$b = isObject$e;
	var document$1 = global$x.document; // typeof document.createElement is 'object' in old IE

	var EXISTS$1 = isObject$b(document$1) && isObject$b(document$1.createElement);

	var documentCreateElement$2 = function (it) {
	  return EXISTS$1 ? document$1.createElement(it) : {};
	};

	var DESCRIPTORS$9 = descriptors;
	var fails$n = fails$s;
	var createElement = documentCreateElement$2; // Thanks to IE8 for its funny defineProperty

	var ie8DomDefine = !DESCRIPTORS$9 && !fails$n(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var DESCRIPTORS$8 = descriptors;
	var call$b = functionCall;
	var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
	var createPropertyDescriptor$3 = createPropertyDescriptor$4;
	var toIndexedObject$5 = toIndexedObject$6;
	var toPropertyKey$2 = toPropertyKey$3;
	var hasOwn$9 = hasOwnProperty_1;
	var IE8_DOM_DEFINE$1 = ie8DomDefine; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$8 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$5(O);
	  P = toPropertyKey$2(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor$1(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (hasOwn$9(O, P)) return createPropertyDescriptor$3(!call$b(propertyIsEnumerableModule$1.f, O, P), O[P]);
	};

	var objectDefineProperty = {};

	var DESCRIPTORS$7 = descriptors;
	var fails$m = fails$s; // V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334

	var v8PrototypeDefineBug = DESCRIPTORS$7 && fails$m(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () {
	    /* empty */
	  }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype != 42;
	});

	var global$w = global$L;
	var isObject$a = isObject$e;
	var String$4 = global$w.String;
	var TypeError$c = global$w.TypeError; // `Assert: Type(argument) is Object`

	var anObject$f = function (argument) {
	  if (isObject$a(argument)) return argument;
	  throw TypeError$c(String$4(argument) + ' is not an object');
	};

	var global$v = global$L;
	var DESCRIPTORS$6 = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
	var anObject$e = anObject$f;
	var toPropertyKey$1 = toPropertyKey$3;
	var TypeError$b = global$v.TypeError; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var $defineProperty = Object.defineProperty; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE$1 = 'configurable';
	var WRITABLE = 'writable'; // `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty

	objectDefineProperty.f = DESCRIPTORS$6 ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
	  anObject$e(O);
	  P = toPropertyKey$1(P);
	  anObject$e(Attributes);

	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor(O, P);

	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  }

	  return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$e(O);
	  P = toPropertyKey$1(P);
	  anObject$e(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError$b('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$5 = descriptors;
	var definePropertyModule$4 = objectDefineProperty;
	var createPropertyDescriptor$2 = createPropertyDescriptor$4;
	var createNonEnumerableProperty$7 = DESCRIPTORS$5 ? function (object, key, value) {
	  return definePropertyModule$4.f(object, key, createPropertyDescriptor$2(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var redefine$7 = {exports: {}};

	var uncurryThis$p = functionUncurryThis;
	var isCallable$d = isCallable$j;
	var store$1 = sharedStore;
	var functionToString$1 = uncurryThis$p(Function.toString); // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper

	if (!isCallable$d(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString$1(it);
	  };
	}

	var inspectSource$3 = store$1.inspectSource;

	var global$u = global$L;
	var isCallable$c = isCallable$j;
	var inspectSource$2 = inspectSource$3;
	var WeakMap$2 = global$u.WeakMap;
	var nativeWeakMap = isCallable$c(WeakMap$2) && /native code/.test(inspectSource$2(WeakMap$2));

	var shared$2 = shared$4.exports;
	var uid$1 = uid$3;
	var keys = shared$2('keys');

	var sharedKey$3 = function (key) {
	  return keys[key] || (keys[key] = uid$1(key));
	};

	var hiddenKeys$5 = {};

	var NATIVE_WEAK_MAP$1 = nativeWeakMap;
	var global$t = global$L;
	var uncurryThis$o = functionUncurryThis;
	var isObject$9 = isObject$e;
	var createNonEnumerableProperty$6 = createNonEnumerableProperty$7;
	var hasOwn$8 = hasOwnProperty_1;
	var shared$1 = sharedStore;
	var sharedKey$2 = sharedKey$3;
	var hiddenKeys$4 = hiddenKeys$5;
	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$a = global$t.TypeError;
	var WeakMap$1 = global$t.WeakMap;
	var set$1, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set$1(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject$9(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError$a('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (NATIVE_WEAK_MAP$1 || shared$1.state) {
	  var store = shared$1.state || (shared$1.state = new WeakMap$1());
	  var wmget = uncurryThis$o(store.get);
	  var wmhas = uncurryThis$o(store.has);
	  var wmset = uncurryThis$o(store.set);

	  set$1 = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$a(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget(store, it) || {};
	  };

	  has = function (it) {
	    return wmhas(store, it);
	  };
	} else {
	  var STATE = sharedKey$2('state');
	  hiddenKeys$4[STATE] = true;

	  set$1 = function (it, metadata) {
	    if (hasOwn$8(it, STATE)) throw new TypeError$a(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$6(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return hasOwn$8(it, STATE) ? it[STATE] : {};
	  };

	  has = function (it) {
	    return hasOwn$8(it, STATE);
	  };
	}

	var internalState = {
	  set: set$1,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var DESCRIPTORS$4 = descriptors;
	var hasOwn$7 = hasOwnProperty_1;
	var FunctionPrototype$2 = Function.prototype; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getDescriptor = DESCRIPTORS$4 && Object.getOwnPropertyDescriptor;
	var EXISTS = hasOwn$7(FunctionPrototype$2, 'name'); // additional protection from minified / mangled / dropped function names

	var PROPER = EXISTS && function something() {
	  /* empty */
	}.name === 'something';

	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$4 || DESCRIPTORS$4 && getDescriptor(FunctionPrototype$2, 'name').configurable);
	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var global$s = global$L;
	var isCallable$b = isCallable$j;
	var hasOwn$6 = hasOwnProperty_1;
	var createNonEnumerableProperty$5 = createNonEnumerableProperty$7;
	var setGlobal$1 = setGlobal$3;
	var inspectSource$1 = inspectSource$3;
	var InternalStateModule$3 = internalState;
	var CONFIGURABLE_FUNCTION_NAME$1 = functionName.CONFIGURABLE;
	var getInternalState$3 = InternalStateModule$3.get;
	var enforceInternalState$1 = InternalStateModule$3.enforce;
	var TEMPLATE = String(String).split('String');
	(redefine$7.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;

	  if (isCallable$b(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }

	    if (!hasOwn$6(value, 'name') || CONFIGURABLE_FUNCTION_NAME$1 && value.name !== name) {
	      createNonEnumerableProperty$5(value, 'name', name);
	    }

	    state = enforceInternalState$1(value);

	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }

	  if (O === global$s) {
	    if (simple) O[key] = value;else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }

	  if (simple) O[key] = value;else createNonEnumerableProperty$5(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable$b(this) && getInternalState$3(this).source || inspectSource$1(this);
	});

	var objectGetOwnPropertyNames = {};

	var ceil = Math.ceil;
	var floor$2 = Math.floor; // `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity

	var toIntegerOrInfinity$7 = function (argument) {
	  var number = +argument; // eslint-disable-next-line no-self-compare -- safe

	  return number !== number || number === 0 ? 0 : (number > 0 ? floor$2 : ceil)(number);
	};

	var toIntegerOrInfinity$6 = toIntegerOrInfinity$7;
	var max$3 = Math.max;
	var min$4 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex$3 = function (index, length) {
	  var integer = toIntegerOrInfinity$6(index);
	  return integer < 0 ? max$3(integer + length, 0) : min$4(integer, length);
	};

	var toIntegerOrInfinity$5 = toIntegerOrInfinity$7;
	var min$3 = Math.min; // `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength

	var toLength$4 = function (argument) {
	  return argument > 0 ? min$3(toIntegerOrInfinity$5(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength$3 = toLength$4; // `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike

	var lengthOfArrayLike$7 = function (obj) {
	  return toLength$3(obj.length);
	};

	var toIndexedObject$4 = toIndexedObject$6;
	var toAbsoluteIndex$2 = toAbsoluteIndex$3;
	var lengthOfArrayLike$6 = lengthOfArrayLike$7; // `Array.prototype.{ indexOf, includes }` methods implementation

	var createMethod$4 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$4($this);
	    var length = lengthOfArrayLike$6(O);
	    var index = toAbsoluteIndex$2(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare -- NaN check

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$4(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$4(false)
	};

	var uncurryThis$n = functionUncurryThis;
	var hasOwn$5 = hasOwnProperty_1;
	var toIndexedObject$3 = toIndexedObject$6;
	var indexOf$1 = arrayIncludes.indexOf;
	var hiddenKeys$3 = hiddenKeys$5;
	var push$3 = uncurryThis$n([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$3(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !hasOwn$5(hiddenKeys$3, key) && hasOwn$5(O, key) && push$3(result, key); // Don't enum bug & hidden keys


	  while (names.length > i) if (hasOwn$5(O, key = names[i++])) {
	    ~indexOf$1(result, key) || push$3(result, key);
	  }

	  return result;
	};

	var enumBugKeys$3 = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var internalObjectKeys$1 = objectKeysInternal;
	var enumBugKeys$2 = enumBugKeys$3;
	var hiddenKeys$2 = enumBugKeys$2.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe

	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$2);
	};

	var objectGetOwnPropertySymbols = {};

	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$2 = getBuiltIn$5;
	var uncurryThis$m = functionUncurryThis;
	var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
	var anObject$d = anObject$f;
	var concat$2 = uncurryThis$m([].concat); // all object keys, includes non-enumerable and symbols

	var ownKeys$1 = getBuiltIn$2('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule$1.f(anObject$d(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
	  return getOwnPropertySymbols ? concat$2(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$4 = hasOwnProperty_1;
	var ownKeys = ownKeys$1;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var definePropertyModule$3 = objectDefineProperty;

	var copyConstructorProperties$1 = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule$3.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];

	    if (!hasOwn$4(target, key) && !(exceptions && hasOwn$4(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};

	var fails$l = fails$s;
	var isCallable$a = isCallable$j;
	var replacement = /#|\.prototype\./;

	var isForced$2 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : isCallable$a(detection) ? fails$l(detection) : !!detection;
	};

	var normalize = isForced$2.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$2.data = {};
	var NATIVE = isForced$2.NATIVE = 'N';
	var POLYFILL = isForced$2.POLYFILL = 'P';
	var isForced_1 = isForced$2;

	var global$r = global$L;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$4 = createNonEnumerableProperty$7;
	var redefine$6 = redefine$7.exports;
	var setGlobal = setGlobal$3;
	var copyConstructorProperties = copyConstructorProperties$1;
	var isForced$1 = isForced_1;
	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	  options.name        - the .name of the function if it does not match the key
	*/

	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global$r;
	  } else if (STATIC) {
	    target = global$r[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$r[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced$1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty$4(sourceProperty, 'sham', true);
	    } // extend global


	    redefine$6(target, key, sourceProperty, options);
	  }
	};

	var fails$k = fails$s;

	var arrayMethodIsStrict$3 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails$k(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	/* eslint-disable es/no-array-prototype-indexof -- required for testing */


	var $$c = _export;
	var uncurryThis$l = functionUncurryThis;
	var $IndexOf = arrayIncludes.indexOf;
	var arrayMethodIsStrict$2 = arrayMethodIsStrict$3;
	var un$IndexOf = uncurryThis$l([].indexOf);
	var NEGATIVE_ZERO = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
	var STRICT_METHOD$2 = arrayMethodIsStrict$2('indexOf'); // `Array.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.indexof

	$$c({
	  target: 'Array',
	  proto: true,
	  forced: NEGATIVE_ZERO || !STRICT_METHOD$2
	}, {
	  indexOf: function indexOf(searchElement
	  /* , fromIndex = 0 */
	  ) {
	    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
	    return NEGATIVE_ZERO // convert -0 to +0
	    ? un$IndexOf(this, searchElement, fromIndex) || 0 : $IndexOf(this, searchElement, fromIndex);
	  }
	});

	var wellKnownSymbol$g = wellKnownSymbol$i;
	var TO_STRING_TAG$3 = wellKnownSymbol$g('toStringTag');
	var test = {};
	test[TO_STRING_TAG$3] = 'z';
	var toStringTagSupport = String(test) === '[object z]';

	var global$q = global$L;
	var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
	var isCallable$9 = isCallable$j;
	var classofRaw = classofRaw$1;
	var wellKnownSymbol$f = wellKnownSymbol$i;
	var TO_STRING_TAG$2 = wellKnownSymbol$f('toStringTag');
	var Object$2 = global$q.Object; // ES3 wrong here

	var CORRECT_ARGUMENTS = classofRaw(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {
	    /* empty */
	  }
	}; // getting tag from ES6+ `Object.prototype.toString`


	var classof$a = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (tag = tryGet(O = Object$2(it), TO_STRING_TAG$2)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && isCallable$9(O.callee) ? 'Arguments' : result;
	};

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
	var classof$9 = classof$a; // `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof$9(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var redefine$5 = redefine$7.exports;
	var toString$b = objectToString; // `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	if (!TO_STRING_TAG_SUPPORT) {
	  redefine$5(Object.prototype, 'toString', toString$b, {
	    unsafe: true
	  });
	}

	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods

	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	var documentCreateElement$1 = documentCreateElement$2;
	var classList = documentCreateElement$1('span').classList;
	var DOMTokenListPrototype$2 = classList && classList.constructor && classList.constructor.prototype;
	var domTokenListPrototype = DOMTokenListPrototype$2 === Object.prototype ? undefined : DOMTokenListPrototype$2;

	var uncurryThis$k = functionUncurryThis;
	var aCallable$2 = aCallable$4;
	var NATIVE_BIND$1 = functionBindNative;
	var bind$2 = uncurryThis$k(uncurryThis$k.bind); // optional / simple context binding

	var functionBindContext = function (fn, that) {
	  aCallable$2(fn);
	  return that === undefined ? fn : NATIVE_BIND$1 ? bind$2(fn, that) : function
	    /* ...args */
	  () {
	    return fn.apply(that, arguments);
	  };
	};

	var classof$8 = classofRaw$1; // `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe

	var isArray$2 = Array.isArray || function isArray(argument) {
	  return classof$8(argument) == 'Array';
	};

	var uncurryThis$j = functionUncurryThis;
	var fails$j = fails$s;
	var isCallable$8 = isCallable$j;
	var classof$7 = classof$a;
	var getBuiltIn$1 = getBuiltIn$5;
	var inspectSource = inspectSource$3;

	var noop = function () {
	  /* empty */
	};

	var empty = [];
	var construct = getBuiltIn$1('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$3 = uncurryThis$j(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable$8(argument)) return false;

	  try {
	    construct(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable$8(argument)) return false;

	  switch (classof$7(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction':
	      return false;
	  }

	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING || !!exec$3(constructorRegExp, inspectSource(argument));
	  } catch (error) {
	    return true;
	  }
	};

	isConstructorLegacy.sham = true; // `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor

	var isConstructor$2 = !construct || fails$j(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
	    called = true;
	  }) || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var global$p = global$L;
	var isArray$1 = isArray$2;
	var isConstructor$1 = isConstructor$2;
	var isObject$8 = isObject$e;
	var wellKnownSymbol$e = wellKnownSymbol$i;
	var SPECIES$3 = wellKnownSymbol$e('species');
	var Array$2 = global$p.Array; // a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate

	var arraySpeciesConstructor$1 = function (originalArray) {
	  var C;

	  if (isArray$1(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (isConstructor$1(C) && (C === Array$2 || isArray$1(C.prototype))) C = undefined;else if (isObject$8(C)) {
	      C = C[SPECIES$3];
	      if (C === null) C = undefined;
	    }
	  }

	  return C === undefined ? Array$2 : C;
	};

	var arraySpeciesConstructor = arraySpeciesConstructor$1; // `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate$3 = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var bind$1 = functionBindContext;
	var uncurryThis$i = functionUncurryThis;
	var IndexedObject$2 = indexedObject;
	var toObject$6 = toObject$8;
	var lengthOfArrayLike$5 = lengthOfArrayLike$7;
	var arraySpeciesCreate$2 = arraySpeciesCreate$3;
	var push$2 = uncurryThis$i([].push); // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation

	var createMethod$3 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject$6($this);
	    var self = IndexedObject$2(O);
	    var boundFunction = bind$1(callbackfn, that);
	    var length = lengthOfArrayLike$5(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate$2;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;

	    for (; length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);

	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3:
	            return true;
	          // some

	          case 5:
	            return value;
	          // find

	          case 6:
	            return index;
	          // findIndex

	          case 2:
	            push$2(target, value);
	          // filter
	        } else switch (TYPE) {
	          case 4:
	            return false;
	          // every

	          case 7:
	            push$2(target, value);
	          // filterReject
	        }
	      }
	    }

	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$3(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$3(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$3(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$3(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$3(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$3(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$3(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$3(7)
	};

	var $forEach = arrayIteration.forEach;
	var arrayMethodIsStrict$1 = arrayMethodIsStrict$3;
	var STRICT_METHOD$1 = arrayMethodIsStrict$1('forEach'); // `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach

	var arrayForEach = !STRICT_METHOD$1 ? function forEach(callbackfn
	/* , thisArg */
	) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined); // eslint-disable-next-line es/no-array-prototype-foreach -- safe
	} : [].forEach;

	var global$o = global$L;
	var DOMIterables$1 = domIterables;
	var DOMTokenListPrototype$1 = domTokenListPrototype;
	var forEach = arrayForEach;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$7;

	var handlePrototype$1 = function (CollectionPrototype) {
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
	    createNonEnumerableProperty$3(CollectionPrototype, 'forEach', forEach);
	  } catch (error) {
	    CollectionPrototype.forEach = forEach;
	  }
	};

	for (var COLLECTION_NAME$1 in DOMIterables$1) {
	  if (DOMIterables$1[COLLECTION_NAME$1]) {
	    handlePrototype$1(global$o[COLLECTION_NAME$1] && global$o[COLLECTION_NAME$1].prototype);
	  }
	}

	handlePrototype$1(DOMTokenListPrototype$1);

	var global$n = global$L;
	var classof$6 = classof$a;
	var String$3 = global$n.String;

	var toString$a = function (argument) {
	  if (classof$6(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String$3(argument);
	};

	var whitespaces$4 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' + '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var uncurryThis$h = functionUncurryThis;
	var requireObjectCoercible$5 = requireObjectCoercible$8;
	var toString$9 = toString$a;
	var whitespaces$3 = whitespaces$4;
	var replace$2 = uncurryThis$h(''.replace);
	var whitespace = '[' + whitespaces$3 + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$'); // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation

	var createMethod$2 = function (TYPE) {
	  return function ($this) {
	    var string = toString$9(requireObjectCoercible$5($this));
	    if (TYPE & 1) string = replace$2(string, ltrim, '');
	    if (TYPE & 2) string = replace$2(string, rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$2(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$2(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$2(3)
	};

	var global$m = global$L;
	var fails$i = fails$s;
	var uncurryThis$g = functionUncurryThis;
	var toString$8 = toString$a;
	var trim$1 = stringTrim.trim;
	var whitespaces$2 = whitespaces$4;
	var charAt$5 = uncurryThis$g(''.charAt);
	var n$ParseFloat = global$m.parseFloat;
	var Symbol$2 = global$m.Symbol;
	var ITERATOR$7 = Symbol$2 && Symbol$2.iterator;
	var FORCED$3 = 1 / n$ParseFloat(whitespaces$2 + '-0') !== -Infinity // MS Edge 18- broken with boxed symbols
	|| ITERATOR$7 && !fails$i(function () {
	  n$ParseFloat(Object(ITERATOR$7));
	}); // `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string

	var numberParseFloat = FORCED$3 ? function parseFloat(string) {
	  var trimmedString = trim$1(toString$8(string));
	  var result = n$ParseFloat(trimmedString);
	  return result === 0 && charAt$5(trimmedString, 0) == '-' ? -0 : result;
	} : n$ParseFloat;

	var $$b = _export;
	var $parseFloat = numberParseFloat; // `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string

	$$b({
	  global: true,
	  forced: parseFloat != $parseFloat
	}, {
	  parseFloat: $parseFloat
	});

	var uncurryThis$f = functionUncurryThis; // `thisNumberValue` abstract operation
	// https://tc39.es/ecma262/#sec-thisnumbervalue

	var thisNumberValue$1 = uncurryThis$f(1.0.valueOf);

	var global$l = global$L;
	var toIntegerOrInfinity$4 = toIntegerOrInfinity$7;
	var toString$7 = toString$a;
	var requireObjectCoercible$4 = requireObjectCoercible$8;
	var RangeError$1 = global$l.RangeError; // `String.prototype.repeat` method implementation
	// https://tc39.es/ecma262/#sec-string.prototype.repeat

	var stringRepeat = function repeat(count) {
	  var str = toString$7(requireObjectCoercible$4(this));
	  var result = '';
	  var n = toIntegerOrInfinity$4(count);
	  if (n < 0 || n == Infinity) throw RangeError$1('Wrong number of repetitions');

	  for (; n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;

	  return result;
	};

	var $$a = _export;
	var global$k = global$L;
	var uncurryThis$e = functionUncurryThis;
	var toIntegerOrInfinity$3 = toIntegerOrInfinity$7;
	var thisNumberValue = thisNumberValue$1;
	var $repeat = stringRepeat;
	var fails$h = fails$s;
	var RangeError = global$k.RangeError;
	var String$2 = global$k.String;
	var floor$1 = Math.floor;
	var repeat = uncurryThis$e($repeat);
	var stringSlice$5 = uncurryThis$e(''.slice);
	var un$ToFixed = uncurryThis$e(1.0.toFixed);

	var pow = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
	};

	var log = function (x) {
	  var n = 0;
	  var x2 = x;

	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }

	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  }

	  return n;
	};

	var multiply = function (data, n, c) {
	  var index = -1;
	  var c2 = c;

	  while (++index < 6) {
	    c2 += n * data[index];
	    data[index] = c2 % 1e7;
	    c2 = floor$1(c2 / 1e7);
	  }
	};

	var divide = function (data, n) {
	  var index = 6;
	  var c = 0;

	  while (--index >= 0) {
	    c += data[index];
	    data[index] = floor$1(c / n);
	    c = c % n * 1e7;
	  }
	};

	var dataToString = function (data) {
	  var index = 6;
	  var s = '';

	  while (--index >= 0) {
	    if (s !== '' || index === 0 || data[index] !== 0) {
	      var t = String$2(data[index]);
	      s = s === '' ? t : s + repeat('0', 7 - t.length) + t;
	    }
	  }

	  return s;
	};

	var FORCED$2 = fails$h(function () {
	  return un$ToFixed(0.00008, 3) !== '0.000' || un$ToFixed(0.9, 0) !== '1' || un$ToFixed(1.255, 2) !== '1.25' || un$ToFixed(1000000000000000128.0, 0) !== '1000000000000000128';
	}) || !fails$h(function () {
	  // V8 ~ Android 4.3-
	  un$ToFixed({});
	}); // `Number.prototype.toFixed` method
	// https://tc39.es/ecma262/#sec-number.prototype.tofixed

	$$a({
	  target: 'Number',
	  proto: true,
	  forced: FORCED$2
	}, {
	  toFixed: function toFixed(fractionDigits) {
	    var number = thisNumberValue(this);
	    var fractDigits = toIntegerOrInfinity$3(fractionDigits);
	    var data = [0, 0, 0, 0, 0, 0];
	    var sign = '';
	    var result = '0';
	    var e, z, j, k; // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation

	    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits'); // eslint-disable-next-line no-self-compare -- NaN check

	    if (number != number) return 'NaN';
	    if (number <= -1e21 || number >= 1e21) return String$2(number);

	    if (number < 0) {
	      sign = '-';
	      number = -number;
	    }

	    if (number > 1e-21) {
	      e = log(number * pow(2, 69, 1)) - 69;
	      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;

	      if (e > 0) {
	        multiply(data, 0, z);
	        j = fractDigits;

	        while (j >= 7) {
	          multiply(data, 1e7, 0);
	          j -= 7;
	        }

	        multiply(data, pow(10, j, 1), 0);
	        j = e - 1;

	        while (j >= 23) {
	          divide(data, 1 << 23);
	          j -= 23;
	        }

	        divide(data, 1 << j);
	        multiply(data, 1, 1);
	        divide(data, 2);
	        result = dataToString(data);
	      } else {
	        multiply(data, 0, z);
	        multiply(data, 1 << -e, 0);
	        result = dataToString(data) + repeat('0', fractDigits);
	      }
	    }

	    if (fractDigits > 0) {
	      k = result.length;
	      result = sign + (k <= fractDigits ? '0.' + repeat('0', fractDigits - k) + result : stringSlice$5(result, 0, k - fractDigits) + '.' + stringSlice$5(result, k - fractDigits));
	    } else {
	      result = sign + result;
	    }

	    return result;
	  }
	});

	var anObject$c = anObject$f; // `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags

	var regexpFlags$1 = function () {
	  var that = anObject$c(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var fails$g = fails$s;
	var global$j = global$L; // babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError

	var $RegExp$2 = global$j.RegExp;
	var UNSUPPORTED_Y$2 = fails$g(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	}); // UC Browser bug
	// https://github.com/zloirock/core-js/issues/1008

	var MISSED_STICKY = UNSUPPORTED_Y$2 || fails$g(function () {
	  return !$RegExp$2('a', 'y').sticky;
	});
	var BROKEN_CARET = UNSUPPORTED_Y$2 || fails$g(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});
	var regexpStickyHelpers = {
	  BROKEN_CARET: BROKEN_CARET,
	  MISSED_STICKY: MISSED_STICKY,
	  UNSUPPORTED_Y: UNSUPPORTED_Y$2
	};

	var objectDefineProperties = {};

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3; // `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe

	var objectKeys$2 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS$3 = descriptors;
	var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
	var definePropertyModule$2 = objectDefineProperty;
	var anObject$b = anObject$f;
	var toIndexedObject$2 = toIndexedObject$6;
	var objectKeys$1 = objectKeys$2; // `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe

	objectDefineProperties.f = DESCRIPTORS$3 && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$b(O);
	  var props = toIndexedObject$2(Properties);
	  var keys = objectKeys$1(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) definePropertyModule$2.f(O, key = keys[index++], props[key]);

	  return O;
	};

	var getBuiltIn = getBuiltIn$5;
	var html$1 = getBuiltIn('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */
	var anObject$a = anObject$f;
	var definePropertiesModule = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys$1 = hiddenKeys$5;
	var html = html$1;
	var documentCreateElement = documentCreateElement$2;
	var sharedKey$1 = sharedKey$3;
	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey$1('IE_PROTO');

	var EmptyConstructor = function () {
	  /* empty */
	};

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	}; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak

	  return temp;
	}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	}; // Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug


	var activeXDocument;

	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) {
	    /* ignore */
	  }

	  NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	  : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH

	  var length = enumBugKeys.length;

	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];

	  return NullProtoObject();
	};

	hiddenKeys$1[IE_PROTO$1] = true; // `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create

	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject$a(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();

	  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
	};

	var fails$f = fails$s;
	var global$i = global$L; // babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError

	var $RegExp$1 = global$i.RegExp;
	var regexpUnsupportedDotAll = fails$f(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	var fails$e = fails$s;
	var global$h = global$L; // babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError

	var $RegExp = global$h.RegExp;
	var regexpUnsupportedNcg = fails$e(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' || 'b'.replace(re, '$<a>c') !== 'bc';
	});

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */

	/* eslint-disable regexp/no-useless-quantifier -- testing */


	var call$a = functionCall;
	var uncurryThis$d = functionUncurryThis;
	var toString$6 = toString$a;
	var regexpFlags = regexpFlags$1;
	var stickyHelpers$1 = regexpStickyHelpers;
	var shared = shared$4.exports;
	var create$3 = objectCreate;
	var getInternalState$2 = internalState.get;
	var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG = regexpUnsupportedNcg;
	var nativeReplace = shared('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt$4 = uncurryThis$d(''.charAt);
	var indexOf = uncurryThis$d(''.indexOf);
	var replace$1 = uncurryThis$d(''.replace);
	var stringSlice$4 = uncurryThis$d(''.slice);

	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  call$a(nativeExec, re1, 'a');
	  call$a(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	}();

	var UNSUPPORTED_Y$1 = stickyHelpers$1.BROKEN_CARET; // nonparticipating capturing group, copied from es5-shim's String#split patch.

	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

	if (PATCH) {
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState$2(re);
	    var str = toString$6(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = call$a(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = call$a(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = replace$1(flags, 'y', '');

	      if (indexOf(flags, 'g') === -1) {
	        flags += 'g';
	      }

	      strCopy = stringSlice$4(str, re.lastIndex); // Support anchored sticky behavior.

	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$4(str, re.lastIndex - 1) !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      } // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.


	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }

	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
	    match = call$a(nativeExec, sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = stringSlice$4(match.input, charsAdded);
	        match[0] = stringSlice$4(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }

	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      call$a(nativeReplace, match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = create$3(null);

	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	var regexpExec$3 = patchedExec;

	var $$9 = _export;
	var exec$2 = regexpExec$3; // `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec

	$$9({
	  target: 'RegExp',
	  proto: true,
	  forced: /./.exec !== exec$2
	}, {
	  exec: exec$2
	});

	var uncurryThis$c = functionUncurryThis;
	var redefine$4 = redefine$7.exports;
	var regexpExec$2 = regexpExec$3;
	var fails$d = fails$s;
	var wellKnownSymbol$d = wellKnownSymbol$i;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$7;
	var SPECIES$2 = wellKnownSymbol$d('species');
	var RegExpPrototype = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol$d(KEY);
	  var DELEGATES_TO_SYMBOL = !fails$d(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$d(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {}; // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.

	      re.constructor = {};

	      re.constructor[SPECIES$2] = function () {
	        return re;
	      };

	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED) {
	    var uncurriedNativeRegExpMethod = uncurryThis$c(/./[SYMBOL]);
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var uncurriedNativeMethod = uncurryThis$c(nativeMethod);
	      var $exec = regexp.exec;

	      if ($exec === regexpExec$2 || $exec === RegExpPrototype.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: uncurriedNativeRegExpMethod(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: uncurriedNativeMethod(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    });
	    redefine$4(String.prototype, KEY, methods[0]);
	    redefine$4(RegExpPrototype, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty$2(RegExpPrototype[SYMBOL], 'sham', true);
	};

	var uncurryThis$b = functionUncurryThis;
	var toIntegerOrInfinity$2 = toIntegerOrInfinity$7;
	var toString$5 = toString$a;
	var requireObjectCoercible$3 = requireObjectCoercible$8;
	var charAt$3 = uncurryThis$b(''.charAt);
	var charCodeAt = uncurryThis$b(''.charCodeAt);
	var stringSlice$3 = uncurryThis$b(''.slice);

	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString$5(requireObjectCoercible$3($this));
	    var position = toIntegerOrInfinity$2(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? charAt$3(S, position) : first : CONVERT_TO_STRING ? stringSlice$3(S, position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var charAt$2 = stringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex

	var advanceStringIndex$3 = function (S, index, unicode) {
	  return index + (unicode ? charAt$2(S, index).length : 1);
	};

	var global$g = global$L;
	var call$9 = functionCall;
	var anObject$9 = anObject$f;
	var isCallable$7 = isCallable$j;
	var classof$5 = classofRaw$1;
	var regexpExec$1 = regexpExec$3;
	var TypeError$9 = global$g.TypeError; // `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec

	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;

	  if (isCallable$7(exec)) {
	    var result = call$9(exec, R, S);
	    if (result !== null) anObject$9(result);
	    return result;
	  }

	  if (classof$5(R) === 'RegExp') return call$9(regexpExec$1, R, S);
	  throw TypeError$9('RegExp#exec called on incompatible receiver');
	};

	var call$8 = functionCall;
	var fixRegExpWellKnownSymbolLogic$2 = fixRegexpWellKnownSymbolLogic;
	var anObject$8 = anObject$f;
	var toLength$2 = toLength$4;
	var toString$4 = toString$a;
	var requireObjectCoercible$2 = requireObjectCoercible$8;
	var getMethod$4 = getMethod$6;
	var advanceStringIndex$2 = advanceStringIndex$3;
	var regExpExec$2 = regexpExecAbstract; // @@match logic

	fixRegExpWellKnownSymbolLogic$2('match', function (MATCH, nativeMatch, maybeCallNative) {
	  return [// `String.prototype.match` method
	  // https://tc39.es/ecma262/#sec-string.prototype.match
	  function match(regexp) {
	    var O = requireObjectCoercible$2(this);
	    var matcher = regexp == undefined ? undefined : getMethod$4(regexp, MATCH);
	    return matcher ? call$8(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString$4(O));
	  }, // `RegExp.prototype[@@match]` method
	  // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
	  function (string) {
	    var rx = anObject$8(this);
	    var S = toString$4(string);
	    var res = maybeCallNative(nativeMatch, rx, S);
	    if (res.done) return res.value;
	    if (!rx.global) return regExpExec$2(rx, S);
	    var fullUnicode = rx.unicode;
	    rx.lastIndex = 0;
	    var A = [];
	    var n = 0;
	    var result;

	    while ((result = regExpExec$2(rx, S)) !== null) {
	      var matchStr = toString$4(result[0]);
	      A[n] = matchStr;
	      if (matchStr === '') rx.lastIndex = advanceStringIndex$2(S, toLength$2(rx.lastIndex), fullUnicode);
	      n++;
	    }

	    return n === 0 ? null : A;
	  }];
	});

	var global$f = global$L;
	var fails$c = fails$s;
	var uncurryThis$a = functionUncurryThis;
	var toString$3 = toString$a;
	var trim = stringTrim.trim;
	var whitespaces$1 = whitespaces$4;
	var $parseInt$1 = global$f.parseInt;
	var Symbol$1 = global$f.Symbol;
	var ITERATOR$6 = Symbol$1 && Symbol$1.iterator;
	var hex = /^[+-]?0x/i;
	var exec$1 = uncurryThis$a(hex.exec);
	var FORCED$1 = $parseInt$1(whitespaces$1 + '08') !== 8 || $parseInt$1(whitespaces$1 + '0x16') !== 22 // MS Edge 18- broken with boxed symbols
	|| ITERATOR$6 && !fails$c(function () {
	  $parseInt$1(Object(ITERATOR$6));
	}); // `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix

	var numberParseInt = FORCED$1 ? function parseInt(string, radix) {
	  var S = trim(toString$3(string));
	  return $parseInt$1(S, radix >>> 0 || (exec$1(hex, S) ? 16 : 10));
	} : $parseInt$1;

	var $$8 = _export;
	var $parseInt = numberParseInt; // `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix

	$$8({
	  global: true,
	  forced: parseInt != $parseInt
	}, {
	  parseInt: $parseInt
	});

	var toPropertyKey = toPropertyKey$3;
	var definePropertyModule$1 = objectDefineProperty;
	var createPropertyDescriptor$1 = createPropertyDescriptor$4;

	var createProperty$3 = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) definePropertyModule$1.f(object, propertyKey, createPropertyDescriptor$1(0, value));else object[propertyKey] = value;
	};

	var fails$b = fails$s;
	var wellKnownSymbol$c = wellKnownSymbol$i;
	var V8_VERSION$1 = engineV8Version;
	var SPECIES$1 = wellKnownSymbol$c('species');

	var arrayMethodHasSpeciesSupport$2 = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return V8_VERSION$1 >= 51 || !fails$b(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$1] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var $$7 = _export;
	var global$e = global$L;
	var fails$a = fails$s;
	var isArray = isArray$2;
	var isObject$7 = isObject$e;
	var toObject$5 = toObject$8;
	var lengthOfArrayLike$4 = lengthOfArrayLike$7;
	var createProperty$2 = createProperty$3;
	var arraySpeciesCreate$1 = arraySpeciesCreate$3;
	var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$2;
	var wellKnownSymbol$b = wellKnownSymbol$i;
	var V8_VERSION = engineV8Version;
	var IS_CONCAT_SPREADABLE = wellKnownSymbol$b('isConcatSpreadable');
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
	var TypeError$8 = global$e.TypeError; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails$a(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$1('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject$7(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	$$7({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
	}, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject$5(this);
	    var A = arraySpeciesCreate$1(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike$4(E);
	        if (n + len > MAX_SAFE_INTEGER$1) throw TypeError$8(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty$2(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER$1) throw TypeError$8(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty$2(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var NATIVE_BIND = functionBindNative;
	var FunctionPrototype$1 = Function.prototype;
	var apply$2 = FunctionPrototype$1.apply;
	var call$7 = FunctionPrototype$1.call; // eslint-disable-next-line es/no-reflect -- safe

	var functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call$7.bind(apply$2) : function () {
	  return call$7.apply(apply$2, arguments);
	});

	var uncurryThis$9 = functionUncurryThis;
	var toObject$4 = toObject$8;
	var floor = Math.floor;
	var charAt$1 = uncurryThis$9(''.charAt);
	var replace = uncurryThis$9(''.replace);
	var stringSlice$2 = uncurryThis$9(''.slice);
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g; // `GetSubstitution` abstract operation
	// https://tc39.es/ecma262/#sec-getsubstitution

	var getSubstitution$1 = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject$4(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }

	  return replace(replacement, symbols, function (match, ch) {
	    var capture;

	    switch (charAt$1(ch, 0)) {
	      case '$':
	        return '$';

	      case '&':
	        return matched;

	      case '`':
	        return stringSlice$2(str, 0, position);

	      case "'":
	        return stringSlice$2(str, tailPos);

	      case '<':
	        capture = namedCaptures[stringSlice$2(ch, 1, -1)];
	        break;

	      default:
	        // \d\d?
	        var n = +ch;
	        if (n === 0) return match;

	        if (n > m) {
	          var f = floor(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? charAt$1(ch, 1) : captures[f - 1] + charAt$1(ch, 1);
	          return match;
	        }

	        capture = captures[n - 1];
	    }

	    return capture === undefined ? '' : capture;
	  });
	};

	var apply$1 = functionApply;
	var call$6 = functionCall;
	var uncurryThis$8 = functionUncurryThis;
	var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
	var fails$9 = fails$s;
	var anObject$7 = anObject$f;
	var isCallable$6 = isCallable$j;
	var toIntegerOrInfinity$1 = toIntegerOrInfinity$7;
	var toLength$1 = toLength$4;
	var toString$2 = toString$a;
	var requireObjectCoercible$1 = requireObjectCoercible$8;
	var advanceStringIndex$1 = advanceStringIndex$3;
	var getMethod$3 = getMethod$6;
	var getSubstitution = getSubstitution$1;
	var regExpExec$1 = regexpExecAbstract;
	var wellKnownSymbol$a = wellKnownSymbol$i;
	var REPLACE = wellKnownSymbol$a('replace');
	var max$2 = Math.max;
	var min$2 = Math.min;
	var concat$1 = uncurryThis$8([].concat);
	var push$1 = uncurryThis$8([].push);
	var stringIndexOf = uncurryThis$8(''.indexOf);
	var stringSlice$1 = uncurryThis$8(''.slice);

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	}; // IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0


	var REPLACE_KEEPS_$0 = function () {
	  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
	  return 'a'.replace(/./, '$0') === '$0';
	}(); // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string


	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }

	  return false;
	}();

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$9(function () {
	  var re = /./;

	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  }; // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive


	  return ''.replace(re, '$<a>') !== '7';
	}); // @@replace logic

	fixRegExpWellKnownSymbolLogic$1('replace', function (_, nativeReplace, maybeCallNative) {
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
	  return [// `String.prototype.replace` method
	  // https://tc39.es/ecma262/#sec-string.prototype.replace
	  function replace(searchValue, replaceValue) {
	    var O = requireObjectCoercible$1(this);
	    var replacer = searchValue == undefined ? undefined : getMethod$3(searchValue, REPLACE);
	    return replacer ? call$6(replacer, searchValue, O, replaceValue) : call$6(nativeReplace, toString$2(O), searchValue, replaceValue);
	  }, // `RegExp.prototype[@@replace]` method
	  // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	  function (string, replaceValue) {
	    var rx = anObject$7(this);
	    var S = toString$2(string);

	    if (typeof replaceValue == 'string' && stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 && stringIndexOf(replaceValue, '$<') === -1) {
	      var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
	      if (res.done) return res.value;
	    }

	    var functionalReplace = isCallable$6(replaceValue);
	    if (!functionalReplace) replaceValue = toString$2(replaceValue);
	    var global = rx.global;

	    if (global) {
	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	    }

	    var results = [];

	    while (true) {
	      var result = regExpExec$1(rx, S);
	      if (result === null) break;
	      push$1(results, result);
	      if (!global) break;
	      var matchStr = toString$2(result[0]);
	      if (matchStr === '') rx.lastIndex = advanceStringIndex$1(S, toLength$1(rx.lastIndex), fullUnicode);
	    }

	    var accumulatedResult = '';
	    var nextSourcePosition = 0;

	    for (var i = 0; i < results.length; i++) {
	      result = results[i];
	      var matched = toString$2(result[0]);
	      var position = max$2(min$2(toIntegerOrInfinity$1(result.index), S.length), 0);
	      var captures = []; // NOTE: This is equivalent to
	      //   captures = result.slice(1).map(maybeToString)
	      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

	      for (var j = 1; j < result.length; j++) push$1(captures, maybeToString(result[j]));

	      var namedCaptures = result.groups;

	      if (functionalReplace) {
	        var replacerArgs = concat$1([matched], captures, position, S);
	        if (namedCaptures !== undefined) push$1(replacerArgs, namedCaptures);
	        var replacement = toString$2(apply$1(replaceValue, undefined, replacerArgs));
	      } else {
	        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	      }

	      if (position >= nextSourcePosition) {
	        accumulatedResult += stringSlice$1(S, nextSourcePosition, position) + replacement;
	        nextSourcePosition = position + matched.length;
	      }
	    }

	    return accumulatedResult + stringSlice$1(S, nextSourcePosition);
	  }];
	}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

	var isObject$6 = isObject$e;
	var classof$4 = classofRaw$1;
	var wellKnownSymbol$9 = wellKnownSymbol$i;
	var MATCH = wellKnownSymbol$9('match'); // `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp

	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject$6(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof$4(it) == 'RegExp');
	};

	var global$d = global$L;
	var isConstructor = isConstructor$2;
	var tryToString$2 = tryToString$4;
	var TypeError$7 = global$d.TypeError; // `Assert: IsConstructor(argument) is true`

	var aConstructor$1 = function (argument) {
	  if (isConstructor(argument)) return argument;
	  throw TypeError$7(tryToString$2(argument) + ' is not a constructor');
	};

	var anObject$6 = anObject$f;
	var aConstructor = aConstructor$1;
	var wellKnownSymbol$8 = wellKnownSymbol$i;
	var SPECIES = wellKnownSymbol$8('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor

	var speciesConstructor$1 = function (O, defaultConstructor) {
	  var C = anObject$6(O).constructor;
	  var S;
	  return C === undefined || (S = anObject$6(C)[SPECIES]) == undefined ? defaultConstructor : aConstructor(S);
	};

	var global$c = global$L;
	var toAbsoluteIndex$1 = toAbsoluteIndex$3;
	var lengthOfArrayLike$3 = lengthOfArrayLike$7;
	var createProperty$1 = createProperty$3;
	var Array$1 = global$c.Array;
	var max$1 = Math.max;

	var arraySliceSimple = function (O, start, end) {
	  var length = lengthOfArrayLike$3(O);
	  var k = toAbsoluteIndex$1(start, length);
	  var fin = toAbsoluteIndex$1(end === undefined ? length : end, length);
	  var result = Array$1(max$1(fin - k, 0));

	  for (var n = 0; k < fin; k++, n++) createProperty$1(result, n, O[k]);

	  result.length = n;
	  return result;
	};

	var apply = functionApply;
	var call$5 = functionCall;
	var uncurryThis$7 = functionUncurryThis;
	var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
	var isRegExp = isRegexp;
	var anObject$5 = anObject$f;
	var requireObjectCoercible = requireObjectCoercible$8;
	var speciesConstructor = speciesConstructor$1;
	var advanceStringIndex = advanceStringIndex$3;
	var toLength = toLength$4;
	var toString$1 = toString$a;
	var getMethod$2 = getMethod$6;
	var arraySlice$1 = arraySliceSimple;
	var callRegExpExec = regexpExecAbstract;
	var regexpExec = regexpExec$3;
	var stickyHelpers = regexpStickyHelpers;
	var fails$8 = fails$s;
	var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
	var MAX_UINT32 = 0xFFFFFFFF;
	var min$1 = Math.min;
	var $push = [].push;
	var exec = uncurryThis$7(/./.exec);
	var push = uncurryThis$7($push);
	var stringSlice = uncurryThis$7(''.slice); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper

	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$8(function () {
	  // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	}); // @@split logic

	fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'.split(/(b)*/)[1] == 'c' || // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
	  '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = toString$1(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

	      if (!isRegExp(separator)) {
	        return call$5(nativeSplit, string, separator, lim);
	      }

	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = call$5(regexpExec, separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;

	        if (lastIndex > lastLastIndex) {
	          push(output, stringSlice(string, lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) apply($push, output, arraySlice$1(match, 1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }

	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string.length) {
	        if (lastLength || !exec(separatorCopy, '')) push(output, '');
	      } else push(output, stringSlice(string, lastLastIndex));

	      return output.length > lim ? arraySlice$1(output, 0, lim) : output;
	    }; // Chakra, V8

	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : call$5(nativeSplit, this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [// `String.prototype.split` method
	  // https://tc39.es/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = requireObjectCoercible(this);
	    var splitter = separator == undefined ? undefined : getMethod$2(separator, SPLIT);
	    return splitter ? call$5(splitter, separator, O, limit) : call$5(internalSplit, toString$1(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (string, limit) {
	    var rx = anObject$5(this);
	    var S = toString$1(string);
	    var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
	    if (res.done) return res.value;
	    var C = speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (UNSUPPORTED_Y ? 'g' : 'y'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
	      var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
	      var e;

	      if (z === null || (e = min$1(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p) {
	        q = advanceStringIndex(S, q, unicodeMatching);
	      } else {
	        push(A, stringSlice(S, p, q));
	        if (A.length === lim) return A;

	        for (var i = 1; i <= z.length - 1; i++) {
	          push(A, z[i]);
	          if (A.length === lim) return A;
	        }

	        q = p = e;
	      }
	    }

	    push(A, stringSlice(S, p));
	    return A;
	  }];
	}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

	var global$b = global$L;
	var aCallable$1 = aCallable$4;
	var toObject$3 = toObject$8;
	var IndexedObject$1 = indexedObject;
	var lengthOfArrayLike$2 = lengthOfArrayLike$7;
	var TypeError$6 = global$b.TypeError; // `Array.prototype.{ reduce, reduceRight }` methods implementation

	var createMethod = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aCallable$1(callbackfn);
	    var O = toObject$3(that);
	    var self = IndexedObject$1(O);
	    var length = lengthOfArrayLike$2(O);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }

	      index += i;

	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError$6('Reduce of empty array with no initial value');
	      }
	    }

	    for (; IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }

	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduce
	  left: createMethod(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
	  right: createMethod(true)
	};

	var classof$3 = classofRaw$1;
	var global$a = global$L;
	var engineIsNode = classof$3(global$a.process) == 'process';

	var $$6 = _export;
	var $reduce = arrayReduce.left;
	var arrayMethodIsStrict = arrayMethodIsStrict$3;
	var CHROME_VERSION = engineV8Version;
	var IS_NODE = engineIsNode;
	var STRICT_METHOD = arrayMethodIsStrict('reduce'); // Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982

	var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83; // `Array.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduce

	$$6({
	  target: 'Array',
	  proto: true,
	  forced: !STRICT_METHOD || CHROME_BUG
	}, {
	  reduce: function reduce(callbackfn
	  /* , initialValue */
	  ) {
	    var length = arguments.length;
	    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
	  }
	});

	
	function position(targetElement, target, orientation) {
	  var targetCoordinates = getElementCoordinates(targetElement);
	  var divWidth = ttDiv.getBoundingClientRect()['width'];
	  var divHeight = ttDiv.getBoundingClientRect()['height'];
	  var halfDivHeight = divHeight / 2;
	  var halfDivWidth = divWidth / 2;
	  var borderRadius = parseSize(target.borderRadius(), 'width', ttDiv);
	  var arrowSize = parseSize(target.arrowSize(), 'width', ttDiv);
	  afterRule.borderWidth = arrowSize + 'px';
	  var top;
	  var left;
	  var verticalAdjust;
	  var horizontalAdjust;
	  var sizeAdjust;

	  var adjustVertical = function adjustVertical(top) {
	    var topAdjust = top;
	    var arrowAdjust = halfDivHeight;

	    if (top < 0) {
	      topAdjust = 0;
	      arrowAdjust = Math.max(arrowSize + borderRadius, top + halfDivHeight);
	    } else if (top + divHeight > windowHeight) {
	      topAdjust = windowHeight - divHeight;
	      arrowAdjust = Math.min(divHeight - borderRadius - arrowSize, halfDivHeight + top - topAdjust);
	    }
	    return {
	      topAdjust: Math.round(topAdjust),
	      arrowAdjust: Math.round(arrowAdjust)
	    };
	  };

	  var adjustHorizontal = function adjustHorizontal(left) {
	    var leftAdjust = left;
	    var arrowAdjust = halfDivWidth;

	    if (left < 0) {
	      leftAdjust = 0;
	      arrowAdjust = Math.max(arrowSize + borderRadius, left + halfDivWidth);
	    } else if (left + divWidth > windowWidth) {
	      leftAdjust = windowWidth - divWidth;
	      arrowAdjust = Math.min(divWidth - borderRadius - arrowSize, halfDivWidth + left - leftAdjust);
	    }
	    return {
	      leftAdjust: Math.round(leftAdjust),
	      arrowAdjust: Math.round(arrowAdjust)
	    };
	  };

	  switch (orientation) {
	    case 'top':
	      {
	        top = targetCoordinates.top - arrowSize - divHeight;

	        if (top < 0) {
	          beforeRule.height = Math.round(divHeight + top) + 'px';
	          top = 0;
	        }
	        left = targetCoordinates.width / 2 + targetCoordinates.left - halfDivWidth;
	        horizontalAdjust = adjustHorizontal(left);
	        beforeRule.top = Math.round(top) + 'px';
	        beforeRule.left = horizontalAdjust.leftAdjust + 'px';
	        afterRule.top = '99.5%'; //  '100%';

	        afterRule.left = horizontalAdjust.arrowAdjust + 'px';
	        afterRule.bottom = '';
	        afterRule.right = '';
	        afterRule.marginLeft = -arrowSize + 'px';
	        afterRule.marginTop = '';
	        afterRule.borderColor = target.backgroundColor() + ' transparent transparent transparent';
	        break;
	      }

	    case 'bottom':
	      {
	        top = targetCoordinates.top + targetCoordinates.height + arrowSize;
	        sizeAdjust = windowHeight - divHeight + top + arrowSize;
	        beforeRule.height = sizeAdjust < 0 ? divHeight + sizeAdjust + 'px' : beforeRule.height;
	        left = targetCoordinates.width / 2 + targetCoordinates.left - halfDivWidth;
	        horizontalAdjust = adjustHorizontal(left);
	        beforeRule.top = Math.round(top) + 'px';
	        beforeRule.left = horizontalAdjust.leftAdjust + 'px';
	        afterRule.top = '';
	        afterRule.left = horizontalAdjust.arrowAdjust + 'px';
	        afterRule.bottom = '99.5%'; //'100%';

	        afterRule.right = '';
	        afterRule.marginLeft = -arrowSize + 'px';
	        afterRule.marginTop = '';
	        afterRule.borderColor = 'transparent transparent ' + target.backgroundColor() + ' transparent';
	        break;
	      }

	    case 'left':
	      {
	        top = targetCoordinates.height / 2 + targetCoordinates.top - halfDivHeight;
	        left = targetCoordinates.left - divWidth - arrowSize;

	        if (left < 0) {
	          beforeRule.width = Math.round(divWidth + left) + 'px';
	          left = 0;
	        }
	        verticalAdjust = adjustVertical(top);
	        beforeRule.top = verticalAdjust.topAdjust + 'px';
	        beforeRule.left = Math.round(left) + 'px';
	        afterRule.top = verticalAdjust.arrowAdjust + 'px';
	        afterRule.left = '99.5%'; //'100%';

	        afterRule.bottom = '';
	        afterRule.right = '';
	        afterRule.marginLeft = '';
	        afterRule.marginTop = -arrowSize + 'px';
	        afterRule.borderColor = 'transparent transparent transparent ' + target.backgroundColor();
	        break;
	      }

	    case 'right':
	      {
	        top = targetCoordinates.height / 2 + targetCoordinates.top - halfDivHeight;
	        left = targetCoordinates.left + targetCoordinates.width + arrowSize;
	        sizeAdjust = windowWidth - divWidth + left + arrowSize;
	        beforeRule.width = sizeAdjust < 0 ? divWidth + sizeAdjust + 'px' : beforeRule.width;
	        verticalAdjust = adjustVertical(top);
	        beforeRule.top = verticalAdjust.topAdjust + 'px';
	        beforeRule.left = Math.round(left) + 'px';
	        afterRule.top = verticalAdjust.arrowAdjust + 'px';
	        afterRule.left = '';
	        afterRule.bottom = '';
	        afterRule.right = '99.5%'; //'100%';

	        afterRule.marginLeft = '';
	        afterRule.marginTop = -arrowSize + 'px';
	        afterRule.borderColor = 'transparent ' + target.backgroundColor() + ' transparent transparent';
	        break;
	      }
	  }
	}
	
	function optimumOrientation(targetElement, target) {
	  var elementCoordinates = getElementCoordinates(targetElement);
	  var arrowSize = parseSize(target.arrowSize(), 'width', ttDiv);
	  var midX = elementCoordinates.left + elementCoordinates.width / 2;
	  var midY = elementCoordinates.top + elementCoordinates.height / 2;
	  var divWidth = ttDiv.getBoundingClientRect()['width'];
	  var divHeight = ttDiv.getBoundingClientRect()['height'];
	  var halfDivHeight = divHeight / 2;
	  var halfDivWidth = divWidth / 2;
	  var leftOverlap = overlap('left', {
	    x0: elementCoordinates.left - arrowSize - divWidth,
	    x1: elementCoordinates.left - arrowSize,
	    y0: midY - halfDivHeight,
	    y1: midY + halfDivHeight
	  });
	  var rightOverlap = overlap('right', {
	    x0: elementCoordinates.left + elementCoordinates.width + arrowSize,
	    x1: elementCoordinates.left + elementCoordinates.width + arrowSize + divWidth,
	    y0: midY - halfDivHeight,
	    y1: midY + halfDivHeight
	  });
	  var topOverlap = overlap('top', {
	    x0: midX - halfDivWidth,
	    x1: midX + halfDivWidth,
	    y0: elementCoordinates.top - arrowSize - divHeight,
	    y1: elementCoordinates.top - arrowSize
	  });
	  var bottomOverlap = overlap('bottom', {
	    x0: midX - halfDivWidth,
	    x1: midX + halfDivWidth,
	    y0: elementCoordinates.top + elementCoordinates.height + arrowSize,
	    y1: elementCoordinates.top + elementCoordinates.height + arrowSize + divHeight
	  });

	  switch (target.preferredOrientation()) {
	    case 'left':
	      {
	        if (leftOverlap.overlap == 1) return 'left';
	        break;
	      }

	    case 'right':
	      {
	        if (rightOverlap.overlap == 1) return 'right';
	        break;
	      }

	    case 'top':
	      {
	        if (topOverlap.overlap == 1) return 'top';
	        break;
	      }

	    case 'bottom':
	      {
	        if (bottomOverlap.overlap == 1) return 'bottom';
	        break;
	      }
	  }

	  var overlaps = [leftOverlap, rightOverlap, topOverlap, bottomOverlap]; //if all of the overlaps are less than 1 return the greatest

	  if (leftOverlap.overlap < 1 && rightOverlap.overlap < 1 && topOverlap.overlap < 1 && bottomOverlap.overlap < 1) {
	    return overlaps[overlaps.reduce(function (prev, current, index, array) {
	      if (current.overlap > array[prev].overlap) {
	        return index;
	      } else {
	        return prev;
	      }
	    }, 0)].side;
	  }

	  overlaps = overlaps.reduce(function (prev, current) {
	    if (current.overlap == 1) {
	      return prev.concat(current);
	    } else {
	      return prev;
	    }
	  }, []);

	  if (overlaps.length == 1) {
	    return overlaps[0].side;
	  }

	  return overlaps[overlaps.reduce(function (prev, current, index, array) {
	    if (current.spacing[current.side] >= array[prev].spacing[prev.side]) {
	      return index;
	    } else {
	      return prev;
	    }
	  }, 0)].side;
	}
	
	function getOrientation(targetElement, target) {
	  if (target.orientation() != undefined) return target.orientation();
	  if (target.autoPosition()) return optimumOrientation(targetElement, target);
	  if (target.preferredOrientation() != 'none') return target.preferredOrientation();
	  return 'right';
	}

		
	var globalOptions$1 = {
	  content: '',
	  orientation: undefined,
	  //'right',
	  preferredOrientation: 'right',
	  autoPosition: true,
	  autoSize: true,
	  mousePoint: false,
	  trackMouse: false,
	  cursor: 'help',
	  fontFamily: 'verdana, sans-serif',
	  fontSize: '1em',
	  //'16',
	  foregroundColor: 'white',
	  backgroundColor: '#333333',
	  backgroundOpacity: 1,
	  padding: '5px 10px',
	  borderRadius: '12px',
	  //12,
	  boxShadow: '8px 8px 8px 0 rgba(0,0,0, 0.5)',
	  transitionVisible: 'opacity 0.4s ease-in 0s',
	  transitionHidden: 'opacity 0.4s ease-out 0s',
	  arrowSize: '12px',
	  //12,
	  width: 'auto',
	  maxWidth: 'none',
	  minWidth: 'auto',
	  //0,
	  height: 'auto',
	  maxHeight: 'none',
	  minHeight: 'auto' //0

	};
	
	function applyOptions(target) {
	  var transitionString;
	  beforeRule.fontFamily = target.font().family;
	  beforeRule.fontSize = target.font().size; // + 'px';

	  beforeRule.color = target.foregroundColor();
	  beforeRule.backgroundColor = target.backgroundColor();
	  beforeRule.padding = target.padding();
	  beforeRule.borderRadius = target.borderRadius(); // + 'px';
	  // afterRule.borderWidth = target.arrowSize(); // + 'px';

	  targetRule.cursor = target.cursor();
	  beforeRule.boxShadow = target.boxShadow();
	  beforeRule['-moz-boxShadow'] = target.boxShadow();
	  beforeRule['-webkit-boxShadow'] = target.boxShadow();
	  transitionString = target.transitionVisible();
	  beforeRule.transition = transitionString;
	  beforeRule['-moz-transition'] = transitionString;
	  beforeRule['-webkit-transiton'] = transitionString;
	  beforeRule['-o-transition'] = transitionString;
	  beforeRule.maxWidth = target.maxWidth();
	  beforeRule.minWidth = target.minWidth();
	  beforeRule.maxHeight = target.maxHeight();
	  beforeRule.minHeight = target.minHeight();
	  ttContainer.innerHTML = target.content();

	  if (target.autoSize()) {
	    sizeTip();
	  } else {
	    beforeRule.width = target.width();
	    beforeRule.height = target.height();
	  }
	}
	
	function resetOptions(target) {
	  ttContainer.innerHTML = '';
	  beforeRule.width = 0;
	  beforeRule.height = 0;
	  beforeRule.width = globalOptions$1.width;
	  beforeRule.height = globalOptions$1.height;
	  beforeRule.maxHeight = globalOptions$1.maxHeight;
	  beforeRule.minHeight = globalOptions$1.minHeight;
	  beforeRule.maxWidth = globalOptions$1.maxWidth;
	  beforeRule.minWidth = globalOptions$1.minWidth;
	}

	
	var mouseX;
	
	var mouseY;
	
	var timer;
	
	var suspended = false;
	
	function getMouseCoordinates(event) {
	  event = event || window.event;
	  mouseX = event.clientX;
	  mouseY = event.clientY;
	}
	

	function mouseOver(event) {
	  event = event || window.event;

	  if (suspend()) {
	    return;
	  }
	  var targetElement = this;
	  var target;

	  if (beforeRule.visibility !== 'hidden') {
	    //executed if another tooltip is transitioning to hidden
	    beforeRule.transition = '';
	    clearTimeout(timer);
	  }
	  beforeRule.visibility = 'visible';
	  getMouseCoordinates(event);
	  target = tips[tipsIndex.indexOf(targetElement.id)];
	  applyOptions(target);
	  var orientation = getOrientation(targetElement, target);
	  position(targetElement, target, orientation);
	  beforeRule.opacity = target.backgroundOpacity();
	}
	
	function mouseMove(event) {
	  event = event || window.event;

	  if (suspend()) {
	    return;
	  }
	  var targetElement = this;
	  var target;
	  target = tips[tipsIndex.indexOf(targetElement.id)];

	  if (!target.trackMouse()) {
	    return;
	  }
	  getMouseCoordinates(event);
	  var orientation = getOrientation(targetElement, target);
	  position(targetElement, target, orientation);
	}
	
	function mouseOut(event) {
	  var targetElement = this;

	  if (window.getComputedStyle(targetElement, null).getPropertyValue('opacity') == 0 && suspend()) {
	    return;
	  }
	  var target = tips[tipsIndex.indexOf(targetElement.id)];
	  var transitionString = target.transitionHidden();
	  var transitionDuration = +transitionString.split(' ')[1].replace('s', '');
	  var transitionDelay = +transitionString.split(' ')[3].replace('s', '');
	  beforeRule.transition = transitionString;
	  beforeRule['-moz-transition'] = transitionString;
	  beforeRule['-webkit-transiton'] = transitionString;
	  beforeRule['-o-transition'] = transitionString;
	  timer = window.setTimeout(function () {
	    // ensures the visibility isn't set to hidden until the transition completes
	    beforeRule.visibility = 'hidden';
	    resetOptions();
	  }, (transitionDuration + transitionDelay) * 1000);
	  beforeRule.opacity = 0;
	}
	
	function suspend(suspendTips) {
	  if (suspendTips == undefined) {
	    return suspended;
	  }

	  if (checkBoolean(suspendTips, 'suspend')) {
	    suspended = suspendTips;
	  }
	}

	
	var windowWidth = 1024;
	
	var windowHeight = 768;
	
	var aspectRatio;
	
	function windowResized() {
	  windowWidth = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
	  windowHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
	  aspectRatio = windowWidth / windowHeight;
	}
	
	function getElementCoordinates(element) {
	  var cursorBuffer = 0;
	  var clientRect = {};
	  var boundingClientRect = {};
	  var target = tips[tipsIndex.indexOf(element.id)];

	  if (target.mousePoint()) {
	    clientRect.left = mouseX - cursorBuffer;
	    clientRect.top = mouseY - cursorBuffer;
	    clientRect.right = mouseX + cursorBuffer;
	    clientRect.bottom = mouseY + cursorBuffer;
	  } else {
	    boundingClientRect = element.getBoundingClientRect();
	    clientRect.left = boundingClientRect.left - cursorBuffer;
	    clientRect.top = boundingClientRect.top - cursorBuffer;
	    clientRect.right = boundingClientRect.right + cursorBuffer;
	    clientRect.bottom = boundingClientRect.bottom + cursorBuffer;
	  }
	  var height = clientRect.bottom - clientRect.top;
	  var width = clientRect.right - clientRect.left;
	  return {
	    top: clientRect.top,
	    left: clientRect.left,
	    height: height,
	    width: width
	  };
	}
	
	function overlap(side, coords) {
	  var precision = 7;
	  var divArea = (coords.x1 - coords.x0) * (coords.y1 - coords.y0);
	  var xDist = Math.min(coords.x1, windowWidth) - Math.max(coords.x0, 0);
	  var yDist = Math.min(coords.y1, windowHeight) - Math.max(coords.y0, 0);
	  var overlapArea = xDist > 0 && yDist > 0 ? xDist * yDist : 0;
	  var overlap = parseFloat((overlapArea / divArea).toFixed(precision));
	  var spacing = {
	    left: coords.x0,
	    right: windowWidth - coords.x1,
	    top: coords.y0,
	    bottom: windowHeight - coords.y1
	  };
	  return {
	    side: side,
	    overlap: overlap,
	    spacing: spacing
	  };
	}
	
	function hexToRgb(hex) {
	  var rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i); // return `rgb(${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)})`;

	  return [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)];
	}
	

	function createPseudoDiv(template) {
	  var pseudoDiv = document.createElement('div');

	  if (template != undefined) {
	    var font = window.getComputedStyle(template, null).getPropertyValue('font');
	    pseudoDiv.style.font = font;
	    pseudoDiv.style.width = template.getBoundingClientRect()['width'] + 'px';
	    pseudoDiv.style.height = template.getBoundingClientRect()['height'] + 'px';
	  }
	  pseudoDiv.style.visibility = 'hidden';
	  pseudoDiv.style.position = 'absolute';
	  pseudoDiv.style.display = 'inline-block';
	  pseudoDiv.id = 'pseudoDiv';
	  document.body.insertBefore(pseudoDiv, document.body.firstChild);
	  return pseudoDiv;
	}
	

	function parseColor(color) {
	  var pseudoDiv = createPseudoDiv();
	  pseudoDiv.style.color = color;
	  var rgb = window.getComputedStyle(pseudoDiv, null).getPropertyValue('color');

	  if (rgb.indexOf('#') !== -1) {
	    rgb = hexToRgb(rgb);
	  } else rgb = rgb.match(/\d+/g);

	  pseudoDiv.remove();
	  return "rgb(".concat(rgb[0], ", ").concat(rgb[1], ", ").concat(rgb[2], ")");
	}
	
	function parseSize(size) {
	  var dimension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'width';
	  var template = arguments.length > 2 ? arguments[2] : undefined;

	  if (typeof size == 'number') {
	    return size;
	  }
	  var result;
	  var pseudoDiv = createPseudoDiv(template);

	  if (size.indexOf('%') != -1) {
	    var percent = parseInt(size, 10) / 100;
	    result = pseudoDiv.getBoundingClientRect()[dimension] * percent;
	  } else {
	    pseudoDiv.style[dimension] = size;
	    result = pseudoDiv.getBoundingClientRect()[dimension];
	  }
	  pseudoDiv.remove();
	  return result;
	}
	
	function checkSize(size) {
	  if (typeof size == 'string') {
	    var regex = /^(\d*\.)?\d+(?:(cm)|(mm)|(in)|(px)|(pt)|(pc)|(em)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(%))/;
	    var match = size.match(regex);

	    if (match != null && match[0].length == size.length) {
	      return true;
	    }
	  }
	  console.log("Option setting error. ".concat(size, " is an invalid CSS size"));
	  return false;
	}
	
	function checkBoolean(argument, argumentName) {
	  if ([true, false].indexOf(argument) == -1) {
	    console.log("Option setting error. ".concat(argumentName, " must be one of [true | false]"));
	    return false;
	  } else {
	    return true;
	  }
	}
	
	function checkFontFamily(fontFamily) {
	  if (document.fonts == undefined) return true; //interface undefined - probably IE

	  if (document.fonts.check("16px ".concat(fontFamily))) return true;
	  console.log("Option setting error. ".concat(fontFamily, " is not a valid font family for this browser"));
	  return false;
	}
	
	function checkCSS(rule, style) {
	  if (style == 'initial') {
	    return true;
	  }

	  var result;
	  var pseudoDiv = createPseudoDiv();
	  pseudoDiv.style[rule] = 'initial';
	  pseudoDiv.style[rule] = style;

	  if (pseudoDiv.style[rule] == 'initial') {
	    console.log("Option setting error. ".concat(style, " is not a valid style for ").concat(rule));
	    result = false;
	  } else {
	    result = true;
	  }
	  pseudoDiv.remove();
	  return result;
	}

	function _wrapRegExp() {
	  _wrapRegExp = function (re, groups) {
	    return new BabelRegExp(re, void 0, groups);
	  };

	  var _super = RegExp.prototype,
	      _groups = new WeakMap();

	  function BabelRegExp(re, flags, groups) {
	    var _this = new RegExp(re, flags);

	    return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype);
	  }

	  function buildGroups(result, re) {
	    var g = _groups.get(re);

	    return Object.keys(g).reduce(function (groups, name) {
	      return groups[name] = result[g[name]], groups;
	    }, Object.create(null));
	  }

	  return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
	    var result = _super.exec.call(this, str);

	    return result && (result.groups = buildGroups(result, this)), result;
	  }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
	    if ("string" == typeof substitution) {
	      var groups = _groups.get(this);

	      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
	        return "$" + groups[name];
	      }));
	    }

	    if ("function" == typeof substitution) {
	      var _this = this;

	      return _super[Symbol.replace].call(this, str, function () {
	        var args = arguments;
	        return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args);
	      });
	    }

	    return _super[Symbol.replace].call(this, str, substitution);
	  }, _wrapRegExp.apply(this, arguments);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  Object.defineProperty(Constructor, "prototype", {
	    writable: false
	  });
	  return Constructor;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  Object.defineProperty(subClass, "prototype", {
	    writable: false
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _classPrivateFieldGet(receiver, privateMap) {
	  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

	  return _classApplyDescriptorGet(receiver, descriptor);
	}

	function _classPrivateFieldSet(receiver, privateMap, value) {
	  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

	  _classApplyDescriptorSet(receiver, descriptor, value);

	  return value;
	}

	function _classExtractFieldDescriptor(receiver, privateMap, action) {
	  if (!privateMap.has(receiver)) {
	    throw new TypeError("attempted to " + action + " private field on non-instance");
	  }

	  return privateMap.get(receiver);
	}

	function _classApplyDescriptorGet(receiver, descriptor) {
	  if (descriptor.get) {
	    return descriptor.get.call(receiver);
	  }

	  return descriptor.value;
	}

	function _classApplyDescriptorSet(receiver, descriptor, value) {
	  if (descriptor.set) {
	    descriptor.set.call(receiver, value);
	  } else {
	    if (!descriptor.writable) {
	      throw new TypeError("attempted to set read only private field");
	    }

	    descriptor.value = value;
	  }
	}

	function _checkPrivateRedeclaration(obj, privateCollection) {
	  if (privateCollection.has(obj)) {
	    throw new TypeError("Cannot initialize the same private elements twice on an object");
	  }
	}

	function _classPrivateFieldInitSpec(obj, privateMap, value) {
	  _checkPrivateRedeclaration(obj, privateMap);

	  privateMap.set(obj, value);
	}

	var PROPER_FUNCTION_NAME$1 = functionName.PROPER;
	var fails$7 = fails$s;
	var whitespaces = whitespaces$4;
	var non = '\u200B\u0085\u180E'; // check that a method works with the correct list
	// of whitespaces and has a correct name

	var stringTrimForced = function (METHOD_NAME) {
	  return fails$7(function () {
	    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() !== non || PROPER_FUNCTION_NAME$1 && whitespaces[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var $$5 = _export;
	var $trim = stringTrim.trim;
	var forcedStringTrimMethod = stringTrimForced; // `String.prototype.trim` method
	// https://tc39.es/ecma262/#sec-string.prototype.trim

	$$5({
	  target: 'String',
	  proto: true,
	  forced: forcedStringTrimMethod('trim')
	}, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var DESCRIPTORS$2 = descriptors;
	var FUNCTION_NAME_EXISTS = functionName.EXISTS;
	var uncurryThis$6 = functionUncurryThis;
	var defineProperty$4 = objectDefineProperty.f;
	var FunctionPrototype = Function.prototype;
	var functionToString = uncurryThis$6(FunctionPrototype.toString);
	var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
	var regExpExec = uncurryThis$6(nameRE.exec);
	var NAME = 'name'; // Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name

	if (DESCRIPTORS$2 && !FUNCTION_NAME_EXISTS) {
	  defineProperty$4(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return regExpExec(nameRE, functionToString(this))[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	
	function getRule(rule) {
	  rule = rule.toLowerCase();

	  for (var i = 0; i < rules.length; i++) {
	    var name = rules[i].cssText.match( /*#__PURE__*/_wrapRegExp(/([^{]*)\s*\{/i, {
	      name: 1
	    })).groups.name.trim();
	    if (name.toLowerCase() == rule) return rules[i];
	  }
	  return undefined;
	}
	
	function getRuleIndex(rule) {
	  rule = rule.toLowerCase();

	  for (var i = 0; i < rules.length; i++) {
	    var name = rules[i].cssText.match( /*#__PURE__*/_wrapRegExp(/([^{]*)\s*\{/i, {
	      name: 1
	    })).groups.name.trim();
	    if (name.toLowerCase() == rule) return i;
	  }
	  return null;
	}

		
	var sheet;
	
	var rules;
	
	var ttDiv;
	
	var ttContainer;
	
	var beforeRule;
	
	var afterRule;
	
	var targetRule;
	
	var set = false;
	
	function setUp() {
	  if (set) {
	    return;
	  }

	  if (window.addEventListener) {
	    window.addEventListener('resize', windowResized);
	  } else if (window.attachEvent) {
	    window.attachEvent('onresize', windowResized);
	  } else {
	    window.onresize = windowResized;
	  }
	  windowResized();

	  if (document.styleSheets.length == 0) {
	    var head = document.getElementsByTagName("head")[0];
	    sheet = document.createElement("style");
	    sheet.type = "text/css";
	    sheet.rel = 'stylesheet';
	    sheet.media = 'screen';
	    sheet.title = 'fxToolTip';
	    sheet = head.appendChild(sheet).sheet;
	  }
	  sheet = document.styleSheets[0];
	  rules = sheet.cssRules ? sheet.cssRules : sheet.rules;
	  var fxToolTipRule = ".fxToolTip {\n        opacity: 0;\n        -moz-opacity: 0;\n        -khtml-opacity: 0;\n        position: fixed;\n        visibility: hidden;\n        z-index: 100;\n        pointer-events: none;\n        display: inline-block;\n        box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        -webkit-box-sizing: border-box}";
	  var fxContainerRule = ".fxContainer {\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        -ms-text-overflow: ellipsis;\n        -o-text-overflow: ellipsis}";
	  var fxToolTipAfterRule = ".fxToolTip::after{\n        content: \"\";\n        position: absolute;\n        border-style: solid;\n        pointer-events: none;}";

	  if (sheet.insertRule) {
	    sheet.insertRule(fxToolTipRule, rules.length);
	    sheet.insertRule(fxContainerRule, rules.length);
	    sheet.insertRule(fxToolTipAfterRule, rules.length);
	    sheet.insertRule('.fxToolTipTarget {cursor: help;}', rules.length);
	  } else {
	    sheet.addRule(fxToolTipRule, rules.length);
	    sheet.addRule(fxContainerRule, rules.length);
	    sheet.addRule(fxToolTipAfterRule, rules.length);
	    sheet.addRule('.fxToolTipTarget', '{cursor: help;}', rules.length);
	  }
	  beforeRule = getRule('.fxToolTip').style;
	  afterRule = getRule('.fxToolTip::after').style;
	  targetRule = getRule('.fxToolTipTarget').style;
	  ttDiv = document.createElement('div');
	  ttDiv.className = 'fxToolTip';
	  document.body.insertBefore(ttDiv, document.body.firstChild);
	  ttContainer = document.createElement('div');
	  ttContainer.className = 'fxContainer';
	  ttDiv.appendChild(ttContainer);
	  set = true;
	}
	
	function closeDown() {
	  if (window.removeEventListener) {
	    window.removeEventListener('resize', windowResized);
	  } else if (window.detachEvent) {
	    window.detachEvent('onresize', windowResized);
	  } else {
	    window.onresize = '';
	  }

	  if (sheet.deleteRule) {
	    sheet.deleteRule(getRuleIndex('.fxToolTip'));
	    sheet.deleteRule(getRuleIndex('.fxToolTip::after'));
	    sheet.deleteRule(getRuleIndex('.fxToolTipTarget'));
	  } else {
	    sheet.removeRule(getRuleIndex('.fxToolTip'));
	    sheet.removeRule(getRuleIndex('.fxToolTip::after'));
	    sheet.removeRule(getRuleIndex('.fxToolTipTarget'));
	  }
	  ttDiv.parentNode.removeChild(ttDiv);
	  pseudoDiv.parentNode.removeChild(pseudoDiv);
	  sheet = undefined;
	  rules = undefined;
	  window.clearInterval(targetTimer);
	  set = false;
	}

	
	var tips = [];
	
	var tipsIndex = [];
	
	function getTipByElementId(elementId) {
	  var index = tipsIndex.indexOf(elementId);

	  if (index !== -1) {
	    return tips[index];
	  } else {
	    return undefined;
	  }
	}
	
	function sizeTip() {
	  function getAspect() {
	    return ttDiv.getBoundingClientRect()['width'] / ttDiv.getBoundingClientRect()['height'];
	  }

	  function getPerimeter() {
	    return ttDiv.getBoundingClientRect()['width'] + ttDiv.getBoundingClientRect()['height'];
	  }

	  beforeRule.width = 'auto';
	  beforeRule.height = 'auto';
	  var perimeter;
	  var height;
	  var width;
	  var oldWidth = ttDiv.getBoundingClientRect()['width'];
	  var newAspect = getAspect();
	  var oldDelta = Math.abs(newAspect - aspectRatio);
	  var itterations = 0;
	  var newDelta = oldDelta;

	  while (newDelta > 0.1 && itterations < 10) {
	    perimeter = getPerimeter();
	    height = 1 / ((aspectRatio + 1) / perimeter);
	    width = perimeter - height;
	    beforeRule.width = Math.round(width) + 'px';
	    newAspect = getAspect();
	    newDelta = Math.abs(newAspect - aspectRatio);

	    if (Math.abs(newDelta - oldDelta) < 0.1) {
	      if (oldDelta < newDelta) {
	        beforeRule.width = Math.round(oldWidth) + 'px';
	      }
	      itterations = 10;
	    } else {
	      oldWidth = width;
	      oldDelta = newDelta;
	      itterations++;
	    }
	  }
	  beforeRule.width = ttDiv.getBoundingClientRect()['width'] + 'px';
	  beforeRule.height = ttDiv.getBoundingClientRect()['height'] + 'px';
	}

	var DESCRIPTORS$1 = descriptors;
	var uncurryThis$5 = functionUncurryThis;
	var call$4 = functionCall;
	var fails$6 = fails$s;
	var objectKeys = objectKeys$2;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var toObject$2 = toObject$8;
	var IndexedObject = indexedObject; // eslint-disable-next-line es/no-object-assign -- safe

	var $assign = Object.assign; // eslint-disable-next-line es/no-object-defineproperty -- required for testing

	var defineProperty$3 = Object.defineProperty;
	var concat = uncurryThis$5([].concat); // `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign

	var objectAssign = !$assign || fails$6(function () {
	  // should have correct order of operations (Edge bug)
	  if (DESCRIPTORS$1 && $assign({
	    b: 1
	  }, $assign(defineProperty$3({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$3(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), {
	    b: 2
	  })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

	  var A = {};
	  var B = {}; // eslint-disable-next-line es/no-symbol -- safe

	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) {
	    B[chr] = chr;
	  });
	  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject$2(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  var propertyIsEnumerable = propertyIsEnumerableModule.f;

	  while (argumentsLength > index) {
	    var S = IndexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;

	    while (length > j) {
	      key = keys[j++];
	      if (!DESCRIPTORS$1 || call$4(propertyIsEnumerable, S, key)) T[key] = S[key];
	    }
	  }

	  return T;
	} : $assign;

	var $$4 = _export;
	var assign = objectAssign; // `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	// eslint-disable-next-line es/no-object-assign -- required for testing

	$$4({
	  target: 'Object',
	  stat: true,
	  forced: Object.assign !== assign
	}, {
	  assign: assign
	});

	var $$3 = _export;
	var global$9 = global$L;
	var toAbsoluteIndex = toAbsoluteIndex$3;
	var toIntegerOrInfinity = toIntegerOrInfinity$7;
	var lengthOfArrayLike$1 = lengthOfArrayLike$7;
	var toObject$1 = toObject$8;
	var arraySpeciesCreate = arraySpeciesCreate$3;
	var createProperty = createProperty$3;
	var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$2;
	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
	var TypeError$5 = global$9.TypeError;
	var max = Math.max;
	var min = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species

	$$3({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT
	}, {
	  splice: function splice(start, deleteCount
	  /* , ...items */
	  ) {
	    var O = toObject$1(this);
	    var len = lengthOfArrayLike$1(O);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;

	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
	    }

	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
	      throw TypeError$5(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }

	    A = arraySpeciesCreate(O, actualDeleteCount);

	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }

	    A.length = actualDeleteCount;

	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }

	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }
	    }

	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }

	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var wellKnownSymbol$7 = wellKnownSymbol$i;
	var create$2 = objectCreate;
	var definePropertyModule = objectDefineProperty;
	var UNSCOPABLES = wellKnownSymbol$7('unscopables');
	var ArrayPrototype$1 = Array.prototype; // Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables

	if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
	  definePropertyModule.f(ArrayPrototype$1, UNSCOPABLES, {
	    configurable: true,
	    value: create$2(null)
	  });
	} // add a key to Array.prototype[@@unscopables]


	var addToUnscopables$1 = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	var iterators = {};

	var fails$5 = fails$s;
	var correctPrototypeGetter = !fails$5(function () {
	  function F() {
	    /* empty */
	  }

	  F.prototype.constructor = null; // eslint-disable-next-line es/no-object-getprototypeof -- required for testing

	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var global$8 = global$L;
	var hasOwn$3 = hasOwnProperty_1;
	var isCallable$5 = isCallable$j;
	var toObject = toObject$8;
	var sharedKey = sharedKey$3;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;
	var IE_PROTO = sharedKey('IE_PROTO');
	var Object$1 = global$8.Object;
	var ObjectPrototype = Object$1.prototype; // `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof

	var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object$1.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwn$3(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;

	  if (isCallable$5(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  }

	  return object instanceof Object$1 ? ObjectPrototype : null;
	};

	var fails$4 = fails$s;
	var isCallable$4 = isCallable$j;
	var getPrototypeOf$1 = objectGetPrototypeOf;
	var redefine$3 = redefine$7.exports;
	var wellKnownSymbol$6 = wellKnownSymbol$i;
	var ITERATOR$5 = wellKnownSymbol$6('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false; // `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object

	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;
	/* eslint-disable es/no-array-prototype-keys -- safe */

	if ([].keys) {
	  arrayIterator = [].keys(); // Safari 8 has buggy iterators w/o `next`

	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf$1(getPrototypeOf$1(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$4(function () {
	  var test = {}; // FF44- legacy iterators case

	  return IteratorPrototype$2[ITERATOR$5].call(test) !== test;
	});
	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {}; // `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator

	if (!isCallable$4(IteratorPrototype$2[ITERATOR$5])) {
	  redefine$3(IteratorPrototype$2, ITERATOR$5, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var defineProperty$2 = objectDefineProperty.f;
	var hasOwn$2 = hasOwnProperty_1;
	var wellKnownSymbol$5 = wellKnownSymbol$i;
	var TO_STRING_TAG$1 = wellKnownSymbol$5('toStringTag');

	var setToStringTag$3 = function (target, TAG, STATIC) {
	  if (target && !STATIC) target = target.prototype;

	  if (target && !hasOwn$2(target, TO_STRING_TAG$1)) {
	    defineProperty$2(target, TO_STRING_TAG$1, {
	      configurable: true,
	      value: TAG
	    });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
	var create$1 = objectCreate;
	var createPropertyDescriptor = createPropertyDescriptor$4;
	var setToStringTag$2 = setToStringTag$3;
	var Iterators$4 = iterators;

	var returnThis$1 = function () {
	  return this;
	};

	var createIteratorConstructor$1 = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = create$1(IteratorPrototype$1, {
	    next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next)
	  });
	  setToStringTag$2(IteratorConstructor, TO_STRING_TAG, false);
	  Iterators$4[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var global$7 = global$L;
	var isCallable$3 = isCallable$j;
	var String$1 = global$7.String;
	var TypeError$4 = global$7.TypeError;

	var aPossiblePrototype$1 = function (argument) {
	  if (typeof argument == 'object' || isCallable$3(argument)) return argument;
	  throw TypeError$4("Can't set " + String$1(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */
	var uncurryThis$4 = functionUncurryThis;
	var anObject$4 = anObject$f;
	var aPossiblePrototype = aPossiblePrototype$1; // `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe

	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;

	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    setter = uncurryThis$4(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) {
	    /* empty */
	  }

	  return function setPrototypeOf(O, proto) {
	    anObject$4(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var $$2 = _export;
	var call$3 = functionCall;
	var FunctionName = functionName;
	var isCallable$2 = isCallable$j;
	var createIteratorConstructor = createIteratorConstructor$1;
	var getPrototypeOf = objectGetPrototypeOf;
	var setPrototypeOf$1 = objectSetPrototypeOf;
	var setToStringTag$1 = setToStringTag$3;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$7;
	var redefine$2 = redefine$7.exports;
	var wellKnownSymbol$4 = wellKnownSymbol$i;
	var Iterators$3 = iterators;
	var IteratorsCore = iteratorsCore;
	var PROPER_FUNCTION_NAME = FunctionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
	var IteratorPrototype = IteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol$4('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () {
	  return this;
	};

	var defineIterator$2 = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];

	    switch (KIND) {
	      case KEYS:
	        return function keys() {
	          return new IteratorConstructor(this, KIND);
	        };

	      case VALUES:
	        return function values() {
	          return new IteratorConstructor(this, KIND);
	        };

	      case ENTRIES:
	        return function entries() {
	          return new IteratorConstructor(this, KIND);
	        };
	    }

	    return function () {
	      return new IteratorConstructor(this);
	    };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY; // fix native

	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));

	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
	        if (setPrototypeOf$1) {
	          setPrototypeOf$1(CurrentIteratorPrototype, IteratorPrototype);
	        } else if (!isCallable$2(CurrentIteratorPrototype[ITERATOR$4])) {
	          redefine$2(CurrentIteratorPrototype, ITERATOR$4, returnThis);
	        }
	      } // Set @@toStringTag to native iterators


	      setToStringTag$1(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  } // fix Array.prototype.{ values, @@iterator }.name in V8 / FF


	  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if (CONFIGURABLE_FUNCTION_NAME) {
	      createNonEnumerableProperty$1(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;

	      defaultIterator = function values() {
	        return call$3(nativeIterator, this);
	      };
	    }
	  } // export additional methods


	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine$2(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else $$2({
	      target: NAME,
	      proto: true,
	      forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
	    }, methods);
	  } // define iterator


	  if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    redefine$2(IterablePrototype, ITERATOR$4, defaultIterator, {
	      name: DEFAULT
	    });
	  }

	  Iterators$3[NAME] = defaultIterator;
	  return methods;
	};

	var toIndexedObject$1 = toIndexedObject$6;
	var addToUnscopables = addToUnscopables$1;
	var Iterators$2 = iterators;
	var InternalStateModule$2 = internalState;
	var defineProperty$1 = objectDefineProperty.f;
	var defineIterator$1 = defineIterator$2;
	var DESCRIPTORS = descriptors;
	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$2 = InternalStateModule$2.set;
	var getInternalState$1 = InternalStateModule$2.getterFor(ARRAY_ITERATOR); // `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator

	var es_array_iterator = defineIterator$1(Array, 'Array', function (iterated, kind) {
	  setInternalState$2(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject$1(iterated),
	    // target
	    index: 0,
	    // next index
	    kind: kind // kind

	  }); // `%ArrayIteratorPrototype%.next` method
	  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$1(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;

	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return {
	      value: undefined,
	      done: true
	    };
	  }

	  if (kind == 'keys') return {
	    value: index,
	    done: false
	  };
	  if (kind == 'values') return {
	    value: target[index],
	    done: false
	  };
	  return {
	    value: [index, target[index]],
	    done: false
	  };
	}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject

	var values = Iterators$2.Arguments = Iterators$2.Array; // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries'); // V8 ~ Chrome 45- bug

	if (DESCRIPTORS && values.name !== 'values') try {
	  defineProperty$1(values, 'name', {
	    value: 'values'
	  });
	} catch (error) {
	  /* empty */
	}

	var charAt = stringMultibyte.charAt;
	var toString = toString$a;
	var InternalStateModule$1 = internalState;
	var defineIterator = defineIterator$2;
	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$1 = InternalStateModule$1.set;
	var getInternalState = InternalStateModule$1.getterFor(STRING_ITERATOR); // `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator

	defineIterator(String, 'String', function (iterated) {
	  setInternalState$1(this, {
	    type: STRING_ITERATOR,
	    string: toString(iterated),
	    index: 0
	  }); // `%StringIteratorPrototype%.next` method
	  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return {
	    value: undefined,
	    done: true
	  };
	  point = charAt(string, index);
	  state.index += point.length;
	  return {
	    value: point,
	    done: false
	  };
	});

	var redefine$1 = redefine$7.exports;

	var redefineAll$2 = function (target, src, options) {
	  for (var key in src) redefine$1(target, key, src[key], options);

	  return target;
	};

	var internalMetadata = {exports: {}};

	var objectGetOwnPropertyNamesExternal = {};

	/* eslint-disable es/no-object-getownpropertynames -- safe */
	var classof$2 = classofRaw$1;
	var toIndexedObject = toIndexedObject$6;
	var $getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var arraySlice = arraySliceSimple;
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames(it);
	  } catch (error) {
	    return arraySlice(windowNames);
	  }
	}; // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window


	objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
	  return windowNames && classof$2(it) == 'Window' ? getWindowNames(it) : $getOwnPropertyNames(toIndexedObject(it));
	};

	var fails$3 = fails$s;
	var arrayBufferNonExtensible = fails$3(function () {
	  if (typeof ArrayBuffer == 'function') {
	    var buffer = new ArrayBuffer(8); // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe

	    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', {
	      value: 8
	    });
	  }
	});

	var fails$2 = fails$s;
	var isObject$5 = isObject$e;
	var classof$1 = classofRaw$1;
	var ARRAY_BUFFER_NON_EXTENSIBLE = arrayBufferNonExtensible; // eslint-disable-next-line es/no-object-isextensible -- safe

	var $isExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES = fails$2(function () {
	  $isExtensible(1);
	}); // `Object.isExtensible` method
	// https://tc39.es/ecma262/#sec-object.isextensible

	var objectIsExtensible = FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE ? function isExtensible(it) {
	  if (!isObject$5(it)) return false;
	  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof$1(it) == 'ArrayBuffer') return false;
	  return $isExtensible ? $isExtensible(it) : true;
	} : $isExtensible;

	var fails$1 = fails$s;
	var freezing = !fails$1(function () {
	  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var $$1 = _export;
	var uncurryThis$3 = functionUncurryThis;
	var hiddenKeys = hiddenKeys$5;
	var isObject$4 = isObject$e;
	var hasOwn$1 = hasOwnProperty_1;
	var defineProperty = objectDefineProperty.f;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertyNamesExternalModule = objectGetOwnPropertyNamesExternal;
	var isExtensible$1 = objectIsExtensible;
	var uid = uid$3;
	var FREEZING = freezing;
	var REQUIRED = false;
	var METADATA = uid('meta');
	var id$1 = 0;

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, {
	    value: {
	      objectID: 'O' + id$1++,
	      // object ID
	      weakData: {} // weak collections IDs

	    }
	  });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject$4(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;

	  if (!hasOwn$1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible$1(it)) return 'F'; // not necessary to add metadata

	    if (!create) return 'E'; // add missing metadata

	    setMetadata(it); // return object ID
	  }

	  return it[METADATA].objectID;
	};

	var getWeakData$1 = function (it, create) {
	  if (!hasOwn$1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible$1(it)) return true; // not necessary to add metadata

	    if (!create) return false; // add missing metadata

	    setMetadata(it); // return the store of weak collections IDs
	  }

	  return it[METADATA].weakData;
	}; // add metadata on freeze-family methods calling


	var onFreeze = function (it) {
	  if (FREEZING && REQUIRED && isExtensible$1(it) && !hasOwn$1(it, METADATA)) setMetadata(it);
	  return it;
	};

	var enable = function () {
	  meta.enable = function () {
	    /* empty */
	  };

	  REQUIRED = true;
	  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
	  var splice = uncurryThis$3([].splice);
	  var test = {};
	  test[METADATA] = 1; // prevent exposing of metadata key

	  if (getOwnPropertyNames(test).length) {
	    getOwnPropertyNamesModule.f = function (it) {
	      var result = getOwnPropertyNames(it);

	      for (var i = 0, length = result.length; i < length; i++) {
	        if (result[i] === METADATA) {
	          splice(result, i, 1);
	          break;
	        }
	      }

	      return result;
	    };

	    $$1({
	      target: 'Object',
	      stat: true,
	      forced: true
	    }, {
	      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
	    });
	  }
	};

	var meta = internalMetadata.exports = {
	  enable: enable,
	  fastKey: fastKey,
	  getWeakData: getWeakData$1,
	  onFreeze: onFreeze
	};
	hiddenKeys[METADATA] = true;

	var wellKnownSymbol$3 = wellKnownSymbol$i;
	var Iterators$1 = iterators;
	var ITERATOR$3 = wellKnownSymbol$3('iterator');
	var ArrayPrototype = Array.prototype; // check on default Array iterator

	var isArrayIteratorMethod$1 = function (it) {
	  return it !== undefined && (Iterators$1.Array === it || ArrayPrototype[ITERATOR$3] === it);
	};

	var classof = classof$a;
	var getMethod$1 = getMethod$6;
	var Iterators = iterators;
	var wellKnownSymbol$2 = wellKnownSymbol$i;
	var ITERATOR$2 = wellKnownSymbol$2('iterator');

	var getIteratorMethod$2 = function (it) {
	  if (it != undefined) return getMethod$1(it, ITERATOR$2) || getMethod$1(it, '@@iterator') || Iterators[classof(it)];
	};

	var global$6 = global$L;
	var call$2 = functionCall;
	var aCallable = aCallable$4;
	var anObject$3 = anObject$f;
	var tryToString$1 = tryToString$4;
	var getIteratorMethod$1 = getIteratorMethod$2;
	var TypeError$3 = global$6.TypeError;

	var getIterator$1 = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
	  if (aCallable(iteratorMethod)) return anObject$3(call$2(iteratorMethod, argument));
	  throw TypeError$3(tryToString$1(argument) + ' is not iterable');
	};

	var call$1 = functionCall;
	var anObject$2 = anObject$f;
	var getMethod = getMethod$6;

	var iteratorClose$1 = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$2(iterator);

	  try {
	    innerResult = getMethod(iterator, 'return');

	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }

	    innerResult = call$1(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }

	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject$2(innerResult);
	  return value;
	};

	var global$5 = global$L;
	var bind = functionBindContext;
	var call = functionCall;
	var anObject$1 = anObject$f;
	var tryToString = tryToString$4;
	var isArrayIteratorMethod = isArrayIteratorMethod$1;
	var lengthOfArrayLike = lengthOfArrayLike$7;
	var isPrototypeOf$1 = objectIsPrototypeOf;
	var getIterator = getIterator$1;
	var getIteratorMethod = getIteratorMethod$2;
	var iteratorClose = iteratorClose$1;
	var TypeError$2 = global$5.TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate$2 = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = bind(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject$1(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    }

	    return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw TypeError$2(tryToString(iterable) + ' is not iterable'); // optimisation for array iterators

	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && isPrototypeOf$1(ResultPrototype, result)) return result;
	      }

	      return new Result(false);
	    }

	    iterator = getIterator(iterable, iterFn);
	  }

	  next = iterator.next;

	  while (!(step = call(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose(iterator, 'throw', error);
	    }

	    if (typeof result == 'object' && result && isPrototypeOf$1(ResultPrototype, result)) return result;
	  }

	  return new Result(false);
	};

	var global$4 = global$L;
	var isPrototypeOf = objectIsPrototypeOf;
	var TypeError$1 = global$4.TypeError;

	var anInstance$2 = function (it, Prototype) {
	  if (isPrototypeOf(Prototype, it)) return it;
	  throw TypeError$1('Incorrect invocation');
	};

	var wellKnownSymbol$1 = wellKnownSymbol$i;
	var ITERATOR$1 = wellKnownSymbol$1('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return {
	        done: !!called++
	      };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };

	  iteratorWithReturn[ITERATOR$1] = function () {
	    return this;
	  }; // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing


	  Array.from(iteratorWithReturn, function () {
	    throw 2;
	  });
	} catch (error) {
	  /* empty */
	}

	var checkCorrectnessOfIteration$1 = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;

	  try {
	    var object = {};

	    object[ITERATOR$1] = function () {
	      return {
	        next: function () {
	          return {
	            done: ITERATION_SUPPORT = true
	          };
	        }
	      };
	    };

	    exec(object);
	  } catch (error) {
	    /* empty */
	  }

	  return ITERATION_SUPPORT;
	};

	var isCallable$1 = isCallable$j;
	var isObject$3 = isObject$e;
	var setPrototypeOf = objectSetPrototypeOf; // makes subclassing work correct for wrapped built-ins

	var inheritIfRequired$1 = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if ( // it can work only with native `setPrototypeOf`
	  setPrototypeOf && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	  isCallable$1(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject$3(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) setPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var $ = _export;
	var global$3 = global$L;
	var uncurryThis$2 = functionUncurryThis;
	var isForced = isForced_1;
	var redefine = redefine$7.exports;
	var InternalMetadataModule$1 = internalMetadata.exports;
	var iterate$1 = iterate$2;
	var anInstance$1 = anInstance$2;
	var isCallable = isCallable$j;
	var isObject$2 = isObject$e;
	var fails = fails$s;
	var checkCorrectnessOfIteration = checkCorrectnessOfIteration$1;
	var setToStringTag = setToStringTag$3;
	var inheritIfRequired = inheritIfRequired$1;

	var collection$1 = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global$3[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var uncurriedNativeMethod = uncurryThis$2(NativePrototype[KEY]);
	    redefine(NativePrototype, KEY, KEY == 'add' ? function add(value) {
	      uncurriedNativeMethod(this, value === 0 ? 0 : value);
	      return this;
	    } : KEY == 'delete' ? function (key) {
	      return IS_WEAK && !isObject$2(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	    } : KEY == 'get' ? function get(key) {
	      return IS_WEAK && !isObject$2(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	    } : KEY == 'has' ? function has(key) {
	      return IS_WEAK && !isObject$2(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	    } : function set(key, value) {
	      uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
	      return this;
	    });
	  };

	  var REPLACE = isForced(CONSTRUCTOR_NAME, !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	    new NativeConstructor().entries().next();
	  })));

	  if (REPLACE) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    InternalMetadataModule$1.enable();
	  } else if (isForced(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor(); // early implementations not supports chaining

	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance; // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false

	    var THROWS_ON_PRIMITIVES = fails(function () {
	      instance.has(1);
	    }); // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new -- required for testing

	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) {
	      new NativeConstructor(iterable);
	    }); // for early implementations -0 and +0 not the same

	    var BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;

	      while (index--) $instance[ADDER](index, index);

	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance$1(dummy, NativePrototype);
	        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
	        if (iterable != undefined) iterate$1(iterable, that[ADDER], {
	          that: that,
	          AS_ENTRIES: IS_MAP
	        });
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER); // weak collections should not contains .clear method

	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  $({
	    global: true,
	    forced: Constructor != NativeConstructor
	  }, exported);
	  setToStringTag(Constructor, CONSTRUCTOR_NAME);
	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);
	  return Constructor;
	};

	var uncurryThis$1 = functionUncurryThis;
	var redefineAll$1 = redefineAll$2;
	var getWeakData = internalMetadata.exports.getWeakData;
	var anObject = anObject$f;
	var isObject$1 = isObject$e;
	var anInstance = anInstance$2;
	var iterate = iterate$2;
	var ArrayIterationModule = arrayIteration;
	var hasOwn = hasOwnProperty_1;
	var InternalStateModule = internalState;
	var setInternalState = InternalStateModule.set;
	var internalStateGetterFor = InternalStateModule.getterFor;
	var find = ArrayIterationModule.find;
	var findIndex = ArrayIterationModule.findIndex;
	var splice = uncurryThis$1([].splice);
	var id = 0; // fallback for uncaught frozen keys

	var uncaughtFrozenStore = function (store) {
	  return store.frozen || (store.frozen = new UncaughtFrozenStore());
	};

	var UncaughtFrozenStore = function () {
	  this.entries = [];
	};

	var findUncaughtFrozen = function (store, key) {
	  return find(store.entries, function (it) {
	    return it[0] === key;
	  });
	};

	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;else this.entries.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = findIndex(this.entries, function (it) {
	      return it[0] === key;
	    });
	    if (~index) splice(this.entries, index, 1);
	    return !!~index;
	  }
	};
	var collectionWeak$1 = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var Constructor = wrapper(function (that, iterable) {
	      anInstance(that, Prototype);
	      setInternalState(that, {
	        type: CONSTRUCTOR_NAME,
	        id: id++,
	        frozen: undefined
	      });
	      if (iterable != undefined) iterate(iterable, that[ADDER], {
	        that: that,
	        AS_ENTRIES: IS_MAP
	      });
	    });
	    var Prototype = Constructor.prototype;
	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var data = getWeakData(anObject(key), true);
	      if (data === true) uncaughtFrozenStore(state).set(key, value);else data[state.id] = value;
	      return that;
	    };

	    redefineAll$1(Prototype, {
	      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
	      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
	      'delete': function (key) {
	        var state = getInternalState(this);
	        if (!isObject$1(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
	        return data && hasOwn(data, state.id) && delete data[state.id];
	      },
	      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
	      // https://tc39.es/ecma262/#sec-weakset.prototype.has
	      has: function has(key) {
	        var state = getInternalState(this);
	        if (!isObject$1(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state).has(key);
	        return data && hasOwn(data, state.id);
	      }
	    });
	    redefineAll$1(Prototype, IS_MAP ? {
	      // `WeakMap.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
	      get: function get(key) {
	        var state = getInternalState(this);

	        if (isObject$1(key)) {
	          var data = getWeakData(key);
	          if (data === true) return uncaughtFrozenStore(state).get(key);
	          return data ? data[state.id] : undefined;
	        }
	      },
	      // `WeakMap.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
	      set: function set(key, value) {
	        return define(this, key, value);
	      }
	    } : {
	      // `WeakSet.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-weakset.prototype.add
	      add: function add(value) {
	        return define(this, value, true);
	      }
	    });
	    return Constructor;
	  }
	};

	var global$2 = global$L;
	var uncurryThis = functionUncurryThis;
	var redefineAll = redefineAll$2;
	var InternalMetadataModule = internalMetadata.exports;
	var collection = collection$1;
	var collectionWeak = collectionWeak$1;
	var isObject = isObject$e;
	var isExtensible = objectIsExtensible;
	var enforceInternalState = internalState.enforce;
	var NATIVE_WEAK_MAP = nativeWeakMap;
	var IS_IE11 = !global$2.ActiveXObject && 'ActiveXObject' in global$2;
	var InternalWeakMap;

	var wrapper = function (init) {
	  return function WeakMap() {
	    return init(this, arguments.length ? arguments[0] : undefined);
	  };
	}; // `WeakMap` constructor
	// https://tc39.es/ecma262/#sec-weakmap-constructor


	var $WeakMap = collection('WeakMap', wrapper, collectionWeak); // IE11 WeakMap frozen keys fix
	// We can't use feature detection because it crash some old IE builds
	// https://github.com/zloirock/core-js/issues/485

	if (NATIVE_WEAK_MAP && IS_IE11) {
	  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
	  InternalMetadataModule.enable();
	  var WeakMapPrototype = $WeakMap.prototype;
	  var nativeDelete = uncurryThis(WeakMapPrototype['delete']);
	  var nativeHas = uncurryThis(WeakMapPrototype.has);
	  var nativeGet = uncurryThis(WeakMapPrototype.get);
	  var nativeSet = uncurryThis(WeakMapPrototype.set);
	  redefineAll(WeakMapPrototype, {
	    'delete': function (key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceInternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeDelete(this, key) || state.frozen['delete'](key);
	      }

	      return nativeDelete(this, key);
	    },
	    has: function has(key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceInternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas(this, key) || state.frozen.has(key);
	      }

	      return nativeHas(this, key);
	    },
	    get: function get(key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceInternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
	      }

	      return nativeGet(this, key);
	    },
	    set: function set(key, value) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceInternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
	      } else nativeSet(this, key, value);

	      return this;
	    }
	  });
	}

	var global$1 = global$L;
	var DOMIterables = domIterables;
	var DOMTokenListPrototype = domTokenListPrototype;
	var ArrayIteratorMethods = es_array_iterator;
	var createNonEnumerableProperty = createNonEnumerableProperty$7;
	var wellKnownSymbol = wellKnownSymbol$i;
	var ITERATOR = wellKnownSymbol('iterator');
	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var ArrayValues = ArrayIteratorMethods.values;

	var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR] = ArrayValues;
	    }

	    if (!CollectionPrototype[TO_STRING_TAG]) {
	      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
	    }

	    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
	      }
	    }
	  }
	};

	for (var COLLECTION_NAME in DOMIterables) {
	  handlePrototype(global$1[COLLECTION_NAME] && global$1[COLLECTION_NAME].prototype, COLLECTION_NAME);
	}

	handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

	
	var _options = /*#__PURE__*/new WeakMap();

	var _elementId = /*#__PURE__*/new WeakMap();

	var Tip = /*#__PURE__*/function () {
	  	  function Tip(elementId, content, global) {
	    _classCallCheck(this, Tip);

	    _classPrivateFieldInitSpec(this, _options, {
	      writable: true,
	      value: void 0
	    });

	    _classPrivateFieldInitSpec(this, _elementId, {
	      writable: true,
	      value: void 0
	    });

	    global = global == undefined ? false : global;

	    if (global) {
	      // create global Tip class object without mouse listeners
	      _classPrivateFieldSet(this, _options, globalOptions$1);
	    } else {
	      content = content == undefined ? '' : content;
	      var targetElement = document.getElementById(elementId);

	      if (targetElement == undefined) {
	        throw new Error("There is no element in the DOM with an id of: ".concat(elementId));
	      }

	      _classPrivateFieldSet(this, _options, Object.assign({}, globalOptions$1));

	      _classPrivateFieldSet(this, _elementId, elementId);

	      var className = targetElement.getAttribute('class') == null ? '' : targetElement.getAttribute('class');
	      targetElement.setAttribute('class', className + ' fxToolTipTarget');

	      if (targetElement.addEventListener) {
	        targetElement.addEventListener('mouseover', mouseOver, false);
	        targetElement.addEventListener('mouseout', mouseOut, false);
	        targetElement.addEventListener('mousemove', mouseMove, false);
	      } else {
	        targetElement.onmouseover = mouseOver;
	        targetElement.onmouseout = mouseOut;
	        targetElement.onmousemove = mouseMove;
	      }
	      this.content(content);
	    }
	  }
	  

	  _createClass(Tip, [{
	    key: "content",
	    value: function content(_content) {
	      if (_content == undefined) {
	        return _classPrivateFieldGet(this, _options).content;
	      }
	      _classPrivateFieldGet(this, _options).content = _content;

	      if (beforeRule.opacity == _classPrivateFieldGet(this, _options).backgroundOpacity) {
	        // inject new content while tip is shown
	        applyOptions(this);
	      }
	      return this;
	    }
	    
	  }, {
	    key: "orientation",
	    value: function orientation(_orientation) {
	      if (_orientation == undefined) {
	        return _classPrivateFieldGet(this, _options).orientation;
	      }

	      if (['left', 'right', 'top', 'bottom'].indexOf(_orientation) == -1) {
	        console.log("Option setting error. Orientation must be one of ['left' | 'right' | 'top' | 'bottom']");
	      } else {
	        _classPrivateFieldGet(this, _options).orientation = _orientation; //this.#options.autoPosition = false; //autoPosition;            
	      }
	      return this;
	    }
	    
	  }, {
	    key: "preferredOrientation",
	    value: function preferredOrientation(_preferredOrientation) {
	      if (_preferredOrientation == undefined) {
	        return _classPrivateFieldGet(this, _options).preferredOrientation;
	      }

	      if (['left', 'right', 'top', 'bottom', 'none'].indexOf(_preferredOrientation) == -1) {
	        console.log("Option setting error. preferredOrientation must be one of ['left' | 'right' | 'top' | 'bottom' | 'none']");
	      } else {
	        _classPrivateFieldGet(this, _options).preferredOrientation = _preferredOrientation;
	      }
	      return this;
	    }
	    
	  }, {
	    key: "autoPosition",
	    value: function autoPosition(_autoPosition) {
	      if (_autoPosition == undefined) {
	        return _classPrivateFieldGet(this, _options).autoPosition;
	      }

	      if (checkBoolean(_autoPosition, 'autoPosition')) {
	        _classPrivateFieldGet(this, _options).autoPosition = _autoPosition;
	      }

	      return this;
	    }
	    
	  }, {
	    key: "autoSize",
	    value: function autoSize(_autoSize) {
	      if (_autoSize == undefined) {
	        return _classPrivateFieldGet(this, _options).autoSize;
	      }

	      if (checkBoolean(_autoSize, 'autoSize')) {
	        _classPrivateFieldGet(this, _options).autoSize = _autoSize;

	        if (_autoSize == true) {
	          _classPrivateFieldGet(this, _options).width = 'auto';
	          _classPrivateFieldGet(this, _options).height = 'auto';
	        }
	      }
	      return this;
	    }
	    
	  }, {
	    key: "mousePoint",
	    value: function mousePoint(_mousePoint) {
	      if (_mousePoint == undefined) {
	        return _classPrivateFieldGet(this, _options).mousePoint;
	      }

	      if (checkBoolean(_mousePoint, 'mousePoint')) {
	        _classPrivateFieldGet(this, _options).mousePoint = _mousePoint;
	      }
	      return this;
	    }
	    
	  }, {
	    key: "trackMouse",
	    value: function trackMouse(_trackMouse) {
	      if (_trackMouse == undefined) {
	        return _classPrivateFieldGet(this, _options).trackMouse;
	      }

	      if (checkBoolean(_trackMouse, 'trackMouse')) {
	        _classPrivateFieldGet(this, _options).trackMouse = _trackMouse;
	        _classPrivateFieldGet(this, _options).mousePoint = _trackMouse;
	      }
	      return this;
	    }
	    
	  }, {
	    key: "cursor",
	    value: function cursor(_cursor) {
	      if (_cursor == undefined) {
	        return _classPrivateFieldGet(this, _options).cursor;
	      }

	      if (['auto', 'default', 'none', 'context-menu', 'help', 'pointer', 'progress', 'wait', 'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy', 'move', 'no-drop', 'not-allowed', 'e-resize', 'n-resize', 'ne-resize', 'nw-resize', 's-resize', 'se-resize', 'sw-resize', 'w-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'col-resize', 'row-resize', 'all-scroll', 'zoom-in', 'zoom-out', 'grab', 'grabbing'].indexOf(_cursor) == -1) {
	        console.log("Option setting error. cursor must be one of ['auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing']");
	      } else {
	        _classPrivateFieldGet(this, _options).cursor = _cursor;
	      }
	      return this;
	    }
	    
	  }, {
	    key: "font",
	    value: function font(family, size) {
	      if (arguments.length == 0) {
	        return {
	          family: _classPrivateFieldGet(this, _options).fontFamily,
	          size: _classPrivateFieldGet(this, _options).fontSize
	        };
	      }

	      if (arguments.length == 1) {
	        size = '1em';
	      }

	      if (typeof size == 'number') {
	        size += 'px';
	      }

	      if (checkFontFamily(family) && checkSize(size)) {
	        _classPrivateFieldGet(this, _options).fontFamily = family;
	        _classPrivateFieldGet(this, _options).fontSize = size; //parseSize(size);            
	      }
	      return this;
	    }
	    
	  }, {
	    key: "foregroundColor",
	    value: function foregroundColor(_foregroundColor) {
	      if (_foregroundColor == undefined) {
	        return _classPrivateFieldGet(this, _options).foregroundColor;
	      }

	      if (checkCSS('color', _foregroundColor)) {
	        _classPrivateFieldGet(this, _options).foregroundColor = _foregroundColor;
	      }
	      return this;
	    }
	    
	  }, {
	    key: "backgroundColor",
	    value: function backgroundColor(_backgroundColor) {
	      if (_backgroundColor == undefined) {
	        return _classPrivateFieldGet(this, _options).backgroundColor;
	      }

	      if (checkCSS('background-color', _backgroundColor)) {
	        _classPrivateFieldGet(this, _options).backgroundColor = _backgroundColor;
	      }
	      return this;
	    }
	    
	  }, {
	    key: "backgroundOpacity",
	    value: function backgroundOpacity(_backgroundOpacity) {
	      if (_backgroundOpacity == undefined) {
	        return _classPrivateFieldGet(this, _options).backgroundOpacity;
	      }

	      if (checkCSS('opacity', _backgroundOpacity)) {
	        _classPrivateFieldGet(this, _options).backgroundOpacity = _backgroundOpacity;
	      }
	      return this;
	    }
	    
	  }, {
	    key: "padding",
	    value: function padding(_padding) {
	      var _this = this;

	      if (_padding == undefined) {
	        return _classPrivateFieldGet(this, _options).padding;
	      }
	      // let size1;

	      var tmpPadding;
	      _padding = _padding.split(' ', 4);

	      _padding.forEach(function (d) {
	        if (typeof d == 'number') {
	          d += 'px';
	        }
	        if (!checkSize(d)) return _this;
	      });

	      switch (_padding.length) {
	        case 0:
	          {
	            return _classPrivateFieldGet(this, _options).padding;
	          }

	        case 1:
	          {
	            // size0 = parseSize(padding[0]);
	            // tmpPadding = size0 + 'px ' + size0 + 'px ' + size0 + 'px ' + size0 + 'px';
	            tmpPadding = "".concat(_padding[0], " ").concat(_padding[0], " ").concat(_padding[0], " ").concat(_padding[0]);
	            break;
	          }

	        case 2:
	          {
	            // size0 = parseSize(padding[0]);
	            // size1 = parseSize(padding[1]);
	            // tmpPadding = size0 + 'px ' + size1 + 'px ' + size0 + 'px ' + size1 + 'px';
	            tmpPadding = "".concat(_padding[0], " ").concat(_padding[1], " ").concat(_padding[0], " ").concat(_padding[1]);
	            break;
	          }

	        case 3:
	          {
	            // size0 = parseSize(padding[1]);
	            // tmpPadding = parseSize(padding[0]) + 'px ' + size0 + 'px ' + parseSize(padding[2]) + 'px ' + size0 + 'px';
	            tmpPadding = "".concat(_padding[0], " ").concat(_padding[1], " ").concat(_padding[2], " ").concat(_padding[1]);
	            break;
	          }

	        case 4:
	          {
	            // tmpPadding = parseSize(padding[0]) + 'px ' + parseSize(padding[1]) + 'px ' + parseSize(padding[2]) + 'px ' + parseSize(padding[3]) + 'px';
	            tmpPadding = "".concat(_padding[0], " ").concat(_padding[1], " ").concat(_padding[2], " ").concat(_padding[3]);
	            break;
	          }
	      }

	      if (checkCSS('padding', tmpPadding)) {
	        _classPrivateFieldGet(this, _options).padding = tmpPadding;
	      }
	      return this;
	    }
	    
	  }, {
	    key: "borderRadius",
	    value: function borderRadius(_borderRadius) {
	      if (_borderRadius == undefined) {
	        return _classPrivateFieldGet(this, _options).borderRadius;
	      }

	      if (typeof _borderRadius == 'number') {
	        _borderRadius += 'px';
	      }

	      if (checkSize(_borderRadius)) {
	        _classPrivateFieldGet(this, _options).borderRadius = _borderRadius;
	      } // this.#options.borderRadius = parseSize(borderRadius);


	      return this;
	    }
	    
	  }, {
	    key: "boxShadow",
	    value: function boxShadow(size, color, opacity) {
	      if (arguments.length == 0) {
	        return _classPrivateFieldGet(this, _options).boxShadow;
	      }
	      var parsedColor;
	      var boxShadowString;
	      var rgbCore;

	      if (arguments[0] == 'none') {
	        _classPrivateFieldGet(this, _options).boxShadow = '';
	      } else {
	        if (typeof size == 'number') {
	          size += 'px';
	        }

	        if (checkSize(size) && checkCSS(color, 'color') && checkCSS(opacity, 'opacity')) {
	          // parsedSize = parseSize(size);
	          parsedColor = parseColor(color);

	          if (opacity !== 0) {
	            rgbCore = parsedColor.match(/\d+/g); // boxShadowString = 'rgba(' + parseInt(rgbCore[0]) + ',' + parseInt(rgbCore[1]) + ',' + parseInt(rgbCore[2]) + ',' + opacity + ')';

	            boxShadowString = "rgba(".concat(parseInt(rgbCore[0], 10), ", ").concat(parseInt(rgbCore[1], 10), ", ").concat(parseInt(rgbCore[2], 10), ", ").concat(opacity, ")");
	          } else {
	            boxShadowString = parsedColor;
	          }

	          _classPrivateFieldGet(this, _options).boxShadow = "".concat(size, " ").concat(size, " ").concat(size, " 0 ").concat(boxShadowString);
	        }
	      }
	      return this;
	    }
	    
	  }, {
	    key: "transitionVisible",
	    value: function transitionVisible(delay, duration) {
	      if (arguments.length == 0) {
	        return _classPrivateFieldGet(this, _options).transitionVisible;
	      }

	      if (typeof delay != 'number' && typeof duration != 'number') {
	        console.log("Option setting error. Either ".concat(delay, " and/or ").concat(duration, " are not a valid arguments"));
	      } else {
	        // this.#options.transitionVisible = 'opacity ' + duration + 's ease-in ' + delay + 's';
	        _classPrivateFieldGet(this, _options).transitionVisible = "opacity ".concat(duration, "s ease-in ").concat(delay, "s");
	      }
	      return this;
	    }
	    
	  }, {
	    key: "transitionHidden",
	    value: function transitionHidden(delay, duration) {
	      if (arguments.length == 0) {
	        return _classPrivateFieldGet(this, _options).transitionHidden;
	      }

	      if (typeof delay != 'number' && typeof duration != 'number') {
	        console.log("Option setting error. Either ".concat(delay, " and/or ").concat(duration, " are not a valid arguments"));
	      } else {
	        // this.#options.transitionHidden = 'opacity ' + duration + 's ease-out ' + delay + 's';
	        _classPrivateFieldGet(this, _options).transitionHidden = "opacity ".concat(duration, "s ease-out ").concat(delay, "s");
	      }
	      return this;
	    }
	    
	  }, {
	    key: "arrowSize",
	    value: function arrowSize(_arrowSize) {
	      if (_arrowSize == undefined) {
	        return _classPrivateFieldGet(this, _options).arrowSize;
	      }

	      if (typeof _arrowSize == 'number') {
	        _arrowSize += 'px';
	      }

	      if (checkSize(_arrowSize)) {
	        // this.#options.arrowSize = parseSize(arrowSize); 
	        _classPrivateFieldGet(this, _options).arrowSize = _arrowSize;
	      }
	      return this;
	    }
	    
	  }, {
	    key: "width",
	    value: function width(_width) {
	      if (_width == undefined) {
	        return _classPrivateFieldGet(this, _options).width;
	      }

	      if (typeof _width == 'number') {
	        _width += 'px';
	      }

	      if (_width == 'auto' || checkSize(_width)) {
	        _classPrivateFieldGet(this, _options).width = _width;
	      }

	      _classPrivateFieldGet(this, _options).autoSize = _width == 'auto' ? _classPrivateFieldGet(this, _options).autoSize : false;
	      return this;
	    }
	    
	  }, {
	    key: "maxWidth",
	    value: function maxWidth(_maxWidth) {
	      if (_maxWidth == undefined) {
	        return _classPrivateFieldGet(this, _options).maxWidth;
	      }

	      if (typeof _maxWidth == 'number') {
	        _maxWidth += 'px';
	      }

	      if (_maxWidth == 'none' || checkSize(_maxWidth)) {
	        _classPrivateFieldGet(this, _options).maxWidth = _maxWidth;
	      }

	      return this;
	    }
	    
	  }, {
	    key: "minWidth",
	    value: function minWidth(_minWidth) {
	      if (_minWidth == undefined) {
	        return _classPrivateFieldGet(this, _options).minWidth;
	      }

	      if (typeof _minWidth == 'number') {
	        _minWidth += 'px';
	      }

	      if (_minWidth == 'auto' || checkSize(_minWidth)) {
	        _classPrivateFieldGet(this, _options).minWidth = _minWidth;
	      }

	      return this;
	    }
	    
	  }, {
	    key: "height",
	    value: function height(_height) {
	      if (_height == undefined) {
	        return _classPrivateFieldGet(this, _options).height;
	      }

	      if (typeof _height == 'number') {
	        _height += 'px';
	      }

	      if (_height == 'auto' || checkSize(_height)) {
	        _classPrivateFieldGet(this, _options).height = _height;
	      }

	      _classPrivateFieldGet(this, _options).autoSize = _height == 'auto' ? options.autoSize : false;
	      return this;
	    }
	    
	  }, {
	    key: "maxHeight",
	    value: function maxHeight(_maxHeight) {
	      if (_maxHeight == undefined) {
	        return _classPrivateFieldGet(this, _options).maxHeight;
	      }

	      if (typeof _maxHeight == 'number') {
	        _maxHeight += 'px';
	      }

	      if (_maxHeight == 'none' || checkSize(_maxHeight)) {
	        _classPrivateFieldGet(this, _options).maxHeight = _maxHeight;
	      }

	      return this;
	    }
	    
	  }, {
	    key: "minHeight",
	    value: function minHeight(_minHeight) {
	      if (_minHeight == undefined) {
	        return _classPrivateFieldGet(this, _options).minHeight;
	      }

	      if (typeof _minHeight == 'number') {
	        _minHeight += 'px';
	      }

	      if (_minHeight == 'auto' || checkSize(_minHeight)) {
	        _classPrivateFieldGet(this, _options).minHeight = _minHeight;
	      }

	      return this;
	    }
	    
	  }, {
	    key: "remove",
	    value: function remove() {
	      	      var targetElement = document.getElementById(_classPrivateFieldGet(this, _elementId));

	      if (targetElement != undefined) {
	        var className = targetElement.getAttribute('class') == null ? '' : targetElement.getAttribute('class');
	        className = className.replace(' fxToolTipTarget', '');
	        targetElement.setAttribute('class', className);
	        
	        if (targetElement.removeEventListener) {
	          targetElement.removeEventListener('mouseover', mouseOver);
	          targetElement.removeEventListener('mouseout', mouseOut);
	          targetElement.removeEventListener('mousemove', mouseMove);
	        } else {
	          targetElement.onmousemove = null;
	          targetElement.onmouseover = null;
	          targetElement.onmouseout = null;
	        }
	      }
	      var tipIndex = tipsIndex.indexOf(_classPrivateFieldGet(this, _elementId));

	      if (tipIndex != -1) {
	        tips.splice(tipIndex, 1);
	        tipsIndex.splice(tipIndex, 1);

	        if (tips.length == 0) {
	          closeDown();
	        }
	      }
	    }
	  }]);

	  return Tip;
	}();

	
	var DOMchecking = true;
	
	var targetTimerInterval = 500;
	
	var targetTimer;
	
	function create(elementId, content) {
	  if (document.getElementById(elementId) == null) {
	    return;
	  }
	  content = content == undefined ? '' : content;
	  var index = tipsIndex.indexOf(elementId);

	  if (index !== -1) {
	    tips[index].remove();
	  }
	  var newTip = new Tip(elementId, content);
	  tips.push(newTip);
	  tipsIndex.push(elementId);

	  if (targetTimer == undefined && DOMchecking) {
	    targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
	  }
	  return tips[tips.length - 1];
	}
	
	function remove(elementId) {
	  if (document.getElementById(elementId) == null) {
	    return;
	  }
	  var index = tipsIndex.indexOf(elementId);
	  if (index !== -1) tips[index].remove();
	}
	
	function checkDOM(checkDOM) {
	  if (checkDOM == undefined) return DOMchecking;

	  if (checkBoolean(checkDOM)) {
	    DOMchecking = checkDOM;

	    if (DOMchecking) {
	      targetTimer = window.setInterval(detectTargetRemoval, targetTimerInterval);
	    } else {
	      window.clearInterval(targetTimer);
	    }
	  }
	}
	
	function detectTargetRemoval() {
	  tipsIndex.forEach(function (thisTip, i) {
	    if (document.getElementById(thisTip) == null) {
	      tips[i].remove();
	    }
	  });
	}

		setUp();
	var globalOptions = new Tip('', '', true);
	
	var index = {
	  create: create,
	  remove: remove,
	  getTipByElementId: getTipByElementId,
	  globalOptions: globalOptions,
	  suspend: suspend,
	  checkDOM: checkDOM
	};

	return index;

})();
