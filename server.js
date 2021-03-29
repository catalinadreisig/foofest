/* eslint-env node, es6 */
const express = require("express");
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST"); //OPTIONS
  next();
});
const { FooFest } = require("./src/foofest");
//console.log(FooFest);
/*
const { FooBar } = require("./src/foobar");
const { Customer } = require("./src/customer");
const { Order } = require("./src/order");
const { Beer } = require("./src/beer");

app.get("/", function (req, res) {
  // send back a json response
  let data = FooBar.getData();
  delete data.beertypes;
  res.json(data);
});
*/
app.get("/bands", function (req, res) {
  res.json(FooFest.bands);
});
app.get("/schedule", function (req, res) {
  res.json(FooFest.schedule);
});
//TODO: day or stage
app.get("/schedule/:day", function (req, res) {
  const day = parseInt(req.params.day);
  res.json(FooFest.schedule);
});
app.get("/events", function (req, res) {
  res.json(FooFest.eventLog.getEvents());
});
app.get("/available-slots", function (req, res) {
  res.json(FooFest.booking.getData());
});
app.post("/settings", function (req, res) {
  const structure = req.body;
  if (structure.eventFrequency) {
    FooFest.setEventFrequency(structure.eventFrequency);
  }
  if (structure.eventChance) {
    FooFest.setEventChance(structure.eventChance);
  }
  if (!structure.eventFrequency && !structure.eventChance) {
    res.send({
      error:
        "Wrong data format supplied, need 'eventFrequency' or 'eventChance'",
      status: 500,
    });
  } else {
    res.send({
      message: "Changed settings",
    });
  }
});
//TODO: read data from request
app.put("/reserve-spot", function (req, res) {
  res.send(FooFest.booking.reserveSpot(req.body.area, req.body.amount));
});

app.post("/fullfill-reservation", function (req, res) {
  res.send(FooFest.booking.fullfillReservation(req.body.id));
});
/*
app.post("/order", function (req, res) {
  //const key = req.params.key;
  const structure = req.body;
  if (!Array.isArray(structure)) {
    res.send({ message: "Wrong data format supplied", status: 500 });
  }
  console.log(structure);
  

  //Validate data structure
  const hasProps = (currentItem) => {
    return currentItem.name && currentItem.amount;
  };
  let sent = false;
  if (!sent) {
    if (!structure.every(hasProps)) {
      sent = true;
      res.send({
        message: "Wrong data format supplied, missing name or amount",
        status: 500,
      });
    }
  }
  if (!sent) {
    structure.forEach((item) => {
      if (!beers.includes(item.name)) {
        sent = true;
        res.send({
          message: "Unknown beer: " + item.name,
          status: 500,
        });
      }
    });
  }
  if (!sent) {
    const data = FooBar.getData();
    structure.forEach((item) => {
      const found = data.taps.find((tap) => tap.beer === item.name);
      if (!found && !sent) {
        sent = true;
        res.send({
          message: "We are not serving: " + item.name + " right now!",
          status: 500,
        });
      }
    });
  }
  // expected output: true
  if (!sent) {
    sent = true;
    const customer = new Customer();
    const order = new Order(customer);

    const beerTypes = FooBar.getAvailableBeerTypes();
    for (let i = 0; i < structure.length; i++) {
      const beerData = beerTypes.find((b) => b.name === structure[i].name);
      for (let amount = 0; amount < structure[i].amount; amount++) {
        const beer = new Beer(beerData);
        order.addBeer(beer);
      }
    }
    const id = FooBar.addCustomer(customer);
    console.log(FooBar);
    // res.send converts to json as well
    // but req.json will convert things like null and undefined to json too although its not valid
    res.send({ message: "added", status: 200, id: id });
  }
});*/

app.listen(process.env.PORT || 3000);
