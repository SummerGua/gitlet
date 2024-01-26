const fs = require("fs");
const path = require("path");
const index = require(".");

const files = {
  /**
   *
   * @param {object} tree
   * @param {string} prefix
   */
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
   * @param {string} dir folder or file
   * @returns
   */
  pathExists: (dir) => {
    if (path.isAbsolute(dir)) {
      return fs.existsSync(dir);
    } else return fs.existsSync(path.join(process.cwd(), dir));
  },

  getGitFullPath: (gitDir) => {
    const gitFullPath = path.join(process.cwd(), gitDir);
    if (files.pathExists(gitDir)) return gitFullPath;
    else return false;
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

  matchingFiles: (relativePath) => {
    const allIndex = index.read();
    Object.keys(allIndex).filter((key) => {
      key.replace("\\", "/");
    });
  },
};

module.exports = files;
