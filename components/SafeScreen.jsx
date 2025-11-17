import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeScreen = ({ children, onLayout }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top }}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
};

export default SafeScreen;