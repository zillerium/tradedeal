// Dependencies
var lineReader = require('line-reader');
const math = require('mathjs');

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

//main()

process.argv.forEach(function (val, index, array) {
    if (index == 2) {
      console.log(index + '=' + val);
      main(val);
    }
    
  });

async function readKeys (from, to) {
    let jsonObj = await keyModel.find({$and: [{ time: { $gte: from }}, { time: { $lte: to }}]} )
    return jsonObj;
}



async function main( val) {
    //val is start date eg 2021-11-05
    let today = new Date();

    let year = parseInt(today.getFullYear())
    
    let month = parseInt(today.getMonth()) + 1;
    
    let day = parseInt(today.getUTCDate())
    let monthStr = month.toString(); let dayStr = day.toString(); let yearStr = year.toString();
    if (month < 10) monthStr = "0" + month; 
    if (day < 10) dayStr = "0" + day; 

    let datenow = yearStr + "-" + monthStr + "-" + dayStr;
console.log('date ' + datenow)
    var to = Math.floor(new Date(datenow + " 00:00:00.000").getTime()/1000);
   

    // cal 1 day, 7 day, 30 day


    let jsondays = await readKeys(to-(parseInt(val)*24*60*60), to);
    console.log(jsondays);
/*
    {
        _id: new ObjectId("618803e23c57c9253290be0b"),
        time: 1635730680,
        year: 2021,
        month: 11,
        day: 1,
        minSlot: 98,
        price: 43.291913528442365,
        qty: 0,
        total: 0,
        __v: 0
      },
      */
      let total = 0;
      let n = jsondays.length;
      let price = [];
      for (let i=0;i<n;i++) {
          total = total + jsondays[i].price;
          price.push(jsondays[i].price)
      }

      let avg = math.mean(price)
      let sd = math.std(price);
      let min = math.min(price);
      let max = math.max(price);

      let minsd = (min-avg)/sd;
      let maxsd = (max-avg)/sd;

      var jsonPrice = {
          'min': min,
          'max': max,
          'sd': sd 
      }

      let dist = []
      let devdist = []
      let interval = 0.1;
      let span = Math.abs(maxsd) + Math.abs(minsd);
      let nslotspos = Math.abs(maxsd)/interval;
      let nslotsneg = Math.abs(minsd)/interval;

      

      for (let i=0;i<price.length;i++) {
            let dev=(price[i] - avg)/sd;
            dist[i] = {
                'price': price[i],
                'dev': dev
            }    
      }

      //console.log(JSON.stringify(dist))

      console.log('json price ' + JSON.stringify(jsonPrice))
      console.log('avg ' + avg)
      console.log('sd ' + sd)

      console.log('min  ' + min)
      console.log('max  ' + max)

      console.log('minsd ' + minsd)
      console.log('maxsd ' + maxsd)



 



}

//  await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();


 
//    let jsonObj = await keyModel.find({ addr: addr})


