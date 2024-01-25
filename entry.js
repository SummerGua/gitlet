const fs = require("fs");
const path = require("path");
const files = require("./src/files");
const objects = require("./src/objects");
const utils = require("./utils/util");
const eol = require("os").EOL;

const GIT_DIR = ".gitlet";

const gitlet = {
  init: (opts) => {
    if (files.getGitFullPath(GIT_DIR)) {
      console.error(
        "A gitlet version-control system already exists in the current directory."
      );
      return;
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
      console.error("no files modified");
      return;
    }

    // add to index and objects
    index.updateIndex(addedFileList, { add: true });
  },

  /**
   * origin: git hash-object [-t \<type>] \<filename>
   * @param {string} filename
   * @param {"blob" | "tree" | "commit"} type
   * @returns {void} hashed object
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
    console.log(hash);
  },
};

/**
 * `index` file is the index of staging area
 * real files are in .gitlet/objects/
 */
const index = {
  /**
   * @param {string[]} fileList an array of files to be added
   */
  updateIndex: (fileList, opts) => {
    // const allIndex = index.read();
    const allIndex = {};
    if (opts.add) {
      fileList.forEach((fileAbsPath) => {
        // add each file into index & backup file to objects/
        objects.write(fileAbsPath);
        allIndex[`${fileAbsPath.split(process.cwd())[1]},0`] =
          utils.getFileHash(fileAbsPath, "blob");
      });
    } else if (opts.remove) {
      console.log("remove");
      return;
    }

    index.write(allIndex);
  },

  read: () => {
    const indexPath = path.join(files.getGitFullPath(), "index");
    if (!files.pathExists(indexPath)) {
      console.error("No index file found");
      return;
    }
  },

  write: (allIndex) => {
    const content =
      Object.keys(allIndex)
        .map(
          (key) =>
            key.split(",")[0] + " " + key.split(",")[1] + " " + allIndex[key]
        )
        .join(eol) + eol;
    fs.writeFileSync(
      path.join(files.getGitFullPath(GIT_DIR), "index"),
      content
    );
  },
};

gitlet.add("test/test.js");
