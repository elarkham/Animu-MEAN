var gulp   = require('gulp');
var sass   = require('gulp-sass');
var jshint = require('gulp-jshint');

gulp.task('css', function(){
        return gulp.src('./sass/**/*.scss')
                .pipe(sass().on('error', sass.logError))
                .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function() {
        gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('js', function(){

        return gulp.src(['server.js', 'public/app/*.js', 'public/app/**/*.js', 'app/**/*.js'])
                .pipe(jshint())
                .pipe(jshint.reporter('default'));
});

