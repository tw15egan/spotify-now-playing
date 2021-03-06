var gulp = require('gulp') ,
sass = require('gulp-sass') ,
scsslint = require('gulp-scss-lint') ,
autoprefixer = require('gulp-autoprefixer') ,
browserSync = require('browser-sync') ,
plumber = require('gulp-plumber') ,
rename = require("gulp-rename") ,
imageResize = require('gulp-image-resize') ,
uglify = require('gulp-uglify'),
babel = require('gulp-babel'),
reload = browserSync.reload;

var SOURCE = {
	scss: 'scss/**/*.scss',
	css: 'public/css',
	hbs: 'views/**/*.hbs',
	js: 'public/scripts/*.js',
	images: 'public/images/icon-library/svg/*'
};

var AUTOPREFIXER_BROWSERS = [
'ie >= 10',
'ie_mob >= 10',
'ff >= 30',
'chrome >= 34',
'safari >= 7',
'opera >= 23',
'ios >= 7',
'android >= 4.4',
'bb >= 10'
];

gulp.task('browser-sync', function(){
	browserSync({
		proxy: 'localhost:3333',
		notify: false
	});
});

gulp.task('images', function() {
    gulp.src('public/img/bg.jpeg')
    .pipe(imageResize({
        width: '25%',
        height: '25%',
        upscale: false
    }))
    .pipe(rename(function(path){
        path.basename += "-min";
    }))
    .pipe(gulp.dest('./public/img'))
})

gulp.task('bs-reload', function(){
	browserSync.reload();
});

gulp.task('scss-lint', function(){
	gulp.src('/' + SOURCE.scss)
	.pipe(scsslint());
});

gulp.task('sass', ['scss-lint'], function () {
	gulp.src(SOURCE.scss)
	.pipe(plumber())
	.pipe(sass())
	.pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
	.pipe(gulp.dest(SOURCE.css))
	.pipe(reload({stream:true}));
});

gulp.task('default', ['sass', 'browser-sync'], function(){
	gulp.watch(SOURCE.scss, ['sass']);
	gulp.watch([SOURCE.hbs, SOURCE.js], ['bs-reload']);
});
