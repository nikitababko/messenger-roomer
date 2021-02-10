import React, { useReducer } from 'react';

import socket from 'socket';

import reducer from 'reducer';
import JoinBlock from 'components/JoinBlock.jsx';

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
  });

  const onSignIn = (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
  };

  console.log(state);

  return (
    <div className="wrapper">
      {!state.joined ? <JoinBlock onSignIn={onSignIn} /> : <h1>Welcome</h1>}
    </div>
  );
};

export default App;
