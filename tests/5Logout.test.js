import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store - logout', () => {
  let authStore

  beforeEach(() => {
    // mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    })

    setActivePinia(createPinia())
    authStore = useAuthStore()

    // fake logged-in state
    authStore.user = { id: 'u1', email: 'test@example.com' }
    authStore.accessToken = 'fake-token'
  })

  it('clears user and removes token on logout', () => {
    authStore.logout()

    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken')
    expect(authStore.user).toBeNull()
    expect(authStore.accessToken).toBeNull()
  })
})
