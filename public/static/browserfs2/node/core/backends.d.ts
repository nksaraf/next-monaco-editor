import AsyncMirror from '../backend/AsyncMirror';
import FolderAdapter from '../backend/FolderAdapter';
import InMemory from '../backend/InMemory';
import IndexedDB from '../backend/IndexedDB';
import LocalStorage from '../backend/LocalStorage';
import MountableFileSystem from '../backend/MountableFileSystem';
import OverlayFS from '../backend/OverlayFS';
import WorkerFS from '../backend/WorkerFS';
import HTTPRequest from '../backend/HTTPRequest';
import BundledHTTPRequest from '../backend/BundledHTTPRequest';
import ZipFS from '../backend/ZipFS';
import CodeSandboxFS from '../backend/CodeSandboxFS';
import UNPKGRequest from '../backend/UNPKGRequest';
import CodeSandboxEditorFS from '../backend/CodeSandboxEditorFS';
import DynamicHTTPRequest from '../backend/DynamicHTTPRequest';
/**
 * @hidden
 */
declare const Backends: {
    AsyncMirror: typeof AsyncMirror;
    FolderAdapter: typeof FolderAdapter;
    InMemory: typeof InMemory;
    IndexedDB: typeof IndexedDB;
    OverlayFS: typeof OverlayFS;
    LocalStorage: typeof LocalStorage;
    MountableFileSystem: typeof MountableFileSystem;
    WorkerFS: typeof WorkerFS;
    BundledHTTPRequest: typeof BundledHTTPRequest;
    HTTPRequest: typeof HTTPRequest;
    UNPKGRequest: typeof UNPKGRequest;
    XmlHttpRequest: typeof HTTPRequest;
    ZipFS: typeof ZipFS;
    CodeSandboxFS: typeof CodeSandboxFS;
    CodeSandboxEditorFS: typeof CodeSandboxEditorFS;
    DynamicHTTPRequest: typeof DynamicHTTPRequest;
};
export default Backends;
