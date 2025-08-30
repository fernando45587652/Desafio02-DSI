const REST_COUNTRIES_URL =
  'https://restcountries.com/v3.1/all?fields=name,flags,capital,capitalInfo,cca2';

const OPEN_WEATHER_API_KEY = 'b0c8d4e8078bc31c4bee303b2727c809';

export async function fetchCountries() {
  const res = await fetch(REST_COUNTRIES_URL);
  if (!res.ok) throw new Error('No se pudo obtener la lista de los paises que buscas');
  const data = await res.json();
  const safe = (data || [])
    .filter((c) => c?.name?.common && c?.flags?.png)
    .sort((a, b) => a.name.common.localeCompare(b.name.common));
  return safe;
}

export async function fetchWeatherByCity(city) {
  if (!city || !OPEN_WEATHER_API_KEY)
    throw new Error('Ciudad o API key inválida');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=es`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo obtener el clima del pais buscado');
  const json = await res.json();
  if (!json?.main || !json?.weather || !json?.wind) {
    throw new Error('La respuesta del clima está incompleta o no disponible.');
  }
  return {
    temp: Math.round(json.main.temp),
    desc: json.weather?.[0]?.description ?? '—',
    humidity: json.main.humidity,
    wind: json.wind.speed,
    icon: json.weather?.[0]?.icon ?? null,
  };
}