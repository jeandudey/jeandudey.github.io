var gulp = require('gulp');
var csso = require('gulp-csso');
var jade = require('gulp-jade');

gulp.task('build', function() {
    gulp.src("./assets/css/page.css")
        .pipe(csso())
        .pipe(gulp.dest('./build/css'));

    gulp.src("./jade/index.jade")
        .pipe(jade())
        .pipe(gulp.dest("./"))
});
