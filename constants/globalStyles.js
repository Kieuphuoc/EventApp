import { StyleSheet } from 'react-native';
import COLORS from './colors';

const globalStyles = StyleSheet.create({
  placeholder: {
    fontSize: 16,
    color: COLORS.primaryDark,
    opacity: 0.6,
  },
  mb:{
    marginBottom:10,
  },
  container: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-around',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.accentLight,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    borderRadius: 25,
    justifyContent: 'center',
    shadowColor: COLORS.secondaryDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
    backgroundColor: COLORS.accentLight,
    padding: 12,
    borderRadius: 12,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: COLORS.primaryDark,
  },
  box: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
})
export default globalStyles;
