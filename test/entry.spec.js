const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const gitlet = require("../entry");
const index = require("../src");

describe("gitlet command test", () => {
  const TEST_FILE = "a.txt";
  const TEST_DIR = "b";
  const ROOT = process.cwd();

  beforeAll(() => {
    process.chdir(path.join(process.cwd(), "./test/testData"));
    if (fs.existsSync(gitlet.GIT_DIR)) {
      fs.rmSync(gitlet.GIT_DIR, { recursive: true, force: true });
    }
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
    // create test file
    fs.writeFileSync(TEST_FILE, "1");
    fs.mkdirSync(TEST_DIR);
    fs.writeFileSync(path.join(TEST_DIR, "c.txt"), "1");
  });

  afterAll(() => {
    process.chdir(ROOT);
  });

  test("init() should create all files", () => {
    gitlet.init();
    const gitletPath = path.join(process.cwd(), gitlet.GIT_DIR);
    expect(fs.existsSync(gitletPath)).toBe(true);
    expect(fs.existsSync(path.join(gitletPath, "objects"))).toBe(true);
    expect(fs.existsSync(path.join(gitletPath, "refs/heads"))).toBe(true);
    expect(fs.readFileSync(path.join(gitletPath, "HEAD"), "utf-8")).toBe(
      "ref: refs/heads/master"
    );
    expect(fs.readFileSync(path.join(gitletPath, "config"), "utf-8")).toBe(
      JSON.stringify({ core: { bare: false } }, null, 2)
    );
  });

  test("init() should not be created twice", () => {
    const hasCreated = gitlet.init();
    expect(hasCreated).toBe(false);

    const gitletPath = path.join(process.cwd(), gitlet.GIT_DIR);
    expect(fs.existsSync(gitletPath)).toBe(true);
    expect(fs.existsSync(path.join(gitletPath, "objects"))).toBe(true);
    expect(fs.existsSync(path.join(gitletPath, "refs/heads"))).toBe(true);
    expect(fs.readFileSync(path.join(gitletPath, "HEAD"), "utf-8")).toBe(
      "ref: refs/heads/master"
    );
    expect(fs.readFileSync(path.join(gitletPath, "config"), "utf-8")).toBe(
      JSON.stringify({ core: { bare: false } }, null, 2)
    );
  });

  test("hash_object() should return a file's hash", () => {
    const blobHash = gitlet.hash_object(TEST_FILE, "blob");
    const content = fs.readFileSync(TEST_FILE);
    const hashBuffer = Buffer.concat([
      Buffer.from("blob"),
      Buffer.from(" "),
      Buffer.from(content.length.toString()),
      Buffer.from("\0"),
      Buffer.from(content),
    ]);
    const hash = crypto.createHash("sha1").update(hashBuffer).digest("hex");
    expect(blobHash.length).toBe(40);
    expect(blobHash).toBe(hash);
  });

  test("hash_object() can not receive a directory name", () => {
    const res = gitlet.hash_object(TEST_DIR);
    expect(res).toBe(undefined);
  });

  test.skip("add(file or dir) should add backup to object & add to index", () => {
    // TODO TOO COMPLEX
    gitlet.add(TEST_FILE);
    const allIndex = index.read(gitlet.GIT_DIR);
  });

  test("rm() should remove sth. both from index and working directory", () => {
    gitlet.rm(TEST_FILE);
    const isExisting = fs.existsSync(TEST_FILE);
    expect(isExisting).toBe(false);
    const indexContent = index.read(gitlet.GIT_DIR);
    if (TEST_FILE.indexOf("./")) {
      expect(indexContent[TEST_FILE]).toBe(undefined);
    } else {
      expect(indexContent[`./${TEST_FILE}`]).toBe(undefined);
    }
    fs.writeFileSync(TEST_FILE, "1");
    gitlet.add(".");
  });
});
