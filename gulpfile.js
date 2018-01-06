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
gulp.task('images', () => {
  return gulp.src('app/img/**/*.{png,svg,jpg}').pipe(gulp.dest('public_html/img/'));
});

// перенос наших шрифтов
gulp.task('fonts', () => {
  return gulp.src('app/fonts/**/*.*').pipe(gulp.dest('public_html/fonts'));
});

// Обьединение файлов стилей из папки app/css/ и перенос в папку public_html/css
gulp.task('styles', () => {
  return gulp
    .src(mainCss)
    .pipe(
      plumber({
        errorHandler: notify.onError(err => {
          return { title: 'Style', message: err.message };
        })
      })
    )
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('main.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('public_html/css/'));
});

// Модули javascript. С минификацией и переносом
gulp.task('build:js', () => {
  return gulp
    .src(mainJs)
    .pipe(
      plumber({
        errorHandler: notify.onError(err => {
          return { title: 'javaScript', message: err.message };
        })
      })
    )
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public_html/js'));
});
/* -------- Объединение всех подключаемых плагинов в один файл -------- */
gulp.task('vendor:js', () => {
  return gulp
    .src(vendorJs)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public_html/js'));
});
/* -------- Объединение всех стилей подключаемых плагинов в один файл -------- */
gulp.task('vendor:css', () => {
  return gulp
    .src(vendorCss)
    .pipe(concat('vendor.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('public_html/css/'));
});

// Очистка папки dist
gulp.task('clean:dist', () => {
  return del(['public_html'], { force: true }).then(paths => {
    console.log('Deleted files and folders: in public_html');
  });
});
// перенос статических ресурсов
gulp.task('move:assets', ['styles', 'images', 'build:js', 'vendor:js', 'vendor:css', 'fonts']);

// Выполнить билд проекта
gulp.task('build', callback => {
  runSequence(['clean:dist'], ['move:assets'], callback);
});
