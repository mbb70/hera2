const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  console.log('Hello World');
  res.send({ express: 'Hello World' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

