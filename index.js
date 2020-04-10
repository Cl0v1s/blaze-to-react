const Blaze = require('@synapse-medicine/blaze-to-jsx');
const { compile, extractData } = require('@synapse-medicine/spacebars-to-jsx');
const fs = require('fs');
const glob = require('glob');
const shell = require('shelljs');
const { preprocess } = require('@synapse-medicine/syntax');
require('colors');


const GLOBAL_IDENTIFIERS = [
  '__',
  'Boolean',
  'map',
];


const INPUT_DIR = process.argv[2];
const OUTPUT_DIR = process.argv[3];
const OPTIONS = process.argv.concat([]);
OPTIONS.splice(0, 4);


const errorLog = message => console.error(message.red);
const warn = message => console.warn(message.yellow);
const log = message => {
  if(OPTIONS.indexOf('--only-errors') !== -1) return;
  console.log(message);
}

let failed = [];
let ok = 0;

var getDirectories = function (src, callback) {
  glob(src + '/**/*', callback);
};

async function convert(template) {
  const baseComponent = __dirname + "/node_modules/@synapse-medicine/blaze-to-jsx/src/ReactAST.js";
  const baseComponentContent = fs.readFileSync(baseComponent);
  log(`Converting template ${template}`);
  log(`  Parsing ${template}.html`);
  let result = null;
  try {
    const htmlContent = fs.readFileSync(template+".html");
    const spacebarProgram = preprocess(htmlContent.toString());
    const disambiguiationDict = extractData(spacebarProgram);
    const jsx = compile(spacebarProgram, {isJSX: true});
    log(`  Parsing ${template}.js`);
    const jsContent = fs.readFileSync(template+".js");
    const AST = new Blaze.default.AST(jsContent.toString());
    const converter = new Blaze.default.Converter(
      baseComponentContent.toString(),
      AST.getComponent(),
      jsx,
      GLOBAL_IDENTIFIERS,
      disambiguiationDict
    );
    result = converter.generate();
  } catch (error) {
    errorLog(`Unable to convert ${template}:`);
    console.log(error);
    failed.push(template);
    return;
  }
  const output = (OUTPUT_DIR+"/"+template).split('/');
  const file = output.splice(output.length-1, 1);
  shell.mkdir('-p', output.join('/'));
  fs.writeFileSync(output.join('/')+"/"+file+".jsx", result);
  ok++;

}


async function run() {
  if(process.argv.length < 4) {
    errorLog('Usage: input_dir output_dir');
    return;
  }

  // retrieves files
  let files = await new Promise((resolve, reject) => {
    getDirectories(INPUT_DIR, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
  // getting all htmls files
  files = files.filter(f => f.endsWith(".html"));
  files.forEach(f => convert(f.replace('.html', '')));
  log(`Total:${files.length} Ok:${ok} Failed:${failed.length}`)
  log('-----------');
  failed.forEach(f => errorLog(f));
};

run();