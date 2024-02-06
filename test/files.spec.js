const fs = require("fs");
const path = require("path");
const gitlet = require("../entry");
const files = require("../src/files");
const index = require("../src");

describe("files functional test", () => {
  const ROOT = process.cwd();
  beforeAll(() => {
    process.chdir(path.join(process.cwd(), "./test/testData"));
  });

  afterAll(() => {
    process.chdir(ROOT);
  });

  test(`findAllFiles() should list all files in working dir,
  excluding .gitlet dir`, () => {
    const workingFiles = files.findAllFiles(".", gitlet.GIT_DIR).sort();
    // indexFiles are relative path
    let indexFiles = Object.keys(index.read(gitlet.GIT_DIR));
    indexFiles = indexFiles
      .reduce((pre, cur) => {
        return pre.concat(path.join(process.cwd(), cur));
      }, [])
      .sort();
    const isSame = indexFiles.toString() === workingFiles.toString();
    expect(isSame).toBe(true);
  });
});
