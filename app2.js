// load dependencies
const axios = require("axios");
const fs = require("fs");
var nReadlines = require("n-readlines");
const lineByLine = require("n-readlines");
const liner = new lineByLine("./vin_sample_extract.csv");

// declare variables
var currentVIN = "";
var lastVIN = "";
var VINcount = 0;
var errorCount = 0;
var fieldCount = 0;
var status = "";

// set time interval for readings

var interval = setInterval(function() {
  // process
  let line = liner.next().toString("ascii");
  if (line == "false") {
    clearInterval(interval);
  } else {
    getNHTSA(line);
    //console.log(line);
  }
}, 100);

function getNHTSA(vin) {
  axios
    .get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/${vin}?format=json`
    )
    .then(function(response) {
      let JSONdata = {};
      JSONdata[vin] = {};
      VINcount++;
      response.data.Results.forEach(item => {
        if (item.Value !== null && item.Value !== "" && vin != "false") {
          JSONdata[vin][item.Variable] = item.Value;
          fieldCount++;
          console.clear();
          console.log("VINs added:", VINcount);
          console.log("Errors:", errorCount);
          console.log("Fields added:", fieldCount);
          console.log("VIN:", vin);
          console.log("Last field added:", item.Variable);
          console.log("Last value added:", item.Value);
        }
      });
      if (Object.keys(JSONdata[vin]) !== [undefined] && vin != "false") {
        let newData = JSON.stringify(JSONdata);
        fs.appendFile("result.json", newData.slice(1, -1) + ",", function(err) {
          if (err) throw err;
        });
        fs.appendFile("success.csv", vin + "\n", function(err) {
          if (err) throw err;
        });
      }
    })
    .catch(function(error) {
      errorCount++;
      fs.appendFile("errors.csv", vin + "\n", function(err) {
        if (err) throw err;
      });
    });
}

function report() {
  console.clear();
  console.log("VINs added:", VINcount);
  console.log("Errors:", errorCount);
  console.log("Fields added:", fieldCount);
  console.log("VIN:", vin);
  console.log("Last field added:", item.Variable);
  console.log("Last value added:", item.Value);
}

function readLine() {
  lineReader.on("line", function(line) {
    currentVIN = line;
    //getNHTSA(line);
    console.log("Line readed:", line);
  });
}
