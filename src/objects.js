const path = require("path");
const fs = require("fs");
const files = require("./files");
const utils = require("../utils/util");

const objects = {
  /**
   * add compressed file to .gitlet/objects/../.
   *
   * @param {string} oneFilePath
   * @param {"blob" | "tree" | "commit"} type
   * @returns {void}
   */
  write: (oneFilePath, type) => {
    if (!path.isAbsolute) oneFilePath = path.join(process.cwd(), oneFilePath);
    const [dirName, fileName, fullHash] = utils.getFileHash(oneFilePath, type);
    const compressedContent = utils.getFileCompression(oneFilePath, type);
    const objectFolderPath = path.join(
      files.getGitFullPath(".gitlet"),
      "objects",
      dirName
    );
    if (!fs.existsSync(objectFolderPath)) fs.mkdirSync(objectFolderPath);

    const objectFilePath = path.join(objectFolderPath, fileName);

    // the same hash means no modifications found
    if (fs.existsSync(objectFilePath)) {
      console.log(`No modifications found in ${oneFilePath}`);
      return;
    }
    fs.writeFileSync(objectFilePath, compressedContent);
    return fullHash;
  },
};

module.exports = objects;
