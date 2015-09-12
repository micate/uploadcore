var path = require("path");
var fs = require("fs");

// https://github.com/gulpjs/gulp/tree/master/docs
// https://github.com/gulpjs/gulp/blob/master/docs/API.md
var gulp = require('gulp');

var webpack = require("webpack");

// https://github.com/terinjokes/gulp-uglify
var uglify = require('gulp-uglify');

var rename = require('gulp-rename');

var gutil = require("gulp-util");

// http://browsersync.io/
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var webpackConfig = require("./webpack.config");

gulp.task("default", ["server"]);
gulp.task("watch", ["server"]);
gulp.task("start", ["server"]);
gulp.task("server", ["demo"], function (callback) {
    browserSync({
        server: {
            baseDir: './',
            index: './demo/index.html'
        },
        open: 'external'
    });

    gulp.watch(['src/**/*.js', 'demo/**/*.js'], ['reload_demo']);

    callback();
});

gulp.task("demo", function (callback) {
    // modify some webpack config options
    var config = Object.create(webpackConfig);
    config.debug = true;
    config.entry.demo = './demo/index.js';

    config.output.path = path.join(__dirname, "cache");

    webpack(config, function (err) {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }

        callback();
    });
});

gulp.task('reload_demo', ['demo'], function () {
    reload();
});

gulp.task("build", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);

    myConfig.plugins = myConfig.plugins.concat(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }

        gutil.log("[webpack]", stats.toString({
            colors: true
        }));

        callback();
    });
});

gulp.task('flash', function (callback) {
    gulp.src('src/flash/bin/FlashPicker.swf')
        .pipe(rename('flashpicker.swf'))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('spm2'));

    callback();
});



