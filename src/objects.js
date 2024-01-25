const path = require("path");
const fs = require("fs");
const files = require("./files");
const utils = require("../utils/util");

const objects = {
  /**
   * add compressed file to .gitlet/objects/../.
   *
   * @param {string} fileAbsPath
   * @returns {void}
   */
  write: (fileAbsPath) => {
    const hash = utils.getFileHash(fileAbsPath, "blob");
    const compressedContent = utils.getFileCompress(fileAbsPath, "blob");
    const objectFolderPath = path.join(
      files.getGitFullPath(".gitlet"),
      "objects",
      hash.substring(0, 2)
    );
    if (!fs.existsSync(objectFolderPath)) fs.mkdirSync(objectFolderPath);

    const objectFilePath = path.join(
      objectFolderPath,
      hash.substring(hash.length - 38)
    );

    // the same hash means no modifications found
    if (fs.existsSync(objectFilePath)) {
      console.log(`No modifications found in ${fileAbsPath}`);
      return;
    }
    fs.writeFileSync(objectFilePath, compressedContent);
  },
};

module.exports = objects;
