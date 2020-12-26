var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

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

var onlyBrowserify = browserify({
    basedir: '.',
    debug: true,
    entries: ['src/js/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify);

var bundle = function () {
    return onlyBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist/js"));
};

gulp.task("default", ["copy-html", "copy-css", "copy-js", "copy-img", "copy-txt", "copy-ico", "copy-cfg"], bundle);
