const fs = require("fs");
const csv = require("csv");
const axios = require("axios");

var rawVINs = [];
var VINcount = 0;
var fieldCount = 0;

fs.readFile("raw_vins.csv", "utf8", function(err, contents) {
  // separate values by commas
  rawVINs = contents.split("\n");

  rawVINs.forEach(vin => {
    axios
      .get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/${vin}?format=json`
      )
      .then(function(response) {
        let JSONdata = {};
        JSONdata[vin] = {};
        VINcount++;
        response.data.Results.forEach(item => {
          if (item.Value !== null && item.Value !== "") {
            JSONdata[vin][item.Variable] = item.Value;
            fieldCount++;
            console.clear();
            console.log("VINs added", VINcount);
            console.log("Fields added:", fieldCount);
            console.log("VIN:", vin);
            console.log("Last field added:", item.Variable);
            console.log("Last value added:", item.Value);
          }
        });
        if (Object.keys(JSONdata[vin]) !== [undefined]) {
          fs.appendFile("result.json", JSON.stringify(JSONdata) + ",", function(
            err
          ) {
            if (err) throw err;
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  });
});
