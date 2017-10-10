const express = require("express");
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const app = express();

app.get("/scrape", function(req, res) {
  url = "https://www.easports.com/us/fifa/news/2017/fifa-18-leagues-and-teams";
  request(url, function(error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      const json = { clubs: [] };
      let title, teams;
      $(".eas-b2 > div:nth-child(5)").filter(function() {
        const data = $(this);
        //title = data.find('b').text();
        let teams = [];
        data.find("ul > li").each(function(i, elem) {
          teams[i] = $(this).text();
        });
        teams.sort();
        teams = teams.filter((elem, index, self) => index == self.indexOf(elem));
        teams.forEach(function(elem, i) {
          json.clubs.push({ 'code': i + 1, 'name': elem });
        });
        res.send(json);
      });

      fs.writeFile("output.json", JSON.stringify(json, null, 4), function(err) {
        console.log(
          "File successfully written! - Check your project directory for the output.json file"
        );
      });
    }
  });
});

app.listen("8081");

console.log("Magic happens on port 8081");

exports = module.exports = app;
