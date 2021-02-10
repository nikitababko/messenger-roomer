const express = require('express');
const app = express();

/**
 * Указываем, что наш сервер будет работать через переменную 'app'.
 * И теперь в 'server' хранится наше приложение.
 */
const server = require('http').Server(app);
/**
 * Говорим, что переменная 'io' в переменную 'server'
 * помещает возможность работы с веб-сокетами.
 * Теперь переменная 'server' знает, что такое сокеты.
 * Сокет теперь понимает, что есть какой-то сервер.
 * Переменная 'io' - теперь будет хранить информацию о сокетах, и информацию о сервере.
 */
const io = require('socket.io')(server, { cors: { origin: '*' } });

// Позволяем принимать JSON данные
app.use(express.json());

const rooms = new Map();

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ])
    );
  }
  res.send();
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', (data) => {
    console.log(data);
  });

  console.log('Connected', socket.id);
});

// Server start
const PORT = process.env.PORT || 9999;
server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log(`Server is running on ${PORT}`);
});
