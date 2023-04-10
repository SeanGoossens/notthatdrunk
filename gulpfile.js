// GULP PACKAGES
// Most packages are lazy loaded
var gulp = require("gulp"),
  gutil = require("gulp-util"),
  filter = require("gulp-filter"),
  touch = require("gulp-touch-cmd"),
  sass = require("gulp-sass")(require("sass")),
  plugin = require("gulp-load-plugins")();

// GULP VARIABLES
// Modify these variables to match your project needs

// Set local URL if using Browser-Sync
const LOCAL_URL = "http://fsbase.local/";

// Set path to Foundation files
const FOUNDATION = "node_modules/foundation-sites";

// Select Foundation components, remove components project will not use
const SOURCE = {
  scripts: [
    // Lets grab what-input first
    "node_modules/what-input/dist/what-input.js",

    // Foundation core - needed if you want to use any of the components below
    FOUNDATION + "/dist/js/plugins/foundation.core.js",
    FOUNDATION + "/dist/js/plugins/foundation.util.*.js",

    // Pick the components you need in your project
    FOUNDATION + "/dist/js/plugins/foundation.abide.js",
    FOUNDATION + "/dist/js/plugins/foundation.accordion.js",
    FOUNDATION + "/dist/js/plugins/foundation.accordionMenu.js",
    FOUNDATION + "/dist/js/plugins/foundation.drilldown.js",
    FOUNDATION + "/dist/js/plugins/foundation.dropdown.js",
    FOUNDATION + "/dist/js/plugins/foundation.dropdownMenu.js",
    FOUNDATION + "/dist/js/plugins/foundation.equalizer.js",
    FOUNDATION + "/dist/js/plugins/foundation.interchange.js",
    FOUNDATION + "/dist/js/plugins/foundation.offcanvas.js",
    FOUNDATION + "/dist/js/plugins/foundation.orbit.js",
    FOUNDATION + "/dist/js/plugins/foundation.responsiveMenu.js",
    FOUNDATION + "/dist/js/plugins/foundation.responsiveToggle.js",
    FOUNDATION + "/dist/js/plugins/foundation.reveal.js",
    FOUNDATION + "/dist/js/plugins/foundation.slider.js",
    FOUNDATION + "/dist/js/plugins/foundation.smoothScroll.js",
    FOUNDATION + "/dist/js/plugins/foundation.magellan.js",
    FOUNDATION + "/dist/js/plugins/foundation.sticky.js",
    FOUNDATION + "/dist/js/plugins/foundation.tabs.js",
    FOUNDATION + "/dist/js/plugins/foundation.responsiveAccordionTabs.js",
    FOUNDATION + "/dist/js/plugins/foundation.toggler.js",
    FOUNDATION + "/dist/js/plugins/foundation.tooltip.js",
  ],

  // Scss files will be concatenated, minified if ran with --production
  styles: "src/scss/**/*.scss",
};

const ASSETS = {
  styles: "dist/css",
  all: "src",
};

const JSHINT_CONFIG = {
  node: true,
  globals: {
    document: true,
    window: true,
    jQuery: true,
    $: true,
    Foundation: true,
  },
};

// GULP FUNCTIONS

// Compile Sass, Autoprefix and minify
gulp.task("styles", function () {
  return gulp
    .src(SOURCE.styles)
    .pipe(
      plugin.plumber(function (error) {
        gutil.log(gutil.colors.red(error.message));
        this.emit("end");
      })
    )
    .pipe(plugin.sourcemaps.init())
    .pipe(sass.sync())
    .pipe(
      plugin.autoprefixer({
        browsers: ["last 2 versions", "ie >= 9", "ios >= 7"],
        cascade: false,
      })
    )
    .pipe(
      plugin.cssnano({
        reduceIdents: false,
        zindex: false,
        safe: true,
        minifyFontValues: { removeQuotes: false },
      })
    )
    .pipe(plugin.sourcemaps.write("."))
    .pipe(gulp.dest(ASSETS.styles))
    .pipe(touch());
});

// Watch files for changes (without Browser-Sync)
gulp.task("watch", function () {
  // Watch .scss files
  gulp.watch(SOURCE.styles, gulp.parallel("styles"));
});

// Run styles, scripts and foundation-js
gulp.task("default", gulp.parallel("styles"));
