import { useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useMemo } from 'react';
import { CountryDto } from '../../../types';
import { CountryPageContext } from '../context';

const API_ENDPOINT = 'https://restcountries.com/v3.1/all';

export const useCountries = () => {
  const { setFilteredCountries } = useContext(CountryPageContext);

  const {
    data: allCountries,
    isLoading,
    error,
  } = useQuery<CountryDto[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      const data = await fetch(API_ENDPOINT);
      return data.json();
    },
  });

  const filterCountries = useCallback(
    ({ search, region }: { search?: string; region?: string }) =>
      setFilteredCountries(
        allCountries?.filter((country) => {
          return (
            country.name?.common?.toLowerCase().includes(search?.toLowerCase() ?? '') &&
            country.region?.toLowerCase().includes(region?.toLowerCase() ?? '')
          );
        }) ?? []
      ),
    [allCountries, setFilteredCountries]
  );

  const regions = useMemo(() => {
    return Array.from(new Set(allCountries?.map((country: CountryDto) => country.region).filter(Boolean) ?? []));
  }, [allCountries]);

  return { data: allCountries, isLoading, error, filterCountries, regions };
};
