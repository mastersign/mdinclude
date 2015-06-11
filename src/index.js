/* global require, module, Buffer */

var through = require('through2');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var csv = require('./csv');

var readFile = function (filePath, pathCache) {
    'use strict';
    if (_.contains(pathCache, filePath)) {
        return '<!-- CIRCULAR INCLUDE REFERENCE: ' + filePath + ' -->';
    }
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        return '<!-- INCLUDE FILE NOT FOUND: ' + filePath + ' -->';
    }
    pathCache.push(filePath);
    return fs.readFileSync(filePath, 'utf8');
};

var csvTable = function(csvText) {
    var data = '';
    var result = '';
    var headline = true;
    var row;
    
    data = csv(csvText);

    // cleanup data: ignore empty lines, ignore # comments
    data = _.filter(data, function(row) {
            return row.length > 0 &&
                (row.length > 1 || row[0].trim().length > 0) &&
                row[0].trim()[0] != '#';
    });

    var escapeCellValue = function(value) {
        return value.
            replace('|', '&#124;').
            replace('<', '&lt;').
            replace('>', '&gt;').
            replace('$', '\\$');
    };

    var formatRow = function(rowData, headline) {
        var r = '|';
        var v;
        for (var i = 0; i < rowData.length; i++) {
            v = escapeCellValue(rowData[i]);
            r += ' ' + v + ' |';
        };
        r += '\n';
        if (headline) {
            r += '|';
            for (var i = 0; i < rowData.length; i++) {
                v = escapeCellValue(rowData[i]);
                r += (new Array(v.length + 3).join('-')) + '|';
            }
            r += '\n';
        }
        return r;
    };

    for (var i = 0; i < data.length; i++) {
        row = data[i];
        result += formatRow(row, headline);
        headline = false;
    };

    // append empty row if table is empty
    if (data.length == 1) {
        row = new Array(data[0].length);
        for (var i = 0; i < row.length; i++) {
            row[i] = '';
        };
        result += formatRow(row, false);
    }
    return result;
};

var transformText = function (text, referencePath, pathCache) {
    'use strict';
    pathCache = pathCache || [];
    text = text.replace(
        /<!--\s+#include\s+(.+?)\s+-->/g,
        function (m, filePath) {
            var branchCache = _.clone(pathCache);
            var absPath = path.resolve(referencePath, filePath);
            var includeContent = readFile(absPath, branchCache);
            return transformText(includeContent, path.dirname(absPath), branchCache);
        });
    text = text.replace(
        /<!--\s+#csv\s+(.+?)\s+-->/g,
        function (m, filePath) {
            var absPath = path.resolve(referencePath, filePath);
            var csvContent = readFile(absPath, []);
            return csvTable(csvContent);
        });
    return text;
};

var transformBuffer = function (buffer, referencePath) {
    'use strict';
    return new Buffer(
        transformText(
            buffer.toString('utf8'),
            referencePath),
        'utf8');
};

var transformFile = function (filePath) {
    'use strict';
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        throw 'File not found.';
    }
    var referencePath = path.dirname(filePath);
    var text = fs.readFileSync(filePath, 'utf8');
    return transformText(text, referencePath);
};

var processIncludes = function (fileOrReferencePath, text) {
    'use strict';
    
    if (fileOrReferencePath) {
        if (typeof(fileOrReferencePath) === 'string') {
            if (text) {
                if (typeof(text) === 'string') {
                    // processIncludes(referencePath, text) -> returns the processed text
                    return transformText(text, fileOrReferencePath);
                } else {
                    throw 'Invalid second argument';
                }
            } else {
                // processIncludes(filePath) -> returns the processed content of the file
                return transformFile(fileOrReferencePath);
            }
        } else {
            throw 'Invalid first argument.';
        }
    }
    
    // processIncludes() -> gulp transformation step
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            cb();
            return;
        }
        if (file.isBuffer()) {
            file.contents = transformBuffer(file.contents, path.dirname(file.path));
            this.push(file);
            cb();
            return;
        }
        if (file.isStream()) {
            throw 'Streams are not supported.';
        }
    });
};

module.exports = processIncludes;
