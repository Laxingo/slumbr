import { describe, it, expect, vi } from 'vitest'

describe('removing sleep data', () => {
  it('removes sleep data successfully', async () => {
    const sleepData = [
      { id: 's1', hours: 86400000, date: 1769385600000 },
      { id: 's2', hours: 86400000, date: 1769385800000 },
    ]

    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
      })
    ))

    let error = ''
    let loading = true

    try {
      const res = await fetch('http://127.0.0.1:3000/sleepData/s1', {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error()

      // simula a remoção local
      const index = sleepData.findIndex(s => s.id === 's1')
      if (index !== -1) sleepData.splice(index, 1)

    } catch (e) {
      error = 'Failed to delete. Try again.'
    } finally {
      loading = false
    }

    expect(sleepData).toHaveLength(1)
    expect(sleepData[0].id).toBe('s2')
    expect(error).toBe('')
    expect(loading).toBe(false)
  })

  it('handles delete failure', async () => {
    const sleepData = [
      { id: 's1', hours: 86400000, date: 1769385800000 },
    ]

    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.reject(new Error('Network error'))
    ))

    let error = ''
    let loading = true

    try {
      const res = await fetch('http://127.0.0.1:3000/sleepData/s1', {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error()

      const index = sleepData.findIndex(s => s.id === 's1')
      if (index !== -1) sleepData.splice(index, 1)

    } catch (e) {
      error = 'Failed to delete. Try again.'
    } finally {
      loading = false
    }

    expect(sleepData).toHaveLength(1)
    expect(error).toBe('Failed to delete. Try again.')
    expect(loading).toBe(false)
  })
})
