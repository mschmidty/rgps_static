

//Include our plugins
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var cp = require('child_process');
var del = require('del');



var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ bundle exec jekyll'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['images','scripts','svgstore','styles', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// Compile Our Sass
gulp.task('styles', function() {
    return gulp.src('src/scss/*.scss')
	    .pipe(sass({ style: 'expanded' }))
	    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))

	    .pipe(rename({suffix: '.min'}))
	    .pipe(minifycss())
        .pipe(browserSync.reload({stream:true}))
	    .pipe(gulp.dest('css'))

});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('js'))
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('images'))
});

gulp.task('clean-img', function (cb) {
 return del('images',cb);
 });

gulp.task('svgstore', function () {
    return gulp
        .src('src/svg/*.svg')
        .pipe(svgmin())
        .pipe(svgstore({ inlineSvg:true }))
        .pipe(rename('svg.html'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('_includes'));
});


// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('src/scss/**', ['styles', 'jekyll-rebuild']);
  gulp.watch('src/images/**', ['clean-img', 'images', 'jekyll-rebuild']);
  gulp.watch('src/js/*.js', ['scripts', 'jekyll-rebuild']);
  gulp.watch('src/svg/*.svg', ['svgstore', 'jekyll-rebuild']);
  gulp.watch(['*.html', '_layouts/*.html', '_includes/**/*.html', '_posts/*', '_config.yml'], ['jekyll-rebuild']);

    // Watch tasks go inside inside server.listen()

});

// Default Task
// Default Task
gulp.task('default', ['watch','browser-sync']);
