import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';

import HelloWorld from 'components/HelloWorld';
import RtkTesting from 'components/RtkTesting';
import FetchTesting from 'components/FetchTesting';
import store from 'middleware/reduxStore';
import { createServer } from 'miragejs';

console.log(`node env is "${process.env.NODE_ENV}"`);

if (process.env.NODE_ENV === "development") {
  let server = createServer();
  server.get("/api/user/v1/me", {foo:"bar"});
}

ReactDOM.render(
  <Provider store={store}>
    <StrictMode>
      <HelloWorld />
      <FetchTesting />
      <RtkTesting />
    </StrictMode>
  </Provider>,
  document.getElementById('application')
);
