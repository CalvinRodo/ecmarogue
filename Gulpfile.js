'use strict';
var gulp = require('gulp');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var browserify = require('gulp-browserify');
var print = require('gulp-print');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;

function startExpress() {
 
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
  gutil.log(EXPRESS_ROOT + ' served up on ' + EXPRESS_PORT);
}

gulp.task('default', ['clean', 'scripts-dev', 'server'], function(){
});

gulp.task('server', function(){
	startExpress();
});

gulp.task('clean', function(){
	gulp.src('public/scripts/*.js', { read: false })
		.pipe(clean());
});

gulp.task('scripts-dev', function(){
	gulp.src('src/app.js')
		.pipe(print())
		.pipe(browserify())
		.pipe(gulp.dest('public/scripts'));
	gulp.src('src/rot.js')
		.pipe(print())
		.pipe(gulp.dest('public/scripts'));
});
gulp.task('watch', function(){
	gulp.watch('src/*.js', ['scripts-dev']);
});
