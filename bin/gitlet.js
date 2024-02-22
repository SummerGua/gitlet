#!/usr/bin/env node
const { program } = require("commander");
const gitlet = require("../src/entry");

program
  .command("init")
  .description("init a gitlet directory")
  .action(() => {
    gitlet.init();
  });

program
  .command("add")
  .description("add a file or folder to the index")
  .argument("<f>", "<filename | folder>")
  .action((f) => {
    gitlet.add(f);
  });

program
  .command("rm")
  .description(
    "remove a file from the index and the working directory,\
    use it carefully"
  )
  .argument("<f>", "filename")
  .action((f) => {
    gitlet.rm(f);
  });

program
  .command("commit")
  .description("commit the current index")
  .option("-m, --message <m>", "commit message")
  .action((options) => {
    gitlet.commit(options.message);
  });

program
  .command("switch")
  .description("switch to another branch")
  .argument("<b>", "branch name")
  .action((b) => {
    gitlet.switch(b);
  });

program
  .command("branch")
  .description("create a new branch or list all branches")
  .argument("[b]", "new branch name")
  .action((b) => {
    gitlet.branch(b);
  });

program
  .command("hash-object")
  .description("create a hash object of a file")
  .argument("<f>", "file path")
  .action((f) => {
    gitlet.hash_object(f);
  });

program
  .command("cat-file")
  .description("view a file by via 40 bit hash")
  .argument("<h>", "40 bit hash")
  .argument("<mode>", "<type|content|contentSize>")
  .action((h, mode) => {
    gitlet.cat_file(h, mode);
  });

program
  .command("log")
  .description("show commit logs")
  .action(() => {
    gitlet.log();
  });

program.parse();
