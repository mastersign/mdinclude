# MdInclude

[![npm package][npm-img]][npm-url]
[![build status][travis-img]][travis-url]

> including referenced files into a [Markdown] file

## Application

_MdInclude_ supports two kinds of includes.
Simple text includes with additional [Markdown] content,
and CSV include with automatic conversion into a [Markdown table][mdtables].

It can be used as a function or with [Gulp].

### Simple Text Include

Example files:

**main.md**

```markdown
# Introduction
Hello, this is an include example.
<!-- #include chapters/one.md -->
<!-- #include chapters/two.md -->
```

**chapters/one.md**

```markdown
## Chapter 1
This is the first chapter.
```

**chapters/two.md**

```markdown
## Chapter 2
This is the second chapter.
```

The following call includes the referenced files:

```js
var mdinclude = require('mdinclude');
var result = mdinclude.readFileSync('main.md');
```

The variable `result` now contains the following string:

```markdown
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

```markdown
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

```markdown
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

```markdown
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

~~~markdown
# Example Source Code

```js
console.log("Hello World");
```

And more content.
~~~

## Interface

_MdInclude_ makes use of [GulpText _simple_][gulp-text-simple] v0.3 to provide the API.
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
[travis-img]: https://img.shields.io/travis/mastersign/mdinclude/master.svg
[travis-url]: https://travis-ci.org/mastersign/mdinclude
[Gulp]: http://gulpjs.com
[Markdown]: https://daringfireball.net/projects/markdown/
[mdtables]: https://michelf.ca/projects/php-markdown/extra/#table
