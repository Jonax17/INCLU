import { useState } from 'react';
import Landing from './components/Landing.jsx';
import AppDemo from './components/AppDemo.jsx';

export default function App() {
  const [page, setPage] = useState('landing');

  return (
    <>
      {page === 'landing' ? (
        <Landing onLaunchApp={() => setPage('app')} />
      ) : (
        <AppDemo onExit={() => setPage('landing')} />
      )}
    </>
  );
}
