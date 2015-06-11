# MdInclude

Includes referenced files into a Markdown file.

## Simple Text Include

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
var result = mdinclude('main.md');
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

## CSV Include

Example files:

**main.md**

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
var result = mdinclude('main.md');
```

The variable `result` now contains the following string:

```
# Data Document

| Column 1 | Column 2 |
| 1 | 2 |
| 3 | 4 |

Some additional content.
```

## Interface

_MdInclude_ supports three ways of usage.

1. Specify a file to read and process, returning a string 
   with the processed file content.
2. Specify a reference path and a string, returning the processed string 
   using the reference path to resolve relative paths in file references.
3. Give no arguments to retrieve a gulp processing step.

### Usage with a file

Give a path to a Markdown file as only argument.

``` js
var mdinclude = require('mdinclude');
var result = mdinclude('document.md');
```

### Usage with a string

Give a path as reference for relative paths and a string 
to process as Markdown text.

``` js
var mdinclude = require('mdinclude');
var documentText = 
	'# Introduction\n' +
	'<!-- #include intro.md -->\n' +
	'# Dataset\n' +
	'<!-- #csv values.csv -->';
var referencePath = 'project_a/docs/includes';
var result = mdinclude(referencePath, documentText);
```

### Usage with gulp

``` js
var gulp = require('gulp');
var mdinclude = require('mdinclude');

gulp.task('preprocess-markdown', function() {
	return gulp.src('docs/*.md')
		.pipe(mdinclude())
		.pipe(gulp.dest('out'));
});
```

## License

_MdInclude_ is published under the MIT license.
