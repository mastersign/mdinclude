var path = require('path');
var fs = require('fs');
var test = require('tape').test;

var mdinclude = require('../src/index');

var basePath = path.resolve('tests/data');

var checkFileTransformation = function (t, fileName) {
	var expectedFile = path.join(basePath, fileName + '.expected.md');
	var expected = fs.readFileSync(expectedFile, 'utf-8').
		replace(/\$base_path\$/g, basePath);
	
	var sourceFile = path.join(basePath, fileName + '.md');
	var result = mdinclude(sourceFile);
	t.equals(expected, result, 'result after includes matches expected file content');
	t.end();
};

test('inclusion', function(t) {
	checkFileTransformation(t, 'includes');
});

test('csv-table', function(t) {
	checkFileTransformation(t, 'csv');
});
