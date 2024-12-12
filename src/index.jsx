import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './assets/styles/index.scss';
import store from './store/configureStore';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
        <Provider store={store}>
            <App />
        </Provider>
);
