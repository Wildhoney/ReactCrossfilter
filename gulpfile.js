(function main() {

    var mainModule = 'component/ReactCrossfilter.js',
        vendorDest = 'example/vendor/react-crossfilter',
        devDist    = 'react-crossfilter.js',
        minDist    = 'react-crossfilter.min.js';

    var gulp    = require('gulp'),
        uglify  = require('gulp-uglify'),
        rename  = require('gulp-rename'),
        jshint  = require('gulp-jshint'),
        karma   = require('gulp-karma');

    gulp.task('compile', function gulpCompile() {

        return gulp.src(mainModule)
            .pipe(rename(devDist))
            .pipe(gulp.dest('dist'))
            .pipe(rename(minDist))
            .pipe(uglify())
            .pipe(gulp.dest('dist'));

    });

    gulp.task('vendor', function gulpVendor() {

        return gulp.src(mainModule)
            .pipe(rename(devDist))
            .pipe(gulp.dest(vendorDest));

    });

    gulp.task('karma', function gulpKarma() {

        return gulp.src([])
            .pipe(karma({
                configFile: 'karma.conf.js',
                action: 'run'
            }))
            .on('error', function onError(error) {
                throw error;
            });

    });

    gulp.task('hint', function gulpHint() {

        return gulp.src(mainModule)
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'));

    });

    //gulp.task('test', ['hint', 'karma']);
    gulp.task('test', ['hint']);
    gulp.task('build', ['compile', 'vendor']);
    gulp.task('default', ['test', 'build']);
    gulp.task('watch', function watch() {
        gulp.watch('component/*.js', ['build']);
    });

})();