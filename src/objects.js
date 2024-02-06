const path = require("path");
const fs = require("fs");
const files = require("./files");
const utils = require("../utils/util");

const objects = {
  GIT_DIR: ".gitlet",
  /**
   * add compressed file to .gitlet/objects/../.
   * @param {string} content read from index
   * @param {"blob" | "tree" | "commit"} type
   * @returns {string}
   */
  write: (content, type) => {
    const [dirName, fileName, full40Hash] = utils.getStrHash(content, type);
    const compressedContent = utils.getStrCompression(content, type);
    const objectFolderPath = path.join(
      files.getGitFullPath(objects.GIT_DIR),
      "objects",
      dirName
    );
    if (!fs.existsSync(objectFolderPath)) fs.mkdirSync(objectFolderPath);

    const objectFilePath = path.join(objectFolderPath, fileName);

    // the same hash means no modifications found
    if (fs.existsSync(objectFilePath)) {
      if (type === "blob") {
        return "";
      } else {
        return full40Hash;
      }
    }
    fs.writeFileSync(objectFilePath, compressedContent);
    return full40Hash;
  },

  createCommit: (treeHash, parentHash, message) => {
    const commitContent = JSON.stringify({
      tree: treeHash,
      parent: parentHash,
      date: utils.getTime(),
      message,
    });
    return objects.write(commitContent, "commit");
  },

  writeTree: (tree) => {
    const items = Object.keys(tree).map((key) => {
      if (typeof tree[key] === "string") {
        return `blob ${key} ${tree[key]}`;
      } else {
        return `tree ${key} ${objects.writeTree(tree[key])}`;
      }
    });
    return objects.write(items.join("\n"), "tree");
  },
};

module.exports = objects;
