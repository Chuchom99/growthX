
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const request = require('request');
const https = require('https');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
// const CoinGecko = require('coingecko-api');




const app = express();
// const CoinGeckoClient = new CoinGecko();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect('mongodb://127.0.0.1:/growthxContactDb', {
//   useNewUrlParser: true
// });

const contactSchema = {
  firstName: String,
  lastName: String,
  email: String,
  Phone:String,
  firm: String,
  Website:String,
  services: Array
}
const Contact = mongoose.model("Contact", contactSchema)

app.get("/", function(req, res){
  res.render("home");
});
app.get("/about", function(req, res){
  res.render("about");
});
app.get("/services", function(req, res){
  res.render("services");
});
app.get("/contact", function(req, res){
  res.render("contact");
});
// app.get("/investing", function(req, res){
//   let { data } = await CoinGeckoClient.coins.markets({
//         per_page: 20,
//         page: 1,
//     });
//     res.json(data)
//   res.render("investing");
// });
app.get("/learn-more", function(req, res){
  res.render("learn-more");
});
app.get("/digital-marketing", function(req, res){
  res.render("digital-marketing")
});

app.post("/", function(req, res){
  var firstName = req.body.fname;
  var secondName = req.body.sname;
  var email = req.body.email;

  const data = {
members:[{
email_address: email,
  status: "subscribed",
  merge_fields: {
    FNAME : firstName,
    LNAME : secondName  }
  }]
};

const jsonData = JSON.stringify(data);

const url ="https://us12.api.mailchimp.com/3.0/lists/7f7b1ad23a/";

const options = {
  method: "POST",
  auth:   "new:3c7db05fac99d015831badd38f8d7ed5-us12"
};

 const request = https.request(url, options, function(response){

   if(response===200){}

   response.on("data", function(data){
     console.log(JSON.parse(data));
   })
  });

request.write(jsonData);
request.end();

  console.log(jsonData)
});
app.post("/contact", function(req, res){
  const contact = new Contact({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    Phone: req.body.phone,
    firm: req.body.firm,
    Website:req.body.Website,
    services: req.body.services
  })
  contact.save(function(err){
    if(err){
      console.log(err);
    }
  })
});
app.get("/investing", function(req, res){

  const url = "https://api.coingecko.com/api/v3/search/trending";

  https.get(url, "JSON", function(response){
    var data;
    response.on("data", function(chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    });

    response.on("end", function() {
        const cryptoData = JSON.parse(data);
        console.log(cryptoData);
        res.render("investing",
           {coins: cryptoData}
        );
    });
  })

})





app.listen(3000, function(){
	console.log("server is running on port 3000");
})
// <script type="text/javascript">
//     $(window).on('load', () => $('#yourModal').modal('show'));
// </script>
