var gulp = require('gulp');
var csso = require('gulp-csso');
var pug = require('gulp-pug');

gulp.task('build', function() {
  gulp.src("./assets/css/page.css")
    .pipe(csso())
    .pipe(gulp.dest('./build/css'));

  gulp.src("./pug/index.pug")
    .pipe(pug({
      locals: {
          css_file: "./build/css/page.css",
      }
    }))
    .pipe(gulp.dest("./"))
});
