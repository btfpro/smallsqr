/**
 * Created by voddes on 5/2/18.
 */


const Promise = require('bluebird');
const express = require('express');
const readline = require('readline');
const fs = require('fs');



const sqrparser = (inputfile,opfile) => new Promise((resolve, reject) => {

    const rl = readline.createInterface({
        input: fs.createReadStream(inputfile)
    });

    const outputfile = fs.createWriteStream(opfile, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });
    var inSelect = false;
    var firstFrom = false;
    var firstWord = '';
    rl.on('line', (line) => {           //Read every Line in input File

        Promise.resolve(line.trim())
        .then((line) => {
        //console.log(line);
            if(line.startsWith('!')){   //do northing with comment line.
            return '';
            } else if(line.toLowerCase().startsWith('begin-select')) {  //if line is a start of select stat
                inSelect = true;
            } else if(line.toLowerCase().startsWith('end-select')) {    //if line is a end of select stat
                inSelect = false;
                firstFrom = false;
                outputfile.write('***********************************************************************');
                outputfile.write('\n');
                outputfile.write(' \n');
            }

            if(inSelect) {          // if line is between select start and end
                firstWord = line.split(' ')[0];
                if(firstWord.toLowerCase().includes('from')) {  // if line is between select start and end
                    firstFrom = true;
                    outputfile.write('');
                    outputfile.write('\n');
                    outputfile.write('Table Names');
                    outputfile.write('\n');
                }
                if (firstFrom) {    // line  between from  and end select come here
                    outputfile.write(line);
                    outputfile.write('\n');
                } else if(!firstWord.includes('let') && !firstWord.includes('move')) {  // line  is not let or move
                    outputfile.write(line);
                    //console.log(line);
                    outputfile.write('\n');
                }
            }
        }).then(() => {
            //console.log('Parsing Completed');
        });

    console.log('Line from file:', line);
    }).on('close', () => {
        outputfile.end();
    }).catch((error) => { reject(error); });

});

//sqrparser('/Users/voddes/Extras/UD/SQR_Project/1/gexpy644.sqr','/Users/voddes/Extras/UD/SQR_Project/1/output.txt');

const router = express.Router({ mergeParams: true });

router.post('/upload', sqrparser);


module.exports = router;