"use strict";

const router = require('@arangodb/foxx/router')();
module.context.use(router);

const db = require('@arangodb').db;
const joi = require('joi');

router.get((req, res) => {
  const year = req.queryParams.year;
  const members = db._query(`FOR c IN customers
                               FILTER SUBSTRING(c.memberSince, 0, 4) == @year
                               RETURN c`, { year }).toArray();
  res.send(members);
}).queryParam('year', joi.string().required(), 'Year of customers to return.')
  .description('Returns the list of customers that signed up in the given year.')
  .response(['application/json'], 'List of customer objects.');

