import React, { useEffect, useReducer } from 'react';

import axios from 'axios';

import socket from 'socket';
import reducer from 'reducer';
import JoinBlock from 'components/JoinBlock.jsx';
import Chat from 'components/Chat.jsx';

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onSignIn = async (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
    const { data } = await axios.get(`/rooms/${obj.roomId}`);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const onAddMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  };

  useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', onAddMessage);
  }, []);

  return (
    <div className="wrapper">
      {!state.joined ? (
        <JoinBlock onSignIn={onSignIn} />
      ) : (
        <Chat {...state} onAddMessage={onAddMessage} />
      )}
    </div>
  );
};

export default App;
