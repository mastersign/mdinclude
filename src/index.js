/* global require, module, Buffer */

var _ = require('lodash');
var os = require('os');
var path = require('path');
var fs = require('fs');
var textTransformation = require('gulp-text-simple');
var csv = require('./csv');
var langs = require('../res/languages.json');

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
    var i;

    if (_.startsWith(csvText, '<!--')) {
        return csvText;
    }
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
        var i;
        for (i = 0; i < rowData.length; i++) {
            v = escapeCellValue(rowData[i]);
            r += ' ' + v + ' |';
        }
        r += os.EOL;
        if (headline) {
            r += '|';
            for (i = 0; i < rowData.length; i++) {
                v = escapeCellValue(rowData[i]);
                r += (new Array(v.length + 3).join('-')) + '|';
            }
            r += os.EOL;
        }
        return r;
    };

    for (i = 0; i < data.length; i++) {
        row = data[i];
        result += formatRow(row, headline);
        headline = false;
    }

    // append empty row if table is empty
    if (data.length == 1) {
        row = new Array(data[0].length);
        for (i = 0; i < row.length; i++) {
            row[i] = '';
        }
        result += formatRow(row, false);
    }
    return result;
};

var syntaxFromFileName = function (filePath) {
    var ext = path.extname(filePath).toLowerCase();
    var syntaxId = _.findKey(langs, function (ldef, id) {
        return _.some(ldef.extensions, function (lExt) { return ext == lExt; });
    });
    return syntaxId ? syntaxId.toLowerCase() : '';
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
    text = text.replace(
        /<!--\s+#code\((.+?)\)\s+(.+?)\s+-->/g,
        function (m, syntax, filePath) {
            var absPath = path.resolve(referencePath, filePath);
            var sourceCode = readFile(absPath, []);
            if (_.startsWith(sourceCode, '<!-- INCLUDE FILE NOT FOUND:')) {
                return sourceCode;
            } else {
                return '```' + syntax + os.EOL + sourceCode.trim() + os.EOL + '```';
            }
        });
    text = text.replace(
        /<!--\s+#code\s+(.+?)\s+-->/g,
        function (m, filePath) {
            var absPath = path.resolve(referencePath, filePath);
            var sourceCode = readFile(absPath, []);
            if (_.startsWith(sourceCode, '<!-- INCLUDE FILE NOT FOUND:')) {
                return sourceCode;
            } else {
                return '```' + syntaxFromFileName(filePath) + os.EOL + sourceCode.trim() + os.EOL + '```';
            }
        });
    return text;
};

module.exports = textTransformation(function (text, options) {
    var sourcePath = (options ? options.sourcePath : undefined) || './unknown';
    var referencePath = path.dirname(sourcePath);
    return transformText(text, referencePath);
});
