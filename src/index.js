const path = require("path");
const fs = require("fs");
const EOL = require("os").EOL;
const objects = require("./objects");
const files = require("./files");
const utils = require("../utils/util");

/**
 * `index` file is the index of staging area
 * real files are in .gitlet/objects/
 */
const index = {
  /**
   * @param {string[]} fileList an array of files to be added
   * @param {object} opts
   * @param {boolean} opts.add
   * @param {boolean} opts.remove
   */
  updateIndex: (fileList, GIT_DIR, opts) => {
    const allIndex = index.read(GIT_DIR);
    if (opts.add) {
      fileList.forEach((addedFileAbsPath) => {
        // add each file into index & backup file to objects/
        const content = fs.readFileSync(addedFileAbsPath);
        if (!objects.write(content, "blob")) {
          console.log(`No modifications found in ${addedFileAbsPath}`);
        }
        allIndex[
          `.${addedFileAbsPath.split(process.cwd())[1].replaceAll("\\", "/")}`
        ] = utils.getStrHash(content, "blob")[2];
      });
    } else if (opts.remove) {
      fileList.forEach((deletedFileAbsPath) => {
        delete allIndex[
          `.${deletedFileAbsPath.split(process.cwd())[1].replaceAll("\\", "/")}`
        ];
      });
    }
    index.write(allIndex, GIT_DIR);
  },

  /**
   *
   * @param {string} gitDir
   * @returns {Object} {filePath: blob hash}
   */
  read: (gitDir) => {
    const indexPath = path.join(files.getGitFullPath(gitDir), "index");
    if (!files.pathExists(indexPath)) {
      return {};
    }

    const content = fs.readFileSync(indexPath, "utf-8");
    let lines = content.split(/\r?\n/);
    // remove '' or '  '
    lines = lines.filter((item) => !/^\s*$/.test(item));

    // {filePath_0: hash_0,..., filePath_N: hash_N}
    const allIndex = lines.reduce((pre, cur) => {
      const [file, hash] = cur.split(" ");
      return Object.assign(pre, {
        [file]: hash,
      });
    }, {});
    return allIndex;
  },

  write: (allIndex, GIT_DIR) => {
    // format: <relative path> <hash>
    const content =
      Object.keys(allIndex)
        .map((key) => key + " " + allIndex[key])
        .join(EOL) + EOL;
    fs.writeFileSync(
      path.join(files.getGitFullPath(GIT_DIR), "index"),
      content
    );
  },
};

module.exports = index;
