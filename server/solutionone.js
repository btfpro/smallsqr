/**
 * Created by voddes on 5/9/18.
 */


const Promise = require('bluebird');
const express = require('express');
const readline = require('readline');
const fs = require('fs');
var findInFiles = require('find-in-files');
var excludeFiles = ['setenv.sqc','setup02.sqc','number.sqc','datetime.sqc','curdttim.sqc','stdapi.sqc','datemath.sqc'];
let SQR_FOLDER_PATH = __dirname+'/../uploads/sqrfiles'; // "/Users/voddes/Extras/UD/SQR_Project/SQR_Unix_PRD";
console.log(SQR_FOLDER_PATH);
let FILE_NAME = 'ravi2.sqr'; // '1.sqr'; // "bas003.sqr";

const traverseProcedure = (parentprocName,fileName,isInclude, procList) => {  //TODO:Needs to be changed to accept list of procudures and chang method accordingly.
    // console.log(isInclude);
    // console.log(fileName);
    if(!procList || procList.size == 0) {
        return;
    }
    console.log("traverse these", procList, " procedures in : " + fileName);
    var procAppendTerm = '(';
    procList.forEach(function(procName){
        procName = procName.replace(/do/ig,"");
        procAppendTerm = procAppendTerm + procName.trim()+'|';
    });
    procAppendTerm = procAppendTerm.replace(/\|$/,')');

    // console.log('All Procedure Names for Regex :'+procAppendTerm);
    var procTerm = '^Begin-Procedure\\s+'+procAppendTerm+'[^]*?End-Procedure$';  //TODO change this to handel multi space and file Includes
    //var term = '^Begin-Procedure\\s+'+procAppendTerm+'[^]*?End-Procedure$';
    var incTerm = 'Include.*sqc';
    var term = '('+procTerm+'|'+incTerm+')';
    //console.log(term);
    var reGex = {'term': term, 'flags': 'igm'};  //"^Begin-Program[^]*?End-Program$"
    findInFiles.findSync(reGex,SQR_FOLDER_PATH,fileName)
        .then(function(results) {
            let includes = [];
            let begins = [];
            //console.log(results);
            //var res = results[0];
            for (var result in results) {
                var res = results[result];
                // var procList = [];
                
                let fileName1;
                res.matches.forEach((matchText) => {
                    if (matchText.match(/include\s/igm)) {
                        fileName1 = matchText.replace(/include\s/igm, '');
                        fileName1 = fileName1.replace("'", '');
                        includes.push(fileName1);
                    }
                    if (matchText.match(/Begin-Procedure\s(\w+)(-?(\w+)?)*/igm)) {
                        begins.push(matchText);
                        var procedures = new Set(matchText.match(/do\s(\w+)(-?(\w+)?)*/igm)); //
                        let beginProcMatch = matchText.match(/^Begin-Procedure\s(\w+)(-?(\w+)?)*/ig);
                        var procName = beginProcMatch && beginProcMatch[0].replace('Begin-Procedure ', ''); //find proc
                        procName && procList.delete('do '+procName); // Delete found proc
                        console.log("\x1b[36m%s\x1b[0m", "found proc name: ", procName + " in " + fileName, "child procs: ", procedures);
                        if (procedures.size > 0) {
                            traverseProcedure(parentprocName, fileName, false, procedures);
                        }
                        
                    }
                });
                console.log("remaing procs: ", procList);
                includes = includes.filter((el) => !excludeFiles.includes(el));
                console.log("include files:", includes);
                if (procList && procList.length !== 0) {
                        includes.forEach((includeFile) => {
                            traverseProcedure(null, '^'+includeFile, false, procList);
                        });
                }
            }

            
            

            /*if (procList && procList!= 0) {
                if (!isInclude) {
                    var reGex = {'term': "Include.*sqc", 'flags': 'igm'};
                    findInFiles.find(reGex, SQR_FOLDER_PATH, fileName)//TODO:This can be merged with above find
                        .then(function (results) {
                            //console.log(results);
                            for (var result in results) {
                                var res = results[result];
                                res.matches.forEach(function (sqrFileStr) {
                                    sqrFileStr = sqrFileStr.replace(/Include|\\s|\'/gi, "");
                                    console.log(procList + ' Searching in File: ' + sqrFileStr);
                                    traverseProcedure(parentprocName,sqrFileStr.trim(), true, procList);
                                });
                                //var matchText = res.matches[0];
                                //console.log(matchText);
                            }
                        });
                } else {

                }
            }*/
            /*if(!isInclude && Object.keys(results).length === 0) {
                console.log(procName + ': Not found in :' + fileName);
                if (!isInclude) {
                    //console.log(procName + ': Not found in :' + fileName);
                    //find all Includes in fileName
                    //loop each filename to call traverseProcedure

                    var reGex = {'term': "Include.*sqc", 'flags': 'igm'};
                    findInFiles.find(reGex, SQR_FOLDER_PATH, fileName)//TODO:This can be merged with above find
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
            }*/
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
    fileName = fileName || '^'+FILE_NAME;
    findInFiles.find(reGex, SQR_FOLDER_PATH, fileName)
        .then(function(results) {

            for (var result in results) {
                var res = results[result];
                var matchText = res.matches[0];
                console.log(matchText);
                var procedures = new Set(matchText.match(/do\s(\w+)(-?(\w+)?)*/igm));  //Set will remove duplicates
                //console.log(procedures);
                //procedures.forEach(traverseProcedure.bind(null,null,fileName,false));
                traverseProcedure(null,fileName,false, procedures);
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
// slone();

module.exports = slone;

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