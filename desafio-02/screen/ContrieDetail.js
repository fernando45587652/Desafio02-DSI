import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchWeatherByCity } from '../util/Api';
import { Dimensions } from 'react-native';

export default function CountryDetailScreen({ route }) {
  const { countryName, capital, latlng, flag } = route.params ?? {};
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setError(null);
        if (!capital) throw new Error('Este país no tiene capital definida.');
        const data = await fetchWeatherByCity(capital);
        if (isMounted) setWeather(data);
      } catch (e) {
        if (isMounted) setError(e.message ?? 'Error desconocido');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [capital]);

  const hasCoords =
    Array.isArray(latlng) &&
    latlng.length === 2 &&
    latlng.every((x) => typeof x === 'number');
  const region = hasCoords
    ? {
        latitude: latlng[0],
        longitude: latlng[1],
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }
    : { latitude: 0, longitude: 0, latitudeDelta: 60, longitudeDelta: 60 };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        {flag ? <Image source={{ uri: flag }} style={styles.flag} /> : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{countryName ?? '—'}</Text>
          <Text style={styles.sub}>Capital: {capital ?? '—'}</Text>
        </View>
      </View>

      <View style={{ height: screenHeight * 0.55, backgroundColor: 'grey', marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' }}>
  <MapView style={{ flex: 1 }} initialRegion={region}>
    {hasCoords && (
      <Marker
        coordinate={{ latitude: latlng[0], longitude: latlng[1] }}
        title={capital}
      />
    )}
  </MapView>
</View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clima actual</Text>
        {loading && (
          <View style={styles.centerRow}>
            <ActivityIndicator />
            <Text style={styles.msg}> Cargando el clima…</Text>
          </View>
        )}
        {!loading && error && (
          <Text style={[styles.msg, { color: '40E0D0' }]}>Error: {error}</Text>
        )}
        {!loading && !error && weather && (
          <View style={styles.card}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {weather.icon && (
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
                  }}
                  style={{ width: 64, height: 64 }}
                />
              )}
              <View>
                <Text style={styles.temp}>{weather.temp}°C</Text>
                <Text style={styles.desc}>{weather.desc}</Text>
              </View>
            </View>
            <View style={styles.metrics}>
              <Text style={styles.metric}>Humedad: {weather.humidity}%</Text>
              <Text style={styles.metric}>Viento: {weather.wind} m/s</Text>
            </View>
          </View>
        )}
        {!hasCoords && (
          <Text style={[styles.msg, { marginTop: 8 }]}>
            No hay coordenadas de la capital para mostrar en el mapa.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    backgroundColor: '00FFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  flag: { width: 56, height: 40, borderRadius: 6, backgroundColor: '006400' },
  title: { fontSize: 30, fontWeight: '700', color: '#111827' },
  sub: { fontSize: 14, color: '7FFF00', marginTop: 3 },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  centerRow: { flexDirection: 'row', alignItems: 'center' },
  msg: { fontSize: 14, color: '#374151' },
  card: {
    marginTop: 8,
    backgroundColor: 'lightyellow',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '32CD32',
  },
  temp: { fontSize: 28, fontWeight: '800', color: '#111827' },
  desc: { fontSize: 14, color: '#374151', textTransform: 'capitalize' },
  metrics: { flexDirection: 'row', gap: 16, marginTop: 8 },
  metric: { fontSize: 14, color: '00FA9A' },
});
