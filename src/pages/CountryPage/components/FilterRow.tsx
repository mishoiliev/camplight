import { FilterIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/input';
import { useCountries } from '../hooks/useCountries';

export const FilterRow = () => {
  const { regions, filterCountries } = useCountries();

  const [region, setRegion] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      filterCountries({ search, region });
    }, 200);

    return () => clearTimeout(timeout);
  }, [search, region, filterCountries]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <DropdownMenu>
          <Button className="border-2" asChild>
            <DropdownMenuTrigger>
              <FilterIcon />
              Filter by region: {region ?? 'All'}
            </DropdownMenuTrigger>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setRegion('');
              setSearch('');
            }}
          >
            Clear
          </Button>
          <DropdownMenuContent>
            {regions?.map((region, index) => (
              <DropdownMenuItem
                key={region ?? index}
                onClick={() => {
                  setRegion(region ?? '');
                }}
              >
                {region}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
