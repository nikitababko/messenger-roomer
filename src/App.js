import React, { useReducer } from 'react';

import reducer from 'reducer';
import JoinBlock from 'components/JoinBlock.jsx';

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    isAuth: false,
  });

  const onSignIn = () => {
    dispatch({
      type: 'IS_AUTH',
      payload: true,
    });
  };

  return (
    <div className="wrapper">
      {!state.isAuth ? <JoinBlock onSignIn={onSignIn} /> : <h1>Welcome</h1>}
    </div>
  );
};

export default App;
