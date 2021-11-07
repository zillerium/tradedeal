// Dependencies
var lineReader = require('line-reader');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tradedeal');
var myJson =  {"time":1633308000,"year":2021,"month":10,"day":4,"minSlot":40,
"price":31.629608144797523,"qty":0,"total":0}

var keySchema = new mongoose.Schema({
  time : { type: Number, default: null},
  year : {type: Number, default: null},
  month : {type: Number, default: null},  
  day : {type: Number, default: null},
  minSlot : {type: Number, default: null},
  price : {type: Number, default: null},
  qty : {type: Number, default: null},
  total : {type: Number, default: null}
});
 


var keyModel = mongoose.model("keyModel", keySchema);

//addKeys(myJson)


process.argv.forEach(function (val, index, array) {
    if (index == 2) {
      console.log(index + '=' + val);
      main(val);
    }
    
  });




async function addKeys (keys) {
  var keyCreate = new keyModel(keys);
    console.log(keyCreate);
    await keyCreate.save(async function(err, doc){
        if(err) throw err;
         console.log("db done");
      });
}

async function readfile(fname) {
    
   lineReader.eachLine(fname, async function(line) {
    //   filenames.push(line);
    console.log('line - ' + line)	
       await addKeys(JSON.parse(line))
   //    console.log('line = ' + count + ' ' + line);
   });
   
   
   }

async function main(val) {
    //    await managefiles();
         await readfile(val);
     console.log('=============== after read was done');
     //console.log("read data = " + csvData[0]);
    
    
    }

//  await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();


 
//    let jsonObj = await keyModel.find({ addr: addr})


