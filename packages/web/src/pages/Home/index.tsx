import React from 'react';
import SearchBar from './components/SearchBar';
import './Home.scss';

function Home() {
  return (
    <div className="home">
      <div className="__content">
        <SearchBar />
      </div>
    </div>
  );
}

export default Home;
