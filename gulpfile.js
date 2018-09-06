var gulp = require('gulp');
var minCss = require('gulp-clean-css');
var minJs = require('gulp-uglify'),
    sass = require('gulp-sass'),
    path = require('path'),
    url = require('url'),
    fs = require('fs');
server = require('gulp-webserver');
//编译sass
gulp.task('minCss', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./src/css'))
});
//监听sass
gulp.task('watch', function() {
    {
        return gulp.watch('./src/sass/*.scss', gulp.series('minCss'));
    }
});
//起服务
gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9900,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    res.end('');
                    return;
                } else if (pathname === '/api/swiper') {

                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
});
//合并开发环境任务
gulp.task('dev', gulp.series('minCss', 'server', 'watch'));

//线上环境
//压缩js
gulp.task('buildJs', function() {
    return gulp.src(['./src/js/**/*.js', '!./src/js/libs/*.js'])
        .pipe(minJs())
        .pipe(gulp.dest('./build/js'))
});
//压缩css
gulp.task('buildCss', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./build/css'))
});
//压缩 libs下的文件
gulp.task('libsJs', function() {
    return gulp.src('./src/js/libs/*.js')
        .pipe(minJs())
        .pipe(gulp.dest('./build/js/libs'))
});
//压缩html
gulp.task('buildHtml', function() {
    return gulp.src(['./src/**/*.html'])
        .pipe(gulp.dest('./build'))
});
//起服务
gulp.task('buildServer', function() {
    return gulp.src('build')
        .pipe(server({
            port: 9900,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    res.end('');
                    return;
                } else if (pathname === '/api/swiper') {

                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'build', pathname)));
                }
            }
        }))
});
//合并线上环境任务
gulp.task('build', gulp.series('buildJs', 'buildCss', 'buildHtml', 'buildServer'));