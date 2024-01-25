const fs = require("fs");

const result = fs.readdirSync(process.cwd()).reduce((a, b) => {
  return a.concat([], b);
});
console.log(result);
