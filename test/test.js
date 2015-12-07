/* globals require, Buffer, describe, it */

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var File = require('vinyl');

var mdinclude = require('../src/index');

var basePath = path.resolve('test/data');

var dataFilePath = function (name) {
	return path.join(basePath, name);
};

var loadFile = function (filePath) {
	return fs.readFileSync(filePath, 'utf-8').
		replace(/\$base_path\$/g, basePath);
};

var streamlinePathSeparator = function (text) {
	return text.replace(/\//g, path.sep);
};

describe('mdinclude', function () {

	describe('used as a function', function () {

		it('should include references and insert error messages', function () {
			var expected = loadFile(dataFilePath('includes.expected.md'));
			var sourcePath = dataFilePath('includes.md');
			var source = loadFile(sourcePath);
			var result = mdinclude(source, { sourcePath: sourcePath });
			expected = streamlinePathSeparator(expected);
			result = streamlinePathSeparator(result);
			assert.equal(result, expected, 'result does not match expected file content');
		});

		it('should include csv data as Markdown tables', function () {
			var expected = loadFile(dataFilePath('csv.expected.md'));
			var source = loadFile(dataFilePath('csv.md'));
			var result = mdinclude(source, { sourcePath: dataFilePath('csv.md') });
			expected = streamlinePathSeparator(expected);
			result = streamlinePathSeparator(result);
			assert.equal(result, expected, 'result does not match expected file content');
		});

		it('should include source code', function () {
			var expected = loadFile(dataFilePath('code.expected.md'));
			var source = loadFile(dataFilePath('code.md'));
			var result = mdinclude(source, { sourcePath: dataFilePath('code.md') });
			expected = streamlinePathSeparator(expected);
			result = streamlinePathSeparator(result);
			assert.equal(result, expected, 'result does not match expected file content');
		});

		it('should include csv and code into nested Markdown files', function () {
			var expected = loadFile(dataFilePath('nested-mix.expected.md'));
			var source = loadFile(dataFilePath('nested-mix.md'));
			var result = mdinclude(source, { sourcePath: dataFilePath('nested-mix.md') });
			expected = streamlinePathSeparator(expected);
			result = streamlinePathSeparator(result);
			assert.equal(result, expected, 'result does not match expected file content');
		});

	});

	describe('used with a file directly', function () {

		it('should transform the file content', function () {
			var expected = loadFile(dataFilePath('includes.expected.md'));
			var sourcePath = dataFilePath('includes.md');
			var result = mdinclude.readFileSync(sourcePath);
			expected = streamlinePathSeparator(expected);
			result = streamlinePathSeparator(result);
			assert.equal(result, expected, 'result does not match expected file content');
		});

	});

	describe('used as a Gulp transformation with buffers', function () {

		it('should transform the buffer content', function (done) {
			var expected = loadFile(dataFilePath('includes.expected.md'));
			var sourcePath = dataFilePath('includes.md');
			var source = loadFile(sourcePath);
			var fakeFile = new File({
				contents: new Buffer(source, 'utf-8'),
				path: sourcePath
			});
			expected = streamlinePathSeparator(expected);

			var stream = mdinclude();
			stream.write(fakeFile);
			stream.once('data', function (file) {
				assert(file.isBuffer(), 'passed file is not a buffer file');
				var result = file.contents.toString('utf-8');
				result = streamlinePathSeparator(result);
				assert.equal(result, expected, 'result does not match expected file content');
				done();
			});
		});

	});

});
