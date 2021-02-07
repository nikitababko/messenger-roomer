const express = require('express');

const app = express();

const rooms = {
  rooms: [],
  messages: ['hello', 'hi'],
};

app.get('/rooms', (req, res) => {
  console.log('Hello');
  res.json(rooms);
});

// Server start
const PORT = process.env.PORT || 9999;
app.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log(`Server is running on ${PORT}`);
});
