var gulp = require('gulp');
var data = require('gulp-data');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var nunjucksRender = require('gulp-nunjucks-render');
var Eyeglass = require("eyeglass").Eyeglass;

// https://www.npmjs.com/package/gulp-load-plugins

function swallowError (error) {
// details of the error in the console
  console.log(error.toString()); this.emit('end'); }

// Static Server + watching scss/html files

gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: "./",
    index: "rendered/index.html"

  });

  gulp.watch("./source/templates/**/*", ['nunjucks']);
  gulp.watch("./source/sass/*.scss", ['sass']);
  gulp.watch("./rendered/index.html").on('change', reload);

});


gulp.task('nunjucks', function () {
    nunjucksRender.nunjucks.configure(['source/templates/'], {watch: false});
    return gulp.src('source/templates/revolution/index.html')
        .pipe(nunjucksRender({files_name: 'http://company.com/css/'}))
        .pipe(gulp.dest('./rendered'));
});

// https://github.com/sass-eyeglass/eyeglass/blob/master/docs/integrations/gulp.md
var eyeglass = new Eyeglass({
    importer: function(uri, prev, done) {
        done(sass.compiler.types.NULL);
    }
});

eyeglass.enableImportOnce = false

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("./source/sass/*.scss")
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(sourcemaps.write("./maps"))
  .pipe(gulp.dest("./static/css"))
  .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);
