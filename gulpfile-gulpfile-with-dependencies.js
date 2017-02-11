var gulp = require("gulp");
var autoprefixer = require("gulp-autoprefixer"); // add css prefixes
var bootlint  = require('gulp-bootlint');  //bootstrap lint
var cleanCSS = require("gulp-clean-css"); // minify css
var concat = require("gulp-concat"); //concatenate files
var del = require('del');  //delete files note this is an npm module
var plumber = require("gulp-plumber"); // gulp error handling
var plumberNotifier = require("gulp-plumber-notifier"); // gulp error notification
var rename = require("gulp-rename");  //rename files
var wait = require("gulp-wait"); // insert wait, didn't work

/*
===========================================
=====     Begin CSS processing        =====
===========================================
  This processing will be done synchronously
  using dependencies.
*/


function delay (waitTime) {
  setTimeout(function(){
    console.log("ms delay: " + waitTime);
  }, waitTime);
}



/* 01 Delete files before processing current files */
gulp.task("css-delete-build", function () {
  console.log("css task 01: css-delete-build");
  return del([
    // here we use a globbing pattern to delete everything inside the `build` folder
    'build/css/**/*',
  ]);
});


gulp.task("after-delete", ["css-delete-build"], function () {
  console.log("wait task 01: after css-delete-build");
  //delay(3000); //wait, console should verify added time.
  wait(3000);
  console.log("completed wait task 01: after css-delete-build");
});


/*
 CSS Order
1.  Add autoprefix to class
2.  Concatenate CSS files in order of html
3.  Minify CSS
4.  Add minified
4.  Test CSS file to make sure the web site works as
*/

// 02 CSS autoprefix
// input         : "css/*.css"
// output folder : "build/css/01-autoprefix"
// dependency on : "css-delete-build"
gulp.task("css-autoprefix", ["after-delete"],function(){
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

// 02 CSS Concatenate
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
gulp.task("css-concat", ["css-autoprefix"],function() {
  wait(2000); //wait, console should verify added time.
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

// 03 CSS Minify
// input:  "build/css/02-concatenate/*.css"
// output: "build/css/03-minify"
//minify converted scss => css files
gulp.task("css-minify", ["css-concat"], function() {
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


// 04 rename via string
gulp.task("css-rename", ["css-minify"], function() {
  console.log("css task 05: css-rename");
  return gulp.src("build/css/03-minify/css-concat.css")
   .pipe(rename("site.css"))
   .pipe(gulp.dest("build/css/"));

});

/*
===========================================
=====       End CSS processing        =====
===========================================
*/



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


gulp.task("default", ["css-delete-build"
									 ,"css-autoprefix"
									 ,"css-concat"
									 ,"css-minify"
									 ,"css-rename"
								 ]);
