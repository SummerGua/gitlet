const files = require("./files");
const index = require("./index");
const objects = require("./objects");
const refs = require("./refs");
const utils = require("../utils/util");

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
    if (!workPath) {
      console.log("please input a path");
      return;
    }
    if (!files.getGitFullPath(gitlet.GIT_DIR)) {
      console.log("Not in a git repository.");
      return;
    }

    const filesToAdd = files.findAllFiles(workPath, gitlet.GIT_DIR);
    if (filesToAdd.length === 0) {
      // not in work area
      const ind = Object.keys(index.read(gitlet.GIT_DIR)).map((item) =>
        utils.relToAbs(item)
      );
      const absPath = utils.relToAbs(workPath);
      if (ind.includes(absPath)) {
        // in index
        console.log(`${workPath} removed from staging area`);
        index.updateIndex([absPath], gitlet.GIT_DIR, { remove: true });
      } else {
        // neither in index nor in work area
        console.log(`${workPath} did not match any files`);
      }
    } else {
      // add to index and objects
      index.updateIndex(filesToAdd, gitlet.GIT_DIR, { add: true });
    }
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
    if (!files.getGitFullPath(gitlet.GIT_DIR)) {
      console.log("Not in a git repository.");
      return;
    }

    if (!message) {
      console.log("Please enter a commit message");
      return;
    }

    const treeHash = gitlet.write_tree();
    const parentHash = refs.getParentHash();

    if (parentHash !== "") {
      const lastTreeHash = JSON.parse(
        gitlet.cat_file(parentHash, "content", false)
      ).tree;
      if (treeHash === lastTreeHash) {
        console.log("no changes added to commit");
        return;
      }
    }

    const commitHash = objects.createCommit(treeHash, parentHash, message);
    // 把commit hash存到refs/heads/当前分支名
    console.log(commitHash);
    refs.updateRef(commitHash);
  },

  switch: (branchName) => {
    if (!branchName) {
      console.log("please pass a branch name");
      return;
    }
    refs.changeBranch(branchName);
  },

  branch: (branchName) => {
    if (branchName === undefined) {
      const branch = refs.getCurrentBranch();
      console.log(branch);
      return branch;
    }
    refs.addBranch(branchName);
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
  cat_file: (hash, mode, log = true) => {
    if (!hash || !mode) {
      console.log("please pass params");
      return;
    }
    const res = utils.getFileDecompression(gitlet.GIT_DIR, hash, mode);
    if (res === "") console.log(`${hash} does not math any files`);
    if (log) console.log(res);
    return res;
  },

  /**
   * create a tree object of current index
   * @returns {string}
   */
  write_tree: () => {
    const ind = index.read(gitlet.GIT_DIR);
    const tree = files.nestFlatTree(ind);
    const treeHash = objects.writeTree(tree);
    return treeHash;
  },
};

module.exports = gitlet;
