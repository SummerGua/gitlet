const fs = require("fs");
const path = require("path");
const files = require("./src/files");
const index = require("./src/index");
const utils = require("./utils/util");

const GIT_DIR = ".gitlet";

const gitlet = {
  init: (opts) => {
    if (files.getGitFullPath(GIT_DIR)) {
      console.error(
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
      opts.bare ? gitletStruct : { [GIT_DIR]: gitletStruct },
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
    if (!files.getGitFullPath(GIT_DIR)) {
      console.error("Not in a git repository.");
      return;
    }

    const addedFileList = files.recursiveFiles(
      path.join(process.cwd(), workPath),
      GIT_DIR
    );
    if (addedFileList.length === 0) {
      // in stage but deleted in work area, remove from stage
      if (/**find in stage */ 1) {
        const deletedFileList = files.matchingFiles(workPath);
        index.updateIndex(deletedFileList, GIT_DIR, { remove: true });
      }
      console.error(`${workPath} did not match any files`);
      return;
    }

    // add to index and objects
    index.updateIndex(addedFileList, { add: true });
  },

  rm: (workPath) => {
    // TO-DO
    console.log(workPath);
  },

  commit: (message) => {
    const time = new Date().toLocaleString().replaceAll("/", "-");

    console.log(time);
  },

  /**
   * origin: git hash-object [-t \<type>] \<filename>
   * @param {string} filename
   * @param {"blob" | "tree" | "commit"} type
   * @returns {string} hashed object
   */
  hash_object: (filename, type) => {
    if (!files.pathExists(filename)) {
      console.error("No such file or directory");
      return;
    }
    if (fs.statSync(filename).isDirectory()) {
      console.error("Please pass a file instead of a directory");
      return;
    }
    const hash = utils.getFileHash(filename, type);
    return hash;
  },

  /**
   *
   * @param {string} hash
   * @param {"type" | "content" | "contentSize"} mode
   * @returns {string}
   */
  cat_file: (hash, mode) => {
    const res = utils.getFileDecompression(GIT_DIR, hash, mode);
    if (res === "") console.error(`${hash} does not math any files`);
    return res;
  },
};
gitlet.commit(1);
module.exports = gitlet;
