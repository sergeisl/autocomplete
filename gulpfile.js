const gulp = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-html-minifier');
const jsonMinify = require('gulp-json-minify');

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './public/'
        },
        directory: false,
        port: 3000,
        open: false
    });
});

gulp.task('clean', () => {
    return gulp.src(['./public/*.js', './build'], {read: false})
        .pipe(clean());
});

gulp.task('webpack', (cb) => {
    webpack(require('./webpack.config.js')).run((err, stats) => {
        cb();
    });

});

gulp.task('watch', () => {
    gulp.watch('./src/**/*.*', ['webpack']);
    gulp.watch([
        './src/**/*.*',
        './public/*.html'
    ]).on('change', browserSync.reload);
});

gulp.task('build:html', () => {
    return gulp.src('public/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./build'));

});

gulp.task('build:js', () => {
    return gulp.src('public/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build'));

});

gulp.task('build:json', () => {
    return gulp.src('public/*.json')
        .pipe(jsonMinify())
        .pipe(gulp.dest('./build'));

});

gulp.task('default', ['webpack','browser-sync', 'watch']);

gulp.task('build', ['clean'], () => {
	gulp.run(['build:run']);
});

gulp.task('build:run', ['webpack'], () => {
	gulp.run(['build:html', 'build:js', 'build:json']);
});