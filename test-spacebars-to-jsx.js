const Blaze = require('@synapse-medicine/blaze-to-jsx');
const { compile, extractData } = require('@synapse-medicine/spacebars-to-jsx');
const fs = require('fs');
const { preprocess } = require('@synapse-medicine/syntax');
const generate = require('@babel/generator');



const INPUT_FILE = process.argv[2];
const OPTIONS = process.argv.concat([]);
OPTIONS.splice(0, 3);



async function run() {
  if(process.argv.length < 3) {
    console.error('Usage: input_file');
    return;
  }

  const htmlContent = fs.readFileSync(INPUT_FILE);
  const spacebarProgram = preprocess(htmlContent.toString());
  console.log(JSON.stringify(spacebarProgram, null, 2));
  if(OPTIONS.indexOf('--only-ast') !== -1) return;
  console.log("====");
  const disambiguiationDict = extractData(spacebarProgram);
  const jsx = compile(spacebarProgram, {isJSX: true});
  console.log(disambiguiationDict);
  console.log('----');
  console.log(jsx);
  console.log("++++++++++");
  console.log(generate.default(jsx).code);
};

run();