const fs = require("fs");
const path = require("path");

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

  isDir: (dirPath) => {
    return fs.statSync(dirPath).isDirectory();
  },

  getGitFullPath: function (gitDir) {
    if (files.pathExists(gitDir)) return path.join(process.cwd(), gitDir);
    else return false;
  },

  /**
   * get all files under `dirOrFile` exclude `.gitlet`
   * @param {string} absPath
   * @param {string} exclude
   * @returns {Array<string>|[]}
   */
  findAllFiles: (absPath, exclude) => {
    if (!path.isAbsolute(absPath)) {
      absPath = path.join(process.cwd(), absPath);
    }
    if (
      !fs.existsSync(absPath) ||
      absPath === path.join(process.cwd(), exclude)
    ) {
      return [];
    } else if (fs.statSync(absPath).isFile()) {
      return [absPath];
    } else if (fs.statSync(absPath).isDirectory()) {
      return fs.readdirSync(absPath).reduce((fileList, dirChild) => {
        return fileList.concat(
          files.findAllFiles(path.join(absPath, dirChild), exclude)
        );
      }, []);
    }
  },

  matchingFiles: (relativePath) => {
    // todo?
  },

  removeFiles: (fileList) => {
    fileList.forEach((path) => {
      fs.unlinkSync(path);
    });
  },
};

module.exports = files;
