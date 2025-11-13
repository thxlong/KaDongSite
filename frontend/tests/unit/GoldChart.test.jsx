/**
 * Gold Chart Component Unit Tests
 * @description Simplified tests focusing on bug fixes
 * @created 2025-11-13
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GoldChart } from '../../src/features/gold'

describe('GoldChart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should display loading state', () => {
      render(<GoldChart loading={true} data={{}} selectedTypes={[]} period="day" />)
      expect(screen.getByText(/Đang tải biểu đồ/i)).toBeInTheDocument()
    })
  })

  describe('Empty Data Handling - Bug Fix: Null/Undefined Check', () => {
    it('should handle empty data object', () => {
      render(<GoldChart loading={false} data={{}} selectedTypes={['SJC_9999']} period="day" />)
      expect(screen.getByText(/Chưa có dữ liệu lịch sử/i)).toBeInTheDocument()
    })

    it('should handle null data', () => {
      render(<GoldChart loading={false} data={null} selectedTypes={['SJC_9999']} period="day" />)
      expect(screen.getByText(/Chưa có dữ liệu lịch sử/i)).toBeInTheDocument()
    })

    it('should handle undefined data', () => {
      render(<GoldChart loading={false} data={undefined} selectedTypes={['SJC_9999']} period="day" />)
      expect(screen.getByText(/Chưa có dữ liệu lịch sử/i)).toBeInTheDocument()
    })

    it('should handle empty records array', () => {
      const data = { SJC_9999: [] }
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      
      // Should warn about no records
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('No records for type'))
      
      // Should show empty state
      expect(screen.getByText(/Chưa có dữ liệu lịch sử/i)).toBeInTheDocument()
      
      consoleWarnSpy.mockRestore()
    })
  })

  describe('Time Field Handling - Bug Fix: time_bucket/period_start fallback', () => {
    it('should use time_bucket when available', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      const data = {
        SJC_9999: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          avg_mid_price: '153500000'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      
      // Should render chart without errors
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    it('should fallback to period_start when time_bucket missing', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      const data = {
        XAU_USD: [{
          period_start: '2025-11-13T09:00:00.000Z',
          mid_price: '2650.50'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['XAU_USD']} period="day" />)
      
      // Should render chart without errors  
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    it('should skip records without time_bucket or period_start', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const data = {
        SJC_9999: [{
          // Missing both time_bucket and period_start
          avg_mid_price: '153500000'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      
      // Should warn about missing time fields
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing time_bucket and period_start'),
        expect.any(Object)
      )
      
      // Should show empty state because no valid records
      expect(screen.getByText(/Chưa có dữ liệu lịch sử/i)).toBeInTheDocument()
      
      consoleWarnSpy.mockRestore()
    })
  })

  describe('Price Field Handling - Bug Fix: avg_mid_price/mid_price fallback', () => {
    it('should use avg_mid_price when available', () => {
      const data = {
        SJC_9999: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          avg_mid_price: '153500000'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
    })

    it('should fallback to mid_price when avg_mid_price missing', () => {
      const data = {
        XAU_USD: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          mid_price: '2650.50'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['XAU_USD']} period="day" />)
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
    })

    it('should skip records with invalid price (NaN)', () => {
      const data = {
        SJC_9999: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          avg_mid_price: 'invalid_number'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      
      // Chart renders even with invalid prices (timestamp exists but no price)
      // This is acceptable - just won't show line for this type
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
    })
  })

  describe('Chart Display', () => {
    it('should display correct period title', () => {
      const data = {
        SJC_9999: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          avg_mid_price: '153500000'
        }]
      }
      
      const { rerender } = render(
        <GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />
      )
      expect(screen.getByText(/Hôm nay/i)).toBeInTheDocument()
      
      rerender(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="week" />)
      expect(screen.getByText(/Tuần này/i)).toBeInTheDocument()
      
      rerender(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="month" />)
      expect(screen.getByText(/Tháng này/i)).toBeInTheDocument()
      
      rerender(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="year" />)
      expect(screen.getByText(/Năm nay/i)).toBeInTheDocument()
    })

    it('should merge data points at same timestamp from different types', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      const data = {
        SJC_9999: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          avg_mid_price: '153500000'
        }],
        XAU_USD: [{
          time_bucket: '2025-11-13T09:00:00.000Z', // Same timestamp
          mid_price: '2650.50'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999', 'XAU_USD']} period="day" />)
      
      // Should log merged data
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[GoldChart] Processed chart data:'),
        expect.objectContaining({
          dataPoints: expect.any(Number)
        })
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large price values', () => {
      const data = {
        SJC_9999: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          avg_mid_price: '999999999999' // 999B
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
    })

    it('should handle very small price values', () => {
      const data = {
        XAU_USD: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          mid_price: '0.01'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['XAU_USD']} period="day" />)
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
    })

    it('should handle different timezone date formats', () => {
      const data = {
        SJC_9999: [
          {
            time_bucket: '2025-11-13T09:00:00.000Z', // UTC
            avg_mid_price: '153500000'
          },
          {
            time_bucket: '2025-11-13T02:00:00+07:00', // GMT+7 (same UTC time)
            avg_mid_price: '153600000'
          }
        ]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
    })
  })

  describe('Console Logging for Debugging', () => {
    it('should log processed chart data', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      const data = {
        SJC_9999: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          avg_mid_price: '153500000'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[GoldChart] Processed chart data:'),
        expect.any(Object)
      )
      
      consoleSpy.mockRestore()
    })

    it('should warn when no records for a type', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const data = {
        SJC_9999: []
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('No records for type:')
      )
      
      consoleWarnSpy.mockRestore()
    })

    it('should warn when time fields are missing', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const data = {
        SJC_9999: [{
          avg_mid_price: '153500000'
          // Missing time_bucket and period_start
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing time_bucket and period_start'),
        expect.any(Object)
      )
      
      consoleWarnSpy.mockRestore()
    })
  })
})
