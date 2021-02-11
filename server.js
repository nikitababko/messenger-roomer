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

app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
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
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    // Подлючение к сокету в определенную комнату
    socket.join(roomId);
    // Сохраняем это все в нашей "базе данных"
    rooms.get(roomId).get('users').set(socket.id, userName);
    // Получаем список всех пользователей
    const users = [...rooms.get(roomId).get('users').values()];
    /**
     * Говорим, что в определенную комнату,
     * всем кроме меня - нужно отправить сокет-запрос - 'ROOM:JOINED'
     * ROOM:JOINED - передает список всех пользователей
     */
    socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
    const obj = {
      userName,
      text,
    };
    rooms.get(roomId).get('messages').push(obj);
    socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).emit('ROOM:SET_USERS', users);
      }
    });
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
