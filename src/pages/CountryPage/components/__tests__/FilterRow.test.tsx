import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useCountries } from '../../hooks/useCountries';
import { FilterRow } from '../FilterRow';

jest.mock('../../hooks/useCountries');

const mockFilterCountries = jest.fn();
const mockRegions = ['Americas', 'Europe', 'Asia'];

const renderFilterRow = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <FilterRow />
    </QueryClientProvider>
  );
};

describe('FilterRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCountries as jest.Mock).mockReturnValue({
      regions: mockRegions,
      filterCountries: mockFilterCountries,
    });
  });

  it('should render search input and region filter', async () => {
    renderFilterRow();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    expect(screen.getByText(/Filter by region:/)).toBeInTheDocument();
  });

  it('should update search and call filterCountries', async () => {
    renderFilterRow();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'united' } });

    await waitFor(() => {
      expect(mockFilterCountries).toHaveBeenCalledWith({
        search: 'united',
        region: '',
      });
    });
  });

  it('should clear filters when clicking clear button', async () => {
    renderFilterRow();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'united' } });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockFilterCountries).toHaveBeenCalledWith({
        search: '',
        region: '',
      });
    });

    expect(searchInput).toHaveValue('');
  });
});
