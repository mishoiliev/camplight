/* eslint-disable no-unused-vars */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { mockCountries } from '../../../../lib/mocks';
import { CountryPageContext } from '../../context';
import { useCountries } from '../useCountries';

describe('useCountries', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element;
  const mockSetFilteredCountries = jest.fn();
  const mockSetDisplayedCountries = jest.fn();
  const mockSetFavorite = jest.fn();
  const mockSetNotes = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockCountries),
    });

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          staleTime: 0,
        },
      },
    });
    wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <CountryPageContext.Provider
          value={{
            displayedCountries: [],
            setDisplayedCountries: mockSetDisplayedCountries,
            filteredCountries: [],
            setFilteredCountries: mockSetFilteredCountries,
            setFavorite: mockSetFavorite,
            setNotes: mockSetNotes,
          }}
        >
          {children}
        </CountryPageContext.Provider>
      </QueryClientProvider>
    );
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('should fetch and return countries data', async () => {
    const { result } = renderHook(() => useCountries(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toEqual(mockCountries);
    expect(result.current.error).toBeFalsy();
  });

  it('should filter countries by search term', async () => {
    const { result } = renderHook(() => useCountries(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.filterCountries({ search: 'united' });
    });

    expect(mockSetFilteredCountries).toHaveBeenCalledWith([mockCountries[0]]);
  });

  it('should filter countries by region', async () => {
    const { result } = renderHook(() => useCountries(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.filterCountries({ region: 'Europe' });
    });

    expect(mockSetFilteredCountries).toHaveBeenCalledWith([mockCountries[1]]);
  });

  it('should return unique regions', async () => {
    const { result } = renderHook(() => useCountries(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.regions).toEqual(['Americas', 'Europe', 'Asia']);
    expect(result.current.error).toBeFalsy();
  });

  it('should handle empty search and region filters', async () => {
    const { result } = renderHook(() => useCountries(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.filterCountries({});
    });

    expect(mockSetFilteredCountries).toHaveBeenCalledWith(mockCountries);
  });
});
