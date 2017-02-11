var gulp = require("gulp");
var autoprefixer = require("gulp-autoprefixer"); // add css prefixes
var bootlint  = require('gulp-bootlint');  //bootstrap lint
var cleanCSS = require("gulp-clean-css"); // minify css
var concat = require("gulp-concat"); //concatenate files
var del = require('del');  //delete files note this is an npm module
var plumber = require("gulp-plumber"); // gulp error handling
var plumberNotifier = require("gulp-plumber-notifier"); // gulp error notification
var rename = require("gulp-rename");  //rename files
var uglify = require("gulp-uglify"); // minify js
var wait = require("gulp-wait"); // insert wait, didn't work


/*=========================================
=====     Begin CSS processing        =====
===========================================*/
/* 01 Delete files before processing current files */
gulp.task("css-delete-build", function () {
  console.log("css task 01: css-delete-build");
  return del([
    // here we use a globbing pattern to delete everything inside the `build` folder
    'build/css/**/*',
  ]);
});


// 02 CSS autoprefix
// input         : "css/*.css"
// output folder : "build/css/01-autoprefix"
// dependency on : "css-delete-build"
gulp.task("css-autoprefix", function(){
    console.log("css task 02: css-autoprefix");
    gulp.src("css/*.css")
    .pipe(plumber())
    .pipe(plumberNotifier())
    .pipe(autoprefixer({
        browsers: ["last 4 versions"],
        cascade: false
    }))
    .pipe(gulp.dest("build/css/01-autoprefix"));
});


// 03 CSS Concatenate
// input folder:  "build/css/01-autoprefix"
// output folder: "build/css/02-concatenate/"
// Need to figureout bootstrap carousel when I use the minified version of the file the glyphs don't show up
//
// 1.  bootstrap-theme-3.3.7.min.css
// 2.  normalize.css
// 3.  main.css
// 4.  containers.class
// 5.  styles.css
//
// add modernizr.js file to css file
// file has been manually added to directory
// 6.  modernizr-2.8.3.min.js
gulp.task("css-concat", function() {
  console.log("css task 03: css-concat");
  return gulp.src
	([ "build/css/01-autoprefix/bootstrap-theme-3.3.7.min.css"
   , "build/css/01-autoprefix/normalize.css"
   , "build/css/01-autoprefix/main.css"
   , "build/css/01-autoprefix/containers.css"
   , "build/css/01-autoprefix/styles.css"
   ])
    .pipe(plumber())
    .pipe(plumberNotifier())
    .pipe(concat("css-concat.css"))
    .pipe(gulp.dest("build/css/02-concatenate/"));
});


// 04 CSS Minify
// input:  "build/css/02-concatenate/*.css"
// output: "build/css/03-minify"
//minify converted scss => css files
gulp.task("css-minify", function() {
  console.log("css task 04: css-minify");
    return gulp.src("build/css/02-concatenate/*.css")
        .pipe(plumber())
        .pipe(plumberNotifier())
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest("build/css/03-minify/"));
});


// 05 rename via css file and
// move file to output directory asset/css
gulp.task("css-rename", function() {
  console.log("css task 05: css-rename");
  return gulp.src("build/css/03-minify/css-concat.css")
   .pipe(rename("site.css"))
   .pipe(gulp.dest("assets/css/"));
});


/*=========================================
=====        CSS Processing           =====
===========================================
1.  "css-delete-build"
2.  "css-autoprefix"
3.  "css-concat"
4.  "css-minify"
5.  "css-rename"
===========================================
=====       End CSS processing        =====
=========================================*/


/*=========================================
=====      JavaScript Processing      =====
=========================================*/

// 01 delete js build files
gulp.task("js-delete-build", function() {
  console.log("js task 01: js-delete-build");
  return del([
    // here we use a globbing pattern to delete everything inside the `build` folder
    'build/js/**/*',
  ]);
});


// 02 concatenate JS files
// Bootstrap 4 requires the following file order
// 1.  jquery 2.*
// 2.  tether 1.*
// 3.  Bootstrap 4.*
//
// Add other vendor files after Bootstrap Knockout, Lodash, etc.
// Add website scripting after vendor files.
gulp.task("js-concat", function() {
  return gulp.src
	(["js-dev/vendor/jquery-2.2.4.min.js"
   , "js-dev/vendor/tether-1.4.0.min.js"
   , "js-dev/vendor/bootstrap-3.3.7.min.js"
   , "js-dev/scripts.js"
   ])
    .pipe(plumber())
    .pipe(plumberNotifier())
    .pipe(concat("js-concat.js"))
    .pipe(gulp.dest("build/js/01-concatenate"));
});


//  03 minify JS files
gulp.task("js-minify", function(){
  gulp.src("build/js/01-concatenate/*.js")
  .pipe(plumber())
  .pipe(plumberNotifier())
  .pipe(uglify())
  .pipe(gulp.dest("build/js/02-minify"));
});


//  04 rename JS
gulp.task("js-rename", function() {
  console.log("css task 04: js-rename");
  return gulp.src("build/js/02-minify/js-concat.js")
   .pipe(rename("site.js"))
   .pipe(gulp.dest("assets/js/"));
});


/*=========================================
=====      JavaScript Processing      =====
===========================================

1.  delete js build files,   "js-delete-build"
2.  concatenate JS files,    "js-concat"
3.  minify JS file,          "js-minify"
4.  rename and move JS file, "js-rename"

===========================================
=====        End JS processing        =====
=========================================*/


//bootstrap lint
gulp.task("bootlint", function() {
   return gulp.src("./index.html")
      .pipe(plumber())
      .pipe(plumberNotifier())
      .pipe(bootlint());
});

//watch
gulp.task("watch", function(){
   gulp.watch("./index.html", ["bootlint"]);
});


gulp.task("default", ["bootlint"
								 ]);
