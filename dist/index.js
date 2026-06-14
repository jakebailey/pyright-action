//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let node_assert = require("node:assert");
node_assert = __toESM(node_assert);
let node_child_process = require("node:child_process");
node_child_process = __toESM(node_child_process);
let node_fs = require("node:fs");
node_fs = __toESM(node_fs);
let node_path = require("node:path");
node_path = __toESM(node_path);
let node_util = require("node:util");
let os = require("os");
os = __toESM(os, 1);
let crypto = require("crypto");
crypto = __toESM(crypto, 1);
let fs = require("fs");
fs = __toESM(fs, 1);
let path = require("path");
path = __toESM(path, 1);
let http = require("http");
http = __toESM(http, 1);
let https = require("https");
https = __toESM(https, 1);
let events = require("events");
events = __toESM(events, 1);
let assert = require("assert");
let util = require("util");
util = __toESM(util, 1);
let child_process = require("child_process");
child_process = __toESM(child_process, 1);
let timers = require("timers");
let stream = require("stream");
stream = __toESM(stream, 1);
//#region node_modules/.pnpm/@actions+core@3.0.1/node_modules/@actions/core/lib/utils.js
/**
* Sanitizes an input into a string so it can be passed into issueCommand safely
* @param input input to sanitize into a string
*/
function toCommandValue(input) {
	if (input === null || input === void 0) return "";
	else if (typeof input === "string" || input instanceof String) return input;
	return JSON.stringify(input);
}
/**
*
* @param annotationProperties
* @returns The command properties to send with the actual annotation command
* See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
*/
function toCommandProperties(annotationProperties) {
	if (!Object.keys(annotationProperties).length) return {};
	return {
		title: annotationProperties.title,
		file: annotationProperties.file,
		line: annotationProperties.startLine,
		endLine: annotationProperties.endLine,
		col: annotationProperties.startColumn,
		endColumn: annotationProperties.endColumn
	};
}
//#endregion
//#region node_modules/.pnpm/@actions+core@3.0.1/node_modules/@actions/core/lib/command.js
/**
* Issues a command to the GitHub Actions runner
*
* @param command - The command name to issue
* @param properties - Additional properties for the command (key-value pairs)
* @param message - The message to include with the command
* @remarks
* This function outputs a specially formatted string to stdout that the Actions
* runner interprets as a command. These commands can control workflow behavior,
* set outputs, create annotations, mask values, and more.
*
* Command Format:
*   ::name key=value,key=value::message
*
* @example
* ```typescript
* // Issue a warning annotation
* issueCommand('warning', {}, 'This is a warning message');
* // Output: ::warning::This is a warning message
*
* // Set an environment variable
* issueCommand('set-env', { name: 'MY_VAR' }, 'some value');
* // Output: ::set-env name=MY_VAR::some value
*
* // Add a secret mask
* issueCommand('add-mask', {}, 'secretValue123');
* // Output: ::add-mask::secretValue123
* ```
*
* @internal
* This is an internal utility function that powers the public API functions
* such as setSecret, warning, error, and exportVariable.
*/
function issueCommand(command, properties, message) {
	const cmd = new Command(command, properties, message);
	process.stdout.write(cmd.toString() + os.EOL);
}
const CMD_STRING = "::";
var Command = class {
	constructor(command, properties, message) {
		if (!command) command = "missing.command";
		this.command = command;
		this.properties = properties;
		this.message = message;
	}
	toString() {
		let cmdStr = CMD_STRING + this.command;
		if (this.properties && Object.keys(this.properties).length > 0) {
			cmdStr += " ";
			let first = true;
			for (const key in this.properties) if (this.properties.hasOwnProperty(key)) {
				const val = this.properties[key];
				if (val) {
					if (first) first = false;
					else cmdStr += ",";
					cmdStr += `${key}=${escapeProperty(val)}`;
				}
			}
		}
		cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
		return cmdStr;
	}
};
function escapeData(s) {
	return toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
function escapeProperty(s) {
	return toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
}
//#endregion
//#region node_modules/.pnpm/@actions+http-client@4.0.1/node_modules/@actions/http-client/lib/proxy.js
function getProxyUrl(reqUrl) {
	const usingSsl = reqUrl.protocol === "https:";
	if (checkBypass(reqUrl)) return;
	const proxyVar = (() => {
		if (usingSsl) return process.env["https_proxy"] || process.env["HTTPS_PROXY"];
		else return process.env["http_proxy"] || process.env["HTTP_PROXY"];
	})();
	if (proxyVar) try {
		return new DecodedURL(proxyVar);
	} catch (_a) {
		if (!proxyVar.startsWith("http://") && !proxyVar.startsWith("https://")) return new DecodedURL(`http://${proxyVar}`);
	}
	else return;
}
function checkBypass(reqUrl) {
	if (!reqUrl.hostname) return false;
	const reqHost = reqUrl.hostname;
	if (isLoopbackAddress(reqHost)) return true;
	const noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || "";
	if (!noProxy) return false;
	let reqPort;
	if (reqUrl.port) reqPort = Number(reqUrl.port);
	else if (reqUrl.protocol === "http:") reqPort = 80;
	else if (reqUrl.protocol === "https:") reqPort = 443;
	const upperReqHosts = [reqUrl.hostname.toUpperCase()];
	if (typeof reqPort === "number") upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
	for (const upperNoProxyItem of noProxy.split(",").map((x) => x.trim().toUpperCase()).filter((x) => x)) if (upperNoProxyItem === "*" || upperReqHosts.some((x) => x === upperNoProxyItem || x.endsWith(`.${upperNoProxyItem}`) || upperNoProxyItem.startsWith(".") && x.endsWith(`${upperNoProxyItem}`))) return true;
	return false;
}
function isLoopbackAddress(host) {
	const hostLower = host.toLowerCase();
	return hostLower === "localhost" || hostLower.startsWith("127.") || hostLower.startsWith("[::1]") || hostLower.startsWith("[0:0:0:0:0:0:0:1]");
}
var DecodedURL = class extends URL {
	constructor(url, base) {
		super(url, base);
		this._decodedUsername = decodeURIComponent(super.username);
		this._decodedPassword = decodeURIComponent(super.password);
	}
	get username() {
		return this._decodedUsername;
	}
	get password() {
		return this._decodedPassword;
	}
};
//#endregion
//#region node_modules/.pnpm/tunnel@0.0.6/node_modules/tunnel/lib/tunnel.js
var require_tunnel$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	require("net");
	var tls = require("tls");
	var http$1 = require("http");
	var https$1 = require("https");
	var events$1 = require("events");
	require("assert");
	var util$1 = require("util");
	exports.httpOverHttp = httpOverHttp;
	exports.httpsOverHttp = httpsOverHttp;
	exports.httpOverHttps = httpOverHttps;
	exports.httpsOverHttps = httpsOverHttps;
	function httpOverHttp(options) {
		var agent = new TunnelingAgent(options);
		agent.request = http$1.request;
		return agent;
	}
	function httpsOverHttp(options) {
		var agent = new TunnelingAgent(options);
		agent.request = http$1.request;
		agent.createSocket = createSecureSocket;
		agent.defaultPort = 443;
		return agent;
	}
	function httpOverHttps(options) {
		var agent = new TunnelingAgent(options);
		agent.request = https$1.request;
		return agent;
	}
	function httpsOverHttps(options) {
		var agent = new TunnelingAgent(options);
		agent.request = https$1.request;
		agent.createSocket = createSecureSocket;
		agent.defaultPort = 443;
		return agent;
	}
	function TunnelingAgent(options) {
		var self = this;
		self.options = options || {};
		self.proxyOptions = self.options.proxy || {};
		self.maxSockets = self.options.maxSockets || http$1.Agent.defaultMaxSockets;
		self.requests = [];
		self.sockets = [];
		self.on("free", function onFree(socket, host, port, localAddress) {
			var options = toOptions(host, port, localAddress);
			for (var i = 0, len = self.requests.length; i < len; ++i) {
				var pending = self.requests[i];
				if (pending.host === options.host && pending.port === options.port) {
					self.requests.splice(i, 1);
					pending.request.onSocket(socket);
					return;
				}
			}
			socket.destroy();
			self.removeSocket(socket);
		});
	}
	util$1.inherits(TunnelingAgent, events$1.EventEmitter);
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
			headers: { host: options.host + ":" + options.port }
		});
		if (options.localAddress) connectOptions.localAddress = options.localAddress;
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
				var error = /* @__PURE__ */ new Error("tunneling socket could not be established, statusCode=" + res.statusCode);
				error.code = "ECONNRESET";
				options.request.emit("error", error);
				self.removeSocket(placeholder);
				return;
			}
			if (head.length > 0) {
				debug("got illegal response body from proxy");
				socket.destroy();
				var error = /* @__PURE__ */ new Error("got illegal response body from proxy");
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
			var error = /* @__PURE__ */ new Error("tunneling socket could not be established, cause=" + cause.message);
			error.code = "ECONNRESET";
			options.request.emit("error", error);
			self.removeSocket(placeholder);
		}
	};
	TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
		var pos = this.sockets.indexOf(socket);
		if (pos === -1) return;
		this.sockets.splice(pos, 1);
		var pending = this.requests.shift();
		if (pending) this.createSocket(pending, function(socket) {
			pending.request.onSocket(socket);
		});
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
		if (typeof host === "string") return {
			host,
			port,
			localAddress
		};
		return host;
	}
	function mergeOptions(target) {
		for (var i = 1, len = arguments.length; i < len; ++i) {
			var overrides = arguments[i];
			if (typeof overrides === "object") {
				var keys = Object.keys(overrides);
				for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
					var k = keys[j];
					if (overrides[k] !== void 0) target[k] = overrides[k];
				}
			}
		}
		return target;
	}
	var debug;
	if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) debug = function() {
		var args = Array.prototype.slice.call(arguments);
		if (typeof args[0] === "string") args[0] = "TUNNEL: " + args[0];
		else args.unshift("TUNNEL:");
		console.error.apply(console, args);
	};
	else debug = function() {};
}));
//#endregion
//#region node_modules/.pnpm/tunnel@0.0.6/node_modules/tunnel/index.js
var require_tunnel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_tunnel$1();
}));
//#endregion
//#region node_modules/.pnpm/@actions+http-client@4.0.1/node_modules/@actions/http-client/lib/index.js
var import_tunnel = /* @__PURE__ */ __toESM(require_tunnel(), 1);
var __awaiter$12 = function(thisArg, _arguments, P, generator) {
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
const ProxyAgent = void 0;
var HttpCodes;
(function(HttpCodes) {
	HttpCodes[HttpCodes["OK"] = 200] = "OK";
	HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
	HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
	HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
	HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
	HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
	HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
	HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
	HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
	HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
	HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
	HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
	HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
	HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
	HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
	HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
	HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
	HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
	HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
	HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
	HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
	HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
	HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
	HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
	HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
	HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
	HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes || (HttpCodes = {}));
var Headers;
(function(Headers) {
	Headers["Accept"] = "accept";
	Headers["ContentType"] = "content-type";
})(Headers || (Headers = {}));
var MediaTypes;
(function(MediaTypes) {
	MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes || (MediaTypes = {}));
const HttpRedirectCodes = [
	HttpCodes.MovedPermanently,
	HttpCodes.ResourceMoved,
	HttpCodes.SeeOther,
	HttpCodes.TemporaryRedirect,
	HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
	HttpCodes.BadGateway,
	HttpCodes.ServiceUnavailable,
	HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = [
	"OPTIONS",
	"GET",
	"DELETE",
	"HEAD"
];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
var HttpClientError = class HttpClientError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.name = "HttpClientError";
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, HttpClientError.prototype);
	}
};
var HttpClientResponse = class {
	constructor(message) {
		this.message = message;
	}
	readBody() {
		return __awaiter$12(this, void 0, void 0, function* () {
			return new Promise((resolve) => __awaiter$12(this, void 0, void 0, function* () {
				let output = Buffer.alloc(0);
				this.message.on("data", (chunk) => {
					output = Buffer.concat([output, chunk]);
				});
				this.message.on("end", () => {
					resolve(output.toString());
				});
			}));
		});
	}
	readBodyBuffer() {
		return __awaiter$12(this, void 0, void 0, function* () {
			return new Promise((resolve) => __awaiter$12(this, void 0, void 0, function* () {
				const chunks = [];
				this.message.on("data", (chunk) => {
					chunks.push(chunk);
				});
				this.message.on("end", () => {
					resolve(Buffer.concat(chunks));
				});
			}));
		});
	}
};
var HttpClient = class {
	constructor(userAgent, handlers, requestOptions) {
		this._ignoreSslError = false;
		this._allowRedirects = true;
		this._allowRedirectDowngrade = false;
		this._maxRedirects = 50;
		this._allowRetries = false;
		this._maxRetries = 1;
		this._keepAlive = false;
		this._disposed = false;
		this.userAgent = this._getUserAgentWithOrchestrationId(userAgent);
		this.handlers = handlers || [];
		this.requestOptions = requestOptions;
		if (requestOptions) {
			if (requestOptions.ignoreSslError != null) this._ignoreSslError = requestOptions.ignoreSslError;
			this._socketTimeout = requestOptions.socketTimeout;
			if (requestOptions.allowRedirects != null) this._allowRedirects = requestOptions.allowRedirects;
			if (requestOptions.allowRedirectDowngrade != null) this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
			if (requestOptions.maxRedirects != null) this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
			if (requestOptions.keepAlive != null) this._keepAlive = requestOptions.keepAlive;
			if (requestOptions.allowRetries != null) this._allowRetries = requestOptions.allowRetries;
			if (requestOptions.maxRetries != null) this._maxRetries = requestOptions.maxRetries;
		}
	}
	options(requestUrl, additionalHeaders) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return this.request("OPTIONS", requestUrl, null, additionalHeaders || {});
		});
	}
	get(requestUrl, additionalHeaders) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return this.request("GET", requestUrl, null, additionalHeaders || {});
		});
	}
	del(requestUrl, additionalHeaders) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return this.request("DELETE", requestUrl, null, additionalHeaders || {});
		});
	}
	post(requestUrl, data, additionalHeaders) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return this.request("POST", requestUrl, data, additionalHeaders || {});
		});
	}
	patch(requestUrl, data, additionalHeaders) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return this.request("PATCH", requestUrl, data, additionalHeaders || {});
		});
	}
	put(requestUrl, data, additionalHeaders) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return this.request("PUT", requestUrl, data, additionalHeaders || {});
		});
	}
	head(requestUrl, additionalHeaders) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return this.request("HEAD", requestUrl, null, additionalHeaders || {});
		});
	}
	sendStream(verb, requestUrl, stream, additionalHeaders) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return this.request(verb, requestUrl, stream, additionalHeaders);
		});
	}
	/**
	* Gets a typed object from an endpoint
	* Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
	*/
	getJson(requestUrl_1) {
		return __awaiter$12(this, arguments, void 0, function* (requestUrl, additionalHeaders = {}) {
			additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
			const res = yield this.get(requestUrl, additionalHeaders);
			return this._processResponse(res, this.requestOptions);
		});
	}
	postJson(requestUrl_1, obj_1) {
		return __awaiter$12(this, arguments, void 0, function* (requestUrl, obj, additionalHeaders = {}) {
			const data = JSON.stringify(obj, null, 2);
			additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
			additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultContentTypeHeader(additionalHeaders, MediaTypes.ApplicationJson);
			const res = yield this.post(requestUrl, data, additionalHeaders);
			return this._processResponse(res, this.requestOptions);
		});
	}
	putJson(requestUrl_1, obj_1) {
		return __awaiter$12(this, arguments, void 0, function* (requestUrl, obj, additionalHeaders = {}) {
			const data = JSON.stringify(obj, null, 2);
			additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
			additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultContentTypeHeader(additionalHeaders, MediaTypes.ApplicationJson);
			const res = yield this.put(requestUrl, data, additionalHeaders);
			return this._processResponse(res, this.requestOptions);
		});
	}
	patchJson(requestUrl_1, obj_1) {
		return __awaiter$12(this, arguments, void 0, function* (requestUrl, obj, additionalHeaders = {}) {
			const data = JSON.stringify(obj, null, 2);
			additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
			additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultContentTypeHeader(additionalHeaders, MediaTypes.ApplicationJson);
			const res = yield this.patch(requestUrl, data, additionalHeaders);
			return this._processResponse(res, this.requestOptions);
		});
	}
	/**
	* Makes a raw http request.
	* All other methods such as get, post, patch, and request ultimately call this.
	* Prefer get, del, post and patch
	*/
	request(verb, requestUrl, data, headers) {
		return __awaiter$12(this, void 0, void 0, function* () {
			if (this._disposed) throw new Error("Client has already been disposed.");
			const parsedUrl = new URL(requestUrl);
			let info = this._prepareRequest(verb, parsedUrl, headers);
			const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb) ? this._maxRetries + 1 : 1;
			let numTries = 0;
			let response;
			do {
				response = yield this.requestRaw(info, data);
				if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
					let authenticationHandler;
					for (const handler of this.handlers) if (handler.canHandleAuthentication(response)) {
						authenticationHandler = handler;
						break;
					}
					if (authenticationHandler) return authenticationHandler.handleAuthentication(this, info, data);
					else return response;
				}
				let redirectsRemaining = this._maxRedirects;
				while (response.message.statusCode && HttpRedirectCodes.includes(response.message.statusCode) && this._allowRedirects && redirectsRemaining > 0) {
					const redirectUrl = response.message.headers["location"];
					if (!redirectUrl) break;
					const parsedRedirectUrl = new URL(redirectUrl);
					if (parsedUrl.protocol === "https:" && parsedUrl.protocol !== parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
					yield response.readBody();
					if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
						for (const header in headers) if (header.toLowerCase() === "authorization") delete headers[header];
					}
					info = this._prepareRequest(verb, parsedRedirectUrl, headers);
					response = yield this.requestRaw(info, data);
					redirectsRemaining--;
				}
				if (!response.message.statusCode || !HttpResponseRetryCodes.includes(response.message.statusCode)) return response;
				numTries += 1;
				if (numTries < maxTries) {
					yield response.readBody();
					yield this._performExponentialBackoff(numTries);
				}
			} while (numTries < maxTries);
			return response;
		});
	}
	/**
	* Needs to be called if keepAlive is set to true in request options.
	*/
	dispose() {
		if (this._agent) this._agent.destroy();
		this._disposed = true;
	}
	/**
	* Raw request.
	* @param info
	* @param data
	*/
	requestRaw(info, data) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return new Promise((resolve, reject) => {
				function callbackForResult(err, res) {
					if (err) reject(err);
					else if (!res) reject(/* @__PURE__ */ new Error("Unknown error"));
					else resolve(res);
				}
				this.requestRawWithCallback(info, data, callbackForResult);
			});
		});
	}
	/**
	* Raw request with callback.
	* @param info
	* @param data
	* @param onResult
	*/
	requestRawWithCallback(info, data, onResult) {
		if (typeof data === "string") {
			if (!info.options.headers) info.options.headers = {};
			info.options.headers["Content-Length"] = Buffer.byteLength(data, "utf8");
		}
		let callbackCalled = false;
		function handleResult(err, res) {
			if (!callbackCalled) {
				callbackCalled = true;
				onResult(err, res);
			}
		}
		const req = info.httpModule.request(info.options, (msg) => {
			handleResult(void 0, new HttpClientResponse(msg));
		});
		let socket;
		req.on("socket", (sock) => {
			socket = sock;
		});
		req.setTimeout(this._socketTimeout || 3 * 6e4, () => {
			if (socket) socket.end();
			handleResult(/* @__PURE__ */ new Error(`Request timeout: ${info.options.path}`));
		});
		req.on("error", function(err) {
			handleResult(err);
		});
		if (data && typeof data === "string") req.write(data, "utf8");
		if (data && typeof data !== "string") {
			data.on("close", function() {
				req.end();
			});
			data.pipe(req);
		} else req.end();
	}
	/**
	* Gets an http agent. This function is useful when you need an http agent that handles
	* routing through a proxy server - depending upon the url and proxy environment variables.
	* @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
	*/
	getAgent(serverUrl) {
		const parsedUrl = new URL(serverUrl);
		return this._getAgent(parsedUrl);
	}
	getAgentDispatcher(serverUrl) {
		const parsedUrl = new URL(serverUrl);
		const proxyUrl = getProxyUrl(parsedUrl);
		if (!(proxyUrl && proxyUrl.hostname)) return;
		return this._getProxyAgentDispatcher(parsedUrl, proxyUrl);
	}
	_prepareRequest(method, requestUrl, headers) {
		const info = {};
		info.parsedUrl = requestUrl;
		const usingSsl = info.parsedUrl.protocol === "https:";
		info.httpModule = usingSsl ? https : http;
		const defaultPort = usingSsl ? 443 : 80;
		info.options = {};
		info.options.host = info.parsedUrl.hostname;
		info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
		info.options.path = (info.parsedUrl.pathname || "") + (info.parsedUrl.search || "");
		info.options.method = method;
		info.options.headers = this._mergeHeaders(headers);
		if (this.userAgent != null) info.options.headers["user-agent"] = this.userAgent;
		info.options.agent = this._getAgent(info.parsedUrl);
		if (this.handlers) for (const handler of this.handlers) handler.prepareRequest(info.options);
		return info;
	}
	_mergeHeaders(headers) {
		if (this.requestOptions && this.requestOptions.headers) return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
		return lowercaseKeys(headers || {});
	}
	/**
	* Gets an existing header value or returns a default.
	* Handles converting number header values to strings since HTTP headers must be strings.
	* Note: This returns string | string[] since some headers can have multiple values.
	* For headers that must always be a single string (like Content-Type), use the
	* specialized _getExistingOrDefaultContentTypeHeader method instead.
	*/
	_getExistingOrDefaultHeader(additionalHeaders, header, _default) {
		let clientHeader;
		if (this.requestOptions && this.requestOptions.headers) {
			const headerValue = lowercaseKeys(this.requestOptions.headers)[header];
			if (headerValue) clientHeader = typeof headerValue === "number" ? headerValue.toString() : headerValue;
		}
		const additionalValue = additionalHeaders[header];
		if (additionalValue !== void 0) return typeof additionalValue === "number" ? additionalValue.toString() : additionalValue;
		if (clientHeader !== void 0) return clientHeader;
		return _default;
	}
	/**
	* Specialized version of _getExistingOrDefaultHeader for Content-Type header.
	* Always returns a single string (not an array) since Content-Type should be a single value.
	* Converts arrays to comma-separated strings and numbers to strings to ensure type safety.
	* This was split from _getExistingOrDefaultHeader to provide stricter typing for callers
	* that assign the result to places expecting a string (e.g., additionalHeaders[Headers.ContentType]).
	*/
	_getExistingOrDefaultContentTypeHeader(additionalHeaders, _default) {
		let clientHeader;
		if (this.requestOptions && this.requestOptions.headers) {
			const headerValue = lowercaseKeys(this.requestOptions.headers)[Headers.ContentType];
			if (headerValue) if (typeof headerValue === "number") clientHeader = String(headerValue);
			else if (Array.isArray(headerValue)) clientHeader = headerValue.join(", ");
			else clientHeader = headerValue;
		}
		const additionalValue = additionalHeaders[Headers.ContentType];
		if (additionalValue !== void 0) if (typeof additionalValue === "number") return String(additionalValue);
		else if (Array.isArray(additionalValue)) return additionalValue.join(", ");
		else return additionalValue;
		if (clientHeader !== void 0) return clientHeader;
		return _default;
	}
	_getAgent(parsedUrl) {
		let agent;
		const proxyUrl = getProxyUrl(parsedUrl);
		const useProxy = proxyUrl && proxyUrl.hostname;
		if (this._keepAlive && useProxy) agent = this._proxyAgent;
		if (!useProxy) agent = this._agent;
		if (agent) return agent;
		const usingSsl = parsedUrl.protocol === "https:";
		let maxSockets = 100;
		if (this.requestOptions) maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
		if (proxyUrl && proxyUrl.hostname) {
			const agentOptions = {
				maxSockets,
				keepAlive: this._keepAlive,
				proxy: Object.assign(Object.assign({}, (proxyUrl.username || proxyUrl.password) && { proxyAuth: `${proxyUrl.username}:${proxyUrl.password}` }), {
					host: proxyUrl.hostname,
					port: proxyUrl.port
				})
			};
			let tunnelAgent;
			const overHttps = proxyUrl.protocol === "https:";
			if (usingSsl) tunnelAgent = overHttps ? import_tunnel.httpsOverHttps : import_tunnel.httpsOverHttp;
			else tunnelAgent = overHttps ? import_tunnel.httpOverHttps : import_tunnel.httpOverHttp;
			agent = tunnelAgent(agentOptions);
			this._proxyAgent = agent;
		}
		if (!agent) {
			const options = {
				keepAlive: this._keepAlive,
				maxSockets
			};
			agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
			this._agent = agent;
		}
		if (usingSsl && this._ignoreSslError) agent.options = Object.assign(agent.options || {}, { rejectUnauthorized: false });
		return agent;
	}
	_getProxyAgentDispatcher(parsedUrl, proxyUrl) {
		let proxyAgent;
		if (this._keepAlive) proxyAgent = this._proxyAgentDispatcher;
		if (proxyAgent) return proxyAgent;
		const usingSsl = parsedUrl.protocol === "https:";
		proxyAgent = new ProxyAgent(Object.assign({
			uri: proxyUrl.href,
			pipelining: !this._keepAlive ? 0 : 1
		}, (proxyUrl.username || proxyUrl.password) && { token: `Basic ${Buffer.from(`${proxyUrl.username}:${proxyUrl.password}`).toString("base64")}` }));
		this._proxyAgentDispatcher = proxyAgent;
		if (usingSsl && this._ignoreSslError) proxyAgent.options = Object.assign(proxyAgent.options.requestTls || {}, { rejectUnauthorized: false });
		return proxyAgent;
	}
	_getUserAgentWithOrchestrationId(userAgent) {
		const baseUserAgent = userAgent || "actions/http-client";
		const orchId = process.env["ACTIONS_ORCHESTRATION_ID"];
		if (orchId) return `${baseUserAgent} actions_orchestration_id/${orchId.replace(/[^a-z0-9_.-]/gi, "_")}`;
		return baseUserAgent;
	}
	_performExponentialBackoff(retryNumber) {
		return __awaiter$12(this, void 0, void 0, function* () {
			retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
			const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
			return new Promise((resolve) => setTimeout(() => resolve(), ms));
		});
	}
	_processResponse(res, options) {
		return __awaiter$12(this, void 0, void 0, function* () {
			return new Promise((resolve, reject) => __awaiter$12(this, void 0, void 0, function* () {
				const statusCode = res.message.statusCode || 0;
				const response = {
					statusCode,
					result: null,
					headers: {}
				};
				if (statusCode === HttpCodes.NotFound) resolve(response);
				function dateTimeDeserializer(key, value) {
					if (typeof value === "string") {
						const a = new Date(value);
						if (!isNaN(a.valueOf())) return a;
					}
					return value;
				}
				let obj;
				let contents;
				try {
					contents = yield res.readBody();
					if (contents && contents.length > 0) {
						if (options && options.deserializeDates) obj = JSON.parse(contents, dateTimeDeserializer);
						else obj = JSON.parse(contents);
						response.result = obj;
					}
					response.headers = res.message.headers;
				} catch (err) {}
				if (statusCode > 299) {
					let msg;
					if (obj && obj.message) msg = obj.message;
					else if (contents && contents.length > 0) msg = contents;
					else msg = `Failed request: (${statusCode})`;
					const err = new HttpClientError(msg, statusCode);
					err.result = response.result;
					reject(err);
				} else resolve(response);
			}));
		});
	}
};
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
//#endregion
//#region node_modules/.pnpm/@actions+http-client@4.0.1/node_modules/@actions/http-client/lib/auth.js
var __awaiter$11 = function(thisArg, _arguments, P, generator) {
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
//#endregion
//#region node_modules/.pnpm/@actions+core@3.0.1/node_modules/@actions/core/lib/oidc-utils.js
var __awaiter$10 = function(thisArg, _arguments, P, generator) {
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
//#endregion
//#region node_modules/.pnpm/@actions+core@3.0.1/node_modules/@actions/core/lib/summary.js
var __awaiter$9 = function(thisArg, _arguments, P, generator) {
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
const { access, appendFile, writeFile } = fs.promises;
const SUMMARY_ENV_VAR = "GITHUB_STEP_SUMMARY";
var Summary = class {
	constructor() {
		this._buffer = "";
	}
	/**
	* Finds the summary file path from the environment, rejects if env var is not found or file does not exist
	* Also checks r/w permissions.
	*
	* @returns step summary file path
	*/
	filePath() {
		return __awaiter$9(this, void 0, void 0, function* () {
			if (this._filePath) return this._filePath;
			const pathFromEnv = process.env[SUMMARY_ENV_VAR];
			if (!pathFromEnv) throw new Error(`Unable to find environment variable for $${SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
			try {
				yield access(pathFromEnv, fs.constants.R_OK | fs.constants.W_OK);
			} catch (_a) {
				throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
			}
			this._filePath = pathFromEnv;
			return this._filePath;
		});
	}
	/**
	* Wraps content in an HTML tag, adding any HTML attributes
	*
	* @param {string} tag HTML tag to wrap
	* @param {string | null} content content within the tag
	* @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
	*
	* @returns {string} content wrapped in HTML element
	*/
	wrap(tag, content, attrs = {}) {
		const htmlAttrs = Object.entries(attrs).map(([key, value]) => ` ${key}="${value}"`).join("");
		if (!content) return `<${tag}${htmlAttrs}>`;
		return `<${tag}${htmlAttrs}>${content}</${tag}>`;
	}
	/**
	* Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
	*
	* @param {SummaryWriteOptions} [options] (optional) options for write operation
	*
	* @returns {Promise<Summary>} summary instance
	*/
	write(options) {
		return __awaiter$9(this, void 0, void 0, function* () {
			const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
			const filePath = yield this.filePath();
			yield (overwrite ? writeFile : appendFile)(filePath, this._buffer, { encoding: "utf8" });
			return this.emptyBuffer();
		});
	}
	/**
	* Clears the summary buffer and wipes the summary file
	*
	* @returns {Summary} summary instance
	*/
	clear() {
		return __awaiter$9(this, void 0, void 0, function* () {
			return this.emptyBuffer().write({ overwrite: true });
		});
	}
	/**
	* Returns the current summary buffer as a string
	*
	* @returns {string} string of summary buffer
	*/
	stringify() {
		return this._buffer;
	}
	/**
	* If the summary buffer is empty
	*
	* @returns {boolen} true if the buffer is empty
	*/
	isEmptyBuffer() {
		return this._buffer.length === 0;
	}
	/**
	* Resets the summary buffer without writing to summary file
	*
	* @returns {Summary} summary instance
	*/
	emptyBuffer() {
		this._buffer = "";
		return this;
	}
	/**
	* Adds raw text to the summary buffer
	*
	* @param {string} text content to add
	* @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
	*
	* @returns {Summary} summary instance
	*/
	addRaw(text, addEOL = false) {
		this._buffer += text;
		return addEOL ? this.addEOL() : this;
	}
	/**
	* Adds the operating system-specific end-of-line marker to the buffer
	*
	* @returns {Summary} summary instance
	*/
	addEOL() {
		return this.addRaw(os.EOL);
	}
	/**
	* Adds an HTML codeblock to the summary buffer
	*
	* @param {string} code content to render within fenced code block
	* @param {string} lang (optional) language to syntax highlight code
	*
	* @returns {Summary} summary instance
	*/
	addCodeBlock(code, lang) {
		const attrs = Object.assign({}, lang && { lang });
		const element = this.wrap("pre", this.wrap("code", code), attrs);
		return this.addRaw(element).addEOL();
	}
	/**
	* Adds an HTML list to the summary buffer
	*
	* @param {string[]} items list of items to render
	* @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
	*
	* @returns {Summary} summary instance
	*/
	addList(items, ordered = false) {
		const tag = ordered ? "ol" : "ul";
		const listItems = items.map((item) => this.wrap("li", item)).join("");
		const element = this.wrap(tag, listItems);
		return this.addRaw(element).addEOL();
	}
	/**
	* Adds an HTML table to the summary buffer
	*
	* @param {SummaryTableCell[]} rows table rows
	*
	* @returns {Summary} summary instance
	*/
	addTable(rows) {
		const tableBody = rows.map((row) => {
			const cells = row.map((cell) => {
				if (typeof cell === "string") return this.wrap("td", cell);
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
	/**
	* Adds a collapsable HTML details element to the summary buffer
	*
	* @param {string} label text for the closed state
	* @param {string} content collapsable content
	*
	* @returns {Summary} summary instance
	*/
	addDetails(label, content) {
		const element = this.wrap("details", this.wrap("summary", label) + content);
		return this.addRaw(element).addEOL();
	}
	/**
	* Adds an HTML image tag to the summary buffer
	*
	* @param {string} src path to the image you to embed
	* @param {string} alt text description of the image
	* @param {SummaryImageOptions} options (optional) addition image attributes
	*
	* @returns {Summary} summary instance
	*/
	addImage(src, alt, options) {
		const { width, height } = options || {};
		const attrs = Object.assign(Object.assign({}, width && { width }), height && { height });
		const element = this.wrap("img", null, Object.assign({
			src,
			alt
		}, attrs));
		return this.addRaw(element).addEOL();
	}
	/**
	* Adds an HTML section heading element
	*
	* @param {string} text heading text
	* @param {number | string} [level=1] (optional) the heading level, default: 1
	*
	* @returns {Summary} summary instance
	*/
	addHeading(text, level) {
		const tag = `h${level}`;
		const allowedTag = [
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6"
		].includes(tag) ? tag : "h1";
		const element = this.wrap(allowedTag, text);
		return this.addRaw(element).addEOL();
	}
	/**
	* Adds an HTML thematic break (<hr>) to the summary buffer
	*
	* @returns {Summary} summary instance
	*/
	addSeparator() {
		const element = this.wrap("hr", null);
		return this.addRaw(element).addEOL();
	}
	/**
	* Adds an HTML line break (<br>) to the summary buffer
	*
	* @returns {Summary} summary instance
	*/
	addBreak() {
		const element = this.wrap("br", null);
		return this.addRaw(element).addEOL();
	}
	/**
	* Adds an HTML blockquote to the summary buffer
	*
	* @param {string} text quote text
	* @param {string} cite (optional) citation url
	*
	* @returns {Summary} summary instance
	*/
	addQuote(text, cite) {
		const attrs = Object.assign({}, cite && { cite });
		const element = this.wrap("blockquote", text, attrs);
		return this.addRaw(element).addEOL();
	}
	/**
	* Adds an HTML anchor tag to the summary buffer
	*
	* @param {string} text link text/content
	* @param {string} href hyperlink
	*
	* @returns {Summary} summary instance
	*/
	addLink(text, href) {
		const element = this.wrap("a", text, { href });
		return this.addRaw(element).addEOL();
	}
};
const _summary = new Summary();
//#endregion
//#region node_modules/.pnpm/@actions+io@3.0.2/node_modules/@actions/io/lib/io-util.js
var __awaiter$8 = function(thisArg, _arguments, P, generator) {
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
const { chmod, copyFile: copyFile$1, lstat, mkdir, open, readdir, rename, rm, rmdir, stat, symlink, unlink } = fs.promises;
const IS_WINDOWS$2 = process.platform === "win32";
/**
* Custom implementation of readlink to ensure Windows junctions
* maintain trailing backslash for backward compatibility with Node.js < 24
*
* In Node.js 20, Windows junctions (directory symlinks) always returned paths
* with trailing backslashes. Node.js 24 removed this behavior, which breaks
* code that relied on this format for path operations.
*
* This implementation restores the Node 20 behavior by adding a trailing
* backslash to all junction results on Windows.
*/
function readlink(fsPath) {
	return __awaiter$8(this, void 0, void 0, function* () {
		const result = yield fs.promises.readlink(fsPath);
		if (IS_WINDOWS$2 && !result.endsWith("\\")) return `${result}\\`;
		return result;
	});
}
const READONLY = fs.constants.O_RDONLY;
function exists(fsPath) {
	return __awaiter$8(this, void 0, void 0, function* () {
		try {
			yield stat(fsPath);
		} catch (err) {
			if (err.code === "ENOENT") return false;
			throw err;
		}
		return true;
	});
}
/**
* On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
* \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
*/
function isRooted(p) {
	p = normalizeSeparators(p);
	if (!p) throw new Error("isRooted() parameter \"p\" cannot be empty");
	if (IS_WINDOWS$2) return p.startsWith("\\") || /^[A-Z]:/i.test(p);
	return p.startsWith("/");
}
/**
* Best effort attempt to determine whether a file exists and is executable.
* @param filePath    file path to check
* @param extensions  additional file extensions to try
* @return if file exists and is executable, returns the file path. otherwise empty string.
*/
function tryGetExecutablePath(filePath, extensions) {
	return __awaiter$8(this, void 0, void 0, function* () {
		let stats = void 0;
		try {
			stats = yield stat(filePath);
		} catch (err) {
			if (err.code !== "ENOENT") console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
		}
		if (stats && stats.isFile()) {
			if (IS_WINDOWS$2) {
				const upperExt = path.extname(filePath).toUpperCase();
				if (extensions.some((validExt) => validExt.toUpperCase() === upperExt)) return filePath;
			} else if (isUnixExecutable(stats)) return filePath;
		}
		const originalFilePath = filePath;
		for (const extension of extensions) {
			filePath = originalFilePath + extension;
			stats = void 0;
			try {
				stats = yield stat(filePath);
			} catch (err) {
				if (err.code !== "ENOENT") console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
			}
			if (stats && stats.isFile()) {
				if (IS_WINDOWS$2) {
					try {
						const directory = path.dirname(filePath);
						const upperName = path.basename(filePath).toUpperCase();
						for (const actualName of yield readdir(directory)) if (upperName === actualName.toUpperCase()) {
							filePath = path.join(directory, actualName);
							break;
						}
					} catch (err) {
						console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
					}
					return filePath;
				} else if (isUnixExecutable(stats)) return filePath;
			}
		}
		return "";
	});
}
function normalizeSeparators(p) {
	p = p || "";
	if (IS_WINDOWS$2) {
		p = p.replace(/\//g, "\\");
		return p.replace(/\\\\+/g, "\\");
	}
	return p.replace(/\/\/+/g, "/");
}
function isUnixExecutable(stats) {
	return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && process.getgid !== void 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && process.getuid !== void 0 && stats.uid === process.getuid();
}
//#endregion
//#region node_modules/.pnpm/@actions+io@3.0.2/node_modules/@actions/io/lib/io.js
var __awaiter$7 = function(thisArg, _arguments, P, generator) {
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
/**
* Copies a file or folder.
* Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
*
* @param     source    source path
* @param     dest      destination path
* @param     options   optional. See CopyOptions.
*/
function cp(source_1, dest_1) {
	return __awaiter$7(this, arguments, void 0, function* (source, dest, options = {}) {
		const { force, recursive, copySourceDirectory } = readCopyOptions(options);
		const destStat = (yield exists(dest)) ? yield stat(dest) : null;
		if (destStat && destStat.isFile() && !force) return;
		const newDest = destStat && destStat.isDirectory() && copySourceDirectory ? path.join(dest, path.basename(source)) : dest;
		if (!(yield exists(source))) throw new Error(`no such file or directory: ${source}`);
		if ((yield stat(source)).isDirectory()) if (!recursive) throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
		else yield cpDirRecursive(source, newDest, 0, force);
		else {
			if (path.relative(source, newDest) === "") throw new Error(`'${newDest}' and '${source}' are the same file`);
			yield copyFile(source, newDest, force);
		}
	});
}
/**
* Remove a path recursively with force
*
* @param inputPath path to remove
*/
function rmRF(inputPath) {
	return __awaiter$7(this, void 0, void 0, function* () {
		if (IS_WINDOWS$2) {
			if (/[*"<>|]/.test(inputPath)) throw new Error("File path must not contain `*`, `\"`, `<`, `>` or `|` on Windows");
		}
		try {
			yield rm(inputPath, {
				force: true,
				maxRetries: 3,
				recursive: true,
				retryDelay: 300
			});
		} catch (err) {
			throw new Error(`File was unable to be removed ${err}`);
		}
	});
}
/**
* Make a directory.  Creates the full path with folders in between
* Will throw if it fails
*
* @param   fsPath        path to create
* @returns Promise<void>
*/
function mkdirP(fsPath) {
	return __awaiter$7(this, void 0, void 0, function* () {
		(0, assert.ok)(fsPath, "a path argument must be provided");
		yield mkdir(fsPath, { recursive: true });
	});
}
/**
* Returns path of a tool had the tool actually been invoked.  Resolves via paths.
* If you check and the tool does not exist, it will throw.
*
* @param     tool              name of the tool
* @param     check             whether to check if tool exists
* @returns   Promise<string>   path to tool
*/
function which$1(tool, check) {
	return __awaiter$7(this, void 0, void 0, function* () {
		if (!tool) throw new Error("parameter 'tool' is required");
		if (check) {
			const result = yield which$1(tool, false);
			if (!result) if (IS_WINDOWS$2) throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
			else throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
			return result;
		}
		const matches = yield findInPath(tool);
		if (matches && matches.length > 0) return matches[0];
		return "";
	});
}
/**
* Returns a list of all occurrences of the given tool on the system path.
*
* @returns   Promise<string[]>  the paths of the tool
*/
function findInPath(tool) {
	return __awaiter$7(this, void 0, void 0, function* () {
		if (!tool) throw new Error("parameter 'tool' is required");
		const extensions = [];
		if (IS_WINDOWS$2 && process.env["PATHEXT"]) {
			for (const extension of process.env["PATHEXT"].split(path.delimiter)) if (extension) extensions.push(extension);
		}
		if (isRooted(tool)) {
			const filePath = yield tryGetExecutablePath(tool, extensions);
			if (filePath) return [filePath];
			return [];
		}
		if (tool.includes(path.sep)) return [];
		const directories = [];
		if (process.env.PATH) {
			for (const p of process.env.PATH.split(path.delimiter)) if (p) directories.push(p);
		}
		const matches = [];
		for (const directory of directories) {
			const filePath = yield tryGetExecutablePath(path.join(directory, tool), extensions);
			if (filePath) matches.push(filePath);
		}
		return matches;
	});
}
function readCopyOptions(options) {
	return {
		force: options.force == null ? true : options.force,
		recursive: Boolean(options.recursive),
		copySourceDirectory: options.copySourceDirectory == null ? true : Boolean(options.copySourceDirectory)
	};
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
	return __awaiter$7(this, void 0, void 0, function* () {
		if (currentDepth >= 255) return;
		currentDepth++;
		yield mkdirP(destDir);
		const files = yield readdir(sourceDir);
		for (const fileName of files) {
			const srcFile = `${sourceDir}/${fileName}`;
			const destFile = `${destDir}/${fileName}`;
			if ((yield lstat(srcFile)).isDirectory()) yield cpDirRecursive(srcFile, destFile, currentDepth, force);
			else yield copyFile(srcFile, destFile, force);
		}
		yield chmod(destDir, (yield stat(sourceDir)).mode);
	});
}
function copyFile(srcFile, destFile, force) {
	return __awaiter$7(this, void 0, void 0, function* () {
		if ((yield lstat(srcFile)).isSymbolicLink()) {
			try {
				yield lstat(destFile);
				yield unlink(destFile);
			} catch (e) {
				if (e.code === "EPERM") {
					yield chmod(destFile, "0666");
					yield unlink(destFile);
				}
			}
			yield symlink(yield readlink(srcFile), destFile, IS_WINDOWS$2 ? "junction" : null);
		} else if (!(yield exists(destFile)) || force) yield copyFile$1(srcFile, destFile);
	});
}
//#endregion
//#region node_modules/.pnpm/@actions+exec@3.0.0/node_modules/@actions/exec/lib/toolrunner.js
var __awaiter$6 = function(thisArg, _arguments, P, generator) {
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
const IS_WINDOWS$1 = process.platform === "win32";
var ToolRunner = class extends events.EventEmitter {
	constructor(toolPath, args, options) {
		super();
		if (!toolPath) throw new Error("Parameter 'toolPath' cannot be null or empty.");
		this.toolPath = toolPath;
		this.args = args || [];
		this.options = options || {};
	}
	_debug(message) {
		if (this.options.listeners && this.options.listeners.debug) this.options.listeners.debug(message);
	}
	_getCommandString(options, noPrefix) {
		const toolPath = this._getSpawnFileName();
		const args = this._getSpawnArgs(options);
		let cmd = noPrefix ? "" : "[command]";
		if (IS_WINDOWS$1) if (this._isCmdFile()) {
			cmd += toolPath;
			for (const a of args) cmd += ` ${a}`;
		} else if (options.windowsVerbatimArguments) {
			cmd += `"${toolPath}"`;
			for (const a of args) cmd += ` ${a}`;
		} else {
			cmd += this._windowsQuoteCmdArg(toolPath);
			for (const a of args) cmd += ` ${this._windowsQuoteCmdArg(a)}`;
		}
		else {
			cmd += toolPath;
			for (const a of args) cmd += ` ${a}`;
		}
		return cmd;
	}
	_processLineBuffer(data, strBuffer, onLine) {
		try {
			let s = strBuffer + data.toString();
			let n = s.indexOf(os.EOL);
			while (n > -1) {
				onLine(s.substring(0, n));
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
		if (IS_WINDOWS$1) {
			if (this._isCmdFile()) return process.env["COMSPEC"] || "cmd.exe";
		}
		return this.toolPath;
	}
	_getSpawnArgs(options) {
		if (IS_WINDOWS$1) {
			if (this._isCmdFile()) {
				let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
				for (const a of this.args) {
					argline += " ";
					argline += options.windowsVerbatimArguments ? a : this._windowsQuoteCmdArg(a);
				}
				argline += "\"";
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
		if (!this._isCmdFile()) return this._uvQuoteCmdArg(arg);
		if (!arg) return "\"\"";
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
			"\""
		];
		let needsQuotes = false;
		for (const char of arg) if (cmdSpecialChars.some((x) => x === char)) {
			needsQuotes = true;
			break;
		}
		if (!needsQuotes) return arg;
		let reverse = "\"";
		let quoteHit = true;
		for (let i = arg.length; i > 0; i--) {
			reverse += arg[i - 1];
			if (quoteHit && arg[i - 1] === "\\") reverse += "\\";
			else if (arg[i - 1] === "\"") {
				quoteHit = true;
				reverse += "\"";
			} else quoteHit = false;
		}
		reverse += "\"";
		return reverse.split("").reverse().join("");
	}
	_uvQuoteCmdArg(arg) {
		if (!arg) return "\"\"";
		if (!arg.includes(" ") && !arg.includes("	") && !arg.includes("\"")) return arg;
		if (!arg.includes("\"") && !arg.includes("\\")) return `"${arg}"`;
		let reverse = "\"";
		let quoteHit = true;
		for (let i = arg.length; i > 0; i--) {
			reverse += arg[i - 1];
			if (quoteHit && arg[i - 1] === "\\") reverse += "\\";
			else if (arg[i - 1] === "\"") {
				quoteHit = true;
				reverse += "\\";
			} else quoteHit = false;
		}
		reverse += "\"";
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
		if (options.windowsVerbatimArguments) result.argv0 = `"${toolPath}"`;
		return result;
	}
	/**
	* Exec a tool.
	* Output will be streamed to the live console.
	* Returns promise with return code
	*
	* @param     tool     path to tool to exec
	* @param     options  optional exec options.  See ExecOptions
	* @returns   number
	*/
	exec() {
		return __awaiter$6(this, void 0, void 0, function* () {
			if (!isRooted(this.toolPath) && (this.toolPath.includes("/") || IS_WINDOWS$1 && this.toolPath.includes("\\"))) this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
			this.toolPath = yield which$1(this.toolPath, true);
			return new Promise((resolve, reject) => __awaiter$6(this, void 0, void 0, function* () {
				this._debug(`exec tool: ${this.toolPath}`);
				this._debug("arguments:");
				for (const arg of this.args) this._debug(`   ${arg}`);
				const optionsNonNull = this._cloneExecOptions(this.options);
				if (!optionsNonNull.silent && optionsNonNull.outStream) optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
				const state = new ExecState(optionsNonNull, this.toolPath);
				state.on("debug", (message) => {
					this._debug(message);
				});
				if (this.options.cwd && !(yield exists(this.options.cwd))) return reject(/* @__PURE__ */ new Error(`The cwd: ${this.options.cwd} does not exist!`));
				const fileName = this._getSpawnFileName();
				const cp = child_process.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
				let stdbuffer = "";
				if (cp.stdout) cp.stdout.on("data", (data) => {
					if (this.options.listeners && this.options.listeners.stdout) this.options.listeners.stdout(data);
					if (!optionsNonNull.silent && optionsNonNull.outStream) optionsNonNull.outStream.write(data);
					stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
						if (this.options.listeners && this.options.listeners.stdline) this.options.listeners.stdline(line);
					});
				});
				let errbuffer = "";
				if (cp.stderr) cp.stderr.on("data", (data) => {
					state.processStderr = true;
					if (this.options.listeners && this.options.listeners.stderr) this.options.listeners.stderr(data);
					if (!optionsNonNull.silent && optionsNonNull.errStream && optionsNonNull.outStream) (optionsNonNull.failOnStdErr ? optionsNonNull.errStream : optionsNonNull.outStream).write(data);
					errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
						if (this.options.listeners && this.options.listeners.errline) this.options.listeners.errline(line);
					});
				});
				cp.on("error", (err) => {
					state.processError = err.message;
					state.processExited = true;
					state.processClosed = true;
					state.CheckComplete();
				});
				cp.on("exit", (code) => {
					state.processExitCode = code;
					state.processExited = true;
					this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
					state.CheckComplete();
				});
				cp.on("close", (code) => {
					state.processExitCode = code;
					state.processExited = true;
					state.processClosed = true;
					this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
					state.CheckComplete();
				});
				state.on("done", (error, exitCode) => {
					if (stdbuffer.length > 0) this.emit("stdline", stdbuffer);
					if (errbuffer.length > 0) this.emit("errline", errbuffer);
					cp.removeAllListeners();
					if (error) reject(error);
					else resolve(exitCode);
				});
				if (this.options.input) {
					if (!cp.stdin) throw new Error("child process missing stdin");
					cp.stdin.end(this.options.input);
				}
			}));
		});
	}
};
/**
* Convert an arg string to an array of args. Handles escaping
*
* @param    argString   string of arguments
* @returns  string[]    array of arguments
*/
function argStringToArray(argString) {
	const args = [];
	let inQuotes = false;
	let escaped = false;
	let arg = "";
	function append(c) {
		if (escaped && c !== "\"") arg += "\\";
		arg += c;
		escaped = false;
	}
	for (let i = 0; i < argString.length; i++) {
		const c = argString.charAt(i);
		if (c === "\"") {
			if (!escaped) inQuotes = !inQuotes;
			else append(c);
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
	if (arg.length > 0) args.push(arg.trim());
	return args;
}
var ExecState = class ExecState extends events.EventEmitter {
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
		if (!toolPath) throw new Error("toolPath must not be empty");
		this.options = options;
		this.toolPath = toolPath;
		if (options.delay) this.delay = options.delay;
	}
	CheckComplete() {
		if (this.done) return;
		if (this.processClosed) this._setResult();
		else if (this.processExited) this.timeout = (0, timers.setTimeout)(ExecState.HandleTimeout, this.delay, this);
	}
	_debug(message) {
		this.emit("debug", message);
	}
	_setResult() {
		let error;
		if (this.processExited) {
			if (this.processError) error = /* @__PURE__ */ new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
			else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) error = /* @__PURE__ */ new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
			else if (this.processStderr && this.options.failOnStdErr) error = /* @__PURE__ */ new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
		}
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		this.done = true;
		this.emit("done", error, this.processExitCode);
	}
	static HandleTimeout(state) {
		if (state.done) return;
		if (!state.processClosed && state.processExited) {
			const message = `The STDIO streams did not close within ${state.delay / 1e3} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
			state._debug(message);
		}
		state._setResult();
	}
};
//#endregion
//#region node_modules/.pnpm/@actions+exec@3.0.0/node_modules/@actions/exec/lib/exec.js
var __awaiter$5 = function(thisArg, _arguments, P, generator) {
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
/**
* Exec a command.
* Output will be streamed to the live console.
* Returns promise with return code
*
* @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
* @param     args               optional arguments for tool. Escaping is handled by the lib.
* @param     options            optional exec options.  See ExecOptions
* @returns   Promise<number>    exit code
*/
function exec(commandLine, args, options) {
	return __awaiter$5(this, void 0, void 0, function* () {
		const commandArgs = argStringToArray(commandLine);
		if (commandArgs.length === 0) throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
		const toolPath = commandArgs[0];
		args = commandArgs.slice(1).concat(args || []);
		return new ToolRunner(toolPath, args, options).exec();
	});
}
//#endregion
//#region node_modules/.pnpm/@actions+core@3.0.1/node_modules/@actions/core/lib/platform.js
var __awaiter$4 = function(thisArg, _arguments, P, generator) {
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
const platform = os.default.platform();
const arch = os.default.arch();
//#endregion
//#region node_modules/.pnpm/@actions+core@3.0.1/node_modules/@actions/core/lib/core.js
var __awaiter$3 = function(thisArg, _arguments, P, generator) {
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
/**
* The code to exit an action
*/
var ExitCode;
(function(ExitCode) {
	/**
	* A code indicating that the action was successful
	*/
	ExitCode[ExitCode["Success"] = 0] = "Success";
	/**
	* A code indicating that the action was a failure
	*/
	ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode || (ExitCode = {}));
/**
* Gets the value of an input.
* Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
* Returns an empty string if the value is not defined.
*
* @param     name     name of the input to get
* @param     options  optional. See InputOptions.
* @returns   string
*/
function getInput(name, options) {
	const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
	if (options && options.required && !val) throw new Error(`Input required and not supplied: ${name}`);
	if (options && options.trimWhitespace === false) return val;
	return val.trim();
}
/**
* Sets the action status to failed.
* When the action exits it will be with an exit code of 1
* @param message add error issue message
*/
function setFailed(message) {
	process.exitCode = ExitCode.Failure;
	error(message);
}
/**
* Gets whether Actions Step Debug is on or not
*/
function isDebug() {
	return process.env["RUNNER_DEBUG"] === "1";
}
/**
* Writes debug message to user log
* @param message debug message
*/
function debug(message) {
	issueCommand("debug", {}, message);
}
/**
* Adds an error issue
* @param message error issue message. Errors will be converted to string via toString()
* @param properties optional properties to add to the annotation.
*/
function error(message, properties = {}) {
	issueCommand("error", toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
* Adds a warning issue
* @param message warning issue message. Errors will be converted to string via toString()
* @param properties optional properties to add to the annotation.
*/
function warning(message, properties = {}) {
	issueCommand("warning", toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
* Writes info to log with console.log.
* @param message info message
*/
function info(message) {
	process.stdout.write(message + os.EOL);
}
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/lib/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ParserEND = 1114112;
	var ParserError = class ParserError extends Error {
		/* istanbul ignore next */
		constructor(msg, filename, linenumber) {
			super("[ParserError] " + msg, filename, linenumber);
			this.name = "ParserError";
			this.code = "ParserError";
			if (Error.captureStackTrace) Error.captureStackTrace(this, ParserError);
		}
	};
	var State = class {
		constructor(parser) {
			this.parser = parser;
			this.buf = "";
			this.returned = null;
			this.result = null;
			this.resultTable = null;
			this.resultArr = null;
		}
	};
	var Parser = class {
		constructor() {
			this.pos = 0;
			this.col = 0;
			this.line = 0;
			this.obj = {};
			this.ctx = this.obj;
			this.stack = [];
			this._buf = "";
			this.char = null;
			this.ii = 0;
			this.state = new State(this.parseStart);
		}
		parse(str) {
			/* istanbul ignore next */
			if (str.length === 0 || str.length == null) return;
			this._buf = String(str);
			this.ii = -1;
			this.char = -1;
			let getNext;
			while (getNext === false || this.nextChar()) getNext = this.runOne();
			this._buf = null;
		}
		nextChar() {
			if (this.char === 10) {
				++this.line;
				this.col = -1;
			}
			++this.ii;
			this.char = this._buf.codePointAt(this.ii);
			++this.pos;
			++this.col;
			return this.haveBuffer();
		}
		haveBuffer() {
			return this.ii < this._buf.length;
		}
		runOne() {
			return this.state.parser.call(this, this.state.returned);
		}
		finish() {
			this.char = ParserEND;
			let last;
			do {
				last = this.state.parser;
				this.runOne();
			} while (this.state.parser !== last);
			this.ctx = null;
			this.state = null;
			this._buf = null;
			return this.obj;
		}
		next(fn) {
			/* istanbul ignore next */
			if (typeof fn !== "function") throw new ParserError("Tried to set state to non-existent state: " + JSON.stringify(fn));
			this.state.parser = fn;
		}
		goto(fn) {
			this.next(fn);
			return this.runOne();
		}
		call(fn, returnWith) {
			if (returnWith) this.next(returnWith);
			this.stack.push(this.state);
			this.state = new State(fn);
		}
		callNow(fn, returnWith) {
			this.call(fn, returnWith);
			return this.runOne();
		}
		return(value) {
			/* istanbul ignore next */
			if (this.stack.length === 0) throw this.error(new ParserError("Stack underflow"));
			if (value === void 0) value = this.state.buf;
			this.state = this.stack.pop();
			this.state.returned = value;
		}
		returnNow(value) {
			this.return(value);
			return this.runOne();
		}
		consume() {
			/* istanbul ignore next */
			if (this.char === ParserEND) throw this.error(new ParserError("Unexpected end-of-buffer"));
			this.state.buf += this._buf[this.ii];
		}
		error(err) {
			err.line = this.line;
			err.col = this.col;
			err.pos = this.pos;
			return err;
		}
		/* istanbul ignore next */
		parseStart() {
			throw new ParserError("Must declare a parseStart method");
		}
	};
	Parser.END = ParserEND;
	Parser.Error = ParserError;
	module.exports = Parser;
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/lib/create-datetime.js
var require_create_datetime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (value) => {
		const date = new Date(value);
		/* istanbul ignore if */
		if (isNaN(date)) throw new TypeError("Invalid Datetime");
		else return date;
	};
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/lib/format-num.js
var require_format_num = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (d, num) => {
		num = String(num);
		while (num.length < d) num = "0" + num;
		return num;
	};
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/lib/create-datetime-float.js
var require_create_datetime_float = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const f = require_format_num();
	var FloatingDateTime = class extends Date {
		constructor(value) {
			super(value + "Z");
			this.isFloating = true;
		}
		toISOString() {
			return `${`${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`}T${`${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`}`;
		}
	};
	module.exports = (value) => {
		const date = new FloatingDateTime(value);
		/* istanbul ignore if */
		if (isNaN(date)) throw new TypeError("Invalid Datetime");
		else return date;
	};
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/lib/create-date.js
var require_create_date = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const f = require_format_num();
	const DateTime = global.Date;
	var Date = class extends DateTime {
		constructor(value) {
			super(value);
			this.isDate = true;
		}
		toISOString() {
			return `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`;
		}
	};
	module.exports = (value) => {
		const date = new Date(value);
		/* istanbul ignore if */
		if (isNaN(date)) throw new TypeError("Invalid Datetime");
		else return date;
	};
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/lib/create-time.js
var require_create_time = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const f = require_format_num();
	var Time = class extends Date {
		constructor(value) {
			super(`0000-01-01T${value}Z`);
			this.isTime = true;
		}
		toISOString() {
			return `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`;
		}
	};
	module.exports = (value) => {
		const date = new Time(value);
		/* istanbul ignore if */
		if (isNaN(date)) throw new TypeError("Invalid Datetime");
		else return date;
	};
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/lib/toml-parser.js
var require_toml_parser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = makeParserClass(require_parser());
	module.exports.makeParserClass = makeParserClass;
	var TomlError = class TomlError extends Error {
		constructor(msg) {
			super(msg);
			this.name = "TomlError";
			/* istanbul ignore next */
			if (Error.captureStackTrace) Error.captureStackTrace(this, TomlError);
			this.fromTOML = true;
			this.wrapped = null;
		}
	};
	TomlError.wrap = (err) => {
		const terr = new TomlError(err.message);
		terr.code = err.code;
		terr.wrapped = err;
		return terr;
	};
	module.exports.TomlError = TomlError;
	const createDateTime = require_create_datetime();
	const createDateTimeFloat = require_create_datetime_float();
	const createDate = require_create_date();
	const createTime = require_create_time();
	const CTRL_I = 9;
	const CTRL_J = 10;
	const CTRL_M = 13;
	const CTRL_CHAR_BOUNDARY = 31;
	const CHAR_SP = 32;
	const CHAR_QUOT = 34;
	const CHAR_NUM = 35;
	const CHAR_APOS = 39;
	const CHAR_PLUS = 43;
	const CHAR_COMMA = 44;
	const CHAR_HYPHEN = 45;
	const CHAR_PERIOD = 46;
	const CHAR_0 = 48;
	const CHAR_1 = 49;
	const CHAR_7 = 55;
	const CHAR_9 = 57;
	const CHAR_COLON = 58;
	const CHAR_EQUALS = 61;
	const CHAR_A = 65;
	const CHAR_E = 69;
	const CHAR_F = 70;
	const CHAR_T = 84;
	const CHAR_U = 85;
	const CHAR_Z = 90;
	const CHAR_LOWBAR = 95;
	const CHAR_a = 97;
	const CHAR_b = 98;
	const CHAR_e = 101;
	const CHAR_f = 102;
	const CHAR_i = 105;
	const CHAR_l = 108;
	const CHAR_n = 110;
	const CHAR_o = 111;
	const CHAR_r = 114;
	const CHAR_s = 115;
	const CHAR_t = 116;
	const CHAR_u = 117;
	const CHAR_x = 120;
	const CHAR_z = 122;
	const CHAR_LCUB = 123;
	const CHAR_RCUB = 125;
	const CHAR_LSQB = 91;
	const CHAR_BSOL = 92;
	const CHAR_RSQB = 93;
	const CHAR_DEL = 127;
	const SURROGATE_FIRST = 55296;
	const SURROGATE_LAST = 57343;
	const escapes = {
		[CHAR_b]: "\b",
		[CHAR_t]: "	",
		[CHAR_n]: "\n",
		[CHAR_f]: "\f",
		[CHAR_r]: "\r",
		[CHAR_QUOT]: "\"",
		[CHAR_BSOL]: "\\"
	};
	function isDigit(cp) {
		return cp >= CHAR_0 && cp <= CHAR_9;
	}
	function isHexit(cp) {
		return cp >= CHAR_A && cp <= CHAR_F || cp >= CHAR_a && cp <= CHAR_f || cp >= CHAR_0 && cp <= CHAR_9;
	}
	function isBit(cp) {
		return cp === CHAR_1 || cp === CHAR_0;
	}
	function isOctit(cp) {
		return cp >= CHAR_0 && cp <= CHAR_7;
	}
	function isAlphaNumQuoteHyphen(cp) {
		return cp >= CHAR_A && cp <= CHAR_Z || cp >= CHAR_a && cp <= CHAR_z || cp >= CHAR_0 && cp <= CHAR_9 || cp === CHAR_APOS || cp === CHAR_QUOT || cp === CHAR_LOWBAR || cp === CHAR_HYPHEN;
	}
	function isAlphaNumHyphen(cp) {
		return cp >= CHAR_A && cp <= CHAR_Z || cp >= CHAR_a && cp <= CHAR_z || cp >= CHAR_0 && cp <= CHAR_9 || cp === CHAR_LOWBAR || cp === CHAR_HYPHEN;
	}
	const _type = Symbol("type");
	const _declared = Symbol("declared");
	const hasOwnProperty = Object.prototype.hasOwnProperty;
	const defineProperty = Object.defineProperty;
	const descriptor = {
		configurable: true,
		enumerable: true,
		writable: true,
		value: void 0
	};
	function hasKey(obj, key) {
		if (hasOwnProperty.call(obj, key)) return true;
		if (key === "__proto__") defineProperty(obj, "__proto__", descriptor);
		return false;
	}
	const INLINE_TABLE = Symbol("inline-table");
	function InlineTable() {
		return Object.defineProperties({}, { [_type]: { value: INLINE_TABLE } });
	}
	function isInlineTable(obj) {
		if (obj === null || typeof obj !== "object") return false;
		return obj[_type] === INLINE_TABLE;
	}
	const TABLE = Symbol("table");
	function Table() {
		return Object.defineProperties({}, {
			[_type]: { value: TABLE },
			[_declared]: {
				value: false,
				writable: true
			}
		});
	}
	function isTable(obj) {
		if (obj === null || typeof obj !== "object") return false;
		return obj[_type] === TABLE;
	}
	const _contentType = Symbol("content-type");
	const INLINE_LIST = Symbol("inline-list");
	function InlineList(type) {
		return Object.defineProperties([], {
			[_type]: { value: INLINE_LIST },
			[_contentType]: { value: type }
		});
	}
	function isInlineList(obj) {
		if (obj === null || typeof obj !== "object") return false;
		return obj[_type] === INLINE_LIST;
	}
	const LIST = Symbol("list");
	function List() {
		return Object.defineProperties([], { [_type]: { value: LIST } });
	}
	function isList(obj) {
		if (obj === null || typeof obj !== "object") return false;
		return obj[_type] === LIST;
	}
	let _custom;
	try {
		const utilInspect = eval("require('util').inspect");
		_custom = utilInspect.custom;
	} catch (_) {}
	/* istanbul ignore next */
	const _inspect = _custom || "inspect";
	var BoxedBigInt = class {
		constructor(value) {
			try {
				this.value = global.BigInt.asIntN(64, value);
			} catch (_) {
				/* istanbul ignore next */
				this.value = null;
			}
			Object.defineProperty(this, _type, { value: INTEGER });
		}
		isNaN() {
			return this.value === null;
		}
		/* istanbul ignore next */
		toString() {
			return String(this.value);
		}
		/* istanbul ignore next */
		[_inspect]() {
			return `[BigInt: ${this.toString()}]}`;
		}
		valueOf() {
			return this.value;
		}
	};
	const INTEGER = Symbol("integer");
	function Integer(value) {
		let num = Number(value);
		if (Object.is(num, -0)) num = 0;
		/* istanbul ignore else */
		if (global.BigInt && !Number.isSafeInteger(num)) return new BoxedBigInt(value);
		else
 /* istanbul ignore next */
		return Object.defineProperties(new Number(num), {
			isNaN: { value: function() {
				return isNaN(this);
			} },
			[_type]: { value: INTEGER },
			[_inspect]: { value: () => `[Integer: ${value}]` }
		});
	}
	function isInteger(obj) {
		if (obj === null || typeof obj !== "object") return false;
		return obj[_type] === INTEGER;
	}
	const FLOAT = Symbol("float");
	function Float(value) {
		/* istanbul ignore next */
		return Object.defineProperties(new Number(value), {
			[_type]: { value: FLOAT },
			[_inspect]: { value: () => `[Float: ${value}]` }
		});
	}
	function isFloat(obj) {
		if (obj === null || typeof obj !== "object") return false;
		return obj[_type] === FLOAT;
	}
	function tomlType(value) {
		const type = typeof value;
		if (type === "object") {
			/* istanbul ignore if */
			if (value === null) return "null";
			if (value instanceof Date) return "datetime";
			/* istanbul ignore else */
			if (_type in value) switch (value[_type]) {
				case INLINE_TABLE: return "inline-table";
				case INLINE_LIST: return "inline-list";
				/* istanbul ignore next */
				case TABLE: return "table";
				/* istanbul ignore next */
				case LIST: return "list";
				case FLOAT: return "float";
				case INTEGER: return "integer";
			}
		}
		return type;
	}
	function makeParserClass(Parser) {
		class TOMLParser extends Parser {
			constructor() {
				super();
				this.ctx = this.obj = Table();
			}
			atEndOfWord() {
				return this.char === CHAR_NUM || this.char === CTRL_I || this.char === CHAR_SP || this.atEndOfLine();
			}
			atEndOfLine() {
				return this.char === Parser.END || this.char === CTRL_J || this.char === CTRL_M;
			}
			parseStart() {
				if (this.char === Parser.END) return null;
				else if (this.char === CHAR_LSQB) return this.call(this.parseTableOrList);
				else if (this.char === CHAR_NUM) return this.call(this.parseComment);
				else if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) return null;
				else if (isAlphaNumQuoteHyphen(this.char)) return this.callNow(this.parseAssignStatement);
				else throw this.error(new TomlError(`Unknown character "${this.char}"`));
			}
			parseWhitespaceToEOL() {
				if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) return null;
				else if (this.char === CHAR_NUM) return this.goto(this.parseComment);
				else if (this.char === Parser.END || this.char === CTRL_J) return this.return();
				else throw this.error(new TomlError("Unexpected character, expected only whitespace or comments till end of line"));
			}
			parseAssignStatement() {
				return this.callNow(this.parseAssign, this.recordAssignStatement);
			}
			recordAssignStatement(kv) {
				let target = this.ctx;
				let finalKey = kv.key.pop();
				for (let kw of kv.key) {
					if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) throw this.error(new TomlError("Can't redefine existing key"));
					target = target[kw] = target[kw] || Table();
				}
				if (hasKey(target, finalKey)) throw this.error(new TomlError("Can't redefine existing key"));
				if (isInteger(kv.value) || isFloat(kv.value)) target[finalKey] = kv.value.valueOf();
				else target[finalKey] = kv.value;
				return this.goto(this.parseWhitespaceToEOL);
			}
			parseAssign() {
				return this.callNow(this.parseKeyword, this.recordAssignKeyword);
			}
			recordAssignKeyword(key) {
				if (this.state.resultTable) this.state.resultTable.push(key);
				else this.state.resultTable = [key];
				return this.goto(this.parseAssignKeywordPreDot);
			}
			parseAssignKeywordPreDot() {
				if (this.char === CHAR_PERIOD) return this.next(this.parseAssignKeywordPostDot);
				else if (this.char !== CHAR_SP && this.char !== CTRL_I) return this.goto(this.parseAssignEqual);
			}
			parseAssignKeywordPostDot() {
				if (this.char !== CHAR_SP && this.char !== CTRL_I) return this.callNow(this.parseKeyword, this.recordAssignKeyword);
			}
			parseAssignEqual() {
				if (this.char === CHAR_EQUALS) return this.next(this.parseAssignPreValue);
				else throw this.error(new TomlError("Invalid character, expected \"=\""));
			}
			parseAssignPreValue() {
				if (this.char === CHAR_SP || this.char === CTRL_I) return null;
				else return this.callNow(this.parseValue, this.recordAssignValue);
			}
			recordAssignValue(value) {
				return this.returnNow({
					key: this.state.resultTable,
					value
				});
			}
			parseComment() {
				do
					if (this.char === Parser.END || this.char === CTRL_J) return this.return();
				while (this.nextChar());
			}
			parseTableOrList() {
				if (this.char === CHAR_LSQB) this.next(this.parseList);
				else return this.goto(this.parseTable);
			}
			parseTable() {
				this.ctx = this.obj;
				return this.goto(this.parseTableNext);
			}
			parseTableNext() {
				if (this.char === CHAR_SP || this.char === CTRL_I) return null;
				else return this.callNow(this.parseKeyword, this.parseTableMore);
			}
			parseTableMore(keyword) {
				if (this.char === CHAR_SP || this.char === CTRL_I) return null;
				else if (this.char === CHAR_RSQB) {
					if (hasKey(this.ctx, keyword) && (!isTable(this.ctx[keyword]) || this.ctx[keyword][_declared])) throw this.error(new TomlError("Can't redefine existing key"));
					else {
						this.ctx = this.ctx[keyword] = this.ctx[keyword] || Table();
						this.ctx[_declared] = true;
					}
					return this.next(this.parseWhitespaceToEOL);
				} else if (this.char === CHAR_PERIOD) {
					if (!hasKey(this.ctx, keyword)) this.ctx = this.ctx[keyword] = Table();
					else if (isTable(this.ctx[keyword])) this.ctx = this.ctx[keyword];
					else if (isList(this.ctx[keyword])) this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1];
					else throw this.error(new TomlError("Can't redefine existing key"));
					return this.next(this.parseTableNext);
				} else throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
			}
			parseList() {
				this.ctx = this.obj;
				return this.goto(this.parseListNext);
			}
			parseListNext() {
				if (this.char === CHAR_SP || this.char === CTRL_I) return null;
				else return this.callNow(this.parseKeyword, this.parseListMore);
			}
			parseListMore(keyword) {
				if (this.char === CHAR_SP || this.char === CTRL_I) return null;
				else if (this.char === CHAR_RSQB) {
					if (!hasKey(this.ctx, keyword)) this.ctx[keyword] = List();
					if (isInlineList(this.ctx[keyword])) throw this.error(new TomlError("Can't extend an inline array"));
					else if (isList(this.ctx[keyword])) {
						const next = Table();
						this.ctx[keyword].push(next);
						this.ctx = next;
					} else throw this.error(new TomlError("Can't redefine an existing key"));
					return this.next(this.parseListEnd);
				} else if (this.char === CHAR_PERIOD) {
					if (!hasKey(this.ctx, keyword)) this.ctx = this.ctx[keyword] = Table();
					else if (isInlineList(this.ctx[keyword])) throw this.error(new TomlError("Can't extend an inline array"));
					else if (isInlineTable(this.ctx[keyword])) throw this.error(new TomlError("Can't extend an inline table"));
					else if (isList(this.ctx[keyword])) this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1];
					else if (isTable(this.ctx[keyword])) this.ctx = this.ctx[keyword];
					else throw this.error(new TomlError("Can't redefine an existing key"));
					return this.next(this.parseListNext);
				} else throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
			}
			parseListEnd(keyword) {
				if (this.char === CHAR_RSQB) return this.next(this.parseWhitespaceToEOL);
				else throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
			}
			parseValue() {
				if (this.char === Parser.END) throw this.error(new TomlError("Key without value"));
				else if (this.char === CHAR_QUOT) return this.next(this.parseDoubleString);
				if (this.char === CHAR_APOS) return this.next(this.parseSingleString);
				else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) return this.goto(this.parseNumberSign);
				else if (this.char === CHAR_i) return this.next(this.parseInf);
				else if (this.char === CHAR_n) return this.next(this.parseNan);
				else if (isDigit(this.char)) return this.goto(this.parseNumberOrDateTime);
				else if (this.char === CHAR_t || this.char === CHAR_f) return this.goto(this.parseBoolean);
				else if (this.char === CHAR_LSQB) return this.call(this.parseInlineList, this.recordValue);
				else if (this.char === CHAR_LCUB) return this.call(this.parseInlineTable, this.recordValue);
				else throw this.error(new TomlError("Unexpected character, expecting string, number, datetime, boolean, inline array or inline table"));
			}
			recordValue(value) {
				return this.returnNow(value);
			}
			parseInf() {
				if (this.char === CHAR_n) return this.next(this.parseInf2);
				else throw this.error(new TomlError("Unexpected character, expected \"inf\", \"+inf\" or \"-inf\""));
			}
			parseInf2() {
				if (this.char === CHAR_f) if (this.state.buf === "-") return this.return(-Infinity);
				else return this.return(Infinity);
				else throw this.error(new TomlError("Unexpected character, expected \"inf\", \"+inf\" or \"-inf\""));
			}
			parseNan() {
				if (this.char === CHAR_a) return this.next(this.parseNan2);
				else throw this.error(new TomlError("Unexpected character, expected \"nan\""));
			}
			parseNan2() {
				if (this.char === CHAR_n) return this.return(NaN);
				else throw this.error(new TomlError("Unexpected character, expected \"nan\""));
			}
			parseKeyword() {
				if (this.char === CHAR_QUOT) return this.next(this.parseBasicString);
				else if (this.char === CHAR_APOS) return this.next(this.parseLiteralString);
				else return this.goto(this.parseBareKey);
			}
			parseBareKey() {
				do
					if (this.char === Parser.END) throw this.error(new TomlError("Key ended without value"));
					else if (isAlphaNumHyphen(this.char)) this.consume();
					else if (this.state.buf.length === 0) throw this.error(new TomlError("Empty bare keys are not allowed"));
					else return this.returnNow();
				while (this.nextChar());
			}
			parseSingleString() {
				if (this.char === CHAR_APOS) return this.next(this.parseLiteralMultiStringMaybe);
				else return this.goto(this.parseLiteralString);
			}
			parseLiteralString() {
				do
					if (this.char === CHAR_APOS) return this.return();
					else if (this.atEndOfLine()) throw this.error(new TomlError("Unterminated string"));
					else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I) throw this.errorControlCharInString();
					else this.consume();
				while (this.nextChar());
			}
			parseLiteralMultiStringMaybe() {
				if (this.char === CHAR_APOS) return this.next(this.parseLiteralMultiString);
				else return this.returnNow();
			}
			parseLiteralMultiString() {
				if (this.char === CTRL_M) return null;
				else if (this.char === CTRL_J) return this.next(this.parseLiteralMultiStringContent);
				else return this.goto(this.parseLiteralMultiStringContent);
			}
			parseLiteralMultiStringContent() {
				do
					if (this.char === CHAR_APOS) return this.next(this.parseLiteralMultiEnd);
					else if (this.char === Parser.END) throw this.error(new TomlError("Unterminated multi-line string"));
					else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M) throw this.errorControlCharInString();
					else this.consume();
				while (this.nextChar());
			}
			parseLiteralMultiEnd() {
				if (this.char === CHAR_APOS) return this.next(this.parseLiteralMultiEnd2);
				else {
					this.state.buf += "'";
					return this.goto(this.parseLiteralMultiStringContent);
				}
			}
			parseLiteralMultiEnd2() {
				if (this.char === CHAR_APOS) return this.return();
				else {
					this.state.buf += "''";
					return this.goto(this.parseLiteralMultiStringContent);
				}
			}
			parseDoubleString() {
				if (this.char === CHAR_QUOT) return this.next(this.parseMultiStringMaybe);
				else return this.goto(this.parseBasicString);
			}
			parseBasicString() {
				do
					if (this.char === CHAR_BSOL) return this.call(this.parseEscape, this.recordEscapeReplacement);
					else if (this.char === CHAR_QUOT) return this.return();
					else if (this.atEndOfLine()) throw this.error(new TomlError("Unterminated string"));
					else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I) throw this.errorControlCharInString();
					else this.consume();
				while (this.nextChar());
			}
			recordEscapeReplacement(replacement) {
				this.state.buf += replacement;
				return this.goto(this.parseBasicString);
			}
			parseMultiStringMaybe() {
				if (this.char === CHAR_QUOT) return this.next(this.parseMultiString);
				else return this.returnNow();
			}
			parseMultiString() {
				if (this.char === CTRL_M) return null;
				else if (this.char === CTRL_J) return this.next(this.parseMultiStringContent);
				else return this.goto(this.parseMultiStringContent);
			}
			parseMultiStringContent() {
				do
					if (this.char === CHAR_BSOL) return this.call(this.parseMultiEscape, this.recordMultiEscapeReplacement);
					else if (this.char === CHAR_QUOT) return this.next(this.parseMultiEnd);
					else if (this.char === Parser.END) throw this.error(new TomlError("Unterminated multi-line string"));
					else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M) throw this.errorControlCharInString();
					else this.consume();
				while (this.nextChar());
			}
			errorControlCharInString() {
				let displayCode = "\\u00";
				if (this.char < 16) displayCode += "0";
				displayCode += this.char.toString(16);
				return this.error(new TomlError(`Control characters (codes < 0x1f and 0x7f) are not allowed in strings, use ${displayCode} instead`));
			}
			recordMultiEscapeReplacement(replacement) {
				this.state.buf += replacement;
				return this.goto(this.parseMultiStringContent);
			}
			parseMultiEnd() {
				if (this.char === CHAR_QUOT) return this.next(this.parseMultiEnd2);
				else {
					this.state.buf += "\"";
					return this.goto(this.parseMultiStringContent);
				}
			}
			parseMultiEnd2() {
				if (this.char === CHAR_QUOT) return this.return();
				else {
					this.state.buf += "\"\"";
					return this.goto(this.parseMultiStringContent);
				}
			}
			parseMultiEscape() {
				if (this.char === CTRL_M || this.char === CTRL_J) return this.next(this.parseMultiTrim);
				else if (this.char === CHAR_SP || this.char === CTRL_I) return this.next(this.parsePreMultiTrim);
				else return this.goto(this.parseEscape);
			}
			parsePreMultiTrim() {
				if (this.char === CHAR_SP || this.char === CTRL_I) return null;
				else if (this.char === CTRL_M || this.char === CTRL_J) return this.next(this.parseMultiTrim);
				else throw this.error(new TomlError("Can't escape whitespace"));
			}
			parseMultiTrim() {
				if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) return null;
				else return this.returnNow();
			}
			parseEscape() {
				if (this.char in escapes) return this.return(escapes[this.char]);
				else if (this.char === CHAR_u) return this.call(this.parseSmallUnicode, this.parseUnicodeReturn);
				else if (this.char === CHAR_U) return this.call(this.parseLargeUnicode, this.parseUnicodeReturn);
				else throw this.error(new TomlError("Unknown escape character: " + this.char));
			}
			parseUnicodeReturn(char) {
				try {
					const codePoint = parseInt(char, 16);
					if (codePoint >= SURROGATE_FIRST && codePoint <= SURROGATE_LAST) throw this.error(new TomlError("Invalid unicode, character in range 0xD800 - 0xDFFF is reserved"));
					return this.returnNow(String.fromCodePoint(codePoint));
				} catch (err) {
					throw this.error(TomlError.wrap(err));
				}
			}
			parseSmallUnicode() {
				if (!isHexit(this.char)) throw this.error(new TomlError("Invalid character in unicode sequence, expected hex"));
				else {
					this.consume();
					if (this.state.buf.length >= 4) return this.return();
				}
			}
			parseLargeUnicode() {
				if (!isHexit(this.char)) throw this.error(new TomlError("Invalid character in unicode sequence, expected hex"));
				else {
					this.consume();
					if (this.state.buf.length >= 8) return this.return();
				}
			}
			parseNumberSign() {
				this.consume();
				return this.next(this.parseMaybeSignedInfOrNan);
			}
			parseMaybeSignedInfOrNan() {
				if (this.char === CHAR_i) return this.next(this.parseInf);
				else if (this.char === CHAR_n) return this.next(this.parseNan);
				else return this.callNow(this.parseNoUnder, this.parseNumberIntegerStart);
			}
			parseNumberIntegerStart() {
				if (this.char === CHAR_0) {
					this.consume();
					return this.next(this.parseNumberIntegerExponentOrDecimal);
				} else return this.goto(this.parseNumberInteger);
			}
			parseNumberIntegerExponentOrDecimal() {
				if (this.char === CHAR_PERIOD) {
					this.consume();
					return this.call(this.parseNoUnder, this.parseNumberFloat);
				} else if (this.char === CHAR_E || this.char === CHAR_e) {
					this.consume();
					return this.next(this.parseNumberExponentSign);
				} else return this.returnNow(Integer(this.state.buf));
			}
			parseNumberInteger() {
				if (isDigit(this.char)) this.consume();
				else if (this.char === CHAR_LOWBAR) return this.call(this.parseNoUnder);
				else if (this.char === CHAR_E || this.char === CHAR_e) {
					this.consume();
					return this.next(this.parseNumberExponentSign);
				} else if (this.char === CHAR_PERIOD) {
					this.consume();
					return this.call(this.parseNoUnder, this.parseNumberFloat);
				} else {
					const result = Integer(this.state.buf);
					/* istanbul ignore if */
					if (result.isNaN()) throw this.error(new TomlError("Invalid number"));
					else return this.returnNow(result);
				}
			}
			parseNoUnder() {
				if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD || this.char === CHAR_E || this.char === CHAR_e) throw this.error(new TomlError("Unexpected character, expected digit"));
				else if (this.atEndOfWord()) throw this.error(new TomlError("Incomplete number"));
				return this.returnNow();
			}
			parseNoUnderHexOctBinLiteral() {
				if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD) throw this.error(new TomlError("Unexpected character, expected digit"));
				else if (this.atEndOfWord()) throw this.error(new TomlError("Incomplete number"));
				return this.returnNow();
			}
			parseNumberFloat() {
				if (this.char === CHAR_LOWBAR) return this.call(this.parseNoUnder, this.parseNumberFloat);
				else if (isDigit(this.char)) this.consume();
				else if (this.char === CHAR_E || this.char === CHAR_e) {
					this.consume();
					return this.next(this.parseNumberExponentSign);
				} else return this.returnNow(Float(this.state.buf));
			}
			parseNumberExponentSign() {
				if (isDigit(this.char)) return this.goto(this.parseNumberExponent);
				else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
					this.consume();
					this.call(this.parseNoUnder, this.parseNumberExponent);
				} else throw this.error(new TomlError("Unexpected character, expected -, + or digit"));
			}
			parseNumberExponent() {
				if (isDigit(this.char)) this.consume();
				else if (this.char === CHAR_LOWBAR) return this.call(this.parseNoUnder);
				else return this.returnNow(Float(this.state.buf));
			}
			parseNumberOrDateTime() {
				if (this.char === CHAR_0) {
					this.consume();
					return this.next(this.parseNumberBaseOrDateTime);
				} else return this.goto(this.parseNumberOrDateTimeOnly);
			}
			parseNumberOrDateTimeOnly() {
				if (this.char === CHAR_LOWBAR) return this.call(this.parseNoUnder, this.parseNumberInteger);
				else if (isDigit(this.char)) {
					this.consume();
					if (this.state.buf.length > 4) this.next(this.parseNumberInteger);
				} else if (this.char === CHAR_E || this.char === CHAR_e) {
					this.consume();
					return this.next(this.parseNumberExponentSign);
				} else if (this.char === CHAR_PERIOD) {
					this.consume();
					return this.call(this.parseNoUnder, this.parseNumberFloat);
				} else if (this.char === CHAR_HYPHEN) return this.goto(this.parseDateTime);
				else if (this.char === CHAR_COLON) return this.goto(this.parseOnlyTimeHour);
				else return this.returnNow(Integer(this.state.buf));
			}
			parseDateTimeOnly() {
				if (this.state.buf.length < 4) if (isDigit(this.char)) return this.consume();
				else if (this.char === CHAR_COLON) return this.goto(this.parseOnlyTimeHour);
				else throw this.error(new TomlError("Expected digit while parsing year part of a date"));
				else if (this.char === CHAR_HYPHEN) return this.goto(this.parseDateTime);
				else throw this.error(new TomlError("Expected hyphen (-) while parsing year part of date"));
			}
			parseNumberBaseOrDateTime() {
				if (this.char === CHAR_b) {
					this.consume();
					return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerBin);
				} else if (this.char === CHAR_o) {
					this.consume();
					return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerOct);
				} else if (this.char === CHAR_x) {
					this.consume();
					return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerHex);
				} else if (this.char === CHAR_PERIOD) return this.goto(this.parseNumberInteger);
				else if (isDigit(this.char)) return this.goto(this.parseDateTimeOnly);
				else return this.returnNow(Integer(this.state.buf));
			}
			parseIntegerHex() {
				if (isHexit(this.char)) this.consume();
				else if (this.char === CHAR_LOWBAR) return this.call(this.parseNoUnderHexOctBinLiteral);
				else {
					const result = Integer(this.state.buf);
					/* istanbul ignore if */
					if (result.isNaN()) throw this.error(new TomlError("Invalid number"));
					else return this.returnNow(result);
				}
			}
			parseIntegerOct() {
				if (isOctit(this.char)) this.consume();
				else if (this.char === CHAR_LOWBAR) return this.call(this.parseNoUnderHexOctBinLiteral);
				else {
					const result = Integer(this.state.buf);
					/* istanbul ignore if */
					if (result.isNaN()) throw this.error(new TomlError("Invalid number"));
					else return this.returnNow(result);
				}
			}
			parseIntegerBin() {
				if (isBit(this.char)) this.consume();
				else if (this.char === CHAR_LOWBAR) return this.call(this.parseNoUnderHexOctBinLiteral);
				else {
					const result = Integer(this.state.buf);
					/* istanbul ignore if */
					if (result.isNaN()) throw this.error(new TomlError("Invalid number"));
					else return this.returnNow(result);
				}
			}
			parseDateTime() {
				if (this.state.buf.length < 4) throw this.error(new TomlError("Years less than 1000 must be zero padded to four characters"));
				this.state.result = this.state.buf;
				this.state.buf = "";
				return this.next(this.parseDateMonth);
			}
			parseDateMonth() {
				if (this.char === CHAR_HYPHEN) {
					if (this.state.buf.length < 2) throw this.error(new TomlError("Months less than 10 must be zero padded to two characters"));
					this.state.result += "-" + this.state.buf;
					this.state.buf = "";
					return this.next(this.parseDateDay);
				} else if (isDigit(this.char)) this.consume();
				else throw this.error(new TomlError("Incomplete datetime"));
			}
			parseDateDay() {
				if (this.char === CHAR_T || this.char === CHAR_SP) {
					if (this.state.buf.length < 2) throw this.error(new TomlError("Days less than 10 must be zero padded to two characters"));
					this.state.result += "-" + this.state.buf;
					this.state.buf = "";
					return this.next(this.parseStartTimeHour);
				} else if (this.atEndOfWord()) return this.returnNow(createDate(this.state.result + "-" + this.state.buf));
				else if (isDigit(this.char)) this.consume();
				else throw this.error(new TomlError("Incomplete datetime"));
			}
			parseStartTimeHour() {
				if (this.atEndOfWord()) return this.returnNow(createDate(this.state.result));
				else return this.goto(this.parseTimeHour);
			}
			parseTimeHour() {
				if (this.char === CHAR_COLON) {
					if (this.state.buf.length < 2) throw this.error(new TomlError("Hours less than 10 must be zero padded to two characters"));
					this.state.result += "T" + this.state.buf;
					this.state.buf = "";
					return this.next(this.parseTimeMin);
				} else if (isDigit(this.char)) this.consume();
				else throw this.error(new TomlError("Incomplete datetime"));
			}
			parseTimeMin() {
				if (this.state.buf.length < 2 && isDigit(this.char)) this.consume();
				else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
					this.state.result += ":" + this.state.buf;
					this.state.buf = "";
					return this.next(this.parseTimeSec);
				} else throw this.error(new TomlError("Incomplete datetime"));
			}
			parseTimeSec() {
				if (isDigit(this.char)) {
					this.consume();
					if (this.state.buf.length === 2) {
						this.state.result += ":" + this.state.buf;
						this.state.buf = "";
						return this.next(this.parseTimeZoneOrFraction);
					}
				} else throw this.error(new TomlError("Incomplete datetime"));
			}
			parseOnlyTimeHour() {
				/* istanbul ignore else */
				if (this.char === CHAR_COLON) {
					if (this.state.buf.length < 2) throw this.error(new TomlError("Hours less than 10 must be zero padded to two characters"));
					this.state.result = this.state.buf;
					this.state.buf = "";
					return this.next(this.parseOnlyTimeMin);
				} else throw this.error(new TomlError("Incomplete time"));
			}
			parseOnlyTimeMin() {
				if (this.state.buf.length < 2 && isDigit(this.char)) this.consume();
				else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
					this.state.result += ":" + this.state.buf;
					this.state.buf = "";
					return this.next(this.parseOnlyTimeSec);
				} else throw this.error(new TomlError("Incomplete time"));
			}
			parseOnlyTimeSec() {
				if (isDigit(this.char)) {
					this.consume();
					if (this.state.buf.length === 2) return this.next(this.parseOnlyTimeFractionMaybe);
				} else throw this.error(new TomlError("Incomplete time"));
			}
			parseOnlyTimeFractionMaybe() {
				this.state.result += ":" + this.state.buf;
				if (this.char === CHAR_PERIOD) {
					this.state.buf = "";
					this.next(this.parseOnlyTimeFraction);
				} else return this.return(createTime(this.state.result));
			}
			parseOnlyTimeFraction() {
				if (isDigit(this.char)) this.consume();
				else if (this.atEndOfWord()) {
					if (this.state.buf.length === 0) throw this.error(new TomlError("Expected digit in milliseconds"));
					return this.returnNow(createTime(this.state.result + "." + this.state.buf));
				} else throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
			}
			parseTimeZoneOrFraction() {
				if (this.char === CHAR_PERIOD) {
					this.consume();
					this.next(this.parseDateTimeFraction);
				} else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
					this.consume();
					this.next(this.parseTimeZoneHour);
				} else if (this.char === CHAR_Z) {
					this.consume();
					return this.return(createDateTime(this.state.result + this.state.buf));
				} else if (this.atEndOfWord()) return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf));
				else throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
			}
			parseDateTimeFraction() {
				if (isDigit(this.char)) this.consume();
				else if (this.state.buf.length === 1) throw this.error(new TomlError("Expected digit in milliseconds"));
				else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
					this.consume();
					this.next(this.parseTimeZoneHour);
				} else if (this.char === CHAR_Z) {
					this.consume();
					return this.return(createDateTime(this.state.result + this.state.buf));
				} else if (this.atEndOfWord()) return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf));
				else throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
			}
			parseTimeZoneHour() {
				if (isDigit(this.char)) {
					this.consume();
					if (/\d\d$/.test(this.state.buf)) return this.next(this.parseTimeZoneSep);
				} else throw this.error(new TomlError("Unexpected character in datetime, expected digit"));
			}
			parseTimeZoneSep() {
				if (this.char === CHAR_COLON) {
					this.consume();
					this.next(this.parseTimeZoneMin);
				} else throw this.error(new TomlError("Unexpected character in datetime, expected colon"));
			}
			parseTimeZoneMin() {
				if (isDigit(this.char)) {
					this.consume();
					if (/\d\d$/.test(this.state.buf)) return this.return(createDateTime(this.state.result + this.state.buf));
				} else throw this.error(new TomlError("Unexpected character in datetime, expected digit"));
			}
			parseBoolean() {
				/* istanbul ignore else */
				if (this.char === CHAR_t) {
					this.consume();
					return this.next(this.parseTrue_r);
				} else if (this.char === CHAR_f) {
					this.consume();
					return this.next(this.parseFalse_a);
				}
			}
			parseTrue_r() {
				if (this.char === CHAR_r) {
					this.consume();
					return this.next(this.parseTrue_u);
				} else throw this.error(new TomlError("Invalid boolean, expected true or false"));
			}
			parseTrue_u() {
				if (this.char === CHAR_u) {
					this.consume();
					return this.next(this.parseTrue_e);
				} else throw this.error(new TomlError("Invalid boolean, expected true or false"));
			}
			parseTrue_e() {
				if (this.char === CHAR_e) return this.return(true);
				else throw this.error(new TomlError("Invalid boolean, expected true or false"));
			}
			parseFalse_a() {
				if (this.char === CHAR_a) {
					this.consume();
					return this.next(this.parseFalse_l);
				} else throw this.error(new TomlError("Invalid boolean, expected true or false"));
			}
			parseFalse_l() {
				if (this.char === CHAR_l) {
					this.consume();
					return this.next(this.parseFalse_s);
				} else throw this.error(new TomlError("Invalid boolean, expected true or false"));
			}
			parseFalse_s() {
				if (this.char === CHAR_s) {
					this.consume();
					return this.next(this.parseFalse_e);
				} else throw this.error(new TomlError("Invalid boolean, expected true or false"));
			}
			parseFalse_e() {
				if (this.char === CHAR_e) return this.return(false);
				else throw this.error(new TomlError("Invalid boolean, expected true or false"));
			}
			parseInlineList() {
				if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) return null;
				else if (this.char === Parser.END) throw this.error(new TomlError("Unterminated inline array"));
				else if (this.char === CHAR_NUM) return this.call(this.parseComment);
				else if (this.char === CHAR_RSQB) return this.return(this.state.resultArr || InlineList());
				else return this.callNow(this.parseValue, this.recordInlineListValue);
			}
			recordInlineListValue(value) {
				if (this.state.resultArr) {
					const listType = this.state.resultArr[_contentType];
					const valueType = tomlType(value);
					if (listType !== valueType) throw this.error(new TomlError(`Inline lists must be a single type, not a mix of ${listType} and ${valueType}`));
				} else this.state.resultArr = InlineList(tomlType(value));
				if (isFloat(value) || isInteger(value)) this.state.resultArr.push(value.valueOf());
				else this.state.resultArr.push(value);
				return this.goto(this.parseInlineListNext);
			}
			parseInlineListNext() {
				if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) return null;
				else if (this.char === CHAR_NUM) return this.call(this.parseComment);
				else if (this.char === CHAR_COMMA) return this.next(this.parseInlineList);
				else if (this.char === CHAR_RSQB) return this.goto(this.parseInlineList);
				else throw this.error(new TomlError("Invalid character, expected whitespace, comma (,) or close bracket (])"));
			}
			parseInlineTable() {
				if (this.char === CHAR_SP || this.char === CTRL_I) return null;
				else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) throw this.error(new TomlError("Unterminated inline array"));
				else if (this.char === CHAR_RCUB) return this.return(this.state.resultTable || InlineTable());
				else {
					if (!this.state.resultTable) this.state.resultTable = InlineTable();
					return this.callNow(this.parseAssign, this.recordInlineTableValue);
				}
			}
			recordInlineTableValue(kv) {
				let target = this.state.resultTable;
				let finalKey = kv.key.pop();
				for (let kw of kv.key) {
					if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) throw this.error(new TomlError("Can't redefine existing key"));
					target = target[kw] = target[kw] || Table();
				}
				if (hasKey(target, finalKey)) throw this.error(new TomlError("Can't redefine existing key"));
				if (isInteger(kv.value) || isFloat(kv.value)) target[finalKey] = kv.value.valueOf();
				else target[finalKey] = kv.value;
				return this.goto(this.parseInlineTableNext);
			}
			parseInlineTableNext() {
				if (this.char === CHAR_SP || this.char === CTRL_I) return null;
				else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) throw this.error(new TomlError("Unterminated inline array"));
				else if (this.char === CHAR_COMMA) return this.next(this.parseInlineTable);
				else if (this.char === CHAR_RCUB) return this.goto(this.parseInlineTable);
				else throw this.error(new TomlError("Invalid character, expected whitespace, comma (,) or close bracket (])"));
			}
		}
		return TOMLParser;
	}
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/parse-pretty-error.js
var require_parse_pretty_error = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = prettyError;
	function prettyError(err, buf) {
		/* istanbul ignore if */
		if (err.pos == null || err.line == null) return err;
		let msg = err.message;
		msg += ` at row ${err.line + 1}, col ${err.col + 1}, pos ${err.pos}:\n`;
		/* istanbul ignore else */
		if (buf && buf.split) {
			const lines = buf.split(/\n/);
			const lineNumWidth = String(Math.min(lines.length, err.line + 3)).length;
			let linePadding = " ";
			while (linePadding.length < lineNumWidth) linePadding += " ";
			for (let ii = Math.max(0, err.line - 1); ii < Math.min(lines.length, err.line + 2); ++ii) {
				let lineNum = String(ii + 1);
				if (lineNum.length < lineNumWidth) lineNum = " " + lineNum;
				if (err.line === ii) {
					msg += lineNum + "> " + lines[ii] + "\n";
					msg += linePadding + "  ";
					for (let hh = 0; hh < err.col; ++hh) msg += " ";
					msg += "^\n";
				} else msg += lineNum + ": " + lines[ii] + "\n";
			}
		}
		err.message = msg + "\n";
		return err;
	}
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/parse-string.js
var require_parse_string = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = parseString;
	const TOMLParser = require_toml_parser();
	const prettyError = require_parse_pretty_error();
	function parseString(str) {
		if (global.Buffer && global.Buffer.isBuffer(str)) str = str.toString("utf8");
		const parser = new TOMLParser();
		try {
			parser.parse(str);
			return parser.finish();
		} catch (err) {
			throw prettyError(err, str);
		}
	}
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/parse-async.js
var require_parse_async = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = parseAsync;
	const TOMLParser = require_toml_parser();
	const prettyError = require_parse_pretty_error();
	function parseAsync(str, opts) {
		if (!opts) opts = {};
		const index = 0;
		const blocksize = opts.blocksize || 40960;
		const parser = new TOMLParser();
		return new Promise((resolve, reject) => {
			setImmediate(parseAsyncNext, index, blocksize, resolve, reject);
		});
		function parseAsyncNext(index, blocksize, resolve, reject) {
			if (index >= str.length) try {
				return resolve(parser.finish());
			} catch (err) {
				return reject(prettyError(err, str));
			}
			try {
				parser.parse(str.slice(index, index + blocksize));
				setImmediate(parseAsyncNext, index + blocksize, blocksize, resolve, reject);
			} catch (err) {
				reject(prettyError(err, str));
			}
		}
	}
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/parse-stream.js
var require_parse_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = parseStream;
	const stream$1 = require("stream");
	const TOMLParser = require_toml_parser();
	function parseStream(stm) {
		if (stm) return parseReadable(stm);
		else return parseTransform(stm);
	}
	function parseReadable(stm) {
		const parser = new TOMLParser();
		stm.setEncoding("utf8");
		return new Promise((resolve, reject) => {
			let readable;
			let ended = false;
			let errored = false;
			function finish() {
				ended = true;
				if (readable) return;
				try {
					resolve(parser.finish());
				} catch (err) {
					reject(err);
				}
			}
			function error(err) {
				errored = true;
				reject(err);
			}
			stm.once("end", finish);
			stm.once("error", error);
			readNext();
			function readNext() {
				readable = true;
				let data;
				while ((data = stm.read()) !== null) try {
					parser.parse(data);
				} catch (err) {
					return error(err);
				}
				readable = false;
				/* istanbul ignore if */
				if (ended) return finish();
				/* istanbul ignore if */
				if (errored) return;
				stm.once("readable", readNext);
			}
		});
	}
	function parseTransform() {
		const parser = new TOMLParser();
		return new stream$1.Transform({
			objectMode: true,
			transform(chunk, encoding, cb) {
				try {
					parser.parse(chunk.toString(encoding));
				} catch (err) {
					this.emit("error", err);
				}
				cb();
			},
			flush(cb) {
				try {
					this.push(parser.finish());
				} catch (err) {
					this.emit("error", err);
				}
				cb();
			}
		});
	}
}));
//#endregion
//#region node_modules/.pnpm/@iarna+toml@2.2.5/node_modules/@iarna/toml/parse.js
var require_parse$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_parse_string();
	module.exports.async = require_parse_async();
	module.exports.stream = require_parse_stream();
	module.exports.prettyError = require_parse_pretty_error();
}));
//#endregion
//#region node_modules/.pnpm/shell-quote@1.8.4/node_modules/shell-quote/quote.js
var require_quote = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var OPS = [
		"||",
		"&&",
		";;",
		"|&",
		"<(",
		"<<<",
		">>",
		">&",
		"<&",
		"&",
		";",
		"(",
		")",
		"|",
		"<",
		">"
	];
	var LINE_TERMINATORS = /[\n\r\u2028\u2029]/;
	var GLOB_SHELL_SPECIAL = /[\s#!"$&'():;<=>@\\^`|]/g;
	module.exports = function quote(xs) {
		return xs.map(function(s) {
			if (s === "") return "''";
			if (s && typeof s === "object") {
				if (s.op === "glob") {
					if (typeof s.pattern !== "string") throw new TypeError("glob token requires a string `pattern`");
					if (LINE_TERMINATORS.test(s.pattern)) throw new TypeError("glob `pattern` must not contain line terminators");
					return s.pattern.replace(GLOB_SHELL_SPECIAL, "\\$&");
				}
				if (typeof s.op === "string") {
					if (OPS.indexOf(s.op) < 0) throw new TypeError("invalid `op` value: " + JSON.stringify(s.op));
					return s.op.replace(/[\s\S]/g, "\\$&");
				}
				if (typeof s.comment === "string") {
					if (LINE_TERMINATORS.test(s.comment)) throw new TypeError("`comment` must not contain line terminators");
					return "#" + s.comment;
				}
				throw new TypeError("unrecognized object token shape");
			}
			if (/["\s\\]/.test(s) && !/'/.test(s)) return "'" + s.replace(/(['])/g, "\\$1") + "'";
			if (/["'\s]/.test(s)) return "\"" + s.replace(/(["\\$`!])/g, "\\$1") + "\"";
			return String(s).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, "$1\\$2");
		}).join(" ");
	};
}));
//#endregion
//#region node_modules/.pnpm/shell-quote@1.8.4/node_modules/shell-quote/parse.js
var require_parse$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var CONTROL = "(?:" + [
		"\\|\\|",
		"\\&\\&",
		";;",
		"\\|\\&",
		"\\<\\(",
		"\\<\\<\\<",
		">>",
		">\\&",
		"<\\&",
		"[&;()|<>]"
	].join("|") + ")";
	var controlRE = new RegExp("^" + CONTROL + "$");
	var META = "|&;()<> \\t";
	var SINGLE_QUOTE = "\"((\\\\\"|[^\"])*?)\"";
	var DOUBLE_QUOTE = "'((\\\\'|[^'])*?)'";
	var hash = /^#$/;
	var SQ = "'";
	var DQ = "\"";
	var DS = "$";
	var TOKEN = "";
	var mult = 4294967296;
	for (var i = 0; i < 4; i++) TOKEN += (mult * Math.random()).toString(16);
	var startsWithToken = new RegExp("^" + TOKEN);
	function matchAll(s, r) {
		var origIndex = r.lastIndex;
		var matches = [];
		var matchObj;
		while (matchObj = r.exec(s)) {
			matches.push(matchObj);
			if (r.lastIndex === matchObj.index) r.lastIndex += 1;
		}
		r.lastIndex = origIndex;
		return matches;
	}
	function getVar(env, pre, key) {
		var r = typeof env === "function" ? env(key) : env[key];
		if (typeof r === "undefined" && key != "") r = "";
		else if (typeof r === "undefined") r = "$";
		if (typeof r === "object") return pre + TOKEN + JSON.stringify(r) + TOKEN;
		return pre + r;
	}
	function parseInternal(string, env, opts) {
		if (!opts) opts = {};
		var BS = opts.escape || "\\";
		var BAREWORD = "(\\" + BS + "['\"" + META + "]|[^\\s'\"" + META + "])+";
		var matches = matchAll(string, new RegExp(["(" + CONTROL + ")", "(" + BAREWORD + "|" + SINGLE_QUOTE + "|" + DOUBLE_QUOTE + ")+"].join("|"), "g"));
		if (matches.length === 0) return [];
		if (!env) env = {};
		var commented = false;
		return matches.map(function(match) {
			var s = match[0];
			if (!s || commented) return;
			if (controlRE.test(s)) return { op: s };
			var quote = false;
			var esc = false;
			var out = "";
			var isGlob = false;
			var i;
			function parseEnvVar() {
				i += 1;
				var varend;
				var varname;
				var char = s.charAt(i);
				if (char === "{") {
					i += 1;
					if (s.charAt(i) === "}") throw new Error("Bad substitution: " + s.slice(i - 2, i + 1));
					varend = s.indexOf("}", i);
					if (varend < 0) throw new Error("Bad substitution: " + s.slice(i));
					varname = s.slice(i, varend);
					i = varend;
				} else if (/[*@#?$!_-]/.test(char)) {
					varname = char;
					i += 1;
				} else {
					var slicedFromI = s.slice(i);
					varend = slicedFromI.match(/[^\w\d_]/);
					if (!varend) {
						varname = slicedFromI;
						i = s.length;
					} else {
						varname = slicedFromI.slice(0, varend.index);
						i += varend.index - 1;
					}
				}
				return getVar(env, "", varname);
			}
			for (i = 0; i < s.length; i++) {
				var c = s.charAt(i);
				isGlob = isGlob || !quote && (c === "*" || c === "?");
				if (esc) {
					out += c;
					esc = false;
				} else if (quote) if (c === quote) quote = false;
				else if (quote == SQ) out += c;
				else if (c === BS) {
					i += 1;
					c = s.charAt(i);
					if (c === DQ || c === BS || c === DS) out += c;
					else out += BS + c;
				} else if (c === DS) out += parseEnvVar();
				else out += c;
				else if (c === DQ || c === SQ) quote = c;
				else if (controlRE.test(c)) return { op: s };
				else if (hash.test(c)) {
					commented = true;
					var commentObj = { comment: string.slice(match.index + i + 1) };
					if (out.length) return [out, commentObj];
					return [commentObj];
				} else if (c === BS) esc = true;
				else if (c === DS) out += parseEnvVar();
				else out += c;
			}
			if (isGlob) return {
				op: "glob",
				pattern: out
			};
			return out;
		}).reduce(function(prev, arg) {
			return typeof arg === "undefined" ? prev : prev.concat(arg);
		}, []);
	}
	module.exports = function parse(s, env, opts) {
		var mapped = parseInternal(s, env, opts);
		if (typeof env !== "function") return mapped;
		return mapped.reduce(function(acc, s) {
			if (typeof s === "object") return acc.concat(s);
			var xs = s.split(RegExp("(" + TOKEN + ".*?" + TOKEN + ")", "g"));
			if (xs.length === 1) return acc.concat(xs[0]);
			return acc.concat(xs.filter(Boolean).map(function(x) {
				if (startsWithToken.test(x)) return JSON.parse(x.split(TOKEN)[1]);
				return x;
			}));
		}, []);
	};
}));
//#endregion
//#region node_modules/.pnpm/shell-quote@1.8.4/node_modules/shell-quote/index.js
var require_shell_quote = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.quote = require_quote();
	exports.parse = require_parse$1();
}));
//#endregion
//#region node_modules/.pnpm/tiny-jsonc@1.0.2/node_modules/tiny-jsonc/dist/index.js
var import_parse = /* @__PURE__ */ __toESM(require_parse$2());
var import_shell_quote = require_shell_quote();
const stringOrCommentRe = /("(?:\\?[^])*?")|(\/\/.*)|(\/\*[^]*?\*\/)/g;
const stringOrTrailingCommaRe = /("(?:\\?[^])*?")|(,\s*)(?=]|})/g;
const JSONC = { parse: (text) => {
	text = String(text);
	try {
		return JSON.parse(text);
	} catch {
		return JSON.parse(text.replace(stringOrCommentRe, "$1").replace(stringOrTrailingCommaRe, "$1"));
	}
} };
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/internal/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SEMVER_SPEC_VERSION = "2.0.0";
	const MAX_LENGTH = 256;
	const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
	module.exports = {
		MAX_LENGTH,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: MAX_LENGTH - 6,
		MAX_SAFE_INTEGER,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION,
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/internal/debug.js
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/internal/re.js
var require_re = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
	const debug = require_debug();
	exports = module.exports = {};
	const re = exports.re = [];
	const safeRe = exports.safeRe = [];
	const src = exports.src = [];
	const safeSrc = exports.safeSrc = [];
	const t = exports.t = {};
	let R = 0;
	const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	const safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	const makeSafeRegex = (value) => {
		for (const [token, max] of safeRegexReplacements) value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
		return value;
	};
	const createToken = (name, value, isGlobal) => {
		const safe = makeSafeRegex(value);
		const index = R++;
		debug(name, index, value);
		t[name] = index;
		src[index] = value;
		safeSrc[index] = safe;
		re[index] = new RegExp(value, isGlobal ? "g" : void 0);
		safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
	};
	createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
	createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
	createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
	createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
	createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
	createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
	createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
	createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
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
	createToken("COERCEPLAIN", `(^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
	createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
	createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
	createToken("COERCERTL", src[t.COERCE], true);
	createToken("COERCERTLFULL", src[t.COERCEFULL], true);
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
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/internal/parse-options.js
var require_parse_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const looseOption = Object.freeze({ loose: true });
	const emptyOpts = Object.freeze({});
	const parseOptions = (options) => {
		if (!options) return emptyOpts;
		if (typeof options !== "object") return looseOption;
		return options;
	};
	module.exports = parseOptions;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/internal/identifiers.js
var require_identifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const numeric = /^[0-9]+$/;
	const compareIdentifiers = (a, b) => {
		if (typeof a === "number" && typeof b === "number") return a === b ? 0 : a < b ? -1 : 1;
		const anum = numeric.test(a);
		const bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	};
	const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
	module.exports = {
		compareIdentifiers,
		rcompareIdentifiers
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/classes/semver.js
var require_semver$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const debug = require_debug();
	const { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
	const { safeRe: re, t } = require_re();
	const parseOptions = require_parse_options();
	const { compareIdentifiers } = require_identifiers();
	const isPrereleaseIdentifier = (prerelease, identifier) => {
		const identifiers = identifier.split(".");
		if (identifiers.length > prerelease.length) return false;
		for (let i = 0; i < identifiers.length; i++) if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) return false;
		return true;
	};
	module.exports = class SemVer {
		constructor(version, options) {
			options = parseOptions(options);
			if (version instanceof SemVer) if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
			else version = version.version;
			else if (typeof version !== "string") throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
			if (version.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
			debug("SemVer", version, options);
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
			if (!m) throw new TypeError(`Invalid Version: ${version}`);
			this.raw = version;
			this.major = +m[1];
			this.minor = +m[2];
			this.patch = +m[3];
			if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
			if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
			if (!m[4]) this.prerelease = [];
			else this.prerelease = m[4].split(".").map((id) => {
				if (/^[0-9]+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
				}
				return id;
			});
			this.build = m[5] ? m[5].split(".") : [];
			this.format();
		}
		format() {
			this.version = `${this.major}.${this.minor}.${this.patch}`;
			if (this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
			return this.version;
		}
		toString() {
			return this.version;
		}
		compare(other) {
			debug("SemVer.compare", this.version, this.options, other);
			if (!(other instanceof SemVer)) {
				if (typeof other === "string" && other === this.version) return 0;
				other = new SemVer(other, this.options);
			}
			if (other.version === this.version) return 0;
			return this.compareMain(other) || this.comparePre(other);
		}
		compareMain(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.major < other.major) return -1;
			if (this.major > other.major) return 1;
			if (this.minor < other.minor) return -1;
			if (this.minor > other.minor) return 1;
			if (this.patch < other.patch) return -1;
			if (this.patch > other.patch) return 1;
			return 0;
		}
		comparePre(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.prerelease.length && !other.prerelease.length) return -1;
			else if (!this.prerelease.length && other.prerelease.length) return 1;
			else if (!this.prerelease.length && !other.prerelease.length) return 0;
			let i = 0;
			do {
				const a = this.prerelease[i];
				const b = other.prerelease[i];
				debug("prerelease compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		compareBuild(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			let i = 0;
			do {
				const a = this.build[i];
				const b = other.build[i];
				debug("build compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		inc(release, identifier, identifierBase) {
			if (release.startsWith("pre")) {
				if (!identifier && identifierBase === false) throw new Error("invalid increment argument: identifier is empty");
				if (identifier) {
					const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
					if (!match || match[1] !== identifier) throw new Error(`invalid identifier: ${identifier}`);
				}
			}
			switch (release) {
				case "premajor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor = 0;
					this.major++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "preminor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "prepatch":
					this.prerelease.length = 0;
					this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "prerelease":
					if (this.prerelease.length === 0) this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "release":
					if (this.prerelease.length === 0) throw new Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
					this.minor = 0;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "minor":
					if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "patch":
					if (this.prerelease.length === 0) this.patch++;
					this.prerelease = [];
					break;
				case "pre": {
					const base = Number(identifierBase) ? 1 : 0;
					if (this.prerelease.length === 0) this.prerelease = [base];
					else {
						let i = this.prerelease.length;
						while (--i >= 0) if (typeof this.prerelease[i] === "number") {
							this.prerelease[i]++;
							i = -2;
						}
						if (i === -1) {
							if (identifier === this.prerelease.join(".") && identifierBase === false) throw new Error("invalid increment argument: identifier already exists");
							this.prerelease.push(base);
						}
					}
					if (identifier) {
						let prerelease = [identifier, base];
						if (identifierBase === false) prerelease = [identifier];
						if (isPrereleaseIdentifier(this.prerelease, identifier)) {
							const prereleaseBase = this.prerelease[identifier.split(".").length];
							if (isNaN(prereleaseBase)) this.prerelease = prerelease;
						} else this.prerelease = prerelease;
					}
					break;
				}
				default: throw new Error(`invalid increment argument: ${release}`);
			}
			this.raw = this.format();
			if (this.build.length) this.raw += `+${this.build.join(".")}`;
			return this;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = (version, options, throwErrors = false) => {
		if (version instanceof SemVer) return version;
		try {
			return new SemVer(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/valid.js
var require_valid$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const valid = (version, options) => {
		const v = parse(version, options);
		return v ? v.version : null;
	};
	module.exports = valid;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/clean.js
var require_clean = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const clean = (version, options) => {
		const s = parse(version.trim().replace(/^[=v]+/, ""), options);
		return s ? s.version : null;
	};
	module.exports = clean;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/inc.js
var require_inc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const inc = (version, release, options, identifier, identifierBase) => {
		if (typeof options === "string") {
			identifierBase = identifier;
			identifier = options;
			options = void 0;
		}
		try {
			return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
		} catch (er) {
			return null;
		}
	};
	module.exports = inc;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/diff.js
var require_diff = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const diff = (version1, version2) => {
		const v1 = parse(version1, null, true);
		const v2 = parse(version2, null, true);
		const comparison = v1.compare(v2);
		if (comparison === 0) return null;
		const v1Higher = comparison > 0;
		const highVersion = v1Higher ? v1 : v2;
		const lowVersion = v1Higher ? v2 : v1;
		const highHasPre = !!highVersion.prerelease.length;
		if (!!lowVersion.prerelease.length && !highHasPre) {
			if (!lowVersion.patch && !lowVersion.minor) return "major";
			if (lowVersion.compareMain(highVersion) === 0) {
				if (lowVersion.minor && !lowVersion.patch) return "minor";
				return "patch";
			}
		}
		const prefix = highHasPre ? "pre" : "";
		if (v1.major !== v2.major) return prefix + "major";
		if (v1.minor !== v2.minor) return prefix + "minor";
		if (v1.patch !== v2.patch) return prefix + "patch";
		return "prerelease";
	};
	module.exports = diff;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/major.js
var require_major = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const major = (a, loose) => new SemVer(a, loose).major;
	module.exports = major;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/minor.js
var require_minor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const minor = (a, loose) => new SemVer(a, loose).minor;
	module.exports = minor;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/patch.js
var require_patch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const patch = (a, loose) => new SemVer(a, loose).patch;
	module.exports = patch;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/prerelease.js
var require_prerelease = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const prerelease = (version, options) => {
		const parsed = parse(version, options);
		return parsed && parsed.prerelease.length ? parsed.prerelease : null;
	};
	module.exports = prerelease;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/compare.js
var require_compare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
	module.exports = compare;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/rcompare.js
var require_rcompare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const rcompare = (a, b, loose) => compare(b, a, loose);
	module.exports = rcompare;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/compare-loose.js
var require_compare_loose = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const compareLoose = (a, b) => compare(a, b, true);
	module.exports = compareLoose;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/compare-build.js
var require_compare_build = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compareBuild = (a, b, loose) => {
		const versionA = new SemVer(a, loose);
		const versionB = new SemVer(b, loose);
		return versionA.compare(versionB) || versionA.compareBuild(versionB);
	};
	module.exports = compareBuild;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/sort.js
var require_sort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
	module.exports = sort;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/rsort.js
var require_rsort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
	module.exports = rsort;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/gt.js
var require_gt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gt = (a, b, loose) => compare(a, b, loose) > 0;
	module.exports = gt;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/lt.js
var require_lt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lt = (a, b, loose) => compare(a, b, loose) < 0;
	module.exports = lt;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/eq.js
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const eq = (a, b, loose) => compare(a, b, loose) === 0;
	module.exports = eq;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/neq.js
var require_neq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const neq = (a, b, loose) => compare(a, b, loose) !== 0;
	module.exports = neq;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/gte.js
var require_gte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gte = (a, b, loose) => compare(a, b, loose) >= 0;
	module.exports = gte;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/lte.js
var require_lte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lte = (a, b, loose) => compare(a, b, loose) <= 0;
	module.exports = lte;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/cmp.js
var require_cmp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const eq = require_eq();
	const neq = require_neq();
	const gt = require_gt();
	const gte = require_gte();
	const lt = require_lt();
	const lte = require_lte();
	const cmp = (a, op, b, loose) => {
		switch (op) {
			case "===":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a === b;
			case "!==":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a !== b;
			case "":
			case "=":
			case "==": return eq(a, b, loose);
			case "!=": return neq(a, b, loose);
			case ">": return gt(a, b, loose);
			case ">=": return gte(a, b, loose);
			case "<": return lt(a, b, loose);
			case "<=": return lte(a, b, loose);
			default: throw new TypeError(`Invalid operator: ${op}`);
		}
	};
	module.exports = cmp;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/coerce.js
var require_coerce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = require_parse();
	const { safeRe: re, t } = require_re();
	const coerce = (version, options) => {
		if (version instanceof SemVer) return version;
		if (typeof version === "number") version = String(version);
		if (typeof version !== "string") return null;
		options = options || {};
		let match = null;
		if (!options.rtl) match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
		else {
			const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
			let next;
			while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
				if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
				coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
			}
			coerceRtlRegex.lastIndex = -1;
		}
		if (match === null) return null;
		const major = match[2];
		return parse(`${major}.${match[3] || "0"}.${match[4] || "0"}${options.includePrerelease && match[5] ? `-${match[5]}` : ""}${options.includePrerelease && match[6] ? `+${match[6]}` : ""}`, options);
	};
	module.exports = coerce;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/truncate.js
var require_truncate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const constants = require_constants();
	const SemVer = require_semver$1();
	const truncate = (version, truncation, options) => {
		if (!constants.RELEASE_TYPES.includes(truncation)) return null;
		const clonedVersion = cloneInputVersion(version, options);
		return clonedVersion && doTruncation(clonedVersion, truncation);
	};
	const cloneInputVersion = (version, options) => {
		return parse(version instanceof SemVer ? version.version : version, options);
	};
	const doTruncation = (version, truncation) => {
		if (isPrerelease(truncation)) return version.version;
		version.prerelease = [];
		switch (truncation) {
			case "major":
				version.minor = 0;
				version.patch = 0;
				break;
			case "minor":
				version.patch = 0;
				break;
		}
		return version.format();
	};
	const isPrerelease = (type) => {
		return type.startsWith("pre");
	};
	module.exports = truncate;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/internal/lrucache.js
var require_lrucache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LRUCache = class {
		constructor() {
			this.max = 1e3;
			this.map = /* @__PURE__ */ new Map();
		}
		get(key) {
			const value = this.map.get(key);
			if (value === void 0) return;
			else {
				this.map.delete(key);
				this.map.set(key, value);
				return value;
			}
		}
		delete(key) {
			return this.map.delete(key);
		}
		set(key, value) {
			if (!this.delete(key) && value !== void 0) {
				if (this.map.size >= this.max) {
					const firstKey = this.map.keys().next().value;
					this.delete(firstKey);
				}
				this.map.set(key, value);
			}
			return this;
		}
	};
	module.exports = LRUCache;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/classes/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SPACE_CHARACTERS = /\s+/g;
	module.exports = class Range {
		constructor(range, options) {
			options = parseOptions(options);
			if (range instanceof Range) if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
			else return new Range(range.raw, options);
			if (range instanceof Comparator) {
				this.raw = range.value;
				this.set = [[range]];
				this.formatted = void 0;
				return this;
			}
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
			this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
			if (!this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				const first = this.set[0];
				this.set = this.set.filter((c) => !isNullSet(c[0]));
				if (this.set.length === 0) this.set = [first];
				else if (this.set.length > 1) {
					for (const c of this.set) if (c.length === 1 && isAny(c[0])) {
						this.set = [c];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let i = 0; i < this.set.length; i++) {
					if (i > 0) this.formatted += "||";
					const comps = this.set[i];
					for (let k = 0; k < comps.length; k++) {
						if (k > 0) this.formatted += " ";
						this.formatted += comps[k].toString().trim();
					}
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(range) {
			range = range.replace(BUILDSTRIPRE, "");
			const memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range;
			const cached = cache.get(memoKey);
			if (cached) return cached;
			const loose = this.options.loose;
			const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
			range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
			debug("hyphen replace", range);
			range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
			debug("comparator trim", range);
			range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
			debug("tilde trim", range);
			range = range.replace(re[t.CARETTRIM], caretTrimReplace);
			debug("caret trim", range);
			let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
			if (loose) rangeList = rangeList.filter((comp) => {
				debug("loose invalid filter", comp, this.options);
				return !!comp.match(re[t.COMPARATORLOOSE]);
			});
			debug("range list", rangeList);
			const rangeMap = /* @__PURE__ */ new Map();
			const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
			for (const comp of comparators) {
				if (isNullSet(comp)) return [comp];
				rangeMap.set(comp.value, comp);
			}
			if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("");
			const result = [...rangeMap.values()];
			cache.set(memoKey, result);
			return result;
		}
		intersects(range, options) {
			if (!(range instanceof Range)) throw new TypeError("a Range is required");
			return this.set.some((thisComparators) => {
				return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
					return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
						return rangeComparators.every((rangeComparator) => {
							return thisComparator.intersects(rangeComparator, options);
						});
					});
				});
			});
		}
		test(version) {
			if (!version) return false;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			for (let i = 0; i < this.set.length; i++) if (testSet(this.set[i], version, this.options)) return true;
			return false;
		}
	};
	const cache = new (require_lrucache())();
	const parseOptions = require_parse_options();
	const Comparator = require_comparator();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const { safeRe: re, src, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
	const BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
	const isNullSet = (c) => c.value === "<0.0.0-0";
	const isAny = (c) => c.value === "";
	const isSatisfiable = (comparators, options) => {
		let result = true;
		const remainingComparators = comparators.slice();
		let testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every((otherComparator) => {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	};
	const parseComparator = (comp, options) => {
		comp = comp.replace(re[t.BUILD], "");
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
	};
	const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
	const invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
	const replaceTildes = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
	};
	const replaceTilde = (comp, options) => {
		const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("tilde", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
			else if (isX(p)) ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
			else if (pr) {
				debug("replaceTilde pr", pr);
				ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
			} else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
			debug("tilde return", ret);
			return ret;
		});
	};
	const replaceCarets = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
	};
	const replaceCaret = (comp, options) => {
		debug("caret", comp, options);
		const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("caret", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) if (M === "0") ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
			else if (pr) {
				debug("replaceCaret pr", pr);
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
			} else {
				debug("no pr");
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
			}
			debug("caret return", ret);
			return ret;
		});
	};
	const replaceXRanges = (comp, options) => {
		debug("replaceXRanges", comp, options);
		return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
	};
	const replaceXRange = (comp, options) => {
		comp = comp.trim();
		const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
		return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
			debug("xRange", comp, ret, gtlt, M, m, p, pr);
			if (invalidXRangeOrder(M, m, p)) return comp;
			const xM = isX(M);
			const xm = xM || isX(m);
			const xp = xm || isX(p);
			const anyX = xp;
			if (gtlt === "=" && anyX) gtlt = "";
			pr = options.includePrerelease ? "-0" : "";
			if (xM) if (gtlt === ">" || gtlt === "<") ret = "<0.0.0-0";
			else ret = "*";
			else if (gtlt && anyX) {
				if (xm) m = 0;
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
					if (xm) M = +M + 1;
					else m = +m + 1;
				}
				if (gtlt === "<") pr = "-0";
				ret = `${gtlt + M}.${m}.${p}${pr}`;
			} else if (xm) ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
			else if (xp) ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
			debug("xRange return", ret);
			return ret;
		});
	};
	const replaceStars = (comp, options) => {
		debug("replaceStars", comp, options);
		return comp.trim().replace(re[t.STAR], "");
	};
	const replaceGTE0 = (comp, options) => {
		debug("replaceGTE0", comp, options);
		return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
	};
	const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
		else if (isX(fp)) from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
		else if (fpr) from = `>=${from}`;
		else from = `>=${from}${incPr ? "-0" : ""}`;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = `<${+tM + 1}.0.0-0`;
		else if (isX(tp)) to = `<${tM}.${+tm + 1}.0-0`;
		else if (tpr) to = `<=${tM}.${tm}.${tp}-${tpr}`;
		else if (incPr) to = `<${tM}.${tm}.${+tp + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	};
	const testSet = (set, version, options) => {
		for (let i = 0; i < set.length; i++) if (!set[i].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (let i = 0; i < set.length; i++) {
				debug(set[i].semver);
				if (set[i].semver === Comparator.ANY) continue;
				if (set[i].semver.prerelease.length > 0) {
					const allowed = set[i].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/classes/comparator.js
var require_comparator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ANY = Symbol("SemVer ANY");
	module.exports = class Comparator {
		static get ANY() {
			return ANY;
		}
		constructor(comp, options) {
			options = parseOptions(options);
			if (comp instanceof Comparator) if (comp.loose === !!options.loose) return comp;
			else comp = comp.value;
			comp = comp.trim().split(/\s+/).join(" ");
			debug("comparator", comp, options);
			this.options = options;
			this.loose = !!options.loose;
			this.parse(comp);
			if (this.semver === ANY) this.value = "";
			else this.value = this.operator + this.semver.version;
			debug("comp", this);
		}
		parse(comp) {
			const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
			const m = comp.match(r);
			if (!m) throw new TypeError(`Invalid comparator: ${comp}`);
			this.operator = m[1] !== void 0 ? m[1] : "";
			if (this.operator === "=") this.operator = "";
			if (!m[2]) this.semver = ANY;
			else this.semver = new SemVer(m[2], this.options.loose);
		}
		toString() {
			return this.value;
		}
		test(version) {
			debug("Comparator.test", version, this.options.loose);
			if (this.semver === ANY || version === ANY) return true;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			return cmp(version, this.operator, this.semver, this.options);
		}
		intersects(comp, options) {
			if (!(comp instanceof Comparator)) throw new TypeError("a Comparator is required");
			if (this.operator === "") {
				if (this.value === "") return true;
				return new Range(comp.value, options).test(this.value);
			} else if (comp.operator === "") {
				if (comp.value === "") return true;
				return new Range(this.value, options).test(comp.semver);
			}
			options = parseOptions(options);
			if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) return false;
			if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) return false;
			if (this.operator.startsWith(">") && comp.operator.startsWith(">")) return true;
			if (this.operator.startsWith("<") && comp.operator.startsWith("<")) return true;
			if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) return true;
			if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) return true;
			if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) return true;
			return false;
		}
	};
	const parseOptions = require_parse_options();
	const { safeRe: re, t } = require_re();
	const cmp = require_cmp();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const Range = require_range();
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/functions/satisfies.js
var require_satisfies = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const satisfies = (version, range, options) => {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
	module.exports = toComparators;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const maxSatisfying = (versions, range, options) => {
		let max = null;
		let maxSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!max || maxSV.compare(v) === -1) {
					max = v;
					maxSV = new SemVer(max, options);
				}
			}
		});
		return max;
	};
	module.exports = maxSatisfying;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const minSatisfying = (versions, range, options) => {
		let min = null;
		let minSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!min || minSV.compare(v) === 1) {
					min = v;
					minSV = new SemVer(min, options);
				}
			}
		});
		return min;
	};
	module.exports = minSatisfying;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/min-version.js
var require_min_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const gt = require_gt();
	const minVersion = (range, loose) => {
		range = new Range(range, loose);
		let minver = new SemVer("0.0.0");
		if (range.test(minver)) return minver;
		minver = new SemVer("0.0.0-0");
		if (range.test(minver)) return minver;
		minver = null;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let setMin = null;
			comparators.forEach((comparator) => {
				const compver = new SemVer(comparator.semver.version);
				switch (comparator.operator) {
					case ">":
						if (compver.prerelease.length === 0) compver.patch++;
						else compver.prerelease.push(0);
						compver.raw = compver.format();
					case "":
					case ">=":
						if (!setMin || gt(compver, setMin)) setMin = compver;
						break;
					case "<":
					case "<=": break;
					/* istanbul ignore next */
					default: throw new Error(`Unexpected operation: ${comparator.operator}`);
				}
			});
			if (setMin && (!minver || gt(minver, setMin))) minver = setMin;
		}
		if (minver && range.test(minver)) return minver;
		return null;
	};
	module.exports = minVersion;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/valid.js
var require_valid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const validRange = (range, options) => {
		try {
			return new Range(range, options).range || "*";
		} catch (er) {
			return null;
		}
	};
	module.exports = validRange;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/outside.js
var require_outside = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const Range = require_range();
	const satisfies = require_satisfies();
	const gt = require_gt();
	const lt = require_lt();
	const lte = require_lte();
	const gte = require_gte();
	const outside = (version, range, hilo, options) => {
		version = new SemVer(version, options);
		range = new Range(range, options);
		let gtfn, ltefn, ltfn, comp, ecomp;
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
			default: throw new TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (satisfies(version, range, options)) return false;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let high = null;
			let low = null;
			comparators.forEach((comparator) => {
				if (comparator.semver === ANY) comparator = new Comparator(">=0.0.0");
				high = high || comparator;
				low = low || comparator;
				if (gtfn(comparator.semver, high.semver, options)) high = comparator;
				else if (ltfn(comparator.semver, low.semver, options)) low = comparator;
			});
			if (high.operator === comp || high.operator === ecomp) return false;
			if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) return false;
			else if (low.operator === ecomp && ltfn(version, low.semver)) return false;
		}
		return true;
	};
	module.exports = outside;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/gtr.js
var require_gtr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const gtr = (version, range, options) => outside(version, range, ">", options);
	module.exports = gtr;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/ltr.js
var require_ltr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const ltr = (version, range, options) => outside(version, range, "<", options);
	module.exports = ltr;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/intersects.js
var require_intersects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const intersects = (r1, r2, options) => {
		r1 = new Range(r1, options);
		r2 = new Range(r2, options);
		return r1.intersects(r2, options);
	};
	module.exports = intersects;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/simplify.js
var require_simplify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const satisfies = require_satisfies();
	const compare = require_compare();
	module.exports = (versions, range, options) => {
		const set = [];
		let first = null;
		let prev = null;
		const v = versions.sort((a, b) => compare(a, b, options));
		for (const version of v) if (satisfies(version, range, options)) {
			prev = version;
			if (!first) first = version;
		} else {
			if (prev) set.push([first, prev]);
			prev = null;
			first = null;
		}
		if (first) set.push([first, null]);
		const ranges = [];
		for (const [min, max] of set) if (min === max) ranges.push(min);
		else if (!max && min === v[0]) ranges.push("*");
		else if (!max) ranges.push(`>=${min}`);
		else if (min === v[0]) ranges.push(`<=${max}`);
		else ranges.push(`${min} - ${max}`);
		const simplified = ranges.join(" || ");
		const original = typeof range.raw === "string" ? range.raw : String(range);
		return simplified.length < original.length ? simplified : range;
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/ranges/subset.js
var require_subset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const satisfies = require_satisfies();
	const compare = require_compare();
	const subset = (sub, dom, options = {}) => {
		if (sub === dom) return true;
		sub = new Range(sub, options);
		dom = new Range(dom, options);
		let sawNonNull = false;
		OUTER: for (const simpleSub of sub.set) {
			for (const simpleDom of dom.set) {
				const isSub = simpleSubset(simpleSub, simpleDom, options);
				sawNonNull = sawNonNull || isSub !== null;
				if (isSub) continue OUTER;
			}
			if (sawNonNull) return false;
		}
		return true;
	};
	const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
	const minimumVersion = [new Comparator(">=0.0.0")];
	const simpleSubset = (sub, dom, options) => {
		if (sub === dom) return true;
		if (sub.length === 1 && sub[0].semver === ANY) if (dom.length === 1 && dom[0].semver === ANY) return true;
		else if (options.includePrerelease) sub = minimumVersionWithPreRelease;
		else sub = minimumVersion;
		if (dom.length === 1 && dom[0].semver === ANY) if (options.includePrerelease) return true;
		else dom = minimumVersion;
		const eqSet = /* @__PURE__ */ new Set();
		let gt, lt;
		for (const c of sub) if (c.operator === ">" || c.operator === ">=") gt = higherGT(gt, c, options);
		else if (c.operator === "<" || c.operator === "<=") lt = lowerLT(lt, c, options);
		else eqSet.add(c.semver);
		if (eqSet.size > 1) return null;
		let gtltComp;
		if (gt && lt) {
			gtltComp = compare(gt.semver, lt.semver, options);
			if (gtltComp > 0) return null;
			else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) return null;
		}
		for (const eq of eqSet) {
			if (gt && !satisfies(eq, String(gt), options)) return null;
			if (lt && !satisfies(eq, String(lt), options)) return null;
			for (const c of dom) if (!satisfies(eq, String(c), options)) return false;
			return true;
		}
		let higher, lower;
		let hasDomLT, hasDomGT;
		let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
		let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
		if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) needDomLTPre = false;
		for (const c of dom) {
			hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
			hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
			if (gt) {
				if (needDomGTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) needDomGTPre = false;
				}
				if (c.operator === ">" || c.operator === ">=") {
					higher = higherGT(gt, c, options);
					if (higher === c && higher !== gt) return false;
				} else if (gt.operator === ">=" && !c.test(gt.semver)) return false;
			}
			if (lt) {
				if (needDomLTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) needDomLTPre = false;
				}
				if (c.operator === "<" || c.operator === "<=") {
					lower = lowerLT(lt, c, options);
					if (lower === c && lower !== lt) return false;
				} else if (lt.operator === "<=" && !c.test(lt.semver)) return false;
			}
			if (!c.operator && (lt || gt) && gtltComp !== 0) return false;
		}
		if (gt && hasDomLT && !lt && gtltComp !== 0) return false;
		if (lt && hasDomGT && !gt && gtltComp !== 0) return false;
		if (needDomGTPre || needDomLTPre) return false;
		return true;
	};
	const higherGT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
	};
	const lowerLT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
	};
	module.exports = subset;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.4/node_modules/semver/index.js
var require_semver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const internalRe = require_re();
	const constants = require_constants();
	const SemVer = require_semver$1();
	const identifiers = require_identifiers();
	module.exports = {
		parse: require_parse(),
		valid: require_valid$1(),
		clean: require_clean(),
		inc: require_inc(),
		diff: require_diff(),
		major: require_major(),
		minor: require_minor(),
		patch: require_patch(),
		prerelease: require_prerelease(),
		compare: require_compare(),
		rcompare: require_rcompare(),
		compareLoose: require_compare_loose(),
		compareBuild: require_compare_build(),
		sort: require_sort(),
		rsort: require_rsort(),
		gt: require_gt(),
		lt: require_lt(),
		eq: require_eq(),
		neq: require_neq(),
		gte: require_gte(),
		lte: require_lte(),
		cmp: require_cmp(),
		coerce: require_coerce(),
		truncate: require_truncate(),
		Comparator: require_comparator(),
		Range: require_range(),
		satisfies: require_satisfies(),
		toComparators: require_to_comparators(),
		maxSatisfying: require_max_satisfying(),
		minSatisfying: require_min_satisfying(),
		minVersion: require_min_version(),
		validRange: require_valid(),
		outside: require_outside(),
		gtr: require_gtr(),
		ltr: require_ltr(),
		intersects: require_intersects(),
		simplifyRange: require_simplify(),
		subset: require_subset(),
		SemVer,
		re: internalRe.re,
		src: internalRe.src,
		tokens: internalRe.t,
		SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: constants.RELEASE_TYPES,
		compareIdentifiers: identifiers.compareIdentifiers,
		rcompareIdentifiers: identifiers.rcompareIdentifiers
	};
}));
//#endregion
//#region node_modules/.pnpm/@actions+tool-cache@4.0.0/node_modules/@actions/tool-cache/lib/manifest.js
var import_semver = /* @__PURE__ */ __toESM(require_semver(), 1);
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
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
//#endregion
//#region node_modules/.pnpm/@actions+tool-cache@4.0.0/node_modules/@actions/tool-cache/lib/retry-helper.js
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
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
/**
* Internal class for retries
*/
var RetryHelper = class {
	constructor(maxAttempts, minSeconds, maxSeconds) {
		if (maxAttempts < 1) throw new Error("max attempts should be greater than or equal to 1");
		this.maxAttempts = maxAttempts;
		this.minSeconds = Math.floor(minSeconds);
		this.maxSeconds = Math.floor(maxSeconds);
		if (this.minSeconds > this.maxSeconds) throw new Error("min seconds should be less than or equal to max seconds");
	}
	execute(action, isRetryable) {
		return __awaiter$1(this, void 0, void 0, function* () {
			let attempt = 1;
			while (attempt < this.maxAttempts) {
				try {
					return yield action();
				} catch (err) {
					if (isRetryable && !isRetryable(err)) throw err;
					info(err.message);
				}
				const seconds = this.getSleepAmount();
				info(`Waiting ${seconds} seconds before trying again`);
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
		return __awaiter$1(this, void 0, void 0, function* () {
			return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
		});
	}
};
//#endregion
//#region node_modules/.pnpm/@actions+tool-cache@4.0.0/node_modules/@actions/tool-cache/lib/tool-cache.js
var __awaiter = function(thisArg, _arguments, P, generator) {
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
var HTTPError = class extends Error {
	constructor(httpStatusCode) {
		super(`Unexpected HTTP response: ${httpStatusCode}`);
		this.httpStatusCode = httpStatusCode;
		Object.setPrototypeOf(this, new.target.prototype);
	}
};
const IS_WINDOWS = process.platform === "win32";
const IS_MAC = process.platform === "darwin";
const userAgent = "actions/tool-cache";
/**
* Download a tool from an url and stream it into a file
*
* @param url       url of tool to download
* @param dest      path to download tool
* @param auth      authorization header
* @param headers   other headers
* @returns         path to downloaded tool
*/
function downloadTool(url, dest, auth, headers) {
	return __awaiter(this, void 0, void 0, function* () {
		dest = dest || path.join(_getTempDirectory(), crypto.randomUUID());
		yield mkdirP(path.dirname(dest));
		debug(`Downloading ${url}`);
		debug(`Destination ${dest}`);
		return yield new RetryHelper(3, _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS", 10), _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS", 20)).execute(() => __awaiter(this, void 0, void 0, function* () {
			return yield downloadToolAttempt(url, dest || "", auth, headers);
		}), (err) => {
			if (err instanceof HTTPError && err.httpStatusCode) {
				if (err.httpStatusCode < 500 && err.httpStatusCode !== 408 && err.httpStatusCode !== 429) return false;
			}
			return true;
		});
	});
}
function downloadToolAttempt(url, dest, auth, headers) {
	return __awaiter(this, void 0, void 0, function* () {
		if (fs.existsSync(dest)) throw new Error(`Destination file path ${dest} already exists`);
		const http = new HttpClient(userAgent, [], { allowRetries: false });
		if (auth) {
			debug("set auth");
			if (headers === void 0) headers = {};
			headers.authorization = auth;
		}
		const response = yield http.get(url, headers);
		if (response.message.statusCode !== 200) {
			const err = new HTTPError(response.message.statusCode);
			debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
			throw err;
		}
		const pipeline = util.promisify(stream.pipeline);
		const readStream = _getGlobal("TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY", () => response.message)();
		let succeeded = false;
		try {
			yield pipeline(readStream, fs.createWriteStream(dest));
			debug("download complete");
			succeeded = true;
			return dest;
		} finally {
			if (!succeeded) {
				debug("download failed");
				try {
					yield rmRF(dest);
				} catch (err) {
					debug(`Failed to delete '${dest}'. ${err.message}`);
				}
			}
		}
	});
}
/**
* Extract a compressed tar archive
*
* @param file     path to the tar
* @param dest     destination directory. Optional.
* @param flags    flags for the tar command to use for extraction. Defaults to 'xz' (extracting gzipped tars). Optional.
* @returns        path to the destination directory
*/
function extractTar(file_1, dest_1) {
	return __awaiter(this, arguments, void 0, function* (file, dest, flags = "xz") {
		if (!file) throw new Error("parameter 'file' is required");
		dest = yield _createExtractFolder(dest);
		debug("Checking tar --version");
		let versionOutput = "";
		yield exec("tar --version", [], {
			ignoreReturnCode: true,
			silent: true,
			listeners: {
				stdout: (data) => versionOutput += data.toString(),
				stderr: (data) => versionOutput += data.toString()
			}
		});
		debug(versionOutput.trim());
		const isGnuTar = versionOutput.toUpperCase().includes("GNU TAR");
		let args;
		if (flags instanceof Array) args = flags;
		else args = [flags];
		if (isDebug() && !flags.includes("v")) args.push("-v");
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
		yield exec(`tar`, args);
		return dest;
	});
}
/**
* Caches a directory and installs it into the tool cacheDir
*
* @param sourceDir    the directory to cache into tools
* @param tool          tool name
* @param version       version of the tool.  semver format
* @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
*/
function cacheDir(sourceDir, tool, version, arch) {
	return __awaiter(this, void 0, void 0, function* () {
		version = import_semver.clean(version) || version;
		arch = arch || os.arch();
		debug(`Caching tool ${tool} ${version} ${arch}`);
		debug(`source dir: ${sourceDir}`);
		if (!fs.statSync(sourceDir).isDirectory()) throw new Error("sourceDir is not a directory");
		const destPath = yield _createToolPath(tool, version, arch);
		for (const itemName of fs.readdirSync(sourceDir)) yield cp(path.join(sourceDir, itemName), destPath, { recursive: true });
		_completeToolPath(tool, version, arch);
		return destPath;
	});
}
/**
* Finds the path to a tool version in the local installed tool cache
*
* @param toolName      name of the tool
* @param versionSpec   version of the tool
* @param arch          optional arch.  defaults to arch of computer
*/
function find(toolName, versionSpec, arch) {
	if (!toolName) throw new Error("toolName parameter is required");
	if (!versionSpec) throw new Error("versionSpec parameter is required");
	arch = arch || os.arch();
	if (!isExplicitVersion(versionSpec)) versionSpec = evaluateVersions(findAllVersions(toolName, arch), versionSpec);
	let toolPath = "";
	if (versionSpec) {
		versionSpec = import_semver.clean(versionSpec) || "";
		const cachePath = path.join(_getCacheDirectory(), toolName, versionSpec, arch);
		debug(`checking cache: ${cachePath}`);
		if (fs.existsSync(cachePath) && fs.existsSync(`${cachePath}.complete`)) {
			debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
			toolPath = cachePath;
		} else debug("not found");
	}
	return toolPath;
}
/**
* Finds the paths to all versions of a tool that are installed in the local tool cache
*
* @param toolName  name of the tool
* @param arch      optional arch.  defaults to arch of computer
*/
function findAllVersions(toolName, arch) {
	const versions = [];
	arch = arch || os.arch();
	const toolPath = path.join(_getCacheDirectory(), toolName);
	if (fs.existsSync(toolPath)) {
		const children = fs.readdirSync(toolPath);
		for (const child of children) if (isExplicitVersion(child)) {
			const fullPath = path.join(toolPath, child, arch || "");
			if (fs.existsSync(fullPath) && fs.existsSync(`${fullPath}.complete`)) versions.push(child);
		}
	}
	return versions;
}
function _createExtractFolder(dest) {
	return __awaiter(this, void 0, void 0, function* () {
		if (!dest) dest = path.join(_getTempDirectory(), crypto.randomUUID());
		yield mkdirP(dest);
		return dest;
	});
}
function _createToolPath(tool, version, arch) {
	return __awaiter(this, void 0, void 0, function* () {
		const folderPath = path.join(_getCacheDirectory(), tool, import_semver.clean(version) || version, arch || "");
		debug(`destination ${folderPath}`);
		const markerPath = `${folderPath}.complete`;
		yield rmRF(folderPath);
		yield rmRF(markerPath);
		yield mkdirP(folderPath);
		return folderPath;
	});
}
function _completeToolPath(tool, version, arch) {
	const markerPath = `${path.join(_getCacheDirectory(), tool, import_semver.clean(version) || version, arch || "")}.complete`;
	fs.writeFileSync(markerPath, "");
	debug("finished caching tool");
}
/**
* Check if version string is explicit
*
* @param versionSpec      version string to check
*/
function isExplicitVersion(versionSpec) {
	const c = import_semver.clean(versionSpec) || "";
	debug(`isExplicit: ${c}`);
	const valid = import_semver.valid(c) != null;
	debug(`explicit? ${valid}`);
	return valid;
}
/**
* Get the highest satisfiying semantic version in `versions` which satisfies `versionSpec`
*
* @param versions        array of versions to evaluate
* @param versionSpec     semantic version spec to satisfy
*/
function evaluateVersions(versions, versionSpec) {
	let version = "";
	debug(`evaluating ${versions.length} versions`);
	versions = versions.sort((a, b) => {
		if (import_semver.gt(a, b)) return 1;
		return -1;
	});
	for (let i = versions.length - 1; i >= 0; i--) {
		const potential = versions[i];
		if (import_semver.satisfies(potential, versionSpec)) {
			version = potential;
			break;
		}
	}
	if (version) debug(`matched: ${version}`);
	else debug("match not found");
	return version;
}
/**
* Gets RUNNER_TOOL_CACHE
*/
function _getCacheDirectory() {
	const cacheDirectory = process.env["RUNNER_TOOL_CACHE"] || "";
	(0, assert.ok)(cacheDirectory, "Expected RUNNER_TOOL_CACHE to be defined");
	return cacheDirectory;
}
/**
* Gets RUNNER_TEMP
*/
function _getTempDirectory() {
	const tempDirectory = process.env["RUNNER_TEMP"] || "";
	(0, assert.ok)(tempDirectory, "Expected RUNNER_TEMP to be defined");
	return tempDirectory;
}
/**
* Gets a global variable
*/
function _getGlobal(key, defaultValue) {
	const value = global[key];
	return value !== void 0 ? value : defaultValue;
}
//#endregion
//#region node_modules/.pnpm/isexe@4.0.0/node_modules/isexe/dist/commonjs/index.min.js
var require_index_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	var a = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports);
	var _ = a((i) => {
		"use strict";
		Object.defineProperty(i, "__esModule", { value: !0 });
		i.sync = i.isexe = void 0;
		var M = require("node:fs"), x = require("node:fs/promises"), q = async (t, e = {}) => {
			let { ignoreErrors: r = !1 } = e;
			try {
				return d(await (0, x.stat)(t), e);
			} catch (s) {
				let n = s;
				if (r || n.code === "EACCES") return !1;
				throw n;
			}
		};
		i.isexe = q;
		var m = (t, e = {}) => {
			let { ignoreErrors: r = !1 } = e;
			try {
				return d((0, M.statSync)(t), e);
			} catch (s) {
				let n = s;
				if (r || n.code === "EACCES") return !1;
				throw n;
			}
		};
		i.sync = m;
		var d = (t, e) => t.isFile() && A(t, e), A = (t, e) => {
			let r = e.uid ?? process.getuid?.(), s = e.groups ?? process.getgroups?.() ?? [], n = e.gid ?? process.getgid?.() ?? s[0];
			if (r === void 0 || n === void 0) throw new Error("cannot get uid or gid");
			let u = new Set([n, ...s]), c = t.mode, S = t.uid, P = t.gid, f = parseInt("100", 8), l = parseInt("010", 8);
			return !!(c & parseInt("001", 8) || c & l && u.has(P) || c & f && S === r || c & 72 && r === 0);
		};
	});
	var g = a((o) => {
		"use strict";
		Object.defineProperty(o, "__esModule", { value: !0 });
		o.sync = o.isexe = void 0;
		var T = require("node:fs"), I = require("node:fs/promises"), D = require("node:path"), F = async (t, e = {}) => {
			let { ignoreErrors: r = !1 } = e;
			try {
				return y(await (0, I.stat)(t), t, e);
			} catch (s) {
				let n = s;
				if (r || n.code === "EACCES") return !1;
				throw n;
			}
		};
		o.isexe = F;
		var L = (t, e = {}) => {
			let { ignoreErrors: r = !1 } = e;
			try {
				return y((0, T.statSync)(t), t, e);
			} catch (s) {
				let n = s;
				if (r || n.code === "EACCES") return !1;
				throw n;
			}
		};
		o.sync = L;
		var B = (t, e) => {
			let { pathExt: r = process.env.PATHEXT || "" } = e, s = r.split(D.delimiter);
			if (s.indexOf("") !== -1) return !0;
			for (let n of s) {
				let u = n.toLowerCase(), c = t.substring(t.length - u.length).toLowerCase();
				if (u && c === u) return !0;
			}
			return !1;
		}, y = (t, e, r) => t.isFile() && B(e, r);
	});
	var p = a((h) => {
		"use strict";
		Object.defineProperty(h, "__esModule", { value: !0 });
	});
	var v = exports && exports.__createBinding || (Object.create ? (function(t, e, r, s) {
		s === void 0 && (s = r);
		var n = Object.getOwnPropertyDescriptor(e, r);
		(!n || ("get" in n ? !e.__esModule : n.writable || n.configurable)) && (n = {
			enumerable: !0,
			get: function() {
				return e[r];
			}
		}), Object.defineProperty(t, s, n);
	}) : (function(t, e, r, s) {
		s === void 0 && (s = r), t[s] = e[r];
	})), G = exports && exports.__setModuleDefault || (Object.create ? (function(t, e) {
		Object.defineProperty(t, "default", {
			enumerable: !0,
			value: e
		});
	}) : function(t, e) {
		t.default = e;
	}), w = exports && exports.__importStar || (function() {
		var t = function(e) {
			return t = Object.getOwnPropertyNames || function(r) {
				var s = [];
				for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (s[s.length] = n);
				return s;
			}, t(e);
		};
		return function(e) {
			if (e && e.__esModule) return e;
			var r = {};
			if (e != null) for (var s = t(e), n = 0; n < s.length; n++) s[n] !== "default" && v(r, e, s[n]);
			return G(r, e), r;
		};
	})(), X = exports && exports.__exportStar || function(t, e) {
		for (var r in t) r !== "default" && !Object.prototype.hasOwnProperty.call(e, r) && v(e, t, r);
	};
	Object.defineProperty(exports, "__esModule", { value: !0 });
	exports.sync = exports.isexe = exports.posix = exports.win32 = void 0;
	var E = w(_());
	exports.posix = E;
	var O = w(g());
	exports.win32 = O;
	X(p(), exports);
	var b = (process.env._ISEXE_TEST_PLATFORM_ || process.platform) === "win32" ? O : E;
	exports.isexe = b.isexe;
	exports.sync = b.sync;
}));
//#endregion
//#region node_modules/.pnpm/which@7.0.0/node_modules/which/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { isexe, sync: isexeSync } = require_index_min();
	const { join, delimiter, sep, posix } = require("path");
	const isWindows = process.platform === "win32";
	/* istanbul ignore next */
	const rSlash = new RegExp(`[${posix.sep}${sep === posix.sep ? "" : sep}]`.replace(/(\\)/g, "\\$1"));
	const rRel = new RegExp(`^\\.${rSlash.source}`);
	const getNotFoundError = (cmd) => Object.assign(/* @__PURE__ */ new Error(`not found: ${cmd}`), { code: "ENOENT" });
	const getPathInfo = (cmd, { path: optPath = process.env.PATH, pathExt: optPathExt = process.env.PATHEXT, delimiter: optDelimiter = delimiter }) => {
		const pathEnv = cmd.match(rSlash) ? [""] : [...isWindows ? [process.cwd()] : [], ...(optPath || "").split(optDelimiter)];
		if (isWindows) {
			const pathExtExe = optPathExt || [
				".EXE",
				".CMD",
				".BAT",
				".COM"
			].join(optDelimiter);
			const pathExt = pathExtExe.split(optDelimiter).flatMap((item) => [item, item.toLowerCase()]);
			if (cmd.includes(".") && pathExt[0] !== "") pathExt.unshift("");
			return {
				pathEnv,
				pathExt,
				pathExtExe
			};
		}
		return {
			pathEnv,
			pathExt: [""]
		};
	};
	const getPathPart = (raw, cmd) => {
		const pathPart = /^".*"$/.test(raw) ? raw.slice(1, -1) : raw;
		return (!pathPart && rRel.test(cmd) ? cmd.slice(0, 2) : "") + join(pathPart, cmd);
	};
	const which = async (cmd, opt = {}) => {
		const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
		const found = [];
		for (const envPart of pathEnv) {
			const p = getPathPart(envPart, cmd);
			for (const ext of pathExt) {
				const withExt = p + ext;
				if (await isexe(withExt, {
					pathExt: pathExtExe,
					ignoreErrors: true
				})) {
					if (!opt.all) return withExt;
					found.push(withExt);
				}
			}
		}
		if (opt.all && found.length) return found;
		if (opt.nothrow) return null;
		throw getNotFoundError(cmd);
	};
	const whichSync = (cmd, opt = {}) => {
		const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
		const found = [];
		for (const pathEnvPart of pathEnv) {
			const p = getPathPart(pathEnvPart, cmd);
			for (const ext of pathExt) {
				const withExt = p + ext;
				if (isexeSync(withExt, {
					pathExt: pathExtExe,
					ignoreErrors: true
				})) {
					if (!opt.all) return withExt;
					found.push(withExt);
				}
			}
		}
		if (opt.all && found.length) return found;
		if (opt.nothrow) return null;
		throw getNotFoundError(cmd);
	};
	module.exports = which;
	which.sync = whichSync;
}));
//#endregion
//#region package.json
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var version = "3.0.2";
//#endregion
//#region node_modules/.pnpm/@badrap+valita@0.5.4/node_modules/@badrap/valita/dist/index.js
/**
* @module
* A typesafe validation & parsing library for TypeScript.
*
* @example
* ```ts
* import * as v from "@badrap/valita";
*
* const vehicle = v.union(
*   v.object({ type: v.literal("plane"), airline: v.string() }),
*   v.object({ type: v.literal("train") }),
*   v.object({ type: v.literal("automobile"), make: v.string() })
* );
* vehicle.parse({ type: "bike" });
* // ValitaError: invalid_literal at .type (expected "plane", "train" or "automobile")
* ```
*/
function expectedType(expected) {
	return {
		ok: false,
		code: "invalid_type",
		expected
	};
}
const ISSUE_EXPECTED_NOTHING = expectedType([]);
const ISSUE_EXPECTED_STRING = expectedType(["string"]);
const ISSUE_EXPECTED_NUMBER = expectedType(["number"]);
const ISSUE_EXPECTED_BIGINT = expectedType(["bigint"]);
const ISSUE_EXPECTED_BOOLEAN = expectedType(["boolean"]);
const ISSUE_EXPECTED_UNDEFINED = expectedType(["undefined"]);
const ISSUE_EXPECTED_NULL = expectedType(["null"]);
const ISSUE_EXPECTED_OBJECT = expectedType(["object"]);
const ISSUE_EXPECTED_ARRAY = expectedType(["array"]);
const ISSUE_MISSING_VALUE = {
	ok: false,
	code: "missing_value"
};
function joinIssues(left, right) {
	return left ? {
		ok: false,
		code: "join",
		left,
		right
	} : right;
}
function prependPath(key, tree) {
	return {
		ok: false,
		code: "prepend",
		key,
		tree
	};
}
function cloneIssueWithPath(tree, path) {
	const code = tree.code;
	switch (code) {
		case "invalid_type": return {
			code,
			path,
			expected: tree.expected
		};
		case "invalid_literal": return {
			code,
			path,
			expected: tree.expected
		};
		case "missing_value": return {
			code,
			path
		};
		case "invalid_length": return {
			code,
			path,
			minLength: tree.minLength,
			maxLength: tree.maxLength
		};
		case "unrecognized_keys": return {
			code,
			path,
			keys: tree.keys
		};
		case "invalid_union": return {
			code,
			path,
			issues: collectIssues(tree.tree)
		};
		case "custom_error":
			if (typeof tree.error === "object" && tree.error.path !== void 0) path.push(...tree.error.path);
			return {
				code,
				path,
				message: typeof tree.error === "string" ? tree.error : tree.error?.message
			};
	}
}
function collectIssues(tree, path = [], issues = []) {
	for (;;) if (tree.code === "join") {
		collectIssues(tree.left, path.slice(), issues);
		tree = tree.right;
	} else if (tree.code === "prepend") {
		path.push(tree.key);
		tree = tree.tree;
	} else {
		issues.push(cloneIssueWithPath(tree, path));
		return issues;
	}
}
function separatedList(list, sep) {
	if (list.length === 0) return "nothing";
	else if (list.length === 1) return list[0];
	else return `${list.slice(0, -1).join(", ")} ${sep} ${list[list.length - 1]}`;
}
function formatLiteral(value) {
	return typeof value === "bigint" ? `${value}n` : JSON.stringify(value);
}
function countIssues(tree) {
	let count = 0;
	for (;;) if (tree.code === "join") {
		count += countIssues(tree.left);
		tree = tree.right;
	} else if (tree.code === "prepend") tree = tree.tree;
	else return count + 1;
}
function formatIssueTree(tree) {
	let path = "";
	let count = 0;
	for (;;) if (tree.code === "join") {
		count += countIssues(tree.right);
		tree = tree.left;
	} else if (tree.code === "prepend") {
		path += `.${tree.key}`;
		tree = tree.tree;
	} else break;
	let message = "validation failed";
	if (tree.code === "invalid_type") message = `expected ${separatedList(tree.expected, "or")}`;
	else if (tree.code === "invalid_literal") message = `expected ${separatedList(tree.expected.map(formatLiteral), "or")}`;
	else if (tree.code === "missing_value") message = `missing value`;
	else if (tree.code === "unrecognized_keys") {
		const keys = tree.keys;
		message = `unrecognized ${keys.length === 1 ? "key" : "keys"} ${separatedList(keys.map(formatLiteral), "and")}`;
	} else if (tree.code === "invalid_length") {
		const min = tree.minLength;
		const max = tree.maxLength;
		message = `expected an array with `;
		if (min > 0) if (max === min) message += `${min}`;
		else if (max !== void 0) message += `between ${min} and ${max}`;
		else message += `at least ${min}`;
		else message += `at most ${max ?? "∞"}`;
		message += ` item(s)`;
	} else if (tree.code === "custom_error") {
		const error = tree.error;
		if (typeof error === "string") message = error;
		else if (error !== void 0) {
			if (error.message !== void 0) message = error.message;
			if (error.path !== void 0) path += "." + error.path.join(".");
		}
	}
	let msg = `${tree.code} at .${path.slice(1)} (${message})`;
	if (count === 1) msg += ` (+ 1 other issue)`;
	else if (count > 1) msg += ` (+ ${count} other issues)`;
	return msg;
}
function lazyProperty(obj, prop, value, enumerable) {
	Object.defineProperty(obj, prop, {
		value,
		enumerable,
		writable: false
	});
	return value;
}
/**
* An error type representing one or more validation/parsing errors.
*
* The `.message` property gives a short overview of the encountered issues,
* while the `.issue` property can be used to get a more detailed list.
*
* @example
* ```ts
* const t = v.object({ a: v.null(), b: v.null() });
*
* try {
*   t.parse({ a: 1 });
* } catch (err) {
*   err.message;
*   // "invalid_type at .a (expected null) (+ 1 other issue)"
*
*   err.issues;
*   // [
*   //   { code: 'invalid_type', path: [ 'a' ], expected: [ 'null' ] },
*   //   { code: 'missing_value', path: [ 'b' ] }
*   // ]
* }
* ```
*/
var ValitaError = class extends Error {
	#issueTree;
	constructor(issueTree) {
		super();
		this.#issueTree = issueTree;
	}
	get message() {
		return lazyProperty(this, "message", formatIssueTree(this.#issueTree), true);
	}
	get issues() {
		return lazyProperty(this, "issues", collectIssues(this.#issueTree), true);
	}
};
ValitaError.prototype.name = "ValitaError";
var ErrImpl = class {
	ok = false;
	/** @internal */
	_issueTree;
	constructor(issueTree) {
		this._issueTree = issueTree;
	}
	get issues() {
		return lazyProperty(this, "issues", collectIssues(this._issueTree), true);
	}
	get message() {
		return lazyProperty(this, "message", formatIssueTree(this._issueTree), true);
	}
	throw() {
		throw new ValitaError(this._issueTree);
	}
};
function ok(value) {
	return {
		ok: true,
		value
	};
}
function isObject(v) {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}
const FLAG_FORBID_EXTRA_KEYS = 1;
const FLAG_STRIP_EXTRA_KEYS = 2;
const FLAG_MISSING_VALUE = 4;
const TAG_UNKNOWN = 0;
const TAG_NEVER = 1;
const TAG_STRING = 2;
const TAG_NUMBER = 3;
const TAG_BIGINT = 4;
const TAG_BOOLEAN = 5;
const TAG_NULL = 6;
const TAG_UNDEFINED = 7;
const TAG_LITERAL = 8;
const TAG_OPTIONAL = 9;
const TAG_OBJECT = 10;
const TAG_ARRAY = 11;
const TAG_UNION = 12;
const TAG_SIMPLE_UNION = 13;
const TAG_TRANSFORM = 14;
const taggedMatcher = (tag, match) => {
	return {
		tag,
		match
	};
};
function callMatcher(matcher, value, flags) {
	switch (matcher.tag) {
		case TAG_UNKNOWN: return;
		case TAG_NEVER: return ISSUE_EXPECTED_NOTHING;
		case TAG_STRING: return typeof value === "string" ? void 0 : ISSUE_EXPECTED_STRING;
		case TAG_NUMBER: return typeof value === "number" ? void 0 : ISSUE_EXPECTED_NUMBER;
		case TAG_BIGINT: return typeof value === "bigint" ? void 0 : ISSUE_EXPECTED_BIGINT;
		case TAG_BOOLEAN: return typeof value === "boolean" ? void 0 : ISSUE_EXPECTED_BOOLEAN;
		case TAG_NULL: return value === null ? void 0 : ISSUE_EXPECTED_NULL;
		case TAG_UNDEFINED: return value === void 0 ? void 0 : ISSUE_EXPECTED_UNDEFINED;
		case TAG_LITERAL: return matcher.match(value, flags);
		case TAG_OPTIONAL: return matcher.match(value, flags);
		case TAG_OBJECT: return matcher.match(value, flags);
		case TAG_ARRAY: return matcher.match(value, flags);
		case TAG_UNION: return matcher.match(value, flags);
		case TAG_SIMPLE_UNION: return matcher.match(value, flags);
		case TAG_TRANSFORM: return matcher.match(value, flags);
		default: return matcher.match(value, flags);
	}
}
const MATCHER_SYMBOL = Symbol.for("@valita/internal");
var AbstractType = class {
	/**
	* Derive a new validator that uses the provided predicate function to
	* perform custom validation for the source validator's output values.
	*
	* The predicate function should return `true` when the source
	* type's output value is valid, `false` otherwise. The checked value
	* itself won't get modified or replaced, and is returned as-is on
	* validation success.
	*
	* @example A validator that accepts only numeric strings.
	* ```ts
	* const numericString = v.string().assert((s) => /^\d+$/.test(s))
	* numericString.parse("1");
	* // "1"
	* numericString.parse("foo");
	* // ValitaError: custom_error at . (validation failed)
	* ```
	*
	* You can also _refine_ the output type by passing in a
	* [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).
	* Note that the type predicate must have a compatible input type.
	*
	* @example A validator with its output type refined to `Date`.
	* ```ts
	* const dateType = v.unknown().assert((v): v is Date => v instanceof Date);
	* ```
	*
	* You can also pass in a custom failure messages.
	*
	* @example A validator that rejects non-integers with a custom error.
	* ```ts
	* const integer = v.number().assert((n) => Number.isInteger(n), "not an integer");
	* integer.parse(1);
	* // 1
	* integer.parse(1.5);
	* // ValitaError: custom_error at . (not an integer)
	* ```
	*
	* @param func - The assertion predicate function.
	* @param [error] - A custom error for situations when the assertion
	*                  predicate returns `false`.
	*/
	assert(func, error) {
		const err = {
			ok: false,
			code: "custom_error",
			error
		};
		return new TransformType(this, (v, flags) => func(v, flagsToOptions(flags)) ? void 0 : err);
	}
	map(func) {
		return new TransformType(this, (v, flags) => ({
			ok: true,
			value: func(v, flagsToOptions(flags))
		}));
	}
	chain(input) {
		if (typeof input === "function") return new TransformType(this, (v, flags) => {
			const r = input(v, flagsToOptions(flags));
			return r.ok ? r : r._issueTree;
		});
		return new TransformType(this, (v, flags) => callMatcher(input[MATCHER_SYMBOL], v, flags));
	}
};
/**
* A base class for all concrete validators/parsers.
*/
var Type = class extends AbstractType {
	optional(defaultFn) {
		const optional = new Optional(this);
		if (!defaultFn) return optional;
		return new TransformType(optional, (v) => {
			return v === void 0 ? {
				ok: true,
				value: defaultFn()
			} : void 0;
		});
	}
	nullable(defaultFn) {
		const nullable = new SimpleUnion([null_(), this]);
		if (!defaultFn) return nullable;
		return new TransformType(nullable, (v) => {
			return v === null ? {
				ok: true,
				value: defaultFn()
			} : void 0;
		});
	}
	_toTerminals(func) {
		func(this);
	}
	/**
	* Parse a value without throwing.
	*/
	try(v, options) {
		const r = callMatcher(this[MATCHER_SYMBOL], v, options === void 0 ? FLAG_FORBID_EXTRA_KEYS : options.mode === "strip" ? FLAG_STRIP_EXTRA_KEYS : options.mode === "passthrough" ? 0 : FLAG_FORBID_EXTRA_KEYS);
		return r === void 0 || r.ok ? {
			ok: true,
			value: r === void 0 ? v : r.value
		} : new ErrImpl(r);
	}
	/**
	* Parse a value. Throw a ValitaError on failure.
	*/
	parse(v, options) {
		const r = callMatcher(this[MATCHER_SYMBOL], v, options === void 0 ? FLAG_FORBID_EXTRA_KEYS : options.mode === "strip" ? FLAG_STRIP_EXTRA_KEYS : options.mode === "passthrough" ? 0 : FLAG_FORBID_EXTRA_KEYS);
		if (r === void 0 || r.ok) return r === void 0 ? v : r.value;
		throw new ValitaError(r);
	}
};
var SimpleUnion = class extends Type {
	name = "union";
	options;
	constructor(options) {
		super();
		this.options = options;
	}
	get [MATCHER_SYMBOL]() {
		const options = this.options.map((o) => o[MATCHER_SYMBOL]);
		return lazyProperty(this, MATCHER_SYMBOL, taggedMatcher(TAG_SIMPLE_UNION, (v, flags) => {
			let issue = ISSUE_EXPECTED_NOTHING;
			for (const option of options) {
				const result = callMatcher(option, v, flags);
				if (result === void 0 || result.ok) return result;
				issue = result;
			}
			return issue;
		}), false);
	}
	_toTerminals(func) {
		for (const option of this.options) option._toTerminals(func);
	}
};
/**
* A validator/parser marked as "optional", signifying that their value can
* be missing from the parsed object.
*
* As such optionals can only be used as property validators within
* object validators.
*/
var Optional = class extends AbstractType {
	name = "optional";
	type;
	constructor(type) {
		super();
		this.type = type;
	}
	optional(defaultFn) {
		if (!defaultFn) return this;
		return new TransformType(this, (v) => {
			return v === void 0 ? {
				ok: true,
				value: defaultFn()
			} : void 0;
		});
	}
	get [MATCHER_SYMBOL]() {
		const matcher = this.type[MATCHER_SYMBOL];
		return lazyProperty(this, MATCHER_SYMBOL, taggedMatcher(TAG_OPTIONAL, (v, flags) => v === void 0 || flags & FLAG_MISSING_VALUE ? void 0 : callMatcher(matcher, v, flags)), false);
	}
	_toTerminals(func) {
		func(this);
		func(undefined_());
		this.type._toTerminals(func);
	}
};
function setBit(bits, index) {
	if (typeof bits !== "number") {
		const idx = index >> 5;
		for (let i = bits.length; i <= idx; i++) bits.push(0);
		bits[idx] |= 1 << index % 32;
		return bits;
	} else if (index < 32) return bits | 1 << index;
	else return setBit([bits, 0], index);
}
function getBit(bits, index) {
	if (typeof bits === "number") return index < 32 ? bits >>> index & 1 : 0;
	else return bits[index >> 5] >>> index % 32 & 1;
}
var ObjectType = class ObjectType extends Type {
	name = "object";
	shape;
	restType;
	constructor(shape, restType) {
		super();
		this.shape = shape;
		this.restType = restType;
	}
	get [MATCHER_SYMBOL]() {
		const func = createObjectMatcher(this.shape, this.restType);
		return lazyProperty(this, MATCHER_SYMBOL, taggedMatcher(TAG_OBJECT, (v, flags) => isObject(v) ? func(v, flags) : ISSUE_EXPECTED_OBJECT), false);
	}
	rest(restType) {
		return new ObjectType(this.shape, restType);
	}
	extend(shape) {
		return new ObjectType({
			...this.shape,
			...shape
		}, this.restType);
	}
	pick(...keys) {
		const shape = {};
		for (const key of keys) set(shape, key, this.shape[key]);
		return new ObjectType(shape, void 0);
	}
	omit(...keys) {
		const shape = { ...this.shape };
		for (const key of keys) delete shape[key];
		return new ObjectType(shape, this.restType);
	}
	partial() {
		const shape = {};
		for (const key of Object.keys(this.shape)) set(shape, key, this.shape[key].optional());
		const rest = this.restType?.optional();
		return new ObjectType(shape, rest);
	}
};
function set(obj, key, value) {
	if (key === "__proto__") Object.defineProperty(obj, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
	else obj[key] = value;
}
function createObjectMatcher(shape, rest) {
	const indexedEntries = Object.keys(shape).map((key, index) => {
		const type = shape[key];
		let optional = false;
		type._toTerminals((t) => {
			optional ||= t.name === "optional";
		});
		return {
			key,
			index,
			matcher: type[MATCHER_SYMBOL],
			optional,
			missing: prependPath(key, ISSUE_MISSING_VALUE)
		};
	});
	const keyedEntries = Object.create(null);
	for (const entry of indexedEntries) keyedEntries[entry.key] = entry;
	const restMatcher = rest?.[MATCHER_SYMBOL];
	const fastPath = indexedEntries.length === 0 && rest?.name === "unknown";
	return (obj, flags) => {
		if (fastPath) return;
		let output = void 0;
		let issues = void 0;
		let unrecognized = void 0;
		let seenBits = 0;
		let seenCount = 0;
		if (flags & 3 || restMatcher !== void 0) for (const key in obj) {
			const value = obj[key];
			const entry = keyedEntries[key];
			if (entry === void 0 && restMatcher === void 0) {
				if (flags & FLAG_FORBID_EXTRA_KEYS) if (unrecognized === void 0) {
					unrecognized = [key];
					issues = joinIssues(issues, {
						ok: false,
						code: "unrecognized_keys",
						keys: unrecognized
					});
				} else unrecognized.push(key);
				else if (flags & FLAG_STRIP_EXTRA_KEYS && issues === void 0 && output === void 0) {
					output = {};
					for (let m = 0; m < indexedEntries.length; m++) if (getBit(seenBits, m)) {
						const k = indexedEntries[m].key;
						set(output, k, obj[k]);
					}
				}
				continue;
			}
			const r = entry === void 0 ? callMatcher(restMatcher, value, flags) : callMatcher(entry.matcher, value, flags);
			if (r === void 0) {
				if (output !== void 0 && issues === void 0) set(output, key, value);
			} else if (!r.ok) issues = joinIssues(issues, prependPath(key, r));
			else if (issues === void 0) {
				if (output === void 0) {
					output = {};
					if (restMatcher === void 0) {
						for (let m = 0; m < indexedEntries.length; m++) if (getBit(seenBits, m)) {
							const k = indexedEntries[m].key;
							set(output, k, obj[k]);
						}
					} else for (const k in obj) set(output, k, obj[k]);
				}
				set(output, key, r.value);
			}
			if (entry !== void 0) {
				seenCount++;
				seenBits = setBit(seenBits, entry.index);
			}
		}
		if (seenCount < indexedEntries.length) for (let i = 0; i < indexedEntries.length; i++) {
			if (getBit(seenBits, i)) continue;
			const entry = indexedEntries[i];
			const value = obj[entry.key];
			let extraFlags = 0;
			if (value === void 0 && !(entry.key in obj)) {
				if (!entry.optional) {
					issues = joinIssues(issues, entry.missing);
					continue;
				}
				extraFlags = FLAG_MISSING_VALUE;
			}
			const r = callMatcher(entry.matcher, value, flags | extraFlags);
			if (r === void 0) {
				if (output !== void 0 && issues === void 0 && !extraFlags) set(output, entry.key, value);
			} else if (!r.ok) issues = joinIssues(issues, prependPath(entry.key, r));
			else if (issues === void 0) {
				if (output === void 0) {
					output = {};
					if (restMatcher === void 0) {
						for (let m = 0; m < indexedEntries.length; m++) if (m < i || getBit(seenBits, m)) {
							const k = indexedEntries[m].key;
							set(output, k, obj[k]);
						}
					} else {
						for (const k in obj) set(output, k, obj[k]);
						for (let m = 0; m < i; m++) if (!getBit(seenBits, m)) {
							const k = indexedEntries[m].key;
							set(output, k, obj[k]);
						}
					}
				}
				set(output, entry.key, r.value);
			}
		}
		if (issues !== void 0) return issues;
		return output && {
			ok: true,
			value: output
		};
	};
}
var ArrayOrTupleType = class ArrayOrTupleType extends Type {
	name = "array";
	prefix;
	restType;
	suffix;
	constructor(prefix, rest, suffix) {
		super();
		this.prefix = prefix;
		this.restType = rest;
		this.suffix = suffix;
	}
	get [MATCHER_SYMBOL]() {
		const prefix = this.prefix.map((t) => t[MATCHER_SYMBOL]);
		const suffix = this.suffix.map((t) => t[MATCHER_SYMBOL]);
		const rest = this.restType?.[MATCHER_SYMBOL] ?? taggedMatcher(1, () => ISSUE_MISSING_VALUE);
		const minLength = prefix.length + suffix.length;
		const maxLength = this.restType ? Infinity : minLength;
		const invalidLength = {
			ok: false,
			code: "invalid_length",
			minLength,
			maxLength: maxLength === Infinity ? void 0 : maxLength
		};
		return lazyProperty(this, MATCHER_SYMBOL, taggedMatcher(TAG_ARRAY, (arr, flags) => {
			if (!Array.isArray(arr)) return ISSUE_EXPECTED_ARRAY;
			const length = arr.length;
			if (length < minLength || length > maxLength) return invalidLength;
			const headEnd = prefix.length;
			const tailStart = arr.length - suffix.length;
			let issueTree = void 0;
			let output = arr;
			for (let i = 0; i < arr.length; i++) {
				const r = callMatcher(i < headEnd ? prefix[i] : i >= tailStart ? suffix[i - tailStart] : rest, arr[i], flags);
				if (r !== void 0) if (r.ok) {
					if (output === arr) output = arr.slice();
					output[i] = r.value;
				} else issueTree = joinIssues(issueTree, prependPath(i, r));
			}
			if (issueTree) return issueTree;
			else if (arr === output) return;
			else return {
				ok: true,
				value: output
			};
		}), false);
	}
	concat(type) {
		if (this.restType) {
			if (type.restType) throw new TypeError("can not concatenate two variadic types");
			return new ArrayOrTupleType(this.prefix, this.restType, [
				...this.suffix,
				...type.prefix,
				...type.suffix
			]);
		} else if (type.restType) return new ArrayOrTupleType([
			...this.prefix,
			...this.suffix,
			...type.prefix
		], type.restType, type.suffix);
		else return new ArrayOrTupleType([
			...this.prefix,
			...this.suffix,
			...type.prefix,
			...type.suffix
		], type.restType, type.suffix);
	}
};
function toInputType(v) {
	const type = typeof v;
	if (type !== "object") return type;
	else if (v === null) return "null";
	else if (Array.isArray(v)) return "array";
	else return type;
}
function dedup(arr) {
	return [...new Set(arr)];
}
function groupTerminals(terminals) {
	const order = /* @__PURE__ */ new Map();
	const literals = /* @__PURE__ */ new Map();
	const types = /* @__PURE__ */ new Map();
	const unknowns = [];
	const optionals = [];
	const expectedTypes = [];
	for (const { root, terminal } of terminals) {
		order.set(root, order.get(root) ?? order.size);
		if (terminal.name === "never") {} else if (terminal.name === "optional") optionals.push(root);
		else if (terminal.name === "unknown") unknowns.push(root);
		else if (terminal.name === "literal") {
			const roots = literals.get(terminal.value) ?? [];
			roots.push(root);
			literals.set(terminal.value, roots);
			expectedTypes.push(toInputType(terminal.value));
		} else {
			const roots = types.get(terminal.name) ?? [];
			roots.push(root);
			types.set(terminal.name, roots);
			expectedTypes.push(terminal.name);
		}
	}
	const byOrder = (a, b) => {
		return (order.get(a) ?? 0) - (order.get(b) ?? 0);
	};
	for (const [value, roots] of literals) {
		const options = types.get(toInputType(value));
		if (options) {
			options.push(...roots);
			literals.delete(value);
		} else literals.set(value, dedup(roots.concat(unknowns)).sort(byOrder));
	}
	for (const [type, roots] of types) types.set(type, dedup(roots.concat(unknowns)).sort(byOrder));
	return {
		types,
		literals,
		unknowns: dedup(unknowns).sort(byOrder),
		optionals: dedup(optionals).sort(byOrder),
		expectedTypes: dedup(expectedTypes)
	};
}
function createObjectKeyMatcher(objects, key) {
	const list = [];
	for (const { root, terminal } of objects) terminal.shape[key]._toTerminals((t) => {
		list.push({
			root,
			terminal: t
		});
	});
	const { types, literals, optionals, unknowns, expectedTypes } = groupTerminals(list);
	if (unknowns.length > 0 || optionals.length > 1) return;
	for (const roots of literals.values()) if (roots.length > 1) return;
	for (const roots of types.values()) if (roots.length > 1) return;
	const missingValue = prependPath(key, ISSUE_MISSING_VALUE);
	const issue = prependPath(key, types.size === 0 ? {
		ok: false,
		code: "invalid_literal",
		expected: [...literals.keys()]
	} : {
		ok: false,
		code: "invalid_type",
		expected: expectedTypes
	});
	const byLiteral = literals.size > 0 ? /* @__PURE__ */ new Map() : void 0;
	if (byLiteral) for (const [literal, options] of literals) byLiteral.set(literal, options[0][MATCHER_SYMBOL]);
	const byType = types.size > 0 ? {} : void 0;
	if (byType) for (const [type, options] of types) byType[type] = options[0][MATCHER_SYMBOL];
	const optional = optionals[0]?.[MATCHER_SYMBOL];
	return (obj, flags) => {
		const value = obj[key];
		if (value === void 0 && !(key in obj)) return optional === void 0 ? missingValue : callMatcher(optional, obj, flags);
		const option = byType?.[toInputType(value)] ?? byLiteral?.get(value);
		return option ? callMatcher(option, obj, flags) : issue;
	};
}
function createUnionObjectMatcher(terminals) {
	const objects = [];
	const keyCounts = /* @__PURE__ */ new Map();
	for (const { root, terminal } of terminals) {
		if (terminal.name === "unknown") return;
		if (terminal.name === "object") {
			for (const key in terminal.shape) keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
			objects.push({
				root,
				terminal
			});
		}
	}
	if (objects.length < 2) return;
	for (const [key, count] of keyCounts) if (count === objects.length) {
		const matcher = createObjectKeyMatcher(objects, key);
		if (matcher) return matcher;
	}
}
function createUnionBaseMatcher(terminals) {
	const { expectedTypes, literals, types, unknowns, optionals } = groupTerminals(terminals);
	const issue = types.size === 0 && unknowns.length === 0 ? {
		ok: false,
		code: "invalid_literal",
		expected: [...literals.keys()]
	} : {
		ok: false,
		code: "invalid_type",
		expected: expectedTypes
	};
	const byLiteral = literals.size > 0 ? /* @__PURE__ */ new Map() : void 0;
	if (byLiteral) for (const [literal, options] of literals) byLiteral.set(literal, options.map((t) => t[MATCHER_SYMBOL]));
	const byType = types.size > 0 ? {} : void 0;
	if (byType) for (const [type, options] of types) byType[type] = options.map((t) => t[MATCHER_SYMBOL]);
	const optionalMatchers = optionals.map((t) => t[MATCHER_SYMBOL]);
	const unknownMatchers = unknowns.map((t) => t[MATCHER_SYMBOL]);
	return (value, flags) => {
		const options = flags & FLAG_MISSING_VALUE ? optionalMatchers : byType?.[toInputType(value)] ?? byLiteral?.get(value) ?? unknownMatchers;
		let count = 0;
		let issueTree = issue;
		for (let i = 0; i < options.length; i++) {
			const r = callMatcher(options[i], value, flags);
			if (r === void 0 || r.ok) return r;
			issueTree = count > 0 ? joinIssues(issueTree, r) : r;
			count++;
		}
		if (count > 1) return {
			ok: false,
			code: "invalid_union",
			tree: issueTree
		};
		return issueTree;
	};
}
var UnionType = class extends Type {
	name = "union";
	options;
	constructor(options) {
		super();
		this.options = options;
	}
	_toTerminals(func) {
		for (const option of this.options) option._toTerminals(func);
	}
	get [MATCHER_SYMBOL]() {
		const flattened = [];
		for (const option of this.options) option._toTerminals((terminal) => {
			flattened.push({
				root: option,
				terminal
			});
		});
		const base = createUnionBaseMatcher(flattened);
		const object = createUnionObjectMatcher(flattened);
		return lazyProperty(this, MATCHER_SYMBOL, taggedMatcher(TAG_UNION, (v, f) => object !== void 0 && isObject(v) ? object(v, f) : base(v, f)), false);
	}
};
const STRICT = Object.freeze({ mode: "strict" });
const STRIP = Object.freeze({ mode: "strip" });
const PASSTHROUGH = Object.freeze({ mode: "passthrough" });
function flagsToOptions(flags) {
	return flags & FLAG_FORBID_EXTRA_KEYS ? STRICT : flags & FLAG_STRIP_EXTRA_KEYS ? STRIP : PASSTHROUGH;
}
var TransformType = class TransformType extends Type {
	name = "transform";
	#transformed;
	#transform;
	constructor(transformed, transform) {
		super();
		this.#transformed = transformed;
		this.#transform = transform;
	}
	get [MATCHER_SYMBOL]() {
		const chain = [];
		let next = this;
		while (next instanceof TransformType) {
			chain.push(next.#transform);
			next = next.#transformed;
		}
		chain.reverse();
		const matcher = next[MATCHER_SYMBOL];
		const undef = ok(void 0);
		return lazyProperty(this, MATCHER_SYMBOL, taggedMatcher(TAG_TRANSFORM, (v, flags) => {
			let result = callMatcher(matcher, v, flags);
			if (result !== void 0 && !result.ok) return result;
			let current;
			if (result !== void 0) current = result.value;
			else if (flags & FLAG_MISSING_VALUE) {
				current = void 0;
				result = undef;
			} else current = v;
			for (let i = 0; i < chain.length; i++) {
				const r = chain[i](current, flags);
				if (r !== void 0) {
					if (!r.ok) return r;
					current = r.value;
					result = r;
				}
			}
			return result;
		}), false);
	}
	_toTerminals(func) {
		this.#transformed._toTerminals(func);
	}
};
function singleton(name, tag, match) {
	const value = taggedMatcher(tag, match);
	class SimpleType extends Type {
		name;
		[MATCHER_SYMBOL];
		constructor() {
			super();
			this.name = name;
			this[MATCHER_SYMBOL] = value;
		}
	}
	const instance = new SimpleType();
	return /*#__NO_SIDE_EFFECTS__*/ () => instance;
}
/**
* Create a validator that matches any value,
* analogous to the TypeScript type `unknown`.
*/
const unknown = /*#__PURE__*/ singleton("unknown", TAG_UNKNOWN, () => void 0);
/**
* Create a validator that matches any string value.
*/
const string = /*#__PURE__*/ singleton("string", TAG_STRING, (v) => typeof v === "string" ? void 0 : ISSUE_EXPECTED_STRING);
/**
* Create a validator that matches any number value.
*/
const number = /*#__PURE__*/ singleton("number", TAG_NUMBER, (v) => typeof v === "number" ? void 0 : ISSUE_EXPECTED_NUMBER);
/**
* Create a validator that matches `null`.
*/
const null_ = /*#__PURE__*/ singleton("null", TAG_NULL, (v) => v === null ? void 0 : ISSUE_EXPECTED_NULL);
/**
* Create a validator that matches `undefined`.
*/
const undefined_ = /*#__PURE__*/ singleton("undefined", TAG_UNDEFINED, (v) => v === void 0 ? void 0 : ISSUE_EXPECTED_UNDEFINED);
var LiteralType = class extends Type {
	name = "literal";
	[MATCHER_SYMBOL];
	value;
	constructor(value) {
		super();
		const issue = {
			ok: false,
			code: "invalid_literal",
			expected: [value]
		};
		this[MATCHER_SYMBOL] = taggedMatcher(TAG_LITERAL, (v) => v === value ? void 0 : issue);
		this.value = value;
	}
};
/**
* Create a validator for a specific string, number, bigint or boolean value.
*/
const literal = (value) => {
	return /*#__PURE__*/ new LiteralType(value);
};
/**
* Create a validator for an object type.
*/
const object = (obj) => {
	return /*#__PURE__*/ new ObjectType(obj, void 0);
};
/**
* Create a validator for an array type `T[]`,
* where `T` is the output type of the given subvalidator.
*/
const array = (item) => {
	return /*#__PURE__*/ new ArrayOrTupleType([], item ?? unknown(), []);
};
/**
* Create a validator that matches any type `T1 | T2 | ... | Tn`,
* where `T1`, `T2`, ..., `Tn` are the output types of the given subvalidators.
*
* This is analogous to how TypeScript's union types are constructed.
*/
const union = (...options) => {
	return /*#__PURE__*/ new UnionType(options);
};
//#endregion
//#region src/schema.ts
const Position = object({
	line: number(),
	character: number()
});
function isEmptyPosition(p) {
	return p.line === 0 && p.character === 0;
}
const Range = object({
	start: Position,
	end: Position
});
function isEmptyRange(r) {
	return isEmptyPosition(r.start) && isEmptyPosition(r.end);
}
const Diagnostic = object({
	file: string(),
	severity: union(literal("error"), literal("warning"), literal("information")),
	message: string(),
	rule: string().optional(),
	range: Range.optional()
});
const Report = object({
	generalDiagnostics: array(Diagnostic),
	summary: object({
		errorCount: number(),
		warningCount: number(),
		informationCount: number()
	})
});
function parseReport(v) {
	return Report.parse(v, { mode: "strip" });
}
function isSemVer(version) {
	try {
		new import_semver.SemVer(version);
		return true;
	} catch {
		return false;
	}
}
const NpmRegistryResponse = object({
	version: string().assert(isSemVer, "must be a semver"),
	dist: object({ tarball: string() })
});
function parseNpmRegistryResponse(v) {
	return NpmRegistryResponse.parse(v, { mode: "strip" });
}
const PylanceBuildMetadata = object({
	pylanceVersion: string().assert(isSemVer, "must be a semver"),
	pyrightVersion: string().assert(isSemVer, "must be a semver")
});
function parsePylanceBuildMetadata(v) {
	return PylanceBuildMetadata.parse(v, { mode: "strip" });
}
//#endregion
//#region src/helpers.ts
function getActionVersion() {
	return version;
}
function getNodeInfo(process) {
	return {
		version: process.version,
		execPath: process.execPath
	};
}
const flagsWithoutCommentingSupport = new Set([
	"--verifytypes",
	"--stats",
	"--verbose",
	"--createstub",
	"--dependencies"
]);
async function getArgs(execPath) {
	const pyrightInfo = await getPyrightInfo();
	let pyrightPath;
	let command;
	switch (pyrightInfo.kind) {
		case "npm":
			pyrightPath = await downloadPyright(pyrightInfo);
			command = execPath;
			break;
		case "path":
			command = pyrightInfo.command;
			break;
	}
	const useDashedFlags = new import_semver.SemVer(pyrightInfo.version).compare("1.1.309") === -1;
	const args = [];
	if (pyrightPath) args.push(node_path.join(pyrightPath, "package", "index.js"));
	const workingDirectory = getInput("working-directory");
	const createStub = getInput("create-stub");
	if (createStub) args.push("--createstub", createStub);
	const dependencies = getInput("dependencies");
	if (dependencies) args.push("--dependencies", dependencies);
	if (getInput("ignore-external")) args.push("--ignoreexternal");
	const level = getInput("level");
	if (level) args.push("--level", level);
	const project = getInput("project");
	if (project) args.push("--project", project);
	const pythonPlatform = getInput("python-platform");
	if (pythonPlatform) args.push("--pythonplatform", pythonPlatform);
	const pythonPath = getInput("python-path");
	if (pythonPath) args.push("--pythonpath", pythonPath);
	const pythonVersion = getInput("python-version");
	if (pythonVersion) args.push("--pythonversion", pythonVersion);
	if (getBooleanInput("skip-unannotated", false)) args.push("--skipunannotated");
	if (getBooleanInput("stats", false)) args.push("--stats");
	const typeshedPath = getInput("typeshed-path");
	if (typeshedPath) args.push(useDashedFlags ? "--typeshed-path" : "--typeshedpath", typeshedPath);
	const venvPath = getInput("venv-path");
	if (venvPath) args.push(useDashedFlags ? "--venv-path" : "--venvpath", venvPath);
	if (getBooleanInput("verbose", false)) args.push("--lib");
	const verifyTypes = getInput("verify-types");
	if (verifyTypes) args.push("--verifytypes", verifyTypes);
	if (getBooleanInput("warnings", false)) args.push("--warnings");
	if (getBooleanInput("lib", false)) args.push("--lib");
	const extraArgs = getInput("extra-args");
	if (extraArgs) for (const arg of (0, import_shell_quote.parse)(extraArgs)) {
		if (typeof arg !== "string") throw new Error(`malformed extra-args: ${extraArgs}`);
		args.push(arg);
	}
	let annotateInput = getInput("annotate").trim() || "all";
	if (isAnnotateNone(annotateInput)) annotateInput = "";
	else if (isAnnotateAll(annotateInput)) annotateInput = "errors, warnings";
	const split = annotateInput ? annotateInput.split(",") : [];
	const annotate = /* @__PURE__ */ new Set();
	for (let value of split) {
		value = value.trim();
		if (value === "errors") annotate.add("error");
		else if (value === "warnings") annotate.add("warning");
		else {
			if (isAnnotateAll(value) || isAnnotateNone(value)) throw new Error(`invalid value ${JSON.stringify(value)} in comma-separated annotate`);
			throw new Error(`invalid value ${JSON.stringify(value)} for annotate`);
		}
	}
	if (getBooleanInput("no-comments", false) || args.some((arg) => flagsWithoutCommentingSupport.has(arg))) annotate.clear();
	return {
		workingDirectory,
		annotate,
		pyrightVersion: pyrightInfo.version,
		command,
		args
	};
}
function isAnnotateNone(name) {
	return name === "none" || name.toUpperCase() === "FALSE";
}
function isAnnotateAll(name) {
	return name === "all" || name.toUpperCase() === "TRUE";
}
function getBooleanInput(name, defaultValue) {
	const input = getInput(name);
	if (!input) return defaultValue;
	return input.toUpperCase() === "TRUE";
}
const pyrightToolName = "pyright";
async function downloadPyright(info) {
	const version = info.version.format();
	const found = find(pyrightToolName, version);
	if (found) return found;
	return await cacheDir(await extractTar(await downloadTool(info.tarball)), pyrightToolName, version);
}
function formatSemVerOrString(v) {
	if (typeof v === "string") return v;
	return v.format();
}
function parsePyrightVersionFromStdout(stdout) {
	const prefix = "pyright ";
	for (let line of stdout.trim().split(/\r?\n/)) {
		line = line.trimEnd();
		if (line.startsWith(prefix)) try {
			return new import_semver.SemVer(line.slice(8));
		} catch {}
	}
	throw new Error(`Failed to parse pyright version from ${JSON.stringify(stdout)}`);
}
async function getPyrightInfo() {
	const version = await getPyrightVersion();
	if (version === "PATH") {
		const command = import_lib.default.sync("pyright");
		let version;
		for (let i = 0; i < 2; i++) try {
			version = parsePyrightVersionFromStdout(node_child_process.execFileSync(command, ["--version"], { encoding: "utf8" }));
			break;
		} catch (e) {
			if (i === 1) throw e;
		}
		return {
			kind: "path",
			version,
			command
		};
	}
	const client = new HttpClient();
	const versionString = formatSemVerOrString(version);
	const url = `https://registry.npmjs.org/pyright/${versionString}`;
	const resp = await client.get(url);
	const body = await resp.readBody();
	if (resp.message.statusCode !== HttpCodes.OK) throw new Error(`Failed to download metadata for pyright ${versionString} from ${url} -- ${body}`);
	const parsed = parseNpmRegistryResponse(JSON.parse(body));
	return {
		kind: "npm",
		version: new import_semver.SemVer(parsed.version),
		tarball: parsed.dist.tarball
	};
}
async function getPyrightVersion() {
	const versionSpec = getInput("version");
	if (versionSpec) {
		if (versionSpec.toUpperCase() === "PATH") return "PATH";
		if (versionSpec === "latest") return "latest";
		return new import_semver.SemVer(versionSpec);
	}
	const pylanceVersion = getInput("pylance-version");
	if (pylanceVersion) {
		if (pylanceVersion !== "latest-release" && pylanceVersion !== "latest-prerelease") new import_semver.SemVer(pylanceVersion);
		return await getPylancePyrightVersion(pylanceVersion);
	}
	return "latest";
}
async function getPylancePyrightVersion(pylanceVersion) {
	const client = new HttpClient();
	const url = `https://raw.githubusercontent.com/microsoft/pylance-release/main/releases/${pylanceVersion}.json`;
	const resp = await client.get(url);
	const body = await resp.readBody();
	if (resp.message.statusCode !== HttpCodes.OK) throw new Error(`Failed to download release metadata for Pylance ${pylanceVersion} from ${url} -- ${body}`);
	const pyrightVersion = parsePylanceBuildMetadata(JSON.parse(body)).pyrightVersion;
	info(`Pylance ${pylanceVersion} uses pyright ${pyrightVersion}`);
	return new import_semver.SemVer(pyrightVersion);
}
//#endregion
//#region src/main.ts
function printInfo(pyrightVersion, node, cwd, command, args) {
	info(`pyright ${pyrightVersion.format()}, node ${node.version}, pyright-action ${getActionVersion()}`);
	info(`Working directory: ${cwd}`);
	info(`Running: ${(0, import_shell_quote.quote)([command, ...args])}`);
}
async function main() {
	try {
		const node = getNodeInfo(process);
		const { workingDirectory, annotate, pyrightVersion, command, args } = await getArgs(node.execPath);
		if (workingDirectory) process.chdir(workingDirectory);
		try {
			checkOverriddenFlags(pyrightVersion, args);
		} catch {}
		if (annotate.size === 0) {
			printInfo(pyrightVersion, node, process.cwd(), command, args);
			const { status } = node_child_process.spawnSync(command, args, { stdio: [
				"ignore",
				"inherit",
				"inherit"
			] });
			if (status !== 0) setFailed(`Exit code ${status}`);
			return;
		}
		const updatedArgs = [...args];
		if (!updatedArgs.includes("--outputjson")) updatedArgs.push("--outputjson");
		printInfo(pyrightVersion, node, process.cwd(), command, updatedArgs);
		const { status, stdout } = node_child_process.spawnSync(command, updatedArgs, {
			encoding: "utf8",
			stdio: [
				"ignore",
				"pipe",
				"inherit"
			],
			maxBuffer: 100 * 1024 * 1024
		});
		if (!stdout.trim()) {
			setFailed(`Exit code ${status}`);
			return;
		}
		const report = parseReport(JSON.parse(stdout));
		for (const diag of report.generalDiagnostics) {
			info(diagnosticToString(diag, false));
			if (diag.severity === "information") continue;
			if (!annotate.has(diag.severity)) continue;
			const line = diag.range?.start.line ?? 0;
			const col = diag.range?.start.character ?? 0;
			const message = diagnosticToString(diag, true);
			const properties = {
				file: diag.file,
				startLine: line + 1,
				startColumn: col + 1
			};
			if (diag.severity === "error") error(message, properties);
			else if (diag.severity === "warning") warning(message, properties);
		}
		const { errorCount, warningCount, informationCount } = report.summary;
		info([
			pluralize(errorCount, "error", "errors"),
			pluralize(warningCount, "warning", "warnings"),
			pluralize(informationCount, "information", "informations")
		].join(", "));
		if (status !== 0) setFailed(pluralize(errorCount, "error", "errors"));
	} catch (e) {
		node_assert.default.ok(typeof e === "string" || e instanceof Error);
		setFailed(e);
	}
}
function diagnosticToString(diag, forCommand) {
	let message = "";
	if (!forCommand) {
		if (diag.file) message += `${diag.file}:`;
		if (diag.range && !isEmptyRange(diag.range)) message += `${diag.range.start.line + 1}:${diag.range.start.character + 1} -`;
		message += ` ${diag.severity}: `;
	}
	message += diag.message;
	if (diag.rule) message += ` (${diag.rule})`;
	return message;
}
function pluralize(n, singular, plural) {
	return `${n} ${n === 1 ? singular : plural}`;
}
const flagsOverriddenByConfig352AndAfter = new Set(["--typeshedpath", "--venvpath"]);
const flagsOverriddenByConfig351AndBefore = new Set([
	"--pythonplatform",
	"--pythonversion",
	...flagsOverriddenByConfig352AndAfter
]);
function getFlagsOverriddenByConfig(version) {
	return version.compare("1.1.352") === -1 ? flagsOverriddenByConfig351AndBefore : flagsOverriddenByConfig352AndAfter;
}
function checkOverriddenFlags(version, args) {
	const flagsOverriddenByConfig = getFlagsOverriddenByConfig(version);
	const overriddenFlags = new Set(args.map((arg) => arg.toLowerCase()).filter((arg) => flagsOverriddenByConfig.has(arg)));
	if (overriddenFlags.size === 0) return;
	let configPath;
	for (let i = 0; i < args.length; i++) if (args[i] === "-p" || args[i] === "--project") {
		configPath = args[i + 1];
		break;
	}
	if (configPath && !configPath.endsWith(".json")) configPath = node_path.posix.join(configPath, "pyrightconfig.json");
	configPath ??= "pyrightconfig.json";
	let parsed;
	if (node_fs.existsSync(configPath)) try {
		parsed = JSONC.parse(node_fs.readFileSync(configPath, "utf8"));
	} catch {
		return;
	}
	else {
		let cwd = process.cwd();
		const root = node_path.parse(cwd).root;
		while (cwd !== root) {
			const pyprojectPath = node_path.posix.join(cwd, "pyproject.toml");
			if (node_fs.existsSync(pyprojectPath)) {
				parsed = (0, import_parse.default)(node_fs.readFileSync(pyprojectPath, "utf8"))["tool"]["pyright"];
				configPath = pyprojectPath;
				break;
			}
			cwd = node_path.dirname(cwd);
		}
	}
	if (parsed !== void 0 && parsed !== null) for (const [key, value] of Object.entries(parsed)) {
		const flag = `--${key.toLowerCase()}`;
		if (overriddenFlags.has(flag)) warning(`${configPath} contains ${(0, node_util.inspect)({ [key]: value })}; ${flag} as passed by pyright-action will have no effect.`);
	}
}
//#endregion
//#region src/index.ts
/* v8 ignore start */
main();
/* v8 ignore end */
//#endregion
