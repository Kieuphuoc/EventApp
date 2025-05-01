import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS?.text || '#000',
    marginTop: 20,
  },
});
