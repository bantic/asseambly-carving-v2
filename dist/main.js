/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/assemblyscript/lib/loader/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/assemblyscript/lib/loader/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// Runtime header offsets\nconst ID_OFFSET = -8;\nconst SIZE_OFFSET = -4;\n\n// Runtime ids\nconst ARRAYBUFFER_ID = 0;\nconst STRING_ID = 1;\nconst ARRAYBUFFERVIEW_ID = 2;\n\n// Runtime type information\nconst ARRAYBUFFERVIEW = 1 << 0;\nconst ARRAY = 1 << 1;\nconst SET = 1 << 2;\nconst MAP = 1 << 3;\nconst VAL_ALIGN = 1 << 5;\nconst VAL_SIGNED = 1 << 10;\nconst VAL_FLOAT = 1 << 11;\nconst VAL_NULLABLE = 1 << 12;\nconst VAL_MANAGED = 1 << 13;\nconst KEY_ALIGN = 1 << 14;\nconst KEY_SIGNED = 1 << 19;\nconst KEY_FLOAT = 1 << 20;\nconst KEY_NULLABLE = 1 << 21;\nconst KEY_MANAGED = 1 << 22;\n\n// Array(BufferView) layout\nconst ARRAYBUFFERVIEW_BUFFER_OFFSET = 0;\nconst ARRAYBUFFERVIEW_DATASTART_OFFSET = 4;\nconst ARRAYBUFFERVIEW_DATALENGTH_OFFSET = 8;\nconst ARRAYBUFFERVIEW_SIZE = 12;\nconst ARRAY_LENGTH_OFFSET = 12;\nconst ARRAY_SIZE = 16;\n\nconst BIGINT = typeof BigUint64Array !== \"undefined\";\nconst THIS = Symbol();\nconst CHUNKSIZE = 1024;\n\n/** Gets a string from an U32 and an U16 view on a memory. */\nfunction getStringImpl(U32, U16, ref) {\n  var length = U32[(ref + SIZE_OFFSET) >>> 2] >>> 1;\n  var offset = ref >>> 1;\n  if (length <= CHUNKSIZE) return String.fromCharCode.apply(String, U16.subarray(offset, offset + length));\n  const parts = [];\n  do {\n    const last = U16[offset + CHUNKSIZE - 1];\n    const size = last >= 0xD800 && last < 0xDC00 ? CHUNKSIZE - 1 : CHUNKSIZE;\n    parts.push(String.fromCharCode.apply(String, U16.subarray(offset, offset += size)));\n    length -= size;\n  } while (length > CHUNKSIZE);\n  return parts.join(\"\") + String.fromCharCode.apply(String, U16.subarray(offset, offset + length));\n}\n\n/** Prepares the base module prior to instantiation. */\nfunction preInstantiate(imports) {\n  const baseModule = {};\n\n  function getString(memory, ref) {\n    if (!memory) return \"<yet unknown>\";\n    const buffer = memory.buffer;\n    return getStringImpl(new Uint32Array(buffer), new Uint16Array(buffer), ref);\n  }\n\n  // add common imports used by stdlib for convenience\n  const env = (imports.env = imports.env || {});\n  env.abort = env.abort || function abort(mesg, file, line, colm) {\n    const memory = baseModule.memory || env.memory; // prefer exported, otherwise try imported\n    throw Error(\"abort: \" + getString(memory, mesg) + \" at \" + getString(memory, file) + \":\" + line + \":\" + colm);\n  }\n  env.trace = env.trace || function trace(mesg, n) {\n    const memory = baseModule.memory || env.memory;\n    console.log(\"trace: \" + getString(memory, mesg) + (n ? \" \" : \"\") + Array.prototype.slice.call(arguments, 2, 2 + n).join(\", \"));\n  }\n  imports.Math = imports.Math || Math;\n  imports.Date = imports.Date || Date;\n\n  return baseModule;\n}\n\n/** Prepares the final module once instantiation is complete. */\nfunction postInstantiate(baseModule, instance) {\n  const rawExports = instance.exports;\n  const memory = rawExports.memory;\n  const table = rawExports.table;\n  const alloc = rawExports[\"__alloc\"];\n  const retain = rawExports[\"__retain\"];\n  const rttiBase = rawExports[\"__rtti_base\"] || ~0; // oob if not present\n\n  // Provide views for all sorts of basic values\n  var buffer, I8, U8, I16, U16, I32, U32, F32, F64, I64, U64;\n\n  /** Updates memory views if memory has grown meanwhile. */\n  function checkMem() {\n    // see: https://github.com/WebAssembly/design/issues/1210\n    if (buffer !== memory.buffer) {\n      buffer = memory.buffer;\n      I8  = new Int8Array(buffer);\n      U8  = new Uint8Array(buffer);\n      I16 = new Int16Array(buffer);\n      U16 = new Uint16Array(buffer);\n      I32 = new Int32Array(buffer);\n      U32 = new Uint32Array(buffer);\n      if (BIGINT) {\n        I64 = new BigInt64Array(buffer);\n        U64 = new BigUint64Array(buffer);\n      }\n      F32 = new Float32Array(buffer);\n      F64 = new Float64Array(buffer);\n    }\n  }\n  checkMem();\n\n  /** Gets the runtime type info for the given id. */\n  function getInfo(id) {\n    const count = U32[rttiBase >>> 2];\n    if ((id >>>= 0) >= count) throw Error(\"invalid id: \" + id);\n    return U32[(rttiBase + 4 >>> 2) + id * 2];\n  }\n\n  /** Gets the runtime base id for the given id. */\n  function getBase(id) {\n    const count = U32[rttiBase >>> 2];\n    if ((id >>>= 0) >= count) throw Error(\"invalid id: \" + id);\n    return U32[(rttiBase + 4 >>> 2) + id * 2 + 1];\n  }\n\n  /** Gets the runtime alignment of a collection's values or keys. */\n  function getAlign(which, info) {\n    return 31 - Math.clz32((info / which) & 31); // -1 if none\n  }\n\n  /** Allocates a new string in the module's memory and returns its retained pointer. */\n  function __allocString(str) {\n    const length = str.length;\n    const ref = alloc(length << 1, STRING_ID);\n    checkMem();\n    for (let i = 0, j = ref >>> 1; i < length; ++i) U16[j + i] = str.charCodeAt(i);\n    return ref;\n  }\n\n  baseModule.__allocString = __allocString;\n\n  /** Reads a string from the module's memory by its pointer. */\n  function __getString(ref) {\n    checkMem();\n    const id = U32[ref + ID_OFFSET >>> 2];\n    if (id !== STRING_ID) throw Error(\"not a string: \" + ref);\n    return getStringImpl(U32, U16, ref);\n  }\n\n  baseModule.__getString = __getString;\n\n  /** Gets the view matching the specified alignment, signedness and floatness. */\n  function getView(align, signed, float) {\n    if (float) {\n      switch (align) {\n        case 2: return F32;\n        case 3: return F64;\n      }\n    } else {\n      switch (align) {\n        case 0: return signed ? I8 : U8;\n        case 1: return signed ? I16 : U16;\n        case 2: return signed ? I32 : U32;\n        case 3: return signed ? I64 : U64;\n      }\n    }\n    throw Error(\"unsupported align: \" + align);\n  }\n\n  /** Allocates a new array in the module's memory and returns its retained pointer. */\n  function __allocArray(id, values) {\n    const info = getInfo(id);\n    if (!(info & (ARRAYBUFFERVIEW | ARRAY))) throw Error(\"not an array: \" + id + \" @ \" + info);\n    const align = getAlign(VAL_ALIGN, info);\n    const length = values.length;\n    const buf = alloc(length << align, ARRAYBUFFER_ID);\n    const arr = alloc(info & ARRAY ? ARRAY_SIZE : ARRAYBUFFERVIEW_SIZE, id);\n    checkMem();\n    U32[arr + ARRAYBUFFERVIEW_BUFFER_OFFSET >>> 2] = retain(buf);\n    U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2] = buf;\n    U32[arr + ARRAYBUFFERVIEW_DATALENGTH_OFFSET >>> 2] = length << align;\n    if (info & ARRAY) U32[arr + ARRAY_LENGTH_OFFSET >>> 2] = length;\n    const view = getView(align, info & VAL_SIGNED, info & VAL_FLOAT);\n    for (let i = 0; i < length; ++i) view[(buf >> align) + i] = values[i];\n    if (info & VAL_MANAGED) for (let i = 0; i < length; ++i) retain(values[i]);\n    return arr;\n  }\n\n  baseModule.__allocArray = __allocArray;\n\n  /** Gets a view on the values of an array in the module's memory. */\n  function __getArrayView(arr) {\n    checkMem();\n    const id = U32[arr + ID_OFFSET >>> 2];\n    const info = getInfo(id);\n    if (!(info & ARRAYBUFFERVIEW)) throw Error(\"not an array: \" + id);\n    const align = getAlign(VAL_ALIGN, info);\n    var buf = U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];\n    const length = info & ARRAY\n      ? U32[arr + ARRAY_LENGTH_OFFSET >>> 2]\n      : U32[buf + SIZE_OFFSET >>> 2] >>> align;\n    return getView(align, info & VAL_SIGNED, info & VAL_FLOAT)\n          .slice(buf >>>= align, buf + length);\n  }\n\n  baseModule.__getArrayView = __getArrayView;\n\n  /** Reads (copies) the values of an array from the module's memory. */\n  function __getArray(arr) {\n    return Array.from(__getArrayView(arr));\n  }\n\n  baseModule.__getArray = __getArray;\n\n  /** Tests whether an object is an instance of the class represented by the specified base id. */\n  function __instanceof(ref, baseId) {\n    var id = U32[(ref + ID_OFFSET) >>> 2];\n    if (id <= U32[rttiBase >>> 2]) {\n      do if (id == baseId) return true;\n      while (id = getBase(id));\n    }\n    return false;\n  }\n\n  baseModule.__instanceof = __instanceof;\n\n  // Pull basic exports to baseModule so code in preInstantiate can use them\n  baseModule.memory = baseModule.memory || memory;\n  baseModule.table = baseModule.table || table;\n\n  // Demangle exports and provide the usual utility on the prototype\n  return demangle(rawExports, Object.defineProperties(baseModule, {\n    I8: { get: function() { checkMem(); return I8; } },\n    U8: { get: function() { checkMem(); return U8; } },\n    I16: { get: function() { checkMem(); return I16; } },\n    U16: { get: function() { checkMem(); return U16; } },\n    I32: { get: function() { checkMem(); return I32; } },\n    U32: { get: function() { checkMem(); return U32; } },\n    I64: { get: function() { checkMem(); return I64; } },\n    U64: { get: function() { checkMem(); return U64; } },\n    F32: { get: function() { checkMem(); return F32; } },\n    F64: { get: function() { checkMem(); return F64; } }\n  }));\n}\n\n/** Wraps a WebAssembly function while also taking care of variable arguments. */\nfunction wrapFunction(fn, setargc) {\n  var wrap = (...args) => {\n    setargc(args.length);\n    return fn(...args);\n  }\n  wrap.original = fn;\n  return wrap;\n}\n\n/** Instantiates an AssemblyScript module using the specified imports. */\nfunction instantiate(module, imports) {\n  return postInstantiate(\n    preInstantiate(imports || (imports = {})),\n    new WebAssembly.Instance(module, imports)\n  );\n}\n\nexports.instantiate = instantiate;\n\n/** Instantiates an AssemblyScript module from a buffer using the specified imports. */\nfunction instantiateBuffer(buffer, imports) {\n  return instantiate(new WebAssembly.Module(buffer), imports);\n}\n\nexports.instantiateBuffer = instantiateBuffer;\n\n/** Instantiates an AssemblyScript module from a response using the specified imports. */\nasync function instantiateStreaming(response, imports) {\n  return postInstantiate(\n    preInstantiate(imports || (imports = {})),\n    (await WebAssembly.instantiateStreaming(response, imports)).instance\n  );\n}\n\nexports.instantiateStreaming = instantiateStreaming;\n\n/** Demangles an AssemblyScript module's exports to a friendly object structure. */\nfunction demangle(exports, baseModule) {\n  var module = baseModule ? Object.create(baseModule) : {};\n  var setargc = exports[\"__setargc\"] || function() {};\n  function hasOwnProperty(elem, prop) {\n    return Object.prototype.hasOwnProperty.call(elem, prop);\n  }\n  for (let internalName in exports) {\n    if (!hasOwnProperty(exports, internalName)) continue;\n    let elem = exports[internalName];\n    let parts = internalName.split(\".\");\n    let curr = module;\n    while (parts.length > 1) {\n      let part = parts.shift();\n      if (!hasOwnProperty(curr, part)) curr[part] = {};\n      curr = curr[part];\n    }\n    let name = parts[0];\n    let hash = name.indexOf(\"#\");\n    if (hash >= 0) {\n      let className = name.substring(0, hash);\n      let classElem = curr[className];\n      if (typeof classElem === \"undefined\" || !classElem.prototype) {\n        let ctor = function(...args) {\n          return ctor.wrap(ctor.prototype.constructor(0, ...args));\n        };\n        ctor.prototype = {\n          valueOf: function valueOf() {\n            return this[THIS];\n          }\n        };\n        ctor.wrap = function(thisValue) {\n          return Object.create(ctor.prototype, { [THIS]: { value: thisValue, writable: false } });\n        };\n        if (classElem) Object.getOwnPropertyNames(classElem).forEach(name =>\n          Object.defineProperty(ctor, name, Object.getOwnPropertyDescriptor(classElem, name))\n        );\n        curr[className] = ctor;\n      }\n      name = name.substring(hash + 1);\n      curr = curr[className].prototype;\n      if (/^(get|set):/.test(name)) {\n        if (!hasOwnProperty(curr, name = name.substring(4))) {\n          let getter = exports[internalName.replace(\"set:\", \"get:\")];\n          let setter = exports[internalName.replace(\"get:\", \"set:\")];\n          Object.defineProperty(curr, name, {\n            get: function() { return getter(this[THIS]); },\n            set: function(value) { setter(this[THIS], value); },\n            enumerable: true\n          });\n        }\n      } else {\n        if (name === 'constructor') {\n          curr[name] = wrapFunction(elem, setargc);\n        } else { // for methods\n          Object.defineProperty(curr, name, {\n            value: function (...args) {\n              setargc(args.length);\n              return elem(this[THIS], ...args);\n            }\n          });\n        }\n      }\n    } else {\n      if (/^(get|set):/.test(name)) {\n        if (!hasOwnProperty(curr, name = name.substring(4))) {\n          Object.defineProperty(curr, name, {\n            get: exports[internalName.replace(\"set:\", \"get:\")],\n            set: exports[internalName.replace(\"get:\", \"set:\")],\n            enumerable: true\n          });\n        }\n      } else if (typeof elem === \"function\") {\n        curr[name] = wrapFunction(elem, setargc);\n      } else {\n        curr[name] = elem;\n      }\n    }\n  }\n\n  return module;\n}\n\nexports.demangle = demangle;\n\n\n//# sourceURL=webpack:///./node_modules/assemblyscript/lib/loader/index.js?");

/***/ }),

/***/ "./src/image-utils.js":
/*!****************************!*\
  !*** ./src/image-utils.js ***!
  \****************************/
/*! exports provided: loadImageDataFromURL, putPixelsIntoCanvas */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadImageDataFromURL\", function() { return loadImageDataFromURL; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"putPixelsIntoCanvas\", function() { return putPixelsIntoCanvas; });\n/**\n *\n * @param {string} url\n * @return {ImageData}\n */\nasync function loadImageDataFromURL(url, debug = false) {\n  let canvas = document.createElement('canvas');\n  let img = document.createElement('img');\n  img.setAttribute('src', url);\n  document.body.appendChild(img);\n  document.body.appendChild(canvas);\n\n  return new Promise((resolve, reject) => {\n    img.onload = resolve;\n    img.onabort = reject;\n    img.onerror = reject;\n  })\n    .then(() => {\n      let { width, height } = img;\n      canvas.width = width;\n      canvas.height = height;\n\n      document.body.appendChild(canvas);\n      let ctx = canvas.getContext('2d');\n      ctx.drawImage(img, 0, 0);\n      return ctx.getImageData(0, 0, width, height);\n    })\n    .finally(() => {\n      if (!debug) {\n        canvas.remove();\n        img.remove();\n      }\n    });\n}\n\n/**\n *\n * @param {Uint8Array} pixels\n * @param {Number} width\n * @param {Number} height\n */\nfunction putPixelsIntoCanvas(pixels, width, height) {\n  let canvas = document.createElement('canvas');\n  canvas.width = width;\n  canvas.height = height;\n  document.body.appendChild(canvas);\n  let ctx = canvas.getContext('2d');\n\n  let imageData = new ImageData(pixels, width, height);\n  ctx.putImageData(imageData, 0, 0);\n}\n\n\n//# sourceURL=webpack:///./src/image-utils.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var assemblyscript_lib_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! assemblyscript/lib/loader */ \"./node_modules/assemblyscript/lib/loader/index.js\");\n/* harmony import */ var assemblyscript_lib_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(assemblyscript_lib_loader__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _image_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./image-utils */ \"./src/image-utils.js\");\n\n\n\nconst MODULE_PATH = 'wasm/untouched.wasm';\nconst IMAGE_URL = 'public/images/silly.jpg';\n\n(async function run() {\n  let imports = {};\n  let module = await assemblyscript_lib_loader__WEBPACK_IMPORTED_MODULE_0___default.a.instantiateStreaming(fetch(MODULE_PATH), imports);\n  let imageData = await Object(_image_utils__WEBPACK_IMPORTED_MODULE_1__[\"loadImageDataFromURL\"])(IMAGE_URL, true);\n\n  debugger;\n  let pixelsRef = module.__retain(\n    module.__allocArray(module.ID_UINT8_ARRAY, imageData.data)\n  );\n\n  module.invertImage(pixelsRef);\n\n  let newPixels = new Uint8ClampedArray(module.__getArray(pixelsRef));\n  Object(_image_utils__WEBPACK_IMPORTED_MODULE_1__[\"putPixelsIntoCanvas\"])(newPixels, imageData.width, imageData.height);\n})();\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });