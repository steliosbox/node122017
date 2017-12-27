const gulp = require('gulp');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-csso');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const del = require('del');
const runSequence = require('run-sequence');

/* ------ Конфигурация и настройка сборки  -------- */

const vendorJs = [
  'node_modules/jquery/dist/jquery.js',
  'app/libs/jquery.bpopup.js',
  'node_modules/qtip2/dist/jquery.qtip.js'
];

const mainJs = [
  'app/js/login.js',
  'app/js/add_project.js',
  'app/js/validation.js',
  'app/js/contact_me.js'
];

const vendorCss = [
  'node_modules/normalize.css/normalize.css',
  'node_modules/qtip2/dist/jquery.qtip.css'
];

const mainCss = [
  'app/css/about_me_page.css',
  'app/css/my_work_page.css',
  'app/css/contact_me.css',
  'app/css/main.css',
  'app/css/modal.css',
  'app/css/form_elements.css',
  'app/css/login.css'
];

// перенос картинок
gulp.task('images', function() {
  return gulp.src('app/img/**/*.{png,svg,jpg}').pipe(gulp.dest('dist/img/'));
});
// перенос наших шрифтов
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*.*').pipe(gulp.dest('dist/fonts'));
});
// Обьединение файлов стилей из папки app/css/ и перенос в папку dist/css
gulp.task('styles', function() {
  return gulp
    .src(mainCss)
    .pipe(
      plumber({
        errorHandler: notify.onError(function(err) {
          return { title: 'Style', message: err.message };
        })
      })
    )
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('main.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css/'));
});
//Модули javascript. С минификацией и переносом
gulp.task('build:js', function() {
  return gulp
    .src(mainJs)
    .pipe(
      plumber({
        errorHandler: notify.onError(function(err) {
          return { title: 'javaScript', message: err.message };
        })
      })
    )
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
/* -------- Объединение всех подключаемых плагинов в один файл -------- */
gulp.task('vendor:js', function() {
  return gulp
    .src(vendorJs)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
/* -------- Объединение всех стилей подключаемых плагинов в один файл -------- */
gulp.task('vendor:css', function() {
  return gulp
    .src(vendorCss)
    .pipe(concat('vendor.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css/'));
});

// Очистка папки dist
gulp.task('clean:dist', function() {
  return del(['dist'], { force: true }).then(paths => {
    console.log('Deleted files and folders: in dist');
  });
});
// перенос статических ресурсов
gulp.task('move:assets', ['styles', 'images', 'build:js', 'vendor:js', 'vendor:css', 'fonts']);

// Выполнить билд проекта
gulp.task('build', function(callback) {
  runSequence(['clean:dist'], ['move:assets'], callback);
});
