const path = require("path");
const zlib = require("zlib");
const fs = require("fs");
const crypto = require("crypto");
const files = require("../src/files");

const utils = {
  /**
   *
   * @param {string} fileAbsPath
   * @param {"blob" | "tree" | "commit"} type
   * @returns {[string, string, string]} [hash[:2], hash[-38:], hash]
   */
  getFileHash: (fileAbsPath, type = "blob") => {
    const content = fs.readFileSync(fileAbsPath);

    /* git hash rule:
     type + ' ' + contentSize + '\0' + content
     NOTE: use byte concatenation instead of string concatenation
    */
    const hashBuffer = Buffer.concat([
      Buffer.from(type), // default encoding = utf-8
      Buffer.from(" "),
      Buffer.from(content.length.toString()),
      Buffer.from("\0"),
      Buffer.from(content),
    ]);

    const hashSHA1 = crypto.createHash("sha1").update(hashBuffer).digest("hex");
    const dirName = hashSHA1.substring(0, 2);
    const fileName = hashSHA1.substring(hashSHA1.length - 38);

    return [dirName, fileName, hashSHA1];
  },

  /**
   * NOTE: in git, compressed contents begin with '0x78 0x01',
   * where '0x78' means zlib compression
   *
   * `zlib` here begin with '0x78 0x9c'
   *
   * @param {string} fileAbsPath
   * @param {"blob" | "tree" | "commit"} type
   * @returns {Buffer}
   */
  getFileCompression: (fileAbsPath, type = "blob") => {
    const content = fs.readFileSync(fileAbsPath);
    const str = `${type} ${content.length}\0${content}`;
    return zlib.deflateSync(str);
  },

  /**
   *
   * @param {string} gitDir
   * @param {string} hash
   * @param {'type' | 'content' | 'contentSize'} mode
   * @returns {string}
   */
  getFileDecompression: (gitDir, hash, mode) => {
    const hashFilePath = path.join(
      process.cwd(),
      `${gitDir}/objects/${hash.substring(0, 2)}/${hash.substring(
        hash.length - 38
      )}`
    );
    if (!files.pathExists(hashFilePath)) return "";

    const content = fs.readFileSync(hashFilePath);
    const deCom = zlib.inflateSync(content).toString();
    switch (mode) {
      case "type":
        return deCom.split(" ")[0];
      case "content":
        return deCom.split("\0")[1];
      case "contentSize":
        return deCom.split("\0")[0].split(" ")[1];
    }
  },
};

module.exports = utils;
