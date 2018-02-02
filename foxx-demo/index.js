"use strict";

const router = require("@arangodb/foxx/router")();
module.context.use(router);

router.get((req, res) => {
  res.send({ hello: "world" });
});

router.post((req, res) => {
  res.send({ hello: "world" });
});
