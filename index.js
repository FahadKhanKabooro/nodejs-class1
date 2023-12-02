const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replacetemplates");

//to read a file
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// // to write a file
// const textOut = `this is a text file we creating : ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output1.txt", textOut);
// console.log("file written");

// //non-blocking asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data2);
//       console.log(data3);
//       const gR = fs.writeFile(
//         "./txt/myfile2.txt",
//         `${data1}\n${data2}\n${data3}`,
//         (err) => {
//           console.log("file has been created ...WELLDONE Boss");
//         }
//       );
//     });
//   });
// });
// console.log("file is reading ...😎");

////////////////////////////SERVER////////////////

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-cards.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// Using NPM 3rd party Module
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  // req.send("server is deployed");
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(" ");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    // console.log(dataObj);
    res.end(output);

    // PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API PAGE
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);

    // 404 NOT FOUND PAGE
  } else {
    res.writeHead(404, { "content-type": "text/html" });
    res.end("<h1>PAGE NOT FOUND </h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening port 8000");
});
