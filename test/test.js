/* globals require, Buffer, describe, it */

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var File = require('vinyl');
var _ = require('lodash');

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

var checkTransformation = function (name) {
	var expected = loadFile(dataFilePath(name + '.expected.md'));
	var sourcePath = dataFilePath(name + '.md');
	var source = loadFile(sourcePath);
	var result = mdinclude(source, { sourcePath: sourcePath });
	expected = streamlinePathSeparator(expected);
	result = streamlinePathSeparator(result);
	assert.equal(result, expected, 'result does not match expected file content');
};

var testCases = [
	{ name: 'includes', description: 'should include references and insert error messages' },
	{ name: 'citation', description: 'should include citation and insert error messages' },
	{ name: 'csv', description: 'should include csv data as Markdown tables' },
	{ name: 'code', description: 'should include source code' },
	{ name: 'nested-mix', description: 'should include csv and code into nested Markdown files' },
	{ name: 'includes-glob', description: 'should include globbed Markdown files' }
];

describe('mdinclude', function () {

	describe('used as a function', function () {

		_.forEach(testCases, function (testCase) {
			it(testCase.description, function () {
				checkTransformation(testCase.name);
			});
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
