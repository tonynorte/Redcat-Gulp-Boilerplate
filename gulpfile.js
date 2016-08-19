'use strict';

var gulp           = require('gulp'),
    connect        = require('gulp-connect'),
    open           = require('gulp-open'),
    clean          = require('gulp-clean'),
    sass           = require('gulp-sass'),
    nunjucksRender = require('gulp-nunjucks-render'),
    minify         = require('gulp-minify'),
    jshint         = require('gulp-jshint'),
    sassLint       = require('gulp-sass-lint'),

//localVariables
    partialsPath = 'app/src/partials',
    pathJS       = 'app/src/js',
    pathHtml     =  '*.html';

var config = {
    port : 3000,
    pathJS : 'app/src/js',
    dev : {
        path : 'dist/'
    }
}

gulp.task('clean', function () {
  return gulp.src('app/dist/*.*', {read: false})
    .pipe(clean());
});

gulp.task('sass', function() {
    return gulp.src("app/src/scss/**/*")
        .pipe(sass())
        .pipe(gulp.dest("app/dist/css"))
        .pipe(connect.reload());
});


gulp.task('copy-img', function () {
  return gulp.src('app/src/img/*')
    .pipe(gulp.dest('app/dist/img'));
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
    .pipe(connect.reload());
});

gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(nunjucksRender({
      path: ['app'] // String or Array
    }))
    .pipe(gulp.dest('app/dist'))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: 'app/dist',
        livereload: true,
        port: config.port
    });
});

gulp.task('open', function(){
    gulp.src('')
        .pipe(open({uri: 'http://localhost:' + config.port +'/index.html' }));
});

gulp.task('jshint', function() {
  return gulp.src('app/src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));// could be changed by some custom
});

gulp.task('styles-lint', function() {
    gulp.src('app/src/scss/**/*.scss')
        .pipe(sassLint({
            configFile: '.sass-lint.yml'
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

// Static Server + watching /html files
gulp.task('serve', ['clean' , 'copy-img','styles-lint', 'sass', 'jshint', 'compress', 'html', 'connect', 'open'], function() {
    gulp.watch("app/src/img/**", ['sass']);
    gulp.watch("app/src/scss/**", ['styles-lint', 'sass']);
    gulp.watch("app/src/templates/**/*.html", ['html']);
    gulp.watch("app/src/js/*.js", ['jshint','compress']);
});

gulp.task('default', ['serve']);