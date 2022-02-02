import { ActivityIndicator, View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function Loader() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size='large' color={Colors.light.borderColor} />
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    padding: 100
  },
});