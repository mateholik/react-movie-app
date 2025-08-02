import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';

const App = () => {
  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/movie/:id' element={<MovieDetail />} />
        </Routes>
      </div>
    </main>
  );
};

export default App;
