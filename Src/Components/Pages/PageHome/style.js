import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#010222',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  avatarContainer: {
    borderRadius: 26,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 26,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  username: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 15,
    flex: 1,
  },
  bellIcon: {
    marginLeft: 'auto',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#f4f4f4',
    height: 62,
    width: '80%',
    borderRadius: 6,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
    borderRadius: 6,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 20,
    color: '#000',
  },
  centeredScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeText: {
    fontSize: 20,
    color: '#333',
  },
}); 