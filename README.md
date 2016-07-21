Simple Gulp Build + SCSS + Pug
=======================
A simple gulp build boilerplate for static html projects with SCSS compiling and CSS/JavaScript minification.

## Prerequisites
Install `gulp` globally.
```markup
    npm install -g gulp
```

## Installation
```markup
    git clone https://github.com/ChynoDeluxe/gulp-scss-pug.git
    cd gulp-scss-pug
    npm install
```

## Usage
Run `gulp` to start a local server, compile `SCSS` and watch for changes to `HTML`, `SCSS`, and `JS` files.
```markup
    gulp
```

##### Backup Task
Backups and Archives of the `./lib/` folder will automatically be created as defined by the variables `savesBeforeBackup` and `savesBeforeArchive` in the [gulpfile.js](gulpfile.js#L28).   

* `savesBeforeBackup` -- number of saves before auto-backup `[Default: 5]`
* `savesBeforeArchive` -- number of `backups` before archive `[Default: 10]`

##### Deploy Task
Create production ready `dist` folder.
```markup
    gulp deploy
```

## Contact
##### Chyno Deluxe
* twitter: [@ChynoDeluxe](https://twitter.com/ChynoDeluxe)
* website: [www.chynodeluxe.com](http://chynodeluxe.com)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details