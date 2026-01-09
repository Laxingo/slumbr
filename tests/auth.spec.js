import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('auth store', () => {
  it('loginUser retorna user e guarda token quando credenciais são válidas', async () => {
    const store = useAuthStore()

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 'u1', email: 'a@a.com', userName: 'A', password: 'x' }]
    })

    const user = await store.loginUser('a@a.com', 'x')

    expect(user).not.toBeNull()
    expect(store.isAuthenticated).toBe(true)
    expect(store.userId).toBe('u1')
    expect(localStorage.getItem('accessToken')).toBeTruthy()
  })

  it('loginUser retorna null quando não existe utilizador', async () => {
    const store = useAuthStore()

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    })

    const user = await store.loginUser('x@x.com', 'bad')

    expect(user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
