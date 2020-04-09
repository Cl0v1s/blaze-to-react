const Blaze = require('@synapse-medicine/blaze-to-jsx');
const { compile, extractData } = require('@synapse-medicine/spacebars-to-jsx');
const fs = require('fs');
const glob = require('glob');
const shell = require('shelljs');
const { preprocess } = require('@synapse-medicine/syntax');


const INPUT_DIR = process.argv[2];
const OUTPUT_DIR = process.argv[3];

let failed = 0;
let ok = 0;

var getDirectories = function (src, callback) {
  glob(src + '/**/*', callback);
};

async function convert(template) {
  const baseComponent = __dirname + "/node_modules/@synapse-medicine/blaze-to-jsx/src/ReactAST.js";
  const baseComponentContent = fs.readFileSync(baseComponent);
  console.log(`Converting template ${template}`);
  console.log(`  Parsing ${template}.html`);
  let result = null;
  try {
    const htmlContent = fs.readFileSync(template+".html");
    const spacebarProgram = preprocess(htmlContent.toString());
    const disambiguiationDict = extractData(spacebarProgram);
    const jsx = compile(spacebarProgram, {isJSX: true});
    console.log(`  Parsing ${template}.js`);
    const jsContent = fs.readFileSync(template+".js");
    const AST = new Blaze.default.AST(jsContent.toString());
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
    failed++;
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
    console.error('Usage: input_dir output_dir');
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
  console.log(`Total:${files.length} Ok:${ok} Failed:${failed}`)
};

run();