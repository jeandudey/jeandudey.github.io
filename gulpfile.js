var gulp = require('gulp');
var csso = require('gulp-csso');

gulp.task('build', function() {
    return gulp.src("assets/css/page.css")
        .pipe(csso())
        .pipe(gulp.dest('./build/css'));
});
