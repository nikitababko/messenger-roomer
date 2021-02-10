import React, { useState } from 'react';

import axios from 'axios';

import socket from 'socket';

const JoinBlock = ({ onSignIn }) => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onEnter = async () => {
    if (!roomId || !userName) {
      return alert('Wrong data!');
    }
    setIsLoading(true);
    await axios
      .post('/rooms', {
        roomId,
        userName,
      })
      .then(onSignIn);
  };

  return (
    <div className="join-block">
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button disabled={isLoading} onClick={onEnter} className="btn btn-success">
        {isLoading ? 'Loading...' : 'Enter'}
      </button>
    </div>
  );
};

export default JoinBlock;
