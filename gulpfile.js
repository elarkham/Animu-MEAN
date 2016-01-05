var gulp   = require('gulp');
var sass   = require('gulp-sass');
var jshint = require('gulp-jshint');

var jshintConfig    = "./jshintrc";
jshintConfig.lookup = false;

gulp.task('css', function(){
        return gulp.src('public/assets/css/*.scss')
                .pipe(sass().on('error', sass.logError))
                .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('sass:watch', function() {
        gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('js', function(){
        return gulp.src(['server.js', 'public/app/*.js', 'public/app/**/*.js', 'app/**/*.js'])
                .pipe(jshint(jshintConfig))
                .pipe(jshint.reporter('default'));
});

