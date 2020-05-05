var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var purgecss = require('gulp-purgecss');
var del = require('del');

gulp.task('moveStatic', function () {
  del.sync('dist/static');
  return gulp.src('src/static/**/*')
    .pipe(gulp.dest('dist/static'));
});

gulp.task('cleanDist', function (cb) {
  del.sync('dist');
  cb();
});

gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

// Compile sass into CSS & auto-inject into browsers
function gulpSass () {
  return gulp
    .src(['src/sass/*.s?ss'])
    .pipe(sass())
    .pipe(gulp.dest('dist/static/css'))
    .pipe(browserSync.stream());
}

gulp.task(gulpSass);

// Remove unwanted css
gulp.task('purgecss', () => {
  return gulp.src('dist/static/css/**/*.css')
    .pipe(purgecss({
      content: ['src/**/*.html']
    }))
    .pipe(gulp.dest('dist/static/css'));
});

// Move the javascript files into our /src/js folder
function js () {
  return gulp
    .src(['src/js/*.js'])
    .pipe(gulp.dest('dist/static/js'))
    .pipe(browserSync.stream());
}

gulp.task(js);

// Static Server + watching scss/html files
gulp.task('server', gulp.series('gulpSass', function () {
  browserSync.init({
    server: './dist'
  });

  gulp.watch('src/sass/*.s?ss', gulp.series('gulpSass'));
  gulp.watch('src/js/*.js', gulp.series('js'));
  gulp.watch('src/*.html').on('change', gulp.series('html', browserSync.reload));
  gulp.watch('src/static/**/*', gulp.series('moveStatic'));
}));

gulp.task('build', gulp.series('cleanDist', 'moveStatic', 'html', 'gulpSass', 'js'));
gulp.task('serve', gulp.series('build', 'server'));
gulp.task('prod', gulp.series('build', 'purgecss')); // add minification and more
