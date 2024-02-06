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
    } else return fs.existsSync(path.resolve(dir));
  },

  isDir: (dirPath) => {
    return fs.statSync(dirPath).isDirectory();
  },

  getGitFullPath: (gitDir) => {
    if (files.pathExists(gitDir)) return path.resolve(gitDir);
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

  /**
   *
   * @param {Object} flatObject
   */
  nestFlatTree: (obj) => {
    /* key 1) can be a file without ext './test'
             2) can be a file with ext './README.md'
             3) can be a deep path './src/util/util.js'
      */
    const tree = {};

    for (const key in obj) {
      // get an array consists of folders
      // be like: ['src', 'util', 'util.js']
      const item = key.replace("./", "");
      const pathParts = item.split("/");
      let currentLevel = tree;
      for (let i = 0; i < pathParts.length - 1; i++) {
        // get current path part
        const part = pathParts[i];

        // if not exist in current level, create it
        // such as folder 'src'
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }

        // into the next level
        currentLevel = currentLevel[part];
      }

      // last part is file name
      const lastPart = pathParts[pathParts.length - 1];
      currentLevel[lastPart] = obj[key];
    }

    return tree;
  },

  removeFiles: (fileList) => {
    fileList.forEach((path) => {
      fs.unlinkSync(path);
    });
  },
};

module.exports = files;
