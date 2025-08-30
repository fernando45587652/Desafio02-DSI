import React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';

export default function CountriesItem({ country, onPress }) {
  const name = country?.name?.common ?? '—';
  const flag = country?.flags?.png ?? country?.flags?.svg;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.6 }]}>
      <Image source={{ uri: flag }} style={styles.flag} resizeMode="cover" />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>
          {country?.capital?.[0] ? `Capital: ${country.capital[0]}` : 'Sin capital'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: 'aqua',
    shadowColor: 'ADFF2F',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  flag: {
    width: 64,
    height: 44,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: 'FF0000',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: 'FF4500',
  },
  sub: {
    fontSize: 13,
    color: '7CFC00',
    marginTop: 2,
  },
});