import { renderHook, act } from '@testing-library/react-native';

import { useUsersList, User } from '@/hooks/useUsersList';

// Mock fetch globally
global.fetch = jest.fn();

describe('useUsersList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ users: [] }),
    });
  });

  test('returns correct hook structure and functions', () => {
    const { result } = renderHook(() => useUsersList());

    // Test that all expected properties exist
    expect(result.current.data).toBeDefined();
    expect(result.current.count).toBeDefined();
    expect(result.current.loading).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.searchText).toBeDefined();
    expect(result.current.retryCount).toBeDefined();
    expect(result.current.canRetry).toBeDefined();
    expect(result.current.isSearching).toBeDefined();
    
    // Test that all functions exist
    expect(typeof result.current.setSearchText).toBe('function');
    expect(typeof result.current.keyExtractor).toBe('function');
    expect(typeof result.current.getItemLayout).toBe('function');
    expect(typeof result.current.onRefresh).toBe('function');
    expect(typeof result.current.onRetry).toBe('function');
  });

  test('keyExtractor returns correct user ID as string', () => {
    const { result } = renderHook(() => useUsersList());
    
    const mockUser: User = {
      id: 123,
      firstName: 'John',
      lastName: 'Doe',
      image: 'https://example.com/image.jpg'
    };

    const key = result.current.keyExtractor(mockUser);
    expect(key).toBe('123');
    expect(typeof key).toBe('string');
  });

  test('getItemLayout returns correct layout object', () => {
    const { result } = renderHook(() => useUsersList());
    
    const layout = result.current.getItemLayout(null, 0);
    
    expect(layout).toHaveProperty('length');
    expect(layout).toHaveProperty('offset');
    expect(layout).toHaveProperty('index');
    expect(typeof layout.length).toBe('number');
    expect(typeof layout.offset).toBe('number');
    expect(typeof layout.index).toBe('number');
    expect(layout.index).toBe(0);
  });
});
