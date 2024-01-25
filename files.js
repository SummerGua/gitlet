const fs = require("fs");
const path = require("path");

const files = {
  writeFilesFromTree: (tree, prefix) => {
    Object.keys(tree).forEach((key) => {
      const filePath = path.join(prefix, key);
      if (typeof tree[key] === "string") {
        fs.writeFileSync(filePath, tree[key]);
      } else {
        !fs.existsSync(filePath) && fs.mkdirSync(filePath, 777);
        files.writeFilesFromTree(tree[key], filePath);
      }
    });
  },

  /**
   *
   * @param {string} relativePath NOT INCLUDE process.cwd()
   * @returns
   */
  pathExists: (relativePath) => {
    return fs.existsSync(path.join(process.cwd(), relativePath));
  },

  inGitRepo: (gitDir) => {
    if (fs.existsSync(path.join(process.cwd(), gitDir))) return true;
  },

  /**
   * get all files under `dirOrFile` exclude `.gitlet`
   * @param {string} absolutePath
   * @param {string} exclude
   * @returns {Array<string>|[]}
   */
  recursiveFiles: (absolutePath, exclude) => {
    if (
      !fs.existsSync(absolutePath) ||
      absolutePath === path.join(process.cwd(), exclude)
    ) {
      return [];
    } else if (fs.statSync(absolutePath).isFile()) {
      return [absolutePath];
    } else if (fs.statSync(absolutePath).isDirectory()) {
      return fs.readdirSync(absolutePath).reduce((fileList, dirChild) => {
        return fileList.concat(
          files.recursiveFiles(path.join(absolutePath, dirChild), exclude)
        );
      }, []);
    }
  },
};

module.exports = files;
