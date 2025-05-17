# System Health Dashboard

A React-based admin dashboard for monitoring system health across multiple machines.

## Features

- Real-time system health monitoring
- Machine status overview
- Detailed machine information
- Historical data tracking
- Modern, responsive UI
- Dark mode support

## Requirements

- Node.js 14 or higher
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Usage

Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at http://localhost:3000.

## Building for Production

Create a production build:
```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Configuration

The application can be configured by modifying the following:
- API endpoint: Update `API_BASE_URL` in `src/api/api.ts`
- Refresh interval: Update the interval in `App.tsx`
- Theme: Modify the theme configuration in `App.tsx`

## Development

The project uses:
- React 18
- TypeScript
- Material-UI
- Axios for API communication

## Project Structure

```
src/
  ├── api/          # API client
  ├── components/   # React components
  ├── types/        # TypeScript types
  ├── App.tsx       # Main application component
  └── index.tsx     # Application entry point
``` 