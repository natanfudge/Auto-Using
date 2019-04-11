module.exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(1);
const vscode = __webpack_require__(2);
const vscode_languageclient_1 = __webpack_require__(3);
const path_1 = __webpack_require__(1);
const util_1 = __webpack_require__(44);
const fs_1 = __webpack_require__(5);
const util_2 = __webpack_require__(45);
const debugServerLocation = path_1.join("server", "AutoUsing", "bin", "Debug", "netcoreapp2.1", "win10-x64", "AutoUsing.exe");
const releaseServerLocation = path_1.join("server", "AutoUsing", "bin", "Release", "netcoreapp2.1", "publish", "AutoUsing.dll");
const hoverRequest = "custom/hoverRequest";
const dotnetExe = 'dotnet';
const HANDLE_COMPLETION = "custom/handleCompletion";
const CLEAN_CACHE = "autousing.cleanCache";
const CLEAN_COMMON = "autousing.cleanCommon";
let client;
function activate(context) {
    // The server is implemented in node
    let releaseServerModule = context.asAbsolutePath(releaseServerLocation);
    let debugServerModule = context.asAbsolutePath(debugServerLocation);
    let setup = {
        extensionDir: context.extensionPath,
        projects: util_1.getAllProjectFiles(),
        workspaceStorageDir: context.storagePath,
        globalStorageDir: context.globalStoragePath
    };
    let message = JSON.stringify(setup);
    let serverOptions = {
        run: { command: dotnetExe, args: [releaseServerModule, message] },
        debug: { command: debugServerModule, args: [message] }
    };
    let clientOptions = {
        documentSelector: [
            {
                scheme: "file",
                language: "csharp"
            }
        ],
        synchronize: {
            configurationSection: 'autousing',
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.cs')
        }
    };
    // "dependencies": {
    // 	"package": "^1.0.1",
    // 	"vsce": "^1.59.0",
    // 	"vscode-jsonrpc": "^4.0.0",
    // 	"vscode-languageclient": "^5.2.1",
    // 	"vscode-languageserver-protocol": "^3.15.0-next.1",
    // 	"vscode-languageserver-types": "^3.14.0"
    // },
    // Create the language client and start the client.
    client = new vscode_languageclient_1.LanguageClient('autousing', 'Auto-Using', serverOptions, clientOptions);
    exports.testHelper = new util_1.TestHelper(client);
    client.onReady().then(() => {
        //@ts-ignore
        exports.testHelper.started = true;
        client.onRequest(hoverRequest, (request) => __awaiter(this, void 0, void 0, function* () {
            let pos = new vscode.Position(request.pos.line, request.pos.character);
            let uri = vscode.Uri.file(request.filePath);
            let result = yield util_1.getHoverString(uri, pos);
            if (result === undefined)
                return undefined;
            let str = result;
            return str;
        }));
    });
    client.trace = chosenTrace();
    let clientDisposable = client.start();
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(clientDisposable, registerHandleCompletionCommand(context), registerCleanCacheCommand(context), registerCleanCommonCommand(context));
}
exports.activate = activate;
function registerCleanCommonCommand(context) {
    return vscode.commands.registerCommand(CLEAN_COMMON, () => __awaiter(this, void 0, void 0, function* () {
        fs_1.writeFileSync(util_1.commonCompletionLocation(context), "[]");
        const reloadOption = "Yes, reload.";
        let choice = yield vscode.window.showInformationMessage("Common completions have been cleaned. Reload the window to apply changes?", reloadOption);
        if (choice === reloadOption) {
            vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    }));
}
/**
 * This command is activated whenever  a common is selected.
 * If there is just one namespace for a completion name, the using statement was already inserted so there is nothing to do.
 * Otherwise, it will show a popup that will let the user choose between the available namespaces and THEN insert a using statement.
 */
function registerHandleCompletionCommand(context) {
    return vscode.commands.registerCommand(HANDLE_COMPLETION, (completion) => __awaiter(this, void 0, void 0, function* () {
        if (completion.Namespaces.length > 1) {
            let completions = util_1.getStoredCompletions(context);
            let namespacesSorted = completion.Namespaces.sort((n1, n2) => byNamespaceSortingOrder(completion, completions, n1, n2));
            vscode.window.showQuickPick(namespacesSorted).then(pick => util_1.addUsing(pick, context, completion));
        }
        // In the multiple namespace case the completion is stored later. 
        else {
            util_1.storeCompletion(context, new util_1.StoredCompletion(completion.Name, completion.Namespaces[0]));
        }
    }));
}
/**
 * Just gives higher priority to common completions
 */
function byNamespaceSortingOrder(completion, storedCompletions, namespace1, namespace2) {
    let firstPrio = util_1.completionCommon(new util_1.StoredCompletion(completion.Name, namespace1), storedCompletions);
    let secondPrio = util_1.completionCommon(new util_1.StoredCompletion(completion.Name, namespace2), storedCompletions);
    if (firstPrio && !secondPrio)
        return -1;
    if (!firstPrio && secondPrio)
        return 1;
    return namespace1.localeCompare(namespace2);
}
/**
 * Destroy all of the files located at globalStoragePath/cache
 */
function cleanGlobalCache(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let dir = path_1.join(context.globalStoragePath, globalCacheLocation);
        yield removeDirectoryContents(dir);
    });
}
const readdirPromise = util_2.promisify(fs_1.readdir);
const lstatPromise = util_2.promisify(fs_1.lstat);
const unlinkPromise = util_2.promisify(fs_1.unlink);
/**
 * Destroy all autousing cache files in all workspace storage directories
 */
function cleanAllWorkspaceCache(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Go up to the workspaceStorage dir
        let allWorkspaceStorageDir = path.dirname(path.dirname(context.storagePath));
        //TODO: technically this could be sped up by dumping everything into a list of promises and then at the end awaiting it.
        let workspaceDirs = yield readdirPromise(allWorkspaceStorageDir);
        // Go through the weird generated numbers workspace directories 
        for (let workspaceDir of workspaceDirs) {
            let absoluteWorkspaceDir = path_1.join(allWorkspaceStorageDir, workspaceDir);
            // Ignore files that are not folders
            if (!(yield lstatPromise(absoluteWorkspaceDir)).isDirectory())
                continue;
            // Go through the files in a specific workspace directory
            let workspaceFiles = yield readdirPromise(absoluteWorkspaceDir);
            for (let workspaceFile of workspaceFiles) {
                // Go only inside the auto-using storage directory
                if (workspaceFile === extensionId) {
                    // Go through the cache files of a specific workspace
                    let cacheDir = path_1.join(allWorkspaceStorageDir, workspaceDir, workspaceFile, workspaceCacheLocation);
                    let projectCaches = yield readdirPromise(cacheDir);
                    // Remove the cache files of all projects of the workspace
                    for (let projectCacheDir of projectCaches) {
                        yield removeDirectoryContents(path_1.join(cacheDir, projectCacheDir));
                    }
                }
            }
        }
    });
}
function removeDirectoryContents(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let file of yield readdirPromise(dir)) {
            yield unlinkPromise(path_1.join(dir, file));
        }
    });
}
const extensionId = "fudge.auto-using";
function registerCleanCacheCommand(context) {
    return vscode.commands.registerCommand(CLEAN_CACHE, () => __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([cleanGlobalCache(context), cleanAllWorkspaceCache(context)]);
        const reloadOption = "Yes, reload.";
        let choice = yield vscode.window.showInformationMessage("Caches have been cleaned. Would you like to reload the window to apply changes?", reloadOption);
        if (choice === reloadOption) {
            vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    }));
}
const globalCacheLocation = "cache";
const workspaceCacheLocation = "cache";
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
function chosenTrace() {
    let config = vscode.workspace.getConfiguration("autousing").get("trace.server");
    switch (config) {
        case "off": return vscode_languageclient_1.Trace.Off;
        case "messages": return vscode_languageclient_1.Trace.Messages;
        case "verbose": return vscode_languageclient_1.Trace.Verbose;
    }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const cp = __webpack_require__(4);
const fs = __webpack_require__(5);
const client_1 = __webpack_require__(6);
const vscode_1 = __webpack_require__(2);
const vscode_languageserver_protocol_1 = __webpack_require__(7);
const colorProvider_1 = __webpack_require__(37);
const configuration_1 = __webpack_require__(38);
const implementation_1 = __webpack_require__(39);
const typeDefinition_1 = __webpack_require__(40);
const workspaceFolders_1 = __webpack_require__(41);
const Is = __webpack_require__(30);
const electron = __webpack_require__(42);
const processes_1 = __webpack_require__(43);
__export(__webpack_require__(6));
var Executable;
(function (Executable) {
    function is(value) {
        return Is.string(value.command);
    }
    Executable.is = is;
})(Executable || (Executable = {}));
var TransportKind;
(function (TransportKind) {
    TransportKind[TransportKind["stdio"] = 0] = "stdio";
    TransportKind[TransportKind["ipc"] = 1] = "ipc";
    TransportKind[TransportKind["pipe"] = 2] = "pipe";
    TransportKind[TransportKind["socket"] = 3] = "socket";
})(TransportKind = exports.TransportKind || (exports.TransportKind = {}));
var Transport;
(function (Transport) {
    function isSocket(value) {
        let candidate = value;
        return candidate && candidate.kind === TransportKind.socket && Is.number(candidate.port);
    }
    Transport.isSocket = isSocket;
})(Transport || (Transport = {}));
var NodeModule;
(function (NodeModule) {
    function is(value) {
        return Is.string(value.module);
    }
    NodeModule.is = is;
})(NodeModule || (NodeModule = {}));
var StreamInfo;
(function (StreamInfo) {
    function is(value) {
        let candidate = value;
        return candidate && candidate.writer !== void 0 && candidate.reader !== void 0;
    }
    StreamInfo.is = is;
})(StreamInfo || (StreamInfo = {}));
var ChildProcessInfo;
(function (ChildProcessInfo) {
    function is(value) {
        let candidate = value;
        return candidate && candidate.process !== void 0 && typeof candidate.detached === 'boolean';
    }
    ChildProcessInfo.is = is;
})(ChildProcessInfo || (ChildProcessInfo = {}));
class LanguageClient extends client_1.BaseLanguageClient {
    constructor(arg1, arg2, arg3, arg4, arg5) {
        let id;
        let name;
        let serverOptions;
        let clientOptions;
        let forceDebug;
        if (Is.string(arg2)) {
            id = arg1;
            name = arg2;
            serverOptions = arg3;
            clientOptions = arg4;
            forceDebug = !!arg5;
        }
        else {
            id = arg1.toLowerCase();
            name = arg1;
            serverOptions = arg2;
            clientOptions = arg3;
            forceDebug = arg4;
        }
        if (forceDebug === void 0) {
            forceDebug = false;
        }
        super(id, name, clientOptions);
        this._serverOptions = serverOptions;
        this._forceDebug = forceDebug;
    }
    stop() {
        return super.stop().then(() => {
            if (this._serverProcess) {
                let toCheck = this._serverProcess;
                this._serverProcess = undefined;
                if (this._isDetached === void 0 || !this._isDetached) {
                    this.checkProcessDied(toCheck);
                }
                this._isDetached = undefined;
            }
        });
    }
    checkProcessDied(childProcess) {
        if (!childProcess) {
            return;
        }
        setTimeout(() => {
            // Test if the process is still alive. Throws an exception if not
            try {
                process.kill(childProcess.pid, 0);
                processes_1.terminate(childProcess);
            }
            catch (error) {
                // All is fine.
            }
        }, 2000);
    }
    handleConnectionClosed() {
        this._serverProcess = undefined;
        super.handleConnectionClosed();
    }
    createMessageTransports(encoding) {
        function getEnvironment(env) {
            if (!env) {
                return process.env;
            }
            let result = Object.create(null);
            Object.keys(process.env).forEach(key => result[key] = process.env[key]);
            Object.keys(env).forEach(key => result[key] = env[key]);
            return result;
        }
        function startedInDebugMode() {
            let args = process.execArgv;
            if (args) {
                return args.some((arg) => /^--debug=?/.test(arg) || /^--debug-brk=?/.test(arg) || /^--inspect=?/.test(arg) || /^--inspect-brk=?/.test(arg));
            }
            ;
            return false;
        }
        let server = this._serverOptions;
        // We got a function.
        if (Is.func(server)) {
            return server().then((result) => {
                if (client_1.MessageTransports.is(result)) {
                    this._isDetached = !!result.detached;
                    return result;
                }
                else if (StreamInfo.is(result)) {
                    this._isDetached = !!result.detached;
                    return { reader: new vscode_languageserver_protocol_1.StreamMessageReader(result.reader), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(result.writer) };
                }
                else {
                    let cp;
                    if (ChildProcessInfo.is(result)) {
                        cp = result.process;
                        this._isDetached = result.detached;
                    }
                    else {
                        cp = result;
                        this._isDetached = false;
                    }
                    cp.stderr.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                    return { reader: new vscode_languageserver_protocol_1.StreamMessageReader(cp.stdout), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(cp.stdin) };
                }
            });
        }
        let json;
        let runDebug = server;
        if (runDebug.run || runDebug.debug) {
            // We are under debugging. So use debug as well.
            if (typeof v8debug === 'object' || this._forceDebug || startedInDebugMode()) {
                json = runDebug.debug;
            }
            else {
                json = runDebug.run;
            }
        }
        else {
            json = server;
        }
        return this._getServerWorkingDir(json.options).then(serverWorkingDir => {
            if (NodeModule.is(json) && json.module) {
                let node = json;
                let transport = node.transport || TransportKind.stdio;
                if (node.runtime) {
                    let args = [];
                    let options = node.options || Object.create(null);
                    if (options.execArgv) {
                        options.execArgv.forEach(element => args.push(element));
                    }
                    args.push(node.module);
                    if (node.args) {
                        node.args.forEach(element => args.push(element));
                    }
                    let execOptions = Object.create(null);
                    execOptions.cwd = serverWorkingDir;
                    execOptions.env = getEnvironment(options.env);
                    let pipeName = undefined;
                    if (transport === TransportKind.ipc) {
                        // exec options not correctly typed in lib
                        execOptions.stdio = [null, null, null, 'ipc'];
                        args.push('--node-ipc');
                    }
                    else if (transport === TransportKind.stdio) {
                        args.push('--stdio');
                    }
                    else if (transport === TransportKind.pipe) {
                        pipeName = vscode_languageserver_protocol_1.generateRandomPipeName();
                        args.push(`--pipe=${pipeName}`);
                    }
                    else if (Transport.isSocket(transport)) {
                        args.push(`--socket=${transport.port}`);
                    }
                    args.push(`--clientProcessId=${process.pid.toString()}`);
                    if (transport === TransportKind.ipc || transport === TransportKind.stdio) {
                        let serverProcess = cp.spawn(node.runtime, args, execOptions);
                        if (!serverProcess || !serverProcess.pid) {
                            return Promise.reject(`Launching server using runtime ${node.runtime} failed.`);
                        }
                        this._serverProcess = serverProcess;
                        serverProcess.stderr.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                        if (transport === TransportKind.ipc) {
                            serverProcess.stdout.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                            return Promise.resolve({ reader: new vscode_languageserver_protocol_1.IPCMessageReader(serverProcess), writer: new vscode_languageserver_protocol_1.IPCMessageWriter(serverProcess) });
                        }
                        else {
                            return Promise.resolve({ reader: new vscode_languageserver_protocol_1.StreamMessageReader(serverProcess.stdout), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(serverProcess.stdin) });
                        }
                    }
                    else if (transport == TransportKind.pipe) {
                        return vscode_languageserver_protocol_1.createClientPipeTransport(pipeName).then((transport) => {
                            let process = cp.spawn(node.runtime, args, execOptions);
                            if (!process || !process.pid) {
                                return Promise.reject(`Launching server using runtime ${node.runtime} failed.`);
                            }
                            this._serverProcess = process;
                            process.stderr.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                            process.stdout.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                            return transport.onConnected().then((protocol) => {
                                return { reader: protocol[0], writer: protocol[1] };
                            });
                        });
                    }
                    else if (Transport.isSocket(transport)) {
                        return vscode_languageserver_protocol_1.createClientSocketTransport(transport.port).then((transport) => {
                            let process = cp.spawn(node.runtime, args, execOptions);
                            if (!process || !process.pid) {
                                return Promise.reject(`Launching server using runtime ${node.runtime} failed.`);
                            }
                            this._serverProcess = process;
                            process.stderr.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                            process.stdout.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                            return transport.onConnected().then((protocol) => {
                                return { reader: protocol[0], writer: protocol[1] };
                            });
                        });
                    }
                }
                else {
                    let pipeName = undefined;
                    return new Promise((resolve, reject) => {
                        let args = node.args && node.args.slice() || [];
                        if (transport === TransportKind.ipc) {
                            args.push('--node-ipc');
                        }
                        else if (transport === TransportKind.stdio) {
                            args.push('--stdio');
                        }
                        else if (transport === TransportKind.pipe) {
                            pipeName = vscode_languageserver_protocol_1.generateRandomPipeName();
                            args.push(`--pipe=${pipeName}`);
                        }
                        else if (Transport.isSocket(transport)) {
                            args.push(`--socket=${transport.port}`);
                        }
                        args.push(`--clientProcessId=${process.pid.toString()}`);
                        let options = node.options || Object.create(null);
                        options.execArgv = options.execArgv || [];
                        options.cwd = serverWorkingDir;
                        if (transport === TransportKind.ipc || transport === TransportKind.stdio) {
                            electron.fork(node.module, args || [], options, (error, serverProcess) => {
                                if (error || !serverProcess) {
                                    reject(error);
                                }
                                else {
                                    this._serverProcess = serverProcess;
                                    serverProcess.stderr.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                                    if (transport === TransportKind.ipc) {
                                        serverProcess.stdout.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                                        resolve({ reader: new vscode_languageserver_protocol_1.IPCMessageReader(this._serverProcess), writer: new vscode_languageserver_protocol_1.IPCMessageWriter(this._serverProcess) });
                                    }
                                    else {
                                        resolve({ reader: new vscode_languageserver_protocol_1.StreamMessageReader(serverProcess.stdout), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(serverProcess.stdin) });
                                    }
                                }
                            });
                        }
                        else if (transport === TransportKind.pipe) {
                            vscode_languageserver_protocol_1.createClientPipeTransport(pipeName).then((transport) => {
                                electron.fork(node.module, args || [], options, (error, cp) => {
                                    if (error || !cp) {
                                        reject(error);
                                    }
                                    else {
                                        this._serverProcess = cp;
                                        cp.stderr.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                                        cp.stdout.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                                        transport.onConnected().then((protocol) => {
                                            resolve({ reader: protocol[0], writer: protocol[1] });
                                        });
                                    }
                                });
                            });
                        }
                        else if (Transport.isSocket(transport)) {
                            vscode_languageserver_protocol_1.createClientSocketTransport(transport.port).then((transport) => {
                                electron.fork(node.module, args || [], options, (error, cp) => {
                                    if (error || !cp) {
                                        reject(error);
                                    }
                                    else {
                                        this._serverProcess = cp;
                                        cp.stderr.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                                        cp.stdout.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                                        transport.onConnected().then((protocol) => {
                                            resolve({ reader: protocol[0], writer: protocol[1] });
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
            }
            else if (Executable.is(json) && json.command) {
                let command = json;
                let args = command.args || [];
                let options = command.options || Object.create(null);
                options.cwd = serverWorkingDir;
                let serverProcess = cp.spawn(command.command, args, options);
                if (!serverProcess || !serverProcess.pid) {
                    return Promise.reject(`Launching server using command ${command.command} failed.`);
                }
                serverProcess.stderr.on('data', data => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                this._serverProcess = serverProcess;
                this._isDetached = !!options.detached;
                return Promise.resolve({ reader: new vscode_languageserver_protocol_1.StreamMessageReader(serverProcess.stdout), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(serverProcess.stdin) });
            }
            return Promise.reject(new Error(`Unsupported server configuration ` + JSON.stringify(server, null, 4)));
        });
    }
    registerProposedFeatures() {
        this.registerFeatures(ProposedFeatures.createAll(this));
    }
    registerBuiltinFeatures() {
        super.registerBuiltinFeatures();
        this.registerFeature(new configuration_1.ConfigurationFeature(this));
        this.registerFeature(new typeDefinition_1.TypeDefinitionFeature(this));
        this.registerFeature(new implementation_1.ImplementationFeature(this));
        this.registerFeature(new colorProvider_1.ColorProviderFeature(this));
        this.registerFeature(new workspaceFolders_1.WorkspaceFoldersFeature(this));
    }
    _mainGetRootPath() {
        let folders = vscode_1.workspace.workspaceFolders;
        if (!folders || folders.length === 0) {
            return undefined;
        }
        let folder = folders[0];
        if (folder.uri.scheme === 'file') {
            return folder.uri.fsPath;
        }
        return undefined;
    }
    _getServerWorkingDir(options) {
        let cwd = options && options.cwd;
        if (!cwd) {
            cwd = this.clientOptions.workspaceFolder
                ? this.clientOptions.workspaceFolder.uri.fsPath
                : this._mainGetRootPath();
        }
        if (cwd) {
            // make sure the folder exists otherwise creating the process will fail
            return new Promise(s => {
                fs.lstat(cwd, (err, stats) => {
                    s(!err && stats.isDirectory() ? cwd : undefined);
                });
            });
        }
        return Promise.resolve(undefined);
    }
}
exports.LanguageClient = LanguageClient;
class SettingMonitor {
    constructor(_client, _setting) {
        this._client = _client;
        this._setting = _setting;
        this._listeners = [];
    }
    start() {
        vscode_1.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this._listeners);
        this.onDidChangeConfiguration();
        return new vscode_1.Disposable(() => {
            if (this._client.needsStop()) {
                this._client.stop();
            }
        });
    }
    onDidChangeConfiguration() {
        let index = this._setting.indexOf('.');
        let primary = index >= 0 ? this._setting.substr(0, index) : this._setting;
        let rest = index >= 0 ? this._setting.substr(index + 1) : undefined;
        let enabled = rest ? vscode_1.workspace.getConfiguration(primary).get(rest, false) : vscode_1.workspace.getConfiguration(primary);
        if (enabled && this._client.needsStart()) {
            this._client.start();
        }
        else if (!enabled && this._client.needsStop()) {
            this._client.stop();
        }
    }
}
exports.SettingMonitor = SettingMonitor;
// Exporting proposed protocol.
var ProposedFeatures;
(function (ProposedFeatures) {
    function createAll(_client) {
        let result = [];
        return result;
    }
    ProposedFeatures.createAll = createAll;
})(ProposedFeatures = exports.ProposedFeatures || (exports.ProposedFeatures = {}));


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(2);
const vscode_languageserver_protocol_1 = __webpack_require__(7);
const c2p = __webpack_require__(29);
const p2c = __webpack_require__(34);
const Is = __webpack_require__(30);
const async_1 = __webpack_require__(35);
const UUID = __webpack_require__(36);
__export(__webpack_require__(7));
class ConsoleLogger {
    error(message) {
        console.error(message);
    }
    warn(message) {
        console.warn(message);
    }
    info(message) {
        console.info(message);
    }
    log(message) {
        console.log(message);
    }
}
function createConnection(input, output, errorHandler, closeHandler) {
    let logger = new ConsoleLogger();
    let connection = vscode_languageserver_protocol_1.createProtocolConnection(input, output, logger);
    connection.onError((data) => { errorHandler(data[0], data[1], data[2]); });
    connection.onClose(closeHandler);
    let result = {
        listen: () => connection.listen(),
        sendRequest: (type, ...params) => connection.sendRequest(Is.string(type) ? type : type.method, ...params),
        onRequest: (type, handler) => connection.onRequest(Is.string(type) ? type : type.method, handler),
        sendNotification: (type, params) => connection.sendNotification(Is.string(type) ? type : type.method, params),
        onNotification: (type, handler) => connection.onNotification(Is.string(type) ? type : type.method, handler),
        trace: (value, tracer, sendNotification = false) => connection.trace(value, tracer, sendNotification),
        initialize: (params) => connection.sendRequest(vscode_languageserver_protocol_1.InitializeRequest.type, params),
        shutdown: () => connection.sendRequest(vscode_languageserver_protocol_1.ShutdownRequest.type, undefined),
        exit: () => connection.sendNotification(vscode_languageserver_protocol_1.ExitNotification.type),
        onLogMessage: (handler) => connection.onNotification(vscode_languageserver_protocol_1.LogMessageNotification.type, handler),
        onShowMessage: (handler) => connection.onNotification(vscode_languageserver_protocol_1.ShowMessageNotification.type, handler),
        onTelemetry: (handler) => connection.onNotification(vscode_languageserver_protocol_1.TelemetryEventNotification.type, handler),
        didChangeConfiguration: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, params),
        didChangeWatchedFiles: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type, params),
        didOpenTextDocument: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type, params),
        didChangeTextDocument: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, params),
        didCloseTextDocument: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type, params),
        didSaveTextDocument: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type, params),
        onDiagnostics: (handler) => connection.onNotification(vscode_languageserver_protocol_1.PublishDiagnosticsNotification.type, handler),
        dispose: () => connection.dispose()
    };
    return result;
}
var TransportKind;
(function (TransportKind) {
    TransportKind[TransportKind["stdio"] = 0] = "stdio";
    TransportKind[TransportKind["ipc"] = 1] = "ipc";
    TransportKind[TransportKind["pipe"] = 2] = "pipe";
})(TransportKind = exports.TransportKind || (exports.TransportKind = {}));
/**
 * An action to be performed when the connection is producing errors.
 */
var ErrorAction;
(function (ErrorAction) {
    /**
     * Continue running the server.
     */
    ErrorAction[ErrorAction["Continue"] = 1] = "Continue";
    /**
     * Shutdown the server.
     */
    ErrorAction[ErrorAction["Shutdown"] = 2] = "Shutdown";
})(ErrorAction = exports.ErrorAction || (exports.ErrorAction = {}));
/**
 * An action to be performed when the connection to a server got closed.
 */
var CloseAction;
(function (CloseAction) {
    /**
     * Don't restart the server. The connection stays closed.
     */
    CloseAction[CloseAction["DoNotRestart"] = 1] = "DoNotRestart";
    /**
     * Restart the server.
     */
    CloseAction[CloseAction["Restart"] = 2] = "Restart";
})(CloseAction = exports.CloseAction || (exports.CloseAction = {}));
class DefaultErrorHandler {
    constructor(name) {
        this.name = name;
        this.restarts = [];
    }
    error(_error, _message, count) {
        if (count && count <= 3) {
            return ErrorAction.Continue;
        }
        return ErrorAction.Shutdown;
    }
    closed() {
        this.restarts.push(Date.now());
        if (this.restarts.length < 5) {
            return CloseAction.Restart;
        }
        else {
            let diff = this.restarts[this.restarts.length - 1] - this.restarts[0];
            if (diff <= 3 * 60 * 1000) {
                vscode_1.window.showErrorMessage(`The ${this.name} server crashed 5 times in the last 3 minutes. The server will not be restarted.`);
                return CloseAction.DoNotRestart;
            }
            else {
                this.restarts.shift();
                return CloseAction.Restart;
            }
        }
    }
}
var RevealOutputChannelOn;
(function (RevealOutputChannelOn) {
    RevealOutputChannelOn[RevealOutputChannelOn["Info"] = 1] = "Info";
    RevealOutputChannelOn[RevealOutputChannelOn["Warn"] = 2] = "Warn";
    RevealOutputChannelOn[RevealOutputChannelOn["Error"] = 3] = "Error";
    RevealOutputChannelOn[RevealOutputChannelOn["Never"] = 4] = "Never";
})(RevealOutputChannelOn = exports.RevealOutputChannelOn || (exports.RevealOutputChannelOn = {}));
var State;
(function (State) {
    State[State["Stopped"] = 1] = "Stopped";
    State[State["Running"] = 2] = "Running";
})(State = exports.State || (exports.State = {}));
var ClientState;
(function (ClientState) {
    ClientState[ClientState["Initial"] = 0] = "Initial";
    ClientState[ClientState["Starting"] = 1] = "Starting";
    ClientState[ClientState["StartFailed"] = 2] = "StartFailed";
    ClientState[ClientState["Running"] = 3] = "Running";
    ClientState[ClientState["Stopping"] = 4] = "Stopping";
    ClientState[ClientState["Stopped"] = 5] = "Stopped";
})(ClientState || (ClientState = {}));
const SupporedSymbolKinds = [
    vscode_languageserver_protocol_1.SymbolKind.File,
    vscode_languageserver_protocol_1.SymbolKind.Module,
    vscode_languageserver_protocol_1.SymbolKind.Namespace,
    vscode_languageserver_protocol_1.SymbolKind.Package,
    vscode_languageserver_protocol_1.SymbolKind.Class,
    vscode_languageserver_protocol_1.SymbolKind.Method,
    vscode_languageserver_protocol_1.SymbolKind.Property,
    vscode_languageserver_protocol_1.SymbolKind.Field,
    vscode_languageserver_protocol_1.SymbolKind.Constructor,
    vscode_languageserver_protocol_1.SymbolKind.Enum,
    vscode_languageserver_protocol_1.SymbolKind.Interface,
    vscode_languageserver_protocol_1.SymbolKind.Function,
    vscode_languageserver_protocol_1.SymbolKind.Variable,
    vscode_languageserver_protocol_1.SymbolKind.Constant,
    vscode_languageserver_protocol_1.SymbolKind.String,
    vscode_languageserver_protocol_1.SymbolKind.Number,
    vscode_languageserver_protocol_1.SymbolKind.Boolean,
    vscode_languageserver_protocol_1.SymbolKind.Array,
    vscode_languageserver_protocol_1.SymbolKind.Object,
    vscode_languageserver_protocol_1.SymbolKind.Key,
    vscode_languageserver_protocol_1.SymbolKind.Null,
    vscode_languageserver_protocol_1.SymbolKind.EnumMember,
    vscode_languageserver_protocol_1.SymbolKind.Struct,
    vscode_languageserver_protocol_1.SymbolKind.Event,
    vscode_languageserver_protocol_1.SymbolKind.Operator,
    vscode_languageserver_protocol_1.SymbolKind.TypeParameter
];
const SupportedCompletionItemKinds = [
    vscode_languageserver_protocol_1.CompletionItemKind.Text,
    vscode_languageserver_protocol_1.CompletionItemKind.Method,
    vscode_languageserver_protocol_1.CompletionItemKind.Function,
    vscode_languageserver_protocol_1.CompletionItemKind.Constructor,
    vscode_languageserver_protocol_1.CompletionItemKind.Field,
    vscode_languageserver_protocol_1.CompletionItemKind.Variable,
    vscode_languageserver_protocol_1.CompletionItemKind.Class,
    vscode_languageserver_protocol_1.CompletionItemKind.Interface,
    vscode_languageserver_protocol_1.CompletionItemKind.Module,
    vscode_languageserver_protocol_1.CompletionItemKind.Property,
    vscode_languageserver_protocol_1.CompletionItemKind.Unit,
    vscode_languageserver_protocol_1.CompletionItemKind.Value,
    vscode_languageserver_protocol_1.CompletionItemKind.Enum,
    vscode_languageserver_protocol_1.CompletionItemKind.Keyword,
    vscode_languageserver_protocol_1.CompletionItemKind.Snippet,
    vscode_languageserver_protocol_1.CompletionItemKind.Color,
    vscode_languageserver_protocol_1.CompletionItemKind.File,
    vscode_languageserver_protocol_1.CompletionItemKind.Reference,
    vscode_languageserver_protocol_1.CompletionItemKind.Folder,
    vscode_languageserver_protocol_1.CompletionItemKind.EnumMember,
    vscode_languageserver_protocol_1.CompletionItemKind.Constant,
    vscode_languageserver_protocol_1.CompletionItemKind.Struct,
    vscode_languageserver_protocol_1.CompletionItemKind.Event,
    vscode_languageserver_protocol_1.CompletionItemKind.Operator,
    vscode_languageserver_protocol_1.CompletionItemKind.TypeParameter
];
function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
var DynamicFeature;
(function (DynamicFeature) {
    function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.register) && Is.func(candidate.unregister) && Is.func(candidate.dispose) && candidate.messages !== void 0;
    }
    DynamicFeature.is = is;
})(DynamicFeature || (DynamicFeature = {}));
class DocumentNotifiactions {
    constructor(_client, _event, _type, _middleware, _createParams, _selectorFilter) {
        this._client = _client;
        this._event = _event;
        this._type = _type;
        this._middleware = _middleware;
        this._createParams = _createParams;
        this._selectorFilter = _selectorFilter;
        this._selectors = new Map();
    }
    static textDocumentFilter(selectors, textDocument) {
        for (const selector of selectors) {
            if (vscode_1.languages.match(selector, textDocument)) {
                return true;
            }
        }
        return false;
    }
    register(_message, data) {
        if (!data.registerOptions.documentSelector) {
            return;
        }
        if (!this._listener) {
            this._listener = this._event(this.callback, this);
        }
        this._selectors.set(data.id, data.registerOptions.documentSelector);
    }
    callback(data) {
        if (!this._selectorFilter || this._selectorFilter(this._selectors.values(), data)) {
            if (this._middleware) {
                this._middleware(data, (data) => this._client.sendNotification(this._type, this._createParams(data)));
            }
            else {
                this._client.sendNotification(this._type, this._createParams(data));
            }
            this.notificationSent(data);
        }
    }
    notificationSent(_data) {
    }
    unregister(id) {
        this._selectors.delete(id);
        if (this._selectors.size === 0 && this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    dispose() {
        this._selectors.clear();
        if (this._listener) {
            this._listener.dispose();
        }
    }
}
class DidOpenTextDocumentFeature extends DocumentNotifiactions {
    constructor(client, _syncedDocuments) {
        super(client, vscode_1.workspace.onDidOpenTextDocument, vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type, client.clientOptions.middleware.didOpen, (textDocument) => client.code2ProtocolConverter.asOpenTextDocumentParams(textDocument), DocumentNotifiactions.textDocumentFilter);
        this._syncedDocuments = _syncedDocuments;
    }
    get messages() {
        return vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'synchronization').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.openClose) {
            this.register(this.messages, { id: UUID.generateUuid(), registerOptions: { documentSelector: documentSelector } });
        }
    }
    register(message, data) {
        super.register(message, data);
        if (!data.registerOptions.documentSelector) {
            return;
        }
        let documentSelector = data.registerOptions.documentSelector;
        vscode_1.workspace.textDocuments.forEach((textDocument) => {
            let uri = textDocument.uri.toString();
            if (this._syncedDocuments.has(uri)) {
                return;
            }
            if (vscode_1.languages.match(documentSelector, textDocument)) {
                let middleware = this._client.clientOptions.middleware;
                let didOpen = (textDocument) => {
                    this._client.sendNotification(this._type, this._createParams(textDocument));
                };
                if (middleware.didOpen) {
                    middleware.didOpen(textDocument, didOpen);
                }
                else {
                    didOpen(textDocument);
                }
                this._syncedDocuments.set(uri, textDocument);
            }
        });
    }
    notificationSent(textDocument) {
        super.notificationSent(textDocument);
        this._syncedDocuments.set(textDocument.uri.toString(), textDocument);
    }
}
class DidCloseTextDocumentFeature extends DocumentNotifiactions {
    constructor(client, _syncedDocuments) {
        super(client, vscode_1.workspace.onDidCloseTextDocument, vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type, client.clientOptions.middleware.didClose, (textDocument) => client.code2ProtocolConverter.asCloseTextDocumentParams(textDocument), DocumentNotifiactions.textDocumentFilter);
        this._syncedDocuments = _syncedDocuments;
    }
    get messages() {
        return vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'synchronization').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.openClose) {
            this.register(this.messages, { id: UUID.generateUuid(), registerOptions: { documentSelector: documentSelector } });
        }
    }
    notificationSent(textDocument) {
        super.notificationSent(textDocument);
        this._syncedDocuments.delete(textDocument.uri.toString());
    }
    unregister(id) {
        let selector = this._selectors.get(id);
        // The super call removed the selector from the map
        // of selectors.
        super.unregister(id);
        let selectors = this._selectors.values();
        this._syncedDocuments.forEach((textDocument) => {
            if (vscode_1.languages.match(selector, textDocument) && !this._selectorFilter(selectors, textDocument)) {
                let middleware = this._client.clientOptions.middleware;
                let didClose = (textDocument) => {
                    this._client.sendNotification(this._type, this._createParams(textDocument));
                };
                this._syncedDocuments.delete(textDocument.uri.toString());
                if (middleware.didClose) {
                    middleware.didClose(textDocument, didClose);
                }
                else {
                    didClose(textDocument);
                }
            }
        });
    }
}
class DidChangeTextDocumentFeature {
    constructor(_client) {
        this._client = _client;
        this._changeData = new Map();
        this._forcingDelivery = false;
    }
    get messages() {
        return vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'synchronization').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.change !== void 0 && textDocumentSyncOptions.change !== vscode_languageserver_protocol_1.TextDocumentSyncKind.None) {
            this.register(this.messages, {
                id: UUID.generateUuid(),
                registerOptions: Object.assign({}, { documentSelector: documentSelector }, { syncKind: textDocumentSyncOptions.change })
            });
        }
    }
    register(_message, data) {
        if (!data.registerOptions.documentSelector) {
            return;
        }
        if (!this._listener) {
            this._listener = vscode_1.workspace.onDidChangeTextDocument(this.callback, this);
        }
        this._changeData.set(data.id, {
            documentSelector: data.registerOptions.documentSelector,
            syncKind: data.registerOptions.syncKind
        });
    }
    callback(event) {
        // Text document changes are send for dirty changes as well. We don't
        // have dirty / undirty events in the LSP so we ignore content changes
        // with length zero.
        if (event.contentChanges.length === 0) {
            return;
        }
        for (const changeData of this._changeData.values()) {
            if (vscode_1.languages.match(changeData.documentSelector, event.document)) {
                let middleware = this._client.clientOptions.middleware;
                if (changeData.syncKind === vscode_languageserver_protocol_1.TextDocumentSyncKind.Incremental) {
                    let params = this._client.code2ProtocolConverter.asChangeTextDocumentParams(event);
                    if (middleware.didChange) {
                        middleware.didChange(event, () => this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, params));
                    }
                    else {
                        this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, params);
                    }
                }
                else if (changeData.syncKind === vscode_languageserver_protocol_1.TextDocumentSyncKind.Full) {
                    let didChange = (event) => {
                        if (this._changeDelayer) {
                            if (this._changeDelayer.uri !== event.document.uri.toString()) {
                                // Use this force delivery to track boolean state. Otherwise we might call two times.
                                this.forceDelivery();
                                this._changeDelayer.uri = event.document.uri.toString();
                            }
                            this._changeDelayer.delayer.trigger(() => {
                                this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, this._client.code2ProtocolConverter.asChangeTextDocumentParams(event.document));
                            });
                        }
                        else {
                            this._changeDelayer = {
                                uri: event.document.uri.toString(),
                                delayer: new async_1.Delayer(200)
                            };
                            this._changeDelayer.delayer.trigger(() => {
                                this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, this._client.code2ProtocolConverter.asChangeTextDocumentParams(event.document));
                            }, -1);
                        }
                    };
                    if (middleware.didChange) {
                        middleware.didChange(event, didChange);
                    }
                    else {
                        didChange(event);
                    }
                }
            }
        }
    }
    unregister(id) {
        this._changeData.delete(id);
        if (this._changeData.size === 0 && this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    dispose() {
        this._changeDelayer = undefined;
        this._forcingDelivery = false;
        this._changeData.clear();
        if (this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    forceDelivery() {
        if (this._forcingDelivery || !this._changeDelayer) {
            return;
        }
        try {
            this._forcingDelivery = true;
            this._changeDelayer.delayer.forceDelivery();
        }
        finally {
            this._forcingDelivery = false;
        }
    }
}
class WillSaveFeature extends DocumentNotifiactions {
    constructor(client) {
        super(client, vscode_1.workspace.onWillSaveTextDocument, vscode_languageserver_protocol_1.WillSaveTextDocumentNotification.type, client.clientOptions.middleware.willSave, (willSaveEvent) => client.code2ProtocolConverter.asWillSaveTextDocumentParams(willSaveEvent), (selectors, willSaveEvent) => DocumentNotifiactions.textDocumentFilter(selectors, willSaveEvent.document));
    }
    get messages() {
        return vscode_languageserver_protocol_1.WillSaveTextDocumentNotification.type;
    }
    fillClientCapabilities(capabilities) {
        let value = ensure(ensure(capabilities, 'textDocument'), 'synchronization');
        value.willSave = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.willSave) {
            this.register(this.messages, {
                id: UUID.generateUuid(),
                registerOptions: { documentSelector: documentSelector }
            });
        }
    }
}
class WillSaveWaitUntilFeature {
    constructor(_client) {
        this._client = _client;
        this._selectors = new Map();
    }
    get messages() {
        return vscode_languageserver_protocol_1.WillSaveTextDocumentWaitUntilRequest.type;
    }
    fillClientCapabilities(capabilities) {
        let value = ensure(ensure(capabilities, 'textDocument'), 'synchronization');
        value.willSaveWaitUntil = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.willSaveWaitUntil) {
            this.register(this.messages, {
                id: UUID.generateUuid(),
                registerOptions: { documentSelector: documentSelector }
            });
        }
    }
    register(_message, data) {
        if (!data.registerOptions.documentSelector) {
            return;
        }
        if (!this._listener) {
            this._listener = vscode_1.workspace.onWillSaveTextDocument(this.callback, this);
        }
        this._selectors.set(data.id, data.registerOptions.documentSelector);
    }
    callback(event) {
        if (DocumentNotifiactions.textDocumentFilter(this._selectors.values(), event.document)) {
            let middleware = this._client.clientOptions.middleware;
            let willSaveWaitUntil = (event) => {
                return this._client.sendRequest(vscode_languageserver_protocol_1.WillSaveTextDocumentWaitUntilRequest.type, this._client.code2ProtocolConverter.asWillSaveTextDocumentParams(event)).then((edits) => {
                    let vEdits = this._client.protocol2CodeConverter.asTextEdits(edits);
                    return vEdits === void 0 ? [] : vEdits;
                });
            };
            event.waitUntil(middleware.willSaveWaitUntil
                ? middleware.willSaveWaitUntil(event, willSaveWaitUntil)
                : willSaveWaitUntil(event));
        }
    }
    unregister(id) {
        this._selectors.delete(id);
        if (this._selectors.size === 0 && this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    dispose() {
        this._selectors.clear();
        if (this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
}
class DidSaveTextDocumentFeature extends DocumentNotifiactions {
    constructor(client) {
        super(client, vscode_1.workspace.onDidSaveTextDocument, vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type, client.clientOptions.middleware.didSave, (textDocument) => client.code2ProtocolConverter.asSaveTextDocumentParams(textDocument, this._includeText), DocumentNotifiactions.textDocumentFilter);
    }
    get messages() {
        return vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'synchronization').didSave = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.save) {
            this.register(this.messages, {
                id: UUID.generateUuid(),
                registerOptions: Object.assign({}, { documentSelector: documentSelector }, { includeText: !!textDocumentSyncOptions.save.includeText })
            });
        }
    }
    register(method, data) {
        this._includeText = !!data.registerOptions.includeText;
        super.register(method, data);
    }
}
class FileSystemWatcherFeature {
    constructor(_client, _notifyFileEvent) {
        this._client = _client;
        this._notifyFileEvent = _notifyFileEvent;
        this._watchers = new Map();
    }
    get messages() {
        return vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'workspace'), 'didChangeWatchedFiles').dynamicRegistration = true;
    }
    initialize(_capabilities, _documentSelector) {
    }
    register(_method, data) {
        if (!Array.isArray(data.registerOptions.watchers)) {
            return;
        }
        let disposeables = [];
        for (let watcher of data.registerOptions.watchers) {
            if (!Is.string(watcher.globPattern)) {
                continue;
            }
            let watchCreate = true, watchChange = true, watchDelete = true;
            if (watcher.kind !== void 0 && watcher.kind !== null) {
                watchCreate = (watcher.kind & vscode_languageserver_protocol_1.WatchKind.Create) !== 0;
                watchChange = (watcher.kind & vscode_languageserver_protocol_1.WatchKind.Change) != 0;
                watchDelete = (watcher.kind & vscode_languageserver_protocol_1.WatchKind.Delete) != 0;
            }
            let fileSystemWatcher = vscode_1.workspace.createFileSystemWatcher(watcher.globPattern, !watchCreate, !watchChange, !watchDelete);
            this.hookListeners(fileSystemWatcher, watchCreate, watchChange, watchDelete);
            disposeables.push(fileSystemWatcher);
        }
        this._watchers.set(data.id, disposeables);
    }
    registerRaw(id, fileSystemWatchers) {
        let disposeables = [];
        for (let fileSystemWatcher of fileSystemWatchers) {
            this.hookListeners(fileSystemWatcher, true, true, true, disposeables);
        }
        this._watchers.set(id, disposeables);
    }
    hookListeners(fileSystemWatcher, watchCreate, watchChange, watchDelete, listeners) {
        if (watchCreate) {
            fileSystemWatcher.onDidCreate((resource) => this._notifyFileEvent({
                uri: this._client.code2ProtocolConverter.asUri(resource),
                type: vscode_languageserver_protocol_1.FileChangeType.Created
            }), null, listeners);
        }
        if (watchChange) {
            fileSystemWatcher.onDidChange((resource) => this._notifyFileEvent({
                uri: this._client.code2ProtocolConverter.asUri(resource),
                type: vscode_languageserver_protocol_1.FileChangeType.Changed
            }), null, listeners);
        }
        if (watchDelete) {
            fileSystemWatcher.onDidDelete((resource) => this._notifyFileEvent({
                uri: this._client.code2ProtocolConverter.asUri(resource),
                type: vscode_languageserver_protocol_1.FileChangeType.Deleted
            }), null, listeners);
        }
    }
    unregister(id) {
        let disposeables = this._watchers.get(id);
        if (disposeables) {
            for (let disposable of disposeables) {
                disposable.dispose();
            }
        }
    }
    dispose() {
        this._watchers.forEach((disposeables) => {
            for (let disposable of disposeables) {
                disposable.dispose();
            }
        });
        this._watchers.clear();
    }
}
class TextDocumentFeature {
    constructor(_client, _message) {
        this._client = _client;
        this._message = _message;
        this._providers = new Map();
    }
    get messages() {
        return this._message;
    }
    register(message, data) {
        if (message.method !== this.messages.method) {
            throw new Error(`Register called on wrong feature. Requested ${message.method} but reached feature ${this.messages.method}`);
        }
        if (!data.registerOptions.documentSelector) {
            return;
        }
        let provider = this.registerLanguageProvider(data.registerOptions);
        if (provider) {
            this._providers.set(data.id, provider);
        }
    }
    unregister(id) {
        let provider = this._providers.get(id);
        if (provider) {
            provider.dispose();
        }
    }
    dispose() {
        this._providers.forEach((value) => {
            value.dispose();
        });
        this._providers.clear();
    }
}
exports.TextDocumentFeature = TextDocumentFeature;
class WorkspaceFeature {
    constructor(_client, _message) {
        this._client = _client;
        this._message = _message;
        this._providers = new Map();
    }
    get messages() {
        return this._message;
    }
    register(message, data) {
        if (message.method !== this.messages.method) {
            throw new Error(`Register called on wron feature. Requested ${message.method} but reached feature ${this.messages.method}`);
        }
        let provider = this.registerLanguageProvider(data.registerOptions);
        if (provider) {
            this._providers.set(data.id, provider);
        }
    }
    unregister(id) {
        let provider = this._providers.get(id);
        if (provider) {
            provider.dispose();
        }
    }
    dispose() {
        this._providers.forEach((value) => {
            value.dispose();
        });
        this._providers.clear();
    }
}
class CompletionItemFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.CompletionRequest.type);
    }
    fillClientCapabilities(capabilites) {
        let completion = ensure(ensure(capabilites, 'textDocument'), 'completion');
        completion.dynamicRegistration = true;
        completion.contextSupport = true;
        completion.completionItem = { snippetSupport: true, commitCharactersSupport: true, documentationFormat: [vscode_languageserver_protocol_1.MarkupKind.Markdown, vscode_languageserver_protocol_1.MarkupKind.PlainText], deprecatedSupport: true };
        completion.completionItemKind = { valueSet: SupportedCompletionItemKinds };
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.completionProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector }, capabilities.completionProvider)
        });
    }
    registerLanguageProvider(options) {
        let triggerCharacters = options.triggerCharacters || [];
        let client = this._client;
        let provideCompletionItems = (document, position, context, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.CompletionRequest.type, client.code2ProtocolConverter.asCompletionParams(document, position, context), token).then(client.protocol2CodeConverter.asCompletionResult, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.CompletionRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let resolveCompletionItem = (item, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, client.code2ProtocolConverter.asCompletionItem(item), token).then(client.protocol2CodeConverter.asCompletionItem, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, error);
                return Promise.resolve(item);
            });
        };
        let middleware = this._client.clientOptions.middleware;
        return vscode_1.languages.registerCompletionItemProvider(options.documentSelector, {
            provideCompletionItems: (document, position, token, context) => {
                return middleware.provideCompletionItem
                    ? middleware.provideCompletionItem(document, position, context, token, provideCompletionItems)
                    : provideCompletionItems(document, position, context, token);
            },
            resolveCompletionItem: options.resolveProvider
                ? (item, token) => {
                    return middleware.resolveCompletionItem
                        ? middleware.resolveCompletionItem(item, token, resolveCompletionItem)
                        : resolveCompletionItem(item, token);
                }
                : undefined
        }, ...triggerCharacters);
    }
}
class HoverFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.HoverRequest.type);
    }
    fillClientCapabilities(capabilites) {
        const hoverCapability = (ensure(ensure(capabilites, 'textDocument'), 'hover'));
        hoverCapability.dynamicRegistration = true;
        hoverCapability.contentFormat = [vscode_languageserver_protocol_1.MarkupKind.Markdown, vscode_languageserver_protocol_1.MarkupKind.PlainText];
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.hoverProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector })
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideHover = (document, position, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.HoverRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asHover, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.HoverRequest.type, error);
                return Promise.resolve(null);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerHoverProvider(options.documentSelector, {
            provideHover: (document, position, token) => {
                return middleware.provideHover
                    ? middleware.provideHover(document, position, token, provideHover)
                    : provideHover(document, position, token);
            }
        });
    }
}
class SignatureHelpFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.SignatureHelpRequest.type);
    }
    fillClientCapabilities(capabilites) {
        let config = ensure(ensure(capabilites, 'textDocument'), 'signatureHelp');
        config.dynamicRegistration = true;
        config.signatureInformation = { documentationFormat: [vscode_languageserver_protocol_1.MarkupKind.Markdown, vscode_languageserver_protocol_1.MarkupKind.PlainText] };
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.signatureHelpProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector }, capabilities.signatureHelpProvider)
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let providerSignatureHelp = (document, position, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.SignatureHelpRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asSignatureHelp, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.SignatureHelpRequest.type, error);
                return Promise.resolve(null);
            });
        };
        let middleware = client.clientOptions.middleware;
        let triggerCharacters = options.triggerCharacters || [];
        return vscode_1.languages.registerSignatureHelpProvider(options.documentSelector, {
            provideSignatureHelp: (document, position, token) => {
                return middleware.provideSignatureHelp
                    ? middleware.provideSignatureHelp(document, position, token, providerSignatureHelp)
                    : providerSignatureHelp(document, position, token);
            }
        }, ...triggerCharacters);
    }
}
class DefinitionFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.DefinitionRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'definition').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.definitionProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector })
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideDefinition = (document, position, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.DefinitionRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDefinitionResult, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.DefinitionRequest.type, error);
                return Promise.resolve(null);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDefinitionProvider(options.documentSelector, {
            provideDefinition: (document, position, token) => {
                return middleware.provideDefinition
                    ? middleware.provideDefinition(document, position, token, provideDefinition)
                    : provideDefinition(document, position, token);
            }
        });
    }
}
class ReferencesFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.ReferencesRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'references').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.referencesProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector })
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let providerReferences = (document, position, options, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.ReferencesRequest.type, client.code2ProtocolConverter.asReferenceParams(document, position, options), token).then(client.protocol2CodeConverter.asReferences, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.ReferencesRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerReferenceProvider(options.documentSelector, {
            provideReferences: (document, position, options, token) => {
                return middleware.provideReferences
                    ? middleware.provideReferences(document, position, options, token, providerReferences)
                    : providerReferences(document, position, options, token);
            }
        });
    }
}
class DocumentHighlightFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentHighlightRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'documentHighlight').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.documentHighlightProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector })
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentHighlights = (document, position, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.DocumentHighlightRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDocumentHighlights, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.DocumentHighlightRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentHighlightProvider(options.documentSelector, {
            provideDocumentHighlights: (document, position, token) => {
                return middleware.provideDocumentHighlights
                    ? middleware.provideDocumentHighlights(document, position, token, provideDocumentHighlights)
                    : provideDocumentHighlights(document, position, token);
            }
        });
    }
}
class DocumentSymbolFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentSymbolRequest.type);
    }
    fillClientCapabilities(capabilites) {
        let symbolCapabilities = ensure(ensure(capabilites, 'textDocument'), 'documentSymbol');
        symbolCapabilities.dynamicRegistration = true;
        symbolCapabilities.symbolKind = {
            valueSet: SupporedSymbolKinds
        };
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.documentSymbolProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector })
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentSymbols = (document, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.DocumentSymbolRequest.type, client.code2ProtocolConverter.asDocumentSymbolParams(document), token).then(client.protocol2CodeConverter.asSymbolInformations, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.DocumentSymbolRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentSymbolProvider(options.documentSelector, {
            provideDocumentSymbols: (document, token) => {
                return middleware.provideDocumentSymbols
                    ? middleware.provideDocumentSymbols(document, token, provideDocumentSymbols)
                    : provideDocumentSymbols(document, token);
            }
        });
    }
}
class WorkspaceSymbolFeature extends WorkspaceFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type);
    }
    fillClientCapabilities(capabilites) {
        let symbolCapabilities = ensure(ensure(capabilites, 'workspace'), 'symbol');
        symbolCapabilities.dynamicRegistration = true;
        symbolCapabilities.symbolKind = {
            valueSet: SupporedSymbolKinds
        };
    }
    initialize(capabilities) {
        if (!capabilities.workspaceSymbolProvider) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: undefined
        });
    }
    registerLanguageProvider(_options) {
        let client = this._client;
        let provideWorkspaceSymbols = (query, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type, { query }, token).then(client.protocol2CodeConverter.asSymbolInformations, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerWorkspaceSymbolProvider({
            provideWorkspaceSymbols: (query, token) => {
                return middleware.provideWorkspaceSymbols
                    ? middleware.provideWorkspaceSymbols(query, token, provideWorkspaceSymbols)
                    : provideWorkspaceSymbols(query, token);
            }
        });
    }
}
class CodeActionFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.CodeActionRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'codeAction').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.codeActionProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector })
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideCodeActions = (document, range, context, token) => {
            let params = {
                textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                range: client.code2ProtocolConverter.asRange(range),
                context: client.code2ProtocolConverter.asCodeActionContext(context)
            };
            return client.sendRequest(vscode_languageserver_protocol_1.CodeActionRequest.type, params, token).then(client.protocol2CodeConverter.asCommands, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.CodeActionRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerCodeActionsProvider(options.documentSelector, {
            provideCodeActions: (document, range, context, token) => {
                return middleware.provideCodeActions
                    ? middleware.provideCodeActions(document, range, context, token, provideCodeActions)
                    : provideCodeActions(document, range, context, token);
            }
        });
    }
}
class CodeLensFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.CodeLensRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'codeLens').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.codeLensProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector }, capabilities.codeLensProvider)
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideCodeLenses = (document, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.CodeLensRequest.type, client.code2ProtocolConverter.asCodeLensParams(document), token).then(client.protocol2CodeConverter.asCodeLenses, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.CodeLensRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let resolveCodeLens = (codeLens, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.CodeLensResolveRequest.type, client.code2ProtocolConverter.asCodeLens(codeLens), token).then(client.protocol2CodeConverter.asCodeLens, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.CodeLensResolveRequest.type, error);
                return codeLens;
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerCodeLensProvider(options.documentSelector, {
            provideCodeLenses: (document, token) => {
                return middleware.provideCodeLenses
                    ? middleware.provideCodeLenses(document, token, provideCodeLenses)
                    : provideCodeLenses(document, token);
            },
            resolveCodeLens: (options.resolveProvider)
                ? (codeLens, token) => {
                    return middleware.resolveCodeLens
                        ? middleware.resolveCodeLens(codeLens, token, resolveCodeLens)
                        : resolveCodeLens(codeLens, token);
                }
                : undefined
        });
    }
}
class DocumentFormattingFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentFormattingRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'formatting').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.documentFormattingProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector })
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentFormattingEdits = (document, options, token) => {
            let params = {
                textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                options: client.code2ProtocolConverter.asFormattingOptions(options)
            };
            return client.sendRequest(vscode_languageserver_protocol_1.DocumentFormattingRequest.type, params, token).then(client.protocol2CodeConverter.asTextEdits, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.DocumentFormattingRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentFormattingEditProvider(options.documentSelector, {
            provideDocumentFormattingEdits: (document, options, token) => {
                return middleware.provideDocumentFormattingEdits
                    ? middleware.provideDocumentFormattingEdits(document, options, token, provideDocumentFormattingEdits)
                    : provideDocumentFormattingEdits(document, options, token);
            }
        });
    }
}
class DocumentRangeFormattingFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'rangeFormatting').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.documentRangeFormattingProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector })
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentRangeFormattingEdits = (document, range, options, token) => {
            let params = {
                textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                range: client.code2ProtocolConverter.asRange(range),
                options: client.code2ProtocolConverter.asFormattingOptions(options)
            };
            return client.sendRequest(vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type, params, token).then(client.protocol2CodeConverter.asTextEdits, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentRangeFormattingEditProvider(options.documentSelector, {
            provideDocumentRangeFormattingEdits: (document, range, options, token) => {
                return middleware.provideDocumentRangeFormattingEdits
                    ? middleware.provideDocumentRangeFormattingEdits(document, range, options, token, provideDocumentRangeFormattingEdits)
                    : provideDocumentRangeFormattingEdits(document, range, options, token);
            }
        });
    }
}
class DocumentOnTypeFormattingFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'onTypeFormatting').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.documentOnTypeFormattingProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector }, capabilities.documentOnTypeFormattingProvider)
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let moreTriggerCharacter = options.moreTriggerCharacter || [];
        let provideOnTypeFormattingEdits = (document, position, ch, options, token) => {
            let params = {
                textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                position: client.code2ProtocolConverter.asPosition(position),
                ch: ch,
                options: client.code2ProtocolConverter.asFormattingOptions(options)
            };
            return client.sendRequest(vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type, params, token).then(client.protocol2CodeConverter.asTextEdits, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type, error);
                return Promise.resolve([]);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerOnTypeFormattingEditProvider(options.documentSelector, {
            provideOnTypeFormattingEdits: (document, position, ch, options, token) => {
                return middleware.provideOnTypeFormattingEdits
                    ? middleware.provideOnTypeFormattingEdits(document, position, ch, options, token, provideOnTypeFormattingEdits)
                    : provideOnTypeFormattingEdits(document, position, ch, options, token);
            }
        }, options.firstTriggerCharacter, ...moreTriggerCharacter);
    }
}
class RenameFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.RenameRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'rename').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.renameProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector })
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideRenameEdits = (document, position, newName, token) => {
            let params = {
                textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                position: client.code2ProtocolConverter.asPosition(position),
                newName: newName
            };
            return client.sendRequest(vscode_languageserver_protocol_1.RenameRequest.type, params, token).then(client.protocol2CodeConverter.asWorkspaceEdit, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.RenameRequest.type, error);
                return Promise.reject(new Error(error.message));
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerRenameProvider(options.documentSelector, {
            provideRenameEdits: (document, position, newName, token) => {
                return middleware.provideRenameEdits
                    ? middleware.provideRenameEdits(document, position, newName, token, provideRenameEdits)
                    : provideRenameEdits(document, position, newName, token);
            }
        });
    }
}
class DocumentLinkFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentLinkRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'documentLink').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.documentLinkProvider || !documentSelector) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: documentSelector }, capabilities.documentLinkProvider)
        });
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentLinks = (document, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.DocumentLinkRequest.type, client.code2ProtocolConverter.asDocumentLinkParams(document), token).then(client.protocol2CodeConverter.asDocumentLinks, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.DocumentLinkRequest.type, error);
                Promise.resolve(new Error(error.message));
            });
        };
        let resolveDocumentLink = (link, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.DocumentLinkResolveRequest.type, client.code2ProtocolConverter.asDocumentLink(link), token).then(client.protocol2CodeConverter.asDocumentLink, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.DocumentLinkResolveRequest.type, error);
                Promise.resolve(new Error(error.message));
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentLinkProvider(options.documentSelector, {
            provideDocumentLinks: (document, token) => {
                return middleware.provideDocumentLinks
                    ? middleware.provideDocumentLinks(document, token, provideDocumentLinks)
                    : provideDocumentLinks(document, token);
            },
            resolveDocumentLink: options.resolveProvider
                ? (link, token) => {
                    return middleware.resolveDocumentLink
                        ? middleware.resolveDocumentLink(link, token, resolveDocumentLink)
                        : resolveDocumentLink(link, token);
                }
                : undefined
        });
    }
}
class ConfigurationFeature {
    constructor(_client) {
        this._client = _client;
        this._listeners = new Map();
    }
    get messages() {
        return vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'workspace'), 'didChangeConfiguration').dynamicRegistration = true;
    }
    initialize() {
        let section = this._client.clientOptions.synchronize.configurationSection;
        if (section !== void 0) {
            this.register(this.messages, {
                id: UUID.generateUuid(),
                registerOptions: {
                    section: section
                }
            });
        }
    }
    register(_message, data) {
        let disposable = vscode_1.workspace.onDidChangeConfiguration(() => {
            this.onDidChangeConfiguration(data.registerOptions.section);
        });
        this._listeners.set(data.id, disposable);
        if (data.registerOptions.section !== void 0) {
            this.onDidChangeConfiguration(data.registerOptions.section);
        }
    }
    unregister(id) {
        let disposable = this._listeners.get(id);
        if (disposable) {
            this._listeners.delete(id);
            disposable.dispose();
        }
    }
    dispose() {
        for (let disposable of this._listeners.values()) {
            disposable.dispose();
        }
        this._listeners.clear();
    }
    onDidChangeConfiguration(configurationSection) {
        let sections;
        if (Is.string(configurationSection)) {
            sections = [configurationSection];
        }
        else {
            sections = configurationSection;
        }
        let didChangeConfiguration = (sections) => {
            if (sections === void 0) {
                this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, { settings: null });
                return;
            }
            this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, { settings: this.extractSettingsInformation(sections) });
        };
        let middleware = this.getMiddleware();
        middleware
            ? middleware(sections, didChangeConfiguration)
            : didChangeConfiguration(sections);
    }
    extractSettingsInformation(keys) {
        function ensurePath(config, path) {
            let current = config;
            for (let i = 0; i < path.length - 1; i++) {
                let obj = current[path[i]];
                if (!obj) {
                    obj = Object.create(null);
                    current[path[i]] = obj;
                }
                current = obj;
            }
            return current;
        }
        let resource = this._client.clientOptions.workspaceFolder
            ? this._client.clientOptions.workspaceFolder.uri
            : undefined;
        let result = Object.create(null);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let index = key.indexOf('.');
            let config = null;
            if (index >= 0) {
                config = vscode_1.workspace.getConfiguration(key.substr(0, index), resource).get(key.substr(index + 1));
            }
            else {
                config = vscode_1.workspace.getConfiguration(key, resource);
            }
            if (config) {
                let path = keys[i].split('.');
                ensurePath(result, path)[path[path.length - 1]] = config;
            }
        }
        return result;
    }
    getMiddleware() {
        let middleware = this._client.clientOptions.middleware;
        if (middleware.workspace && middleware.workspace.didChangeConfiguration) {
            return middleware.workspace.didChangeConfiguration;
        }
        else {
            return undefined;
        }
    }
}
class ExecuteCommandFeature {
    constructor(_client) {
        this._client = _client;
        this._commands = new Map();
    }
    get messages() {
        return vscode_languageserver_protocol_1.ExecuteCommandRequest.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'workspace'), 'executeCommand').dynamicRegistration = true;
    }
    initialize(capabilities) {
        if (!capabilities.executeCommandProvider) {
            return;
        }
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, capabilities.executeCommandProvider)
        });
    }
    register(_message, data) {
        let client = this._client;
        if (data.registerOptions.commands) {
            let disposeables = [];
            for (const command of data.registerOptions.commands) {
                disposeables.push(vscode_1.commands.registerCommand(command, (...args) => {
                    let params = {
                        command,
                        arguments: args
                    };
                    return client.sendRequest(vscode_languageserver_protocol_1.ExecuteCommandRequest.type, params).then(undefined, (error) => {
                        client.logFailedRequest(vscode_languageserver_protocol_1.ExecuteCommandRequest.type, error);
                    });
                }));
            }
            this._commands.set(data.id, disposeables);
        }
    }
    unregister(id) {
        let disposeables = this._commands.get(id);
        if (disposeables) {
            disposeables.forEach(disposable => disposable.dispose());
        }
    }
    dispose() {
        this._commands.forEach((value) => {
            value.forEach(disposable => disposable.dispose());
        });
        this._commands.clear();
    }
}
var MessageTransports;
(function (MessageTransports) {
    function is(value) {
        let candidate = value;
        return candidate && vscode_languageserver_protocol_1.MessageReader.is(value.reader) && vscode_languageserver_protocol_1.MessageWriter.is(value.writer);
    }
    MessageTransports.is = is;
})(MessageTransports = exports.MessageTransports || (exports.MessageTransports = {}));
class BaseLanguageClient {
    constructor(id, name, clientOptions) {
        this._features = [];
        this._method2Message = new Map();
        this._dynamicFeatures = new Map();
        this._id = id;
        this._name = name;
        clientOptions = clientOptions || {};
        this._clientOptions = {
            documentSelector: clientOptions.documentSelector || [],
            synchronize: clientOptions.synchronize || {},
            diagnosticCollectionName: clientOptions.diagnosticCollectionName,
            outputChannelName: clientOptions.outputChannelName || this._name,
            revealOutputChannelOn: clientOptions.revealOutputChannelOn || RevealOutputChannelOn.Error,
            stdioEncoding: clientOptions.stdioEncoding || 'utf8',
            initializationOptions: clientOptions.initializationOptions,
            initializationFailedHandler: clientOptions.initializationFailedHandler,
            errorHandler: clientOptions.errorHandler || new DefaultErrorHandler(this._name),
            middleware: clientOptions.middleware || {},
            uriConverters: clientOptions.uriConverters,
            workspaceFolder: clientOptions.workspaceFolder
        };
        this._clientOptions.synchronize = this._clientOptions.synchronize || {};
        this.state = ClientState.Initial;
        this._connectionPromise = undefined;
        this._resolvedConnection = undefined;
        this._initializeResult = undefined;
        if (clientOptions.outputChannel) {
            this._outputChannel = clientOptions.outputChannel;
            this._disposeOutputChannel = false;
        }
        else {
            this._outputChannel = undefined;
            this._disposeOutputChannel = true;
        }
        this._listeners = undefined;
        this._providers = undefined;
        this._diagnostics = undefined;
        this._fileEvents = [];
        this._fileEventDelayer = new async_1.Delayer(250);
        this._onReady = new Promise((resolve, reject) => {
            this._onReadyCallbacks = { resolve, reject };
        });
        this._onStop = undefined;
        this._telemetryEmitter = new vscode_languageserver_protocol_1.Emitter();
        this._stateChangeEmitter = new vscode_languageserver_protocol_1.Emitter();
        this._tracer = {
            log: (message, data) => {
                this.logTrace(message, data);
            }
        };
        this._c2p = c2p.createConverter(clientOptions.uriConverters ? clientOptions.uriConverters.code2Protocol : undefined);
        this._p2c = p2c.createConverter(clientOptions.uriConverters ? clientOptions.uriConverters.protocol2Code : undefined);
        this._syncedDocuments = new Map();
        this.registerBuiltinFeatures();
    }
    get state() {
        return this._state;
    }
    set state(value) {
        let oldState = this.getPublicState();
        this._state = value;
        let newState = this.getPublicState();
        if (newState !== oldState) {
            this._stateChangeEmitter.fire({ oldState, newState });
        }
    }
    getPublicState() {
        if (this.state === ClientState.Running) {
            return State.Running;
        }
        else {
            return State.Stopped;
        }
    }
    get initializeResult() {
        return this._initializeResult;
    }
    sendRequest(type, ...params) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        this.forceDocumentSync();
        try {
            return this._resolvedConnection.sendRequest(type, ...params);
        }
        catch (error) {
            this.error(`Sending request ${Is.string(type) ? type : type.method} failed.`, error);
            throw error;
        }
    }
    onRequest(type, handler) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        try {
            this._resolvedConnection.onRequest(type, handler);
        }
        catch (error) {
            this.error(`Registering request handler ${Is.string(type) ? type : type.method} failed.`, error);
            throw error;
        }
    }
    sendNotification(type, params) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        this.forceDocumentSync();
        try {
            this._resolvedConnection.sendNotification(type, params);
        }
        catch (error) {
            this.error(`Sending notification ${Is.string(type) ? type : type.method} failed.`, error);
            throw error;
        }
    }
    onNotification(type, handler) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        try {
            this._resolvedConnection.onNotification(type, handler);
        }
        catch (error) {
            this.error(`Registering notification handler ${Is.string(type) ? type : type.method} failed.`, error);
            throw error;
        }
    }
    get clientOptions() {
        return this._clientOptions;
    }
    get protocol2CodeConverter() {
        return this._p2c;
    }
    get code2ProtocolConverter() {
        return this._c2p;
    }
    get onTelemetry() {
        return this._telemetryEmitter.event;
    }
    get onDidChangeState() {
        return this._stateChangeEmitter.event;
    }
    get outputChannel() {
        if (!this._outputChannel) {
            this._outputChannel = vscode_1.window.createOutputChannel(this._clientOptions.outputChannelName ? this._clientOptions.outputChannelName : this._name);
        }
        return this._outputChannel;
    }
    get diagnostics() {
        return this._diagnostics;
    }
    createDefaultErrorHandler() {
        return new DefaultErrorHandler(this._name);
    }
    set trace(value) {
        this._trace = value;
        this.onReady().then(() => {
            this.resolveConnection().then((connection) => {
                connection.trace(value, this._tracer);
            });
        }, () => {
        });
    }
    data2String(data) {
        if (data instanceof vscode_languageserver_protocol_1.ResponseError) {
            const responseError = data;
            return `  Message: ${responseError.message}\n  Code: ${responseError.code} ${responseError.data ? '\n' + responseError.data.toString() : ''}`;
        }
        if (data instanceof Error) {
            if (Is.string(data.stack)) {
                return data.stack;
            }
            return data.message;
        }
        if (Is.string(data)) {
            return data;
        }
        return data.toString();
    }
    info(message, data) {
        this.outputChannel.appendLine(`[Info  - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.outputChannel.appendLine(this.data2String(data));
        }
        if (this._clientOptions.revealOutputChannelOn <= RevealOutputChannelOn.Info) {
            this.outputChannel.show(true);
        }
    }
    warn(message, data) {
        this.outputChannel.appendLine(`[Warn  - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.outputChannel.appendLine(this.data2String(data));
        }
        if (this._clientOptions.revealOutputChannelOn <= RevealOutputChannelOn.Warn) {
            this.outputChannel.show(true);
        }
    }
    error(message, data) {
        this.outputChannel.appendLine(`[Error - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.outputChannel.appendLine(this.data2String(data));
        }
        if (this._clientOptions.revealOutputChannelOn <= RevealOutputChannelOn.Error) {
            this.outputChannel.show(true);
        }
    }
    logTrace(message, data) {
        this.outputChannel.appendLine(`[Trace - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.outputChannel.appendLine(this.data2String(data));
        }
    }
    needsStart() {
        return this.state === ClientState.Initial || this.state === ClientState.Stopping || this.state === ClientState.Stopped;
    }
    needsStop() {
        return this.state === ClientState.Starting || this.state === ClientState.Running;
    }
    onReady() {
        return this._onReady;
    }
    isConnectionActive() {
        return this.state === ClientState.Running && !!this._resolvedConnection;
    }
    start() {
        this._listeners = [];
        this._providers = [];
        // If we restart then the diagnostics collection is reused.
        if (!this._diagnostics) {
            this._diagnostics = this._clientOptions.diagnosticCollectionName
                ? vscode_1.languages.createDiagnosticCollection(this._clientOptions.diagnosticCollectionName)
                : vscode_1.languages.createDiagnosticCollection();
        }
        this.state = ClientState.Starting;
        this.resolveConnection().then((connection) => {
            connection.onLogMessage((message) => {
                switch (message.type) {
                    case vscode_languageserver_protocol_1.MessageType.Error:
                        this.error(message.message);
                        break;
                    case vscode_languageserver_protocol_1.MessageType.Warning:
                        this.warn(message.message);
                        break;
                    case vscode_languageserver_protocol_1.MessageType.Info:
                        this.info(message.message);
                        break;
                    default:
                        this.outputChannel.appendLine(message.message);
                }
            });
            connection.onShowMessage((message) => {
                switch (message.type) {
                    case vscode_languageserver_protocol_1.MessageType.Error:
                        vscode_1.window.showErrorMessage(message.message);
                        break;
                    case vscode_languageserver_protocol_1.MessageType.Warning:
                        vscode_1.window.showWarningMessage(message.message);
                        break;
                    case vscode_languageserver_protocol_1.MessageType.Info:
                        vscode_1.window.showInformationMessage(message.message);
                        break;
                    default:
                        vscode_1.window.showInformationMessage(message.message);
                }
            });
            connection.onRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, (params) => {
                let messageFunc;
                switch (params.type) {
                    case vscode_languageserver_protocol_1.MessageType.Error:
                        messageFunc = vscode_1.window.showErrorMessage;
                        break;
                    case vscode_languageserver_protocol_1.MessageType.Warning:
                        messageFunc = vscode_1.window.showWarningMessage;
                        break;
                    case vscode_languageserver_protocol_1.MessageType.Info:
                        messageFunc = vscode_1.window.showInformationMessage;
                        break;
                    default:
                        messageFunc = vscode_1.window.showInformationMessage;
                }
                let actions = params.actions || [];
                return messageFunc(params.message, ...actions);
            });
            connection.onTelemetry((data) => {
                this._telemetryEmitter.fire(data);
            });
            connection.listen();
            // Error is handled in the intialize call.
            return this.initialize(connection);
        }).then(undefined, (error) => {
            this.state = ClientState.StartFailed;
            this._onReadyCallbacks.reject(error);
            this.error('Starting client failed', error);
            vscode_1.window.showErrorMessage(`Couldn't start client ${this._name}`);
        });
        return new vscode_1.Disposable(() => {
            if (this.needsStop()) {
                this.stop();
            }
        });
    }
    resolveConnection() {
        if (!this._connectionPromise) {
            this._connectionPromise = this.createConnection();
        }
        return this._connectionPromise;
    }
    initialize(connection) {
        this.refreshTrace(connection, false);
        let initOption = this._clientOptions.initializationOptions;
        let rootPath = this._clientOptions.workspaceFolder
            ? this._clientOptions.workspaceFolder.uri.fsPath
            : this._clientGetRootPath();
        let initParams = {
            processId: process.pid,
            rootPath: rootPath ? rootPath : null,
            rootUri: rootPath ? this._c2p.asUri(vscode_1.Uri.file(rootPath)) : null,
            capabilities: this.computeClientCapabilities(),
            initializationOptions: Is.func(initOption) ? initOption() : initOption,
            trace: vscode_languageserver_protocol_1.Trace.toString(this._trace),
            workspaceFolders: null
        };
        this.fillInitializeParams(initParams);
        return connection.initialize(initParams).then((result) => {
            this._resolvedConnection = connection;
            this._initializeResult = result;
            this.state = ClientState.Running;
            let textDocumentSyncOptions = undefined;
            if (Is.number(result.capabilities.textDocumentSync) && result.capabilities.textDocumentSync !== vscode_languageserver_protocol_1.TextDocumentSyncKind.None) {
                textDocumentSyncOptions = {
                    openClose: true,
                    change: result.capabilities.textDocumentSync,
                    save: {
                        includeText: false
                    }
                };
            }
            else if (result.capabilities.textDocumentSync !== void 0 && result.capabilities.textDocumentSync !== null) {
                textDocumentSyncOptions = result.capabilities.textDocumentSync;
            }
            this._capabilities = Object.assign({}, result.capabilities, { resolvedTextDocumentSync: textDocumentSyncOptions });
            connection.onDiagnostics(params => this.handleDiagnostics(params));
            connection.onRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params => this.handleRegistrationRequest(params));
            // See https://github.com/Microsoft/vscode-languageserver-node/issues/199
            connection.onRequest('client/registerFeature', params => this.handleRegistrationRequest(params));
            connection.onRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params => this.handleUnregistrationRequest(params));
            // See https://github.com/Microsoft/vscode-languageserver-node/issues/199
            connection.onRequest('client/unregisterFeature', params => this.handleUnregistrationRequest(params));
            connection.onRequest(vscode_languageserver_protocol_1.ApplyWorkspaceEditRequest.type, params => this.handleApplyWorkspaceEdit(params));
            connection.sendNotification(vscode_languageserver_protocol_1.InitializedNotification.type, {});
            this.hookFileEvents(connection);
            this.hookConfigurationChanged(connection);
            this.initializeFeatures(connection);
            this._onReadyCallbacks.resolve();
            return result;
        }).then(undefined, (error) => {
            if (this._clientOptions.initializationFailedHandler) {
                if (this._clientOptions.initializationFailedHandler(error)) {
                    this.initialize(connection);
                }
                else {
                    this.stop();
                    this._onReadyCallbacks.reject(error);
                }
            }
            else if (error instanceof vscode_languageserver_protocol_1.ResponseError && error.data && error.data.retry) {
                vscode_1.window.showErrorMessage(error.message, { title: 'Retry', id: "retry" }).then(item => {
                    if (item && item.id === 'retry') {
                        this.initialize(connection);
                    }
                    else {
                        this.stop();
                        this._onReadyCallbacks.reject(error);
                    }
                });
            }
            else {
                if (error && error.message) {
                    vscode_1.window.showErrorMessage(error.message);
                }
                this.error('Server initialization failed.', error);
                this.stop();
                this._onReadyCallbacks.reject(error);
            }
        });
    }
    _clientGetRootPath() {
        let folders = vscode_1.workspace.workspaceFolders;
        if (!folders || folders.length === 0) {
            return undefined;
        }
        let folder = folders[0];
        if (folder.uri.scheme === 'file') {
            return folder.uri.fsPath;
        }
        return undefined;
    }
    stop() {
        this._initializeResult = undefined;
        if (!this._connectionPromise) {
            this.state = ClientState.Stopped;
            return Promise.resolve();
        }
        if (this.state === ClientState.Stopping && this._onStop) {
            return this._onStop;
        }
        this.state = ClientState.Stopping;
        this.cleanUp();
        // unkook listeners
        return this._onStop = this.resolveConnection().then(connection => {
            return connection.shutdown().then(() => {
                connection.exit();
                connection.dispose();
                this.state = ClientState.Stopped;
                this._onStop = undefined;
                this._connectionPromise = undefined;
                this._resolvedConnection = undefined;
            });
        });
    }
    cleanUp(channel = true, diagnostics = true) {
        if (this._listeners) {
            this._listeners.forEach(listener => listener.dispose());
            this._listeners = undefined;
        }
        if (this._providers) {
            this._providers.forEach(provider => provider.dispose());
            this._providers = undefined;
        }
        if (this._syncedDocuments) {
            this._syncedDocuments.clear();
        }
        for (let handler of this._dynamicFeatures.values()) {
            handler.dispose();
        }
        if (channel && this._outputChannel && this._disposeOutputChannel) {
            this._outputChannel.dispose();
            this._outputChannel = undefined;
        }
        if (diagnostics && this._diagnostics) {
            this._diagnostics.dispose();
            this._diagnostics = undefined;
        }
    }
    notifyFileEvent(event) {
        this._fileEvents.push(event);
        this._fileEventDelayer.trigger(() => {
            this.onReady().then(() => {
                this.resolveConnection().then(connection => {
                    if (this.isConnectionActive()) {
                        connection.didChangeWatchedFiles({ changes: this._fileEvents });
                    }
                    this._fileEvents = [];
                });
            }, (error) => {
                this.error(`Notify file events failed.`, error);
            });
        });
    }
    forceDocumentSync() {
        this._dynamicFeatures.get(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type.method).forceDelivery();
    }
    handleDiagnostics(params) {
        if (!this._diagnostics) {
            return;
        }
        let uri = this._p2c.asUri(params.uri);
        let diagnostics = this._p2c.asDiagnostics(params.diagnostics);
        let middleware = this.clientOptions.middleware.handleDiagnostics;
        if (middleware) {
            middleware(uri, diagnostics, (uri, diagnostics) => this.setDiagnostics(uri, diagnostics));
        }
        else {
            this.setDiagnostics(uri, diagnostics);
        }
    }
    setDiagnostics(uri, diagnostics) {
        if (!this._diagnostics) {
            return;
        }
        this._diagnostics.set(uri, diagnostics);
    }
    createConnection() {
        let errorHandler = (error, message, count) => {
            this.handleConnectionError(error, message, count);
        };
        let closeHandler = () => {
            this.handleConnectionClosed();
        };
        return this.createMessageTransports(this._clientOptions.stdioEncoding || 'utf8').then((transports) => {
            return createConnection(transports.reader, transports.writer, errorHandler, closeHandler);
        });
    }
    handleConnectionClosed() {
        // Check whether this is a normal shutdown in progress or the client stopped normally.
        if (this.state === ClientState.Stopping || this.state === ClientState.Stopped) {
            return;
        }
        try {
            if (this._resolvedConnection) {
                this._resolvedConnection.dispose();
            }
        }
        catch (error) {
            // Disposing a connection could fail if error cases.
        }
        let action = CloseAction.DoNotRestart;
        try {
            action = this._clientOptions.errorHandler.closed();
        }
        catch (error) {
            // Ignore errors coming from the error handler.
        }
        this._connectionPromise = undefined;
        this._resolvedConnection = undefined;
        if (action === CloseAction.DoNotRestart) {
            this.error('Connection to server got closed. Server will not be restarted.');
            this.state = ClientState.Stopped;
            this.cleanUp(false, true);
        }
        else if (action === CloseAction.Restart) {
            this.info('Connection to server got closed. Server will restart.');
            this.cleanUp(false, false);
            this.state = ClientState.Initial;
            this.start();
        }
    }
    handleConnectionError(error, message, count) {
        let action = this._clientOptions.errorHandler.error(error, message, count);
        if (action === ErrorAction.Shutdown) {
            this.error('Connection to server is erroring. Shutting down server.');
            this.stop();
        }
    }
    hookConfigurationChanged(connection) {
        vscode_1.workspace.onDidChangeConfiguration(() => {
            this.refreshTrace(connection, true);
        });
    }
    refreshTrace(connection, sendNotification = false) {
        let config = vscode_1.workspace.getConfiguration(this._id);
        let trace = vscode_languageserver_protocol_1.Trace.Off;
        if (config) {
            trace = vscode_languageserver_protocol_1.Trace.fromString(config.get('trace.server', 'off'));
        }
        this._trace = trace;
        connection.trace(this._trace, this._tracer, sendNotification);
    }
    hookFileEvents(_connection) {
        let fileEvents = this._clientOptions.synchronize.fileEvents;
        if (!fileEvents) {
            return;
        }
        let watchers;
        if (Is.array(fileEvents)) {
            watchers = fileEvents;
        }
        else {
            watchers = [fileEvents];
        }
        if (!watchers) {
            return;
        }
        this._dynamicFeatures.get(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type.method).registerRaw(UUID.generateUuid(), watchers);
    }
    registerFeatures(features) {
        for (let feature of features) {
            this.registerFeature(feature);
        }
    }
    registerFeature(feature) {
        this._features.push(feature);
        if (DynamicFeature.is(feature)) {
            let messages = feature.messages;
            if (Array.isArray(messages)) {
                for (let message of messages) {
                    this._method2Message.set(message.method, message);
                    this._dynamicFeatures.set(message.method, feature);
                }
            }
            else {
                this._method2Message.set(messages.method, messages);
                this._dynamicFeatures.set(messages.method, feature);
            }
        }
    }
    registerBuiltinFeatures() {
        this.registerFeature(new ConfigurationFeature(this));
        this.registerFeature(new DidOpenTextDocumentFeature(this, this._syncedDocuments));
        this.registerFeature(new DidChangeTextDocumentFeature(this));
        this.registerFeature(new WillSaveFeature(this));
        this.registerFeature(new WillSaveWaitUntilFeature(this));
        this.registerFeature(new DidSaveTextDocumentFeature(this));
        this.registerFeature(new DidCloseTextDocumentFeature(this, this._syncedDocuments));
        this.registerFeature(new FileSystemWatcherFeature(this, (event) => this.notifyFileEvent(event)));
        this.registerFeature(new CompletionItemFeature(this));
        this.registerFeature(new HoverFeature(this));
        this.registerFeature(new SignatureHelpFeature(this));
        this.registerFeature(new DefinitionFeature(this));
        this.registerFeature(new ReferencesFeature(this));
        this.registerFeature(new DocumentHighlightFeature(this));
        this.registerFeature(new DocumentSymbolFeature(this));
        this.registerFeature(new WorkspaceSymbolFeature(this));
        this.registerFeature(new CodeActionFeature(this));
        this.registerFeature(new CodeLensFeature(this));
        this.registerFeature(new DocumentFormattingFeature(this));
        this.registerFeature(new DocumentRangeFormattingFeature(this));
        this.registerFeature(new DocumentOnTypeFormattingFeature(this));
        this.registerFeature(new RenameFeature(this));
        this.registerFeature(new DocumentLinkFeature(this));
        this.registerFeature(new ExecuteCommandFeature(this));
    }
    fillInitializeParams(params) {
        for (let feature of this._features) {
            if (Is.func(feature.fillInitializeParams)) {
                feature.fillInitializeParams(params);
            }
        }
    }
    computeClientCapabilities() {
        let result = {};
        ensure(result, 'workspace').applyEdit = true;
        ensure(ensure(result, 'workspace'), 'workspaceEdit').documentChanges = true;
        ensure(ensure(result, 'textDocument'), 'publishDiagnostics').relatedInformation = true;
        for (let feature of this._features) {
            feature.fillClientCapabilities(result);
        }
        return result;
    }
    initializeFeatures(_connection) {
        let documentSelector = this._clientOptions.documentSelector;
        for (let feature of this._features) {
            feature.initialize(this._capabilities, documentSelector);
        }
    }
    handleRegistrationRequest(params) {
        return new Promise((resolve, reject) => {
            for (let registration of params.registrations) {
                const feature = this._dynamicFeatures.get(registration.method);
                if (!feature) {
                    reject(new Error(`No feature implementation for ${registration.method} found. Registration failed.`));
                    return;
                }
                const options = registration.registerOptions || {};
                options.documentSelector = options.documentSelector || this._clientOptions.documentSelector;
                const data = {
                    id: registration.id,
                    registerOptions: options
                };
                feature.register(this._method2Message.get(registration.method), data);
            }
            resolve();
        });
    }
    handleUnregistrationRequest(params) {
        return new Promise((resolve, reject) => {
            for (let unregistration of params.unregisterations) {
                const feature = this._dynamicFeatures.get(unregistration.method);
                if (!feature) {
                    reject(new Error(`No feature implementation for ${unregistration.method} found. Unregistration failed.`));
                    return;
                }
                feature.unregister(unregistration.id);
            }
            ;
            resolve();
        });
    }
    handleApplyWorkspaceEdit(params) {
        // This is some sort of workaround since the version check should be done by VS Code in the Workspace.applyEdit.
        // However doing it here adds some safety since the server can lag more behind then an extension.
        let workspaceEdit = params.edit;
        let openTextDocuments = new Map();
        vscode_1.workspace.textDocuments.forEach((document) => openTextDocuments.set(document.uri.toString(), document));
        let versionMismatch = false;
        if (workspaceEdit.documentChanges) {
            for (const change of workspaceEdit.documentChanges) {
                if (change.textDocument.version && change.textDocument.version >= 0) {
                    let textDocument = openTextDocuments.get(change.textDocument.uri);
                    if (textDocument && textDocument.version !== change.textDocument.version) {
                        versionMismatch = true;
                        break;
                    }
                }
            }
        }
        if (versionMismatch) {
            return Promise.resolve({ applied: false });
        }
        return vscode_1.workspace.applyEdit(this._p2c.asWorkspaceEdit(params.edit)).then((value) => { return { applied: value }; });
    }
    ;
    logFailedRequest(type, error) {
        // If we get a request cancel don't log anything.
        if (error instanceof vscode_languageserver_protocol_1.ResponseError && error.code === vscode_languageserver_protocol_1.ErrorCodes.RequestCancelled) {
            return;
        }
        this.error(`Request ${type.method} failed.`, error);
    }
}
exports.BaseLanguageClient = BaseLanguageClient;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_jsonrpc_1 = __webpack_require__(8);
exports.ErrorCodes = vscode_jsonrpc_1.ErrorCodes;
exports.ResponseError = vscode_jsonrpc_1.ResponseError;
exports.CancellationToken = vscode_jsonrpc_1.CancellationToken;
exports.CancellationTokenSource = vscode_jsonrpc_1.CancellationTokenSource;
exports.Disposable = vscode_jsonrpc_1.Disposable;
exports.Event = vscode_jsonrpc_1.Event;
exports.Emitter = vscode_jsonrpc_1.Emitter;
exports.Trace = vscode_jsonrpc_1.Trace;
exports.SetTraceNotification = vscode_jsonrpc_1.SetTraceNotification;
exports.LogTraceNotification = vscode_jsonrpc_1.LogTraceNotification;
exports.RequestType = vscode_jsonrpc_1.RequestType;
exports.RequestType0 = vscode_jsonrpc_1.RequestType0;
exports.NotificationType = vscode_jsonrpc_1.NotificationType;
exports.NotificationType0 = vscode_jsonrpc_1.NotificationType0;
exports.MessageReader = vscode_jsonrpc_1.MessageReader;
exports.MessageWriter = vscode_jsonrpc_1.MessageWriter;
exports.ConnectionStrategy = vscode_jsonrpc_1.ConnectionStrategy;
exports.StreamMessageReader = vscode_jsonrpc_1.StreamMessageReader;
exports.StreamMessageWriter = vscode_jsonrpc_1.StreamMessageWriter;
exports.IPCMessageReader = vscode_jsonrpc_1.IPCMessageReader;
exports.IPCMessageWriter = vscode_jsonrpc_1.IPCMessageWriter;
exports.createClientPipeTransport = vscode_jsonrpc_1.createClientPipeTransport;
exports.createServerPipeTransport = vscode_jsonrpc_1.createServerPipeTransport;
exports.generateRandomPipeName = vscode_jsonrpc_1.generateRandomPipeName;
exports.createClientSocketTransport = vscode_jsonrpc_1.createClientSocketTransport;
exports.createServerSocketTransport = vscode_jsonrpc_1.createServerSocketTransport;
__export(__webpack_require__(21));
__export(__webpack_require__(22));
function createProtocolConnection(reader, writer, logger, strategy) {
    return vscode_jsonrpc_1.createMessageConnection(reader, writer, logger, strategy);
}
exports.createProtocolConnection = createProtocolConnection;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference path="./thenable.ts" />

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Is = __webpack_require__(9);
var messages_1 = __webpack_require__(10);
exports.RequestType = messages_1.RequestType;
exports.RequestType0 = messages_1.RequestType0;
exports.RequestType1 = messages_1.RequestType1;
exports.RequestType2 = messages_1.RequestType2;
exports.RequestType3 = messages_1.RequestType3;
exports.RequestType4 = messages_1.RequestType4;
exports.RequestType5 = messages_1.RequestType5;
exports.RequestType6 = messages_1.RequestType6;
exports.RequestType7 = messages_1.RequestType7;
exports.RequestType8 = messages_1.RequestType8;
exports.RequestType9 = messages_1.RequestType9;
exports.ResponseError = messages_1.ResponseError;
exports.ErrorCodes = messages_1.ErrorCodes;
exports.NotificationType = messages_1.NotificationType;
exports.NotificationType0 = messages_1.NotificationType0;
exports.NotificationType1 = messages_1.NotificationType1;
exports.NotificationType2 = messages_1.NotificationType2;
exports.NotificationType3 = messages_1.NotificationType3;
exports.NotificationType4 = messages_1.NotificationType4;
exports.NotificationType5 = messages_1.NotificationType5;
exports.NotificationType6 = messages_1.NotificationType6;
exports.NotificationType7 = messages_1.NotificationType7;
exports.NotificationType8 = messages_1.NotificationType8;
exports.NotificationType9 = messages_1.NotificationType9;
var messageReader_1 = __webpack_require__(11);
exports.MessageReader = messageReader_1.MessageReader;
exports.StreamMessageReader = messageReader_1.StreamMessageReader;
exports.IPCMessageReader = messageReader_1.IPCMessageReader;
exports.SocketMessageReader = messageReader_1.SocketMessageReader;
var messageWriter_1 = __webpack_require__(13);
exports.MessageWriter = messageWriter_1.MessageWriter;
exports.StreamMessageWriter = messageWriter_1.StreamMessageWriter;
exports.IPCMessageWriter = messageWriter_1.IPCMessageWriter;
exports.SocketMessageWriter = messageWriter_1.SocketMessageWriter;
var events_1 = __webpack_require__(12);
exports.Disposable = events_1.Disposable;
exports.Event = events_1.Event;
exports.Emitter = events_1.Emitter;
var cancellation_1 = __webpack_require__(14);
exports.CancellationTokenSource = cancellation_1.CancellationTokenSource;
exports.CancellationToken = cancellation_1.CancellationToken;
var linkedMap_1 = __webpack_require__(15);
__export(__webpack_require__(16));
__export(__webpack_require__(20));
var CancelNotification;
(function (CancelNotification) {
    CancelNotification.type = new messages_1.NotificationType('$/cancelRequest');
})(CancelNotification || (CancelNotification = {}));
exports.NullLogger = Object.freeze({
    error: function () { },
    warn: function () { },
    info: function () { },
    log: function () { }
});
var Trace;
(function (Trace) {
    Trace[Trace["Off"] = 0] = "Off";
    Trace[Trace["Messages"] = 1] = "Messages";
    Trace[Trace["Verbose"] = 2] = "Verbose";
})(Trace = exports.Trace || (exports.Trace = {}));
(function (Trace) {
    function fromString(value) {
        value = value.toLowerCase();
        switch (value) {
            case 'off':
                return Trace.Off;
            case 'messages':
                return Trace.Messages;
            case 'verbose':
                return Trace.Verbose;
            default:
                return Trace.Off;
        }
    }
    Trace.fromString = fromString;
    function toString(value) {
        switch (value) {
            case Trace.Off:
                return 'off';
            case Trace.Messages:
                return 'messages';
            case Trace.Verbose:
                return 'verbose';
            default:
                return 'off';
        }
    }
    Trace.toString = toString;
})(Trace = exports.Trace || (exports.Trace = {}));
var SetTraceNotification;
(function (SetTraceNotification) {
    SetTraceNotification.type = new messages_1.NotificationType('$/setTraceNotification');
})(SetTraceNotification = exports.SetTraceNotification || (exports.SetTraceNotification = {}));
var LogTraceNotification;
(function (LogTraceNotification) {
    LogTraceNotification.type = new messages_1.NotificationType('$/logTraceNotification');
})(LogTraceNotification = exports.LogTraceNotification || (exports.LogTraceNotification = {}));
var ConnectionErrors;
(function (ConnectionErrors) {
    /**
     * The connection is closed.
     */
    ConnectionErrors[ConnectionErrors["Closed"] = 1] = "Closed";
    /**
     * The connection got disposed.
     */
    ConnectionErrors[ConnectionErrors["Disposed"] = 2] = "Disposed";
    /**
     * The connection is already in listening mode.
     */
    ConnectionErrors[ConnectionErrors["AlreadyListening"] = 3] = "AlreadyListening";
})(ConnectionErrors = exports.ConnectionErrors || (exports.ConnectionErrors = {}));
var ConnectionError = /** @class */ (function (_super) {
    __extends(ConnectionError, _super);
    function ConnectionError(code, message) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        Object.setPrototypeOf(_this, ConnectionError.prototype);
        return _this;
    }
    return ConnectionError;
}(Error));
exports.ConnectionError = ConnectionError;
var ConnectionStrategy;
(function (ConnectionStrategy) {
    function is(value) {
        var candidate = value;
        return candidate && Is.func(candidate.cancelUndispatched);
    }
    ConnectionStrategy.is = is;
})(ConnectionStrategy = exports.ConnectionStrategy || (exports.ConnectionStrategy = {}));
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["New"] = 1] = "New";
    ConnectionState[ConnectionState["Listening"] = 2] = "Listening";
    ConnectionState[ConnectionState["Closed"] = 3] = "Closed";
    ConnectionState[ConnectionState["Disposed"] = 4] = "Disposed";
})(ConnectionState || (ConnectionState = {}));
function _createMessageConnection(messageReader, messageWriter, logger, strategy) {
    var sequenceNumber = 0;
    var notificationSquenceNumber = 0;
    var unknownResponseSquenceNumber = 0;
    var version = '2.0';
    var starRequestHandler = undefined;
    var requestHandlers = Object.create(null);
    var starNotificationHandler = undefined;
    var notificationHandlers = Object.create(null);
    var timer;
    var messageQueue = new linkedMap_1.LinkedMap();
    var responsePromises = Object.create(null);
    var requestTokens = Object.create(null);
    var trace = Trace.Off;
    var tracer;
    var state = ConnectionState.New;
    var errorEmitter = new events_1.Emitter();
    var closeEmitter = new events_1.Emitter();
    var unhandledNotificationEmitter = new events_1.Emitter();
    var disposeEmitter = new events_1.Emitter();
    function createRequestQueueKey(id) {
        return 'req-' + id.toString();
    }
    function createResponseQueueKey(id) {
        if (id === null) {
            return 'res-unknown-' + (++unknownResponseSquenceNumber).toString();
        }
        else {
            return 'res-' + id.toString();
        }
    }
    function createNotificationQueueKey() {
        return 'not-' + (++notificationSquenceNumber).toString();
    }
    function addMessageToQueue(queue, message) {
        if (messages_1.isRequestMessage(message)) {
            queue.set(createRequestQueueKey(message.id), message);
        }
        else if (messages_1.isResponseMessage(message)) {
            queue.set(createResponseQueueKey(message.id), message);
        }
        else {
            queue.set(createNotificationQueueKey(), message);
        }
    }
    function cancelUndispatched(_message) {
        return undefined;
    }
    function isListening() {
        return state === ConnectionState.Listening;
    }
    function isClosed() {
        return state === ConnectionState.Closed;
    }
    function isDisposed() {
        return state === ConnectionState.Disposed;
    }
    function closeHandler() {
        if (state === ConnectionState.New || state === ConnectionState.Listening) {
            state = ConnectionState.Closed;
            closeEmitter.fire(undefined);
        }
        // If the connection is disposed don't sent close events.
    }
    ;
    function readErrorHandler(error) {
        errorEmitter.fire([error, undefined, undefined]);
    }
    function writeErrorHandler(data) {
        errorEmitter.fire(data);
    }
    messageReader.onClose(closeHandler);
    messageReader.onError(readErrorHandler);
    messageWriter.onClose(closeHandler);
    messageWriter.onError(writeErrorHandler);
    function triggerMessageQueue() {
        if (timer || messageQueue.size === 0) {
            return;
        }
        timer = setImmediate(function () {
            timer = undefined;
            processMessageQueue();
        });
    }
    function processMessageQueue() {
        if (messageQueue.size === 0) {
            return;
        }
        var message = messageQueue.shift();
        try {
            if (messages_1.isRequestMessage(message)) {
                handleRequest(message);
            }
            else if (messages_1.isNotificationMessage(message)) {
                handleNotification(message);
            }
            else if (messages_1.isResponseMessage(message)) {
                handleResponse(message);
            }
            else {
                handleInvalidMessage(message);
            }
        }
        finally {
            triggerMessageQueue();
        }
    }
    var callback = function (message) {
        try {
            // We have received a cancellation message. Check if the message is still in the queue
            // and cancel it if allowed to do so.
            if (messages_1.isNotificationMessage(message) && message.method === CancelNotification.type.method) {
                var key = createRequestQueueKey(message.params.id);
                var toCancel = messageQueue.get(key);
                if (messages_1.isRequestMessage(toCancel)) {
                    var response = strategy && strategy.cancelUndispatched ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
                    if (response && (response.error !== void 0 || response.result !== void 0)) {
                        messageQueue.delete(key);
                        response.id = toCancel.id;
                        traceSendingResponse(response, message.method, Date.now());
                        messageWriter.write(response);
                        return;
                    }
                }
            }
            addMessageToQueue(messageQueue, message);
        }
        finally {
            triggerMessageQueue();
        }
    };
    function handleRequest(requestMessage) {
        if (isDisposed()) {
            // we return here silently since we fired an event when the
            // connection got disposed.
            return;
        }
        function reply(resultOrError, method, startTime) {
            var message = {
                jsonrpc: version,
                id: requestMessage.id
            };
            if (resultOrError instanceof messages_1.ResponseError) {
                message.error = resultOrError.toJson();
            }
            else {
                message.result = resultOrError === void 0 ? null : resultOrError;
            }
            traceSendingResponse(message, method, startTime);
            messageWriter.write(message);
        }
        function replyError(error, method, startTime) {
            var message = {
                jsonrpc: version,
                id: requestMessage.id,
                error: error.toJson()
            };
            traceSendingResponse(message, method, startTime);
            messageWriter.write(message);
        }
        function replySuccess(result, method, startTime) {
            // The JSON RPC defines that a response must either have a result or an error
            // So we can't treat undefined as a valid response result.
            if (result === void 0) {
                result = null;
            }
            var message = {
                jsonrpc: version,
                id: requestMessage.id,
                result: result
            };
            traceSendingResponse(message, method, startTime);
            messageWriter.write(message);
        }
        traceReceivedRequest(requestMessage);
        var element = requestHandlers[requestMessage.method];
        var type;
        var requestHandler;
        if (element) {
            type = element.type;
            requestHandler = element.handler;
        }
        var startTime = Date.now();
        if (requestHandler || starRequestHandler) {
            var cancellationSource = new cancellation_1.CancellationTokenSource();
            var tokenKey_1 = String(requestMessage.id);
            requestTokens[tokenKey_1] = cancellationSource;
            try {
                var handlerResult = void 0;
                if (requestMessage.params === void 0 || (type !== void 0 && type.numberOfParams === 0)) {
                    handlerResult = requestHandler
                        ? requestHandler(cancellationSource.token)
                        : starRequestHandler(requestMessage.method, cancellationSource.token);
                }
                else if (Is.array(requestMessage.params) && (type === void 0 || type.numberOfParams > 1)) {
                    handlerResult = requestHandler
                        ? requestHandler.apply(void 0, requestMessage.params.concat([cancellationSource.token])) : starRequestHandler.apply(void 0, [requestMessage.method].concat(requestMessage.params, [cancellationSource.token]));
                }
                else {
                    handlerResult = requestHandler
                        ? requestHandler(requestMessage.params, cancellationSource.token)
                        : starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
                }
                var promise = handlerResult;
                if (!handlerResult) {
                    delete requestTokens[tokenKey_1];
                    replySuccess(handlerResult, requestMessage.method, startTime);
                }
                else if (promise.then) {
                    promise.then(function (resultOrError) {
                        delete requestTokens[tokenKey_1];
                        reply(resultOrError, requestMessage.method, startTime);
                    }, function (error) {
                        delete requestTokens[tokenKey_1];
                        if (error instanceof messages_1.ResponseError) {
                            replyError(error, requestMessage.method, startTime);
                        }
                        else if (error && Is.string(error.message)) {
                            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, "Request " + requestMessage.method + " failed with message: " + error.message), requestMessage.method, startTime);
                        }
                        else {
                            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, "Request " + requestMessage.method + " failed unexpectedly without providing any details."), requestMessage.method, startTime);
                        }
                    });
                }
                else {
                    delete requestTokens[tokenKey_1];
                    reply(handlerResult, requestMessage.method, startTime);
                }
            }
            catch (error) {
                delete requestTokens[tokenKey_1];
                if (error instanceof messages_1.ResponseError) {
                    reply(error, requestMessage.method, startTime);
                }
                else if (error && Is.string(error.message)) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, "Request " + requestMessage.method + " failed with message: " + error.message), requestMessage.method, startTime);
                }
                else {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, "Request " + requestMessage.method + " failed unexpectedly without providing any details."), requestMessage.method, startTime);
                }
            }
        }
        else {
            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.MethodNotFound, "Unhandled method " + requestMessage.method), requestMessage.method, startTime);
        }
    }
    function handleResponse(responseMessage) {
        if (isDisposed()) {
            // See handle request.
            return;
        }
        if (responseMessage.id === null) {
            if (responseMessage.error) {
                logger.error("Received response message without id: Error is: \n" + JSON.stringify(responseMessage.error, undefined, 4));
            }
            else {
                logger.error("Received response message without id. No further error information provided.");
            }
        }
        else {
            var key = String(responseMessage.id);
            var responsePromise = responsePromises[key];
            traceReceivedResponse(responseMessage, responsePromise);
            if (responsePromise) {
                delete responsePromises[key];
                try {
                    if (responseMessage.error) {
                        var error = responseMessage.error;
                        responsePromise.reject(new messages_1.ResponseError(error.code, error.message, error.data));
                    }
                    else if (responseMessage.result !== void 0) {
                        responsePromise.resolve(responseMessage.result);
                    }
                    else {
                        throw new Error('Should never happen.');
                    }
                }
                catch (error) {
                    if (error.message) {
                        logger.error("Response handler '" + responsePromise.method + "' failed with message: " + error.message);
                    }
                    else {
                        logger.error("Response handler '" + responsePromise.method + "' failed unexpectedly.");
                    }
                }
            }
        }
    }
    function handleNotification(message) {
        if (isDisposed()) {
            // See handle request.
            return;
        }
        var type = undefined;
        var notificationHandler;
        if (message.method === CancelNotification.type.method) {
            notificationHandler = function (params) {
                var id = params.id;
                var source = requestTokens[String(id)];
                if (source) {
                    source.cancel();
                }
            };
        }
        else {
            var element = notificationHandlers[message.method];
            if (element) {
                notificationHandler = element.handler;
                type = element.type;
            }
        }
        if (notificationHandler || starNotificationHandler) {
            try {
                traceReceivedNotification(message);
                if (message.params === void 0 || (type !== void 0 && type.numberOfParams === 0)) {
                    notificationHandler ? notificationHandler() : starNotificationHandler(message.method);
                }
                else if (Is.array(message.params) && (type === void 0 || type.numberOfParams > 1)) {
                    notificationHandler ? notificationHandler.apply(void 0, message.params) : starNotificationHandler.apply(void 0, [message.method].concat(message.params));
                }
                else {
                    notificationHandler ? notificationHandler(message.params) : starNotificationHandler(message.method, message.params);
                }
            }
            catch (error) {
                if (error.message) {
                    logger.error("Notification handler '" + message.method + "' failed with message: " + error.message);
                }
                else {
                    logger.error("Notification handler '" + message.method + "' failed unexpectedly.");
                }
            }
        }
        else {
            unhandledNotificationEmitter.fire(message);
        }
    }
    function handleInvalidMessage(message) {
        if (!message) {
            logger.error('Received empty message.');
            return;
        }
        logger.error("Received message which is neither a response nor a notification message:\n" + JSON.stringify(message, null, 4));
        // Test whether we find an id to reject the promise
        var responseMessage = message;
        if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
            var key = String(responseMessage.id);
            var responseHandler = responsePromises[key];
            if (responseHandler) {
                responseHandler.reject(new Error('The received response has neither a result nor an error property.'));
            }
        }
    }
    function traceSendingRequest(message) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        var data = undefined;
        if (trace === Trace.Verbose && message.params) {
            data = "Params: " + JSON.stringify(message.params, null, 4) + "\n\n";
        }
        tracer.log("Sending request '" + message.method + " - (" + message.id + ")'.", data);
    }
    function traceSendNotification(message) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        var data = undefined;
        if (trace === Trace.Verbose) {
            if (message.params) {
                data = "Params: " + JSON.stringify(message.params, null, 4) + "\n\n";
            }
            else {
                data = 'No parameters provided.\n\n';
            }
        }
        tracer.log("Sending notification '" + message.method + "'.", data);
    }
    function traceSendingResponse(message, method, startTime) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        var data = undefined;
        if (trace === Trace.Verbose) {
            if (message.error && message.error.data) {
                data = "Error data: " + JSON.stringify(message.error.data, null, 4) + "\n\n";
            }
            else {
                if (message.result) {
                    data = "Result: " + JSON.stringify(message.result, null, 4) + "\n\n";
                }
                else if (message.error === void 0) {
                    data = 'No result returned.\n\n';
                }
            }
        }
        tracer.log("Sending response '" + method + " - (" + message.id + ")'. Processing request took " + (Date.now() - startTime) + "ms", data);
    }
    function traceReceivedRequest(message) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        var data = undefined;
        if (trace === Trace.Verbose && message.params) {
            data = "Params: " + JSON.stringify(message.params, null, 4) + "\n\n";
        }
        tracer.log("Received request '" + message.method + " - (" + message.id + ")'.", data);
    }
    function traceReceivedNotification(message) {
        if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
            return;
        }
        var data = undefined;
        if (trace === Trace.Verbose) {
            if (message.params) {
                data = "Params: " + JSON.stringify(message.params, null, 4) + "\n\n";
            }
            else {
                data = 'No parameters provided.\n\n';
            }
        }
        tracer.log("Received notification '" + message.method + "'.", data);
    }
    function traceReceivedResponse(message, responsePromise) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        var data = undefined;
        if (trace === Trace.Verbose) {
            if (message.error && message.error.data) {
                data = "Error data: " + JSON.stringify(message.error.data, null, 4) + "\n\n";
            }
            else {
                if (message.result) {
                    data = "Result: " + JSON.stringify(message.result, null, 4) + "\n\n";
                }
                else if (message.error === void 0) {
                    data = 'No result returned.\n\n';
                }
            }
        }
        if (responsePromise) {
            var error = message.error ? " Request failed: " + message.error.message + " (" + message.error.code + ")." : '';
            tracer.log("Received response '" + responsePromise.method + " - (" + message.id + ")' in " + (Date.now() - responsePromise.timerStart) + "ms." + error, data);
        }
        else {
            tracer.log("Received response " + message.id + " without active response promise.", data);
        }
    }
    function throwIfClosedOrDisposed() {
        if (isClosed()) {
            throw new ConnectionError(ConnectionErrors.Closed, 'Connection is closed.');
        }
        if (isDisposed()) {
            throw new ConnectionError(ConnectionErrors.Disposed, 'Connection is disposed.');
        }
    }
    function throwIfListening() {
        if (isListening()) {
            throw new ConnectionError(ConnectionErrors.AlreadyListening, 'Connection is already listening');
        }
    }
    function throwIfNotListening() {
        if (!isListening()) {
            throw new Error('Call listen() first.');
        }
    }
    function undefinedToNull(param) {
        if (param === void 0) {
            return null;
        }
        else {
            return param;
        }
    }
    function computeMessageParams(type, params) {
        var result;
        var numberOfParams = type.numberOfParams;
        switch (numberOfParams) {
            case 0:
                result = null;
                break;
            case 1:
                result = undefinedToNull(params[0]);
                break;
            default:
                result = [];
                for (var i = 0; i < params.length && i < numberOfParams; i++) {
                    result.push(undefinedToNull(params[i]));
                }
                if (params.length < numberOfParams) {
                    for (var i = params.length; i < numberOfParams; i++) {
                        result.push(null);
                    }
                }
                break;
        }
        return result;
    }
    var connection = {
        sendNotification: function (type) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            throwIfClosedOrDisposed();
            var method;
            var messageParams;
            if (Is.string(type)) {
                method = type;
                switch (params.length) {
                    case 0:
                        messageParams = null;
                        break;
                    case 1:
                        messageParams = params[0];
                        break;
                    default:
                        messageParams = params;
                        break;
                }
            }
            else {
                method = type.method;
                messageParams = computeMessageParams(type, params);
            }
            var notificationMessage = {
                jsonrpc: version,
                method: method,
                params: messageParams
            };
            traceSendNotification(notificationMessage);
            messageWriter.write(notificationMessage);
        },
        onNotification: function (type, handler) {
            throwIfClosedOrDisposed();
            if (Is.func(type)) {
                starNotificationHandler = type;
            }
            else if (handler) {
                if (Is.string(type)) {
                    notificationHandlers[type] = { type: undefined, handler: handler };
                }
                else {
                    notificationHandlers[type.method] = { type: type, handler: handler };
                }
            }
        },
        sendRequest: function (type) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            throwIfClosedOrDisposed();
            throwIfNotListening();
            var method;
            var messageParams;
            var token = undefined;
            if (Is.string(type)) {
                method = type;
                switch (params.length) {
                    case 0:
                        messageParams = null;
                        break;
                    case 1:
                        // The cancellation token is optional so it can also be undefined.
                        if (cancellation_1.CancellationToken.is(params[0])) {
                            messageParams = null;
                            token = params[0];
                        }
                        else {
                            messageParams = undefinedToNull(params[0]);
                        }
                        break;
                    default:
                        var last = params.length - 1;
                        if (cancellation_1.CancellationToken.is(params[last])) {
                            token = params[last];
                            if (params.length === 2) {
                                messageParams = undefinedToNull(params[0]);
                            }
                            else {
                                messageParams = params.slice(0, last).map(function (value) { return undefinedToNull(value); });
                            }
                        }
                        else {
                            messageParams = params.map(function (value) { return undefinedToNull(value); });
                        }
                        break;
                }
            }
            else {
                method = type.method;
                messageParams = computeMessageParams(type, params);
                var numberOfParams = type.numberOfParams;
                token = cancellation_1.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : undefined;
            }
            var id = sequenceNumber++;
            var result = new Promise(function (resolve, reject) {
                var requestMessage = {
                    jsonrpc: version,
                    id: id,
                    method: method,
                    params: messageParams
                };
                var responsePromise = { method: method, timerStart: Date.now(), resolve: resolve, reject: reject };
                traceSendingRequest(requestMessage);
                try {
                    messageWriter.write(requestMessage);
                }
                catch (e) {
                    // Writing the message failed. So we need to reject the promise.
                    responsePromise.reject(new messages_1.ResponseError(messages_1.ErrorCodes.MessageWriteError, e.message ? e.message : 'Unknown reason'));
                    responsePromise = null;
                }
                if (responsePromise) {
                    responsePromises[String(id)] = responsePromise;
                }
            });
            if (token) {
                token.onCancellationRequested(function () {
                    connection.sendNotification(CancelNotification.type, { id: id });
                });
            }
            return result;
        },
        onRequest: function (type, handler) {
            throwIfClosedOrDisposed();
            if (Is.func(type)) {
                starRequestHandler = type;
            }
            else if (handler) {
                if (Is.string(type)) {
                    requestHandlers[type] = { type: undefined, handler: handler };
                }
                else {
                    requestHandlers[type.method] = { type: type, handler: handler };
                }
            }
        },
        trace: function (_value, _tracer, sendNotification) {
            if (sendNotification === void 0) { sendNotification = false; }
            trace = _value;
            if (trace === Trace.Off) {
                tracer = undefined;
            }
            else {
                tracer = _tracer;
            }
            if (sendNotification && !isClosed() && !isDisposed()) {
                connection.sendNotification(SetTraceNotification.type, { value: Trace.toString(_value) });
            }
        },
        onError: errorEmitter.event,
        onClose: closeEmitter.event,
        onUnhandledNotification: unhandledNotificationEmitter.event,
        onDispose: disposeEmitter.event,
        dispose: function () {
            if (isDisposed()) {
                return;
            }
            state = ConnectionState.Disposed;
            disposeEmitter.fire(undefined);
            var error = new Error('Connection got disposed.');
            Object.keys(responsePromises).forEach(function (key) {
                responsePromises[key].reject(error);
            });
            responsePromises = Object.create(null);
            requestTokens = Object.create(null);
            messageQueue = new linkedMap_1.LinkedMap();
            // Test for backwards compatibility
            if (Is.func(messageWriter.dispose)) {
                messageWriter.dispose();
            }
            if (Is.func(messageReader.dispose)) {
                messageReader.dispose();
            }
        },
        listen: function () {
            throwIfClosedOrDisposed();
            throwIfListening();
            state = ConnectionState.Listening;
            messageReader.listen(callback);
        },
        inspect: function () {
            console.log("inspect");
        }
    };
    connection.onNotification(LogTraceNotification.type, function (params) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        tracer.log(params.message, trace === Trace.Verbose ? params.verbose : undefined);
    });
    return connection;
}
function isMessageReader(value) {
    return value.listen !== void 0 && value.read === void 0;
}
function isMessageWriter(value) {
    return value.write !== void 0 && value.end === void 0;
}
function createMessageConnection(input, output, logger, strategy) {
    if (!logger) {
        logger = exports.NullLogger;
    }
    var reader = isMessageReader(input) ? input : new messageReader_1.StreamMessageReader(input);
    var writer = isMessageWriter(output) ? output : new messageWriter_1.StreamMessageWriter(output);
    return _createMessageConnection(reader, writer, logger, strategy);
}
exports.createMessageConnection = createMessageConnection;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
var toString = Object.prototype.toString;
function boolean(value) {
    return value === true || value === false;
}
exports.boolean = boolean;
function string(value) {
    return toString.call(value) === '[object String]';
}
exports.string = string;
function number(value) {
    return toString.call(value) === '[object Number]';
}
exports.number = number;
function error(value) {
    return toString.call(value) === '[object Error]';
}
exports.error = error;
function func(value) {
    return toString.call(value) === '[object Function]';
}
exports.func = func;
function array(value) {
    return Array.isArray(value);
}
exports.array = array;
function stringArray(value) {
    return array(value) && value.every(function (elem) { return string(elem); });
}
exports.stringArray = stringArray;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var is = __webpack_require__(9);
/**
 * Predefined error codes.
 */
var ErrorCodes;
(function (ErrorCodes) {
    // Defined by JSON RPC
    ErrorCodes.ParseError = -32700;
    ErrorCodes.InvalidRequest = -32600;
    ErrorCodes.MethodNotFound = -32601;
    ErrorCodes.InvalidParams = -32602;
    ErrorCodes.InternalError = -32603;
    ErrorCodes.serverErrorStart = -32099;
    ErrorCodes.serverErrorEnd = -32000;
    ErrorCodes.ServerNotInitialized = -32002;
    ErrorCodes.UnknownErrorCode = -32001;
    // Defined by the protocol.
    ErrorCodes.RequestCancelled = -32800;
    // Defined by VSCode library.
    ErrorCodes.MessageWriteError = 1;
    ErrorCodes.MessageReadError = 2;
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
/**
 * An error object return in a response in case a request
 * has failed.
 */
var ResponseError = /** @class */ (function (_super) {
    __extends(ResponseError, _super);
    function ResponseError(code, message, data) {
        var _this = _super.call(this, message) || this;
        _this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
        _this.data = data;
        Object.setPrototypeOf(_this, ResponseError.prototype);
        return _this;
    }
    ResponseError.prototype.toJson = function () {
        return {
            code: this.code,
            message: this.message,
            data: this.data,
        };
    };
    return ResponseError;
}(Error));
exports.ResponseError = ResponseError;
/**
 * An abstract implementation of a MessageType.
 */
var AbstractMessageType = /** @class */ (function () {
    function AbstractMessageType(_method, _numberOfParams) {
        this._method = _method;
        this._numberOfParams = _numberOfParams;
    }
    Object.defineProperty(AbstractMessageType.prototype, "method", {
        get: function () {
            return this._method;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMessageType.prototype, "numberOfParams", {
        get: function () {
            return this._numberOfParams;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractMessageType;
}());
exports.AbstractMessageType = AbstractMessageType;
/**
 * Classes to type request response pairs
 */
var RequestType0 = /** @class */ (function (_super) {
    __extends(RequestType0, _super);
    function RequestType0(method) {
        var _this = _super.call(this, method, 0) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType0;
}(AbstractMessageType));
exports.RequestType0 = RequestType0;
var RequestType = /** @class */ (function (_super) {
    __extends(RequestType, _super);
    function RequestType(method) {
        var _this = _super.call(this, method, 1) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType;
}(AbstractMessageType));
exports.RequestType = RequestType;
var RequestType1 = /** @class */ (function (_super) {
    __extends(RequestType1, _super);
    function RequestType1(method) {
        var _this = _super.call(this, method, 1) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType1;
}(AbstractMessageType));
exports.RequestType1 = RequestType1;
var RequestType2 = /** @class */ (function (_super) {
    __extends(RequestType2, _super);
    function RequestType2(method) {
        var _this = _super.call(this, method, 2) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType2;
}(AbstractMessageType));
exports.RequestType2 = RequestType2;
var RequestType3 = /** @class */ (function (_super) {
    __extends(RequestType3, _super);
    function RequestType3(method) {
        var _this = _super.call(this, method, 3) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType3;
}(AbstractMessageType));
exports.RequestType3 = RequestType3;
var RequestType4 = /** @class */ (function (_super) {
    __extends(RequestType4, _super);
    function RequestType4(method) {
        var _this = _super.call(this, method, 4) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType4;
}(AbstractMessageType));
exports.RequestType4 = RequestType4;
var RequestType5 = /** @class */ (function (_super) {
    __extends(RequestType5, _super);
    function RequestType5(method) {
        var _this = _super.call(this, method, 5) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType5;
}(AbstractMessageType));
exports.RequestType5 = RequestType5;
var RequestType6 = /** @class */ (function (_super) {
    __extends(RequestType6, _super);
    function RequestType6(method) {
        var _this = _super.call(this, method, 6) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType6;
}(AbstractMessageType));
exports.RequestType6 = RequestType6;
var RequestType7 = /** @class */ (function (_super) {
    __extends(RequestType7, _super);
    function RequestType7(method) {
        var _this = _super.call(this, method, 7) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType7;
}(AbstractMessageType));
exports.RequestType7 = RequestType7;
var RequestType8 = /** @class */ (function (_super) {
    __extends(RequestType8, _super);
    function RequestType8(method) {
        var _this = _super.call(this, method, 8) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType8;
}(AbstractMessageType));
exports.RequestType8 = RequestType8;
var RequestType9 = /** @class */ (function (_super) {
    __extends(RequestType9, _super);
    function RequestType9(method) {
        var _this = _super.call(this, method, 9) || this;
        _this._ = undefined;
        return _this;
    }
    return RequestType9;
}(AbstractMessageType));
exports.RequestType9 = RequestType9;
var NotificationType = /** @class */ (function (_super) {
    __extends(NotificationType, _super);
    function NotificationType(method) {
        var _this = _super.call(this, method, 1) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType;
}(AbstractMessageType));
exports.NotificationType = NotificationType;
var NotificationType0 = /** @class */ (function (_super) {
    __extends(NotificationType0, _super);
    function NotificationType0(method) {
        var _this = _super.call(this, method, 0) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType0;
}(AbstractMessageType));
exports.NotificationType0 = NotificationType0;
var NotificationType1 = /** @class */ (function (_super) {
    __extends(NotificationType1, _super);
    function NotificationType1(method) {
        var _this = _super.call(this, method, 1) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType1;
}(AbstractMessageType));
exports.NotificationType1 = NotificationType1;
var NotificationType2 = /** @class */ (function (_super) {
    __extends(NotificationType2, _super);
    function NotificationType2(method) {
        var _this = _super.call(this, method, 2) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType2;
}(AbstractMessageType));
exports.NotificationType2 = NotificationType2;
var NotificationType3 = /** @class */ (function (_super) {
    __extends(NotificationType3, _super);
    function NotificationType3(method) {
        var _this = _super.call(this, method, 3) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType3;
}(AbstractMessageType));
exports.NotificationType3 = NotificationType3;
var NotificationType4 = /** @class */ (function (_super) {
    __extends(NotificationType4, _super);
    function NotificationType4(method) {
        var _this = _super.call(this, method, 4) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType4;
}(AbstractMessageType));
exports.NotificationType4 = NotificationType4;
var NotificationType5 = /** @class */ (function (_super) {
    __extends(NotificationType5, _super);
    function NotificationType5(method) {
        var _this = _super.call(this, method, 5) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType5;
}(AbstractMessageType));
exports.NotificationType5 = NotificationType5;
var NotificationType6 = /** @class */ (function (_super) {
    __extends(NotificationType6, _super);
    function NotificationType6(method) {
        var _this = _super.call(this, method, 6) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType6;
}(AbstractMessageType));
exports.NotificationType6 = NotificationType6;
var NotificationType7 = /** @class */ (function (_super) {
    __extends(NotificationType7, _super);
    function NotificationType7(method) {
        var _this = _super.call(this, method, 7) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType7;
}(AbstractMessageType));
exports.NotificationType7 = NotificationType7;
var NotificationType8 = /** @class */ (function (_super) {
    __extends(NotificationType8, _super);
    function NotificationType8(method) {
        var _this = _super.call(this, method, 8) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType8;
}(AbstractMessageType));
exports.NotificationType8 = NotificationType8;
var NotificationType9 = /** @class */ (function (_super) {
    __extends(NotificationType9, _super);
    function NotificationType9(method) {
        var _this = _super.call(this, method, 9) || this;
        _this._ = undefined;
        return _this;
    }
    return NotificationType9;
}(AbstractMessageType));
exports.NotificationType9 = NotificationType9;
/**
 * Tests if the given message is a request message
 */
function isRequestMessage(message) {
    var candidate = message;
    return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
}
exports.isRequestMessage = isRequestMessage;
/**
 * Tests if the given message is a notification message
 */
function isNotificationMessage(message) {
    var candidate = message;
    return candidate && is.string(candidate.method) && message.id === void 0;
}
exports.isNotificationMessage = isNotificationMessage;
/**
 * Tests if the given message is a response message
 */
function isResponseMessage(message) {
    var candidate = message;
    return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
}
exports.isResponseMessage = isResponseMessage;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(12);
var Is = __webpack_require__(9);
var DefaultSize = 8192;
var CR = new Buffer('\r', 'ascii')[0];
var LF = new Buffer('\n', 'ascii')[0];
var CRLF = '\r\n';
var MessageBuffer = /** @class */ (function () {
    function MessageBuffer(encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        this.encoding = encoding;
        this.index = 0;
        this.buffer = new Buffer(DefaultSize);
    }
    MessageBuffer.prototype.append = function (chunk) {
        var toAppend = chunk;
        if (typeof (chunk) === 'string') {
            var str = chunk;
            var bufferLen = Buffer.byteLength(str, this.encoding);
            toAppend = new Buffer(bufferLen);
            toAppend.write(str, 0, bufferLen, this.encoding);
        }
        if (this.buffer.length - this.index >= toAppend.length) {
            toAppend.copy(this.buffer, this.index, 0, toAppend.length);
        }
        else {
            var newSize = (Math.ceil((this.index + toAppend.length) / DefaultSize) + 1) * DefaultSize;
            if (this.index === 0) {
                this.buffer = new Buffer(newSize);
                toAppend.copy(this.buffer, 0, 0, toAppend.length);
            }
            else {
                this.buffer = Buffer.concat([this.buffer.slice(0, this.index), toAppend], newSize);
            }
        }
        this.index += toAppend.length;
    };
    MessageBuffer.prototype.tryReadHeaders = function () {
        var result = undefined;
        var current = 0;
        while (current + 3 < this.index && (this.buffer[current] !== CR || this.buffer[current + 1] !== LF || this.buffer[current + 2] !== CR || this.buffer[current + 3] !== LF)) {
            current++;
        }
        // No header / body separator found (e.g CRLFCRLF)
        if (current + 3 >= this.index) {
            return result;
        }
        result = Object.create(null);
        var headers = this.buffer.toString('ascii', 0, current).split(CRLF);
        headers.forEach(function (header) {
            var index = header.indexOf(':');
            if (index === -1) {
                throw new Error('Message header must separate key and value using :');
            }
            var key = header.substr(0, index);
            var value = header.substr(index + 1).trim();
            result[key] = value;
        });
        var nextStart = current + 4;
        this.buffer = this.buffer.slice(nextStart);
        this.index = this.index - nextStart;
        return result;
    };
    MessageBuffer.prototype.tryReadContent = function (length) {
        if (this.index < length) {
            return null;
        }
        var result = this.buffer.toString(this.encoding, 0, length);
        var nextStart = length;
        this.buffer.copy(this.buffer, 0, nextStart);
        this.index = this.index - nextStart;
        return result;
    };
    Object.defineProperty(MessageBuffer.prototype, "numberOfBytes", {
        get: function () {
            return this.index;
        },
        enumerable: true,
        configurable: true
    });
    return MessageBuffer;
}());
var MessageReader;
(function (MessageReader) {
    function is(value) {
        var candidate = value;
        return candidate && Is.func(candidate.listen) && Is.func(candidate.dispose) &&
            Is.func(candidate.onError) && Is.func(candidate.onClose) && Is.func(candidate.onPartialMessage);
    }
    MessageReader.is = is;
})(MessageReader = exports.MessageReader || (exports.MessageReader = {}));
var AbstractMessageReader = /** @class */ (function () {
    function AbstractMessageReader() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
        this.partialMessageEmitter = new events_1.Emitter();
    }
    AbstractMessageReader.prototype.dispose = function () {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
    };
    Object.defineProperty(AbstractMessageReader.prototype, "onError", {
        get: function () {
            return this.errorEmitter.event;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMessageReader.prototype.fireError = function (error) {
        this.errorEmitter.fire(this.asError(error));
    };
    Object.defineProperty(AbstractMessageReader.prototype, "onClose", {
        get: function () {
            return this.closeEmitter.event;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMessageReader.prototype.fireClose = function () {
        this.closeEmitter.fire(undefined);
    };
    Object.defineProperty(AbstractMessageReader.prototype, "onPartialMessage", {
        get: function () {
            return this.partialMessageEmitter.event;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMessageReader.prototype.firePartialMessage = function (info) {
        this.partialMessageEmitter.fire(info);
    };
    AbstractMessageReader.prototype.asError = function (error) {
        if (error instanceof Error) {
            return error;
        }
        else {
            return new Error("Reader recevied error. Reason: " + (Is.string(error.message) ? error.message : 'unknown'));
        }
    };
    return AbstractMessageReader;
}());
exports.AbstractMessageReader = AbstractMessageReader;
var StreamMessageReader = /** @class */ (function (_super) {
    __extends(StreamMessageReader, _super);
    function StreamMessageReader(readable, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        var _this = _super.call(this) || this;
        _this.readable = readable;
        _this.buffer = new MessageBuffer(encoding);
        _this._partialMessageTimeout = 10000;
        return _this;
    }
    Object.defineProperty(StreamMessageReader.prototype, "partialMessageTimeout", {
        get: function () {
            return this._partialMessageTimeout;
        },
        set: function (timeout) {
            this._partialMessageTimeout = timeout;
        },
        enumerable: true,
        configurable: true
    });
    StreamMessageReader.prototype.listen = function (callback) {
        var _this = this;
        this.nextMessageLength = -1;
        this.messageToken = 0;
        this.partialMessageTimer = undefined;
        this.callback = callback;
        this.readable.on('data', function (data) {
            _this.onData(data);
        });
        this.readable.on('error', function (error) { return _this.fireError(error); });
        this.readable.on('close', function () { return _this.fireClose(); });
    };
    StreamMessageReader.prototype.onData = function (data) {
        this.buffer.append(data);
        while (true) {
            if (this.nextMessageLength === -1) {
                var headers = this.buffer.tryReadHeaders();
                if (!headers) {
                    return;
                }
                var contentLength = headers['Content-Length'];
                if (!contentLength) {
                    throw new Error('Header must provide a Content-Length property.');
                }
                var length = parseInt(contentLength);
                if (isNaN(length)) {
                    throw new Error('Content-Length value must be a number.');
                }
                this.nextMessageLength = length;
                // Take the encoding form the header. For compatibility
                // treat both utf-8 and utf8 as node utf8
            }
            var msg = this.buffer.tryReadContent(this.nextMessageLength);
            if (msg === null) {
                /** We haven't recevied the full message yet. */
                this.setPartialMessageTimer();
                return;
            }
            this.clearPartialMessageTimer();
            this.nextMessageLength = -1;
            this.messageToken++;
            var json = JSON.parse(msg);
            this.callback(json);
        }
    };
    StreamMessageReader.prototype.clearPartialMessageTimer = function () {
        if (this.partialMessageTimer) {
            clearTimeout(this.partialMessageTimer);
            this.partialMessageTimer = undefined;
        }
    };
    StreamMessageReader.prototype.setPartialMessageTimer = function () {
        var _this = this;
        this.clearPartialMessageTimer();
        if (this._partialMessageTimeout <= 0) {
            return;
        }
        this.partialMessageTimer = setTimeout(function (token, timeout) {
            _this.partialMessageTimer = undefined;
            if (token === _this.messageToken) {
                _this.firePartialMessage({ messageToken: token, waitingTime: timeout });
                _this.setPartialMessageTimer();
            }
        }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
    };
    return StreamMessageReader;
}(AbstractMessageReader));
exports.StreamMessageReader = StreamMessageReader;
var IPCMessageReader = /** @class */ (function (_super) {
    __extends(IPCMessageReader, _super);
    function IPCMessageReader(process) {
        var _this = _super.call(this) || this;
        _this.process = process;
        var eventEmitter = _this.process;
        eventEmitter.on('error', function (error) { return _this.fireError(error); });
        eventEmitter.on('close', function () { return _this.fireClose(); });
        return _this;
    }
    IPCMessageReader.prototype.listen = function (callback) {
        this.process.on('message', callback);
    };
    return IPCMessageReader;
}(AbstractMessageReader));
exports.IPCMessageReader = IPCMessageReader;
var SocketMessageReader = /** @class */ (function (_super) {
    __extends(SocketMessageReader, _super);
    function SocketMessageReader(socket, encoding) {
        if (encoding === void 0) { encoding = 'utf-8'; }
        return _super.call(this, socket, encoding) || this;
    }
    return SocketMessageReader;
}(StreamMessageReader));
exports.SocketMessageReader = SocketMessageReader;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
var Disposable;
(function (Disposable) {
    function create(func) {
        return {
            dispose: func
        };
    }
    Disposable.create = create;
})(Disposable = exports.Disposable || (exports.Disposable = {}));
var Event;
(function (Event) {
    var _disposable = { dispose: function () { } };
    Event.None = function () { return _disposable; };
})(Event = exports.Event || (exports.Event = {}));
var CallbackList = /** @class */ (function () {
    function CallbackList() {
    }
    CallbackList.prototype.add = function (callback, context, bucket) {
        var _this = this;
        if (context === void 0) { context = null; }
        if (!this._callbacks) {
            this._callbacks = [];
            this._contexts = [];
        }
        this._callbacks.push(callback);
        this._contexts.push(context);
        if (Array.isArray(bucket)) {
            bucket.push({ dispose: function () { return _this.remove(callback, context); } });
        }
    };
    CallbackList.prototype.remove = function (callback, context) {
        if (context === void 0) { context = null; }
        if (!this._callbacks) {
            return;
        }
        var foundCallbackWithDifferentContext = false;
        for (var i = 0, len = this._callbacks.length; i < len; i++) {
            if (this._callbacks[i] === callback) {
                if (this._contexts[i] === context) {
                    // callback & context match => remove it
                    this._callbacks.splice(i, 1);
                    this._contexts.splice(i, 1);
                    return;
                }
                else {
                    foundCallbackWithDifferentContext = true;
                }
            }
        }
        if (foundCallbackWithDifferentContext) {
            throw new Error('When adding a listener with a context, you should remove it with the same context');
        }
    };
    CallbackList.prototype.invoke = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._callbacks) {
            return [];
        }
        var ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
        for (var i = 0, len = callbacks.length; i < len; i++) {
            try {
                ret.push(callbacks[i].apply(contexts[i], args));
            }
            catch (e) {
                console.error(e);
            }
        }
        return ret;
    };
    CallbackList.prototype.isEmpty = function () {
        return !this._callbacks || this._callbacks.length === 0;
    };
    CallbackList.prototype.dispose = function () {
        this._callbacks = undefined;
        this._contexts = undefined;
    };
    return CallbackList;
}());
var Emitter = /** @class */ (function () {
    function Emitter(_options) {
        this._options = _options;
    }
    Object.defineProperty(Emitter.prototype, "event", {
        /**
         * For the public to allow to subscribe
         * to events from this Emitter
         */
        get: function () {
            var _this = this;
            if (!this._event) {
                this._event = function (listener, thisArgs, disposables) {
                    if (!_this._callbacks) {
                        _this._callbacks = new CallbackList();
                    }
                    if (_this._options && _this._options.onFirstListenerAdd && _this._callbacks.isEmpty()) {
                        _this._options.onFirstListenerAdd(_this);
                    }
                    _this._callbacks.add(listener, thisArgs);
                    var result;
                    result = {
                        dispose: function () {
                            _this._callbacks.remove(listener, thisArgs);
                            result.dispose = Emitter._noop;
                            if (_this._options && _this._options.onLastListenerRemove && _this._callbacks.isEmpty()) {
                                _this._options.onLastListenerRemove(_this);
                            }
                        }
                    };
                    if (Array.isArray(disposables)) {
                        disposables.push(result);
                    }
                    return result;
                };
            }
            return this._event;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    Emitter.prototype.fire = function (event) {
        if (this._callbacks) {
            this._callbacks.invoke.call(this._callbacks, event);
        }
    };
    Emitter.prototype.dispose = function () {
        if (this._callbacks) {
            this._callbacks.dispose();
            this._callbacks = undefined;
        }
    };
    Emitter._noop = function () { };
    return Emitter;
}());
exports.Emitter = Emitter;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(12);
var Is = __webpack_require__(9);
var ContentLength = 'Content-Length: ';
var CRLF = '\r\n';
var MessageWriter;
(function (MessageWriter) {
    function is(value) {
        var candidate = value;
        return candidate && Is.func(candidate.dispose) && Is.func(candidate.onClose) &&
            Is.func(candidate.onError) && Is.func(candidate.write);
    }
    MessageWriter.is = is;
})(MessageWriter = exports.MessageWriter || (exports.MessageWriter = {}));
var AbstractMessageWriter = /** @class */ (function () {
    function AbstractMessageWriter() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
    }
    AbstractMessageWriter.prototype.dispose = function () {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
    };
    Object.defineProperty(AbstractMessageWriter.prototype, "onError", {
        get: function () {
            return this.errorEmitter.event;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMessageWriter.prototype.fireError = function (error, message, count) {
        this.errorEmitter.fire([this.asError(error), message, count]);
    };
    Object.defineProperty(AbstractMessageWriter.prototype, "onClose", {
        get: function () {
            return this.closeEmitter.event;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMessageWriter.prototype.fireClose = function () {
        this.closeEmitter.fire(undefined);
    };
    AbstractMessageWriter.prototype.asError = function (error) {
        if (error instanceof Error) {
            return error;
        }
        else {
            return new Error("Writer recevied error. Reason: " + (Is.string(error.message) ? error.message : 'unknown'));
        }
    };
    return AbstractMessageWriter;
}());
exports.AbstractMessageWriter = AbstractMessageWriter;
var StreamMessageWriter = /** @class */ (function (_super) {
    __extends(StreamMessageWriter, _super);
    function StreamMessageWriter(writable, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        var _this = _super.call(this) || this;
        _this.writable = writable;
        _this.encoding = encoding;
        _this.errorCount = 0;
        _this.writable.on('error', function (error) { return _this.fireError(error); });
        _this.writable.on('close', function () { return _this.fireClose(); });
        return _this;
    }
    StreamMessageWriter.prototype.write = function (msg) {
        var json = JSON.stringify(msg);
        var contentLength = Buffer.byteLength(json, this.encoding);
        var headers = [
            ContentLength, contentLength.toString(), CRLF,
            CRLF
        ];
        try {
            // Header must be written in ASCII encoding
            this.writable.write(headers.join(''), 'ascii');
            // Now write the content. This can be written in any encoding
            this.writable.write(json, this.encoding);
            this.errorCount = 0;
        }
        catch (error) {
            this.errorCount++;
            this.fireError(error, msg, this.errorCount);
        }
    };
    return StreamMessageWriter;
}(AbstractMessageWriter));
exports.StreamMessageWriter = StreamMessageWriter;
var IPCMessageWriter = /** @class */ (function (_super) {
    __extends(IPCMessageWriter, _super);
    function IPCMessageWriter(process) {
        var _this = _super.call(this) || this;
        _this.process = process;
        _this.errorCount = 0;
        _this.queue = [];
        _this.sending = false;
        var eventEmitter = _this.process;
        eventEmitter.on('error', function (error) { return _this.fireError(error); });
        eventEmitter.on('close', function () { return _this.fireClose; });
        return _this;
    }
    IPCMessageWriter.prototype.write = function (msg) {
        if (!this.sending && this.queue.length === 0) {
            // See https://github.com/nodejs/node/issues/7657
            this.doWriteMessage(msg);
        }
        else {
            this.queue.push(msg);
        }
    };
    IPCMessageWriter.prototype.doWriteMessage = function (msg) {
        var _this = this;
        try {
            if (this.process.send) {
                this.sending = true;
                this.process.send(msg, undefined, undefined, function (error) {
                    _this.sending = false;
                    if (error) {
                        _this.errorCount++;
                        _this.fireError(error, msg, _this.errorCount);
                    }
                    else {
                        _this.errorCount = 0;
                    }
                    if (_this.queue.length > 0) {
                        _this.doWriteMessage(_this.queue.shift());
                    }
                });
            }
        }
        catch (error) {
            this.errorCount++;
            this.fireError(error, msg, this.errorCount);
        }
    };
    return IPCMessageWriter;
}(AbstractMessageWriter));
exports.IPCMessageWriter = IPCMessageWriter;
var SocketMessageWriter = /** @class */ (function (_super) {
    __extends(SocketMessageWriter, _super);
    function SocketMessageWriter(socket, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        var _this = _super.call(this) || this;
        _this.socket = socket;
        _this.queue = [];
        _this.sending = false;
        _this.encoding = encoding;
        _this.errorCount = 0;
        _this.socket.on('error', function (error) { return _this.fireError(error); });
        _this.socket.on('close', function () { return _this.fireClose(); });
        return _this;
    }
    SocketMessageWriter.prototype.write = function (msg) {
        if (!this.sending && this.queue.length === 0) {
            // See https://github.com/nodejs/node/issues/7657
            this.doWriteMessage(msg);
        }
        else {
            this.queue.push(msg);
        }
    };
    SocketMessageWriter.prototype.doWriteMessage = function (msg) {
        var _this = this;
        var json = JSON.stringify(msg);
        var contentLength = Buffer.byteLength(json, this.encoding);
        var headers = [
            ContentLength, contentLength.toString(), CRLF,
            CRLF
        ];
        try {
            // Header must be written in ASCII encoding
            this.sending = true;
            this.socket.write(headers.join(''), 'ascii', function (error) {
                if (error) {
                    _this.handleError(error, msg);
                }
                try {
                    // Now write the content. This can be written in any encoding
                    _this.socket.write(json, _this.encoding, function (error) {
                        _this.sending = false;
                        if (error) {
                            _this.handleError(error, msg);
                        }
                        else {
                            _this.errorCount = 0;
                        }
                        if (_this.queue.length > 0) {
                            _this.doWriteMessage(_this.queue.shift());
                        }
                    });
                }
                catch (error) {
                    _this.handleError(error, msg);
                }
            });
        }
        catch (error) {
            this.handleError(error, msg);
        }
    };
    SocketMessageWriter.prototype.handleError = function (error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
    };
    return SocketMessageWriter;
}(AbstractMessageWriter));
exports.SocketMessageWriter = SocketMessageWriter;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(12);
var Is = __webpack_require__(9);
var CancellationToken;
(function (CancellationToken) {
    CancellationToken.None = Object.freeze({
        isCancellationRequested: false,
        onCancellationRequested: events_1.Event.None
    });
    CancellationToken.Cancelled = Object.freeze({
        isCancellationRequested: true,
        onCancellationRequested: events_1.Event.None
    });
    function is(value) {
        var candidate = value;
        return candidate && (candidate === CancellationToken.None
            || candidate === CancellationToken.Cancelled
            || (Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested));
    }
    CancellationToken.is = is;
})(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
var shortcutEvent = Object.freeze(function (callback, context) {
    var handle = setTimeout(callback.bind(context), 0);
    return { dispose: function () { clearTimeout(handle); } };
});
var MutableToken = /** @class */ (function () {
    function MutableToken() {
        this._isCancelled = false;
    }
    MutableToken.prototype.cancel = function () {
        if (!this._isCancelled) {
            this._isCancelled = true;
            if (this._emitter) {
                this._emitter.fire(undefined);
                this._emitter = undefined;
            }
        }
    };
    Object.defineProperty(MutableToken.prototype, "isCancellationRequested", {
        get: function () {
            return this._isCancelled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MutableToken.prototype, "onCancellationRequested", {
        get: function () {
            if (this._isCancelled) {
                return shortcutEvent;
            }
            if (!this._emitter) {
                this._emitter = new events_1.Emitter();
            }
            return this._emitter.event;
        },
        enumerable: true,
        configurable: true
    });
    return MutableToken;
}());
var CancellationTokenSource = /** @class */ (function () {
    function CancellationTokenSource() {
    }
    Object.defineProperty(CancellationTokenSource.prototype, "token", {
        get: function () {
            if (!this._token) {
                // be lazy and create the token only when
                // actually needed
                this._token = new MutableToken();
            }
            return this._token;
        },
        enumerable: true,
        configurable: true
    });
    CancellationTokenSource.prototype.cancel = function () {
        if (!this._token) {
            // save an object by returning the default
            // cancelled token when cancellation happens
            // before someone asks for the token
            this._token = CancellationToken.Cancelled;
        }
        else {
            this._token.cancel();
        }
    };
    CancellationTokenSource.prototype.dispose = function () {
        this.cancel();
    };
    return CancellationTokenSource;
}());
exports.CancellationTokenSource = CancellationTokenSource;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var Touch;
(function (Touch) {
    Touch.None = 0;
    Touch.First = 1;
    Touch.Last = 2;
})(Touch = exports.Touch || (exports.Touch = {}));
var LinkedMap = /** @class */ (function () {
    function LinkedMap() {
        this._map = new Map();
        this._head = undefined;
        this._tail = undefined;
        this._size = 0;
    }
    LinkedMap.prototype.clear = function () {
        this._map.clear();
        this._head = undefined;
        this._tail = undefined;
        this._size = 0;
    };
    LinkedMap.prototype.isEmpty = function () {
        return !this._head && !this._tail;
    };
    Object.defineProperty(LinkedMap.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    LinkedMap.prototype.has = function (key) {
        return this._map.has(key);
    };
    LinkedMap.prototype.get = function (key) {
        var item = this._map.get(key);
        if (!item) {
            return undefined;
        }
        return item.value;
    };
    LinkedMap.prototype.set = function (key, value, touch) {
        if (touch === void 0) { touch = Touch.None; }
        var item = this._map.get(key);
        if (item) {
            item.value = value;
            if (touch !== Touch.None) {
                this.touch(item, touch);
            }
        }
        else {
            item = { key: key, value: value, next: undefined, previous: undefined };
            switch (touch) {
                case Touch.None:
                    this.addItemLast(item);
                    break;
                case Touch.First:
                    this.addItemFirst(item);
                    break;
                case Touch.Last:
                    this.addItemLast(item);
                    break;
                default:
                    this.addItemLast(item);
                    break;
            }
            this._map.set(key, item);
            this._size++;
        }
    };
    LinkedMap.prototype.delete = function (key) {
        var item = this._map.get(key);
        if (!item) {
            return false;
        }
        this._map.delete(key);
        this.removeItem(item);
        this._size--;
        return true;
    };
    LinkedMap.prototype.shift = function () {
        if (!this._head && !this._tail) {
            return undefined;
        }
        if (!this._head || !this._tail) {
            throw new Error('Invalid list');
        }
        var item = this._head;
        this._map.delete(item.key);
        this.removeItem(item);
        this._size--;
        return item.value;
    };
    LinkedMap.prototype.forEach = function (callbackfn, thisArg) {
        var current = this._head;
        while (current) {
            if (thisArg) {
                callbackfn.bind(thisArg)(current.value, current.key, this);
            }
            else {
                callbackfn(current.value, current.key, this);
            }
            current = current.next;
        }
    };
    LinkedMap.prototype.forEachReverse = function (callbackfn, thisArg) {
        var current = this._tail;
        while (current) {
            if (thisArg) {
                callbackfn.bind(thisArg)(current.value, current.key, this);
            }
            else {
                callbackfn(current.value, current.key, this);
            }
            current = current.previous;
        }
    };
    LinkedMap.prototype.values = function () {
        var result = [];
        var current = this._head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    };
    LinkedMap.prototype.keys = function () {
        var result = [];
        var current = this._head;
        while (current) {
            result.push(current.key);
            current = current.next;
        }
        return result;
    };
    /* JSON RPC run on es5 which has no Symbol.iterator
    public keys(): IterableIterator<K> {
        let current = this._head;
        let iterator: IterableIterator<K> = {
            [Symbol.iterator]() {
                return iterator;
            },
            next():IteratorResult<K> {
                if (current) {
                    let result = { value: current.key, done: false };
                    current = current.next;
                    return result;
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
        return iterator;
    }

    public values(): IterableIterator<V> {
        let current = this._head;
        let iterator: IterableIterator<V> = {
            [Symbol.iterator]() {
                return iterator;
            },
            next():IteratorResult<V> {
                if (current) {
                    let result = { value: current.value, done: false };
                    current = current.next;
                    return result;
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
        return iterator;
    }
    */
    LinkedMap.prototype.addItemFirst = function (item) {
        // First time Insert
        if (!this._head && !this._tail) {
            this._tail = item;
        }
        else if (!this._head) {
            throw new Error('Invalid list');
        }
        else {
            item.next = this._head;
            this._head.previous = item;
        }
        this._head = item;
    };
    LinkedMap.prototype.addItemLast = function (item) {
        // First time Insert
        if (!this._head && !this._tail) {
            this._head = item;
        }
        else if (!this._tail) {
            throw new Error('Invalid list');
        }
        else {
            item.previous = this._tail;
            this._tail.next = item;
        }
        this._tail = item;
    };
    LinkedMap.prototype.removeItem = function (item) {
        if (item === this._head && item === this._tail) {
            this._head = undefined;
            this._tail = undefined;
        }
        else if (item === this._head) {
            this._head = item.next;
        }
        else if (item === this._tail) {
            this._tail = item.previous;
        }
        else {
            var next = item.next;
            var previous = item.previous;
            if (!next || !previous) {
                throw new Error('Invalid list');
            }
            next.previous = previous;
            previous.next = next;
        }
    };
    LinkedMap.prototype.touch = function (item, touch) {
        if (!this._head || !this._tail) {
            throw new Error('Invalid list');
        }
        if ((touch !== Touch.First && touch !== Touch.Last)) {
            return;
        }
        if (touch === Touch.First) {
            if (item === this._head) {
                return;
            }
            var next = item.next;
            var previous = item.previous;
            // Unlink the item
            if (item === this._tail) {
                // previous must be defined since item was not head but is tail
                // So there are more than on item in the map
                previous.next = undefined;
                this._tail = previous;
            }
            else {
                // Both next and previous are not undefined since item was neither head nor tail.
                next.previous = previous;
                previous.next = next;
            }
            // Insert the node at head
            item.previous = undefined;
            item.next = this._head;
            this._head.previous = item;
            this._head = item;
        }
        else if (touch === Touch.Last) {
            if (item === this._tail) {
                return;
            }
            var next = item.next;
            var previous = item.previous;
            // Unlink the item.
            if (item === this._head) {
                // next must be defined since item was not tail but is head
                // So there are more than on item in the map
                next.previous = undefined;
                this._head = next;
            }
            else {
                // Both next and previous are not undefined since item was neither head nor tail.
                next.previous = previous;
                previous.next = next;
            }
            item.next = undefined;
            item.previous = this._tail;
            this._tail.next = item;
            this._tail = item;
        }
    };
    return LinkedMap;
}());
exports.LinkedMap = LinkedMap;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __webpack_require__(1);
var os_1 = __webpack_require__(17);
var crypto_1 = __webpack_require__(18);
var net_1 = __webpack_require__(19);
var messageReader_1 = __webpack_require__(11);
var messageWriter_1 = __webpack_require__(13);
function generateRandomPipeName() {
    var randomSuffix = crypto_1.randomBytes(21).toString('hex');
    if (process.platform === 'win32') {
        return "\\\\.\\pipe\\vscode-jsonrpc-" + randomSuffix + "-sock";
    }
    else {
        // Mac/Unix: use socket file
        return path_1.join(os_1.tmpdir(), "vscode-" + randomSuffix + ".sock");
    }
}
exports.generateRandomPipeName = generateRandomPipeName;
function createClientPipeTransport(pipeName, encoding) {
    if (encoding === void 0) { encoding = 'utf-8'; }
    var connectResolve;
    var connected = new Promise(function (resolve, _reject) {
        connectResolve = resolve;
    });
    return new Promise(function (resolve, reject) {
        var server = net_1.createServer(function (socket) {
            server.close();
            connectResolve([
                new messageReader_1.SocketMessageReader(socket, encoding),
                new messageWriter_1.SocketMessageWriter(socket, encoding)
            ]);
        });
        server.on('error', reject);
        server.listen(pipeName, function () {
            server.removeListener('error', reject);
            resolve({
                onConnected: function () { return connected; }
            });
        });
    });
}
exports.createClientPipeTransport = createClientPipeTransport;
function createServerPipeTransport(pipeName, encoding) {
    if (encoding === void 0) { encoding = 'utf-8'; }
    var socket = net_1.createConnection(pipeName);
    return [
        new messageReader_1.SocketMessageReader(socket, encoding),
        new messageWriter_1.SocketMessageWriter(socket, encoding)
    ];
}
exports.createServerPipeTransport = createServerPipeTransport;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __webpack_require__(19);
var messageReader_1 = __webpack_require__(11);
var messageWriter_1 = __webpack_require__(13);
function createClientSocketTransport(port, encoding) {
    if (encoding === void 0) { encoding = 'utf-8'; }
    var connectResolve;
    var connected = new Promise(function (resolve, _reject) {
        connectResolve = resolve;
    });
    return new Promise(function (resolve, reject) {
        var server = net_1.createServer(function (socket) {
            server.close();
            connectResolve([
                new messageReader_1.SocketMessageReader(socket, encoding),
                new messageWriter_1.SocketMessageWriter(socket, encoding)
            ]);
        });
        server.on('error', reject);
        server.listen(port, '127.0.0.1', function () {
            server.removeListener('error', reject);
            resolve({
                onConnected: function () { return connected; }
            });
        });
    });
}
exports.createClientSocketTransport = createClientSocketTransport;
function createServerSocketTransport(port, encoding) {
    if (encoding === void 0) { encoding = 'utf-8'; }
    var socket = net_1.createConnection(port, '127.0.0.1');
    return [
        new messageReader_1.SocketMessageReader(socket, encoding),
        new messageWriter_1.SocketMessageWriter(socket, encoding)
    ];
}
exports.createServerSocketTransport = createServerSocketTransport;


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Position", function() { return Position; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Range", function() { return Range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Location", function() { return Location; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiagnosticRelatedInformation", function() { return DiagnosticRelatedInformation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiagnosticSeverity", function() { return DiagnosticSeverity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Diagnostic", function() { return Diagnostic; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Command", function() { return Command; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextEdit", function() { return TextEdit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextDocumentEdit", function() { return TextDocumentEdit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkspaceChange", function() { return WorkspaceChange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextDocumentIdentifier", function() { return TextDocumentIdentifier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VersionedTextDocumentIdentifier", function() { return VersionedTextDocumentIdentifier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextDocumentItem", function() { return TextDocumentItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkupKind", function() { return MarkupKind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompletionItemKind", function() { return CompletionItemKind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InsertTextFormat", function() { return InsertTextFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompletionItem", function() { return CompletionItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompletionList", function() { return CompletionList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkedString", function() { return MarkedString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParameterInformation", function() { return ParameterInformation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignatureInformation", function() { return SignatureInformation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentHighlightKind", function() { return DocumentHighlightKind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentHighlight", function() { return DocumentHighlight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SymbolKind", function() { return SymbolKind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SymbolInformation", function() { return SymbolInformation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodeActionContext", function() { return CodeActionContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodeLens", function() { return CodeLens; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattingOptions", function() { return FormattingOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentLink", function() { return DocumentLink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EOL", function() { return EOL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextDocument", function() { return TextDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextDocumentSaveReason", function() { return TextDocumentSaveReason; });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

/**
 * The Position namespace provides helper functions to work with
 * [Position](#Position) literals.
 */
var Position;
(function (Position) {
    /**
     * Creates a new Position literal from the given line and character.
     * @param line The position's line.
     * @param character The position's character.
     */
    function create(line, character) {
        return { line: line, character: character };
    }
    Position.create = create;
    /**
     * Checks whether the given liternal conforms to the [Position](#Position) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.number(candidate.line) && Is.number(candidate.character);
    }
    Position.is = is;
})(Position || (Position = {}));
/**
 * The Range namespace provides helper functions to work with
 * [Range](#Range) literals.
 */
var Range;
(function (Range) {
    function create(one, two, three, four) {
        if (Is.number(one) && Is.number(two) && Is.number(three) && Is.number(four)) {
            return { start: Position.create(one, two), end: Position.create(three, four) };
        }
        else if (Position.is(one) && Position.is(two)) {
            return { start: one, end: two };
        }
        else {
            throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
        }
    }
    Range.create = create;
    /**
     * Checks whether the given literal conforms to the [Range](#Range) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
    }
    Range.is = is;
})(Range || (Range = {}));
/**
 * The Location namespace provides helper functions to work with
 * [Location](#Location) literals.
 */
var Location;
(function (Location) {
    /**
     * Creates a Location literal.
     * @param uri The location's uri.
     * @param range The location's range.
     */
    function create(uri, range) {
        return { uri: uri, range: range };
    }
    Location.create = create;
    /**
     * Checks whether the given literal conforms to the [Location](#Location) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
    }
    Location.is = is;
})(Location || (Location = {}));
/**
 * The DiagnosticRelatedInformation namespace provides helper functions to work with
 * [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) literals.
 */
var DiagnosticRelatedInformation;
(function (DiagnosticRelatedInformation) {
    /**
     * Creates a new DiagnosticRelatedInformation literal.
     */
    function create(location, message) {
        return {
            location: location,
            message: message
        };
    }
    DiagnosticRelatedInformation.create = create;
    /**
     * Checks whether the given literal conforms to the [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
    }
    DiagnosticRelatedInformation.is = is;
})(DiagnosticRelatedInformation || (DiagnosticRelatedInformation = {}));
/**
 * The diagnostic's severity.
 */
var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    /**
     * Reports an error.
     */
    DiagnosticSeverity.Error = 1;
    /**
     * Reports a warning.
     */
    DiagnosticSeverity.Warning = 2;
    /**
     * Reports an information.
     */
    DiagnosticSeverity.Information = 3;
    /**
     * Reports a hint.
     */
    DiagnosticSeverity.Hint = 4;
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
/**
 * The Diagnostic namespace provides helper functions to work with
 * [Diagnostic](#Diagnostic) literals.
 */
var Diagnostic;
(function (Diagnostic) {
    /**
     * Creates a new Diagnostic literal.
     */
    function create(range, message, severity, code, source, relatedInformation) {
        var result = { range: range, message: message };
        if (Is.defined(severity)) {
            result.severity = severity;
        }
        if (Is.defined(code)) {
            result.code = code;
        }
        if (Is.defined(source)) {
            result.source = source;
        }
        if (Is.defined(relatedInformation)) {
            result.relatedInformation = relatedInformation;
        }
        return result;
    }
    Diagnostic.create = create;
    /**
     * Checks whether the given literal conforms to the [Diagnostic](#Diagnostic) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate)
            && Range.is(candidate.range)
            && Is.string(candidate.message)
            && (Is.number(candidate.severity) || Is.undefined(candidate.severity))
            && (Is.number(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code))
            && (Is.string(candidate.source) || Is.undefined(candidate.source))
            && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
    }
    Diagnostic.is = is;
})(Diagnostic || (Diagnostic = {}));
/**
 * The Command namespace provides helper functions to work with
 * [Command](#Command) literals.
 */
var Command;
(function (Command) {
    /**
     * Creates a new Command literal.
     */
    function create(title, command) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var result = { title: title, command: command };
        if (Is.defined(args) && args.length > 0) {
            result.arguments = args;
        }
        return result;
    }
    Command.create = create;
    /**
     * Checks whether the given literal conforms to the [Command](#Command) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.title);
    }
    Command.is = is;
})(Command || (Command = {}));
/**
 * The TextEdit namespace provides helper function to create replace,
 * insert and delete edits more easily.
 */
var TextEdit;
(function (TextEdit) {
    /**
     * Creates a replace text edit.
     * @param range The range of text to be replaced.
     * @param newText The new text.
     */
    function replace(range, newText) {
        return { range: range, newText: newText };
    }
    TextEdit.replace = replace;
    /**
     * Creates a insert text edit.
     * @param position The position to insert the text at.
     * @param newText The text to be inserted.
     */
    function insert(position, newText) {
        return { range: { start: position, end: position }, newText: newText };
    }
    TextEdit.insert = insert;
    /**
     * Creates a delete text edit.
     * @param range The range of text to be deleted.
     */
    function del(range) {
        return { range: range, newText: '' };
    }
    TextEdit.del = del;
})(TextEdit || (TextEdit = {}));
/**
 * The TextDocumentEdit namespace provides helper function to create
 * an edit that manipulates a text document.
 */
var TextDocumentEdit;
(function (TextDocumentEdit) {
    /**
     * Creates a new `TextDocumentEdit`
     */
    function create(textDocument, edits) {
        return { textDocument: textDocument, edits: edits };
    }
    TextDocumentEdit.create = create;
    function is(value) {
        var candidate = value;
        return Is.defined(candidate)
            && VersionedTextDocumentIdentifier.is(candidate.textDocument)
            && Array.isArray(candidate.edits);
    }
    TextDocumentEdit.is = is;
})(TextDocumentEdit || (TextDocumentEdit = {}));
var TextEditChangeImpl = /** @class */ (function () {
    function TextEditChangeImpl(edits) {
        this.edits = edits;
    }
    TextEditChangeImpl.prototype.insert = function (position, newText) {
        this.edits.push(TextEdit.insert(position, newText));
    };
    TextEditChangeImpl.prototype.replace = function (range, newText) {
        this.edits.push(TextEdit.replace(range, newText));
    };
    TextEditChangeImpl.prototype.delete = function (range) {
        this.edits.push(TextEdit.del(range));
    };
    TextEditChangeImpl.prototype.add = function (edit) {
        this.edits.push(edit);
    };
    TextEditChangeImpl.prototype.all = function () {
        return this.edits;
    };
    TextEditChangeImpl.prototype.clear = function () {
        this.edits.splice(0, this.edits.length);
    };
    return TextEditChangeImpl;
}());
/**
 * A workspace change helps constructing changes to a workspace.
 */
var WorkspaceChange = /** @class */ (function () {
    function WorkspaceChange(workspaceEdit) {
        var _this = this;
        this._textEditChanges = Object.create(null);
        if (workspaceEdit) {
            this._workspaceEdit = workspaceEdit;
            if (workspaceEdit.documentChanges) {
                workspaceEdit.documentChanges.forEach(function (textDocumentEdit) {
                    var textEditChange = new TextEditChangeImpl(textDocumentEdit.edits);
                    _this._textEditChanges[textDocumentEdit.textDocument.uri] = textEditChange;
                });
            }
            else if (workspaceEdit.changes) {
                Object.keys(workspaceEdit.changes).forEach(function (key) {
                    var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                    _this._textEditChanges[key] = textEditChange;
                });
            }
        }
    }
    Object.defineProperty(WorkspaceChange.prototype, "edit", {
        /**
         * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
         * use to be returned from a workspace edit operation like rename.
         */
        get: function () {
            return this._workspaceEdit;
        },
        enumerable: true,
        configurable: true
    });
    WorkspaceChange.prototype.getTextEditChange = function (key) {
        if (VersionedTextDocumentIdentifier.is(key)) {
            if (!this._workspaceEdit) {
                this._workspaceEdit = {
                    documentChanges: []
                };
            }
            if (!this._workspaceEdit.documentChanges) {
                throw new Error('Workspace edit is not configured for versioned document changes.');
            }
            var textDocument = key;
            var result = this._textEditChanges[textDocument.uri];
            if (!result) {
                var edits = [];
                var textDocumentEdit = {
                    textDocument: textDocument,
                    edits: edits
                };
                this._workspaceEdit.documentChanges.push(textDocumentEdit);
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[textDocument.uri] = result;
            }
            return result;
        }
        else {
            if (!this._workspaceEdit) {
                this._workspaceEdit = {
                    changes: Object.create(null)
                };
            }
            if (!this._workspaceEdit.changes) {
                throw new Error('Workspace edit is not configured for normal text edit changes.');
            }
            var result = this._textEditChanges[key];
            if (!result) {
                var edits = [];
                this._workspaceEdit.changes[key] = edits;
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[key] = result;
            }
            return result;
        }
    };
    return WorkspaceChange;
}());

/**
 * The TextDocumentIdentifier namespace provides helper functions to work with
 * [TextDocumentIdentifier](#TextDocumentIdentifier) literals.
 */
var TextDocumentIdentifier;
(function (TextDocumentIdentifier) {
    /**
     * Creates a new TextDocumentIdentifier literal.
     * @param uri The document's uri.
     */
    function create(uri) {
        return { uri: uri };
    }
    TextDocumentIdentifier.create = create;
    /**
     * Checks whether the given literal conforms to the [TextDocumentIdentifier](#TextDocumentIdentifier) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.uri);
    }
    TextDocumentIdentifier.is = is;
})(TextDocumentIdentifier || (TextDocumentIdentifier = {}));
/**
 * The VersionedTextDocumentIdentifier namespace provides helper functions to work with
 * [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) literals.
 */
var VersionedTextDocumentIdentifier;
(function (VersionedTextDocumentIdentifier) {
    /**
     * Creates a new VersionedTextDocumentIdentifier literal.
     * @param uri The document's uri.
     * @param uri The document's text.
     */
    function create(uri, version) {
        return { uri: uri, version: version };
    }
    VersionedTextDocumentIdentifier.create = create;
    /**
     * Checks whether the given literal conforms to the [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.uri) && Is.number(candidate.version);
    }
    VersionedTextDocumentIdentifier.is = is;
})(VersionedTextDocumentIdentifier || (VersionedTextDocumentIdentifier = {}));
/**
 * The TextDocumentItem namespace provides helper functions to work with
 * [TextDocumentItem](#TextDocumentItem) literals.
 */
var TextDocumentItem;
(function (TextDocumentItem) {
    /**
     * Creates a new TextDocumentItem literal.
     * @param uri The document's uri.
     * @param languageId The document's language identifier.
     * @param version The document's version number.
     * @param text The document's text.
     */
    function create(uri, languageId, version, text) {
        return { uri: uri, languageId: languageId, version: version, text: text };
    }
    TextDocumentItem.create = create;
    /**
     * Checks whether the given literal conforms to the [TextDocumentItem](#TextDocumentItem) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.number(candidate.version) && Is.string(candidate.text);
    }
    TextDocumentItem.is = is;
})(TextDocumentItem || (TextDocumentItem = {}));
/**
 * Describes the content type that a client supports in various
 * result literals like `Hover`, `ParameterInfo` or `CompletionItem`.
 *
 * Please note that `MarkupKinds` must not start with a `$`. This kinds
 * are reserved for internal usage.
 */
var MarkupKind;
(function (MarkupKind) {
    /**
     * Plain text is supported as a content format
     */
    MarkupKind.PlainText = 'plaintext';
    /**
     * Markdown is supported as a content format
     */
    MarkupKind.Markdown = 'markdown';
})(MarkupKind || (MarkupKind = {}));
/**
 * The kind of a completion entry.
 */
var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind.Text = 1;
    CompletionItemKind.Method = 2;
    CompletionItemKind.Function = 3;
    CompletionItemKind.Constructor = 4;
    CompletionItemKind.Field = 5;
    CompletionItemKind.Variable = 6;
    CompletionItemKind.Class = 7;
    CompletionItemKind.Interface = 8;
    CompletionItemKind.Module = 9;
    CompletionItemKind.Property = 10;
    CompletionItemKind.Unit = 11;
    CompletionItemKind.Value = 12;
    CompletionItemKind.Enum = 13;
    CompletionItemKind.Keyword = 14;
    CompletionItemKind.Snippet = 15;
    CompletionItemKind.Color = 16;
    CompletionItemKind.File = 17;
    CompletionItemKind.Reference = 18;
    CompletionItemKind.Folder = 19;
    CompletionItemKind.EnumMember = 20;
    CompletionItemKind.Constant = 21;
    CompletionItemKind.Struct = 22;
    CompletionItemKind.Event = 23;
    CompletionItemKind.Operator = 24;
    CompletionItemKind.TypeParameter = 25;
})(CompletionItemKind || (CompletionItemKind = {}));
/**
 * Defines whether the insert text in a completion item should be interpreted as
 * plain text or a snippet.
 */
var InsertTextFormat;
(function (InsertTextFormat) {
    /**
     * The primary text to be inserted is treated as a plain string.
     */
    InsertTextFormat.PlainText = 1;
    /**
     * The primary text to be inserted is treated as a snippet.
     *
     * A snippet can define tab stops and placeholders with `$1`, `$2`
     * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
     * the end of the snippet. Placeholders with equal identifiers are linked,
     * that is typing in one will update others too.
     *
     * See also: https://github.com/Microsoft/vscode/blob/master/src/vs/editor/contrib/snippet/common/snippet.md
     */
    InsertTextFormat.Snippet = 2;
})(InsertTextFormat || (InsertTextFormat = {}));
/**
 * The CompletionItem namespace provides functions to deal with
 * completion items.
 */
var CompletionItem;
(function (CompletionItem) {
    /**
     * Create a completion item and seed it with a label.
     * @param label The completion item's label
     */
    function create(label) {
        return { label: label };
    }
    CompletionItem.create = create;
})(CompletionItem || (CompletionItem = {}));
/**
 * The CompletionList namespace provides functions to deal with
 * completion lists.
 */
var CompletionList;
(function (CompletionList) {
    /**
     * Creates a new completion list.
     *
     * @param items The completion items.
     * @param isIncomplete The list is not complete.
     */
    function create(items, isIncomplete) {
        return { items: items ? items : [], isIncomplete: !!isIncomplete };
    }
    CompletionList.create = create;
})(CompletionList || (CompletionList = {}));
var MarkedString;
(function (MarkedString) {
    /**
     * Creates a marked string from plain text.
     *
     * @param plainText The plain text.
     */
    function fromPlainText(plainText) {
        return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&"); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
    }
    MarkedString.fromPlainText = fromPlainText;
})(MarkedString || (MarkedString = {}));
/**
 * The ParameterInformation namespace provides helper functions to work with
 * [ParameterInformation](#ParameterInformation) literals.
 */
var ParameterInformation;
(function (ParameterInformation) {
    /**
     * Creates a new parameter information literal.
     *
     * @param label A label string.
     * @param documentation A doc string.
     */
    function create(label, documentation) {
        return documentation ? { label: label, documentation: documentation } : { label: label };
    }
    ParameterInformation.create = create;
    ;
})(ParameterInformation || (ParameterInformation = {}));
/**
 * The SignatureInformation namespace provides helper functions to work with
 * [SignatureInformation](#SignatureInformation) literals.
 */
var SignatureInformation;
(function (SignatureInformation) {
    function create(label, documentation) {
        var parameters = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            parameters[_i - 2] = arguments[_i];
        }
        var result = { label: label };
        if (Is.defined(documentation)) {
            result.documentation = documentation;
        }
        if (Is.defined(parameters)) {
            result.parameters = parameters;
        }
        else {
            result.parameters = [];
        }
        return result;
    }
    SignatureInformation.create = create;
})(SignatureInformation || (SignatureInformation = {}));
/**
 * A document highlight kind.
 */
var DocumentHighlightKind;
(function (DocumentHighlightKind) {
    /**
     * A textual occurrence.
     */
    DocumentHighlightKind.Text = 1;
    /**
     * Read-access of a symbol, like reading a variable.
     */
    DocumentHighlightKind.Read = 2;
    /**
     * Write-access of a symbol, like writing to a variable.
     */
    DocumentHighlightKind.Write = 3;
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
/**
 * DocumentHighlight namespace to provide helper functions to work with
 * [DocumentHighlight](#DocumentHighlight) literals.
 */
var DocumentHighlight;
(function (DocumentHighlight) {
    /**
     * Create a DocumentHighlight object.
     * @param range The range the highlight applies to.
     */
    function create(range, kind) {
        var result = { range: range };
        if (Is.number(kind)) {
            result.kind = kind;
        }
        return result;
    }
    DocumentHighlight.create = create;
})(DocumentHighlight || (DocumentHighlight = {}));
/**
 * A symbol kind.
 */
var SymbolKind;
(function (SymbolKind) {
    SymbolKind.File = 1;
    SymbolKind.Module = 2;
    SymbolKind.Namespace = 3;
    SymbolKind.Package = 4;
    SymbolKind.Class = 5;
    SymbolKind.Method = 6;
    SymbolKind.Property = 7;
    SymbolKind.Field = 8;
    SymbolKind.Constructor = 9;
    SymbolKind.Enum = 10;
    SymbolKind.Interface = 11;
    SymbolKind.Function = 12;
    SymbolKind.Variable = 13;
    SymbolKind.Constant = 14;
    SymbolKind.String = 15;
    SymbolKind.Number = 16;
    SymbolKind.Boolean = 17;
    SymbolKind.Array = 18;
    SymbolKind.Object = 19;
    SymbolKind.Key = 20;
    SymbolKind.Null = 21;
    SymbolKind.EnumMember = 22;
    SymbolKind.Struct = 23;
    SymbolKind.Event = 24;
    SymbolKind.Operator = 25;
    SymbolKind.TypeParameter = 26;
})(SymbolKind || (SymbolKind = {}));
var SymbolInformation;
(function (SymbolInformation) {
    /**
     * Creates a new symbol information literal.
     *
     * @param name The name of the symbol.
     * @param kind The kind of the symbol.
     * @param range The range of the location of the symbol.
     * @param uri The resource of the location of symbol, defaults to the current document.
     * @param containerName The name of the symbol containing the symbol.
     */
    function create(name, kind, range, uri, containerName) {
        var result = {
            name: name,
            kind: kind,
            location: { uri: uri, range: range }
        };
        if (containerName) {
            result.containerName = containerName;
        }
        return result;
    }
    SymbolInformation.create = create;
})(SymbolInformation || (SymbolInformation = {}));
/**
 * The CodeActionContext namespace provides helper functions to work with
 * [CodeActionContext](#CodeActionContext) literals.
 */
var CodeActionContext;
(function (CodeActionContext) {
    /**
     * Creates a new CodeActionContext literal.
     */
    function create(diagnostics) {
        return { diagnostics: diagnostics };
    }
    CodeActionContext.create = create;
    /**
     * Checks whether the given literal conforms to the [CodeActionContext](#CodeActionContext) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is);
    }
    CodeActionContext.is = is;
})(CodeActionContext || (CodeActionContext = {}));
/**
 * The CodeLens namespace provides helper functions to work with
 * [CodeLens](#CodeLens) literals.
 */
var CodeLens;
(function (CodeLens) {
    /**
     * Creates a new CodeLens literal.
     */
    function create(range, data) {
        var result = { range: range };
        if (Is.defined(data))
            result.data = data;
        return result;
    }
    CodeLens.create = create;
    /**
     * Checks whether the given literal conforms to the [CodeLens](#CodeLens) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
    }
    CodeLens.is = is;
})(CodeLens || (CodeLens = {}));
/**
 * The FormattingOptions namespace provides helper functions to work with
 * [FormattingOptions](#FormattingOptions) literals.
 */
var FormattingOptions;
(function (FormattingOptions) {
    /**
     * Creates a new FormattingOptions literal.
     */
    function create(tabSize, insertSpaces) {
        return { tabSize: tabSize, insertSpaces: insertSpaces };
    }
    FormattingOptions.create = create;
    /**
     * Checks whether the given literal conforms to the [FormattingOptions](#FormattingOptions) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.number(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
    }
    FormattingOptions.is = is;
})(FormattingOptions || (FormattingOptions = {}));
/**
 * A document link is a range in a text document that links to an internal or external resource, like another
 * text document or a web site.
 */
var DocumentLink = /** @class */ (function () {
    function DocumentLink() {
    }
    return DocumentLink;
}());

/**
 * The DocumentLink namespace provides helper functions to work with
 * [DocumentLink](#DocumentLink) literals.
 */
(function (DocumentLink) {
    /**
     * Creates a new DocumentLink literal.
     */
    function create(range, target, data) {
        return { range: range, target: target, data: data };
    }
    DocumentLink.create = create;
    /**
     * Checks whether the given literal conforms to the [DocumentLink](#DocumentLink) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
    }
    DocumentLink.is = is;
})(DocumentLink || (DocumentLink = {}));
var EOL = ['\n', '\r\n', '\r'];
var TextDocument;
(function (TextDocument) {
    /**
     * Creates a new ITextDocument literal from the given uri and content.
     * @param uri The document's uri.
     * @param languageId  The document's language Id.
     * @param content The document's content.
     */
    function create(uri, languageId, version, content) {
        return new FullTextDocument(uri, languageId, version, content);
    }
    TextDocument.create = create;
    /**
     * Checks whether the given literal conforms to the [ITextDocument](#ITextDocument) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.number(candidate.lineCount)
            && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
    }
    TextDocument.is = is;
    function applyEdits(document, edits) {
        var text = document.getText();
        var sortedEdits = mergeSort(edits, function (a, b) {
            var diff = a.range.start.line - b.range.start.line;
            if (diff === 0) {
                return a.range.start.character - b.range.start.character;
            }
            return diff;
        });
        var lastModifiedOffset = text.length;
        for (var i = sortedEdits.length - 1; i >= 0; i--) {
            var e = sortedEdits[i];
            var startOffset = document.offsetAt(e.range.start);
            var endOffset = document.offsetAt(e.range.end);
            if (endOffset <= lastModifiedOffset) {
                text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
            }
            else {
                throw new Error('Ovelapping edit');
            }
            lastModifiedOffset = startOffset;
        }
        return text;
    }
    TextDocument.applyEdits = applyEdits;
    function mergeSort(data, compare) {
        if (data.length <= 1) {
            // sorted
            return data;
        }
        var p = (data.length / 2) | 0;
        var left = data.slice(0, p);
        var right = data.slice(p);
        mergeSort(left, compare);
        mergeSort(right, compare);
        var leftIdx = 0;
        var rightIdx = 0;
        var i = 0;
        while (leftIdx < left.length && rightIdx < right.length) {
            var ret = compare(left[leftIdx], right[rightIdx]);
            if (ret <= 0) {
                // smaller_equal -> take left to preserve order
                data[i++] = left[leftIdx++];
            }
            else {
                // greater -> take right
                data[i++] = right[rightIdx++];
            }
        }
        while (leftIdx < left.length) {
            data[i++] = left[leftIdx++];
        }
        while (rightIdx < right.length) {
            data[i++] = right[rightIdx++];
        }
        return data;
    }
})(TextDocument || (TextDocument = {}));
/**
 * Represents reasons why a text document is saved.
 */
var TextDocumentSaveReason;
(function (TextDocumentSaveReason) {
    /**
     * Manually triggered, e.g. by the user pressing save, by starting debugging,
     * or by an API call.
     */
    TextDocumentSaveReason.Manual = 1;
    /**
     * Automatic after a delay.
     */
    TextDocumentSaveReason.AfterDelay = 2;
    /**
     * When the editor lost focus.
     */
    TextDocumentSaveReason.FocusOut = 3;
})(TextDocumentSaveReason || (TextDocumentSaveReason = {}));
var FullTextDocument = /** @class */ (function () {
    function FullTextDocument(uri, languageId, version, content) {
        this._uri = uri;
        this._languageId = languageId;
        this._version = version;
        this._content = content;
        this._lineOffsets = null;
    }
    Object.defineProperty(FullTextDocument.prototype, "uri", {
        get: function () {
            return this._uri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FullTextDocument.prototype, "languageId", {
        get: function () {
            return this._languageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FullTextDocument.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    FullTextDocument.prototype.getText = function (range) {
        if (range) {
            var start = this.offsetAt(range.start);
            var end = this.offsetAt(range.end);
            return this._content.substring(start, end);
        }
        return this._content;
    };
    FullTextDocument.prototype.update = function (event, version) {
        this._content = event.text;
        this._version = version;
        this._lineOffsets = null;
    };
    FullTextDocument.prototype.getLineOffsets = function () {
        if (this._lineOffsets === null) {
            var lineOffsets = [];
            var text = this._content;
            var isLineStart = true;
            for (var i = 0; i < text.length; i++) {
                if (isLineStart) {
                    lineOffsets.push(i);
                    isLineStart = false;
                }
                var ch = text.charAt(i);
                isLineStart = (ch === '\r' || ch === '\n');
                if (ch === '\r' && i + 1 < text.length && text.charAt(i + 1) === '\n') {
                    i++;
                }
            }
            if (isLineStart && text.length > 0) {
                lineOffsets.push(text.length);
            }
            this._lineOffsets = lineOffsets;
        }
        return this._lineOffsets;
    };
    FullTextDocument.prototype.positionAt = function (offset) {
        offset = Math.max(Math.min(offset, this._content.length), 0);
        var lineOffsets = this.getLineOffsets();
        var low = 0, high = lineOffsets.length;
        if (high === 0) {
            return Position.create(0, offset);
        }
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (lineOffsets[mid] > offset) {
                high = mid;
            }
            else {
                low = mid + 1;
            }
        }
        // low is the least x for which the line offset is larger than the current offset
        // or array.length if no line offset is larger than the current offset
        var line = low - 1;
        return Position.create(line, offset - lineOffsets[line]);
    };
    FullTextDocument.prototype.offsetAt = function (position) {
        var lineOffsets = this.getLineOffsets();
        if (position.line >= lineOffsets.length) {
            return this._content.length;
        }
        else if (position.line < 0) {
            return 0;
        }
        var lineOffset = lineOffsets[position.line];
        var nextLineOffset = (position.line + 1 < lineOffsets.length) ? lineOffsets[position.line + 1] : this._content.length;
        return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
    };
    Object.defineProperty(FullTextDocument.prototype, "lineCount", {
        get: function () {
            return this.getLineOffsets().length;
        },
        enumerable: true,
        configurable: true
    });
    return FullTextDocument;
}());
var Is;
(function (Is) {
    var toString = Object.prototype.toString;
    function defined(value) {
        return typeof value !== 'undefined';
    }
    Is.defined = defined;
    function undefined(value) {
        return typeof value === 'undefined';
    }
    Is.undefined = undefined;
    function boolean(value) {
        return value === true || value === false;
    }
    Is.boolean = boolean;
    function string(value) {
        return toString.call(value) === '[object String]';
    }
    Is.string = string;
    function number(value) {
        return toString.call(value) === '[object Number]';
    }
    Is.number = number;
    function func(value) {
        return toString.call(value) === '[object Function]';
    }
    Is.func = func;
    function typedArray(value, check) {
        return Array.isArray(value) && value.every(check);
    }
    Is.typedArray = typedArray;
})(Is || (Is = {}));


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const Is = __webpack_require__(23);
const vscode_jsonrpc_1 = __webpack_require__(8);
const protocol_implementation_1 = __webpack_require__(24);
exports.ImplementationRequest = protocol_implementation_1.ImplementationRequest;
const protocol_typeDefinition_1 = __webpack_require__(25);
exports.TypeDefinitionRequest = protocol_typeDefinition_1.TypeDefinitionRequest;
const protocol_workspaceFolders_1 = __webpack_require__(26);
exports.WorkspaceFoldersRequest = protocol_workspaceFolders_1.WorkspaceFoldersRequest;
exports.DidChangeWorkspaceFoldersNotification = protocol_workspaceFolders_1.DidChangeWorkspaceFoldersNotification;
const protocol_configuration_1 = __webpack_require__(27);
exports.ConfigurationRequest = protocol_configuration_1.ConfigurationRequest;
const protocol_colorProvider_1 = __webpack_require__(28);
exports.DocumentColorRequest = protocol_colorProvider_1.DocumentColorRequest;
exports.ColorPresentationRequest = protocol_colorProvider_1.ColorPresentationRequest;
var DocumentFilter;
(function (DocumentFilter) {
    function is(value) {
        let candidate = value;
        return Is.string(candidate.language) || Is.string(candidate.scheme) || Is.string(candidate.pattern);
    }
    DocumentFilter.is = is;
})(DocumentFilter = exports.DocumentFilter || (exports.DocumentFilter = {}));
/**
 * The `client/registerCapability` request is sent from the server to the client to register a new capability
 * handler on the client side.
 */
var RegistrationRequest;
(function (RegistrationRequest) {
    RegistrationRequest.type = new vscode_jsonrpc_1.RequestType('client/registerCapability');
})(RegistrationRequest = exports.RegistrationRequest || (exports.RegistrationRequest = {}));
/**
 * The `client/unregisterCapability` request is sent from the server to the client to unregister a previously registered capability
 * handler on the client side.
 */
var UnregistrationRequest;
(function (UnregistrationRequest) {
    UnregistrationRequest.type = new vscode_jsonrpc_1.RequestType('client/unregisterCapability');
})(UnregistrationRequest = exports.UnregistrationRequest || (exports.UnregistrationRequest = {}));
/**
 * Defines how the host (editor) should sync
 * document changes to the language server.
 */
var TextDocumentSyncKind;
(function (TextDocumentSyncKind) {
    /**
     * Documents should not be synced at all.
     */
    TextDocumentSyncKind.None = 0;
    /**
     * Documents are synced by always sending the full content
     * of the document.
     */
    TextDocumentSyncKind.Full = 1;
    /**
     * Documents are synced by sending the full content on open.
     * After that only incremental updates to the document are
     * send.
     */
    TextDocumentSyncKind.Incremental = 2;
})(TextDocumentSyncKind = exports.TextDocumentSyncKind || (exports.TextDocumentSyncKind = {}));
/**
 * The initialize request is sent from the client to the server.
 * It is sent once as the request after starting up the server.
 * The requests parameter is of type [InitializeParams](#InitializeParams)
 * the response if of type [InitializeResult](#InitializeResult) of a Thenable that
 * resolves to such.
 */
var InitializeRequest;
(function (InitializeRequest) {
    InitializeRequest.type = new vscode_jsonrpc_1.RequestType('initialize');
})(InitializeRequest = exports.InitializeRequest || (exports.InitializeRequest = {}));
/**
 * Known error codes for an `InitializeError`;
 */
var InitializeError;
(function (InitializeError) {
    /**
     * If the protocol version provided by the client can't be handled by the server.
     * @deprecated This initialize error got replaced by client capabilities. There is
     * no version handshake in version 3.0x
     */
    InitializeError.unknownProtocolVersion = 1;
})(InitializeError = exports.InitializeError || (exports.InitializeError = {}));
/**
 * The intialized notification is sent from the client to the
 * server after the client is fully initialized and the server
 * is allowed to send requests from the server to the client.
 */
var InitializedNotification;
(function (InitializedNotification) {
    InitializedNotification.type = new vscode_jsonrpc_1.NotificationType('initialized');
})(InitializedNotification = exports.InitializedNotification || (exports.InitializedNotification = {}));
//---- Shutdown Method ----
/**
 * A shutdown request is sent from the client to the server.
 * It is sent once when the client decides to shutdown the
 * server. The only notification that is sent after a shutdown request
 * is the exit event.
 */
var ShutdownRequest;
(function (ShutdownRequest) {
    ShutdownRequest.type = new vscode_jsonrpc_1.RequestType0('shutdown');
})(ShutdownRequest = exports.ShutdownRequest || (exports.ShutdownRequest = {}));
//---- Exit Notification ----
/**
 * The exit event is sent from the client to the server to
 * ask the server to exit its process.
 */
var ExitNotification;
(function (ExitNotification) {
    ExitNotification.type = new vscode_jsonrpc_1.NotificationType0('exit');
})(ExitNotification = exports.ExitNotification || (exports.ExitNotification = {}));
//---- Configuration notification ----
/**
 * The configuration change notification is sent from the client to the server
 * when the client's configuration has changed. The notification contains
 * the changed configuration as defined by the language client.
 */
var DidChangeConfigurationNotification;
(function (DidChangeConfigurationNotification) {
    DidChangeConfigurationNotification.type = new vscode_jsonrpc_1.NotificationType('workspace/didChangeConfiguration');
})(DidChangeConfigurationNotification = exports.DidChangeConfigurationNotification || (exports.DidChangeConfigurationNotification = {}));
//---- Message show and log notifications ----
/**
 * The message type
 */
var MessageType;
(function (MessageType) {
    /**
     * An error message.
     */
    MessageType.Error = 1;
    /**
     * A warning message.
     */
    MessageType.Warning = 2;
    /**
     * An information message.
     */
    MessageType.Info = 3;
    /**
     * A log message.
     */
    MessageType.Log = 4;
})(MessageType = exports.MessageType || (exports.MessageType = {}));
/**
 * The show message notification is sent from a server to a client to ask
 * the client to display a particular message in the user interface.
 */
var ShowMessageNotification;
(function (ShowMessageNotification) {
    ShowMessageNotification.type = new vscode_jsonrpc_1.NotificationType('window/showMessage');
})(ShowMessageNotification = exports.ShowMessageNotification || (exports.ShowMessageNotification = {}));
/**
 * The show message request is sent from the server to the client to show a message
 * and a set of options actions to the user.
 */
var ShowMessageRequest;
(function (ShowMessageRequest) {
    ShowMessageRequest.type = new vscode_jsonrpc_1.RequestType('window/showMessageRequest');
})(ShowMessageRequest = exports.ShowMessageRequest || (exports.ShowMessageRequest = {}));
/**
 * The log message notification is sent from the server to the client to ask
 * the client to log a particular message.
 */
var LogMessageNotification;
(function (LogMessageNotification) {
    LogMessageNotification.type = new vscode_jsonrpc_1.NotificationType('window/logMessage');
})(LogMessageNotification = exports.LogMessageNotification || (exports.LogMessageNotification = {}));
//---- Telemetry notification
/**
 * The telemetry event notification is sent from the server to the client to ask
 * the client to log telemetry data.
 */
var TelemetryEventNotification;
(function (TelemetryEventNotification) {
    TelemetryEventNotification.type = new vscode_jsonrpc_1.NotificationType('telemetry/event');
})(TelemetryEventNotification = exports.TelemetryEventNotification || (exports.TelemetryEventNotification = {}));
/**
 * The document open notification is sent from the client to the server to signal
 * newly opened text documents. The document's truth is now managed by the client
 * and the server must not try to read the document's truth using the document's
 * uri. Open in this sense means it is managed by the client. It doesn't necessarily
 * mean that its content is presented in an editor. An open notification must not
 * be sent more than once without a corresponding close notification send before.
 * This means open and close notification must be balanced and the max open count
 * is one.
 */
var DidOpenTextDocumentNotification;
(function (DidOpenTextDocumentNotification) {
    DidOpenTextDocumentNotification.type = new vscode_jsonrpc_1.NotificationType('textDocument/didOpen');
})(DidOpenTextDocumentNotification = exports.DidOpenTextDocumentNotification || (exports.DidOpenTextDocumentNotification = {}));
/**
 * The document change notification is sent from the client to the server to signal
 * changes to a text document.
 */
var DidChangeTextDocumentNotification;
(function (DidChangeTextDocumentNotification) {
    DidChangeTextDocumentNotification.type = new vscode_jsonrpc_1.NotificationType('textDocument/didChange');
})(DidChangeTextDocumentNotification = exports.DidChangeTextDocumentNotification || (exports.DidChangeTextDocumentNotification = {}));
/**
 * The document close notification is sent from the client to the server when
 * the document got closed in the client. The document's truth now exists where
 * the document's uri points to (e.g. if the document's uri is a file uri the
 * truth now exists on disk). As with the open notification the close notification
 * is about managing the document's content. Receiving a close notification
 * doesn't mean that the document was open in an editor before. A close
 * notification requires a previous open notification to be sent.
 */
var DidCloseTextDocumentNotification;
(function (DidCloseTextDocumentNotification) {
    DidCloseTextDocumentNotification.type = new vscode_jsonrpc_1.NotificationType('textDocument/didClose');
})(DidCloseTextDocumentNotification = exports.DidCloseTextDocumentNotification || (exports.DidCloseTextDocumentNotification = {}));
/**
 * The document save notification is sent from the client to the server when
 * the document got saved in the client.
 */
var DidSaveTextDocumentNotification;
(function (DidSaveTextDocumentNotification) {
    DidSaveTextDocumentNotification.type = new vscode_jsonrpc_1.NotificationType('textDocument/didSave');
})(DidSaveTextDocumentNotification = exports.DidSaveTextDocumentNotification || (exports.DidSaveTextDocumentNotification = {}));
/**
 * A document will save notification is sent from the client to the server before
 * the document is actually saved.
 */
var WillSaveTextDocumentNotification;
(function (WillSaveTextDocumentNotification) {
    WillSaveTextDocumentNotification.type = new vscode_jsonrpc_1.NotificationType('textDocument/willSave');
})(WillSaveTextDocumentNotification = exports.WillSaveTextDocumentNotification || (exports.WillSaveTextDocumentNotification = {}));
/**
 * A document will save request is sent from the client to the server before
 * the document is actually saved. The request can return an array of TextEdits
 * which will be applied to the text document before it is saved. Please note that
 * clients might drop results if computing the text edits took too long or if a
 * server constantly fails on this request. This is done to keep the save fast and
 * reliable.
 */
var WillSaveTextDocumentWaitUntilRequest;
(function (WillSaveTextDocumentWaitUntilRequest) {
    WillSaveTextDocumentWaitUntilRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/willSaveWaitUntil');
})(WillSaveTextDocumentWaitUntilRequest = exports.WillSaveTextDocumentWaitUntilRequest || (exports.WillSaveTextDocumentWaitUntilRequest = {}));
//---- File eventing ----
/**
 * The watched files notification is sent from the client to the server when
 * the client detects changes to file watched by the language client.
 */
var DidChangeWatchedFilesNotification;
(function (DidChangeWatchedFilesNotification) {
    DidChangeWatchedFilesNotification.type = new vscode_jsonrpc_1.NotificationType('workspace/didChangeWatchedFiles');
})(DidChangeWatchedFilesNotification = exports.DidChangeWatchedFilesNotification || (exports.DidChangeWatchedFilesNotification = {}));
/**
 * The file event type
 */
var FileChangeType;
(function (FileChangeType) {
    /**
     * The file got created.
     */
    FileChangeType.Created = 1;
    /**
     * The file got changed.
     */
    FileChangeType.Changed = 2;
    /**
     * The file got deleted.
     */
    FileChangeType.Deleted = 3;
})(FileChangeType = exports.FileChangeType || (exports.FileChangeType = {}));
var WatchKind;
(function (WatchKind) {
    /**
     * Interested in create events.
     */
    WatchKind.Create = 1;
    /**
     * Interested in change events
     */
    WatchKind.Change = 2;
    /**
     * Interested in delete events
     */
    WatchKind.Delete = 4;
})(WatchKind = exports.WatchKind || (exports.WatchKind = {}));
//---- Diagnostic notification ----
/**
 * Diagnostics notification are sent from the server to the client to signal
 * results of validation runs.
 */
var PublishDiagnosticsNotification;
(function (PublishDiagnosticsNotification) {
    PublishDiagnosticsNotification.type = new vscode_jsonrpc_1.NotificationType('textDocument/publishDiagnostics');
})(PublishDiagnosticsNotification = exports.PublishDiagnosticsNotification || (exports.PublishDiagnosticsNotification = {}));
/**
 * How a completion was triggered
 */
var CompletionTriggerKind;
(function (CompletionTriggerKind) {
    /**
     * Completion was triggered by typing an identifier (24x7 code
     * complete), manual invocation (e.g Ctrl+Space) or via API.
     */
    CompletionTriggerKind.Invoked = 1;
    /**
     * Completion was triggered by a trigger character specified by
     * the `triggerCharacters` properties of the `CompletionRegistrationOptions`.
     */
    CompletionTriggerKind.TriggerCharacter = 2;
    /**
     * Completion was re-triggered as current completion list is incomplete
     */
    CompletionTriggerKind.TriggerForIncompleteCompletions = 3;
})(CompletionTriggerKind = exports.CompletionTriggerKind || (exports.CompletionTriggerKind = {}));
/**
 * Request to request completion at a given text document position. The request's
 * parameter is of type [TextDocumentPosition](#TextDocumentPosition) the response
 * is of type [CompletionItem[]](#CompletionItem) or [CompletionList](#CompletionList)
 * or a Thenable that resolves to such.
 *
 * The request can delay the computation of the [`detail`](#CompletionItem.detail)
 * and [`documentation`](#CompletionItem.documentation) properties to the `completionItem/resolve`
 * request. However, properties that are needed for the initial sorting and filtering, like `sortText`,
 * `filterText`, `insertText`, and `textEdit`, must not be changed during resolve.
 */
var CompletionRequest;
(function (CompletionRequest) {
    CompletionRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/completion');
})(CompletionRequest = exports.CompletionRequest || (exports.CompletionRequest = {}));
/**
 * Request to resolve additional information for a given completion item.The request's
 * parameter is of type [CompletionItem](#CompletionItem) the response
 * is of type [CompletionItem](#CompletionItem) or a Thenable that resolves to such.
 */
var CompletionResolveRequest;
(function (CompletionResolveRequest) {
    CompletionResolveRequest.type = new vscode_jsonrpc_1.RequestType('completionItem/resolve');
})(CompletionResolveRequest = exports.CompletionResolveRequest || (exports.CompletionResolveRequest = {}));
//---- Hover Support -------------------------------
/**
 * Request to request hover information at a given text document position. The request's
 * parameter is of type [TextDocumentPosition](#TextDocumentPosition) the response is of
 * type [Hover](#Hover) or a Thenable that resolves to such.
 */
var HoverRequest;
(function (HoverRequest) {
    HoverRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/hover');
})(HoverRequest = exports.HoverRequest || (exports.HoverRequest = {}));
var SignatureHelpRequest;
(function (SignatureHelpRequest) {
    SignatureHelpRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/signatureHelp');
})(SignatureHelpRequest = exports.SignatureHelpRequest || (exports.SignatureHelpRequest = {}));
//---- Goto Definition -------------------------------------
/**
 * A request to resolve the definition location of a symbol at a given text
 * document position. The request's parameter is of type [TextDocumentPosition]
 * (#TextDocumentPosition) the response is of type [Definition](#Definition) or a
 * Thenable that resolves to such.
 */
var DefinitionRequest;
(function (DefinitionRequest) {
    DefinitionRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/definition');
})(DefinitionRequest = exports.DefinitionRequest || (exports.DefinitionRequest = {}));
/**
 * A request to resolve project-wide references for the symbol denoted
 * by the given text document position. The request's parameter is of
 * type [ReferenceParams](#ReferenceParams) the response is of type
 * [Location[]](#Location) or a Thenable that resolves to such.
 */
var ReferencesRequest;
(function (ReferencesRequest) {
    ReferencesRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/references');
})(ReferencesRequest = exports.ReferencesRequest || (exports.ReferencesRequest = {}));
//---- Document Highlight ----------------------------------
/**
 * Request to resolve a [DocumentHighlight](#DocumentHighlight) for a given
 * text document position. The request's parameter is of type [TextDocumentPosition]
 * (#TextDocumentPosition) the request response is of type [DocumentHighlight[]]
 * (#DocumentHighlight) or a Thenable that resolves to such.
 */
var DocumentHighlightRequest;
(function (DocumentHighlightRequest) {
    DocumentHighlightRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/documentHighlight');
})(DocumentHighlightRequest = exports.DocumentHighlightRequest || (exports.DocumentHighlightRequest = {}));
//---- Document Symbol Provider ---------------------------
/**
 * A request to list all symbols found in a given text document. The request's
 * parameter is of type [TextDocumentIdentifier](#TextDocumentIdentifier) the
 * response is of type [SymbolInformation[]](#SymbolInformation) or a Thenable
 * that resolves to such.
 */
var DocumentSymbolRequest;
(function (DocumentSymbolRequest) {
    DocumentSymbolRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/documentSymbol');
})(DocumentSymbolRequest = exports.DocumentSymbolRequest || (exports.DocumentSymbolRequest = {}));
//---- Workspace Symbol Provider ---------------------------
/**
 * A request to list project-wide symbols matching the query string given
 * by the [WorkspaceSymbolParams](#WorkspaceSymbolParams). The response is
 * of type [SymbolInformation[]](#SymbolInformation) or a Thenable that
 * resolves to such.
 */
var WorkspaceSymbolRequest;
(function (WorkspaceSymbolRequest) {
    WorkspaceSymbolRequest.type = new vscode_jsonrpc_1.RequestType('workspace/symbol');
})(WorkspaceSymbolRequest = exports.WorkspaceSymbolRequest || (exports.WorkspaceSymbolRequest = {}));
/**
 * A request to provide commands for the given text document and range.
 */
var CodeActionRequest;
(function (CodeActionRequest) {
    CodeActionRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/codeAction');
})(CodeActionRequest = exports.CodeActionRequest || (exports.CodeActionRequest = {}));
/**
 * A request to provide code lens for the given text document.
 */
var CodeLensRequest;
(function (CodeLensRequest) {
    CodeLensRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/codeLens');
})(CodeLensRequest = exports.CodeLensRequest || (exports.CodeLensRequest = {}));
/**
 * A request to resolve a command for a given code lens.
 */
var CodeLensResolveRequest;
(function (CodeLensResolveRequest) {
    CodeLensResolveRequest.type = new vscode_jsonrpc_1.RequestType('codeLens/resolve');
})(CodeLensResolveRequest = exports.CodeLensResolveRequest || (exports.CodeLensResolveRequest = {}));
/**
 * A request to to format a whole document.
 */
var DocumentFormattingRequest;
(function (DocumentFormattingRequest) {
    DocumentFormattingRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/formatting');
})(DocumentFormattingRequest = exports.DocumentFormattingRequest || (exports.DocumentFormattingRequest = {}));
/**
 * A request to to format a range in a document.
 */
var DocumentRangeFormattingRequest;
(function (DocumentRangeFormattingRequest) {
    DocumentRangeFormattingRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/rangeFormatting');
})(DocumentRangeFormattingRequest = exports.DocumentRangeFormattingRequest || (exports.DocumentRangeFormattingRequest = {}));
/**
 * A request to format a document on type.
 */
var DocumentOnTypeFormattingRequest;
(function (DocumentOnTypeFormattingRequest) {
    DocumentOnTypeFormattingRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/onTypeFormatting');
})(DocumentOnTypeFormattingRequest = exports.DocumentOnTypeFormattingRequest || (exports.DocumentOnTypeFormattingRequest = {}));
/**
 * A request to rename a symbol.
 */
var RenameRequest;
(function (RenameRequest) {
    RenameRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/rename');
})(RenameRequest = exports.RenameRequest || (exports.RenameRequest = {}));
/**
 * A request to provide document links
 */
var DocumentLinkRequest;
(function (DocumentLinkRequest) {
    DocumentLinkRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/documentLink');
})(DocumentLinkRequest = exports.DocumentLinkRequest || (exports.DocumentLinkRequest = {}));
/**
 * Request to resolve additional information for a given document link. The request's
 * parameter is of type [DocumentLink](#DocumentLink) the response
 * is of type [DocumentLink](#DocumentLink) or a Thenable that resolves to such.
 */
var DocumentLinkResolveRequest;
(function (DocumentLinkResolveRequest) {
    DocumentLinkResolveRequest.type = new vscode_jsonrpc_1.RequestType('documentLink/resolve');
})(DocumentLinkResolveRequest = exports.DocumentLinkResolveRequest || (exports.DocumentLinkResolveRequest = {}));
/**
 * A request send from the client to the server to execute a command. The request might return
 * a workspace edit which the client will apply to the workspace.
 */
var ExecuteCommandRequest;
(function (ExecuteCommandRequest) {
    ExecuteCommandRequest.type = new vscode_jsonrpc_1.RequestType('workspace/executeCommand');
})(ExecuteCommandRequest = exports.ExecuteCommandRequest || (exports.ExecuteCommandRequest = {}));
/**
 * A request sent from the server to the client to modified certain resources.
 */
var ApplyWorkspaceEditRequest;
(function (ApplyWorkspaceEditRequest) {
    ApplyWorkspaceEditRequest.type = new vscode_jsonrpc_1.RequestType('workspace/applyEdit');
})(ApplyWorkspaceEditRequest = exports.ApplyWorkspaceEditRequest || (exports.ApplyWorkspaceEditRequest = {}));


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const toString = Object.prototype.toString;
function boolean(value) {
    return value === true || value === false;
}
exports.boolean = boolean;
function string(value) {
    return toString.call(value) === '[object String]';
}
exports.string = string;
function number(value) {
    return toString.call(value) === '[object Number]';
}
exports.number = number;
function error(value) {
    return toString.call(value) === '[object Error]';
}
exports.error = error;
function func(value) {
    return toString.call(value) === '[object Function]';
}
exports.func = func;
function array(value) {
    return Array.isArray(value);
}
exports.array = array;
function stringArray(value) {
    return array(value) && value.every(elem => string(elem));
}
exports.stringArray = stringArray;
function typedArray(value, check) {
    return Array.isArray(value) && value.every(check);
}
exports.typedArray = typedArray;
function thenable(value) {
    return value && func(value.then);
}
exports.thenable = thenable;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_jsonrpc_1 = __webpack_require__(8);
/**
 * A request to resolve the implementation locations of a symbol at a given text
 * document position. The request's parameter is of type [TextDocumentPositioParams]
 * (#TextDocumentPositionParams) the response is of type [Definition](#Definition) or a
 * Thenable that resolves to such.
 */
var ImplementationRequest;
(function (ImplementationRequest) {
    ImplementationRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/implementation');
})(ImplementationRequest = exports.ImplementationRequest || (exports.ImplementationRequest = {}));


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_jsonrpc_1 = __webpack_require__(8);
/**
 * A request to resolve the type definition locations of a symbol at a given text
 * document position. The request's parameter is of type [TextDocumentPositioParams]
 * (#TextDocumentPositionParams) the response is of type [Definition](#Definition) or a
 * Thenable that resolves to such.
 */
var TypeDefinitionRequest;
(function (TypeDefinitionRequest) {
    TypeDefinitionRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/typeDefinition');
})(TypeDefinitionRequest = exports.TypeDefinitionRequest || (exports.TypeDefinitionRequest = {}));


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_jsonrpc_1 = __webpack_require__(8);
/**
 * The `workspace/workspaceFolders` is sent from the server to the client to fetch the open workspace folders.
 */
var WorkspaceFoldersRequest;
(function (WorkspaceFoldersRequest) {
    WorkspaceFoldersRequest.type = new vscode_jsonrpc_1.RequestType0('workspace/workspaceFolders');
})(WorkspaceFoldersRequest = exports.WorkspaceFoldersRequest || (exports.WorkspaceFoldersRequest = {}));
/**
 * The `workspace/didChangeWorkspaceFolders` notification is sent from the client to the server when the workspace
 * folder configuration changes.
 */
var DidChangeWorkspaceFoldersNotification;
(function (DidChangeWorkspaceFoldersNotification) {
    DidChangeWorkspaceFoldersNotification.type = new vscode_jsonrpc_1.NotificationType('workspace/didChangeWorkspaceFolders');
})(DidChangeWorkspaceFoldersNotification = exports.DidChangeWorkspaceFoldersNotification || (exports.DidChangeWorkspaceFoldersNotification = {}));


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_jsonrpc_1 = __webpack_require__(8);
/**
 * The 'workspace/configuration' request is sent from the server to the client to fetch a certain
 * configuration setting.
 */
var ConfigurationRequest;
(function (ConfigurationRequest) {
    ConfigurationRequest.type = new vscode_jsonrpc_1.RequestType('workspace/configuration');
})(ConfigurationRequest = exports.ConfigurationRequest || (exports.ConfigurationRequest = {}));


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_jsonrpc_1 = __webpack_require__(8);
/**
 * A request to list all color symbols found in a given text document. The request's
 * parameter is of type [DocumentColorParams](#DocumentColorParams) the
 * response is of type [ColorInformation[]](#ColorInformation) or a Thenable
 * that resolves to such.
 */
var DocumentColorRequest;
(function (DocumentColorRequest) {
    DocumentColorRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/documentColor');
})(DocumentColorRequest = exports.DocumentColorRequest || (exports.DocumentColorRequest = {}));
/**
 * A request to list all presentation for a color. The request's
 * parameter is of type [ColorPresentationParams](#ColorPresentationParams) the
 * response is of type [ColorInformation[]](#ColorInformation) or a Thenable
 * that resolves to such.
 */
var ColorPresentationRequest;
(function (ColorPresentationRequest) {
    ColorPresentationRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/colorPresentation');
})(ColorPresentationRequest = exports.ColorPresentationRequest || (exports.ColorPresentationRequest = {}));


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const code = __webpack_require__(2);
const proto = __webpack_require__(7);
const Is = __webpack_require__(30);
const protocolCompletionItem_1 = __webpack_require__(31);
const protocolCodeLens_1 = __webpack_require__(32);
const protocolDocumentLink_1 = __webpack_require__(33);
function createConverter(uriConverter) {
    const nullConverter = (value) => value.toString();
    const _uriConverter = uriConverter || nullConverter;
    function asUri(value) {
        return _uriConverter(value);
    }
    function asTextDocumentIdentifier(textDocument) {
        return {
            uri: _uriConverter(textDocument.uri)
        };
    }
    function asVersionedTextDocumentIdentifier(textDocument) {
        return {
            uri: _uriConverter(textDocument.uri),
            version: textDocument.version
        };
    }
    function asOpenTextDocumentParams(textDocument) {
        return {
            textDocument: {
                uri: _uriConverter(textDocument.uri),
                languageId: textDocument.languageId,
                version: textDocument.version,
                text: textDocument.getText()
            }
        };
    }
    function isTextDocumentChangeEvent(value) {
        let candidate = value;
        return !!candidate.document && !!candidate.contentChanges;
    }
    function isTextDocument(value) {
        let candidate = value;
        return !!candidate.uri && !!candidate.version;
    }
    function asChangeTextDocumentParams(arg) {
        if (isTextDocument(arg)) {
            let result = {
                textDocument: {
                    uri: _uriConverter(arg.uri),
                    version: arg.version
                },
                contentChanges: [{ text: arg.getText() }]
            };
            return result;
        }
        else if (isTextDocumentChangeEvent(arg)) {
            let document = arg.document;
            let result = {
                textDocument: {
                    uri: _uriConverter(document.uri),
                    version: document.version
                },
                contentChanges: arg.contentChanges.map((change) => {
                    let range = change.range;
                    return {
                        range: {
                            start: { line: range.start.line, character: range.start.character },
                            end: { line: range.end.line, character: range.end.character }
                        },
                        rangeLength: change.rangeLength,
                        text: change.text
                    };
                })
            };
            return result;
        }
        else {
            throw Error('Unsupported text document change parameter');
        }
    }
    function asCloseTextDocumentParams(textDocument) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument)
        };
    }
    function asSaveTextDocumentParams(textDocument, includeContent = false) {
        let result = {
            textDocument: asVersionedTextDocumentIdentifier(textDocument)
        };
        if (includeContent) {
            result.text = textDocument.getText();
        }
        return result;
    }
    function asTextDocumentSaveReason(reason) {
        switch (reason) {
            case code.TextDocumentSaveReason.Manual:
                return proto.TextDocumentSaveReason.Manual;
            case code.TextDocumentSaveReason.AfterDelay:
                return proto.TextDocumentSaveReason.AfterDelay;
            case code.TextDocumentSaveReason.FocusOut:
                return proto.TextDocumentSaveReason.FocusOut;
        }
        return proto.TextDocumentSaveReason.Manual;
    }
    function asWillSaveTextDocumentParams(event) {
        return {
            textDocument: asTextDocumentIdentifier(event.document),
            reason: asTextDocumentSaveReason(event.reason)
        };
    }
    function asTextDocumentPositionParams(textDocument, position) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument),
            position: asWorkerPosition(position)
        };
    }
    function asTriggerKind(triggerKind) {
        switch (triggerKind) {
            case code.CompletionTriggerKind.TriggerCharacter:
                return proto.CompletionTriggerKind.TriggerCharacter;
            case code.CompletionTriggerKind.TriggerForIncompleteCompletions:
                return proto.CompletionTriggerKind.TriggerForIncompleteCompletions;
            default:
                return proto.CompletionTriggerKind.Invoked;
        }
    }
    function asCompletionParams(textDocument, position, context) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument),
            position: asWorkerPosition(position),
            context: {
                triggerKind: asTriggerKind(context.triggerKind),
                triggerCharacter: context.triggerCharacter
            }
        };
    }
    function asWorkerPosition(position) {
        return { line: position.line, character: position.character };
    }
    function asPosition(value) {
        if (value === void 0) {
            return undefined;
        }
        else if (value === null) {
            return null;
        }
        return { line: value.line, character: value.character };
    }
    function asRange(value) {
        if (value === void 0 || value === null) {
            return value;
        }
        return { start: asPosition(value.start), end: asPosition(value.end) };
    }
    function asDiagnosticSeverity(value) {
        switch (value) {
            case code.DiagnosticSeverity.Error:
                return proto.DiagnosticSeverity.Error;
            case code.DiagnosticSeverity.Warning:
                return proto.DiagnosticSeverity.Warning;
            case code.DiagnosticSeverity.Information:
                return proto.DiagnosticSeverity.Information;
            case code.DiagnosticSeverity.Hint:
                return proto.DiagnosticSeverity.Hint;
        }
    }
    function asDiagnostic(item) {
        let result = proto.Diagnostic.create(asRange(item.range), item.message);
        if (Is.number(item.severity)) {
            result.severity = asDiagnosticSeverity(item.severity);
        }
        if (Is.number(item.code) || Is.string(item.code)) {
            result.code = item.code;
        }
        if (item.source) {
            result.source = item.source;
        }
        return result;
    }
    function asDiagnostics(items) {
        if (items === void 0 || items === null) {
            return items;
        }
        return items.map(asDiagnostic);
    }
    function asDocumentation(format, documentation) {
        switch (format) {
            case '$string':
                return documentation;
            case proto.MarkupKind.PlainText:
                return { kind: format, value: documentation };
            case proto.MarkupKind.Markdown:
                return { kind: format, value: documentation.value };
            default:
                return `Unsupported Markup content received. Kind is: ${format}`;
        }
    }
    function asCompletionItemKind(value, original) {
        if (original !== void 0) {
            return original;
        }
        return value + 1;
    }
    function asCompletionItem(item) {
        let result = { label: item.label };
        let protocolItem = item instanceof protocolCompletionItem_1.default ? item : undefined;
        if (item.detail) {
            result.detail = item.detail;
        }
        // We only send items back we created. So this can't be something else than
        // a string right now.
        if (item.documentation) {
            if (!protocolItem || protocolItem.documentationFormat === '$string') {
                result.documentation = item.documentation;
            }
            else {
                result.documentation = asDocumentation(protocolItem.documentationFormat, item.documentation);
            }
        }
        if (item.filterText) {
            result.filterText = item.filterText;
        }
        fillPrimaryInsertText(result, item);
        if (Is.number(item.kind)) {
            result.kind = asCompletionItemKind(item.kind, protocolItem && protocolItem.originalItemKind);
        }
        if (item.sortText) {
            result.sortText = item.sortText;
        }
        if (item.additionalTextEdits) {
            result.additionalTextEdits = asTextEdits(item.additionalTextEdits);
        }
        if (item.commitCharacters) {
            result.commitCharacters = item.commitCharacters.slice();
        }
        if (item.command) {
            result.command = asCommand(item.command);
        }
        if (protocolItem) {
            if (protocolItem.data) {
                result.data = protocolItem.data;
            }
            if (protocolItem.deprecated === true || protocolItem.deprecated === false) {
                result.deprecated = protocolItem.deprecated;
            }
        }
        return result;
    }
    function fillPrimaryInsertText(target, source) {
        let format = proto.InsertTextFormat.PlainText;
        let text;
        let range = undefined;
        if (source.textEdit) {
            text = source.textEdit.newText;
            range = asRange(source.textEdit.range);
        }
        else if (source.insertText instanceof code.SnippetString) {
            format = proto.InsertTextFormat.Snippet;
            text = source.insertText.value;
        }
        else {
            text = source.insertText;
        }
        if (source.range) {
            range = asRange(source.range);
        }
        target.insertTextFormat = format;
        if (source.fromEdit && text && range) {
            target.textEdit = { newText: text, range: range };
        }
        else {
            target.insertText = text;
        }
    }
    function asTextEdit(edit) {
        return { range: asRange(edit.range), newText: edit.newText };
    }
    function asTextEdits(edits) {
        if (edits === void 0 || edits === null) {
            return edits;
        }
        return edits.map(asTextEdit);
    }
    function asReferenceParams(textDocument, position, options) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument),
            position: asWorkerPosition(position),
            context: { includeDeclaration: options.includeDeclaration }
        };
    }
    function asCodeActionContext(context) {
        if (context === void 0 || context === null) {
            return context;
        }
        return proto.CodeActionContext.create(asDiagnostics(context.diagnostics));
    }
    function asCommand(item) {
        let result = proto.Command.create(item.title, item.command);
        if (item.arguments) {
            result.arguments = item.arguments;
        }
        return result;
    }
    function asCodeLens(item) {
        let result = proto.CodeLens.create(asRange(item.range));
        if (item.command) {
            result.command = asCommand(item.command);
        }
        if (item instanceof protocolCodeLens_1.default) {
            if (item.data) {
                result.data = item.data;
            }
            ;
        }
        return result;
    }
    function asFormattingOptions(item) {
        return { tabSize: item.tabSize, insertSpaces: item.insertSpaces };
    }
    function asDocumentSymbolParams(textDocument) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument)
        };
    }
    function asCodeLensParams(textDocument) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument)
        };
    }
    function asDocumentLink(item) {
        let result = proto.DocumentLink.create(asRange(item.range));
        if (item.target) {
            result.target = asUri(item.target);
        }
        let protocolItem = item instanceof protocolDocumentLink_1.default ? item : undefined;
        if (protocolItem && protocolItem.data) {
            result.data = protocolItem.data;
        }
        return result;
    }
    function asDocumentLinkParams(textDocument) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument)
        };
    }
    return {
        asUri,
        asTextDocumentIdentifier,
        asOpenTextDocumentParams,
        asChangeTextDocumentParams,
        asCloseTextDocumentParams,
        asSaveTextDocumentParams,
        asWillSaveTextDocumentParams,
        asTextDocumentPositionParams,
        asCompletionParams,
        asWorkerPosition,
        asRange,
        asPosition,
        asDiagnosticSeverity,
        asDiagnostic,
        asDiagnostics,
        asCompletionItem,
        asTextEdit,
        asReferenceParams,
        asCodeActionContext,
        asCommand,
        asCodeLens,
        asFormattingOptions,
        asDocumentSymbolParams,
        asCodeLensParams,
        asDocumentLink,
        asDocumentLinkParams
    };
}
exports.createConverter = createConverter;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const toString = Object.prototype.toString;
function boolean(value) {
    return value === true || value === false;
}
exports.boolean = boolean;
function string(value) {
    return toString.call(value) === '[object String]';
}
exports.string = string;
function number(value) {
    return toString.call(value) === '[object Number]';
}
exports.number = number;
function error(value) {
    return toString.call(value) === '[object Error]';
}
exports.error = error;
function func(value) {
    return toString.call(value) === '[object Function]';
}
exports.func = func;
function array(value) {
    return Array.isArray(value);
}
exports.array = array;
function stringArray(value) {
    return array(value) && value.every(elem => string(elem));
}
exports.stringArray = stringArray;
function typedArray(value, check) {
    return Array.isArray(value) && value.every(check);
}
exports.typedArray = typedArray;
function thenable(value) {
    return value && func(value.then);
}
exports.thenable = thenable;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const code = __webpack_require__(2);
class ProtocolCompletionItem extends code.CompletionItem {
    constructor(label) {
        super(label);
    }
}
exports.default = ProtocolCompletionItem;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const code = __webpack_require__(2);
class ProtocolCodeLens extends code.CodeLens {
    constructor(range) {
        super(range);
    }
}
exports.default = ProtocolCodeLens;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const code = __webpack_require__(2);
class ProtocolDocumentLink extends code.DocumentLink {
    constructor(range, target) {
        super(range, target);
    }
}
exports.default = ProtocolDocumentLink;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const code = __webpack_require__(2);
const ls = __webpack_require__(7);
const Is = __webpack_require__(30);
const protocolCompletionItem_1 = __webpack_require__(31);
const protocolCodeLens_1 = __webpack_require__(32);
const protocolDocumentLink_1 = __webpack_require__(33);
var CodeBlock;
(function (CodeBlock) {
    function is(value) {
        let candidate = value;
        return candidate && Is.string(candidate.language) && Is.string(candidate.value);
    }
    CodeBlock.is = is;
})(CodeBlock || (CodeBlock = {}));
function createConverter(uriConverter) {
    const nullConverter = (value) => code.Uri.parse(value);
    const _uriConverter = uriConverter || nullConverter;
    function asUri(value) {
        return _uriConverter(value);
    }
    function asDiagnostics(diagnostics) {
        return diagnostics.map(asDiagnostic);
    }
    function asDiagnostic(diagnostic) {
        let result = new code.Diagnostic(asRange(diagnostic.range), diagnostic.message, asDiagnosticSeverity(diagnostic.severity));
        if (Is.number(diagnostic.code) || Is.string(diagnostic.code)) {
            result.code = diagnostic.code;
        }
        if (diagnostic.source) {
            result.source = diagnostic.source;
        }
        if (diagnostic.relatedInformation) {
            result.relatedInformation = asRelatedInformation(diagnostic.relatedInformation);
        }
        return result;
    }
    function asRelatedInformation(relatedInformation) {
        return relatedInformation.map(asDiagnosticRelatedInformation);
    }
    function asDiagnosticRelatedInformation(information) {
        return new code.DiagnosticRelatedInformation(asLocation(information.location), information.message);
    }
    function asPosition(value) {
        if (!value) {
            return undefined;
        }
        return new code.Position(value.line, value.character);
    }
    function asRange(value) {
        if (!value) {
            return undefined;
        }
        return new code.Range(asPosition(value.start), asPosition(value.end));
    }
    function asDiagnosticSeverity(value) {
        if (value === void 0 || value === null) {
            return code.DiagnosticSeverity.Error;
        }
        switch (value) {
            case ls.DiagnosticSeverity.Error:
                return code.DiagnosticSeverity.Error;
            case ls.DiagnosticSeverity.Warning:
                return code.DiagnosticSeverity.Warning;
            case ls.DiagnosticSeverity.Information:
                return code.DiagnosticSeverity.Information;
            case ls.DiagnosticSeverity.Hint:
                return code.DiagnosticSeverity.Hint;
        }
        return code.DiagnosticSeverity.Error;
    }
    function asHoverContent(value) {
        if (Is.string(value)) {
            return new code.MarkdownString(value);
        }
        else if (CodeBlock.is(value)) {
            let result = new code.MarkdownString();
            return result.appendCodeblock(value.value, value.language);
        }
        else if (Array.isArray(value)) {
            let result = new code.MarkdownString();
            for (let element of value) {
                if (CodeBlock.is(element)) {
                    result.appendCodeblock(element.value, element.language);
                }
                else {
                    result.appendMarkdown(element);
                }
            }
            return result;
        }
        else {
            let result;
            switch (value.kind) {
                case ls.MarkupKind.Markdown:
                    return new code.MarkdownString(value.value);
                case ls.MarkupKind.PlainText:
                    result = new code.MarkdownString();
                    result.appendText(value.value);
                    return result;
                default:
                    result = new code.MarkdownString();
                    result.appendText(`Unsupported Markup content received. Kind is: ${value.kind}`);
                    return result;
            }
        }
    }
    function asDocumentation(value) {
        if (Is.string(value)) {
            return value;
        }
        else {
            switch (value.kind) {
                case ls.MarkupKind.Markdown:
                    return new code.MarkdownString(value.value);
                case ls.MarkupKind.PlainText:
                    return value.value;
                default:
                    return `Unsupported Markup content received. Kind is: ${value.kind}`;
            }
        }
    }
    function asHover(hover) {
        if (!hover) {
            return undefined;
        }
        return new code.Hover(asHoverContent(hover.contents), asRange(hover.range));
    }
    function asCompletionResult(result) {
        if (!result) {
            return undefined;
        }
        if (Array.isArray(result)) {
            let items = result;
            return items.map(asCompletionItem);
        }
        let list = result;
        return new code.CompletionList(list.items.map(asCompletionItem), list.isIncomplete);
    }
    function asCompletionItemKind(value) {
        // Protocol item kind is 1 based, codes item kind is zero based.
        if (ls.CompletionItemKind.Text <= value && value <= ls.CompletionItemKind.TypeParameter) {
            return [value - 1, undefined];
        }
        ;
        return [code.CompletionItemKind.Text, value];
    }
    function asCompletionItem(item) {
        let result = new protocolCompletionItem_1.default(item.label);
        if (item.detail) {
            result.detail = item.detail;
        }
        if (item.documentation) {
            result.documentation = asDocumentation(item.documentation);
            result.documentationFormat = Is.string(item.documentation) ? '$string' : item.documentation.kind;
        }
        ;
        if (item.filterText) {
            result.filterText = item.filterText;
        }
        let insertText = asCompletionInsertText(item);
        if (insertText) {
            result.insertText = insertText.text;
            result.range = insertText.range;
            result.fromEdit = insertText.fromEdit;
        }
        if (Is.number(item.kind)) {
            let [itemKind, original] = asCompletionItemKind(item.kind);
            result.kind = itemKind;
            if (original) {
                result.originalItemKind = original;
            }
        }
        if (item.sortText) {
            result.sortText = item.sortText;
        }
        if (item.additionalTextEdits) {
            result.additionalTextEdits = asTextEdits(item.additionalTextEdits);
        }
        if (Is.stringArray(item.commitCharacters)) {
            result.commitCharacters = item.commitCharacters.slice();
        }
        if (item.command) {
            result.command = asCommand(item.command);
        }
        if (item.deprecated === true || item.deprecated === false) {
            result.deprecated = item.deprecated;
        }
        ;
        if (item.data !== void 0 && item.data !== null) {
            result.data = item.data;
        }
        return result;
    }
    function asCompletionInsertText(item) {
        if (item.textEdit) {
            if (item.insertTextFormat === ls.InsertTextFormat.Snippet) {
                return { text: new code.SnippetString(item.textEdit.newText), range: asRange(item.textEdit.range), fromEdit: true };
            }
            else {
                return { text: item.textEdit.newText, range: asRange(item.textEdit.range), fromEdit: true };
            }
        }
        else if (item.insertText) {
            if (item.insertTextFormat === ls.InsertTextFormat.Snippet) {
                return { text: new code.SnippetString(item.insertText), fromEdit: false };
            }
            else {
                return { text: item.insertText, fromEdit: false };
            }
        }
        else {
            return undefined;
        }
    }
    function asTextEdit(edit) {
        if (!edit) {
            return undefined;
        }
        return new code.TextEdit(asRange(edit.range), edit.newText);
    }
    function asTextEdits(items) {
        if (!items) {
            return undefined;
        }
        return items.map(asTextEdit);
    }
    function asSignatureHelp(item) {
        if (!item) {
            return undefined;
        }
        let result = new code.SignatureHelp();
        if (Is.number(item.activeSignature)) {
            result.activeSignature = item.activeSignature;
        }
        else {
            // activeSignature was optional in the past
            result.activeSignature = 0;
        }
        if (Is.number(item.activeParameter)) {
            result.activeParameter = item.activeParameter;
        }
        else {
            // activeParameter was optional in the past
            result.activeParameter = 0;
        }
        if (item.signatures) {
            result.signatures = asSignatureInformations(item.signatures);
        }
        return result;
    }
    function asSignatureInformations(items) {
        return items.map(asSignatureInformation);
    }
    function asSignatureInformation(item) {
        let result = new code.SignatureInformation(item.label);
        if (item.documentation) {
            result.documentation = asDocumentation(item.documentation);
        }
        if (item.parameters) {
            result.parameters = asParameterInformations(item.parameters);
        }
        return result;
    }
    function asParameterInformations(item) {
        return item.map(asParameterInformation);
    }
    function asParameterInformation(item) {
        let result = new code.ParameterInformation(item.label);
        if (item.documentation) {
            result.documentation = asDocumentation(item.documentation);
        }
        ;
        return result;
    }
    function asDefinitionResult(item) {
        if (!item) {
            return undefined;
        }
        if (Is.array(item)) {
            return item.map((location) => asLocation(location));
        }
        else {
            return asLocation(item);
        }
    }
    function asLocation(item) {
        if (!item) {
            return undefined;
        }
        return new code.Location(_uriConverter(item.uri), asRange(item.range));
    }
    function asReferences(values) {
        if (!values) {
            return undefined;
        }
        return values.map(location => asLocation(location));
    }
    function asDocumentHighlights(values) {
        if (!values) {
            return undefined;
        }
        return values.map(asDocumentHighlight);
    }
    function asDocumentHighlight(item) {
        let result = new code.DocumentHighlight(asRange(item.range));
        if (Is.number(item.kind)) {
            result.kind = asDocumentHighlightKind(item.kind);
        }
        return result;
    }
    function asDocumentHighlightKind(item) {
        switch (item) {
            case ls.DocumentHighlightKind.Text:
                return code.DocumentHighlightKind.Text;
            case ls.DocumentHighlightKind.Read:
                return code.DocumentHighlightKind.Read;
            case ls.DocumentHighlightKind.Write:
                return code.DocumentHighlightKind.Write;
        }
        return code.DocumentHighlightKind.Text;
    }
    function asSymbolInformations(values, uri) {
        if (!values) {
            return undefined;
        }
        return values.map(information => asSymbolInformation(information, uri));
    }
    function asSymbolKind(item) {
        if (item <= ls.SymbolKind.TypeParameter) {
            // Symbol kind is one based in the protocol and zero based in code.
            return item - 1;
        }
        return code.SymbolKind.Property;
    }
    function asSymbolInformation(item, uri) {
        // Symbol kind is one based in the protocol and zero based in code.
        let result = new code.SymbolInformation(item.name, asSymbolKind(item.kind), asRange(item.location.range), item.location.uri ? _uriConverter(item.location.uri) : uri);
        if (item.containerName) {
            result.containerName = item.containerName;
        }
        return result;
    }
    function asCommand(item) {
        let result = { title: item.title, command: item.command };
        if (item.arguments) {
            result.arguments = item.arguments;
        }
        return result;
    }
    function asCommands(items) {
        if (!items) {
            return undefined;
        }
        return items.map(asCommand);
    }
    function asCodeLens(item) {
        if (!item) {
            return undefined;
        }
        let result = new protocolCodeLens_1.default(asRange(item.range));
        if (item.command) {
            result.command = asCommand(item.command);
        }
        if (item.data !== void 0 && item.data !== null) {
            result.data = item.data;
        }
        return result;
    }
    function asCodeLenses(items) {
        if (!items) {
            return undefined;
        }
        return items.map((codeLens) => asCodeLens(codeLens));
    }
    function asWorkspaceEdit(item) {
        if (!item) {
            return undefined;
        }
        let result = new code.WorkspaceEdit();
        if (item.documentChanges) {
            item.documentChanges.forEach(change => {
                result.set(_uriConverter(change.textDocument.uri), asTextEdits(change.edits));
            });
        }
        else if (item.changes) {
            Object.keys(item.changes).forEach(key => {
                result.set(_uriConverter(key), asTextEdits(item.changes[key]));
            });
        }
        return result;
    }
    function asDocumentLink(item) {
        let range = asRange(item.range);
        let target = item.target ? asUri(item.target) : undefined;
        // target must be optional in DocumentLink
        let link = new protocolDocumentLink_1.default(range, target);
        if (item.data !== void 0 && item.data !== null) {
            link.data = item.data;
        }
        return link;
    }
    function asDocumentLinks(items) {
        if (!items) {
            return undefined;
        }
        return items.map(asDocumentLink);
    }
    return {
        asUri,
        asDiagnostics,
        asDiagnostic,
        asRange,
        asPosition,
        asDiagnosticSeverity,
        asHover,
        asCompletionResult,
        asCompletionItem,
        asTextEdit,
        asTextEdits,
        asSignatureHelp,
        asSignatureInformations,
        asSignatureInformation,
        asParameterInformations,
        asParameterInformation,
        asDefinitionResult,
        asLocation,
        asReferences,
        asDocumentHighlights,
        asDocumentHighlight,
        asDocumentHighlightKind,
        asSymbolInformations,
        asSymbolInformation,
        asCommand,
        asCommands,
        asCodeLens,
        asCodeLenses,
        asWorkspaceEdit,
        asDocumentLink,
        asDocumentLinks
    };
}
exports.createConverter = createConverter;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
class Delayer {
    constructor(defaultDelay) {
        this.defaultDelay = defaultDelay;
        this.timeout = undefined;
        this.completionPromise = undefined;
        this.onSuccess = undefined;
        this.task = undefined;
    }
    trigger(task, delay = this.defaultDelay) {
        this.task = task;
        if (delay >= 0) {
            this.cancelTimeout();
        }
        if (!this.completionPromise) {
            this.completionPromise = new Promise((resolve) => {
                this.onSuccess = resolve;
            }).then(() => {
                this.completionPromise = undefined;
                this.onSuccess = undefined;
                var result = this.task();
                this.task = undefined;
                return result;
            });
        }
        if (delay >= 0 || this.timeout === void 0) {
            this.timeout = setTimeout(() => {
                this.timeout = undefined;
                this.onSuccess(undefined);
            }, delay >= 0 ? delay : this.defaultDelay);
        }
        return this.completionPromise;
    }
    forceDelivery() {
        if (!this.completionPromise) {
            return undefined;
        }
        this.cancelTimeout();
        let result = this.task();
        this.completionPromise = undefined;
        this.onSuccess = undefined;
        this.task = undefined;
        return result;
    }
    isTriggered() {
        return this.timeout !== void 0;
    }
    cancel() {
        this.cancelTimeout();
        this.completionPromise = undefined;
    }
    cancelTimeout() {
        if (this.timeout !== void 0) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    }
}
exports.Delayer = Delayer;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

Object.defineProperty(exports, "__esModule", { value: true });
class ValueUUID {
    constructor(_value) {
        this._value = _value;
        // empty
    }
    asHex() {
        return this._value;
    }
    equals(other) {
        return this.asHex() === other.asHex();
    }
}
class V4UUID extends ValueUUID {
    constructor() {
        super([
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            '-',
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            '-',
            '4',
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            '-',
            V4UUID._oneOf(V4UUID._timeHighBits),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            '-',
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
        ].join(''));
    }
    static _oneOf(array) {
        return array[Math.floor(array.length * Math.random())];
    }
    static _randomHex() {
        return V4UUID._oneOf(V4UUID._chars);
    }
}
V4UUID._chars = ['0', '1', '2', '3', '4', '5', '6', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
V4UUID._timeHighBits = ['8', '9', 'a', 'b'];
/**
 * An empty UUID that contains only zeros.
 */
exports.empty = new ValueUUID('00000000-0000-0000-0000-000000000000');
function v4() {
    return new V4UUID();
}
exports.v4 = v4;
const _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUUID(value) {
    return _UUIDPattern.test(value);
}
exports.isUUID = isUUID;
/**
 * Parses a UUID that is of the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
 * @param value A uuid string.
 */
function parse(value) {
    if (!isUUID(value)) {
        throw new Error('invalid uuid');
    }
    return new ValueUUID(value);
}
exports.parse = parse;
function generateUuid() {
    return v4().asHex();
}
exports.generateUuid = generateUuid;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const UUID = __webpack_require__(36);
const Is = __webpack_require__(30);
const vscode_1 = __webpack_require__(2);
const vscode_languageserver_protocol_1 = __webpack_require__(7);
const client_1 = __webpack_require__(6);
function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class ColorProviderFeature extends client_1.TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentColorRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'colorProvider').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.colorProvider) {
            return;
        }
        const implCapabilities = capabilities.colorProvider;
        const id = Is.string(implCapabilities.id) && implCapabilities.id.length > 0 ? implCapabilities.id : UUID.generateUuid();
        const selector = implCapabilities.documentSelector || documentSelector;
        if (selector) {
            this.register(this.messages, {
                id,
                registerOptions: Object.assign({}, { documentSelector: selector })
            });
        }
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideColorPresentations = (color, context, token) => {
            const requestParams = {
                color,
                textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(context.document),
                range: client.code2ProtocolConverter.asRange(context.range)
            };
            return client.sendRequest(vscode_languageserver_protocol_1.ColorPresentationRequest.type, requestParams, token).then(this.asColorPresentations.bind(this), (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.ColorPresentationRequest.type, error);
                return Promise.resolve(null);
            });
        };
        let provideDocumentColors = (document, token) => {
            const requestParams = {
                textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document)
            };
            return client.sendRequest(vscode_languageserver_protocol_1.DocumentColorRequest.type, requestParams, token).then(this.asColorInformations.bind(this), (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.ColorPresentationRequest.type, error);
                return Promise.resolve(null);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerColorProvider(options.documentSelector, {
            provideColorPresentations: (color, context, token) => {
                return middleware.provideColorPresentations
                    ? middleware.provideColorPresentations(color, context, token, provideColorPresentations)
                    : provideColorPresentations(color, context, token);
            },
            provideDocumentColors: (document, token) => {
                return middleware.provideDocumentColors
                    ? middleware.provideDocumentColors(document, token, provideDocumentColors)
                    : provideDocumentColors(document, token);
            }
        });
    }
    asColor(color) {
        return new vscode_1.Color(color.red, color.green, color.blue, color.alpha);
    }
    asColorInformations(colorInformation) {
        if (Array.isArray(colorInformation)) {
            return colorInformation.map(ci => {
                return new vscode_1.ColorInformation(this._client.protocol2CodeConverter.asRange(ci.range), this.asColor(ci.color));
            });
        }
        return [];
    }
    asColorPresentations(colorPresentations) {
        if (Array.isArray(colorPresentations)) {
            return colorPresentations.map(cp => {
                let presentation = new vscode_1.ColorPresentation(cp.label);
                presentation.additionalTextEdits = this._client.protocol2CodeConverter.asTextEdits(cp.additionalTextEdits);
                presentation.textEdit = this._client.protocol2CodeConverter.asTextEdit(cp.textEdit);
                return presentation;
            });
        }
        return [];
    }
}
exports.ColorProviderFeature = ColorProviderFeature;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(2);
const vscode_languageserver_protocol_1 = __webpack_require__(7);
class ConfigurationFeature {
    constructor(_client) {
        this._client = _client;
    }
    fillClientCapabilities(capabilities) {
        capabilities.workspace = capabilities.workspace || {};
        capabilities.workspace.configuration = true;
    }
    initialize() {
        let client = this._client;
        client.onRequest(vscode_languageserver_protocol_1.ConfigurationRequest.type, (params, token) => {
            let configuration = (params) => {
                let result = [];
                for (let item of params.items) {
                    let resource = item.scopeUri !== void 0 && item.scopeUri !== null ? this._client.protocol2CodeConverter.asUri(item.scopeUri) : undefined;
                    result.push(this.getConfiguration(resource, item.section !== null ? item.section : undefined));
                }
                return result;
            };
            let middleware = client.clientOptions.middleware.workspace;
            return middleware && middleware.configuration
                ? middleware.configuration(params, token, configuration)
                : configuration(params, token);
        });
    }
    getConfiguration(resource, section) {
        let result = null;
        if (section) {
            let index = section.lastIndexOf('.');
            if (index === -1) {
                result = vscode_1.workspace.getConfiguration(undefined, resource).get(section);
            }
            else {
                let config = vscode_1.workspace.getConfiguration(section.substr(0, index));
                if (config) {
                    result = config.get(section.substr(index + 1));
                }
            }
        }
        else {
            let config = vscode_1.workspace.getConfiguration(undefined, resource);
            result = {};
            for (let key of Object.keys(config)) {
                if (config.has(key)) {
                    result[key] = config.get(key);
                }
            }
        }
        if (!result) {
            return null;
        }
        return result;
    }
}
exports.ConfigurationFeature = ConfigurationFeature;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const UUID = __webpack_require__(36);
const Is = __webpack_require__(30);
const vscode_1 = __webpack_require__(2);
const vscode_languageserver_protocol_1 = __webpack_require__(7);
const client_1 = __webpack_require__(6);
function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class ImplementationFeature extends client_1.TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.ImplementationRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'implementation').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.implementationProvider) {
            return;
        }
        if (capabilities.implementationProvider === true) {
            if (!documentSelector) {
                return;
            }
            this.register(this.messages, {
                id: UUID.generateUuid(),
                registerOptions: Object.assign({}, { documentSelector: documentSelector })
            });
        }
        else {
            const implCapabilities = capabilities.implementationProvider;
            const id = Is.string(implCapabilities.id) && implCapabilities.id.length > 0 ? implCapabilities.id : UUID.generateUuid();
            const selector = implCapabilities.documentSelector || documentSelector;
            if (selector) {
                this.register(this.messages, {
                    id,
                    registerOptions: Object.assign({}, { documentSelector: selector })
                });
            }
        }
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideImplementation = (document, position, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.ImplementationRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDefinitionResult, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.ImplementationRequest.type, error);
                return Promise.resolve(null);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerImplementationProvider(options.documentSelector, {
            provideImplementation: (document, position, token) => {
                return middleware.provideImplementation
                    ? middleware.provideImplementation(document, position, token, provideImplementation)
                    : provideImplementation(document, position, token);
            }
        });
    }
}
exports.ImplementationFeature = ImplementationFeature;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const UUID = __webpack_require__(36);
const Is = __webpack_require__(30);
const vscode_1 = __webpack_require__(2);
const vscode_languageserver_protocol_1 = __webpack_require__(7);
const client_1 = __webpack_require__(6);
function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class TypeDefinitionFeature extends client_1.TextDocumentFeature {
    constructor(client) {
        super(client, vscode_languageserver_protocol_1.TypeDefinitionRequest.type);
    }
    fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, 'textDocument'), 'typeDefinition').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        if (!capabilities.typeDefinitionProvider) {
            return;
        }
        if (capabilities.typeDefinitionProvider === true) {
            if (!documentSelector) {
                return;
            }
            this.register(this.messages, {
                id: UUID.generateUuid(),
                registerOptions: Object.assign({}, { documentSelector: documentSelector })
            });
        }
        else {
            const implCapabilities = capabilities.typeDefinitionProvider;
            const id = Is.string(implCapabilities.id) && implCapabilities.id.length > 0 ? implCapabilities.id : UUID.generateUuid();
            const selector = implCapabilities.documentSelector || documentSelector;
            if (selector) {
                this.register(this.messages, {
                    id,
                    registerOptions: Object.assign({}, { documentSelector: selector })
                });
            }
        }
    }
    registerLanguageProvider(options) {
        let client = this._client;
        let provideTypeDefinition = (document, position, token) => {
            return client.sendRequest(vscode_languageserver_protocol_1.TypeDefinitionRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDefinitionResult, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.TypeDefinitionRequest.type, error);
                return Promise.resolve(null);
            });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerTypeDefinitionProvider(options.documentSelector, {
            provideTypeDefinition: (document, position, token) => {
                return middleware.provideTypeDefinition
                    ? middleware.provideTypeDefinition(document, position, token, provideTypeDefinition)
                    : provideTypeDefinition(document, position, token);
            }
        });
    }
}
exports.TypeDefinitionFeature = TypeDefinitionFeature;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const UUID = __webpack_require__(36);
const vscode_1 = __webpack_require__(2);
const vscode_languageserver_protocol_1 = __webpack_require__(7);
function access(target, key) {
    if (target === void 0) {
        return undefined;
    }
    return target[key];
}
class WorkspaceFoldersFeature {
    constructor(_client) {
        this._client = _client;
        this._listeners = new Map();
    }
    get messages() {
        return vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type;
    }
    fillInitializeParams(params) {
        let folders = vscode_1.workspace.workspaceFolders;
        if (folders === void 0) {
            params.workspaceFolders = null;
        }
        else {
            params.workspaceFolders = folders.map(folder => this.asProtocol(folder));
        }
    }
    fillClientCapabilities(capabilities) {
        capabilities.workspace = capabilities.workspace || {};
        capabilities.workspace.workspaceFolders = true;
    }
    initialize(capabilities) {
        let client = this._client;
        client.onRequest(vscode_languageserver_protocol_1.WorkspaceFoldersRequest.type, (token) => {
            let workspaceFolders = () => {
                let folders = vscode_1.workspace.workspaceFolders;
                if (folders === void 0) {
                    return null;
                }
                let result = folders.map((folder) => {
                    return this.asProtocol(folder);
                });
                return result;
            };
            let middleware = client.clientOptions.middleware.workspace;
            return middleware && middleware.workspaceFolders
                ? middleware.workspaceFolders(token, workspaceFolders)
                : workspaceFolders(token);
        });
        let value = access(access(access(capabilities, 'workspace'), 'workspaceFolders'), 'changeNotifications');
        let id;
        if (typeof value === 'string') {
            id = value;
        }
        else if (value === true) {
            id = UUID.generateUuid();
        }
        if (id) {
            this.register(this.messages, {
                id: id,
                registerOptions: undefined
            });
        }
    }
    register(_message, data) {
        let id = data.id;
        let client = this._client;
        let disposable = vscode_1.workspace.onDidChangeWorkspaceFolders((event) => {
            let didChangeWorkspaceFolders = (event) => {
                let params = {
                    event: {
                        added: event.added.map(folder => this.asProtocol(folder)),
                        removed: event.removed.map(folder => this.asProtocol(folder))
                    }
                };
                this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type, params);
            };
            let middleware = client.clientOptions.middleware.workspace;
            middleware && middleware.didChangeWorkspaceFolders
                ? middleware.didChangeWorkspaceFolders(event, didChangeWorkspaceFolders)
                : didChangeWorkspaceFolders(event);
        });
        this._listeners.set(id, disposable);
    }
    unregister(id) {
        let disposable = this._listeners.get(id);
        if (disposable === void 0) {
            return;
        }
        this._listeners.delete(id);
        disposable.dispose();
    }
    dispose() {
        for (let disposable of this._listeners.values()) {
            disposable.dispose();
        }
        this._listeners.clear();
    }
    asProtocol(workspaceFolder) {
        if (workspaceFolder === void 0) {
            return null;
        }
        return { uri: this._client.code2ProtocolConverter.asUri(workspaceFolder.uri), name: workspaceFolder.name };
    }
}
exports.WorkspaceFoldersFeature = WorkspaceFoldersFeature;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(1);
const os = __webpack_require__(17);
const net = __webpack_require__(19);
const cp = __webpack_require__(4);
function makeRandomHexString(length) {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    let result = '';
    for (let i = 0; i < length; i++) {
        let idx = Math.floor(chars.length * Math.random());
        result += chars[idx];
    }
    return result;
}
function generatePipeName() {
    let randomName = 'vscode-lang-' + makeRandomHexString(40);
    if (process.platform === 'win32') {
        return '\\\\.\\pipe\\' + randomName + '-sock';
    }
    // Mac/Unix: use socket file
    return path.join(os.tmpdir(), randomName + '.sock');
}
function generatePatchedEnv(env, stdInPipeName, stdOutPipeName) {
    // Set the two unique pipe names and the electron flag as process env
    let newEnv = {};
    for (let key in env) {
        newEnv[key] = env[key];
    }
    newEnv['STDIN_PIPE_NAME'] = stdInPipeName;
    newEnv['STDOUT_PIPE_NAME'] = stdOutPipeName;
    newEnv['ATOM_SHELL_INTERNAL_RUN_AS_NODE'] = '1';
    newEnv['ELECTRON_RUN_AS_NODE'] = '1';
    return newEnv;
}
function fork(modulePath, args, options, callback) {
    let callbackCalled = false;
    let resolve = (result) => {
        if (callbackCalled) {
            return;
        }
        callbackCalled = true;
        callback(undefined, result);
    };
    let reject = (err) => {
        if (callbackCalled) {
            return;
        }
        callbackCalled = true;
        callback(err, undefined);
    };
    // Generate two unique pipe names
    let stdInPipeName = generatePipeName();
    let stdOutPipeName = generatePipeName();
    let newEnv = generatePatchedEnv(options.env || process.env, stdInPipeName, stdOutPipeName);
    let childProcess;
    // Begin listening to stdout pipe
    let stdOutServer = net.createServer((stdOutStream) => {
        // The child process will write exactly one chunk with content `ready` when it has installed a listener to the stdin pipe
        stdOutStream.once('data', (_chunk) => {
            // The child process is sending me the `ready` chunk, time to connect to the stdin pipe
            childProcess.stdin = net.connect(stdInPipeName);
            // From now on the childProcess.stdout is available for reading
            childProcess.stdout = stdOutStream;
            resolve(childProcess);
        });
    });
    stdOutServer.listen(stdOutPipeName);
    let serverClosed = false;
    let closeServer = () => {
        if (serverClosed) {
            return;
        }
        serverClosed = true;
        process.removeListener('exit', closeServer);
        stdOutServer.close();
    };
    // Create the process
    let bootstrapperPath = path.join(__dirname, 'electronForkStart');
    childProcess = cp.fork(bootstrapperPath, [modulePath].concat(args), {
        silent: true,
        cwd: options.cwd,
        env: newEnv,
        execArgv: options.execArgv
    });
    childProcess.once('error', (err) => {
        closeServer();
        reject(err);
    });
    childProcess.once('exit', (err) => {
        closeServer();
        reject(err);
    });
    // On exit still close server
    process.once('exit', closeServer);
}
exports.fork = fork;

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const cp = __webpack_require__(4);
const path_1 = __webpack_require__(1);
const isWindows = (process.platform === 'win32');
const isMacintosh = (process.platform === 'darwin');
const isLinux = (process.platform === 'linux');
function terminate(process, cwd) {
    if (isWindows) {
        try {
            // This we run in Atom execFileSync is available.
            // Ignore stderr since this is otherwise piped to parent.stderr
            // which might be already closed.
            let options = {
                stdio: ['pipe', 'pipe', 'ignore']
            };
            if (cwd) {
                options.cwd = cwd;
            }
            cp.execFileSync('taskkill', ['/T', '/F', '/PID', process.pid.toString()], options);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (isLinux || isMacintosh) {
        try {
            var cmd = path_1.join(__dirname, 'terminateProcess.sh');
            var result = cp.spawnSync(cmd, [process.pid.toString()]);
            return result.error ? false : true;
        }
        catch (err) {
            return false;
        }
    }
    else {
        process.kill('SIGKILL');
        return true;
    }
}
exports.terminate = terminate;

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(5);
const path_1 = __webpack_require__(1);
const vscode = __webpack_require__(2);
exports.SORT_CHEAT = "\u200B";
class TestHelper {
    constructor(client, started = false) {
        this.client = client;
        this.started = started;
    }
}
exports.TestHelper = TestHelper;
/**
 * Returns whether or not a completion is included in the list of common completions that are stored.
 */
function completionCommon(completion, completions) {
    return completions.some(c => c.label === completion.label && c.namespace === completion.namespace);
}
exports.completionCommon = completionCommon;
/**
 * Retrieve from the disk the list of common completions
 */
function getStoredCompletions(context) {
    let dir = commonCompletionDirectory(context);
    let file = exports.commonCompletionLocation(context);
    if (storageInvalid(file, dir))
        return [];
    let text = fs_1.readFileSync(file).toString();
    // Text should never be empty. 
    if (text === "") {
        InitializeStorage(file);
        return [];
    }
    return JSON.parse(text);
}
exports.getStoredCompletions = getStoredCompletions;
/**
 * Adds the completion to the list of common completions in the disk
 */
function storeCompletion(context, completion) {
    let existingStorage = getStoredCompletions(context);
    if (!existingStorage.includes(completion))
        existingStorage.push(completion);
    let file = exports.commonCompletionLocation(context);
    fs_1.writeFile(file, JSON.stringify(existingStorage), () => null);
}
exports.storeCompletion = storeCompletion;
/**
 * Checks if the required files for the completions exist in the system. If not, it creates them and return false.
 */
function storageInvalid(file, dir) {
    if (!fs_1.existsSync(dir)) {
        fs_1.mkdirSync(dir);
        InitializeStorage(file);
        return true;
    }
    else if (!fs_1.existsSync(file)) {
        InitializeStorage(file);
        return true;
    }
    return false;
}
exports.storageInvalid = storageInvalid;
/**
 * Inserts a using expression at the start of the document in the active text editor
 */
function addUsing(pick, context, completion) {
    if (typeof pick === "undefined")
        return;
    // Remove invisible unicode char
    if (pick[0] === exports.SORT_CHEAT)
        pick = pick.substr(1, pick.length);
    storeCompletion(context, new StoredCompletion(completion.Name, pick));
    let editBuilder = (textEdit) => {
        textEdit.insert(new vscode.Position(0, 0), `using ${pick};\n`);
    };
    vscode.window.activeTextEditor.edit(editBuilder);
}
exports.addUsing = addUsing;
function InitializeStorage(location) {
    fs_1.writeFileSync(location, "[]");
}
exports.InitializeStorage = InitializeStorage;
// import path = require('path');
// import { existsSync, mkdirSync, writeFileSync, readFileSync, writeFile } from 'fs';
exports.commonCompletionLocation = (context) => path_1.join(commonCompletionDirectory(context), "commonCompletions.json");
const commonCompletionDirectory = (context) => path_1.join(context.globalStoragePath, "completions");
const typeInfoIdentifier = "```csharp\n";
/**
 * Gets the string that is in the hover result provided by the C# extension in a given position and file uri.
 */
function getHoverString(uri, position) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the hover info of the variable from the C# extension
        let hover = (yield vscode.commands.executeCommand("vscode.executeHoverProvider", uri, position));
        if (hover.length === 0)
            return undefined;
        let hovers = hover[0].contents;
        let typeHover = hovers.find(hover => {
            let cast = hover;
            return cast.value.startsWith(typeInfoIdentifier);
        });
        return typeHover.value;
    });
}
exports.getHoverString = getHoverString;
class StoredCompletion {
    constructor(label, namespace) {
        this.label = label;
        this.namespace = namespace;
    }
}
exports.StoredCompletion = StoredCompletion;
const projectExtension = ".csproj";
function getAllProjectFiles() {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders === undefined)
        return [];
    let files = flatten(workspaceFolders.map(folder => findByExtensionDeep(folder.uri.path.slice(1), projectExtension)));
    return files;
}
exports.getAllProjectFiles = getAllProjectFiles;
function flatten(arr) {
    return arr.reduce((acc, val) => acc.concat(val), []);
}
exports.flatten = flatten;
function findByExtensionDeep(folder, extension) {
    // let projectFiles = glob.sync(folder + '/**/*.' + projectExtension);
    // return projectFiles;
    let result = recFindByExtLogic(folder, extension, undefined, undefined);
    return result;
}
exports.findByExtensionDeep = findByExtensionDeep;
function recFindByExtLogic(folder, extension, files, result) {
    files = files || fs_1.readdirSync(folder);
    result = result || [];
    files.forEach((file) => {
        let newFolder = path_1.join(folder, file);
        if (fs_1.statSync(newFolder).isDirectory()) {
            result = recFindByExtLogic(newFolder, extension, fs_1.readdirSync(newFolder), result);
        }
        else {
            if (file.substr(-1 * (extension.length)) === extension) {
                result.push(newFolder);
            }
        }
    });
    return result;
}


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map