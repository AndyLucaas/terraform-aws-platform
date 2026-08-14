import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { initKeycloak, scheduleTokenRefresh } from './features/auth/keycloak';
import './styles/index.css';

// async function bootstrap() {
//   await initKeycloak();
//   scheduleTokenRefresh();

//   createRoot(document.getElementById('root')!).render(
//     <StrictMode>
//       <App />
//     </StrictMode>,
//   );
// }

// bootstrap();
