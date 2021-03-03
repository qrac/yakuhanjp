const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const pjt = JSON.parse(fs.readFileSync("./project.json", "utf8"));
const tmp = fs.readFileSync("./src/template.scss", "utf8");

//console.log(pkg);
//console.log(pjt);
console.log(tmp);
