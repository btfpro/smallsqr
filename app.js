var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var rimraf = require('rimraf');
const sqrparser = require('./server/sqrparser');

var PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'build')));
// app.use(express.static(path.join(__dirname, 'bower_components')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.get('/v1/ab7820028322/uploads/*', function(req, res) {
    var fileName = req.url.substr(req.url.lastIndexOf('/'));
    res.sendFile(path.join(__dirname, 'uploads' + fileName));
});

app.get('/v1/upload/delete/ravinder', function(req, res) {
    rimraf(__dirname + '/uploads/*', function() {
        // console.log('done');
    });
});

app.get('/v1/allfiles', function(req, res) {
    fs.readdir(__dirname + '/uploads', (err, files) => {
        let filesList = [];
        files.forEach(file => {
            //console.log(file);
            filesList.push(file);
        });
        res.status(200).send({ files: JSON.stringify(filesList) });
    });
});

let uploadedFileName = "";
 
app.post('/upload', function(req, res) {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        uploadedFileName = file.name;
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        // console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        let promise = sqrparser(__dirname + '/uploads/' + uploadedFileName, __dirname + '/uploads/output.txt');
        promise.then(() => {
            // console.log('converted *****');
            res.status(200).send('/v1/ab7820028322/uploads/output.txt');
        }, (err) => {
            // sendFile(path.join(__dirname, '/uploads/output.txt'));
            // console.log(err);
        });
    });

    // parse the incoming request containing the form data
    form.parse(req);

});

var server = app.listen(PORT, function() {
    // console.log('Server listening on port', PORT);
});