import { render } from '@testing-library/react-native';

import { ThemedView } from '@/components/ThemedView';

describe('<ThemedView />', () => {
  test('renders view correctly', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view">
        <ThemedView>Test Content</ThemedView>
      </ThemedView>
    );
    
    expect(getByTestId('themed-view')).toBeTruthy();
  });

  test('renders with children', () => {
    const { getByTestId } = render(
      <ThemedView testID="parent-view">
        <ThemedView testID="child-view">Child Content</ThemedView>
      </ThemedView>
    );
    
    expect(getByTestId('parent-view')).toBeTruthy();
    expect(getByTestId('child-view')).toBeTruthy();
  });

  test('renders with custom colors', () => {
    const { getByTestId } = render(
      <ThemedView 
        testID="custom-colored-view"
        lightColor="#FFFFFF" 
        darkColor="#000000"
      >
        Custom Color View
      </ThemedView>
    );
    
    expect(getByTestId('custom-colored-view')).toBeTruthy();
  });
});
