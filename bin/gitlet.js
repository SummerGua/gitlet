#!/usr/bin/env node
const gitlet = require("../src/entry");

const args = process.argv.slice(2);
const command = args[0];

if (args.length === 2) {
  gitlet[command](args[1]);
} else if (args.length === 3) {
  gitlet[command](args[1], args[2]);
} else {
  if (args[0] === "-h" || args[0] === "--help") {
    console.log(
      "supported command:\n\
      init\n\
      add <filename | folder> \t rm <filename>(use it carefully!!!)\n\
      commit <message> \t\t branch [newBranchName]\n\
      switch <branchName> \t cat_file <40BitHash> <content|contentSize|type>"
    );
  } else gitlet[command]();
}
