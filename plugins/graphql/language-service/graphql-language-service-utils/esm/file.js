export function getFileExtension(filePath) {
    const pathParts = /^.+\.([^.]+)$/.exec(filePath);
    if (pathParts && pathParts.length > 1) {
        return pathParts[1];
    }
    return null;
}
export function getPathWithoutExtension(filePath, extension) {
    let pathWithoutExtension = filePath;
    if (extension) {
        pathWithoutExtension = filePath.substr(0, filePath.length - (extension.length + 1));
    }
    return pathWithoutExtension;
}
function handleExtensionErr(extension) {
    if (extension) {
        throw Error(`cannot import() module with extension '${extension}'`);
    }
}
const resolveJs = (path) => require.resolve(path + '.js');
const resolveJSON = (path) => require.resolve(path + '.json');
const importJs = (path) => require(path + '.js');
const importJSON = (path) => require(path + '.json');
export function resolveFile(filePath) {
    const extension = getFileExtension(filePath);
    const pathWithoutExtension = getPathWithoutExtension(filePath, extension);
    switch (extension) {
        case 'js': {
            return resolveJs(pathWithoutExtension);
        }
        case 'json': {
            return resolveJSON(pathWithoutExtension);
        }
        default: {
            try {
                return resolveJs(filePath);
            }
            catch (_error) {
                return resolveJSON(filePath);
            }
        }
    }
}
export function requireFile(filePath) {
    const extension = getFileExtension(filePath);
    const pathWithoutExtension = getPathWithoutExtension(filePath, extension);
    switch (extension) {
        case 'js': {
            if (resolveFile(pathWithoutExtension + `.js`)) {
                return importJs(pathWithoutExtension);
            }
            return null;
        }
        case 'json': {
            if (resolveFile(pathWithoutExtension + `.json`)) {
                return importJSON(pathWithoutExtension);
            }
            return null;
        }
        default: {
            try {
                if (resolveFile(filePath + `.js`)) {
                    return importJs(filePath);
                }
            }
            catch (err) {
                handleExtensionErr(extension);
            }
            if (resolveFile(filePath + `.json`)) {
                return importJSON(filePath);
            }
            handleExtensionErr(extension);
        }
    }
}
//# sourceMappingURL=file.js.map