import { CountryDto } from '../types';

export const mockCountries = [
  {
    name: { common: 'United States' },
    region: 'Americas',
    population: 331002651,
    capital: ['Washington, D.C.'],
  },
  {
    name: { common: 'France' },
    region: 'Europe',
    population: 67391582,
    capital: ['Paris'],
  },
  {
    name: { common: 'Japan' },
    region: 'Asia',
    population: 125836021,
    capital: ['Tokyo'],
  },
] as CountryDto[];
