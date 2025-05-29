import { PenIcon, StarIcon } from 'lucide-react';
import React, { useCallback, useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from 'react-spinners';
import { CountryDto, CountryDtoExtended } from '../../../types';
import { CountryPageContext } from '../context';
import { useCountries } from '../hooks/useCountries';

const ITEMS_PER_PAGE = 20;

interface CountryListProps {
  // eslint-disable-next-line no-unused-vars
  onDrawerOpen: (country: CountryDto) => void;
}

export const CountryList: React.FC<CountryListProps> = ({ onDrawerOpen }) => {
  const { displayedCountries, setDisplayedCountries, filteredCountries } = useContext(CountryPageContext);

  const { isLoading, error } = useCountries();

  const loadMore = useCallback(() => {
    if (!filteredCountries) return;

    setTimeout(() => {
      const currentLength = displayedCountries.length;
      const nextBatch = filteredCountries.slice(currentLength, currentLength + ITEMS_PER_PAGE);

      if (nextBatch.length > 0) {
        setDisplayedCountries([...displayedCountries, ...nextBatch]);
      }
    }, 500);
  }, [filteredCountries, displayedCountries, setDisplayedCountries]);

  useEffect(() => {
    setDisplayedCountries(filteredCountries.slice(0, ITEMS_PER_PAGE));
  }, [filteredCountries]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <ClipLoader data-testid="clip-loader" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div>Error loading countries: {(error as Error).message}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  const hasMore = filteredCountries ? displayedCountries.length < filteredCountries.length : false;

  return (
    <div id="scrollableDiv" className="overflow-y-auto p-4 h-full">
      <InfiniteScroll
        className="flex flex-col items-center justify-center gap-2"
        dataLength={displayedCountries.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex items-center justify-center">
            <ClipLoader data-testid="clip-loader" />
          </div>
        }
        scrollableTarget="scrollableDiv"
        endMessage={
          <p style={{ textAlign: 'center', margin: '20px 0' }}>
            <b>You have seen all countries!</b>
          </p>
        }
      >
        {displayedCountries.map((country, index) => (
          <div
            className="p-4 bg-gray-200 rounded-md w-full cursor-pointer flex items-center 
            justify-between bg-primary/10 hover:bg-primary/20 transition-all duration-300"
            key={`${country.name?.common}-${index}`}
            onClick={() => onDrawerOpen(country)}
          >
            <h3 className="transition-all duration-300 w-full h-full hover:translate-x-1">{country.name?.common}</h3>
            <div className="flex items-center gap-2">
              {(country as CountryDtoExtended).notes && <PenIcon data-testid="pen-icon" />}
              {(country as CountryDtoExtended).isFavorite && <StarIcon data-testid="star-icon" fill="#FFD700" />}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default CountryList;
