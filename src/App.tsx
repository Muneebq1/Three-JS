import './App.css';

import { Route, Routes } from 'react-router-dom';

import NotificationBell from './components/NotificationBell';
import SignIn from './pages/Auth/SignIn';

function App() {
  return (
    <>
      <div className='fixed top-4 right-4 z-50'>
        <NotificationBell />
      </div>
      <Routes>
        <Route path='/' element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
