import React from 'react';
import io from 'socket.io-client';

const App = () => {
  const connectSocket = () => {
    io('http://localhost:9999');
  };

  return (
    <div className="App">
      <button onClick={connectSocket}>CONNECT</button>
    </div>
  );
};

export default App;
