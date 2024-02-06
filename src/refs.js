const fs = require("fs");
const path = require("path");
const files = require("./files");
const GIT_DIR = ".gitlet";

const refs = {
  addBranch: (ref) => {
    const refPath = path.join(
      files.getGitFullPath(GIT_DIR),
      `refs/heads/${ref}`
    );
    // 判断是否存在
    if (fs.existsSync(refPath)) {
      console.log(`a branch named '${ref}' already exists`);
      return false;
    }
    // TODO
    const currentHead = refs.getParentHash();
    fs.writeFileSync(refPath, currentHead, "utf-8");
  },

  changeBranch: (branchName) => {
    fs.writeFileSync(
      path.join(files.getGitFullPath(GIT_DIR), "HEAD"),
      `ref: refs/heads/${branchName}`
    );
  },

  getCurrentBranch: () => {
    const ref = fs.readFileSync(
      path.join(files.getGitFullPath(GIT_DIR), "HEAD"),
      "utf-8"
    );
    return ref.match(/refs\/heads\/(.+)/)[1];
  },

  getParentHash: () => {
    const relativeHeadPath = fs
      .readFileSync(path.join(files.getGitFullPath(GIT_DIR), "HEAD"), "utf-8")
      .split("ref: ")[1];
    const currentHeadPath = path.join(
      files.getGitFullPath(GIT_DIR),
      relativeHeadPath
    );
    if (fs.existsSync(currentHeadPath)) {
      // if .gitlet/refs/heads/master exists
      return fs.readFileSync(currentHeadPath, "utf-8");
    }
    return "";
  },

  updateRef: (commitHash) => {
    const refRelPath = fs
      .readFileSync(path.join(files.getGitFullPath(GIT_DIR), "HEAD"), "utf-8")
      .split("ref: ")[1];
    fs.writeFileSync(
      path.join(files.getGitFullPath(GIT_DIR), refRelPath),
      commitHash
    );
  },
};

module.exports = refs;
