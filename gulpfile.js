var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('assets/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/'))
});

//Watch task
gulp.task('default',function() {
    gulp.watch('assets/**/*.scss',['sass']);
});
