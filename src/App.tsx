import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CountryPage from './pages/CountryPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App h-screen">
        <CountryPage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
