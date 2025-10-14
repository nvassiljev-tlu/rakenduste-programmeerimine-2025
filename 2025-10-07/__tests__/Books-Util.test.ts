import { describe, test, expect } from 'vitest'

export function validateBook(book: any) {
  if (!book.title || !book.author) {
    return { valid: false, errors: ['Title and author are required'] }
  }
  
  if (book.published_year && (book.published_year < 0 || book.published_year > new Date().getFullYear())) {
    return { valid: false, errors: ['Invalid published year'] }
  }
  
  return { valid: true, errors: [] }
}

export function formatBookDisplay(book: any) {
  let display = `${book.title} by ${book.author}`
  
  if (book.published_year) {
    display += ` (${book.published_year})`
  }
  
  return display
}

describe('Books Utils', () => {
  describe('validateBook', () => {
    test('returns valid for book with required fields', () => {
      const book = { title: 'Test Book', author: 'Test Author' }
      const result = validateBook(book)
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('returns invalid for book without title', () => {
      const book = { author: 'Test Author' }
      const result = validateBook(book)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Title and author are required')
    })

    test('returns invalid for book without author', () => {
      const book = { title: 'Test Book' }
      const result = validateBook(book)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Title and author are required')
    })

    test('returns invalid for book with invalid year', () => {
      const book = { 
        title: 'Test Book', 
        author: 'Test Author', 
        published_year: 2030 
      }
      const result = validateBook(book)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid published year')
    })

    test('returns valid for book with valid year', () => {
      const book = { 
        title: 'Test Book', 
        author: 'Test Author', 
        published_year: 2020 
      }
      const result = validateBook(book)
      
      expect(result.valid).toBe(true)
    })
  })

  describe('formatBookDisplay', () => {
    test('formats book with title and author', () => {
      const book = { title: 'Test Book', author: 'Test Author' }
      const result = formatBookDisplay(book)
      
      expect(result).toBe('Test Book by Test Author')
    })

    test('formats book with year', () => {
      const book = { 
        title: 'Test Book', 
        author: 'Test Author',
        published_year: 2020
      }
      const result = formatBookDisplay(book)
      
      expect(result).toBe('Test Book by Test Author (2020)')
    })
  })
})
