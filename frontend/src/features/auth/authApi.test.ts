import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { authApi } from './authApi';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

describe('authApi', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('should perform login and store tokens in localStorage', async () => {
    const mockAuthResponse = {
      accessToken: 'test_access_token',
      refreshToken: 'test_refresh_token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        roles: ['ADMINISTRATOR' as const],
      },
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockAuthResponse });

    const result = await authApi.login({ username: 'admin', password: 'password' });

    expect(result.accessToken).toBe('test_access_token');
    expect(localStorage.getItem('access_token')).toBe('test_access_token');
    expect(localStorage.getItem('refresh_token')).toBe('test_refresh_token');
  });

  it('should refresh token using refresh_token in localStorage', async () => {
    localStorage.setItem('refresh_token', 'old_refresh_token');

    const mockAuthResponse = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        roles: ['ADMINISTRATOR' as const],
      },
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockAuthResponse });

    const result = await authApi.refreshToken();

    expect(result.accessToken).toBe('new_access_token');
    expect(localStorage.getItem('access_token')).toBe('new_access_token');
    expect(localStorage.getItem('refresh_token')).toBe('new_refresh_token');
  });

  it('should clear localStorage on logout', async () => {
    localStorage.setItem('access_token', 'token_to_remove');
    localStorage.setItem('refresh_token', 'refresh_to_remove');

    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    await authApi.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });
});
