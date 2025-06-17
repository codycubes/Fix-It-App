# Google Maps Location Tracker Setup

## Prerequisites

1. **Google Maps API Key**: You need a Google Maps API key with the following APIs enabled:
   - Maps JavaScript API
   - Places API (optional, for enhanced features)

## Getting Your Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API:
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

## Setting Up the Environment

1. Create a `.env` file in the root directory of your project:
   ```bash
   touch .env
   ```

2. Add your Google Maps API key to the `.env` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Replace `your_actual_api_key_here` with your actual Google Maps API key

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Features

- **Interactive Map**: Displays all locations from your `locations.json` file
- **Custom Markers**: Each marker uses the status color from your data
- **Information Panel**: Shows detailed information about each location
- **Click Interactions**: Click on markers or location cards to view details
- **Responsive Design**: Works on both desktop and mobile devices

## Location Data Structure

The application expects your `locations.json` file to have the following structure:

```json
[
  {
    "id": 1,
    "name": "Location Name",
    "address": "Full Address",
    "latitude": -26.1067,
    "longitude": 28.0568,
    "status": "in progress",
    "statusColor": "#FFA500"
  }
]
```

## Troubleshooting

- **Map not loading**: Check that your API key is correct and the Maps JavaScript API is enabled
- **Markers not appearing**: Verify that your `locations.json` file has valid latitude and longitude values
- **Console errors**: Check the browser console for any JavaScript errors

## Security Note

Never commit your `.env` file with your actual API key to version control. The `.env` file should be added to your `.gitignore` file. 