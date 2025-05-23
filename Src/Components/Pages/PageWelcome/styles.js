import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    containerLogo: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: '5%',
      borderRadius: 30,
    },
    logo: {
      width: '80%',
      maxHeight: 220,
    },
    containerForm: {
      flex: 1.4,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      paddingHorizontal: '5%',
      paddingVertical: '5%',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 23,
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: 15,
    },
    textContainer: {
      flexDirection: 'row',
      marginBottom: 40,
    },
    text: {
      color: '#444444',
      fontSize: 16,
    },
    textHighlight: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#4A90E2',
    },
    button: {
      backgroundColor: '#00024A',
      borderRadius: 25,
      paddingHorizontal: 40,
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
      width: 200,
      alignItems: 'center',
      height: 45,
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold', 
    },
  });