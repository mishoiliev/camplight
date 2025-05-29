import { StarIcon } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../../components/ui/drawer';
import { Input } from '../../../components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { CountryDto, CountryDtoExtended } from '../../../types';
import { CountryPageContext } from '../context';

interface DetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  country?: CountryDto;
}

const DetailsDrawer = ({ open, onClose, country }: DetailsDrawerProps) => {
  const { setFavorite, setNotes } = useContext(CountryPageContext);
  const [isFavorite, setIsFavorite] = useState((country as CountryDtoExtended)?.isFavorite);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    setIsFavorite((country as CountryDtoExtended)?.isFavorite);
  }, [country]);

  if (!country) return null;

  return (
    <Drawer open={open} onClose={onClose} direction="right">
      <DrawerContent className="overflow-scroll">
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{country.name?.common}</h1>
              <img src={country.flags?.png} alt={country.name?.common} width={48} height={48} />
            </div>
            <Popover open={popoverOpen}>
              <PopoverTrigger asChild onClick={() => (isFavorite ? setPopoverOpen(false) : setPopoverOpen(true))}>
                <Button
                  className="hover:bg-transparent"
                  variant="ghost"
                  onClick={() => {
                    const button = document.activeElement as HTMLButtonElement;
                    button.animate(
                      [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
                      {
                        duration: 300,
                        easing: 'ease-in-out',
                      }
                    );

                    setIsFavorite(!isFavorite);
                    setFavorite(country);
                  }}
                >
                  <StarIcon fill={isFavorite ? '#FFD700' : 'none'} />
                </Button>
              </PopoverTrigger>
              <PopoverContent onCloseAutoFocus={() => setPopoverOpen(false)}>
                <form
                  className="flex flex-col gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNotes(country, (e.target as HTMLFormElement).notes.value);
                    setPopoverOpen(false);
                  }}
                >
                  <Input placeholder="Add notes" name="notes" />
                  <Button type="submit">Save</Button>
                </form>
              </PopoverContent>
            </Popover>
          </DrawerTitle>
          <DrawerDescription className="flex flex-col gap-2">
            {country.name?.common} is a country in {country.region}. It has a population of{' '}
            {country.population?.toLocaleString()} and a capital of {country.capital?.[0]}.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-6">
          {(country as CountryDtoExtended)?.notes && (
            <h2 className="text-lg font-semibold">Notes: {(country as CountryDtoExtended)?.notes}</h2>
          )}

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Official Name</h3>
            <p className="text-gray-700">{country.name?.official}</p>
          </div>

          {country.capital?.[0] && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Capital</h3>
              <div className="space-y-1">
                <p className="text-gray-700">{country.capital?.[0]}</p>
              </div>
            </div>
          )}

          {country.currencies && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Currencies</h3>
              <div className="space-y-1">
                {Object.entries(country.currencies).map(([code, currency]) => (
                  <p key={code} className="text-gray-700">
                    {currency.name} <span className="text-gray-500">({currency.symbol})</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {country.languages && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Languages</h3>
              <p className="text-gray-700">{Object.values(country.languages).join(', ')}</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Area: {country.area?.toLocaleString()} km²
              </li>
              {country.timezones && (
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Timezones: {country.timezones.join(', ')}
                </li>
              )}
              {country.continents && (
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Continents: {country.continents.join(', ')}
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                UN Member: {country.unMember ? 'Yes' : 'No'}
              </li>
            </ul>
          </div>

          {country.maps && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Maps</h3>
              <div className="space-y-2">
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  View on Google Maps
                </a>
                <a
                  href={country.maps.openStreetMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  View on OpenStreetMap
                </a>
              </div>
            </div>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DetailsDrawer;
