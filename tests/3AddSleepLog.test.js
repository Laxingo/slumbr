import { describe, it, expect, vi } from 'vitest'

describe('posting sleep data', () => {
  it('posts sleep data successfully', async () => {
    const payload = { hours: 86400000, date: 1769385800000 }
    const sleepData = []

    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 's1', ...payload }),
      })
    ))

    let error = ''
    let loading = true
    try {
      const res = await fetch('http://127.0.0.1:3000/sleepData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const created = await res.json()
      sleepData.push(created)
    } catch (e) {
      error = 'Failed to save. Try again.'
    } finally {
      loading = false
    }

    expect(sleepData).toHaveLength(1)
    expect(sleepData[0]).toEqual({ id: 's1', ...payload })
    expect(error).toBe('')
    expect(loading).toBe(false)
  })

  it('handles fetch failure', async () => {
    const payload = { hours: 86400000, date: 1769385800000 }
    const sleepData = []

    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))))

    let error = ''
    let loading = true
    try {
      const res = await fetch('http://127.0.0.1:3000/sleepData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const created = await res.json()
      sleepData.push(created)
    } catch (e) {
      error = 'Failed to save. Try again.'
    } finally {
      loading = false
    }

    expect(sleepData).toHaveLength(0)
    expect(error).toBe('Failed to save. Try again.')
    expect(loading).toBe(false)
  })
})
