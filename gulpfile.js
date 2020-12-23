var gulp = require("gulp");
var browserify = require("browserify");
var gutil = require("gulp-util");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var watchify = require("watchify");

var paths = {
    pages: ['src/*.html'],
    styles: ['src/css/**/*.css'],
    scripts: ['src/js/**/*.js'],
    images: ['src/img/**/*.png'],
    texts: ['src/humans.txt', 'src/robots.txt'],
    icons: ['src/*.ico', 'src/*.png'],
    configs: ['src/*.xml', 'src/.htaccess']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-css", function () {
    return gulp.src(paths.styles)
        .pipe(gulp.dest("dist/css"));
});

gulp.task("copy-js", function () {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest("dist/js"));
});

gulp.task("copy-img", function () {
    return gulp.src(paths.images)
        .pipe(gulp.dest("dist/img"));
});

gulp.task("copy-txt", function () {
    return gulp.src(paths.texts)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-ico", function () {
    return gulp.src(paths.icons)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-cfg", function () {
    return gulp.src(paths.configs)
        .pipe(gulp.dest("dist"));
});

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/js/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

var bundle = function () {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist/js"));
};

gulp.task("build", ["copy-html", "copy-css", "copy-js", "copy-img", "copy-txt", "copy-ico", "copy-cfg"]);
gulp.task("default", ["build"], bundle);

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
