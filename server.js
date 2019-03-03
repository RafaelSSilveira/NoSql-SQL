const express = require('express');
const app = express();
const clc = require('cli-colors');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(clc.blue(`Listening on port ${port}`));
});
