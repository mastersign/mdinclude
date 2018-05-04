/* globals require */

var gulp = require('gulp');
var rename = require('gulp-rename');
var yaml = require('js-yaml');
var textTransformation = require('gulp-text-simple');

var yaml2json = textTransformation(function (yamlText) {
	return yaml.safeLoad(yamlText);
});

gulp.task('update-languages', function (cb) {
	return gulp.src('bower_components/languages/index.yml')
		.pipe(yaml2json())
		.pipe(rename({ basename: 'languages', extname: '.json' }))
		.pipe(gulp.dest('res/'));
});

gulp.task('default', gulp.series('update-languages'));
