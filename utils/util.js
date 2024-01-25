const path = require("path");
const zlib = require("zlib");
const fs = require("fs");
const crypto = require("crypto");

const utils = {
  /**
   *
   * @param {string} fileAbsPath
   * @param {"blob" | "tree" | "commit"} type
   * @returns {string}
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
    return crypto.createHash("sha1").update(hashBuffer).digest("hex");
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
  getFileCompress(fileAbsPath, type = "blob") {
    const content = fs.readFileSync(fileAbsPath);
    const str = `${type} ${content.length}\0${content}`;
    return zlib.deflateSync(str);
  },
};

module.exports = utils;
