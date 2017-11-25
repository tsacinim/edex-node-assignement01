const fs = require('fs');
const assert = require('assert'); // used in testing

// get the input csv file (as a utf8 string)
// wget https://prod-edxapp.edx-cdn.org/assets/courseware/v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+2T2017+type@asset+block/customer-data.csv
const input = fs.readFileSync('./customer-data.csv', "utf8");

// get the solution json file (as a utf8 string)
// wget https://prod-edxapp.edx-cdn.org/assets/courseware/v1/49802b4bc23bb76c0a1eb9bff4178d55/asset-v1:Microsoft+DEV283x+2T2017+type@asset+block/customer-data-solution.json
const solution = fs.readFileSync('./customer-data-solution.json', "utf8")
  .replace(/\r?\n|\r/g,'\n'); // normalize line endings

// takes a csv file (stringified) and
// returns a list of json objects (stringified)
const csv2json = input => {
  let output = input.split(/\r\n|\r|\n/);
  output = output.map(x => x.split(','));
  const outputHeader = output.shift(); // column headers -> json keys
  output.pop(); // drop the last empty line
  const outputRow = output; // content only (no header columns)

  // zips 2 lists in { key: value } objects
  const zip = (keys, values) => keys.map((x, i) => ({[x]: values[i]}));

  // joins all the {key: value} pairs in one object
  const row2object = x => Object.assign({},...zip(outputHeader,x));
   
  output = outputRow.map(row2object); // process all file content
  output = JSON.stringify(output, null, 2); // convert to string for testing
  return output;
};

const output = csv2json(input);

// console.log(output);
// console.log(solution);

assert(typeof output === 'string'); // test that the output is a string
assert(typeof output === typeof solution); // test that types match
assert(output === solution); // test that values match

fs.writeFileSync('./customer-data.json', output);
