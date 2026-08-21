import { NextResponse } from 'next/server';

// --- Module-level cache (survives between requests in the same server process) ---
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface WeatherCache {
  data: {
    success: boolean;
    clima: string;
    tempC: number;
    tempF: number;
    description: string;
    humidity: number;
    windSpeed: number;
    location: string;
  } | null;
  timestamp: number;
}

let weatherCache: WeatherCache = {
  data: null,
  timestamp: 0,
};

// --- Spanish weather description mapping ---
const WEATHER_DESCRIPTIONS: Record<string, string> = {
  'Sunny': 'Soleado',
  'Clear': 'Despejado',
  'Partly cloudy': 'Parcialmente nublado',
  'Cloudy': 'Nublado',
  'Overcast': 'Cubierto',
  'Mist': 'Neblina',
  'Fog': 'Niebla',
  'Light rain': 'Lluvia ligera',
  'Light rain shower': 'Lluvia ligera',
  'Patchy rain possible': 'Posible lluvia dispersa',
  'Moderate rain': 'Lluvia moderada',
  'Moderate rain at times': 'Lluvia moderada intermitente',
  'Heavy rain': 'Lluvia fuerte',
  'Heavy rain at times': 'Lluvia fuerte intermitente',
  'Light drizzle': 'Llovizna ligera',
  'Light freezing rain': 'Lluvia helada ligera',
  'Patchy light drizzle': 'Llovizna dispersa',
  'Patchy light rain': 'Lluvia ligera dispersa',
  'Light rain with thunder': 'Lluvia con truenos',
  'Moderate or heavy rain shower': 'Aguacero moderado a fuerte',
  'Torrential rain shower': 'Aguacero torrencial',
  'Patchy light rain with thunder': 'Lluvia dispersa con truenos',
  'Thunderstorm': 'Tormenta eléctrica',
  'Blizzard': 'Ventisca',
  'Light snow': 'Nieve ligera',
  'Moderate snow': 'Nieve moderada',
  'Heavy snow': 'Nieve fuerte',
  'Patchy snow possible': 'Posible nevada dispersa',
  'Light showers of ice': 'Chubascos de hielo ligeros',
};

function getSpanishDescription(weatherDesc: string): string {
  // Try exact match first
  if (WEATHER_DESCRIPTIONS[weatherDesc]) {
    return WEATHER_DESCRIPTIONS[weatherDesc];
  }

  // Try partial / fuzzy match
  const lowerDesc = weatherDesc.toLowerCase();
  for (const [key, value] of Object.entries(WEATHER_DESCRIPTIONS)) {
    if (lowerDesc.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerDesc)) {
      return value;
    }
  }

  // Fallback: return original with Spanish prefix
  return weatherDesc;
}

function mapClima(tempC: number): string {
  if (tempC < 18) return 'frio';
  if (tempC > 26) return 'calor';
  return 'templado';
}

async function fetchWeatherFromWttr() {
  const url = 'https://wttr.in/San+Jose+Costa+Rica?format=j1';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'StyleVault/1.0' },
    next: { revalidate: 0 }, // we handle caching ourselves
  });

  if (!res.ok) {
    throw new Error(`wttr.in returned status ${res.status}`);
  }

  const data = await res.json();

  // wttr.in j1 format structure:
  // data.current_condition[0] contains current weather
  const current = data.current_condition?.[0];
  if (!current) {
    throw new Error('No current condition data in wttr.in response');
  }

  const tempC = parseInt(current.temp_C, 10);
  const tempF = parseInt(current.temp_F, 10);
  const humidity = parseInt(current.humidity, 10);
  const windSpeed = parseInt(current.windspeedKmph, 10);
  const weatherDesc = current.weatherDesc?.[0]?.value ?? 'Desconocido';
  const area = data.nearest_area?.[0];
  const location = area?.areaName?.[0]?.value ?? 'San José, Costa Rica';

  return {
    success: true,
    clima: mapClima(tempC),
    tempC,
    tempF,
    description: getSpanishDescription(weatherDesc),
    humidity,
    windSpeed,
    location,
  };
}

export async function GET() {
  try {
    // Serve from cache if still fresh
    const now = Date.now();
    if (weatherCache.data && (now - weatherCache.timestamp) < CACHE_TTL_MS) {
      return NextResponse.json(weatherCache.data);
    }

    // Fetch fresh data
    const result = await fetchWeatherFromWttr();

    // Update cache
    weatherCache = { data: result, timestamp: now };

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';

    console.error('[Weather API Error]', message);

    // If we have stale cache, serve it as a fallback
    if (weatherCache.data) {
      return NextResponse.json({
        ...weatherCache.data,
        _stale: true,
        _error: message,
      });
    }

    // No cache available – return error response with safe defaults
    return NextResponse.json(
      {
        success: false,
        clima: 'templado',
        tempC: 0,
        tempF: 0,
        description: 'No disponible',
        humidity: 0,
        windSpeed: 0,
        location: 'San José, Costa Rica',
        error: message,
      },
      { status: 503 },
    );
  }
}
