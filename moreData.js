// Cleanup to allow for multiple load:
db._useDatabase("shop");
delete r; delete gg; delete g;

// Get the collections:
var customers = db.customers;
var items = db.items;
var sales = db.sales;
var baskets = db.baskets;
var reviews = db.reviews;
var reviewRel = db.reviewRel;

// Put in some random users:

require("internal").print("Inserting customers...");

var numberOfUsers = 100000;
var e = require("internal").env.NRUSERS;
if (e) { numberOfUsers = Number(e); }

var numberOfItems = 100000;
e = require("internal").env.NRITEMS;
if (e) { numberOfItems = Number(e); }

var numberOfSales = 100000;
e = require("internal").env.NRSALES;
if (e) { numberOfSales = Number(e); }

var numberOfReviews = 100000;
e = require("internal").env.NRREVIEWS;
if (e) { numberOfReviews = Number(e); }

var numberOfBaskets = 1000;
e = require("internal").env.NRBASKETS;
if (e) { numberOfBaskets = Number(e); }

var rand = require("internal").rand;

function myRand(low, high) {
  return (Math.abs(rand()) % (high - low)) + low;
}

function randomDate() {
  return new Date(myRand(0, 1528877) * 1000000);
}

function randomRecentDate() {
  return new Date(myRand(1500000, 1528877) * 1000000);
}

function randomName() {
  return "LastName_" + myRand(1000000, 10000000);
}

function randomFirstName() {
  return "FirstName_" + myRand(1000000, 10000000);
}

function randomAddress() {
  return {street: "" + myRand(1, 1000) + " Main" + myRand(10000,100000)
                     + "-street",
          city: "City-" + myRand(1000, 10000),
          zip: "" + myRand(10000, 100000)};
}

var l = [];
var custkeys = [];

for (let i = 1; i <= numberOfUsers; ++i) {
  l.push({name: randomName(), firstName: randomFirstName(),
          memberSince: randomDate(), address: randomAddress()});
  if (l.length % 1000 === 0 || i === numberOfUsers) {
    let keys = customers.insert(l);
    for (let x of keys) {
      custkeys.push(x._key);
    }
    l = [];
    require("internal").print(i, "/", numberOfUsers);
  }
}

// Now insert some items:

require("internal").print("Inserting items...");

function randomItemName() {
  return "Item-" + myRand(1000000, 10000000);
}

var itemkeys = [];
l = [];

for (let i = 1; i <= numberOfItems; ++i) {
  l.push({description: randomItemName(), price: myRand(100,100000) * 0.01,
          inStock: myRand(0, 1000), weight: myRand(1,100),
          shipping: myRand(100,2000) * 0.01,
          orderId: "ID-" + myRand(1000, 1000000),
          supplier: "Supplier-" + myRand(100,10000)});
  if (l.length % 1000 === 0 || i === numberOfItems) {
    let keys = items.insert(l);
    for (let x of keys) {
      itemkeys.push(x._key);
    }
    l = [];
    require("internal").print(i, "/", numberOfItems);
  }
}

// Now insert some sales:

require("internal").print("Inserting sales...");

l = [];

for (let i = 1; i <= numberOfSales; ++i) {
  let u = custkeys[myRand(0, custkeys.length)];
  let d = randomDate();
  let b = "bill-" + (d.getYear()+1900) + "-" + myRand(1,100000);
  let n = myRand(1,10);
  for (let j = 0; j < n; j++) {
    let ik = itemkeys[myRand(0, itemkeys.length)];
    l.push({_from: "customers/" + u, _to: "items/" + ik,
            date: d, billingId: b});
  }
  if (i % 1000 === 0 || i === numberOfSales) {
    sales.insert(l);
    l = [];
    require("internal").print(i, "/", numberOfSales);
  }
}

// Now insert some reviews:

require("internal").print("Inserting reviews...");

l = [];        // for reviews
let ll = [];   // for review links

let qualities = ["good", "very good", "poor", "bad", "extremely bad",
                 "fantastic", "miserable"];
for (let i = 1; i <= numberOfReviews; ++i) {
  let ik = itemkeys[myRand(0, itemkeys.length)];
  l.push({rating: myRand(0, 11), item: ik,
          text: "This is a " + qualities[myRand(0, qualities.length)] +
                " product."});
  let u = custkeys[myRand(0, custkeys.length)];
  ll.push({_from: "customers/" + u, _to: "items/" + ik, type: "wrote"});
  let n = myRand(1,5);
  let its = [];
  for (let j = 0; j < n; j++) {
    u = custkeys[myRand(0, custkeys.length)];
    ll.push({_from: "customers/" + u, _to: "items/" + ik, type: "liked",
             agree: myRand(0, 11)});
  }
  if (i % 1000 === 0 || i === numberOfBaskets) {
    reviews.insert(l);
    l = [];
    reviewRel.insert(ll);
    ll = [];
    require("internal").print(i, "/", numberOfReviews);
  }
}

// Now insert some baskets:

require("internal").print("Inserting baskets...");

l = [];

for (let i = 1; i <= numberOfBaskets; ++i) {
  let u = custkeys[myRand(0, custkeys.length)];
  let d_mod = randomRecentDate();
  let d_seen = randomRecentDate();
  if (d_mod > d_seen) { let dummy = d_mod; d_mod = d_seen; d_seen = dummy; }
  let n = myRand(1,10);
  let its = [];
  for (let j = 0; j < n; j++) {
    let ik = itemkeys[myRand(0, itemkeys.length)];
    its.push({id: ik, number: myRand(1, 20)});
  }
  l.push({customer: u, items: its, lastModified: d_mod, lastSeen: d_seen});
  if (i % 1000 === 0 || i === numberOfBaskets) {
    baskets.insert(l);
    l = [];
    require("internal").print(i, "/", numberOfBaskets);
  }
}

