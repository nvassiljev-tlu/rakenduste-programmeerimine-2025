import { describe, test, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/books/route'
import { NextRequest } from 'next/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
    })),
  })),
}))

describe('/api/books', () => {
  describe('GET', () => {
    test('returns books successfully', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1' },
        { id: 2, title: 'Book 2', author: 'Author 2' },
      ]

      const { createClient } = await import('@/lib/supabase/server')
      const mockSupabase = createClient as any
      mockSupabase().from().select.mockResolvedValue({
        data: mockBooks,
        error: null,
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.books).toEqual(mockBooks)
    })

    test('returns error when database fails', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      const mockSupabase = createClient as any
      mockSupabase().from().select.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Database error')
    })
  })

  describe('POST', () => {
    test('creates book successfully', async () => {
      const newBook = {
        title: 'New Book',
        author: 'New Author',
        isbn: '978-0-123456-78-9',
        published_year: 2024,
      }

      const { createClient } = await import('@/lib/supabase/server')
      const mockSupabase = createClient as any
      mockSupabase().from().insert().select().single.mockResolvedValue({
        data: { id: 1, ...newBook },
        error: null,
      })

      const request = new NextRequest('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify(newBook),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.book).toMatchObject(newBook)
    })

    test('returns error for missing required fields', async () => {
      const invalidBook = { title: 'Only Title' }

      const request = new NextRequest('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify(invalidBook),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Title and author are required')
    })
  })
})
