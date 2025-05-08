import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
    },
    containerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    containerForm: {
      backgroundColor: '#FFFFFF',
      flex: 4,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      padding: 20,
      elevation: 3,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#666666',
      marginBottom: 5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: '#B0C4DE',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      height: 40,
      fontSize: 16,
      color: '#333333',
    },
    inputError: {
      borderBottomColor: 'red',
    },
    iconButton: {
      padding: 10,
    },
    forgotPassword: {
      fontSize: 14,
      color: '#4A90E2',
      textAlign: 'right',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#00024A',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    
    buttonDisabled: {
      backgroundColor: '#B0C4DE',
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });