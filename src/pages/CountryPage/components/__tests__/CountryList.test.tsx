import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockCountries } from '../../../../lib/mocks';
import { CountryDto } from '../../../../types';
import { CountryPageContext } from '../../context';
import { CountryList } from '../CountryList';

const mockSetDisplayedCountries = jest.fn();
const mockOnDrawerOpen = jest.fn();

const renderCountryList = (displayedCountries: CountryDto[] = [], filteredCountries: CountryDto[] = []) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <CountryPageContext.Provider
        value={{
          displayedCountries,
          setDisplayedCountries: mockSetDisplayedCountries,
          filteredCountries,
          setFilteredCountries: jest.fn(),
          setFavorite: jest.fn(),
          setNotes: jest.fn(),
        }}
      >
        <CountryList onDrawerOpen={mockOnDrawerOpen} />
      </CountryPageContext.Provider>
    </QueryClientProvider>
  );
};

describe('CountryList', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockCountries),
    });

    jest.clearAllMocks();
  });

  it('should display loading state initially', () => {
    renderCountryList();
    expect(screen.getByTestId('clip-loader')).toBeInTheDocument();
  });

  it('should render list of countries', async () => {
    renderCountryList(mockCountries.slice(0, 2), mockCountries);

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
  });

  it('should call onDrawerOpen when clicking a country', async () => {
    renderCountryList([mockCountries[0]], mockCountries);

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('United States'));
    expect(mockOnDrawerOpen).toHaveBeenCalledWith(mockCountries[0]);
  });

  it('should show favorite icon for favorite countries', async () => {
    const countriesWithFavorite = [{ ...mockCountries[0], isFavorite: true }];
    renderCountryList(countriesWithFavorite, mockCountries);

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('should show notes icon for countries with notes', async () => {
    const countriesWithNotes = [{ ...mockCountries[0], notes: 'Test note' }];
    renderCountryList(countriesWithNotes, mockCountries);

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    expect(screen.getByTestId('pen-icon')).toBeInTheDocument();
  });

  it('should show end message when all countries are displayed', async () => {
    renderCountryList(mockCountries, mockCountries);

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    expect(screen.getByText('You have seen all countries!')).toBeInTheDocument();
  });
});
