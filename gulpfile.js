'use strict';

var gulp = require('gulp'),
    browserSync    = require('browser-sync').create(),
    clean          = require('gulp-clean'),
    sass           = require('gulp-sass'),
    nunjucksRender = require('gulp-nunjucks-render'),
    minify         = require('gulp-minify'),

//localVariables
    partialsPath = 'app/src/partials',
    pathJS       = 'app/src/js',
    pathHtml     =  '*.html';


gulp.task('clean', function () {
  return gulp.src('app/dist/*.*', {read: false})
    .pipe(clean());
});


gulp.task('sass', function() {
    return gulp.src("app/src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/dist/css"))
        .pipe(browserSync.stream());
});


gulp.task('compress', function() {
  gulp.src('app/src/js/*.js')
    .pipe(minify({
        /*ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']*/
    }))
    .pipe(gulp.dest('app/dist/js'))
});

gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(nunjucksRender({
      path: ['app'] // String or Array
    }))
    .pipe(gulp.dest('app/dist'));
});

// Static Server + watching /html files
gulp.task('serve', ['clean' , 'sass', 'compress', 'html'], function() {

    browserSync.init({
        server: "./app/dist"
    });

    gulp.watch("app/src/scss/**", ['sass']);
    gulp.watch("app/src/templates/*.html", ['html']);
    gulp.watch("app/src/js/*.js", ['compress']);
    gulp.watch("app/src/**").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);