const files = require("./src/files");
const index = require("./src/index");
const objects = require("./src/objects");
const refs = require("./src/refs");
const utils = require("./utils/util");

const gitlet = {
  GIT_DIR: ".gitlet",

  init: (opts) => {
    if (files.getGitFullPath(gitlet.GIT_DIR)) {
      console.log(
        "A gitlet version-control system already exists in the current directory."
      );
      return false;
    }

    opts = opts || { bare: false };

    const gitletStruct = {
      HEAD: "ref: refs/heads/master",
      objects: {},
      refs: {
        heads: {},
      },
      config: JSON.stringify({ core: { bare: false } }, null, 2),
    };

    // if bare, don't create gitlet/
    files.writeFilesFromTree(
      opts.bare ? gitletStruct : { [gitlet.GIT_DIR]: gitletStruct },
      process.cwd()
    );
  },

  /**
   * Adds a copy of the file as it currently exists to the *staging area*
   * only save the up-to-date copy!
   *
   * @param {string} workPath
   * @returns {void}
   */
  add: (workPath) => {
    if (!files.getGitFullPath(gitlet.GIT_DIR)) {
      console.log("Not in a git repository.");
      return;
    }

    const filesToAdd = files.findAllFiles(workPath, gitlet.GIT_DIR);
    if (filesToAdd.length === 0) {
      // TO-DO
      // in index but not in work area, remove from index
      // const ind = index.read()
      // if(ind[]!==undefined){

      // }
      // else{

      //   console.log(`${workPath} did not match any files`);
      //   return;
      // }
      console.log(`${workPath} did not match any files`);
      return;
    }

    // add to index and objects
    index.updateIndex(filesToAdd, gitlet.GIT_DIR, { add: true });
  },

  rm: (workPath) => {
    if (!files.getGitFullPath(gitlet.GIT_DIR)) {
      console.log("Not in a git repository.");
      return;
    }

    const filesToRemove = files.findAllFiles(workPath, gitlet.GIT_DIR);
    if (filesToRemove.length === 0) {
      console.log(`${workPath} did not match any files`);
      return;
    }

    index.updateIndex(filesToRemove, gitlet.GIT_DIR, { remove: true });
    files.removeFiles(filesToRemove);
  },

  commit: (message) => {
    const treeHash = objects.write(`./${gitlet.GIT_DIR}/index`, "tree");
    // todo把tree object和时间、message作为commit的内容
    const commitHash = objects.write(
      `./${gitlet.GIT_DIR}/objects/${treeHash}`,
      "commit"
    );
  },

  branch: (branchName) => {
    refs.updateRef(branchName);
  },

  /**
   * origin: git hash-object [-t \<type>] \<filename>
   * NOTE: ONLY FILE can be passed, a dir can not
   * @param {string} filename
   * @param {"blob" | "tree" | "commit"} type
   * @returns {string} hashed object
   */
  hash_object: (filename, type) => {
    if (!files.pathExists(filename)) {
      console.log("No such file or directory");
      return;
    }
    if (files.isDir(filename)) {
      console.log("Please pass a file instead of a directory");
      return;
    }
    const [_, __, hash] = utils.getFileHash(filename, type);
    console.log(hash);
    return hash;
  },

  /**
   *
   * @param {string} hash
   * @param {"type" | "content" | "contentSize"} mode
   * @returns {string}
   */
  cat_file: (hash, mode) => {
    const res = utils.getFileDecompression(gitlet.GIT_DIR, hash, mode);
    if (res === "") console.log(`${hash} does not math any files`);
    console.log(res);
    return res;
  },
};

module.exports = gitlet;
