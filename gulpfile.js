'use strict';

var autoPrefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    del = require('del'),
    gulp = require('gulp'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    zip = require('gulp-zip'),
    image = require('gulp-image'),
    spritesmith = require('gulp.spritesmith');

//CACHE FOLDER LOCATIONS
var src = {
    //ROOT FOLDERS
    lib: './lib/',
    dist: './dist/',
    backup: './lib_backup/',
    archive: './lib_archive/',
    //SUB FOLDERS
    pug: 'assets/pug/',
    css: 'assets/css/',
    js: 'assets/js/',
    scss: 'assets/scss/',
    img: 'assets/img/',
    icons: 'assets/img/icons/'
};

//INIT SAVE COUNT
var saveCount = 0,
    //SAVES BEFORE BACKUP
    savesUntilBackup = 5,
    //SAVES BEFORE ZIP
    savesUntilArchive = savesUntilBackup * 10;

/*================================
    BROSWER SYNC + WATCH TASK
================================*/
gulp.task('serve', ['sass', 'pug', 'sprite'], function () {
    browserSync.init({
        server: src.lib
    });
    //WATCH FOR CHANGES TO SCSS, PUG, HTML AND JS FILES AND RUN BACKUP
    gulp.watch(src.lib + src.scss + '**/*.scss', ['sass', 'backup']);
    gulp.watch(src.lib + src.pug + '**/*.pug', ['pug', 'backup']);
    gulp.watch(src.lib + '*.html').on('change', browserSync.reload);
    gulp.watch(src.lib + src.js + '*.js', ['backup']).on('change', browserSync.reload);
});

/*================================
    IMG TASK
================================*/

gulp.task('image', function () {
    return gulp.src(src.lib + src.img + '*')
      .pipe(image());
});


gulp.task('sprite', function() {
    var spriteData =
        gulp.src(src.lib + src.icons + '*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: '_sprite.scss',
                imgPath: '../img/sprite.png',
            }));

    spriteData.img.pipe(gulp.dest('lib/assets/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('lib/assets/scss/utils/')); // путь, куда сохраняем стили
});

/*================================
    SASS TASK
================================*/
gulp.task('sass', function () {
    //LOCATE MAIN.SCSS FILE
    return gulp.src(src.lib + src.scss + 'main.scss')
        //INIT SOURCEMAPS
        .pipe(sourcemaps.init())
        //COMPILE SCSS IF NO ERROR
        .pipe(sass().on('error', sass.logError))
        //WRITE SOURCEMAPS FOR COMPILED SCSS
        .pipe(sourcemaps.write())
        //AUTO PREFIX
        .pipe(autoPrefixer())
        //MOVE COMPILED SCSS TO CSS FOLDER
        .pipe(gulp.dest(src.lib + src.css))
        //RELOAD SERVER
        .pipe(browserSync.stream());
});

/*================================
    PUG TASK
================================*/
gulp.task('pug', function () {
    return gulp.src(src.lib + src.pug + 'pages/*.pug')
        //COMPILE PUG
        .pipe(pug({
            //PROPER HTML INDENTATION
            pretty: true
        }))
        //SEND TO LIB ROOT
        .pipe(gulp.dest(src.lib));
});
/*================================
    DISTRIBUTION TASK
================================*/
gulp.task('deploy', ['clean', 'build', 'minify']);

//CLEAN
gulp.task('clean', function () {
    //DELETE DIST FOLDER
    del.sync(src.dist);
});

//BUILD
gulp.task('build', function () {
    return gulp.src([
        //LOCATE LIB FOLDER
        src.lib + '**',
        //EXLCUDE SCSS FOLDER
        '!' + src.lib + src.scss,
        //EXCLUDE SCSS FILES
        '!' + src.lib + src.scss + '**/*',
        //EXCLUDE PUG FOLDER
        '!' + src.lib + src.pug,
        //EXCLUDE PUG FILES
        '!' + src.lib + src.pug + '**/*'
    ])
        //COPY TO DIST FOLDER
        .pipe(gulp.dest(src.dist))
});

/*================================
    MINIFIY TASK
================================*/
gulp.task('minify', ['minify:js', 'minify:css']);

//MINIFY JAVASCRIPT
gulp.task('minify:js', function () {
    //LOCATE JS FILES IN LIB JS FOLDER
    return gulp.src(src.lib + src.js + '*.js')
        //MINIFY
        .pipe(uglify())
        //RENAME WITH .MIN.JS PREFIX
        .pipe(rename('main.min.js'))
        //MOVE TO DIST FOLDER
        .pipe(gulp.dest(src.dist + src.js));
});
//MINIFY CSS
gulp.task('minify:css', function () {
    //LOCATE CSS FILES IN LIB FOLDER
    return gulp.src(src.lib + src.css + '*.css')
        //MINIFY
        .pipe(cleanCSS())
        //RENAME WITH .MIN.CSS PREFIX
        .pipe(rename('main.min.css'))
        //MOVE TO DIST FOLDER
        .pipe(gulp.dest(src.dist + src.css));
});

/*================================
    BACKUP TASK
================================*/

gulp.task('backup', function () {
    //CACHE CURRENT DATE INFO
    var date = new Date(),
        month = date.getMonth(),
        day = date.getDate(),
        year = date.getFullYear(),
        hour = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();

    //CONSOLE LOG BACKUP MESSAGE AND DATE
    function logDate(type) {
        //INIT BACKUP MESSAGE
        var backupMessage = "";
        backupMessage = "===============================\n\n";
        backupMessage += "Project " + type + "\n" + new Date();
        backupMessage += "\n\n===============================";
        console.log(backupMessage);
    }
    //GET CURRENT DATE FOR FOLDER NAMING
    function getDate() {
        //CHECK IF NUM IS LESS THAN 10
        function isLessThan10(num) {
            return num < 10;
        }
        //ADD ZERO BEFORE NUM
        function addZero(num) {
            return "0" + num;
        }
        //BUILD DATE STRING
        var dateTime = "_";
        //IF MONTH IS LESS THAN 10, ADD ZERO, ELSE MONTH
        dateTime += isLessThan10(month) ? addZero(month) : month;
        //IF DAY LESS THAN 10, ADD ZERO, ELSE DAY
        dateTime += isLessThan10(day) ? addZero(day) : day;
        //YEAR
        dateTime += year;
        dateTime += "_";
        //IF HOUR IS LESS THAN 10, ADD ZERO, ELSE HOUR
        dateTime += isLessThan10(hour) ? addZero(hour) : hour;
        //IF MINUTES IS LESS THAN 10, ADD ZERO, ELSE MINUTES
        dateTime += isLessThan10(minutes) ? addZero(minutes) : minutes;
        //IF SECONDS IS LESS THAN 10, ADD ZERO, ELSE SECONDS
        dateTime += isLessThan10(seconds) ? addZero(seconds) : seconds;

        return dateTime;
    }

    function backup() {
        //LOG DATE OF BACKUP
        logDate("Backed Up");
        //LOCATE LIB FOLDER
        gulp.src(src.lib + '**/*')
            //COPY TO BACKUP FOLDER WITH DATE
            .pipe(gulp.dest(src.backup + getDate()));
    }

    function archiveBackups() {
        gulp.src(src.backup + '**')
            //ZIP BACKUPS
            .pipe(zip(getDate() + '.zip'))
            //COPY TO DIST FOLDER
            .pipe(gulp.dest(src.archive))
            .on('end', function () {
                //DELETE BACKUP FOLDERS
                del([
                    //FOLDERS IN BACKUP FOLDER
                    src.backup + '**/*',
                    //EXCLUDE BACKUP ROOT FOLDER
                    '!' + src.backup
                ]);
                //BACKUP PROJECT
                backup();
            });
        logDate("Archived");
    }

    //BACKUP AUTOMATICALLY AFTER SAVECOUNT
    if (saveCount != 0 && saveCount % savesUntilArchive === 0) {
        archiveBackups();
    } else if (saveCount % savesUntilBackup === 0) {
        backup();
    }

    saveCount += 1;

});

/*================================
    DEFAULT TASK
================================*/
gulp.task('default', ['serve', 'backup']);
