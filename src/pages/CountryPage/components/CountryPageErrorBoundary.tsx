import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '../../../components/ui/button';

interface Props {
  children: ReactNode;
}

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  const handleRetry = () => {
    resetErrorBoundary();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h2>
        <p className="text-red-600 mb-6">
          {error?.message || 'An unexpected error occurred while loading the countries.'}
        </p>
        <Button onClick={handleRetry} variant="destructive">
          Try Again
        </Button>
      </div>
    </div>
  );
};

export const CountryPageErrorBoundary = ({ children }: Props) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('CountryPage Error:', error, info);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
