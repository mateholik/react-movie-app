import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <main className='overflow-x-hidden'>
      <div className='pattern' />
      <div className='wrapper'>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/movie/:id' element={<MovieDetail />} />
        </Routes>
      </div>
    </main>
  );
};

export default App;
