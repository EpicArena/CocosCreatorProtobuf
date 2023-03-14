#!/usr/bin/env node
"use strict";
const { execSync } = require('child_process');
const { rmSync, mkdirSync, existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

let protoPath = process.argv[2];
if (typeof protoPath === 'undefined') {
    console.error('Need to specify the proto file directory path');
    process.exit(1);
}

let pbJsOutPath = process.argv[3];
if (typeof pbJsOutPath === 'undefined') {
    console.error('Need to specify the pb javascript file out directory path');
    process.exit(1);
}

let pbTsOutPath = process.argv[4];
if (typeof pbTsOutPath === 'undefined') {
    console.error('Need to specify the pb typesript file out directory path');
    process.exit(1);
}

let pbBaseName = process.argv[5];
if (typeof pbBaseName === 'undefined') {
    console.error('Need to specify the pb file base name');
    process.exit(1);
}

function handleOutPath(path) {
    // rmSync(pbJsOutPath, { recursive: true, force: true });
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
}

function runCmd(cmd) {
    execSync(cmd);
}

function esModuleCorrect(path) {
    let file = readFileSync(path, { encoding: 'utf8' });
    // let result = file.replace("import * as $protobuf", "import { default as $protobuf }");
    // es导入最终存储在commonjs的内容是另一份对象
    let result = file.replace(`const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});`, "const $root = {};");
    result = result.replace(/\$protobuf\./g, "$protobuf.default.");
    let extraContent = [`import Long from 'long';`, `$protobuf.default.util.Long = Long;`, `$protobuf.default.configure();`];
    let dataArray = result.split(/\r\n|\n|\r/gm);
    dataArray.splice(2, 0, ...extraContent);
    writeFileSync(path, dataArray.join('\r\n'));
}

function genEsModuleConfig(path) {
    let config = {"type": "module"};
    writeFileSync(path, JSON.stringify(config, null, 4));
}

handleOutPath(pbJsOutPath);
handleOutPath(pbTsOutPath);

let outJsFilepath = join(pbJsOutPath, pbBaseName + ".js");
let outTsFilepath = join(pbTsOutPath, pbBaseName + ".d.ts");
let protoFuzzypath = join(protoPath, "*.proto");
let pbjsCmd = `pbjs --dependency protobufjs/minimal.js --target static-module --wrap es6 --force-long --force-message --no-verify --no-convert --no-delimited --no-beautify --no-service --out ${outJsFilepath} ${protoFuzzypath}`;
let pbtsCmd = `pbts --main --no-comments --name ${pbBaseName} --out ${outTsFilepath} ${outJsFilepath}`;

console.time("build js with comments");
runCmd(pbjsCmd);
console.timeEnd("build js with comments");
console.time("build ts");
runCmd(pbtsCmd);
console.timeEnd("build ts");

rmSync(outJsFilepath);
console.time("build js no comments");
runCmd(pbjsCmd.concat(" --no-comments"));
console.timeEnd("build js no comments");

console.time("es module correct");
esModuleCorrect(outJsFilepath);
console.timeEnd("es module correct");

console.time("es module config");
genEsModuleConfig(join(pbJsOutPath, "package.json"));
console.timeEnd("es module config");
