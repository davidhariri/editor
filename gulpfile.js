// Plugins
var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sass = require('gulp-sass');

// Compile all SASS styles into one CSS file
function scss() {
    gulp.src('source/scss/all.scss')
        .pipe(sass({
            outputStyle : 'expanded'
        }))
        .pipe(gulp.dest('build'));
};

// Compile all ES6 React templates into one ES5 JS file
function jsx() {
    gulp.src('source/jsx/*.js')
        .pipe(babel({
            presets: ['react', 'es2015']
        }))
        .pipe(concat('components.js'))
        .pipe(gulp.dest('build'));
};

// Compile all modules and dependencies into one ES5 JS file
function app() {
    gulp.src(['source/js/*.js'])
        .pipe(babel({
            presets: ['react', 'es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build'));
}

// Compile all JS libraries into one ES5 JS file
function lib() {
    gulp.src(['node_modules/react/dist/react.js', 'node_modules/react-dom/dist/react-dom.js', 'node_modules/net.js/build/net.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('build'));
}

function rebuild() {
    scss();
    jsx();
    app();
    lib();
}

// Default ('gulp build')
gulp.task('default', function() {
    rebuild();
});

// Main watch phase
gulp.task('watch', function () {
    rebuild();

    gulp.watch('source/scss/*.scss', function() {
        scss();
    });

    gulp.watch('source/jsx/*.js', function() {
        jsx();
    });

    gulp.watch('source/js/*.js', function() {
        app();
    });
});
