import React from 'react';
import ResultSearch from '../../components/ResultSearch';
import SearchBar from '../../components/SearchBar';
import './Home.scss';

function Home() {
  return (
    <div className="home">
      <div className="__content">
        <SearchBar />
        <ResultSearch />
      </div>
    </div>
  );
}

export default Home;
