import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, RefreshControl, StyleSheet,} from 'react-native';
import CountrieItem from '../components/CountrieItem';
import { fetchCountries } from '../util/Api';

export default function CountrieList({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchCountries();
      setCountries(data);
    } catch (e) {
      setError(e.message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (e) {
      setError(e.message ?? 'Error al recargar');
    } finally {
      setRefreshing(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.msg}>Cargando los paises…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.msg, { color: '00FF00' }]}>Error: {error}</Text>
        <Text style={styles.link} onPress={load}> Reintentando</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={countries}
      keyExtractor={(item, idx) =>
        item?.cca2 ? `${item.cca2}-${idx}` : `c-${idx}`
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <CountrieItem
          country={item}
          onPress={() => {
            navigation.navigate('CountryDetail', {
              title: item?.name?.common ?? 'País',
              countryName: item?.name?.common,
              capital: item?.capital?.[0] ?? null,
              latlng: item?.capitalInfo?.latlng ?? null,
              flag: item?.flags?.png ?? item?.flags?.svg ?? null,
            });
          }}
        />
      )}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: '00BFFF' }} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  msg: { marginTop: 12, fontSize: 16, color: '8FBC8B' },
  link: {
    marginTop: 8,
    fontSize: 16,
    color: '00FF7F',
    textDecorationLine: 'underline',
  },
});
