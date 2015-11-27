# MdInclude

[![npm package][npm-img]][npm-url]
[![build status][travis-img]][travis-url]

> including referenced files into a Markdown file

## Application

_MdInclude_ supports two kinds of includes.
Simple text includes with additional Markdown content,
and CSV include with automatic conversion into a Markdown table.

### Simple Text Include

Example files:

**main.md**

```
# Introduction
Hello, this is an include example.
<!-- #include chapters/one.md -->
<!-- #include chapters/two.md -->
```

**chapters/one.md**

```
## Chapter 1
This is the first chapter.
```

**chapters/two.md**

```
## Chapter 2
This is the second chapter.
```

The following call includes the referenced files:

``` js
var mdinclude = require('mdinclude');
var result = mdinclude.file('main.md');
```

The variable `result` now contains the following string:

```
# Introduction
Hello, this is an include example.
## Chapter 1
This is the first chapter.
## Chapter 2
This is the second chapter.
```

### CSV Include

Example files:

**data-table.md**

```
# Data Document

<!-- #csv data/values.csv -->

Some additional content.
```

**data/values.csv**

```
"Column 1", "Column 2"
1, 2
3, 4
```

The following call includes the referenced files:

``` js
var mdinclude = require('mdinclude');
var result = mdinclude.file('data-table.md');
```

The variable `result` now contains the following string:

```
# Data Document

| Column 1 | Column 2 |
|----------|----------|
| 1 | 2 |
| 3 | 4 |

Some additional content.
```

## Interface

_MdInclude_ supports three ways of usage.

1. Use the `file(path)` function to read and process a Markdown file directly.
2. Specify a Markdown text and a source path, returning the processed string
   using the reference path to resolve relative paths in file references.
3. Give no arguments to retrieve a gulp processing step.

### Usage directly with a file

Use the function `file(path)` and specify a path to the Markdown file.

``` js
var mdinclude = require('mdinclude');
var result = mdinclude('project_a/docs/index.md');
```

### Usage with a string and a source path

Give a file path as reference for relative paths and a string
to process as Markdown text.

``` js
var mdinclude = require('mdinclude');
var documentPath = 'project_a/docs/index.md';
var documentText =
	'# Introduction\n' +
	'<!-- #include includes/intro.md -->\n' +
	'# Dataset\n' +
	'<!-- #csv values.csv -->';
var result = mdinclude(documentText, { sourcePath: documentPath });
```

### Usage with Gulp

``` js
var mdinclude = require('mdinclude');
var gulp = require('gulp');

gulp.task('preprocess-markdown', function() {
	return gulp.src('docs/*.md')
		.pipe(mdinclude())
		.pipe(gulp.dest('out'));
});
```

## License

_MdInclude_ is published under the MIT license.

[npm-url]: https://www.npmjs.com/package/mdinclude
[npm-img]: https://img.shields.io/npm/v/mdinclude.svg
[travis-img]: https://img.shields.io/travis/mastersign/mdinclude/master.svg
[travis-url]: https://travis-ci.org/mastersign/mdinclude
