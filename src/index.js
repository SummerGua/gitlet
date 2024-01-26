const path = require("path");
const fs = require("fs");
const EOL = require("os").EOL;
const objects = require("./objects");
const utils = require("../utils/util");
const files = require("./files");

/**
 * `index` file is the index of staging area
 * real files are in .gitlet/objects/
 */
const index = {
  /**
   * @param {string[]} fileList an array of files to be added
   * @param {object} opts
   * @param { boolean } opts.add
   * @param { boolean} opts.remove
   */
  updateIndex: (fileList, GIT_DIR, opts) => {
    const allIndex = index.read(GIT_DIR);

    if (opts.add) {
      fileList.forEach((addedFileAbsPath) => {
        // add each file into index & backup file to objects/
        objects.write(addedFileAbsPath);
        allIndex[`${addedFileAbsPath.split(process.cwd())[1]},0`] =
          utils.getFileHash(addedFileAbsPath, "blob");
      });
    } else if (opts.remove) {
      fileList.forEach((deletedFileAbsPath) => {
        delete allIndex[`${deletedFileAbsPath.split(process.cwd())[1]},0`];
      });
    }

    index.write(allIndex, GIT_DIR);
  },

  read: (GIT_DIR) => {
    const indexPath = path.join(files.getGitFullPath(GIT_DIR), "index");
    if (!files.pathExists(indexPath)) {
      console.error("No index file found");
      return;
    }

    const content = fs.readFileSync(indexPath, "utf-8");
    let lines = content.split(/\r?\n/);
    // remove '' or '  '
    lines = lines.filter((item) => !/^\s*$/.test(item));

    // {filePath_0,0: hash_0,..., filePath_N,0: hash_N}
    const allIndex = lines.reduce((pre, cur) => {
      const [file, stage, hash] = cur.split(" ");
      return Object.assign(pre, {
        [`${file},${stage}`]: hash,
      });
    }, {});
    return allIndex;
  },

  write: (allIndex, GIT_DIR) => {
    // format: <relative path> 0 <hash>
    const content =
      Object.keys(allIndex)
        .map(
          (key) =>
            key.split(",")[0] + " " + key.split(",")[1] + " " + allIndex[key]
        )
        .join(EOL) + EOL;
    fs.writeFileSync(
      path.join(files.getGitFullPath(GIT_DIR), "index"),
      content
    );
  },
};

module.exports = index;
