#!/usr/bin/env node
const gitlet = require("../src/entry");

const args = process.argv.slice(2);
const command = args[0];
if (args.length === 2) {
  gitlet[command](args[1]);
} else if (args.length === 3) {
  gitlet[command](args[1], args[2]);
} else {
  gitlet[command]();
}
