# Location Search Functionality

This document describes the worldwide city and street search functionality implemented in the real estate reviews application.

## Overview

The application now includes comprehensive worldwide location search capabilities using the OpenStreetMap Nominatim API. Users can search for cities and streets from around the world with autocomplete functionality.

## Features

### City Search
- Search for cities, towns, and villages worldwide
- Autocomplete with city name, state/province, and country
- Cached results for better performance
- Debounced search to reduce API calls

### Street Search
- Search for streets within a selected city
- Contextual search (requires city selection first)
- Street name with city, state, and country information
- Filtered results to show only streets and roads

## Components

### LocationSearch Component
Located at `frontend/components/location-search.tsx`

**Props:**
- `type`: "city" | "street" - Type of location to search
- `value`: string - Current selected value
- `onValueChange`: (value: string) => void - Callback when value changes
- `cityValue`: string - Selected city (required for street search)
- `placeholder`: string - Custom placeholder text
- `label`: string - Label for the input
- `className`: string - Additional CSS classes

**Usage:**
```tsx
<LocationSearch
  type="city"
  value={selectedCity}
  onValueChange={setSelectedCity}
  label="Город"
/>

<LocationSearch
  type="street"
  value={selectedStreet}
  onValueChange={setSelectedStreet}
  cityValue={selectedCity}
  label="Улица"
/>
```

### Autocomplete Component
Located at `frontend/components/ui/autocomplete.tsx`

A reusable autocomplete component with search functionality and dropdown selection.

## API

### Geocoding Service
Located at `frontend/lib/geocoding.ts`

**Methods:**
- `searchCities(query: string, limit?: number)`: Search for cities
- `searchStreets(query: string, city?: string, limit?: number)`: Search for streets
- `reverseGeocode(lat: string, lon: string)`: Get location from coordinates

### API Route
Located at `frontend/app/api/geocoding/route.ts`

Handles geocoding requests and proxies them to the Nominatim API with proper error handling and CORS support.

**Query Parameters:**
- `q`: Search query
- `type`: "city" or "street"
- `city`: City name (for street search)
- `limit`: Maximum number of results (default: 10)

## Implementation Details

### Caching
- Client-side caching using Map for better performance
- Cache keys include query and parameters
- Automatic cache invalidation

### Debouncing
- 300ms debounce delay to prevent excessive API calls
- Implemented using custom `useDebounce` hook

### Error Handling
- Graceful fallback for API failures
- User-friendly error messages
- Console logging for debugging

### Rate Limiting
- Respects Nominatim API usage policy
- Proper User-Agent header
- Caching reduces API calls

## Data Sources

The application uses the OpenStreetMap Nominatim API:
- **Base URL**: https://nominatim.openstreetmap.org
- **License**: Open Data Commons Open Database License
- **Usage Policy**: https://operations.osmfoundation.org/policies/nominatim/

## Usage Examples

### Property Search Page
The property search page (`frontend/app/property/page.tsx`) uses location search for:
- City selection with worldwide search
- Street selection within the chosen city
- Automatic street clearing when city changes

### Add Property Review Page
The add property review page (`frontend/app/property/add/page.tsx`) uses location search for:
- City selection when adding new reviews
- Street selection for the property location
- Form validation and data consistency

## Future Enhancements

Potential improvements for the location search functionality:

1. **Geolocation**: Add "Use my location" feature
2. **Recent Searches**: Cache recent searches for quick access
3. **Favorites**: Allow users to save favorite locations
4. **Map Integration**: Show locations on an interactive map
5. **Advanced Filters**: Filter by country, region, or other criteria
6. **Offline Support**: Cache popular locations for offline use

## Technical Notes

- The implementation uses TypeScript for type safety
- All components are built with React and follow the application's design system
- The geocoding service is designed to be easily replaceable with other providers
- Caching strategy can be adjusted based on usage patterns
- API rate limiting should be monitored in production 