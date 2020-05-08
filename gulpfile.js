const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const purgecss = require('gulp-purgecss');
const del = require('del');
const liquid = require('@tuanpham-dev/gulp-liquidjs');

gulp.task('liquid', () => {
  return gulp.src('./src/**/*.html')
    .pipe(liquid({
      engine: {
        root: ['./src/_templates', './src/_snippets'],
        extname: '.html'
      }
    }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('moveStatic', function () {
  del.sync('dist/static');
  return gulp.src('src/static/**/*')
    .pipe(gulp.dest('dist/static'));
});

gulp.task('cleanDist', function (cb) {
  del.sync('dist');
  cb();
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
  gulp.watch('src/**/*.html').on('change', gulp.series('liquid', browserSync.reload));
  gulp.watch('src/static/**/*', gulp.series('moveStatic'));
}));

gulp.task('build', gulp.series('cleanDist', 'moveStatic', 'liquid', 'gulpSass', 'js'));
gulp.task('serve', gulp.series('build', 'server'));
gulp.task('prod', gulp.series('build', 'purgecss')); // add minification and more
