var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var rimraf = require('rimraf');
const sqrparser = require('./server/sqrparser');
const uuidv1 = require('uuid/v1');
const slone = require('./server/solutionone');
const extract = require('extract-zip');

var PORT = process.env.PORT || 5000;

let isDirectory = (entry) => {
    // convert external file attr int into a fs stat mode int
    let mode = (entry.externalFileAttributes >> 16) & 0xFFFF;
    // check if it's a symlink or dir (using stat mode constants)
    var IFMT = 61440
    var IFDIR = 16384
    var IFLNK = 40960
    var symlink = (mode & IFMT) === IFLNK;
    var isDir = (mode & IFMT) === IFDIR;

    // Failsafe, borrowed from jsZip
    if (!isDir && entry.fileName.slice(-1) === '/') {
        isDir = true
    }

    return isDir;
}

app.use(express.static(path.join(__dirname, 'build')));
// app.use(express.static(path.join(__dirname, 'bower_components')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.get('/v1/ab7820028322/uploads/*', function (req, res) {
    let uploadPath = req
        .url
        .replace('/v1/ab7820028322', '')
    res.sendFile(path.join(__dirname, uploadPath));
});

app.get('/v1/upload/delete/ravinder', function (req, res) {
    rimraf(__dirname + '/uploads/*', function () {
        // console.log('done');
    });
});

app.get('/v1/allfiles', function (req, res) {
    fs.readdir(__dirname + '/uploads', (err, files) => {
        let filesList = [];
        files.forEach(file => {
            //console.log(file);
            filesList.push(file);
        });
        res
            .status(200)
            .send({
                files: JSON.stringify(filesList)
            });
    });
});

app.get('/v1/slone', function (req, res) {
    const baseSQRFile = req.query.base || 'bas003.sqr';
    const uploadDir = req.query.path;
    slone(baseSQRFile, uploadDir, uploadDir + '/output.txt').then((success) => {
        res.sendFile(uploadDir + '/output.txt');
    });
})

app.post('/upload', function (req, res) {
    let uploadedFileName = "";
    let uploadedFoldersList = [];
    let uploadedFilesList = [];
    const baseSQRFile = req.query.base || 'bas003.sqr';
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single
    // request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads/') + uuidv1();
    if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir);
    }
    // every time a file has been uploaded successfully, rename it to it's orignal
    // name
    form
        .on('file', function (field, file) {
            uploadedFileName = file.name;
            fs.rename(file.path, path.join(form.uploadDir, file.name));
        });

    // log any errors that occur
    form.on('error', function (err) {
        // console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        if (uploadedFileName.indexOf('.zip') > -1) {
            extract(form.uploadDir + '/' + uploadedFileName, {
                dir: form.uploadDir,
                onEntry: function (entry, zipfile) {
                    if (entry) {
                        if (isDirectory(entry)) {
                            uploadedFoldersList.push(entry.fileName);
                        } else {
                            let entryFileName = entry.fileName.replace(/^.*[\\\/]/, '');
                            if (entryFileName.split('.').pop() === 'sqr') {
                                uploadedFilesList.push(entryFileName);
                            }
                            
                        }
                    }
                }
            }, function (err) {
                res
                    .status(200)
                    .send({ 'path': form.uploadDir, files: uploadedFilesList, folders: uploadedFoldersList});
                // slone(baseSQRFile, form.uploadDir, form.uploadDir + '/output.txt').then((success) => {
                //     res
                //         .status(200)
                //         .send('/v1/ab7820028322' + form.uploadDir.replace(__dirname, "") + '/output.txt');
                // });
            });
        } else {
            let promise = sqrparser(form.uploadDir + '/' + uploadedFileName, form.uploadDir + '/output.txt');
            promise.then(() => {
                // console.log('converted *****');
                res
                    .status(200)
                    .send('/v1/ab7820028322' + form.uploadDir.replace(__dirname, "") + '/output.txt');
            }, (err) => {
                // sendFile(path.join(__dirname, '/uploads/output.txt')); console.log(err);
            });
        }

    });

    // parse the incoming request containing the form data
    form.parse(req);

});

var server = app.listen(PORT, function () {
    // console.log('Server listening on port', PORT);
});