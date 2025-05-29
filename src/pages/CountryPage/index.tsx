import { lazy, useState } from 'react';
import { CountryDto } from '../../types';
import { CountryList } from './components/CountryList';
import { CountryPageErrorBoundary } from './components/CountryPageErrorBoundary';
import { FilterRow } from './components/FilterRow';
import { CountryPageProvider } from './context';

const LazyDetailsDrawer = lazy(() => import('./components/DetailsDrawer'));

const CountryPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryDto>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <CountryPageErrorBoundary>
      <CountryPageProvider>
        <div className="h-screen flex flex-col">
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Countries</h1>
            <FilterRow />
          </div>
          <div className="flex-1">
            <CountryList
              onDrawerOpen={(country) => {
                setSelectedCountry(country);
                setIsDrawerOpen(true);
              }}
            />
          </div>
          <LazyDetailsDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} country={selectedCountry} />
        </div>
      </CountryPageProvider>
    </CountryPageErrorBoundary>
  );
};

export default CountryPage;
