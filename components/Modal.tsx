import { Pressable, View, StyleSheet, Modal as ModaRN } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function Modal({ children, modalVisible, setModalVisible }: any) {
  return (
    <ModaRN
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => (!modalVisible)}>
      <View style={styles.modalView}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(!modalVisible)}>
          <MaterialIcons
            name='close'
            size={20}
            color={Colors.light.icon}
          />
        </Pressable>

        {children}
      </View>
    </ModaRN>
  )
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    marginTop: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 4,
    borderColor: Colors.light.popUpBorder,
    backgroundColor: Colors.light.background
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: Colors.light.background,
    width: 40,
    height: 40,
    marginTop: 8,
    marginRight: 8,
    alignSelf: 'flex-end',
  }
});