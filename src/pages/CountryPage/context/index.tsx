/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useState } from 'react';
import { CountryDto, CountryDtoExtended } from '../../../types';

export const CountryPageContext = createContext({
  displayedCountries: [] as CountryDto[],
  setDisplayedCountries: (countries: CountryDto[]) => {},
  filteredCountries: [] as CountryDto[],
  setFilteredCountries: (countries: CountryDto[]) => {},
  setFavorite: (country: CountryDto) => {},
  setNotes: (country: CountryDto, notes: string) => {},
});

export const CountryPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [displayedCountries, setDisplayedCountries] = useState<CountryDto[]>([]);

  const [filteredCountries, setFilteredCountries] = useState<CountryDto[]>([]);

  const setFavorite = (country: CountryDto) => {
    Object.assign(country, {
      isFavorite: !(country as CountryDtoExtended).isFavorite,
    });
  };

  const setNotes = (country: CountryDto, notes: string) => {
    Object.assign(country, {
      notes,
    });
  };

  return (
    <CountryPageContext.Provider
      value={{
        displayedCountries,
        setDisplayedCountries,
        filteredCountries,
        setFilteredCountries,
        setFavorite,
        setNotes,
      }}
    >
      {children}
    </CountryPageContext.Provider>
  );
};
