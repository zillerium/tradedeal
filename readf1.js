var fs = require('fs');
var fs1 = require('fs');
var lineReader = require('line-reader');
var parse = require('csv-parse');

var csvData=[];
var timeslots = [];


process.argv.forEach(function (val, index, array) {
  if (index == 2) {
    console.log(index + '=' + val);
    main(val);
  }
  
});

async function managefiles() {
 var filenames = [];
	var count=0;
lineReader.eachLine('flist', async function(line) {
 //   filenames.push(line);	
    await readfile(line)
//    console.log('line = ' + count + ' ' + line);
});


}

async function managefiles1() {
console.log('read files');
fs.readFile('flist', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('data ==> ' + data)
})
 
}


async function readfile(fname) {
console.log("fname " + fname)
	let filename = './'+fname;
await fs.createReadStream(filename)
    .pipe(parse({delimiter: ','}))
    .on('data', async function(csvrow) {
       // console.log(csvrow);
        //do something with csvrow
        csvData.push(csvrow);        
    })
    .on('end', async function() {
      console.log('-- func --');
      let initialTime = Math.trunc((csvData[0][4])/1000);
      let finalTime = Math.trunc((csvData[csvData.length-1][4])/1000);

      let allSecsBlocks = (finalTime - initialTime)/60;
      for (let i=0;i<allSecsBlocks; i++) {
          let aTime = Math.trunc(initialTime + (i*60));
          timeslots[i] = { 'time': aTime,
              'price': 0,
              'qty': 0,
              'total': 0
	  } 
      }
       
      console.log('initialtime ' + initialTime);
      console.log('finaltime ' + finalTime);
      //do something with csvData
      console.log(csvData[0][0]);
      console.log(csvData.length);
      var currentTime = initialTime;
      var currentIndex = 0;
      let upperLimit = parseInt(csvData.length)/1;
      for (let j=0;j<upperLimit;j++) {
          var csvtime = Math.trunc(csvData[j][4]/1000);
          let interval =Math.trunc((csvtime - initialTime)/60);
//          console.log(csvtime);
//          console.log(initialTime);
//console.log(interval);
      //    if (csvtime > currentTime) {
      //        for (let k=currentIndex;k<(timeslots.length - currentIndex);k++) {
      //            console.log('---- loop test ---' + k)
      //            console.log('---- csvtime ---' + csvtime)
      //            console.log('---- timeslots[k] ---' + parseInt(timeslots[k].time))
//	          if (csvtime < parseInt(timeslots[k].time)) {
 //                     console.log('==new time selected==');							
                      // max limit
   //                   currentIndex = k - 1;
     //                 currentTime = parseInt(timeslots[currentIndex].time);
       //               k=timeslots.length+1;
         //         } 
           //   }
//              console.log(' current time ' + currentTime);
//              console.log(' rec time ' + csvtime);
              let p1 = timeslots[interval].price;
              let p2 = parseFloat(csvData[j][1]);
              if (p1 == 0) p1=p2;
              let p3 = (p1+p2)/2;
//              console.log('p1 = '+ p1); 
//              console.log('p2 = '+ p2); 
//              console.log('p3 = '+ p3);
	      let date = new Date((timeslots[interval].time)*1000);
	      
              let newrec = { 'time': timeslots[interval].time,
	       'year': date.getFullYear(),
		      'month': date.getMonth()+1,
		      'day': date.getUTCDate(),
		      'minSlot': interval,
               'price': p3,
               'qty': 0,
               'total': 0
              }
              timeslots[interval] = newrec;        
//          }
      }
      for (let j=0;j< timeslots.length; j++) {
          console.log('timeslot ' + j + ' ' + JSON.stringify(timeslots[j]));
      }


//var file = fs1.createWriteStream('output.txt');
//file.on('error', function(err) { /* error handling */ });
//timeslots.forEach(function(v) { file.write(v.join(', ') + '\n'); });
//file.end();

const writeStream = fs1.createWriteStream('outfile.txt', {flags: 'a'});
const pathName = writeStream.path;
 
//timeslots.forEach(value => writeStream.write(`${value1}\n`));

for (let n=0;n<timeslots.length;n++) {
    let jsonStr = JSON.stringify(timeslots[n]);
    writeStream.write(`${jsonStr}\n`)

}

writeStream.on('finish', () => {
   console.log(`wrote all the array data to file ${pathName}`);
});

writeStream.on('error', (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`)
});

writeStream.end();


     //await display(csvData);
    });

}

async function display(csvdatatemp) {
   console.log(' csv data - ' + csvdatatemp);
}

async function main(val) {
//    await managefiles();
     await readfile(val);
 console.log('=============== after read was done');
 //console.log("read data = " + csvData[0]);


}

