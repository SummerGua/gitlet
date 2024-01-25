const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const files = require("./files");

const GIT_DIR = ".gitlet";

const gitlet = {
  init: (opts) => {
    if (files.inGitRepo(GIT_DIR)) {
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
   * @param {string} pathOrFile
   * @returns {void}
   */
  add: (pathOrFile) => {
    if (!files.inGitRepo(GIT_DIR)) {
      console.error("Not in a git repository.");
      return;
    }

    const addedFiles = files.recursiveFiles(
      path.join(process.cwd(), pathOrFile),
      (exclude = GIT_DIR)
    );
    if (addedFiles.length === 0) {
      console.error("no files modified");
      return;
    }

    index.updateIndex(addedFiles, { add: true });
  },

  /**
   * origin: git hash-object [-t \<type>] \<filename>
   * @param {string} filename
   * @param {"blob" | "tree" | "commit"} type
   * @returns {string} hashed object
   */
  hash_object: (filename, type = "blob") => {
    if (!files.pathExists(filename)) {
      console.error("No such file or directory");
      return;
    }
    if (fs.statSync(filename).isDirectory()) {
      console.error("Please pass a file instead of a directory");
      return;
    }
    // read the content of finename
    content = fs.readFileSync(path.join(process.cwd(), filename));
    const contentSize = content.length.toString();

    /* git hash rule:
     type + ' ' + contentSize + '\0' + content
     NOTE: use byte concatenation instead of string concatenation
    */
    const hashBuffer = Buffer.concat([
      Buffer.from(type), // default encoding = utf-8
      Buffer.from(" "),
      Buffer.from(contentSize),
      Buffer.from("\0"),
      Buffer.from(content),
    ]);
    hashData = crypto.createHash("sha1").update(hashBuffer).digest("hex");
    console.log(hashData);
    return hashData;
  },
};

const index = {
  /**
   * @param {string[]} fileList
   */
  updateIndex: (fileList, opts) => {
    if (opts.add) {
      console.log(111);
    }
  },
  read: () => {},
  write: () => {},
};

gitlet.hash_object("test.js");
