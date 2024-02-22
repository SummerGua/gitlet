const fs = require("fs");
const path = require("path");
const files = require("./files");
const utils = require("../utils/util");

const refs = {
  addBranch: (ref) => {
    const refPath = path.join(files.getGitFullPath(), `refs/heads/${ref}`);
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
      path.join(files.getGitFullPath(), "HEAD"),
      `ref: refs/heads/${branchName}`
    );
  },

  getCurrentBranch: () => {
    const ref = fs.readFileSync(
      path.join(files.getGitFullPath(), "HEAD"),
      "utf-8"
    );
    return ref.match(/refs\/heads\/(.+)/)[1];
  },

  getAllBranches: () => {
    // return all branches and add a star before current branch
    const branches = fs
      .readdirSync(path.join(files.getGitFullPath(), "refs/heads"))
      .map((branch) => {
        if (branch === refs.getCurrentBranch()) {
          return `* ${branch}`;
        }
        return branch;
      });
    return branches;
  },

  getParentHash: () => {
    const relativeHeadPath = fs
      .readFileSync(path.join(files.getGitFullPath(), "HEAD"), "utf-8")
      .split("ref: ")[1];
    const currentHeadPath = path.join(files.getGitFullPath(), relativeHeadPath);
    if (fs.existsSync(currentHeadPath)) {
      // if .gitlet/refs/heads/master exists
      return fs.readFileSync(currentHeadPath, "utf-8");
    }
    return "";
  },

  updateRef: (commitHash) => {
    const refRelPath = fs
      .readFileSync(path.join(files.getGitFullPath(), "HEAD"), "utf-8")
      .split("ref: ")[1];
    fs.writeFileSync(path.join(files.getGitFullPath(), refRelPath), commitHash);
  },

  getLastCommitContent: () => {
    const currentHead = fs.readFileSync(
      path.join(files.getGitFullPath(), "HEAD"),
      "utf-8"
    );
    const currentHeadPath = path.join(
      files.getGitFullPath(),
      currentHead.split("ref: ")[1]
    );
    const fileHash = fs.readFileSync(currentHeadPath, "utf-8");
    const content = utils.getFileDecompression(fileHash)["content"];
    return JSON.parse(content);
  },
};

module.exports = refs;
