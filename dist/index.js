var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS({
  "node_modules/@actions/core/lib/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toCommandProperties = exports.toCommandValue = void 0;
    function toCommandValue(input) {
      if (input === null || input === void 0) {
        return "";
      } else if (typeof input === "string" || input instanceof String) {
        return input;
      }
      return JSON.stringify(input);
    }
    exports.toCommandValue = toCommandValue;
    function toCommandProperties(annotationProperties) {
      if (!Object.keys(annotationProperties).length) {
        return {};
      }
      return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
      };
    }
    exports.toCommandProperties = toCommandProperties;
  }
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS({
  "node_modules/@actions/core/lib/command.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.issue = exports.issueCommand = void 0;
    var os = __importStar(require("os"));
    var utils_1 = require_utils();
    function issueCommand2(command2, properties, message) {
      const cmd = new Command(command2, properties, message);
      process.stdout.write(cmd.toString() + os.EOL);
    }
    exports.issueCommand = issueCommand2;
    function issue(name, message = "") {
      issueCommand2(name, {}, message);
    }
    exports.issue = issue;
    var CMD_STRING = "::";
    var Command = class {
      constructor(command2, properties, message) {
        if (!command2) {
          command2 = "missing.command";
        }
        this.command = command2;
        this.properties = properties;
        this.message = message;
      }
      toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
          cmdStr += " ";
          let first = true;
          for (const key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
              const val = this.properties[key];
              if (val) {
                if (first) {
                  first = false;
                } else {
                  cmdStr += ",";
                }
                cmdStr += `${key}=${escapeProperty(val)}`;
              }
            }
          }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
      }
    };
    function escapeData(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
    }
    function escapeProperty(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
    }
  }
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS({
  "node_modules/@actions/core/lib/file-command.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.issueCommand = void 0;
    var fs = __importStar(require("fs"));
    var os = __importStar(require("os"));
    var utils_1 = require_utils();
    function issueCommand2(command2, message) {
      const filePath = process.env[`GITHUB_${command2}`];
      if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command2}`);
      }
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
      }
      fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: "utf8"
      });
    }
    exports.issueCommand = issueCommand2;
  }
});

// node_modules/@actions/http-client/proxy.js
var require_proxy = __commonJS({
  "node_modules/@actions/http-client/proxy.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getProxyUrl(reqUrl) {
      let usingSsl = reqUrl.protocol === "https:";
      let proxyUrl;
      if (checkBypass(reqUrl)) {
        return proxyUrl;
      }
      let proxyVar;
      if (usingSsl) {
        proxyVar = process.env["https_proxy"] || process.env["HTTPS_PROXY"];
      } else {
        proxyVar = process.env["http_proxy"] || process.env["HTTP_PROXY"];
      }
      if (proxyVar) {
        proxyUrl = new URL(proxyVar);
      }
      return proxyUrl;
    }
    exports.getProxyUrl = getProxyUrl;
    function checkBypass(reqUrl) {
      if (!reqUrl.hostname) {
        return false;
      }
      let noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || "";
      if (!noProxy) {
        return false;
      }
      let reqPort;
      if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
      } else if (reqUrl.protocol === "http:") {
        reqPort = 80;
      } else if (reqUrl.protocol === "https:") {
        reqPort = 443;
      }
      let upperReqHosts = [reqUrl.hostname.toUpperCase()];
      if (typeof reqPort === "number") {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
      }
      for (let upperNoProxyItem of noProxy.split(",").map((x) => x.trim().toUpperCase()).filter((x) => x)) {
        if (upperReqHosts.some((x) => x === upperNoProxyItem)) {
          return true;
        }
      }
      return false;
    }
    exports.checkBypass = checkBypass;
  }
});

// node_modules/tunnel/lib/tunnel.js
var require_tunnel = __commonJS({
  "node_modules/tunnel/lib/tunnel.js"(exports) {
    "use strict";
    var net = require("net");
    var tls = require("tls");
    var http = require("http");
    var https = require("https");
    var events = require("events");
    var assert = require("assert");
    var util = require("util");
    exports.httpOverHttp = httpOverHttp;
    exports.httpsOverHttp = httpsOverHttp;
    exports.httpOverHttps = httpOverHttps;
    exports.httpsOverHttps = httpsOverHttps;
    function httpOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      return agent;
    }
    function httpsOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function httpOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      return agent;
    }
    function httpsOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function TunnelingAgent(options) {
      var self = this;
      self.options = options || {};
      self.proxyOptions = self.options.proxy || {};
      self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
      self.requests = [];
      self.sockets = [];
      self.on("free", function onFree(socket, host, port, localAddress) {
        var options2 = toOptions(host, port, localAddress);
        for (var i = 0, len = self.requests.length; i < len; ++i) {
          var pending = self.requests[i];
          if (pending.host === options2.host && pending.port === options2.port) {
            self.requests.splice(i, 1);
            pending.request.onSocket(socket);
            return;
          }
        }
        socket.destroy();
        self.removeSocket(socket);
      });
    }
    util.inherits(TunnelingAgent, events.EventEmitter);
    TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
      var self = this;
      var options = mergeOptions({ request: req }, self.options, toOptions(host, port, localAddress));
      if (self.sockets.length >= this.maxSockets) {
        self.requests.push(options);
        return;
      }
      self.createSocket(options, function(socket) {
        socket.on("free", onFree);
        socket.on("close", onCloseOrRemove);
        socket.on("agentRemove", onCloseOrRemove);
        req.onSocket(socket);
        function onFree() {
          self.emit("free", socket, options);
        }
        function onCloseOrRemove(err) {
          self.removeSocket(socket);
          socket.removeListener("free", onFree);
          socket.removeListener("close", onCloseOrRemove);
          socket.removeListener("agentRemove", onCloseOrRemove);
        }
      });
    };
    TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
      var self = this;
      var placeholder = {};
      self.sockets.push(placeholder);
      var connectOptions = mergeOptions({}, self.proxyOptions, {
        method: "CONNECT",
        path: options.host + ":" + options.port,
        agent: false,
        headers: {
          host: options.host + ":" + options.port
        }
      });
      if (options.localAddress) {
        connectOptions.localAddress = options.localAddress;
      }
      if (connectOptions.proxyAuth) {
        connectOptions.headers = connectOptions.headers || {};
        connectOptions.headers["Proxy-Authorization"] = "Basic " + new Buffer(connectOptions.proxyAuth).toString("base64");
      }
      debug("making CONNECT request");
      var connectReq = self.request(connectOptions);
      connectReq.useChunkedEncodingByDefault = false;
      connectReq.once("response", onResponse);
      connectReq.once("upgrade", onUpgrade);
      connectReq.once("connect", onConnect);
      connectReq.once("error", onError);
      connectReq.end();
      function onResponse(res) {
        res.upgrade = true;
      }
      function onUpgrade(res, socket, head) {
        process.nextTick(function() {
          onConnect(res, socket, head);
        });
      }
      function onConnect(res, socket, head) {
        connectReq.removeAllListeners();
        socket.removeAllListeners();
        if (res.statusCode !== 200) {
          debug("tunneling socket could not be established, statusCode=%d", res.statusCode);
          socket.destroy();
          var error = new Error("tunneling socket could not be established, statusCode=" + res.statusCode);
          error.code = "ECONNRESET";
          options.request.emit("error", error);
          self.removeSocket(placeholder);
          return;
        }
        if (head.length > 0) {
          debug("got illegal response body from proxy");
          socket.destroy();
          var error = new Error("got illegal response body from proxy");
          error.code = "ECONNRESET";
          options.request.emit("error", error);
          self.removeSocket(placeholder);
          return;
        }
        debug("tunneling connection has established");
        self.sockets[self.sockets.indexOf(placeholder)] = socket;
        return cb(socket);
      }
      function onError(cause) {
        connectReq.removeAllListeners();
        debug("tunneling socket could not be established, cause=%s\n", cause.message, cause.stack);
        var error = new Error("tunneling socket could not be established, cause=" + cause.message);
        error.code = "ECONNRESET";
        options.request.emit("error", error);
        self.removeSocket(placeholder);
      }
    };
    TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
      var pos = this.sockets.indexOf(socket);
      if (pos === -1) {
        return;
      }
      this.sockets.splice(pos, 1);
      var pending = this.requests.shift();
      if (pending) {
        this.createSocket(pending, function(socket2) {
          pending.request.onSocket(socket2);
        });
      }
    };
    function createSecureSocket(options, cb) {
      var self = this;
      TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
        var hostHeader = options.request.getHeader("host");
        var tlsOptions = mergeOptions({}, self.options, {
          socket,
          servername: hostHeader ? hostHeader.replace(/:.*$/, "") : options.host
        });
        var secureSocket = tls.connect(0, tlsOptions);
        self.sockets[self.sockets.indexOf(socket)] = secureSocket;
        cb(secureSocket);
      });
    }
    function toOptions(host, port, localAddress) {
      if (typeof host === "string") {
        return {
          host,
          port,
          localAddress
        };
      }
      return host;
    }
    function mergeOptions(target) {
      for (var i = 1, len = arguments.length; i < len; ++i) {
        var overrides = arguments[i];
        if (typeof overrides === "object") {
          var keys = Object.keys(overrides);
          for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
            var k = keys[j];
            if (overrides[k] !== void 0) {
              target[k] = overrides[k];
            }
          }
        }
      }
      return target;
    }
    var debug;
    if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
      debug = function() {
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[0] === "string") {
          args[0] = "TUNNEL: " + args[0];
        } else {
          args.unshift("TUNNEL:");
        }
        console.error.apply(console, args);
      };
    } else {
      debug = function() {
      };
    }
    exports.debug = debug;
  }
});

// node_modules/tunnel/index.js
var require_tunnel2 = __commonJS({
  "node_modules/tunnel/index.js"(exports, module2) {
    module2.exports = require_tunnel();
  }
});

// node_modules/@actions/http-client/index.js
var require_http_client = __commonJS({
  "node_modules/@actions/http-client/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var http = require("http");
    var https = require("https");
    var pm = require_proxy();
    var tunnel;
    var HttpCodes;
    (function(HttpCodes2) {
      HttpCodes2[HttpCodes2["OK"] = 200] = "OK";
      HttpCodes2[HttpCodes2["MultipleChoices"] = 300] = "MultipleChoices";
      HttpCodes2[HttpCodes2["MovedPermanently"] = 301] = "MovedPermanently";
      HttpCodes2[HttpCodes2["ResourceMoved"] = 302] = "ResourceMoved";
      HttpCodes2[HttpCodes2["SeeOther"] = 303] = "SeeOther";
      HttpCodes2[HttpCodes2["NotModified"] = 304] = "NotModified";
      HttpCodes2[HttpCodes2["UseProxy"] = 305] = "UseProxy";
      HttpCodes2[HttpCodes2["SwitchProxy"] = 306] = "SwitchProxy";
      HttpCodes2[HttpCodes2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
      HttpCodes2[HttpCodes2["PermanentRedirect"] = 308] = "PermanentRedirect";
      HttpCodes2[HttpCodes2["BadRequest"] = 400] = "BadRequest";
      HttpCodes2[HttpCodes2["Unauthorized"] = 401] = "Unauthorized";
      HttpCodes2[HttpCodes2["PaymentRequired"] = 402] = "PaymentRequired";
      HttpCodes2[HttpCodes2["Forbidden"] = 403] = "Forbidden";
      HttpCodes2[HttpCodes2["NotFound"] = 404] = "NotFound";
      HttpCodes2[HttpCodes2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
      HttpCodes2[HttpCodes2["NotAcceptable"] = 406] = "NotAcceptable";
      HttpCodes2[HttpCodes2["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
      HttpCodes2[HttpCodes2["RequestTimeout"] = 408] = "RequestTimeout";
      HttpCodes2[HttpCodes2["Conflict"] = 409] = "Conflict";
      HttpCodes2[HttpCodes2["Gone"] = 410] = "Gone";
      HttpCodes2[HttpCodes2["TooManyRequests"] = 429] = "TooManyRequests";
      HttpCodes2[HttpCodes2["InternalServerError"] = 500] = "InternalServerError";
      HttpCodes2[HttpCodes2["NotImplemented"] = 501] = "NotImplemented";
      HttpCodes2[HttpCodes2["BadGateway"] = 502] = "BadGateway";
      HttpCodes2[HttpCodes2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
      HttpCodes2[HttpCodes2["GatewayTimeout"] = 504] = "GatewayTimeout";
    })(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
    var Headers;
    (function(Headers2) {
      Headers2["Accept"] = "accept";
      Headers2["ContentType"] = "content-type";
    })(Headers = exports.Headers || (exports.Headers = {}));
    var MediaTypes;
    (function(MediaTypes2) {
      MediaTypes2["ApplicationJson"] = "application/json";
    })(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
    function getProxyUrl(serverUrl) {
      let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
      return proxyUrl ? proxyUrl.href : "";
    }
    exports.getProxyUrl = getProxyUrl;
    var HttpRedirectCodes = [
      HttpCodes.MovedPermanently,
      HttpCodes.ResourceMoved,
      HttpCodes.SeeOther,
      HttpCodes.TemporaryRedirect,
      HttpCodes.PermanentRedirect
    ];
    var HttpResponseRetryCodes = [
      HttpCodes.BadGateway,
      HttpCodes.ServiceUnavailable,
      HttpCodes.GatewayTimeout
    ];
    var RetryableHttpVerbs = ["OPTIONS", "GET", "DELETE", "HEAD"];
    var ExponentialBackoffCeiling = 10;
    var ExponentialBackoffTimeSlice = 5;
    var HttpClientError = class extends Error {
      constructor(message, statusCode) {
        super(message);
        this.name = "HttpClientError";
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
      }
    };
    exports.HttpClientError = HttpClientError;
    var HttpClientResponse = class {
      constructor(message) {
        this.message = message;
      }
      readBody() {
        return new Promise(async (resolve, reject) => {
          let output = Buffer.alloc(0);
          this.message.on("data", (chunk) => {
            output = Buffer.concat([output, chunk]);
          });
          this.message.on("end", () => {
            resolve(output.toString());
          });
        });
      }
    };
    exports.HttpClientResponse = HttpClientResponse;
    function isHttps(requestUrl) {
      let parsedUrl = new URL(requestUrl);
      return parsedUrl.protocol === "https:";
    }
    exports.isHttps = isHttps;
    var HttpClient2 = class {
      constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
          if (requestOptions.ignoreSslError != null) {
            this._ignoreSslError = requestOptions.ignoreSslError;
          }
          this._socketTimeout = requestOptions.socketTimeout;
          if (requestOptions.allowRedirects != null) {
            this._allowRedirects = requestOptions.allowRedirects;
          }
          if (requestOptions.allowRedirectDowngrade != null) {
            this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
          }
          if (requestOptions.maxRedirects != null) {
            this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
          }
          if (requestOptions.keepAlive != null) {
            this._keepAlive = requestOptions.keepAlive;
          }
          if (requestOptions.allowRetries != null) {
            this._allowRetries = requestOptions.allowRetries;
          }
          if (requestOptions.maxRetries != null) {
            this._maxRetries = requestOptions.maxRetries;
          }
        }
      }
      options(requestUrl, additionalHeaders) {
        return this.request("OPTIONS", requestUrl, null, additionalHeaders || {});
      }
      get(requestUrl, additionalHeaders) {
        return this.request("GET", requestUrl, null, additionalHeaders || {});
      }
      del(requestUrl, additionalHeaders) {
        return this.request("DELETE", requestUrl, null, additionalHeaders || {});
      }
      post(requestUrl, data, additionalHeaders) {
        return this.request("POST", requestUrl, data, additionalHeaders || {});
      }
      patch(requestUrl, data, additionalHeaders) {
        return this.request("PATCH", requestUrl, data, additionalHeaders || {});
      }
      put(requestUrl, data, additionalHeaders) {
        return this.request("PUT", requestUrl, data, additionalHeaders || {});
      }
      head(requestUrl, additionalHeaders) {
        return this.request("HEAD", requestUrl, null, additionalHeaders || {});
      }
      sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
      }
      async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
          throw new Error("Client has already been disposed.");
        }
        let parsedUrl = new URL(requestUrl);
        let info2 = this._prepareRequest(verb, parsedUrl, headers);
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1 ? this._maxRetries + 1 : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
          response = await this.requestRaw(info2, data);
          if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
            let authenticationHandler;
            for (let i = 0; i < this.handlers.length; i++) {
              if (this.handlers[i].canHandleAuthentication(response)) {
                authenticationHandler = this.handlers[i];
                break;
              }
            }
            if (authenticationHandler) {
              return authenticationHandler.handleAuthentication(this, info2, data);
            } else {
              return response;
            }
          }
          let redirectsRemaining = this._maxRedirects;
          while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 && this._allowRedirects && redirectsRemaining > 0) {
            const redirectUrl = response.message.headers["location"];
            if (!redirectUrl) {
              break;
            }
            let parsedRedirectUrl = new URL(redirectUrl);
            if (parsedUrl.protocol == "https:" && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) {
              throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
            }
            await response.readBody();
            if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
              for (let header in headers) {
                if (header.toLowerCase() === "authorization") {
                  delete headers[header];
                }
              }
            }
            info2 = this._prepareRequest(verb, parsedRedirectUrl, headers);
            response = await this.requestRaw(info2, data);
            redirectsRemaining--;
          }
          if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
            return response;
          }
          numTries += 1;
          if (numTries < maxTries) {
            await response.readBody();
            await this._performExponentialBackoff(numTries);
          }
        }
        return response;
      }
      dispose() {
        if (this._agent) {
          this._agent.destroy();
        }
        this._disposed = true;
      }
      requestRaw(info2, data) {
        return new Promise((resolve, reject) => {
          let callbackForResult = function(err, res) {
            if (err) {
              reject(err);
            }
            resolve(res);
          };
          this.requestRawWithCallback(info2, data, callbackForResult);
        });
      }
      requestRawWithCallback(info2, data, onResult) {
        let socket;
        if (typeof data === "string") {
          info2.options.headers["Content-Length"] = Buffer.byteLength(data, "utf8");
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
          if (!callbackCalled) {
            callbackCalled = true;
            onResult(err, res);
          }
        };
        let req = info2.httpModule.request(info2.options, (msg) => {
          let res = new HttpClientResponse(msg);
          handleResult(null, res);
        });
        req.on("socket", (sock) => {
          socket = sock;
        });
        req.setTimeout(this._socketTimeout || 3 * 6e4, () => {
          if (socket) {
            socket.end();
          }
          handleResult(new Error("Request timeout: " + info2.options.path), null);
        });
        req.on("error", function(err) {
          handleResult(err, null);
        });
        if (data && typeof data === "string") {
          req.write(data, "utf8");
        }
        if (data && typeof data !== "string") {
          data.on("close", function() {
            req.end();
          });
          data.pipe(req);
        } else {
          req.end();
        }
      }
      getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
      }
      _prepareRequest(method, requestUrl, headers) {
        const info2 = {};
        info2.parsedUrl = requestUrl;
        const usingSsl = info2.parsedUrl.protocol === "https:";
        info2.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info2.options = {};
        info2.options.host = info2.parsedUrl.hostname;
        info2.options.port = info2.parsedUrl.port ? parseInt(info2.parsedUrl.port) : defaultPort;
        info2.options.path = (info2.parsedUrl.pathname || "") + (info2.parsedUrl.search || "");
        info2.options.method = method;
        info2.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
          info2.options.headers["user-agent"] = this.userAgent;
        }
        info2.options.agent = this._getAgent(info2.parsedUrl);
        if (this.handlers) {
          this.handlers.forEach((handler) => {
            handler.prepareRequest(info2.options);
          });
        }
        return info2;
      }
      _mergeHeaders(headers) {
        const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        if (this.requestOptions && this.requestOptions.headers) {
          return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
      }
      _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
          clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
      }
      _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
          agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
          agent = this._agent;
        }
        if (!!agent) {
          return agent;
        }
        const usingSsl = parsedUrl.protocol === "https:";
        let maxSockets = 100;
        if (!!this.requestOptions) {
          maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
          if (!tunnel) {
            tunnel = require_tunnel2();
          }
          const agentOptions = {
            maxSockets,
            keepAlive: this._keepAlive,
            proxy: __spreadProps(__spreadValues({}, (proxyUrl.username || proxyUrl.password) && {
              proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
            }), {
              host: proxyUrl.hostname,
              port: proxyUrl.port
            })
          };
          let tunnelAgent;
          const overHttps = proxyUrl.protocol === "https:";
          if (usingSsl) {
            tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
          } else {
            tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
          }
          agent = tunnelAgent(agentOptions);
          this._proxyAgent = agent;
        }
        if (this._keepAlive && !agent) {
          const options = { keepAlive: this._keepAlive, maxSockets };
          agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
          this._agent = agent;
        }
        if (!agent) {
          agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
          agent.options = Object.assign(agent.options || {}, {
            rejectUnauthorized: false
          });
        }
        return agent;
      }
      _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise((resolve) => setTimeout(() => resolve(), ms));
      }
      static dateTimeDeserializer(key, value) {
        if (typeof value === "string") {
          let a = new Date(value);
          if (!isNaN(a.valueOf())) {
            return a;
          }
        }
        return value;
      }
      async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
          const statusCode = res.message.statusCode;
          const response = {
            statusCode,
            result: null,
            headers: {}
          };
          if (statusCode == HttpCodes.NotFound) {
            resolve(response);
          }
          let obj;
          let contents;
          try {
            contents = await res.readBody();
            if (contents && contents.length > 0) {
              if (options && options.deserializeDates) {
                obj = JSON.parse(contents, HttpClient2.dateTimeDeserializer);
              } else {
                obj = JSON.parse(contents);
              }
              response.result = obj;
            }
            response.headers = res.message.headers;
          } catch (err) {
          }
          if (statusCode > 299) {
            let msg;
            if (obj && obj.message) {
              msg = obj.message;
            } else if (contents && contents.length > 0) {
              msg = contents;
            } else {
              msg = "Failed request: (" + statusCode + ")";
            }
            let err = new HttpClientError(msg, statusCode);
            err.result = response.result;
            reject(err);
          } else {
            resolve(response);
          }
        });
      }
    };
    exports.HttpClient = HttpClient2;
  }
});

// node_modules/@actions/http-client/auth.js
var require_auth = __commonJS({
  "node_modules/@actions/http-client/auth.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BasicCredentialHandler = class {
      constructor(username, password) {
        this.username = username;
        this.password = password;
      }
      prepareRequest(options) {
        options.headers["Authorization"] = "Basic " + Buffer.from(this.username + ":" + this.password).toString("base64");
      }
      canHandleAuthentication(response) {
        return false;
      }
      handleAuthentication(httpClient2, requestInfo, objs) {
        return null;
      }
    };
    exports.BasicCredentialHandler = BasicCredentialHandler;
    var BearerCredentialHandler = class {
      constructor(token) {
        this.token = token;
      }
      prepareRequest(options) {
        options.headers["Authorization"] = "Bearer " + this.token;
      }
      canHandleAuthentication(response) {
        return false;
      }
      handleAuthentication(httpClient2, requestInfo, objs) {
        return null;
      }
    };
    exports.BearerCredentialHandler = BearerCredentialHandler;
    var PersonalAccessTokenCredentialHandler = class {
      constructor(token) {
        this.token = token;
      }
      prepareRequest(options) {
        options.headers["Authorization"] = "Basic " + Buffer.from("PAT:" + this.token).toString("base64");
      }
      canHandleAuthentication(response) {
        return false;
      }
      handleAuthentication(httpClient2, requestInfo, objs) {
        return null;
      }
    };
    exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
  }
});

// node_modules/@actions/core/lib/oidc-utils.js
var require_oidc_utils = __commonJS({
  "node_modules/@actions/core/lib/oidc-utils.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OidcClient = void 0;
    var http_client_1 = require_http_client();
    var auth_1 = require_auth();
    var core_1 = require_core();
    var OidcClient = class {
      static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
          allowRetries: allowRetry,
          maxRetries: maxRetry
        };
        return new http_client_1.HttpClient("actions/oidc-client", [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
      }
      static getRequestToken() {
        const token = process.env["ACTIONS_ID_TOKEN_REQUEST_TOKEN"];
        if (!token) {
          throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable");
        }
        return token;
      }
      static getIDTokenUrl() {
        const runtimeUrl = process.env["ACTIONS_ID_TOKEN_REQUEST_URL"];
        if (!runtimeUrl) {
          throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable");
        }
        return runtimeUrl;
      }
      static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
          const httpclient = OidcClient.createHttpClient();
          const res = yield httpclient.getJson(id_token_url).catch((error) => {
            throw new Error(`Failed to get ID Token. 
 
        Error Code : ${error.statusCode}
 
        Error Message: ${error.result.message}`);
          });
          const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
          if (!id_token) {
            throw new Error("Response json body do not have ID Token field");
          }
          return id_token;
        });
      }
      static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            let id_token_url = OidcClient.getIDTokenUrl();
            if (audience) {
              const encodedAudience = encodeURIComponent(audience);
              id_token_url = `${id_token_url}&audience=${encodedAudience}`;
            }
            core_1.debug(`ID token url is ${id_token_url}`);
            const id_token = yield OidcClient.getCall(id_token_url);
            core_1.setSecret(id_token);
            return id_token;
          } catch (error) {
            throw new Error(`Error message: ${error.message}`);
          }
        });
      }
    };
    exports.OidcClient = OidcClient;
  }
});

// node_modules/@actions/core/lib/markdown-summary.js
var require_markdown_summary = __commonJS({
  "node_modules/@actions/core/lib/markdown-summary.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
    var os_1 = require("os");
    var fs_1 = require("fs");
    var { access, appendFile, writeFile } = fs_1.promises;
    exports.SUMMARY_ENV_VAR = "GITHUB_STEP_SUMMARY";
    exports.SUMMARY_DOCS_URL = "https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-markdown-summary";
    var MarkdownSummary = class {
      constructor() {
        this._buffer = "";
      }
      filePath() {
        return __awaiter(this, void 0, void 0, function* () {
          if (this._filePath) {
            return this._filePath;
          }
          const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
          if (!pathFromEnv) {
            throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports markdown summaries.`);
          }
          try {
            yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
          } catch (_a) {
            throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
          }
          this._filePath = pathFromEnv;
          return this._filePath;
        });
      }
      wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs).map(([key, value]) => ` ${key}="${value}"`).join("");
        if (!content) {
          return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
      }
      write(options) {
        return __awaiter(this, void 0, void 0, function* () {
          const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
          const filePath = yield this.filePath();
          const writeFunc = overwrite ? writeFile : appendFile;
          yield writeFunc(filePath, this._buffer, { encoding: "utf8" });
          return this.emptyBuffer();
        });
      }
      clear() {
        return __awaiter(this, void 0, void 0, function* () {
          return this.emptyBuffer().write({ overwrite: true });
        });
      }
      stringify() {
        return this._buffer;
      }
      isEmptyBuffer() {
        return this._buffer.length === 0;
      }
      emptyBuffer() {
        this._buffer = "";
        return this;
      }
      addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
      }
      addEOL() {
        return this.addRaw(os_1.EOL);
      }
      addCodeBlock(code, lang) {
        const attrs = Object.assign({}, lang && { lang });
        const element = this.wrap("pre", this.wrap("code", code), attrs);
        return this.addRaw(element).addEOL();
      }
      addList(items, ordered = false) {
        const tag = ordered ? "ol" : "ul";
        const listItems = items.map((item) => this.wrap("li", item)).join("");
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
      }
      addTable(rows) {
        const tableBody = rows.map((row) => {
          const cells = row.map((cell) => {
            if (typeof cell === "string") {
              return this.wrap("td", cell);
            }
            const { header, data, colspan, rowspan } = cell;
            const tag = header ? "th" : "td";
            const attrs = Object.assign(Object.assign({}, colspan && { colspan }), rowspan && { rowspan });
            return this.wrap(tag, data, attrs);
          }).join("");
          return this.wrap("tr", cells);
        }).join("");
        const element = this.wrap("table", tableBody);
        return this.addRaw(element).addEOL();
      }
      addDetails(label, content) {
        const element = this.wrap("details", this.wrap("summary", label) + content);
        return this.addRaw(element).addEOL();
      }
      addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, width && { width }), height && { height });
        const element = this.wrap("img", null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
      }
      addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag) ? tag : "h1";
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
      }
      addSeparator() {
        const element = this.wrap("hr", null);
        return this.addRaw(element).addEOL();
      }
      addBreak() {
        const element = this.wrap("br", null);
        return this.addRaw(element).addEOL();
      }
      addQuote(text, cite) {
        const attrs = Object.assign({}, cite && { cite });
        const element = this.wrap("blockquote", text, attrs);
        return this.addRaw(element).addEOL();
      }
      addLink(text, href) {
        const element = this.wrap("a", text, { href });
        return this.addRaw(element).addEOL();
      }
    };
    exports.markdownSummary = new MarkdownSummary();
  }
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS({
  "node_modules/@actions/core/lib/core.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
    var command_1 = require_command();
    var file_command_1 = require_file_command();
    var utils_1 = require_utils();
    var os = __importStar(require("os"));
    var path2 = __importStar(require("path"));
    var oidc_utils_1 = require_oidc_utils();
    var ExitCode;
    (function(ExitCode2) {
      ExitCode2[ExitCode2["Success"] = 0] = "Success";
      ExitCode2[ExitCode2["Failure"] = 1] = "Failure";
    })(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
    function exportVariable(name, val) {
      const convertedVal = utils_1.toCommandValue(val);
      process.env[name] = convertedVal;
      const filePath = process.env["GITHUB_ENV"] || "";
      if (filePath) {
        const delimiter = "_GitHubActionsFileCommandDelimeter_";
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand("ENV", commandValue);
      } else {
        command_1.issueCommand("set-env", { name }, convertedVal);
      }
    }
    exports.exportVariable = exportVariable;
    function setSecret(secret) {
      command_1.issueCommand("add-mask", {}, secret);
    }
    exports.setSecret = setSecret;
    function addPath(inputPath) {
      const filePath = process.env["GITHUB_PATH"] || "";
      if (filePath) {
        file_command_1.issueCommand("PATH", inputPath);
      } else {
        command_1.issueCommand("add-path", {}, inputPath);
      }
      process.env["PATH"] = `${inputPath}${path2.delimiter}${process.env["PATH"]}`;
    }
    exports.addPath = addPath;
    function getInput2(name, options) {
      const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
      if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
      }
      if (options && options.trimWhitespace === false) {
        return val;
      }
      return val.trim();
    }
    exports.getInput = getInput2;
    function getMultilineInput(name, options) {
      const inputs = getInput2(name, options).split("\n").filter((x) => x !== "");
      return inputs;
    }
    exports.getMultilineInput = getMultilineInput;
    function getBooleanInput2(name, options) {
      const trueValue = ["true", "True", "TRUE"];
      const falseValue = ["false", "False", "FALSE"];
      const val = getInput2(name, options);
      if (trueValue.includes(val))
        return true;
      if (falseValue.includes(val))
        return false;
      throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
    }
    exports.getBooleanInput = getBooleanInput2;
    function setOutput(name, value) {
      process.stdout.write(os.EOL);
      command_1.issueCommand("set-output", { name }, value);
    }
    exports.setOutput = setOutput;
    function setCommandEcho(enabled) {
      command_1.issue("echo", enabled ? "on" : "off");
    }
    exports.setCommandEcho = setCommandEcho;
    function setFailed2(message) {
      process.exitCode = ExitCode.Failure;
      error(message);
    }
    exports.setFailed = setFailed2;
    function isDebug() {
      return process.env["RUNNER_DEBUG"] === "1";
    }
    exports.isDebug = isDebug;
    function debug(message) {
      command_1.issueCommand("debug", {}, message);
    }
    exports.debug = debug;
    function error(message, properties = {}) {
      command_1.issueCommand("error", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports.error = error;
    function warning(message, properties = {}) {
      command_1.issueCommand("warning", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports.warning = warning;
    function notice(message, properties = {}) {
      command_1.issueCommand("notice", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports.notice = notice;
    function info2(message) {
      process.stdout.write(message + os.EOL);
    }
    exports.info = info2;
    function startGroup(name) {
      command_1.issue("group", name);
    }
    exports.startGroup = startGroup;
    function endGroup() {
      command_1.issue("endgroup");
    }
    exports.endGroup = endGroup;
    function group(name, fn) {
      return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
          result = yield fn();
        } finally {
          endGroup();
        }
        return result;
      });
    }
    exports.group = group;
    function saveState(name, value) {
      command_1.issueCommand("save-state", { name }, value);
    }
    exports.saveState = saveState;
    function getState(name) {
      return process.env[`STATE_${name}`] || "";
    }
    exports.getState = getState;
    function getIDToken(aud) {
      return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
      });
    }
    exports.getIDToken = getIDToken;
    var markdown_summary_1 = require_markdown_summary();
    Object.defineProperty(exports, "markdownSummary", { enumerable: true, get: function() {
      return markdown_summary_1.markdownSummary;
    } });
  }
});

// node_modules/@actions/io/lib/io-util.js
var require_io_util = __commonJS({
  "node_modules/@actions/io/lib/io-util.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rename = exports.readlink = exports.readdir = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
    var fs = __importStar(require("fs"));
    var path2 = __importStar(require("path"));
    _a = fs.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
    exports.IS_WINDOWS = process.platform === "win32";
    function exists(fsPath) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield exports.stat(fsPath);
        } catch (err) {
          if (err.code === "ENOENT") {
            return false;
          }
          throw err;
        }
        return true;
      });
    }
    exports.exists = exists;
    function isDirectory(fsPath, useStat = false) {
      return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
      });
    }
    exports.isDirectory = isDirectory;
    function isRooted(p) {
      p = normalizeSeparators(p);
      if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
      }
      if (exports.IS_WINDOWS) {
        return p.startsWith("\\") || /^[A-Z]:/i.test(p);
      }
      return p.startsWith("/");
    }
    exports.isRooted = isRooted;
    function tryGetExecutablePath(filePath, extensions) {
      return __awaiter(this, void 0, void 0, function* () {
        let stats = void 0;
        try {
          stats = yield exports.stat(filePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
          }
        }
        if (stats && stats.isFile()) {
          if (exports.IS_WINDOWS) {
            const upperExt = path2.extname(filePath).toUpperCase();
            if (extensions.some((validExt) => validExt.toUpperCase() === upperExt)) {
              return filePath;
            }
          } else {
            if (isUnixExecutable(stats)) {
              return filePath;
            }
          }
        }
        const originalFilePath = filePath;
        for (const extension of extensions) {
          filePath = originalFilePath + extension;
          stats = void 0;
          try {
            stats = yield exports.stat(filePath);
          } catch (err) {
            if (err.code !== "ENOENT") {
              console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
          }
          if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
              try {
                const directory = path2.dirname(filePath);
                const upperName = path2.basename(filePath).toUpperCase();
                for (const actualName of yield exports.readdir(directory)) {
                  if (upperName === actualName.toUpperCase()) {
                    filePath = path2.join(directory, actualName);
                    break;
                  }
                }
              } catch (err) {
                console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
              }
              return filePath;
            } else {
              if (isUnixExecutable(stats)) {
                return filePath;
              }
            }
          }
        }
        return "";
      });
    }
    exports.tryGetExecutablePath = tryGetExecutablePath;
    function normalizeSeparators(p) {
      p = p || "";
      if (exports.IS_WINDOWS) {
        p = p.replace(/\//g, "\\");
        return p.replace(/\\\\+/g, "\\");
      }
      return p.replace(/\/\/+/g, "/");
    }
    function isUnixExecutable(stats) {
      return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && stats.uid === process.getuid();
    }
    function getCmdPath() {
      var _a2;
      return (_a2 = process.env["COMSPEC"]) !== null && _a2 !== void 0 ? _a2 : `cmd.exe`;
    }
    exports.getCmdPath = getCmdPath;
  }
});

// node_modules/@actions/io/lib/io.js
var require_io = __commonJS({
  "node_modules/@actions/io/lib/io.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
    var assert_1 = require("assert");
    var childProcess = __importStar(require("child_process"));
    var path2 = __importStar(require("path"));
    var util_1 = require("util");
    var ioUtil = __importStar(require_io_util());
    var exec = util_1.promisify(childProcess.exec);
    var execFile = util_1.promisify(childProcess.execFile);
    function cp2(source, dest, options = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        if (destStat && destStat.isFile() && !force) {
          return;
        }
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory ? path2.join(dest, path2.basename(source)) : dest;
        if (!(yield ioUtil.exists(source))) {
          throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
          if (!recursive) {
            throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
          } else {
            yield cpDirRecursive(source, newDest, 0, force);
          }
        } else {
          if (path2.relative(source, newDest) === "") {
            throw new Error(`'${newDest}' and '${source}' are the same file`);
          }
          yield copyFile(source, newDest, force);
        }
      });
    }
    exports.cp = cp2;
    function mv(source, dest, options = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
          let destExists = true;
          if (yield ioUtil.isDirectory(dest)) {
            dest = path2.join(dest, path2.basename(source));
            destExists = yield ioUtil.exists(dest);
          }
          if (destExists) {
            if (options.force == null || options.force) {
              yield rmRF(dest);
            } else {
              throw new Error("Destination already exists");
            }
          }
        }
        yield mkdirP(path2.dirname(dest));
        yield ioUtil.rename(source, dest);
      });
    }
    exports.mv = mv;
    function rmRF(inputPath) {
      return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
          if (/[*"<>|]/.test(inputPath)) {
            throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
          }
          try {
            const cmdPath = ioUtil.getCmdPath();
            if (yield ioUtil.isDirectory(inputPath, true)) {
              yield exec(`${cmdPath} /s /c "rd /s /q "%inputPath%""`, {
                env: { inputPath }
              });
            } else {
              yield exec(`${cmdPath} /s /c "del /f /a "%inputPath%""`, {
                env: { inputPath }
              });
            }
          } catch (err) {
            if (err.code !== "ENOENT")
              throw err;
          }
          try {
            yield ioUtil.unlink(inputPath);
          } catch (err) {
            if (err.code !== "ENOENT")
              throw err;
          }
        } else {
          let isDir = false;
          try {
            isDir = yield ioUtil.isDirectory(inputPath);
          } catch (err) {
            if (err.code !== "ENOENT")
              throw err;
            return;
          }
          if (isDir) {
            yield execFile(`rm`, [`-rf`, `${inputPath}`]);
          } else {
            yield ioUtil.unlink(inputPath);
          }
        }
      });
    }
    exports.rmRF = rmRF;
    function mkdirP(fsPath) {
      return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, "a path argument must be provided");
        yield ioUtil.mkdir(fsPath, { recursive: true });
      });
    }
    exports.mkdirP = mkdirP;
    function which(tool, check) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
          throw new Error("parameter 'tool' is required");
        }
        if (check) {
          const result = yield which(tool, false);
          if (!result) {
            if (ioUtil.IS_WINDOWS) {
              throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
            } else {
              throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
            }
          }
          return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
          return matches[0];
        }
        return "";
      });
    }
    exports.which = which;
    function findInPath(tool) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
          throw new Error("parameter 'tool' is required");
        }
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env["PATHEXT"]) {
          for (const extension of process.env["PATHEXT"].split(path2.delimiter)) {
            if (extension) {
              extensions.push(extension);
            }
          }
        }
        if (ioUtil.isRooted(tool)) {
          const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
          if (filePath) {
            return [filePath];
          }
          return [];
        }
        if (tool.includes(path2.sep)) {
          return [];
        }
        const directories = [];
        if (process.env.PATH) {
          for (const p of process.env.PATH.split(path2.delimiter)) {
            if (p) {
              directories.push(p);
            }
          }
        }
        const matches = [];
        for (const directory of directories) {
          const filePath = yield ioUtil.tryGetExecutablePath(path2.join(directory, tool), extensions);
          if (filePath) {
            matches.push(filePath);
          }
        }
        return matches;
      });
    }
    exports.findInPath = findInPath;
    function readCopyOptions(options) {
      const force = options.force == null ? true : options.force;
      const recursive = Boolean(options.recursive);
      const copySourceDirectory = options.copySourceDirectory == null ? true : Boolean(options.copySourceDirectory);
      return { force, recursive, copySourceDirectory };
    }
    function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
      return __awaiter(this, void 0, void 0, function* () {
        if (currentDepth >= 255)
          return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
          const srcFile = `${sourceDir}/${fileName}`;
          const destFile = `${destDir}/${fileName}`;
          const srcFileStat = yield ioUtil.lstat(srcFile);
          if (srcFileStat.isDirectory()) {
            yield cpDirRecursive(srcFile, destFile, currentDepth, force);
          } else {
            yield copyFile(srcFile, destFile, force);
          }
        }
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
      });
    }
    function copyFile(srcFile, destFile, force) {
      return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
          try {
            yield ioUtil.lstat(destFile);
            yield ioUtil.unlink(destFile);
          } catch (e) {
            if (e.code === "EPERM") {
              yield ioUtil.chmod(destFile, "0666");
              yield ioUtil.unlink(destFile);
            }
          }
          const symlinkFull = yield ioUtil.readlink(srcFile);
          yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? "junction" : null);
        } else if (!(yield ioUtil.exists(destFile)) || force) {
          yield ioUtil.copyFile(srcFile, destFile);
        }
      });
    }
  }
});

// node_modules/@actions/tool-cache/node_modules/semver/semver.js
var require_semver = __commonJS({
  "node_modules/@actions/tool-cache/node_modules/semver/semver.js"(exports, module2) {
    exports = module2.exports = SemVer3;
    var debug;
    if (typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
      debug = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift("SEMVER");
        console.log.apply(console, args);
      };
    } else {
      debug = function() {
      };
    }
    exports.SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var re = exports.re = [];
    var src = exports.src = [];
    var t = exports.tokens = {};
    var R = 0;
    function tok(n) {
      t[n] = R++;
    }
    tok("NUMERICIDENTIFIER");
    src[t.NUMERICIDENTIFIER] = "0|[1-9]\\d*";
    tok("NUMERICIDENTIFIERLOOSE");
    src[t.NUMERICIDENTIFIERLOOSE] = "[0-9]+";
    tok("NONNUMERICIDENTIFIER");
    src[t.NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
    tok("MAINVERSION");
    src[t.MAINVERSION] = "(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")";
    tok("MAINVERSIONLOOSE");
    src[t.MAINVERSIONLOOSE] = "(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")";
    tok("PRERELEASEIDENTIFIER");
    src[t.PRERELEASEIDENTIFIER] = "(?:" + src[t.NUMERICIDENTIFIER] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
    tok("PRERELEASEIDENTIFIERLOOSE");
    src[t.PRERELEASEIDENTIFIERLOOSE] = "(?:" + src[t.NUMERICIDENTIFIERLOOSE] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
    tok("PRERELEASE");
    src[t.PRERELEASE] = "(?:-(" + src[t.PRERELEASEIDENTIFIER] + "(?:\\." + src[t.PRERELEASEIDENTIFIER] + ")*))";
    tok("PRERELEASELOOSE");
    src[t.PRERELEASELOOSE] = "(?:-?(" + src[t.PRERELEASEIDENTIFIERLOOSE] + "(?:\\." + src[t.PRERELEASEIDENTIFIERLOOSE] + ")*))";
    tok("BUILDIDENTIFIER");
    src[t.BUILDIDENTIFIER] = "[0-9A-Za-z-]+";
    tok("BUILD");
    src[t.BUILD] = "(?:\\+(" + src[t.BUILDIDENTIFIER] + "(?:\\." + src[t.BUILDIDENTIFIER] + ")*))";
    tok("FULL");
    tok("FULLPLAIN");
    src[t.FULLPLAIN] = "v?" + src[t.MAINVERSION] + src[t.PRERELEASE] + "?" + src[t.BUILD] + "?";
    src[t.FULL] = "^" + src[t.FULLPLAIN] + "$";
    tok("LOOSEPLAIN");
    src[t.LOOSEPLAIN] = "[v=\\s]*" + src[t.MAINVERSIONLOOSE] + src[t.PRERELEASELOOSE] + "?" + src[t.BUILD] + "?";
    tok("LOOSE");
    src[t.LOOSE] = "^" + src[t.LOOSEPLAIN] + "$";
    tok("GTLT");
    src[t.GTLT] = "((?:<|>)?=?)";
    tok("XRANGEIDENTIFIERLOOSE");
    src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + "|x|X|\\*";
    tok("XRANGEIDENTIFIER");
    src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + "|x|X|\\*";
    tok("XRANGEPLAIN");
    src[t.XRANGEPLAIN] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:" + src[t.PRERELEASE] + ")?" + src[t.BUILD] + "?)?)?";
    tok("XRANGEPLAINLOOSE");
    src[t.XRANGEPLAINLOOSE] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:" + src[t.PRERELEASELOOSE] + ")?" + src[t.BUILD] + "?)?)?";
    tok("XRANGE");
    src[t.XRANGE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAIN] + "$";
    tok("XRANGELOOSE");
    src[t.XRANGELOOSE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAINLOOSE] + "$";
    tok("COERCE");
    src[t.COERCE] = "(^|[^\\d])(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "})(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:$|[^\\d])";
    tok("COERCERTL");
    re[t.COERCERTL] = new RegExp(src[t.COERCE], "g");
    tok("LONETILDE");
    src[t.LONETILDE] = "(?:~>?)";
    tok("TILDETRIM");
    src[t.TILDETRIM] = "(\\s*)" + src[t.LONETILDE] + "\\s+";
    re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], "g");
    var tildeTrimReplace = "$1~";
    tok("TILDE");
    src[t.TILDE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAIN] + "$";
    tok("TILDELOOSE");
    src[t.TILDELOOSE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + "$";
    tok("LONECARET");
    src[t.LONECARET] = "(?:\\^)";
    tok("CARETTRIM");
    src[t.CARETTRIM] = "(\\s*)" + src[t.LONECARET] + "\\s+";
    re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], "g");
    var caretTrimReplace = "$1^";
    tok("CARET");
    src[t.CARET] = "^" + src[t.LONECARET] + src[t.XRANGEPLAIN] + "$";
    tok("CARETLOOSE");
    src[t.CARETLOOSE] = "^" + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + "$";
    tok("COMPARATORLOOSE");
    src[t.COMPARATORLOOSE] = "^" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + ")$|^$";
    tok("COMPARATOR");
    src[t.COMPARATOR] = "^" + src[t.GTLT] + "\\s*(" + src[t.FULLPLAIN] + ")$|^$";
    tok("COMPARATORTRIM");
    src[t.COMPARATORTRIM] = "(\\s*)" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + "|" + src[t.XRANGEPLAIN] + ")";
    re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], "g");
    var comparatorTrimReplace = "$1$2$3";
    tok("HYPHENRANGE");
    src[t.HYPHENRANGE] = "^\\s*(" + src[t.XRANGEPLAIN] + ")\\s+-\\s+(" + src[t.XRANGEPLAIN] + ")\\s*$";
    tok("HYPHENRANGELOOSE");
    src[t.HYPHENRANGELOOSE] = "^\\s*(" + src[t.XRANGEPLAINLOOSE] + ")\\s+-\\s+(" + src[t.XRANGEPLAINLOOSE] + ")\\s*$";
    tok("STAR");
    src[t.STAR] = "(<|>)?=?\\s*\\*";
    for (i = 0; i < R; i++) {
      debug(i, src[i]);
      if (!re[i]) {
        re[i] = new RegExp(src[i]);
      }
    }
    var i;
    exports.parse = parse;
    function parse(version2, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version2 instanceof SemVer3) {
        return version2;
      }
      if (typeof version2 !== "string") {
        return null;
      }
      if (version2.length > MAX_LENGTH) {
        return null;
      }
      var r = options.loose ? re[t.LOOSE] : re[t.FULL];
      if (!r.test(version2)) {
        return null;
      }
      try {
        return new SemVer3(version2, options);
      } catch (er) {
        return null;
      }
    }
    exports.valid = valid;
    function valid(version2, options) {
      var v = parse(version2, options);
      return v ? v.version : null;
    }
    exports.clean = clean;
    function clean(version2, options) {
      var s = parse(version2.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    }
    exports.SemVer = SemVer3;
    function SemVer3(version2, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version2 instanceof SemVer3) {
        if (version2.loose === options.loose) {
          return version2;
        } else {
          version2 = version2.version;
        }
      } else if (typeof version2 !== "string") {
        throw new TypeError("Invalid Version: " + version2);
      }
      if (version2.length > MAX_LENGTH) {
        throw new TypeError("version is longer than " + MAX_LENGTH + " characters");
      }
      if (!(this instanceof SemVer3)) {
        return new SemVer3(version2, options);
      }
      debug("SemVer", version2, options);
      this.options = options;
      this.loose = !!options.loose;
      var m = version2.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
      if (!m) {
        throw new TypeError("Invalid Version: " + version2);
      }
      this.raw = version2;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map(function(id) {
          if (/^[0-9]+$/.test(id)) {
            var num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    SemVer3.prototype.format = function() {
      this.version = this.major + "." + this.minor + "." + this.patch;
      if (this.prerelease.length) {
        this.version += "-" + this.prerelease.join(".");
      }
      return this.version;
    };
    SemVer3.prototype.toString = function() {
      return this.version;
    };
    SemVer3.prototype.compare = function(other) {
      debug("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer3)) {
        other = new SemVer3(other, this.options);
      }
      return this.compareMain(other) || this.comparePre(other);
    };
    SemVer3.prototype.compareMain = function(other) {
      if (!(other instanceof SemVer3)) {
        other = new SemVer3(other, this.options);
      }
      return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    };
    SemVer3.prototype.comparePre = function(other) {
      if (!(other instanceof SemVer3)) {
        other = new SemVer3(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      var i2 = 0;
      do {
        var a = this.prerelease[i2];
        var b = other.prerelease[i2];
        debug("prerelease compare", i2, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i2);
    };
    SemVer3.prototype.compareBuild = function(other) {
      if (!(other instanceof SemVer3)) {
        other = new SemVer3(other, this.options);
      }
      var i2 = 0;
      do {
        var a = this.build[i2];
        var b = other.build[i2];
        debug("prerelease compare", i2, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i2);
    };
    SemVer3.prototype.inc = function(release, identifier) {
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier);
          this.inc("pre", identifier);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier);
          }
          this.inc("pre", identifier);
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        case "pre":
          if (this.prerelease.length === 0) {
            this.prerelease = [0];
          } else {
            var i2 = this.prerelease.length;
            while (--i2 >= 0) {
              if (typeof this.prerelease[i2] === "number") {
                this.prerelease[i2]++;
                i2 = -2;
              }
            }
            if (i2 === -1) {
              this.prerelease.push(0);
            }
          }
          if (identifier) {
            if (this.prerelease[0] === identifier) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = [identifier, 0];
              }
            } else {
              this.prerelease = [identifier, 0];
            }
          }
          break;
        default:
          throw new Error("invalid increment argument: " + release);
      }
      this.format();
      this.raw = this.version;
      return this;
    };
    exports.inc = inc;
    function inc(version2, release, loose, identifier) {
      if (typeof loose === "string") {
        identifier = loose;
        loose = void 0;
      }
      try {
        return new SemVer3(version2, loose).inc(release, identifier).version;
      } catch (er) {
        return null;
      }
    }
    exports.diff = diff;
    function diff(version1, version2) {
      if (eq(version1, version2)) {
        return null;
      } else {
        var v1 = parse(version1);
        var v2 = parse(version2);
        var prefix = "";
        if (v1.prerelease.length || v2.prerelease.length) {
          prefix = "pre";
          var defaultResult = "prerelease";
        }
        for (var key in v1) {
          if (key === "major" || key === "minor" || key === "patch") {
            if (v1[key] !== v2[key]) {
              return prefix + key;
            }
          }
        }
        return defaultResult;
      }
    }
    exports.compareIdentifiers = compareIdentifiers;
    var numeric = /^[0-9]+$/;
    function compareIdentifiers(a, b) {
      var anum = numeric.test(a);
      var bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    }
    exports.rcompareIdentifiers = rcompareIdentifiers;
    function rcompareIdentifiers(a, b) {
      return compareIdentifiers(b, a);
    }
    exports.major = major;
    function major(a, loose) {
      return new SemVer3(a, loose).major;
    }
    exports.minor = minor;
    function minor(a, loose) {
      return new SemVer3(a, loose).minor;
    }
    exports.patch = patch;
    function patch(a, loose) {
      return new SemVer3(a, loose).patch;
    }
    exports.compare = compare;
    function compare(a, b, loose) {
      return new SemVer3(a, loose).compare(new SemVer3(b, loose));
    }
    exports.compareLoose = compareLoose;
    function compareLoose(a, b) {
      return compare(a, b, true);
    }
    exports.compareBuild = compareBuild;
    function compareBuild(a, b, loose) {
      var versionA = new SemVer3(a, loose);
      var versionB = new SemVer3(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    }
    exports.rcompare = rcompare;
    function rcompare(a, b, loose) {
      return compare(b, a, loose);
    }
    exports.sort = sort;
    function sort(list, loose) {
      return list.sort(function(a, b) {
        return exports.compareBuild(a, b, loose);
      });
    }
    exports.rsort = rsort;
    function rsort(list, loose) {
      return list.sort(function(a, b) {
        return exports.compareBuild(b, a, loose);
      });
    }
    exports.gt = gt;
    function gt(a, b, loose) {
      return compare(a, b, loose) > 0;
    }
    exports.lt = lt;
    function lt(a, b, loose) {
      return compare(a, b, loose) < 0;
    }
    exports.eq = eq;
    function eq(a, b, loose) {
      return compare(a, b, loose) === 0;
    }
    exports.neq = neq;
    function neq(a, b, loose) {
      return compare(a, b, loose) !== 0;
    }
    exports.gte = gte;
    function gte(a, b, loose) {
      return compare(a, b, loose) >= 0;
    }
    exports.lte = lte;
    function lte(a, b, loose) {
      return compare(a, b, loose) <= 0;
    }
    exports.cmp = cmp;
    function cmp(a, op, b, loose) {
      switch (op) {
        case "===":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a === b;
        case "!==":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError("Invalid operator: " + op);
      }
    }
    exports.Comparator = Comparator;
    function Comparator(comp, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      if (!(this instanceof Comparator)) {
        return new Comparator(comp, options);
      }
      debug("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug("comp", this);
    }
    var ANY = {};
    Comparator.prototype.parse = function(comp) {
      var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
      var m = comp.match(r);
      if (!m) {
        throw new TypeError("Invalid comparator: " + comp);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer3(m[2], this.options.loose);
      }
    };
    Comparator.prototype.toString = function() {
      return this.value;
    };
    Comparator.prototype.test = function(version2) {
      debug("Comparator.test", version2, this.options.loose);
      if (this.semver === ANY || version2 === ANY) {
        return true;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer3(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp(version2, this.operator, this.semver, this.options);
    };
    Comparator.prototype.intersects = function(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      var rangeTmp;
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        rangeTmp = new Range2(comp.value, options);
        return satisfies(this.value, rangeTmp, options);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        rangeTmp = new Range2(this.value, options);
        return satisfies(comp.semver, rangeTmp, options);
      }
      var sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
      var sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
      var sameSemVer = this.semver.version === comp.semver.version;
      var differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
      var oppositeDirectionsLessThan = cmp(this.semver, "<", comp.semver, options) && ((this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<"));
      var oppositeDirectionsGreaterThan = cmp(this.semver, ">", comp.semver, options) && ((this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">"));
      return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
    };
    exports.Range = Range2;
    function Range2(range, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (range instanceof Range2) {
        if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
          return range;
        } else {
          return new Range2(range.raw, options);
        }
      }
      if (range instanceof Comparator) {
        return new Range2(range.value, options);
      }
      if (!(this instanceof Range2)) {
        return new Range2(range, options);
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range;
      this.set = range.split(/\s*\|\|\s*/).map(function(range2) {
        return this.parseRange(range2.trim());
      }, this).filter(function(c) {
        return c.length;
      });
      if (!this.set.length) {
        throw new TypeError("Invalid SemVer Range: " + range);
      }
      this.format();
    }
    Range2.prototype.format = function() {
      this.range = this.set.map(function(comps) {
        return comps.join(" ").trim();
      }).join("||").trim();
      return this.range;
    };
    Range2.prototype.toString = function() {
      return this.range;
    };
    Range2.prototype.parseRange = function(range) {
      var loose = this.options.loose;
      range = range.trim();
      var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
      range = range.replace(hr, hyphenReplace);
      debug("hyphen replace", range);
      range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
      debug("comparator trim", range, re[t.COMPARATORTRIM]);
      range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
      range = range.replace(re[t.CARETTRIM], caretTrimReplace);
      range = range.split(/\s+/).join(" ");
      var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
      var set = range.split(" ").map(function(comp) {
        return parseComparator(comp, this.options);
      }, this).join(" ").split(/\s+/);
      if (this.options.loose) {
        set = set.filter(function(comp) {
          return !!comp.match(compRe);
        });
      }
      set = set.map(function(comp) {
        return new Comparator(comp, this.options);
      }, this);
      return set;
    };
    Range2.prototype.intersects = function(range, options) {
      if (!(range instanceof Range2)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some(function(thisComparators) {
        return isSatisfiable(thisComparators, options) && range.set.some(function(rangeComparators) {
          return isSatisfiable(rangeComparators, options) && thisComparators.every(function(thisComparator) {
            return rangeComparators.every(function(rangeComparator) {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    };
    function isSatisfiable(comparators, options) {
      var result = true;
      var remainingComparators = comparators.slice();
      var testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every(function(otherComparator) {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    }
    exports.toComparators = toComparators;
    function toComparators(range, options) {
      return new Range2(range, options).set.map(function(comp) {
        return comp.map(function(c) {
          return c.value;
        }).join(" ").trim().split(" ");
      });
    }
    function parseComparator(comp, options) {
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    }
    function isX(id) {
      return !id || id.toLowerCase() === "x" || id === "*";
    }
    function replaceTildes(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceTilde(comp2, options);
      }).join(" ");
    }
    function replaceTilde(comp, options) {
      var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug("tilde", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
        } else {
          ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
        }
        debug("tilde return", ret);
        return ret;
      });
    }
    function replaceCarets(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceCaret(comp2, options);
      }).join(" ");
    }
    function replaceCaret(comp, options) {
      debug("caret", comp, options);
      var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug("caret", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          if (M === "0") {
            ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
          } else {
            ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0";
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) + ".0.0";
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0";
          }
        }
        debug("caret return", ret);
        return ret;
      });
    }
    function replaceXRanges(comp, options) {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map(function(comp2) {
        return replaceXRange(comp2, options);
      }).join(" ");
    }
    function replaceXRange(comp, options) {
      comp = comp.trim();
      var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        var xM = isX(M);
        var xm = xM || isX(m);
        var xp = xm || isX(p);
        var anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          ret = gtlt + M + "." + m + "." + p + pr;
        } else if (xm) {
          ret = ">=" + M + ".0.0" + pr + " <" + (+M + 1) + ".0.0" + pr;
        } else if (xp) {
          ret = ">=" + M + "." + m + ".0" + pr + " <" + M + "." + (+m + 1) + ".0" + pr;
        }
        debug("xRange return", ret);
        return ret;
      });
    }
    function replaceStars(comp, options) {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    }
    function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = ">=" + fM + ".0.0";
      } else if (isX(fp)) {
        from = ">=" + fM + "." + fm + ".0";
      } else {
        from = ">=" + from;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = "<" + (+tM + 1) + ".0.0";
      } else if (isX(tp)) {
        to = "<" + tM + "." + (+tm + 1) + ".0";
      } else if (tpr) {
        to = "<=" + tM + "." + tm + "." + tp + "-" + tpr;
      } else {
        to = "<=" + to;
      }
      return (from + " " + to).trim();
    }
    Range2.prototype.test = function(version2) {
      if (!version2) {
        return false;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer3(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      for (var i2 = 0; i2 < this.set.length; i2++) {
        if (testSet(this.set[i2], version2, this.options)) {
          return true;
        }
      }
      return false;
    };
    function testSet(set, version2, options) {
      for (var i2 = 0; i2 < set.length; i2++) {
        if (!set[i2].test(version2)) {
          return false;
        }
      }
      if (version2.prerelease.length && !options.includePrerelease) {
        for (i2 = 0; i2 < set.length; i2++) {
          debug(set[i2].semver);
          if (set[i2].semver === ANY) {
            continue;
          }
          if (set[i2].semver.prerelease.length > 0) {
            var allowed = set[i2].semver;
            if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    }
    exports.satisfies = satisfies;
    function satisfies(version2, range, options) {
      try {
        range = new Range2(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version2);
    }
    exports.maxSatisfying = maxSatisfying;
    function maxSatisfying(versions, range, options) {
      var max = null;
      var maxSV = null;
      try {
        var rangeObj = new Range2(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer3(max, options);
          }
        }
      });
      return max;
    }
    exports.minSatisfying = minSatisfying;
    function minSatisfying(versions, range, options) {
      var min = null;
      var minSV = null;
      try {
        var rangeObj = new Range2(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer3(min, options);
          }
        }
      });
      return min;
    }
    exports.minVersion = minVersion;
    function minVersion(range, loose) {
      range = new Range2(range, loose);
      var minver = new SemVer3("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer3("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        comparators.forEach(function(comparator) {
          var compver = new SemVer3(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            case "":
            case ">=":
              if (!minver || gt(minver, compver)) {
                minver = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            default:
              throw new Error("Unexpected operation: " + comparator.operator);
          }
        });
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    }
    exports.validRange = validRange;
    function validRange(range, options) {
      try {
        return new Range2(range, options).range || "*";
      } catch (er) {
        return null;
      }
    }
    exports.ltr = ltr;
    function ltr(version2, range, options) {
      return outside(version2, range, "<", options);
    }
    exports.gtr = gtr;
    function gtr(version2, range, options) {
      return outside(version2, range, ">", options);
    }
    exports.outside = outside;
    function outside(version2, range, hilo, options) {
      version2 = new SemVer3(version2, options);
      range = new Range2(range, options);
      var gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version2, range, options)) {
        return false;
      }
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        var high = null;
        var low = null;
        comparators.forEach(function(comparator) {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version2, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version2, low.semver)) {
          return false;
        }
      }
      return true;
    }
    exports.prerelease = prerelease;
    function prerelease(version2, options) {
      var parsed = parse(version2, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    }
    exports.intersects = intersects;
    function intersects(r1, r2, options) {
      r1 = new Range2(r1, options);
      r2 = new Range2(r2, options);
      return r1.intersects(r2);
    }
    exports.coerce = coerce;
    function coerce(version2, options) {
      if (version2 instanceof SemVer3) {
        return version2;
      }
      if (typeof version2 === "number") {
        version2 = String(version2);
      }
      if (typeof version2 !== "string") {
        return null;
      }
      options = options || {};
      var match = null;
      if (!options.rtl) {
        match = version2.match(re[t.COERCE]);
      } else {
        var next;
        while ((next = re[t.COERCERTL].exec(version2)) && (!match || match.index + match[0].length !== version2.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
        }
        re[t.COERCERTL].lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      return parse(match[2] + "." + (match[3] || "0") + "." + (match[4] || "0"), options);
    }
  }
});

// node_modules/@actions/tool-cache/lib/manifest.js
var require_manifest = __commonJS({
  "node_modules/@actions/tool-cache/lib/manifest.js"(exports, module2) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._readLinuxVersionFile = exports._getOsVersion = exports._findMatch = void 0;
    var semver = __importStar(require_semver());
    var core_1 = require_core();
    var os = require("os");
    var cp2 = require("child_process");
    var fs = require("fs");
    function _findMatch(versionSpec, stable, candidates, archFilter) {
      return __awaiter(this, void 0, void 0, function* () {
        const platFilter = os.platform();
        let result;
        let match;
        let file;
        for (const candidate of candidates) {
          const version2 = candidate.version;
          core_1.debug(`check ${version2} satisfies ${versionSpec}`);
          if (semver.satisfies(version2, versionSpec) && (!stable || candidate.stable === stable)) {
            file = candidate.files.find((item) => {
              core_1.debug(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
              let chk = item.arch === archFilter && item.platform === platFilter;
              if (chk && item.platform_version) {
                const osVersion = module2.exports._getOsVersion();
                if (osVersion === item.platform_version) {
                  chk = true;
                } else {
                  chk = semver.satisfies(osVersion, item.platform_version);
                }
              }
              return chk;
            });
            if (file) {
              core_1.debug(`matched ${candidate.version}`);
              match = candidate;
              break;
            }
          }
        }
        if (match && file) {
          result = Object.assign({}, match);
          result.files = [file];
        }
        return result;
      });
    }
    exports._findMatch = _findMatch;
    function _getOsVersion() {
      const plat = os.platform();
      let version2 = "";
      if (plat === "darwin") {
        version2 = cp2.execSync("sw_vers -productVersion").toString();
      } else if (plat === "linux") {
        const lsbContents = module2.exports._readLinuxVersionFile();
        if (lsbContents) {
          const lines = lsbContents.split("\n");
          for (const line of lines) {
            const parts = line.split("=");
            if (parts.length === 2 && (parts[0].trim() === "VERSION_ID" || parts[0].trim() === "DISTRIB_RELEASE")) {
              version2 = parts[1].trim().replace(/^"/, "").replace(/"$/, "");
              break;
            }
          }
        }
      }
      return version2;
    }
    exports._getOsVersion = _getOsVersion;
    function _readLinuxVersionFile() {
      const lsbReleaseFile = "/etc/lsb-release";
      const osReleaseFile = "/etc/os-release";
      let contents = "";
      if (fs.existsSync(lsbReleaseFile)) {
        contents = fs.readFileSync(lsbReleaseFile).toString();
      } else if (fs.existsSync(osReleaseFile)) {
        contents = fs.readFileSync(osReleaseFile).toString();
      }
      return contents;
    }
    exports._readLinuxVersionFile = _readLinuxVersionFile;
  }
});

// node_modules/uuid/lib/rng.js
var require_rng = __commonJS({
  "node_modules/uuid/lib/rng.js"(exports, module2) {
    var crypto = require("crypto");
    module2.exports = function nodeRNG() {
      return crypto.randomBytes(16);
    };
  }
});

// node_modules/uuid/lib/bytesToUuid.js
var require_bytesToUuid = __commonJS({
  "node_modules/uuid/lib/bytesToUuid.js"(exports, module2) {
    var byteToHex = [];
    for (i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 256).toString(16).substr(1);
    }
    var i;
    function bytesToUuid(buf, offset) {
      var i2 = offset || 0;
      var bth = byteToHex;
      return [
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]]
      ].join("");
    }
    module2.exports = bytesToUuid;
  }
});

// node_modules/uuid/v4.js
var require_v4 = __commonJS({
  "node_modules/uuid/v4.js"(exports, module2) {
    var rng = require_rng();
    var bytesToUuid = require_bytesToUuid();
    function v4(options, buf, offset) {
      var i = buf && offset || 0;
      if (typeof options == "string") {
        buf = options === "binary" ? new Array(16) : null;
        options = null;
      }
      options = options || {};
      var rnds = options.random || (options.rng || rng)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }
      return buf || bytesToUuid(rnds);
    }
    module2.exports = v4;
  }
});

// node_modules/@actions/exec/lib/toolrunner.js
var require_toolrunner = __commonJS({
  "node_modules/@actions/exec/lib/toolrunner.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.argStringToArray = exports.ToolRunner = void 0;
    var os = __importStar(require("os"));
    var events = __importStar(require("events"));
    var child = __importStar(require("child_process"));
    var path2 = __importStar(require("path"));
    var io = __importStar(require_io());
    var ioUtil = __importStar(require_io_util());
    var timers_1 = require("timers");
    var IS_WINDOWS = process.platform === "win32";
    var ToolRunner = class extends events.EventEmitter {
      constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
          throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
      }
      _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
          this.options.listeners.debug(message);
        }
      }
      _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? "" : "[command]";
        if (IS_WINDOWS) {
          if (this._isCmdFile()) {
            cmd += toolPath;
            for (const a of args) {
              cmd += ` ${a}`;
            }
          } else if (options.windowsVerbatimArguments) {
            cmd += `"${toolPath}"`;
            for (const a of args) {
              cmd += ` ${a}`;
            }
          } else {
            cmd += this._windowsQuoteCmdArg(toolPath);
            for (const a of args) {
              cmd += ` ${this._windowsQuoteCmdArg(a)}`;
            }
          }
        } else {
          cmd += toolPath;
          for (const a of args) {
            cmd += ` ${a}`;
          }
        }
        return cmd;
      }
      _processLineBuffer(data, strBuffer, onLine) {
        try {
          let s = strBuffer + data.toString();
          let n = s.indexOf(os.EOL);
          while (n > -1) {
            const line = s.substring(0, n);
            onLine(line);
            s = s.substring(n + os.EOL.length);
            n = s.indexOf(os.EOL);
          }
          return s;
        } catch (err) {
          this._debug(`error processing line. Failed with error ${err}`);
          return "";
        }
      }
      _getSpawnFileName() {
        if (IS_WINDOWS) {
          if (this._isCmdFile()) {
            return process.env["COMSPEC"] || "cmd.exe";
          }
        }
        return this.toolPath;
      }
      _getSpawnArgs(options) {
        if (IS_WINDOWS) {
          if (this._isCmdFile()) {
            let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
            for (const a of this.args) {
              argline += " ";
              argline += options.windowsVerbatimArguments ? a : this._windowsQuoteCmdArg(a);
            }
            argline += '"';
            return [argline];
          }
        }
        return this.args;
      }
      _endsWith(str, end) {
        return str.endsWith(end);
      }
      _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return this._endsWith(upperToolPath, ".CMD") || this._endsWith(upperToolPath, ".BAT");
      }
      _windowsQuoteCmdArg(arg) {
        if (!this._isCmdFile()) {
          return this._uvQuoteCmdArg(arg);
        }
        if (!arg) {
          return '""';
        }
        const cmdSpecialChars = [
          " ",
          "	",
          "&",
          "(",
          ")",
          "[",
          "]",
          "{",
          "}",
          "^",
          "=",
          ";",
          "!",
          "'",
          "+",
          ",",
          "`",
          "~",
          "|",
          "<",
          ">",
          '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
          if (cmdSpecialChars.some((x) => x === char)) {
            needsQuotes = true;
            break;
          }
        }
        if (!needsQuotes) {
          return arg;
        }
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
          reverse += arg[i - 1];
          if (quoteHit && arg[i - 1] === "\\") {
            reverse += "\\";
          } else if (arg[i - 1] === '"') {
            quoteHit = true;
            reverse += '"';
          } else {
            quoteHit = false;
          }
        }
        reverse += '"';
        return reverse.split("").reverse().join("");
      }
      _uvQuoteCmdArg(arg) {
        if (!arg) {
          return '""';
        }
        if (!arg.includes(" ") && !arg.includes("	") && !arg.includes('"')) {
          return arg;
        }
        if (!arg.includes('"') && !arg.includes("\\")) {
          return `"${arg}"`;
        }
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
          reverse += arg[i - 1];
          if (quoteHit && arg[i - 1] === "\\") {
            reverse += "\\";
          } else if (arg[i - 1] === '"') {
            quoteHit = true;
            reverse += "\\";
          } else {
            quoteHit = false;
          }
        }
        reverse += '"';
        return reverse.split("").reverse().join("");
      }
      _cloneExecOptions(options) {
        options = options || {};
        const result = {
          cwd: options.cwd || process.cwd(),
          env: options.env || process.env,
          silent: options.silent || false,
          windowsVerbatimArguments: options.windowsVerbatimArguments || false,
          failOnStdErr: options.failOnStdErr || false,
          ignoreReturnCode: options.ignoreReturnCode || false,
          delay: options.delay || 1e4
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
      }
      _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result["windowsVerbatimArguments"] = options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
          result.argv0 = `"${toolPath}"`;
        }
        return result;
      }
      exec() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!ioUtil.isRooted(this.toolPath) && (this.toolPath.includes("/") || IS_WINDOWS && this.toolPath.includes("\\"))) {
            this.toolPath = path2.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
          }
          this.toolPath = yield io.which(this.toolPath, true);
          return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this._debug(`exec tool: ${this.toolPath}`);
            this._debug("arguments:");
            for (const arg of this.args) {
              this._debug(`   ${arg}`);
            }
            const optionsNonNull = this._cloneExecOptions(this.options);
            if (!optionsNonNull.silent && optionsNonNull.outStream) {
              optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
            }
            const state = new ExecState(optionsNonNull, this.toolPath);
            state.on("debug", (message) => {
              this._debug(message);
            });
            if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
              return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
            }
            const fileName = this._getSpawnFileName();
            const cp2 = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
            let stdbuffer = "";
            if (cp2.stdout) {
              cp2.stdout.on("data", (data) => {
                if (this.options.listeners && this.options.listeners.stdout) {
                  this.options.listeners.stdout(data);
                }
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                  optionsNonNull.outStream.write(data);
                }
                stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                  if (this.options.listeners && this.options.listeners.stdline) {
                    this.options.listeners.stdline(line);
                  }
                });
              });
            }
            let errbuffer = "";
            if (cp2.stderr) {
              cp2.stderr.on("data", (data) => {
                state.processStderr = true;
                if (this.options.listeners && this.options.listeners.stderr) {
                  this.options.listeners.stderr(data);
                }
                if (!optionsNonNull.silent && optionsNonNull.errStream && optionsNonNull.outStream) {
                  const s = optionsNonNull.failOnStdErr ? optionsNonNull.errStream : optionsNonNull.outStream;
                  s.write(data);
                }
                errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                  if (this.options.listeners && this.options.listeners.errline) {
                    this.options.listeners.errline(line);
                  }
                });
              });
            }
            cp2.on("error", (err) => {
              state.processError = err.message;
              state.processExited = true;
              state.processClosed = true;
              state.CheckComplete();
            });
            cp2.on("exit", (code) => {
              state.processExitCode = code;
              state.processExited = true;
              this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
              state.CheckComplete();
            });
            cp2.on("close", (code) => {
              state.processExitCode = code;
              state.processExited = true;
              state.processClosed = true;
              this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
              state.CheckComplete();
            });
            state.on("done", (error, exitCode) => {
              if (stdbuffer.length > 0) {
                this.emit("stdline", stdbuffer);
              }
              if (errbuffer.length > 0) {
                this.emit("errline", errbuffer);
              }
              cp2.removeAllListeners();
              if (error) {
                reject(error);
              } else {
                resolve(exitCode);
              }
            });
            if (this.options.input) {
              if (!cp2.stdin) {
                throw new Error("child process missing stdin");
              }
              cp2.stdin.end(this.options.input);
            }
          }));
        });
      }
    };
    exports.ToolRunner = ToolRunner;
    function argStringToArray(argString) {
      const args = [];
      let inQuotes = false;
      let escaped = false;
      let arg = "";
      function append(c) {
        if (escaped && c !== '"') {
          arg += "\\";
        }
        arg += c;
        escaped = false;
      }
      for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
          if (!escaped) {
            inQuotes = !inQuotes;
          } else {
            append(c);
          }
          continue;
        }
        if (c === "\\" && escaped) {
          append(c);
          continue;
        }
        if (c === "\\" && inQuotes) {
          escaped = true;
          continue;
        }
        if (c === " " && !inQuotes) {
          if (arg.length > 0) {
            args.push(arg);
            arg = "";
          }
          continue;
        }
        append(c);
      }
      if (arg.length > 0) {
        args.push(arg.trim());
      }
      return args;
    }
    exports.argStringToArray = argStringToArray;
    var ExecState = class extends events.EventEmitter {
      constructor(options, toolPath) {
        super();
        this.processClosed = false;
        this.processError = "";
        this.processExitCode = 0;
        this.processExited = false;
        this.processStderr = false;
        this.delay = 1e4;
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
          throw new Error("toolPath must not be empty");
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
          this.delay = options.delay;
        }
      }
      CheckComplete() {
        if (this.done) {
          return;
        }
        if (this.processClosed) {
          this._setResult();
        } else if (this.processExited) {
          this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
      }
      _debug(message) {
        this.emit("debug", message);
      }
      _setResult() {
        let error;
        if (this.processExited) {
          if (this.processError) {
            error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
          } else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
            error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
          } else if (this.processStderr && this.options.failOnStdErr) {
            error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
          }
        }
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
        this.done = true;
        this.emit("done", error, this.processExitCode);
      }
      static HandleTimeout(state) {
        if (state.done) {
          return;
        }
        if (!state.processClosed && state.processExited) {
          const message = `The STDIO streams did not close within ${state.delay / 1e3} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
          state._debug(message);
        }
        state._setResult();
      }
    };
  }
});

// node_modules/@actions/exec/lib/exec.js
var require_exec = __commonJS({
  "node_modules/@actions/exec/lib/exec.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getExecOutput = exports.exec = void 0;
    var string_decoder_1 = require("string_decoder");
    var tr = __importStar(require_toolrunner());
    function exec(commandLine, args, options) {
      return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
          throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
      });
    }
    exports.exec = exec;
    function getExecOutput(commandLine, args, options) {
      var _a, _b;
      return __awaiter(this, void 0, void 0, function* () {
        let stdout = "";
        let stderr = "";
        const stdoutDecoder = new string_decoder_1.StringDecoder("utf8");
        const stderrDecoder = new string_decoder_1.StringDecoder("utf8");
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
          stderr += stderrDecoder.write(data);
          if (originalStdErrListener) {
            originalStdErrListener(data);
          }
        };
        const stdOutListener = (data) => {
          stdout += stdoutDecoder.write(data);
          if (originalStdoutListener) {
            originalStdoutListener(data);
          }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
          exitCode,
          stdout,
          stderr
        };
      });
    }
    exports.getExecOutput = getExecOutput;
  }
});

// node_modules/@actions/tool-cache/lib/retry-helper.js
var require_retry_helper = __commonJS({
  "node_modules/@actions/tool-cache/lib/retry-helper.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RetryHelper = void 0;
    var core3 = __importStar(require_core());
    var RetryHelper = class {
      constructor(maxAttempts, minSeconds, maxSeconds) {
        if (maxAttempts < 1) {
          throw new Error("max attempts should be greater than or equal to 1");
        }
        this.maxAttempts = maxAttempts;
        this.minSeconds = Math.floor(minSeconds);
        this.maxSeconds = Math.floor(maxSeconds);
        if (this.minSeconds > this.maxSeconds) {
          throw new Error("min seconds should be less than or equal to max seconds");
        }
      }
      execute(action, isRetryable) {
        return __awaiter(this, void 0, void 0, function* () {
          let attempt = 1;
          while (attempt < this.maxAttempts) {
            try {
              return yield action();
            } catch (err) {
              if (isRetryable && !isRetryable(err)) {
                throw err;
              }
              core3.info(err.message);
            }
            const seconds = this.getSleepAmount();
            core3.info(`Waiting ${seconds} seconds before trying again`);
            yield this.sleep(seconds);
            attempt++;
          }
          return yield action();
        });
      }
      getSleepAmount() {
        return Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) + this.minSeconds;
      }
      sleep(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
        });
      }
    };
    exports.RetryHelper = RetryHelper;
  }
});

// node_modules/@actions/tool-cache/lib/tool-cache.js
var require_tool_cache = __commonJS({
  "node_modules/@actions/tool-cache/lib/tool-cache.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.evaluateVersions = exports.isExplicitVersion = exports.findFromManifest = exports.getManifestFromRepo = exports.findAllVersions = exports.find = exports.cacheFile = exports.cacheDir = exports.extractZip = exports.extractXar = exports.extractTar = exports.extract7z = exports.downloadTool = exports.HTTPError = void 0;
    var core3 = __importStar(require_core());
    var io = __importStar(require_io());
    var fs = __importStar(require("fs"));
    var mm = __importStar(require_manifest());
    var os = __importStar(require("os"));
    var path2 = __importStar(require("path"));
    var httpm = __importStar(require_http_client());
    var semver = __importStar(require_semver());
    var stream = __importStar(require("stream"));
    var util = __importStar(require("util"));
    var v4_1 = __importDefault(require_v4());
    var exec_1 = require_exec();
    var assert_1 = require("assert");
    var retry_helper_1 = require_retry_helper();
    var HTTPError = class extends Error {
      constructor(httpStatusCode) {
        super(`Unexpected HTTP response: ${httpStatusCode}`);
        this.httpStatusCode = httpStatusCode;
        Object.setPrototypeOf(this, new.target.prototype);
      }
    };
    exports.HTTPError = HTTPError;
    var IS_WINDOWS = process.platform === "win32";
    var IS_MAC = process.platform === "darwin";
    var userAgent = "actions/tool-cache";
    function downloadTool2(url, dest, auth, headers) {
      return __awaiter(this, void 0, void 0, function* () {
        dest = dest || path2.join(_getTempDirectory(), v4_1.default());
        yield io.mkdirP(path2.dirname(dest));
        core3.debug(`Downloading ${url}`);
        core3.debug(`Destination ${dest}`);
        const maxAttempts = 3;
        const minSeconds = _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS", 10);
        const maxSeconds = _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS", 20);
        const retryHelper = new retry_helper_1.RetryHelper(maxAttempts, minSeconds, maxSeconds);
        return yield retryHelper.execute(() => __awaiter(this, void 0, void 0, function* () {
          return yield downloadToolAttempt(url, dest || "", auth, headers);
        }), (err) => {
          if (err instanceof HTTPError && err.httpStatusCode) {
            if (err.httpStatusCode < 500 && err.httpStatusCode !== 408 && err.httpStatusCode !== 429) {
              return false;
            }
          }
          return true;
        });
      });
    }
    exports.downloadTool = downloadTool2;
    function downloadToolAttempt(url, dest, auth, headers) {
      return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(dest)) {
          throw new Error(`Destination file path ${dest} already exists`);
        }
        const http = new httpm.HttpClient(userAgent, [], {
          allowRetries: false
        });
        if (auth) {
          core3.debug("set auth");
          if (headers === void 0) {
            headers = {};
          }
          headers.authorization = auth;
        }
        const response = yield http.get(url, headers);
        if (response.message.statusCode !== 200) {
          const err = new HTTPError(response.message.statusCode);
          core3.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
          throw err;
        }
        const pipeline = util.promisify(stream.pipeline);
        const responseMessageFactory = _getGlobal("TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY", () => response.message);
        const readStream = responseMessageFactory();
        let succeeded = false;
        try {
          yield pipeline(readStream, fs.createWriteStream(dest));
          core3.debug("download complete");
          succeeded = true;
          return dest;
        } finally {
          if (!succeeded) {
            core3.debug("download failed");
            try {
              yield io.rmRF(dest);
            } catch (err) {
              core3.debug(`Failed to delete '${dest}'. ${err.message}`);
            }
          }
        }
      });
    }
    function extract7z(file, dest, _7zPath) {
      return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_WINDOWS, "extract7z() not supported on current OS");
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        const originalCwd = process.cwd();
        process.chdir(dest);
        if (_7zPath) {
          try {
            const logLevel = core3.isDebug() ? "-bb1" : "-bb0";
            const args = [
              "x",
              logLevel,
              "-bd",
              "-sccUTF-8",
              file
            ];
            const options = {
              silent: true
            };
            yield exec_1.exec(`"${_7zPath}"`, args, options);
          } finally {
            process.chdir(originalCwd);
          }
        } else {
          const escapedScript = path2.join(__dirname, "..", "scripts", "Invoke-7zdec.ps1").replace(/'/g, "''").replace(/"|\n|\r/g, "");
          const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, "");
          const escapedTarget = dest.replace(/'/g, "''").replace(/"|\n|\r/g, "");
          const command2 = `& '${escapedScript}' -Source '${escapedFile}' -Target '${escapedTarget}'`;
          const args = [
            "-NoLogo",
            "-Sta",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Unrestricted",
            "-Command",
            command2
          ];
          const options = {
            silent: true
          };
          try {
            const powershellPath = yield io.which("powershell", true);
            yield exec_1.exec(`"${powershellPath}"`, args, options);
          } finally {
            process.chdir(originalCwd);
          }
        }
        return dest;
      });
    }
    exports.extract7z = extract7z;
    function extractTar2(file, dest, flags = "xz") {
      return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
          throw new Error("parameter 'file' is required");
        }
        dest = yield _createExtractFolder(dest);
        core3.debug("Checking tar --version");
        let versionOutput = "";
        yield exec_1.exec("tar --version", [], {
          ignoreReturnCode: true,
          silent: true,
          listeners: {
            stdout: (data) => versionOutput += data.toString(),
            stderr: (data) => versionOutput += data.toString()
          }
        });
        core3.debug(versionOutput.trim());
        const isGnuTar = versionOutput.toUpperCase().includes("GNU TAR");
        let args;
        if (flags instanceof Array) {
          args = flags;
        } else {
          args = [flags];
        }
        if (core3.isDebug() && !flags.includes("v")) {
          args.push("-v");
        }
        let destArg = dest;
        let fileArg = file;
        if (IS_WINDOWS && isGnuTar) {
          args.push("--force-local");
          destArg = dest.replace(/\\/g, "/");
          fileArg = file.replace(/\\/g, "/");
        }
        if (isGnuTar) {
          args.push("--warning=no-unknown-keyword");
          args.push("--overwrite");
        }
        args.push("-C", destArg, "-f", fileArg);
        yield exec_1.exec(`tar`, args);
        return dest;
      });
    }
    exports.extractTar = extractTar2;
    function extractXar(file, dest, flags = []) {
      return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_MAC, "extractXar() not supported on current OS");
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        let args;
        if (flags instanceof Array) {
          args = flags;
        } else {
          args = [flags];
        }
        args.push("-x", "-C", dest, "-f", file);
        if (core3.isDebug()) {
          args.push("-v");
        }
        const xarPath = yield io.which("xar", true);
        yield exec_1.exec(`"${xarPath}"`, _unique(args));
        return dest;
      });
    }
    exports.extractXar = extractXar;
    function extractZip(file, dest) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
          throw new Error("parameter 'file' is required");
        }
        dest = yield _createExtractFolder(dest);
        if (IS_WINDOWS) {
          yield extractZipWin(file, dest);
        } else {
          yield extractZipNix(file, dest);
        }
        return dest;
      });
    }
    exports.extractZip = extractZip;
    function extractZipWin(file, dest) {
      return __awaiter(this, void 0, void 0, function* () {
        const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, "");
        const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, "");
        const pwshPath = yield io.which("pwsh", false);
        if (pwshPath) {
          const pwshCommand = [
            `$ErrorActionPreference = 'Stop' ;`,
            `try { Add-Type -AssemblyName System.IO.Compression.ZipFile } catch { } ;`,
            `try { [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`,
            `catch { if (($_.Exception.GetType().FullName -eq 'System.Management.Automation.MethodException') -or ($_.Exception.GetType().FullName -eq 'System.Management.Automation.RuntimeException') ){ Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force } else { throw $_ } } ;`
          ].join(" ");
          const args = [
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Unrestricted",
            "-Command",
            pwshCommand
          ];
          core3.debug(`Using pwsh at path: ${pwshPath}`);
          yield exec_1.exec(`"${pwshPath}"`, args);
        } else {
          const powershellCommand = [
            `$ErrorActionPreference = 'Stop' ;`,
            `try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ;`,
            `if ((Get-Command -Name Expand-Archive -Module Microsoft.PowerShell.Archive -ErrorAction Ignore)) { Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force }`,
            `else {[System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`
          ].join(" ");
          const args = [
            "-NoLogo",
            "-Sta",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Unrestricted",
            "-Command",
            powershellCommand
          ];
          const powershellPath = yield io.which("powershell", true);
          core3.debug(`Using powershell at path: ${powershellPath}`);
          yield exec_1.exec(`"${powershellPath}"`, args);
        }
      });
    }
    function extractZipNix(file, dest) {
      return __awaiter(this, void 0, void 0, function* () {
        const unzipPath = yield io.which("unzip", true);
        const args = [file];
        if (!core3.isDebug()) {
          args.unshift("-q");
        }
        args.unshift("-o");
        yield exec_1.exec(`"${unzipPath}"`, args, { cwd: dest });
      });
    }
    function cacheDir(sourceDir, tool, version2, arch) {
      return __awaiter(this, void 0, void 0, function* () {
        version2 = semver.clean(version2) || version2;
        arch = arch || os.arch();
        core3.debug(`Caching tool ${tool} ${version2} ${arch}`);
        core3.debug(`source dir: ${sourceDir}`);
        if (!fs.statSync(sourceDir).isDirectory()) {
          throw new Error("sourceDir is not a directory");
        }
        const destPath = yield _createToolPath(tool, version2, arch);
        for (const itemName of fs.readdirSync(sourceDir)) {
          const s = path2.join(sourceDir, itemName);
          yield io.cp(s, destPath, { recursive: true });
        }
        _completeToolPath(tool, version2, arch);
        return destPath;
      });
    }
    exports.cacheDir = cacheDir;
    function cacheFile(sourceFile, targetFile, tool, version2, arch) {
      return __awaiter(this, void 0, void 0, function* () {
        version2 = semver.clean(version2) || version2;
        arch = arch || os.arch();
        core3.debug(`Caching tool ${tool} ${version2} ${arch}`);
        core3.debug(`source file: ${sourceFile}`);
        if (!fs.statSync(sourceFile).isFile()) {
          throw new Error("sourceFile is not a file");
        }
        const destFolder = yield _createToolPath(tool, version2, arch);
        const destPath = path2.join(destFolder, targetFile);
        core3.debug(`destination file ${destPath}`);
        yield io.cp(sourceFile, destPath);
        _completeToolPath(tool, version2, arch);
        return destFolder;
      });
    }
    exports.cacheFile = cacheFile;
    function find(toolName, versionSpec, arch) {
      if (!toolName) {
        throw new Error("toolName parameter is required");
      }
      if (!versionSpec) {
        throw new Error("versionSpec parameter is required");
      }
      arch = arch || os.arch();
      if (!isExplicitVersion(versionSpec)) {
        const localVersions = findAllVersions(toolName, arch);
        const match = evaluateVersions(localVersions, versionSpec);
        versionSpec = match;
      }
      let toolPath = "";
      if (versionSpec) {
        versionSpec = semver.clean(versionSpec) || "";
        const cachePath = path2.join(_getCacheDirectory(), toolName, versionSpec, arch);
        core3.debug(`checking cache: ${cachePath}`);
        if (fs.existsSync(cachePath) && fs.existsSync(`${cachePath}.complete`)) {
          core3.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
          toolPath = cachePath;
        } else {
          core3.debug("not found");
        }
      }
      return toolPath;
    }
    exports.find = find;
    function findAllVersions(toolName, arch) {
      const versions = [];
      arch = arch || os.arch();
      const toolPath = path2.join(_getCacheDirectory(), toolName);
      if (fs.existsSync(toolPath)) {
        const children = fs.readdirSync(toolPath);
        for (const child of children) {
          if (isExplicitVersion(child)) {
            const fullPath = path2.join(toolPath, child, arch || "");
            if (fs.existsSync(fullPath) && fs.existsSync(`${fullPath}.complete`)) {
              versions.push(child);
            }
          }
        }
      }
      return versions;
    }
    exports.findAllVersions = findAllVersions;
    function getManifestFromRepo(owner, repo, auth, branch = "master") {
      return __awaiter(this, void 0, void 0, function* () {
        let releases = [];
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`;
        const http = new httpm.HttpClient("tool-cache");
        const headers = {};
        if (auth) {
          core3.debug("set auth");
          headers.authorization = auth;
        }
        const response = yield http.getJson(treeUrl, headers);
        if (!response.result) {
          return releases;
        }
        let manifestUrl = "";
        for (const item of response.result.tree) {
          if (item.path === "versions-manifest.json") {
            manifestUrl = item.url;
            break;
          }
        }
        headers["accept"] = "application/vnd.github.VERSION.raw";
        let versionsRaw = yield (yield http.get(manifestUrl, headers)).readBody();
        if (versionsRaw) {
          versionsRaw = versionsRaw.replace(/^\uFEFF/, "");
          try {
            releases = JSON.parse(versionsRaw);
          } catch (_a) {
            core3.debug("Invalid json");
          }
        }
        return releases;
      });
    }
    exports.getManifestFromRepo = getManifestFromRepo;
    function findFromManifest(versionSpec, stable, manifest, archFilter = os.arch()) {
      return __awaiter(this, void 0, void 0, function* () {
        const match = yield mm._findMatch(versionSpec, stable, manifest, archFilter);
        return match;
      });
    }
    exports.findFromManifest = findFromManifest;
    function _createExtractFolder(dest) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!dest) {
          dest = path2.join(_getTempDirectory(), v4_1.default());
        }
        yield io.mkdirP(dest);
        return dest;
      });
    }
    function _createToolPath(tool, version2, arch) {
      return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path2.join(_getCacheDirectory(), tool, semver.clean(version2) || version2, arch || "");
        core3.debug(`destination ${folderPath}`);
        const markerPath = `${folderPath}.complete`;
        yield io.rmRF(folderPath);
        yield io.rmRF(markerPath);
        yield io.mkdirP(folderPath);
        return folderPath;
      });
    }
    function _completeToolPath(tool, version2, arch) {
      const folderPath = path2.join(_getCacheDirectory(), tool, semver.clean(version2) || version2, arch || "");
      const markerPath = `${folderPath}.complete`;
      fs.writeFileSync(markerPath, "");
      core3.debug("finished caching tool");
    }
    function isExplicitVersion(versionSpec) {
      const c = semver.clean(versionSpec) || "";
      core3.debug(`isExplicit: ${c}`);
      const valid = semver.valid(c) != null;
      core3.debug(`explicit? ${valid}`);
      return valid;
    }
    exports.isExplicitVersion = isExplicitVersion;
    function evaluateVersions(versions, versionSpec) {
      let version2 = "";
      core3.debug(`evaluating ${versions.length} versions`);
      versions = versions.sort((a, b) => {
        if (semver.gt(a, b)) {
          return 1;
        }
        return -1;
      });
      for (let i = versions.length - 1; i >= 0; i--) {
        const potential = versions[i];
        const satisfied = semver.satisfies(potential, versionSpec);
        if (satisfied) {
          version2 = potential;
          break;
        }
      }
      if (version2) {
        core3.debug(`matched: ${version2}`);
      } else {
        core3.debug("match not found");
      }
      return version2;
    }
    exports.evaluateVersions = evaluateVersions;
    function _getCacheDirectory() {
      const cacheDirectory = process.env["RUNNER_TOOL_CACHE"] || "";
      assert_1.ok(cacheDirectory, "Expected RUNNER_TOOL_CACHE to be defined");
      return cacheDirectory;
    }
    function _getTempDirectory() {
      const tempDirectory = process.env["RUNNER_TEMP"] || "";
      assert_1.ok(tempDirectory, "Expected RUNNER_TEMP to be defined");
      return tempDirectory;
    }
    function _getGlobal(key, defaultValue) {
      const value = global[key];
      return value !== void 0 ? value : defaultValue;
    }
    function _unique(values) {
      return Array.from(new Set(values));
    }
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports, module2) {
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module2.exports = debug;
  }
});

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/semver/internal/constants.js"(exports, module2) {
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    module2.exports = {
      SEMVER_SPEC_VERSION,
      MAX_LENGTH,
      MAX_SAFE_INTEGER,
      MAX_SAFE_COMPONENT_LENGTH
    };
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports, module2) {
    var { MAX_SAFE_COMPONENT_LENGTH } = require_constants();
    var debug = require_debug();
    exports = module2.exports = {};
    var re = exports.re = [];
    var src = exports.src = [];
    var t = exports.t = {};
    var R = 0;
    var createToken = (name, value, isGlobal) => {
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "[0-9]+");
    createToken("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*");
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", "[0-9A-Za-z-]+");
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCE", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports, module2) {
    var opts = ["includePrerelease", "loose", "rtl"];
    var parseOptions = (options) => !options ? {} : typeof options !== "object" ? { loose: true } : opts.filter((k) => options[k]).reduce((o, k) => {
      o[k] = true;
      return o;
    }, {});
    module2.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports, module2) {
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver2 = __commonJS({
  "node_modules/semver/classes/semver.js"(exports, module2) {
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer3 = class {
      constructor(version2, options) {
        options = parseOptions(options);
        if (version2 instanceof SemVer3) {
          if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
            return version2;
          } else {
            version2 = version2.version;
          }
        } else if (typeof version2 !== "string") {
          throw new TypeError(`Invalid Version: ${version2}`);
        }
        if (version2.length > MAX_LENGTH) {
          throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug("SemVer", version2, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version2.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version2}`);
        }
        this.raw = version2;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof SemVer3)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new SemVer3(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof SemVer3)) {
          other = new SemVer3(other, this.options);
        }
        return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
      }
      comparePre(other) {
        if (!(other instanceof SemVer3)) {
          other = new SemVer3(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof SemVer3)) {
          other = new SemVer3(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      inc(release, identifier) {
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier);
            this.inc("pre", identifier);
            break;
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier);
            }
            this.inc("pre", identifier);
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          case "pre":
            if (this.prerelease.length === 0) {
              this.prerelease = [0];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                this.prerelease.push(0);
              }
            }
            if (identifier) {
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = [identifier, 0];
                }
              } else {
                this.prerelease = [identifier, 0];
              }
            }
            break;
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.format();
        this.raw = this.version;
        return this;
      }
    };
    module2.exports = SemVer3;
  }
});

// node_modules/string-argv/index.js
var require_string_argv = __commonJS({
  "node_modules/string-argv/index.js"(exports) {
    "use strict";
    exports.__esModule = true;
    function parseArgsStringToArgv(value, env, file) {
      var myRegexp = /([^\s'"]([^\s'"]*(['"])([^\3]*?)\3)+[^\s'"]*)|[^\s'"]+|(['"])([^\5]*?)\5/gi;
      var myString = value;
      var myArray = [];
      if (env) {
        myArray.push(env);
      }
      if (file) {
        myArray.push(file);
      }
      var match;
      do {
        match = myRegexp.exec(myString);
        if (match !== null) {
          myArray.push(firstString(match[1], match[6], match[0]));
        }
      } while (match !== null);
      return myArray;
    }
    exports["default"] = parseArgsStringToArgv;
    exports.parseArgsStringToArgv = parseArgsStringToArgv;
    function firstString() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (typeof arg === "string") {
          return arg;
        }
      }
    }
  }
});

// node_modules/myzod/libs/types.js
var require_types = __commonJS({
  "node_modules/myzod/libs/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LazyType = exports.PartialType = exports.EnumType = exports.IntersectionType = exports.UnionType = exports.TupleType = exports.ArrayType = exports.ObjectType = exports.keySignature = exports.DateType = exports.NullableType = exports.OptionalType = exports.UnknownType = exports.LiteralType = exports.NullType = exports.UndefinedType = exports.BigIntType = exports.NumberType = exports.BooleanType = exports.StringType = exports.ValidationError = exports.Type = void 0;
    function clone(value) {
      if (typeof value !== "object" || value === null) {
        return value;
      }
      if (Array.isArray(value)) {
        return value.map((elem) => clone(elem));
      }
      const cpy = /* @__PURE__ */ Object.create(null);
      for (const k in value) {
        cpy[k] = clone(value[k]);
      }
      for (const s of Object.getOwnPropertySymbols(value)) {
        cpy[s] = clone(value[s]);
      }
      Object.setPrototypeOf(cpy, Object.getPrototypeOf(value));
      return cpy;
    }
    var typeErrSym = Symbol("typeError");
    var coercionTypeSymbol = Symbol("coercion");
    var Type = class {
      constructor() {
      }
      or(schema) {
        return new UnionType([this, schema]);
      }
      optional() {
        if (this instanceof OptionalType) {
          return clone(this);
        }
        return new OptionalType(this);
      }
      nullable() {
        if (this instanceof NullableType) {
          return clone(this);
        }
        return new NullableType(this);
      }
      try(value) {
        try {
          return this.parse.apply(this, arguments);
        } catch (err) {
          return err;
        }
      }
      map(fn) {
        return new MTypeClass(this, fn);
      }
      onTypeError(msg) {
        const cpy = clone(this);
        cpy[typeErrSym] = msg;
        return cpy;
      }
      typeError(msg) {
        const errMsg = (() => {
          const typErrValue = this[typeErrSym];
          if (typErrValue === void 0) {
            return msg;
          }
          if (typeof typErrValue === "function") {
            return typErrValue();
          }
          return typErrValue;
        })();
        return new ValidationError(errMsg);
      }
    };
    exports.Type = Type;
    var MTypeClass = class extends Type {
      constructor(schema, mapFn) {
        super();
        this.schema = schema;
        this.mapFn = mapFn;
        this.predicates = null;
        this[coercionTypeSymbol] = true;
      }
      parse(value) {
        const ret = value === void 0 && this.defaultValue ? typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue : this.mapFn(this.schema.parse(value));
        if (this.predicates) {
          applyPredicates(this.predicates, ret);
        }
        return ret;
      }
      and(other) {
        throw new Error("mapped types cannot be intersected");
      }
      withPredicate(fn, errMsg) {
        return withPredicate(this, { func: fn, errMsg });
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    var ValidationError = class extends Error {
      constructor(message, path2, collectedErrors) {
        if (collectedErrors !== void 0) {
          message = Object.values(collectedErrors).map((err) => `error parsing object at path: "${prettyPrintPath((err === null || err === void 0 ? void 0 : err.path) || [])}" - ${err === null || err === void 0 ? void 0 : err.message}`).join("\n");
        }
        super(message);
        this.name = "MyZodError";
        this.path = path2;
        this.collectedErrors = collectedErrors;
      }
    };
    exports.ValidationError = ValidationError;
    function typeOf(value) {
      if (value === null) {
        return "null";
      }
      if (Array.isArray(value)) {
        return "array";
      }
      return typeof value;
    }
    function prettyPrintPath(path2) {
      return path2.reduce((acc, elem, idx) => {
        if (typeof elem === "number") {
          acc += `[${elem}]`;
        } else if (idx === 0) {
          acc += elem;
        } else {
          acc += "." + elem;
        }
        return acc;
      }, "");
    }
    var allowUnknownSymbol = Symbol("allowUnknown");
    var shapekeysSymbol = Symbol("shapeKeys");
    var normalizePredicates = (predicate) => {
      if (!predicate) {
        return null;
      }
      if (typeof predicate === "function") {
        return [{ func: predicate }];
      }
      if (Array.isArray(predicate)) {
        return predicate;
      }
      return [predicate];
    };
    var applyPredicates = (predicates, value) => {
      try {
        for (const predicate of predicates) {
          if (!predicate.func(value)) {
            throw new ValidationError(predicate.errMsg ? typeof predicate.errMsg === "function" ? predicate.errMsg(value) : predicate.errMsg : "failed anonymous predicate function");
          }
        }
      } catch (err) {
        if (err instanceof ValidationError) {
          throw err;
        }
        throw new ValidationError(err.message);
      }
    };
    var appendPredicate = (predicates, pred) => {
      if (!predicates) {
        return [pred];
      }
      return [...predicates, pred];
    };
    var withPredicate = (schema, predicate) => {
      const cpy = clone(schema);
      cpy.predicates = appendPredicate(cpy.predicates, predicate);
      return cpy;
    };
    var withDefault = (schema, value) => {
      const cpy = clone(schema);
      cpy[coercionTypeSymbol] = true;
      cpy.defaultValue = value;
      return cpy;
    };
    var StringType = class extends Type {
      constructor(opts) {
        super();
        this.predicates = normalizePredicates(opts === null || opts === void 0 ? void 0 : opts.predicate);
        this.defaultValue = opts === null || opts === void 0 ? void 0 : opts.default;
        this[coercionTypeSymbol] = (opts === null || opts === void 0 ? void 0 : opts.default) !== void 0;
        let self = this;
        if (typeof (opts === null || opts === void 0 ? void 0 : opts.min) !== "undefined") {
          self = self.min(opts.min);
        }
        if (typeof (opts === null || opts === void 0 ? void 0 : opts.max) !== "undefined") {
          self = self.max(opts.max);
        }
        if (typeof (opts === null || opts === void 0 ? void 0 : opts.pattern) !== "undefined") {
          self = self.pattern(opts.pattern);
        }
        if (opts === null || opts === void 0 ? void 0 : opts.valid) {
          self = self.valid(opts.valid);
        }
        return self;
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        if (typeof value !== "string") {
          throw this.typeError("expected type to be string but got " + typeOf(value));
        }
        if (this.predicates) {
          applyPredicates(this.predicates, value);
        }
        return value;
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      pattern(regexp, errMsg) {
        return this.withPredicate((value) => regexp.test(value), errMsg || `expected string to match pattern ${regexp} but did not`);
      }
      min(x, errMsg) {
        return this.withPredicate((value) => value.length >= x, errMsg || ((value) => `expected string to have length greater than or equal to ${x} but had length ${value.length}`));
      }
      max(x, errMsg) {
        return this.withPredicate((value) => value.length <= x, errMsg || ((value) => `expected string to have length less than or equal to ${x} but had length ${value.length}`));
      }
      valid(list, errMsg) {
        return this.withPredicate((value) => list.includes(value), errMsg || `expected string to be one of: ${JSON.stringify(list)}`);
      }
      withPredicate(fn, errMsg) {
        return withPredicate(this, { func: fn, errMsg });
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    exports.StringType = StringType;
    var BooleanType = class extends Type {
      constructor(defaultValue) {
        super();
        this.defaultValue = defaultValue;
        this[coercionTypeSymbol] = defaultValue !== void 0;
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        if (typeof value !== "boolean") {
          throw this.typeError("expected type to be boolean but got " + typeOf(value));
        }
        return value;
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    exports.BooleanType = BooleanType;
    var NumberType = class extends Type {
      constructor(opts = {}) {
        super();
        this.coerceFlag = opts.coerce;
        this.predicates = normalizePredicates(opts.predicate);
        this.defaultValue = opts.default;
        this[coercionTypeSymbol] = !!opts.coerce || opts.default !== void 0;
        let self = this;
        if (typeof opts.max !== "undefined") {
          self = self.max(opts.max);
        }
        if (typeof opts.min !== "undefined") {
          self = self.min(opts.min);
        }
        return self;
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        if (this.coerceFlag && typeof value === "string") {
          const number = parseFloat(value);
          if (isNaN(number)) {
            throw this.typeError("expected type to be number but got string");
          }
          return this.parse(number);
        }
        if (typeof value !== "number") {
          throw this.typeError("expected type to be number but got " + typeOf(value));
        }
        if (this.predicates) {
          applyPredicates(this.predicates, value);
        }
        return value;
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      min(x, errMsg) {
        return this.withPredicate((value) => value >= x, errMsg || ((value) => `expected number to be greater than or equal to ${x} but got ${value}`));
      }
      max(x, errMsg) {
        return this.withPredicate((value) => value <= x, errMsg || ((value) => `expected number to be less than or equal to ${x} but got ${value}`));
      }
      coerce(value) {
        return new NumberType({
          predicate: this.predicates || void 0,
          coerce: value !== void 0 ? value : true,
          default: this.defaultValue
        });
      }
      withPredicate(fn, errMsg) {
        return withPredicate(this, { func: fn, errMsg });
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    exports.NumberType = NumberType;
    var BigIntType = class extends Type {
      constructor(opts = {}) {
        super();
        this[coercionTypeSymbol] = true;
        this.predicates = normalizePredicates(opts.predicate);
        this.defaultValue = opts.default;
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        try {
          const int = BigInt(value);
          if (this.predicates) {
            applyPredicates(this.predicates, int);
          }
          return int;
        } catch (err) {
          if (err instanceof ValidationError) {
            throw err;
          }
          throw this.typeError("expected type to be bigint interpretable - " + err.message.toLowerCase());
        }
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      min(x, errMsg) {
        return this.withPredicate((value) => value >= x, errMsg || ((value) => `expected bigint to be greater than or equal to ${x} but got ${value}`));
      }
      max(x, errMsg) {
        return this.withPredicate((value) => value <= x, errMsg || ((value) => `expected bigint to be less than or equal to ${x} but got ${value}`));
      }
      withPredicate(fn, errMsg) {
        return withPredicate(this, { func: fn, errMsg });
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    exports.BigIntType = BigIntType;
    var UndefinedType = class extends Type {
      parse(value) {
        if (value !== void 0) {
          throw this.typeError("expected type to be undefined but got " + typeOf(value));
        }
        return value;
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
    };
    exports.UndefinedType = UndefinedType;
    var NullType = class extends Type {
      constructor() {
        super();
      }
      parse(value = this.defaultValue) {
        if (value !== null) {
          throw this.typeError("expected type to be null but got " + typeOf(value));
        }
        return value;
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      default() {
        return withDefault(this, null);
      }
    };
    exports.NullType = NullType;
    var LiteralType = class extends Type {
      constructor(literal) {
        super();
        this.literal = literal;
      }
      parse(value = this.defaultValue) {
        if (value !== this.literal) {
          const typeofValue = typeof value !== "object" ? JSON.stringify(value) : typeOf(value);
          throw this.typeError(`expected value to be literal ${JSON.stringify(this.literal)} but got ${typeofValue}`);
        }
        return value;
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      default() {
        return withDefault(this, this.literal);
      }
    };
    exports.LiteralType = LiteralType;
    var UnknownType = class extends Type {
      constructor() {
        super();
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        return value;
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    exports.UnknownType = UnknownType;
    var OptionalType = class extends Type {
      constructor(schema) {
        super();
        this.schema = schema;
        this[coercionTypeSymbol] = this.schema[coercionTypeSymbol];
        this[shapekeysSymbol] = this.schema[shapekeysSymbol];
        this[allowUnknownSymbol] = this.schema[allowUnknownSymbol];
      }
      parse(value, opts) {
        if (value === void 0) {
          return void 0;
        }
        return this.schema.parse(value, opts);
      }
      required() {
        return clone(this.schema);
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
    };
    exports.OptionalType = OptionalType;
    var NullableType = class extends Type {
      constructor(schema) {
        super();
        this.schema = schema;
        this[coercionTypeSymbol] = this.schema[coercionTypeSymbol];
        this[shapekeysSymbol] = this.schema[shapekeysSymbol];
        this[allowUnknownSymbol] = this.schema[allowUnknownSymbol];
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        if (value === null) {
          return null;
        }
        return this.schema.parse(value);
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      required() {
        return clone(this.schema);
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    exports.NullableType = NullableType;
    var DateType = class extends Type {
      constructor(opts) {
        super();
        this[coercionTypeSymbol] = true;
        this.predicates = normalizePredicates(opts === null || opts === void 0 ? void 0 : opts.predicate);
        this.defaultValue = opts === null || opts === void 0 ? void 0 : opts.default;
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        const date = typeof value === "string" ? this.stringToDate(value) : this.assertDate(value);
        if (this.predicates) {
          applyPredicates(this.predicates, date);
        }
        return date;
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      withPredicate(fn, errMsg) {
        return withPredicate(this, { func: fn, errMsg });
      }
      default(value) {
        return withDefault(this, value);
      }
      stringToDate(str) {
        const date = new Date(str);
        if (isNaN(date.getTime())) {
          throw this.typeError(`expected date string to be valid date`);
        }
        return date;
      }
      assertDate(date) {
        if (!(date instanceof Date)) {
          throw this.typeError("expected type Date but got " + typeOf(date));
        }
        return date;
      }
    };
    exports.DateType = DateType;
    exports.keySignature = Symbol("keySignature");
    var ObjectType = class extends Type {
      constructor(objectShape, opts) {
        super();
        this.objectShape = objectShape;
        this.predicates = normalizePredicates(opts === null || opts === void 0 ? void 0 : opts.predicate);
        this.defaultValue = opts === null || opts === void 0 ? void 0 : opts.default;
        this.shouldCollectErrors = (opts === null || opts === void 0 ? void 0 : opts.collectErrors) === true;
        const keys = Object.keys(this.objectShape);
        this[exports.keySignature] = this.objectShape[exports.keySignature];
        this[allowUnknownSymbol] = (opts === null || opts === void 0 ? void 0 : opts.allowUnknown) === true;
        this[shapekeysSymbol] = keys;
        this[coercionTypeSymbol] = this.defaultValue !== void 0 || this[allowUnknownSymbol] || Object.values(this.objectShape).some((schema) => schema[coercionTypeSymbol]) || !!(this.objectShape[exports.keySignature] && this.objectShape[exports.keySignature][coercionTypeSymbol]);
        this._parse = this.selectParser();
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue, parseOpts = {}) {
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
          throw this.typeError("expected type to be object but got " + typeOf(value));
        }
        const keys = this[shapekeysSymbol];
        const allowUnknown = parseOpts.allowUnknown || this[allowUnknownSymbol];
        if (!allowUnknown && !this.objectShape[exports.keySignature]) {
          const illegalKeys = [];
          for (const k in value) {
            if (!keys.includes(k)) {
              illegalKeys.push(k);
            }
          }
          if (illegalKeys.length > 0) {
            throw this.typeError("unexpected keys on object: " + JSON.stringify(illegalKeys));
          }
        }
        return this._parse(value, parseOpts);
      }
      buildPathError(err, key, parseOpts) {
        const path2 = err.path ? [key, ...err.path] : [key];
        const msg = parseOpts.suppressPathErrMsg ? err.message : `error parsing object at path: "${prettyPrintPath(path2)}" - ${err.message}`;
        return new ValidationError(msg, path2);
      }
      selectParser() {
        if (this[shapekeysSymbol].length === 0 && this[exports.keySignature]) {
          if (this[coercionTypeSymbol] && this.shouldCollectErrors) {
            return this.parseRecordConvCollect;
          }
          if (this[coercionTypeSymbol]) {
            return this.parseRecordConv;
          }
          if (this.shouldCollectErrors) {
            return this.parseRecordCollect;
          }
          return this.parseRecord;
        }
        if (this[exports.keySignature]) {
          if (this[coercionTypeSymbol] && this.shouldCollectErrors) {
            return this.parseMixRecordConvCollect;
          }
          if (this[coercionTypeSymbol]) {
            return this.parseMixRecordConv;
          }
          if (this.shouldCollectErrors) {
            return this.parseMixRecordCollect;
          }
          return this.parseMixRecord;
        }
        if (this[coercionTypeSymbol] && this.shouldCollectErrors) {
          return this.parseObjectConvCollect;
        }
        if (this[coercionTypeSymbol]) {
          return this.parseObjectConv;
        }
        if (this.shouldCollectErrors) {
          return this.parseObjectCollect;
        }
        return this.parseObject;
      }
      parseObject(value, parseOpts) {
        for (const key of this[shapekeysSymbol]) {
          try {
            const schema = this.objectShape[key];
            if (schema instanceof UnknownType && !value.hasOwnProperty(key)) {
              throw schema.typeError(`expected key "${key}" of unknown type to be present on object`);
            }
            schema.parse(value[key], { suppressPathErrMsg: true });
          } catch (err) {
            throw this.buildPathError(err, key, parseOpts);
          }
        }
        if (this.predicates) {
          applyPredicates(this.predicates, value);
        }
        return value;
      }
      parseObjectCollect(value, parseOpts) {
        let hasError = false;
        const errs = {};
        for (const key of this[shapekeysSymbol]) {
          const schema = this.objectShape[key];
          if (schema instanceof UnknownType && !value.hasOwnProperty(key)) {
            hasError = true;
            errs[key] = this.buildPathError(schema.typeError(`expected key "${key}" of unknown type to be present on object`), key, { suppressPathErrMsg: true });
            continue;
          }
          const result = schema.try(value[key], { suppressPathErrMsg: true });
          if (result instanceof ValidationError) {
            hasError = true;
            errs[key] = this.buildPathError(result, key, { suppressPathErrMsg: true });
          }
        }
        if (hasError) {
          throw new ValidationError("", void 0, errs);
        }
        if (this.predicates) {
          applyPredicates(this.predicates, value);
        }
        return value;
      }
      parseObjectConv(value, parseOpts) {
        const convVal = {};
        for (const key of this[shapekeysSymbol]) {
          try {
            const schema = this.objectShape[key];
            if (schema instanceof UnknownType && !value.hasOwnProperty(key)) {
              throw schema.typeError(`expected key "${key}" of unknown type to be present on object`);
            }
            convVal[key] = schema.parse(value[key], { suppressPathErrMsg: true });
          } catch (err) {
            throw this.buildPathError(err, key, parseOpts);
          }
        }
        if (this.predicates) {
          applyPredicates(this.predicates, convVal);
        }
        return convVal;
      }
      parseObjectConvCollect(value, parseOpts) {
        const convVal = {};
        const errs = {};
        let hasError = false;
        for (const key of this[shapekeysSymbol]) {
          const schema = this.objectShape[key];
          if (schema instanceof UnknownType && !value.hasOwnProperty(key)) {
            hasError = true;
            errs[key] = this.buildPathError(schema.typeError(`expected key "${key}" of unknown type to be present on object`), key, { suppressPathErrMsg: true });
            continue;
          }
          const result = schema.try(value[key], { suppressPathErrMsg: true });
          if (result instanceof ValidationError) {
            hasError = true;
            errs[key] = this.buildPathError(result, key, { suppressPathErrMsg: true });
          } else {
            convVal[key] = result;
          }
        }
        if (hasError) {
          throw new ValidationError("", void 0, errs);
        }
        if (this.predicates) {
          applyPredicates(this.predicates, convVal);
        }
        return convVal;
      }
      parseRecord(value, parseOpts) {
        for (const key in value) {
          try {
            this[exports.keySignature].parse(value[key], { suppressPathErrMsg: true });
          } catch (err) {
            throw this.buildPathError(err, key, parseOpts);
          }
        }
        if (this.predicates) {
          applyPredicates(this.predicates, value);
        }
        return value;
      }
      parseRecordCollect(value, parseOpts) {
        let hasError = false;
        const errs = {};
        for (const key in value) {
          const result = this[exports.keySignature].try(value[key], { suppressPathErrMsg: true });
          if (result instanceof ValidationError) {
            hasError = true;
            errs[key] = this.buildPathError(result, key, { suppressPathErrMsg: true });
          }
        }
        if (hasError) {
          throw new ValidationError("", void 0, errs);
        }
        if (this.predicates) {
          applyPredicates(this.predicates, value);
        }
        return value;
      }
      parseRecordConv(value, parseOpts) {
        const convVal = {};
        for (const key in value) {
          try {
            convVal[key] = this[exports.keySignature].parse(value[key], { suppressPathErrMsg: true });
          } catch (err) {
            throw this.buildPathError(err, key, parseOpts);
          }
        }
        if (this.predicates) {
          applyPredicates(this.predicates, convVal);
        }
        return convVal;
      }
      parseRecordConvCollect(value, parseOpts) {
        const convVal = {};
        const errs = {};
        let hasError = false;
        for (const key in value) {
          const result = this[exports.keySignature].try(value[key], { suppressPathErrMsg: true });
          if (result instanceof ValidationError) {
            hasError = true;
            errs[key] = this.buildPathError(result, key, { suppressPathErrMsg: true });
          } else {
            convVal[key] = result;
          }
        }
        if (hasError) {
          throw new ValidationError("", void 0, errs);
        }
        if (this.predicates) {
          applyPredicates(this.predicates, convVal);
        }
        return convVal;
      }
      parseMixRecord(value, parseOpts) {
        for (const key of new Set(Object.keys(value).concat(this[shapekeysSymbol]))) {
          try {
            (this.objectShape[key] || this[exports.keySignature]).parse(value[key], { suppressPathErrMsg: true });
          } catch (err) {
            throw this.buildPathError(err, key, parseOpts);
          }
        }
        if (this.predicates) {
          applyPredicates(this.predicates, value);
        }
        return value;
      }
      parseMixRecordCollect(value, parseOpts) {
        let hasError = false;
        const errs = {};
        for (const key of new Set(Object.keys(value).concat(this[shapekeysSymbol]))) {
          const result = (this.objectShape[key] || this[exports.keySignature]).try(value[key], {
            suppressPathErrMsg: true
          });
          if (result instanceof ValidationError) {
            hasError = true;
            errs[key] = this.buildPathError(result, key, { suppressPathErrMsg: true });
          }
        }
        if (hasError) {
          throw new ValidationError("", void 0, errs);
        }
        if (this.predicates) {
          applyPredicates(this.predicates, value);
        }
        return value;
      }
      parseMixRecordConv(value, parseOpts) {
        const convVal = {};
        for (const key of new Set(Object.keys(value).concat(this[shapekeysSymbol]))) {
          try {
            convVal[key] = (this.objectShape[key] || this[exports.keySignature]).parse(value[key], {
              suppressPathErrMsg: true
            });
          } catch (err) {
            throw this.buildPathError(err, key, parseOpts);
          }
        }
        if (this.predicates) {
          applyPredicates(this.predicates, convVal);
        }
        return convVal;
      }
      parseMixRecordConvCollect(value, parseOpts) {
        const convVal = {};
        const errs = {};
        let hasError = false;
        for (const key of new Set(Object.keys(value).concat(this[shapekeysSymbol]))) {
          const result = (this.objectShape[key] || this[exports.keySignature]).try(value[key], {
            suppressPathErrMsg: true
          });
          if (result instanceof ValidationError) {
            hasError = true;
            errs[key] = this.buildPathError(result, key, { suppressPathErrMsg: true });
          } else {
            convVal[key] = result;
          }
        }
        if (hasError) {
          throw new ValidationError("", void 0, errs);
        }
        if (this.predicates) {
          applyPredicates(this.predicates, convVal);
        }
        return convVal;
      }
      and(schema) {
        if (schema instanceof ObjectType) {
          const keySet = /* @__PURE__ */ new Set([...this[shapekeysSymbol], ...schema[shapekeysSymbol]]);
          const intersectShape = Array.from(keySet).reduce((acc, key) => {
            if (this.objectShape[key] && schema.objectShape[key]) {
              acc[key] = this.objectShape[key].and(schema.objectShape[key]);
            } else if (this.objectShape[key]) {
              acc[key] = this.objectShape[key];
            } else {
              acc[key] = schema.objectShape[key];
            }
            return acc;
          }, {});
          const selfKeySig = this.objectShape[exports.keySignature];
          const targetKeySig = schema[exports.keySignature];
          if (selfKeySig && targetKeySig) {
            intersectShape[exports.keySignature] = selfKeySig.and(targetKeySig);
          } else if (selfKeySig || targetKeySig) {
            intersectShape[exports.keySignature] = selfKeySig || targetKeySig;
          }
          return new ObjectType(intersectShape);
        }
        return new IntersectionType(this, schema);
      }
      pick(keys, opts) {
        const pickedShape = keys.reduce((acc, key) => {
          if (this.objectShape[key] || this.objectShape[exports.keySignature]) {
            acc[key] = this.objectShape[key] || this.objectShape[exports.keySignature];
          }
          return acc;
        }, {});
        return new ObjectType(pickedShape, opts);
      }
      omit(keys, opts) {
        const pickedKeys = this[shapekeysSymbol].filter((x) => !keys.includes(x));
        if (!this[exports.keySignature]) {
          return this.pick(pickedKeys, opts);
        }
        return this.pick(pickedKeys, opts).and(new ObjectType({ [exports.keySignature]: this[exports.keySignature] }));
      }
      partial(opts) {
        const originalShape = this.objectShape;
        const shape = Object.keys(originalShape).reduce((acc, key) => {
          if (opts === null || opts === void 0 ? void 0 : opts.deep) {
            acc[key] = toPartialSchema(originalShape[key], opts).optional();
          } else {
            acc[key] = originalShape[key].optional();
          }
          return acc;
        }, {});
        const keysig = originalShape[exports.keySignature];
        if (keysig) {
          if (opts === null || opts === void 0 ? void 0 : opts.deep) {
            shape[exports.keySignature] = toPartialSchema(keysig, opts).optional();
          } else {
            shape[exports.keySignature] = keysig.optional();
          }
        }
        return new ObjectType(shape, { allowUnknown: this[allowUnknownSymbol] });
      }
      shape() {
        return Object.assign({}, this.objectShape);
      }
      withPredicate(fn, errMsg) {
        return withPredicate(this, { func: fn, errMsg });
      }
      default(value) {
        const cpy = withDefault(this, value);
        cpy._parse = cpy.selectParser();
        return cpy;
      }
      collectErrors(value = true) {
        const cpy = clone(this);
        cpy.shouldCollectErrors = value;
        cpy._parse = cpy.selectParser();
        return cpy;
      }
      allowUnknownKeys(value = true) {
        const cpy = clone(this);
        cpy[allowUnknownSymbol] = value;
        cpy[coercionTypeSymbol] = cpy[coercionTypeSymbol] || value;
        cpy._parse = cpy.selectParser();
        return cpy;
      }
    };
    exports.ObjectType = ObjectType;
    var ArrayType = class extends Type {
      constructor(schema, opts = {}) {
        super();
        this.schema = schema;
        this.predicates = normalizePredicates(opts.predicate);
        this.defaultValue = opts.default;
        this.coerceFn = opts.coerce;
        this[coercionTypeSymbol] = typeof this.coerceFn === "function" || this.defaultValue !== void 0 || this.schema[coercionTypeSymbol];
        this._parse = this.schema instanceof ObjectType || this.schema instanceof ArrayType || this.schema instanceof LazyType ? (elem, parseOptions) => this.schema.parse(elem, {
          allowUnknown: parseOptions === null || parseOptions === void 0 ? void 0 : parseOptions.allowUnknown,
          suppressPathErrMsg: true
        }) : (elem) => this.schema.parse(elem);
        let self = this;
        if (typeof opts.length !== "undefined") {
          self = self.length(opts.length);
        }
        if (typeof opts.min !== "undefined") {
          self = self.min(opts.min);
        }
        if (typeof opts.max !== "undefined") {
          self = self.max(opts.max);
        }
        if (opts.unique === true) {
          self = self.unique();
        }
        return self;
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue, parseOptions) {
        if (typeof value === "string" && typeof this.coerceFn === "function" && !(parseOptions === null || parseOptions === void 0 ? void 0 : parseOptions.coerced)) {
          try {
            return this.parse(this.coerceFn(value), Object.assign(Object.assign({}, parseOptions), { coerced: true }));
          } catch (e) {
            if (e instanceof ValidationError) {
              throw e;
            }
            throw new ValidationError("error coercing string value to array - " + e.message);
          }
        }
        if (!Array.isArray(value)) {
          throw this.typeError("expected an array but got " + typeOf(value));
        }
        const convValue = this[coercionTypeSymbol] ? [] : void 0;
        for (let i = 0; i < value.length; i++) {
          try {
            if (convValue) {
              convValue[i] = this._parse(value[i]);
            } else {
              this._parse(value[i], parseOptions);
            }
          } catch (err) {
            const path2 = err.path ? [i, ...err.path] : [i];
            const msg = (parseOptions === null || parseOptions === void 0 ? void 0 : parseOptions.suppressPathErrMsg) ? err.message : `error at ${prettyPrintPath(path2)} - ${err.message}`;
            throw new ValidationError(msg, path2);
          }
        }
        if (this.predicates) {
          applyPredicates(this.predicates, convValue || value);
        }
        return convValue || value;
      }
      length(value, errMsg) {
        return this.withPredicate((arr) => arr.length === value, errMsg || ((arr) => `expected array to have length ${value} but got ${arr.length}`));
      }
      min(value, errMsg) {
        return this.withPredicate((arr) => arr.length >= value, errMsg || ((arr) => `expected array to have length greater than or equal to ${value} but got ${arr.length}`));
      }
      max(value, errMsg) {
        return this.withPredicate((arr) => arr.length <= value, errMsg || ((arr) => `expected array to have length less than or equal to ${value} but got ${arr.length}`));
      }
      unique() {
        return this.withPredicate((arr) => {
          const seenMap = /* @__PURE__ */ new Map();
          arr.forEach((elem, idx) => {
            const seenAt = seenMap.get(elem);
            if (seenAt) {
              throw new ValidationError(`expected array to be unique but found same element at indexes ${seenAt[0]} and ${idx}`);
            }
            seenMap.set(elem, [idx]);
          });
          return true;
        });
      }
      and(schema) {
        if (schema instanceof ArrayType) {
          return new ArrayType(this.schema.and(schema.schema));
        }
        return new IntersectionType(this, schema);
      }
      coerce(fn) {
        return new ArrayType(this.schema, {
          default: this.defaultValue,
          coerce: fn,
          predicate: this.predicates || void 0
        });
      }
      withPredicate(fn, errMsg) {
        return withPredicate(this, { func: fn, errMsg });
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    exports.ArrayType = ArrayType;
    var TupleType = class extends Type {
      constructor(schemas, opts) {
        super();
        this.schemas = schemas;
        this.predicates = normalizePredicates(opts === null || opts === void 0 ? void 0 : opts.predicate);
        this.defaultValue = opts === null || opts === void 0 ? void 0 : opts.default;
        this[coercionTypeSymbol] = this.defaultValue !== void 0 || schemas.some((schema) => schema[coercionTypeSymbol]);
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        if (!Array.isArray(value)) {
          throw this.typeError("expected tuple value to be type array but got " + typeOf(value));
        }
        if (value.length !== this.schemas.length) {
          throw this.typeError(`expected tuple length to be ${this.schemas.length} but got ${value.length}`);
        }
        const convValue = this[coercionTypeSymbol] ? [] : void 0;
        for (let i = 0; i < this.schemas.length; i++) {
          try {
            if (convValue) {
              convValue.push(this.schemas[i].parse(value[i]));
            } else {
              this.schemas[i].parse(value[i]);
            }
          } catch (err) {
            throw new ValidationError(`error parsing tuple at index ${i}: ${err.message}`);
          }
        }
        if (this.predicates) {
          applyPredicates(this.predicates, convValue || value);
        }
        return convValue || value;
      }
      and(schema) {
        if (schema instanceof TupleType) {
          const otherSchemaArray = schema.schemas;
          const nextSchemasArray = [];
          for (let i = 0; i < Math.max(this.schemas.length, otherSchemaArray.length); i++) {
            const current = this.schemas[i];
            const other = otherSchemaArray[i];
            if (current && other) {
              nextSchemasArray.push(current.and(other));
            } else if (current) {
              nextSchemasArray.push(current);
            } else {
              nextSchemasArray.push(other);
            }
          }
          return new TupleType(nextSchemasArray);
        }
        return new IntersectionType(this, schema);
      }
      withPredicate(fn, errMsg) {
        return withPredicate(this, { func: fn, errMsg });
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    exports.TupleType = TupleType;
    var UnionType = class extends Type {
      constructor(schemas, opts) {
        super();
        this.schemas = schemas;
        this.strict = (opts === null || opts === void 0 ? void 0 : opts.strict) !== false;
        this.defaultValue = opts === null || opts === void 0 ? void 0 : opts.default;
        this[coercionTypeSymbol] = (opts === null || opts === void 0 ? void 0 : opts.default) !== void 0 || schemas.some((schema) => schema[coercionTypeSymbol]);
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        const errors = /* @__PURE__ */ new Set();
        for (const schema of this.schemas) {
          try {
            if (this.strict === false && schema instanceof ObjectType) {
              return schema.parse(value, { allowUnknown: true });
            }
            return schema.parse(value);
          } catch (err) {
            errors.add(err.message);
          }
        }
        const messages = Array.from(errors);
        if (messages.length === 1) {
          throw this.typeError(messages[0]);
        }
        throw this.typeError("No union satisfied:\n  " + messages.join("\n  "));
      }
      and(schema) {
        const schemaIntersections = this.schemas.map((x) => x.and(schema));
        return new UnionType(schemaIntersections, { strict: this.strict });
      }
      default(value) {
        return withDefault(this, value);
      }
    };
    exports.UnionType = UnionType;
    function asUnionType(schema) {
      if (schema instanceof UnionType) {
        return schema;
      }
      if (schema instanceof IntersectionType && schema._schema instanceof UnionType) {
        return schema._schema;
      }
      return null;
    }
    var IntersectionType = class extends Type {
      constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
        this[coercionTypeSymbol] = this.left[coercionTypeSymbol] && this.right[coercionTypeSymbol];
        this[allowUnknownSymbol] = !!(this.left[allowUnknownSymbol] || this.right[allowUnknownSymbol]);
        if (this.left[shapekeysSymbol] && this.right[shapekeysSymbol]) {
          this[shapekeysSymbol] = Array.from(/* @__PURE__ */ new Set([...this.left[shapekeysSymbol], ...this.right[shapekeysSymbol]]));
        }
        this._schema = (() => {
          if (this.left instanceof MTypeClass) {
            this.left.and(this.right);
          }
          if (this.right instanceof MTypeClass) {
            this.right.and(this.left);
          }
          const leftUnion = asUnionType(this.left);
          if (leftUnion) {
            return leftUnion.and(this.right);
          }
          const rightUnion = asUnionType(this.right);
          if (rightUnion) {
            return rightUnion.and(this.left);
          }
          if (this.left instanceof PartialType) {
            return new IntersectionType(this.left.schema, this.right);
          }
          if (this.right instanceof PartialType) {
            return new IntersectionType(this.left, this.right.schema);
          }
          return null;
        })();
      }
      parse(value, opts) {
        const allowUnknown = (opts === null || opts === void 0 ? void 0 : opts.allowUnknown) || this[allowUnknownSymbol];
        if (!allowUnknown && this[shapekeysSymbol]) {
          const expectedShapeKeys = this[shapekeysSymbol];
          const invalidKeys = Object.keys(value).filter((key) => !expectedShapeKeys.includes(key));
          if (invalidKeys.length > 0) {
            throw this.typeError("unexpected keys on object " + JSON.stringify(invalidKeys));
          }
        }
        if (this._schema) {
          return this._schema.parse(value, opts);
        }
        this.left.parse(value);
        this.right.parse(value);
        return value;
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
    };
    exports.IntersectionType = IntersectionType;
    var EnumType = class extends Type {
      constructor(enumeration, opts = {}) {
        super();
        this.enumeration = enumeration;
        this.values = Object.values(enumeration);
        this.coerceOpt = opts.coerce;
        this.defaultValue = opts.defaultValue;
        this[coercionTypeSymbol] = this.defaultValue !== void 0;
      }
      parse(value = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue) {
        let coercedValue = value;
        if (typeof value === "string" && this.coerceOpt === "lower") {
          coercedValue = value.toLowerCase();
        } else if (typeof value === "string" && this.coerceOpt === "upper") {
          coercedValue = value.toUpperCase();
        }
        if (!this.values.includes(coercedValue)) {
          throw this.typeError(`error ${JSON.stringify(value)} not part of enum values`);
        }
        return coercedValue;
      }
      check(value) {
        return this.values.includes(value);
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
      default(value) {
        return withDefault(this, value);
      }
      coerce(opt) {
        return new EnumType(this.enumeration, { defaultValue: this.defaultValue, coerce: opt });
      }
    };
    exports.EnumType = EnumType;
    function toPartialSchema(schema, opts) {
      if (schema instanceof ObjectType) {
        return schema.partial({ deep: (opts === null || opts === void 0 ? void 0 : opts.deep) || false });
      }
      if (schema instanceof IntersectionType) {
        return new IntersectionType(toPartialSchema(schema.left, opts), toPartialSchema(schema.right, opts));
      }
      if (schema instanceof UnionType) {
        return new UnionType(schema.schemas.map((schema2) => toPartialSchema(schema2, opts)));
      }
      if (schema instanceof ArrayType) {
        if (opts === null || opts === void 0 ? void 0 : opts.deep) {
          return new ArrayType(toPartialSchema(schema.schema, opts).optional());
        }
        return new ArrayType(schema.schema.optional());
      }
      return schema;
    }
    var PartialType = class extends Type {
      constructor(schema, opts) {
        super();
        this.schema = toPartialSchema(schema, opts);
        this[coercionTypeSymbol] = this.schema[coercionTypeSymbol];
      }
      parse(value) {
        return this.schema.parse(value);
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
    };
    exports.PartialType = PartialType;
    var LazyType = class extends Type {
      constructor(fn) {
        super();
        this.fn = fn;
        this[coercionTypeSymbol] = true;
      }
      parse(value, opts) {
        const schema = this.fn();
        if ((opts === null || opts === void 0 ? void 0 : opts.suppressPathErrMsg) && schema instanceof ObjectType) {
          return schema.parse(value, opts);
        }
        return schema.parse(value);
      }
      and(schema) {
        return new IntersectionType(this, schema);
      }
    };
    exports.LazyType = LazyType;
  }
});

// node_modules/myzod/libs/index.js
var require_libs = __commonJS({
  "node_modules/myzod/libs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.required = exports.enum = exports.null = exports.undefined = exports.omit = exports.pick = exports.partial = exports.lazy = exports.date = exports.tuple = exports.dictionary = exports.record = exports.literals = exports.intersection = exports.union = exports.array = exports.object = exports.literal = exports.unknown = exports.bigint = exports.number = exports.boolean = exports.string = exports.IntersectionType = exports.UnionType = exports.UnknownType = exports.DateType = exports.OptionalType = exports.NullableType = exports.TupleType = exports.ArrayType = exports.ObjectType = exports.NullType = exports.UndefinedType = exports.StringType = exports.BooleanType = exports.NumberType = exports.keySignature = exports.Type = exports.ValidationError = void 0;
    var types_1 = require_types();
    var types_2 = require_types();
    var types_3 = require_types();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return types_3.ValidationError;
    } });
    Object.defineProperty(exports, "Type", { enumerable: true, get: function() {
      return types_3.Type;
    } });
    Object.defineProperty(exports, "keySignature", { enumerable: true, get: function() {
      return types_3.keySignature;
    } });
    Object.defineProperty(exports, "NumberType", { enumerable: true, get: function() {
      return types_3.NumberType;
    } });
    Object.defineProperty(exports, "BooleanType", { enumerable: true, get: function() {
      return types_3.BooleanType;
    } });
    Object.defineProperty(exports, "StringType", { enumerable: true, get: function() {
      return types_3.StringType;
    } });
    Object.defineProperty(exports, "UndefinedType", { enumerable: true, get: function() {
      return types_3.UndefinedType;
    } });
    Object.defineProperty(exports, "NullType", { enumerable: true, get: function() {
      return types_3.NullType;
    } });
    Object.defineProperty(exports, "ObjectType", { enumerable: true, get: function() {
      return types_3.ObjectType;
    } });
    Object.defineProperty(exports, "ArrayType", { enumerable: true, get: function() {
      return types_3.ArrayType;
    } });
    Object.defineProperty(exports, "TupleType", { enumerable: true, get: function() {
      return types_3.TupleType;
    } });
    Object.defineProperty(exports, "NullableType", { enumerable: true, get: function() {
      return types_3.NullableType;
    } });
    Object.defineProperty(exports, "OptionalType", { enumerable: true, get: function() {
      return types_3.OptionalType;
    } });
    Object.defineProperty(exports, "DateType", { enumerable: true, get: function() {
      return types_3.DateType;
    } });
    Object.defineProperty(exports, "UnknownType", { enumerable: true, get: function() {
      return types_3.UnknownType;
    } });
    Object.defineProperty(exports, "UnionType", { enumerable: true, get: function() {
      return types_3.UnionType;
    } });
    Object.defineProperty(exports, "IntersectionType", { enumerable: true, get: function() {
      return types_3.IntersectionType;
    } });
    var string = (opts) => new types_2.StringType(opts);
    exports.string = string;
    var boolean = () => new types_2.BooleanType();
    exports.boolean = boolean;
    var number = (opts) => new types_2.NumberType(opts);
    exports.number = number;
    var bigint = (opts) => new types_2.BigIntType(opts);
    exports.bigint = bigint;
    var unknown = () => new types_2.UnknownType();
    exports.unknown = unknown;
    var literal = (literal2) => new types_2.LiteralType(literal2);
    exports.literal = literal;
    var object = (shape, opts) => new types_2.ObjectType(shape, opts);
    exports.object = object;
    var array = (schema, opts) => new types_2.ArrayType(schema, opts);
    exports.array = array;
    var union = (schemas, opts) => new types_2.UnionType(schemas, opts);
    exports.union = union;
    var intersection = (l, r) => l.and(r);
    exports.intersection = intersection;
    var literals = (...args) => new types_2.UnionType(args.map(exports.literal));
    exports.literals = literals;
    var record = (schema) => new types_2.ObjectType({ [types_2.keySignature]: schema });
    exports.record = record;
    var dictionary = (schema) => {
      if (schema instanceof types_2.OptionalType) {
        return new types_2.ObjectType({ [types_2.keySignature]: schema });
      }
      return new types_2.ObjectType({ [types_2.keySignature]: new types_2.OptionalType(schema) });
    };
    exports.dictionary = dictionary;
    var tuple = (schemas) => new types_2.TupleType(schemas);
    exports.tuple = tuple;
    var date = () => new types_2.DateType();
    exports.date = date;
    var lazy = (fn) => new types_2.LazyType(fn);
    exports.lazy = lazy;
    function partial(schema, opts) {
      if (schema instanceof types_2.ObjectType) {
        return schema.partial(opts);
      }
      return new types_2.PartialType(schema, opts);
    }
    exports.partial = partial;
    function pick(schema, keys) {
      return schema.pick(keys);
    }
    exports.pick = pick;
    function omit(schema, keys) {
      return schema.omit(keys);
    }
    exports.omit = omit;
    var undefinedValue = () => new types_2.UndefinedType();
    exports.undefined = undefinedValue;
    var nullValue = () => new types_2.NullType();
    exports.null = nullValue;
    var enumValue = (e, opts) => new types_2.EnumType(e, opts);
    exports.enum = enumValue;
    exports.default = {
      Type: types_2.Type,
      string: exports.string,
      boolean: exports.boolean,
      number: exports.number,
      bigint: exports.bigint,
      unknown: exports.unknown,
      literal: exports.literal,
      literals: exports.literals,
      date: exports.date,
      object: exports.object,
      array: exports.array,
      union: exports.union,
      intersection: exports.intersection,
      record: exports.record,
      dictionary: exports.dictionary,
      tuple: exports.tuple,
      partial,
      pick,
      omit,
      required,
      lazy: exports.lazy,
      undefined: undefinedValue,
      null: nullValue,
      enum: enumValue,
      ValidationError: types_2.ValidationError,
      keySignature: types_2.keySignature,
      NumberType: types_2.NumberType,
      BooleanType: types_2.BooleanType,
      StringType: types_2.StringType,
      UndefinedType: types_2.UndefinedType,
      NullType: types_2.NullType,
      ObjectType: types_2.ObjectType,
      ArrayType: types_2.ArrayType,
      TupleType: types_2.TupleType,
      NullableType: types_2.NullableType,
      OptionalType: types_2.OptionalType,
      DateType: types_2.DateType,
      UnknownType: types_2.UnknownType,
      UnionType: types_2.UnionType,
      IntersectionType: types_1.IntersectionType
    };
    function required(schema) {
      if (schema instanceof types_2.NullableType) {
        return required(schema.required());
      }
      if (schema instanceof types_2.OptionalType) {
        return required(schema.required());
      }
      return schema;
    }
    exports.required = required;
  }
});

// src/main.ts
var core2 = __toESM(require_core());
var command = __toESM(require_command());
var cp = __toESM(require("child_process"));

// package.json
var version = "1.1.0";

// src/helpers.ts
var core = __toESM(require_core());
var httpClient = __toESM(require_http_client());
var tc = __toESM(require_tool_cache());
var path = __toESM(require("path"));
var import_semver2 = __toESM(require_semver2());
var import_string_argv = __toESM(require_string_argv());

// src/schema.ts
var import_myzod = __toESM(require_libs());
var import_semver = __toESM(require_semver2());
var Position = import_myzod.default.object({
  line: import_myzod.default.number(),
  character: import_myzod.default.number()
});
function isEmptyPosition(p) {
  return p.line === 0 && p.character === 0;
}
var Range = import_myzod.default.object({
  start: Position,
  end: Position
});
function isEmptyRange(r) {
  return isEmptyPosition(r.start) && isEmptyPosition(r.end);
}
var Diagnostic = import_myzod.default.object({
  file: import_myzod.default.string(),
  severity: import_myzod.default.literals("error", "warning", "information"),
  message: import_myzod.default.string(),
  rule: import_myzod.default.string().optional(),
  range: Range.optional()
});
var Report = import_myzod.default.object({
  generalDiagnostics: import_myzod.default.array(Diagnostic),
  summary: import_myzod.default.object({
    errorCount: import_myzod.default.number(),
    warningCount: import_myzod.default.number(),
    informationCount: import_myzod.default.number()
  })
});
var NpmRegistryResponse = import_myzod.default.object({
  version: import_myzod.default.string().withPredicate((value) => {
    new import_semver.default(value);
    return true;
  }, "must be a semver")
});

// src/helpers.ts
function getNodeInfo() {
  return {
    version: process.version,
    execPath: process.execPath
  };
}
async function getArgs() {
  const pyrightVersion = await getPyrightVersion();
  const pyrightPath = await downloadPyright(pyrightVersion);
  const args = [pyrightPath];
  const workingDirectory = core.getInput("working-directory");
  const noComments = getBooleanInput("no-comments", false);
  if (!noComments) {
    args.push("--outputjson");
  }
  const pythonPlatform = core.getInput("python-platform");
  if (pythonPlatform) {
    args.push("--pythonplatform");
    args.push(pythonPlatform);
  }
  const pythonVersion = core.getInput("python-version");
  if (pythonVersion) {
    args.push("--pythonversion");
    args.push(pythonVersion);
  }
  const typeshedPath = core.getInput("typeshed-path");
  if (typeshedPath) {
    args.push("--typeshed-path");
    args.push(typeshedPath);
  }
  const venvPath = core.getInput("venv-path");
  if (venvPath) {
    args.push("--venv-path");
    args.push(venvPath);
  }
  const project = core.getInput("project");
  if (project) {
    args.push("--project");
    args.push(project);
  }
  const lib = getBooleanInput("lib", false);
  if (lib) {
    args.push("--lib");
  }
  const warnings = getBooleanInput("warnings", false);
  if (warnings) {
    args.push("--warnings");
  }
  const verifyTypes = core.getInput("verify-types");
  if (verifyTypes) {
    args.push("--verifytypes");
    args.push(verifyTypes);
  }
  const extraArgs = core.getInput("extra-args");
  if (extraArgs) {
    args.push(...(0, import_string_argv.default)(extraArgs));
  }
  return {
    workingDirectory,
    noComments,
    pyrightVersion,
    args
  };
}
function getBooleanInput(name, defaultValue) {
  const input = core.getInput(name);
  if (!input) {
    return defaultValue;
  }
  return input.toUpperCase() === "TRUE";
}
async function getPyrightVersion() {
  const versionSpec = core.getInput("version");
  if (versionSpec) {
    return new import_semver2.default(versionSpec);
  }
  const client = new httpClient.HttpClient();
  const resp = await client.get("https://registry.npmjs.org/pyright/latest");
  const body = await resp.readBody();
  const obj = NpmRegistryResponse.parse(JSON.parse(body));
  return new import_semver2.default(obj.version);
}
async function downloadPyright(version2) {
  const url = `https://registry.npmjs.org/pyright/-/pyright-${version2.format()}.tgz`;
  const pyrightTarball = await tc.downloadTool(url);
  const pyright = await tc.extractTar(pyrightTarball);
  return path.join(pyright, "package", "index.js");
}

// src/main.ts
async function main() {
  try {
    const node = getNodeInfo();
    const { workingDirectory, noComments, pyrightVersion, args } = await getArgs();
    if (workingDirectory) {
      process.chdir(workingDirectory);
    }
    core2.info(`pyright ${pyrightVersion}, node ${node.version}, pyright-action ${version}`);
    core2.info(`${node.execPath} ${args.join(" ")}`);
    if (noComments || args.includes("--verifytypes")) {
      const { status: status2 } = cp.spawnSync(node.execPath, args, {
        stdio: ["ignore", "inherit", "inherit"]
      });
      if (status2 !== 0) {
        core2.setFailed(`Exit code ${status2}`);
      }
      return;
    }
    const { status, stdout } = cp.spawnSync(node.execPath, args, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "inherit"]
    });
    if (!stdout.trim()) {
      core2.setFailed(`Exit code ${status}`);
      return;
    }
    const report = Report.parse(JSON.parse(stdout));
    report.generalDiagnostics.forEach((diag) => {
      var _a, _b;
      core2.info(diagnosticToString(diag, false));
      if (diag.severity === "information") {
        return;
      }
      const line = ((_a = diag.range) == null ? void 0 : _a.start.line) ?? 0;
      const col = ((_b = diag.range) == null ? void 0 : _b.start.character) ?? 0;
      const message = diagnosticToString(diag, true);
      command.issueCommand(diag.severity, {
        file: diag.file,
        line: line + 1,
        col: col + 1
      }, message);
    });
    const { errorCount, warningCount, informationCount } = report.summary;
    core2.info(`${errorCount} ${errorCount === 1 ? "error" : "errors"}, ${warningCount} ${warningCount === 1 ? "warning" : "warnings"}, ${informationCount} ${informationCount === 1 ? "info" : "infos"}`);
    if (status !== 0) {
      core2.setFailed(`${errorCount} ${errorCount === 1 ? "error" : "errors"}`);
    }
  } catch (e) {
    core2.setFailed(e.message);
  }
}
function diagnosticToString(diag, forCommand) {
  let message = "";
  if (!forCommand) {
    if (diag.file) {
      message += `${diag.file}:`;
    }
    if (diag.range && !isEmptyRange(diag.range)) {
      message += `${diag.range.start.line + 1}:${diag.range.start.character + 1} - `;
    }
    message += diag.severity;
    message += `: `;
  }
  message += diag.message;
  if (diag.rule) {
    message += ` (${diag.rule})`;
  }
  return message;
}

// src/index.ts
main();
