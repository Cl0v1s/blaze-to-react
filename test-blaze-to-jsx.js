const Blaze = require('@synapse-medicine/blaze-to-jsx');
const { compile, extractData } = require('@synapse-medicine/spacebars-to-jsx');
const fs = require('fs');
const { preprocess } = require('@synapse-medicine/syntax');



const INPUT_FILE = process.argv[2];
const OPTIONS = process.argv.concat([]);
OPTIONS.splice(0, 3);

async function convert(template) {
  const baseComponent = __dirname + "/node_modules/@synapse-medicine/blaze-to-jsx/src/ReactAST.js";
  const baseComponentContent = fs.readFileSync(baseComponent);
  //console.log(`Converting template ${template}`);
  //console.log(`  Parsing ${template}.html`);
  let result = null;
  try {
    const htmlContent = fs.readFileSync(template+".html");
    const spacebarProgram = preprocess(htmlContent.toString());
    const disambiguiationDict = extractData(spacebarProgram);
    const jsx = compile(spacebarProgram, {isJSX: true});
    //console.log(`  Parsing ${template}.js`);
    let jsContent = "";
    if(fs.existsSync(template+".js")) jsContent = fs.readFileSync(template+".js").toString();
    const AST = new Blaze.default.AST(jsContent);
    console.log(JSON.stringify(AST, null, 2));
    if(OPTIONS.indexOf('--only-ast') !== -1) return;
    console.log('------');
    const converter = new Blaze.default.Converter(
      baseComponentContent.toString(),
      AST.getComponent(),
      jsx,
      ['__'],
      disambiguiationDict
    );
    result = converter.generate();
  } catch (error) {
    console.error(`Unable to convert ${template}:`);
    console.error(error);
    return;
  }
  console.log(result);
}


async function run() {
  if(process.argv.length < 3) {
    console.error('Usage: input_file');
    return;
  }

  convert(INPUT_FILE.replace('.html', '').replace('.js', ''));
};

run();