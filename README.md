# MdInclude

[![npm package][npm-img]][npm-url]
[![dependency status][libraries-img]][libraries-url]
[![build status][travis-img]][travis-url]

> including referenced files into a [Markdown] file

## Application

_MdInclude_ supports four kinds of includes:

* [Simple text includes](#simple-text-include) with additional [Markdown] content
* [Citation include](#citation-include)
* [CSV include](#csv-include) with automatic conversion into a [Markdown table][mdtables]
* [Source code include](#source-code-include) with automatic derivation of syntax type from filename extension.

_MdInclude_ supports [globbing][] for the file path.

It can be used as a function or with [Gulp].

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
# Chapter 1
This is the first chapter.
```

**chapters/two.md**

```
# Chapter 2
This is the second chapter.
```

The following call includes the referenced files:

```js
var mdinclude = require('mdinclude');
var result = mdinclude.readFileSync('main.md');
```

The variable `result` now contains the following string:

```
# Introduction
Hello, this is an include example.
# Chapter 1
This is the first chapter.
# Chapter 2
This is the second chapter.
```

### Citation Include

Example files:

**doc.md**

```
# Quotes

<!-- #cite quotes/einstein.txt -->

Some additional content.
```

**quotes/einstein.txt**

```
Insanity: doing the same thing over and over again and expecting different results.

Albert Einstein
```

The following call includes the referenced files:

```js
var mdinclude = require('mdinclude');
var result = mdinclude.readFileSync('doc.md');
```

The variable `result` now contains the following string:

```
# Quotes

> Insanity: doing the same thing over and over again and expecting different results.
>
> Albert Einstein

Some additional content.
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

```csv
"Column 1", "Column 2"
1, 2
3, 4
```

The following call includes the referenced files:

```js
var mdinclude = require('mdinclude');
var result = mdinclude.readFileSync('data-table.md');
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

### Source Code Include

Example files:

**doc.md**

```
# Example Source Code

<!-- #code example.js -->

And more content.
```

**example.js**

```js
console.log("Hello World.");
```

The following call includes the referenced files:

```js
var mdinclude = require('mdinclude');
var result = mdinclude.readFileSync('doc.md');
```

The variable `result` now contains the following string:

    # Example Source Code

    ```javascript
    console.log("Hello World");
    ```

    And more content.

## Globbing

Globbing works for all kinds of include: Markdown, citation, code, ...

Example files:

**main.md**

```
# Introduction
Hello, this is a globbing example.
<!-- #include chapters/*.md -->
```

**chapters/01.md**

```
# Chapter 1
This is the first chapter.
```

**chapters/02.md**

```
# Chapter 2
This is the second chapter.
```

The following call includes the referenced files:

```js
var mdinclude = require('mdinclude');
var result = mdinclude.readFileSync('main.md');
```

The variable `result` now contains the following string:

```
# Introduction
Hello, this is a globbing example.
# Chapter 1
This is the first chapter.
# Chapter 2
This is the second chapter.
```

The included file paths are sorted before including.
Therefore, the order of the included files in deterministic.
To control the order the glob path can be prefixed by `sort: asc` or `sort: desc`.

If the include statement looks like the following:

```
<!-- #include sort: desc chapters/*.md -->
```

It will result in:

```
# Chapter 2
This is the second chapter.
# Chapter 1
This is the first chapter.
```

## Interface

_MdInclude_ makes use of [GulpText _simple_][gulp-text-simple] to provide the API.
Therefore, it currently supports three ways of usage.

1. Use the `readFileSync(path, [options])` function, to get the processed
   content of a Markdown file.
2. Specify a Markdown string and an option map with the source path,
   to get the processed string, using the reference path to resolve
   relative paths in file references.
3. Give no arguments or only an options map, to get a gulp transformation.

### Transform a file directly

Use the function `readFileSync(path)` and specify a path to the Markdown file.

```js
var mdinclude = require('mdinclude');
var result = mdinclude.readFileSync('project_a/docs/index.md');
```

### Transform a string with a source path

Give a file path as reference for relative paths and a string
to process as Markdown text.

```js
var mdinclude = require('mdinclude');
var documentPath = 'project_a/docs/index.md';
var documentText =
	'# Introduction\n' +
	'<!-- #include includes/intro.md -->\n' +
	'# Dataset\n' +
	'<!-- #csv values.csv -->';
var result = mdinclude(documentText, { sourcePath: documentPath });
```

### Create a Gulp transformation

```js
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
[libraries-url]: https://libraries.io/npm/mdinclude
[libraries-img]: https://img.shields.io/librariesio/github/mastersign/mdinclude.svg
[travis-img]: https://img.shields.io/travis/mastersign/mdinclude/master.svg
[travis-url]: https://travis-ci.org/mastersign/mdinclude
[Gulp]: http://gulpjs.com
[Markdown]: https://daringfireball.net/projects/markdown/
[mdtables]: https://michelf.ca/projects/php-markdown/extra/#table
[gulp-text-simple]: https://www.npmjs.com/package/gulp-text-simple
[globbing]: https://github.com/isaacs/node-glob#glob-primer