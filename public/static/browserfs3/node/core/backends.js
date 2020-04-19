Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var AsyncMirror_1 = require("../backend/AsyncMirror");
// import Dropbox from '../backend/Dropbox';
// import Emscripten from '../backend/Emscripten';
var FolderAdapter_1 = require("../backend/FolderAdapter");
// import HTML5FS from '../backend/HTML5FS';
var InMemory_1 = require("../backend/InMemory");
var IndexedDB_1 = require("../backend/IndexedDB");
var LocalStorage_1 = require("../backend/LocalStorage");
var MountableFileSystem_1 = require("../backend/MountableFileSystem");
var OverlayFS_1 = require("../backend/OverlayFS");
var WorkerFS_1 = require("../backend/WorkerFS");
var HTTPRequest_1 = require("../backend/HTTPRequest");
var BundledHTTPRequest_1 = require("../backend/BundledHTTPRequest");
var ZipFS_1 = require("../backend/ZipFS");
// import IsoFS from '../backend/IsoFS';
var CodeSandboxFS_1 = require("../backend/CodeSandboxFS");
var UNPKGRequest_1 = require("../backend/UNPKGRequest");
var CodeSandboxEditorFS_1 = require("../backend/CodeSandboxEditorFS");
var DynamicHTTPRequest_1 = require("../backend/DynamicHTTPRequest");
// Monkey-patch `Create` functions to check options before file system initialization.
[AsyncMirror_1.default, InMemory_1.default, IndexedDB_1.default, FolderAdapter_1.default, OverlayFS_1.default, LocalStorage_1.default, MountableFileSystem_1.default, WorkerFS_1.default, BundledHTTPRequest_1.default, HTTPRequest_1.default, UNPKGRequest_1.default, ZipFS_1.default, CodeSandboxFS_1.default, CodeSandboxEditorFS_1.default, DynamicHTTPRequest_1.default].forEach(function (fsType) {
    var create = fsType.Create;
    fsType.Create = function (opts, cb) {
        var oneArg = typeof (opts) === 'function';
        var normalizedCb = oneArg ? opts : cb;
        var normalizedOpts = oneArg ? {} : opts;
        function wrappedCb(e) {
            if (e) {
                normalizedCb(e);
            }
            else {
                create.call(fsType, normalizedOpts, normalizedCb);
            }
        }
        util_1.checkOptions(fsType, normalizedOpts, wrappedCb);
    };
});
/**
 * @hidden
 */
var Backends = { AsyncMirror: AsyncMirror_1.default, FolderAdapter: FolderAdapter_1.default, InMemory: InMemory_1.default, IndexedDB: IndexedDB_1.default, OverlayFS: OverlayFS_1.default, LocalStorage: LocalStorage_1.default, MountableFileSystem: MountableFileSystem_1.default, WorkerFS: WorkerFS_1.default, BundledHTTPRequest: BundledHTTPRequest_1.default, HTTPRequest: HTTPRequest_1.default, UNPKGRequest: UNPKGRequest_1.default, XmlHttpRequest: HTTPRequest_1.default, ZipFS: ZipFS_1.default, CodeSandboxFS: CodeSandboxFS_1.default, CodeSandboxEditorFS: CodeSandboxEditorFS_1.default, DynamicHTTPRequest: DynamicHTTPRequest_1.default };
// Make sure all backends cast to FileSystemConstructor (for type checking)
var _ = Backends;
// tslint:disable-next-line:no-unused-expression
_;
// tslint:enable-next-line:no-unused-expression
exports.default = Backends;
//# sourceMappingURL=backends.js.map