/**
 * Created by voddes on 5/9/18.
 */


const Promise = require('bluebird');
const express = require('express');
const readline = require('readline');
const fs = require('fs');
var findInFiles = require('find-in-files');
var excludeFiles = ['setenv.sqc','setup02.sqc','number.sqc','datetime.sqc','curdttim.sqc','stdapi.sqc','datemath.sqc'];


const traverseProcedure = (parentprocName,fileName,isInclude, procName) => {  //TODO:Needs to be changed to accept list of procudures and chang method accordingly.
    //console.log(procName);
    //console.log(isInclude);
    //console.log(fileName);
    procName = procName.replace("do","");
    console.log('Begin-Procedure :'+procName.trim());
    var term = '^Begin-Procedure\\s'+procName.trim()+'[^]*?End-Procedure$';
    //console.log(term);
    var reGex = {'term': term, 'flags': 'igm'};  //"^Begin-Program[^]*?End-Program$"
    findInFiles.find(reGex,"/Users/voddes/Extras/UD/SQR_Project/SQR_Unix_PRD",fileName)
        .then(function(results) {

            for (var result in results) {
                var res = results[result];
                var matchText = res.matches[0];
                //console.log(matchText);
                var procedures = matchText.match(/do\s(\w+)(-?(\w+)?)*/igm);
                console.log(procedures);
                //procedures.forEach(traverseProcedure.bind(null,procName,fileName,false));
                procedures.forEach(function(proc){
                    if (proc !== parentprocName)
                        traverseProcedure.bind(null,parentprocName,fileName,false,proc);
                });
                /*console.log(results);
                 console.log(result);
                 console.log(res);
                 console.log(
                 'found "' + res.matches[0] + '" ' + res.count
                 + ' times in "' + result + '"'
                 );*/
            }
            if(!isInclude && Object.keys(results).length === 0) {
                console.log(procName + ': Not found in :' + fileName);
                if (!isInclude) {
                    //console.log(procName + ': Not found in :' + fileName);
                    //find all Includes in fileName
                    //loop each filename to call traverseProcedure

                    var reGex = {'term': "Include.*sqc", 'flags': 'igm'};
                    findInFiles.find(reGex, "/Users/voddes/Extras/UD/SQR_Project/SQR_Unix_PRD", fileName)//TODO:This can be merged with above find
                        .then(function (results) {
                        //console.log(results);
                            for (var result in results) {
                                var res = results[result];
                                res.matches.forEach(function (sqrFileStr) {
                                    sqrFileStr = sqrFileStr.replace(/Include|\\s|\'/gi, "");
                                    console.log(procName + ' Searching in File: ' + sqrFileStr);
                                    traverseProcedure(parentprocName,sqrFileStr.trim(), true, procName);
                                });
                            //var matchText = res.matches[0];
                            //console.log(matchText);
                            }
                    });
                } else {
                    //console.log(procName + ': Not found in :' + fileName);
                }
            }
        });
    //1.find in file
    //2.if not found find in all includes
    //pull text bwn begin-pr end-pro
    //read all do procd
    //call traverseProcedure(procName,fileName) for each procd


}

const slone = (fileName,dirPath) => {

    var reGex = {'term': "^Begin-Program[^]*?End-Program$", 'flags': 'igm'};
    //var reGex = {'term': "^Begin-Procedure\\sInit-Report[^]*?End-Procedure$", 'flags': 'igm'};
    //findInFiles.find(reGex,dirPath,fileName)
    fileName = "bas003.sqr";
    findInFiles.find(reGex,"/Users/voddes/Extras/UD/SQR_Project/SQR_Unix_PRD","bas003.sqr")
        .then(function(results) {

            for (var result in results) {
                var res = results[result];
                var matchText = res.matches[0];
                console.log(matchText);
                var procedures = matchText.match(/do\s(\w+)(-?(\w+)?)*/igm);
                //console.log(procedures);
                //procedures.forEach(traverseProcedure.bind(null,null,fileName,false));
                procedures.forEach(traverseProcedure.bind(null,null,fileName,false));
                /*console.log(results);
                console.log(result);
                console.log(res);
                console.log(
                    'found "' + res.matches[0] + '" ' + res.count
                    + ' times in "' + result + '"'
                );*/
            }
        });

}
slone();

/*const slone = (inputfile,opfile) => new Promise((resolve, reject) => {

    const rl = readline.createInterface({
        input: fs.createReadStream(inputfile)
    });

const outputfile = fs.createWriteStream(opfile, {
    // flags: 'a' // 'a' means appending (old data will be preserved)
});
var startbp = false;
rl.on('line', (line) => {
    Promise.resolve(line.trim())
    .then((line) => {

    if (line.startsWith('begin-program')) {
        startbp = true;
    } else if(line.startsWith('end-program')) {
        startbp = false;
    } else if(startbp){

    }

});

}).on('close', () => {
    outputfile.end();
console.log('output file created');
resolve();
});

}*/

//module.exports = slone;