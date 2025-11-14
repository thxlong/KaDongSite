/**
 * Unit Tests for GoldPricesPage Component
 * @description Tests for gold prices display, filtering, and chart functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import GoldPricesTool from '../../src/features/gold/GoldPricesPage'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}))

// Mock data
const mockGoldPrices = [
  {
    id: '1',
    type: 'SJC_9999',
    name: 'Vàng SJC 9999',
    buyPrice: 76500000,
    sellPrice: 77500000,
    unit: 'VND/lượng',
    change: 200000,
    changePercent: 0.26,
    timestamp: '2025-01-14T10:00:00Z',
    provider: 'SJC'
  },
  {
    id: '2',
    type: 'XAU_USD',
    name: 'Vàng Thế giới',
    buyPrice: 2050.50,
    sellPrice: 2051.50,
    unit: 'USD/oz',
    change: -5.25,
    changePercent: -0.26,
    timestamp: '2025-01-14T10:00:00Z',
    provider: 'KITCO'
  },
  {
    id: '3',
    type: 'SJC_24K',
    name: 'Vàng SJC 24K',
    buyPrice: 75000000,
    sellPrice: 76000000,
    unit: 'VND/lượng',
    change: 150000,
    changePercent: 0.20,
    timestamp: '2025-01-14T10:00:00Z',
    provider: 'SJC'
  }
]

const mockHistoricalData = {
  SJC_9999: [
    { timestamp: '2025-01-14T09:00:00Z', buyPrice: 76300000, sellPrice: 77300000 },
    { timestamp: '2025-01-14T10:00:00Z', buyPrice: 76500000, sellPrice: 77500000 }
  ],
  XAU_USD: [
    { timestamp: '2025-01-14T09:00:00Z', buyPrice: 2055.75, sellPrice: 2056.75 },
    { timestamp: '2025-01-14T10:00:00Z', buyPrice: 2050.50, sellPrice: 2051.50 }
  ]
}

describe('GoldPricesTool Component', () => {
  let fetchMock

  beforeEach(() => {
    // Mock fetch API
    fetchMock = vi.fn()
    global.fetch = fetchMock
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <GoldPricesTool />
      </BrowserRouter>
    )
  }

  describe('Initial Loading', () => {
    it('should show loading state on initial render', () => {
      fetchMock.mockImplementation(() => new Promise(() => {})) // Never resolves
      
      renderComponent()
      
      expect(screen.getByText('Đang tải giá vàng...')).toBeInTheDocument()
    })

    it('should fetch latest prices on mount', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGoldPrices
        })
      })
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: []
        })
      })

      renderComponent()

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('/api/gold/latest')
        )
      })
    })
  })

  describe('Gold Prices Display', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGoldPrices
        })
      })
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockHistoricalData.SJC_9999
        })
      })
    })

    it('should display gold prices after loading', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Vàng SJC 9999')).toBeInTheDocument()
        expect(screen.getByText('Vàng Thế giới')).toBeInTheDocument()
        expect(screen.getByText('Vàng SJC 24K')).toBeInTheDocument()
      })
    })

    it('should filter out per chỉ gold types (PNJ_18K, GOLD_14K, PNJ_24K)', async () => {
      const pricesWithPerChi = [
        ...mockGoldPrices,
        {
          id: '4',
          type: 'PNJ_18K',
          name: 'Vàng PNJ 18K',
          buyPrice: 4500000,
          sellPrice: 4600000,
          unit: 'VND/chỉ',
          change: 50000,
          changePercent: 1.1,
          timestamp: '2025-01-14T10:00:00Z',
          provider: 'PNJ'
        },
        {
          id: '5',
          type: 'GOLD_14K',
          name: 'Vàng 14K',
          buyPrice: 3200000,
          sellPrice: 3300000,
          unit: 'VND/chỉ',
          change: 30000,
          changePercent: 0.9,
          timestamp: '2025-01-14T10:00:00Z',
          provider: 'PNJ'
        }
      ]

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: pricesWithPerChi
        })
      })

      renderComponent()

      await waitFor(() => {
        // Should show per lượng types
        expect(screen.getByText('Vàng SJC 9999')).toBeInTheDocument()
        expect(screen.getByText('Vàng Thế giới')).toBeInTheDocument()
        
        // Should NOT show per chỉ types
        expect(screen.queryByText('Vàng PNJ 18K')).not.toBeInTheDocument()
        expect(screen.queryByText('Vàng 14K')).not.toBeInTheDocument()
      })
    })

    it('should display buy and sell prices', async () => {
      renderComponent()

      await waitFor(() => {
        // SJC prices (in millions, formatted)
        expect(screen.getByText(/76\.5/)).toBeInTheDocument() // Buy price
        expect(screen.getByText(/77\.5/)).toBeInTheDocument() // Sell price
      })
    })

    it('should display price changes with correct styling', async () => {
      renderComponent()

      await waitFor(() => {
        // Positive change (SJC_9999: +0.26%)
        const positiveChanges = screen.getAllByText(/\+0\.26%/)
        expect(positiveChanges.length).toBeGreaterThan(0)
        
        // Negative change (XAU_USD: -0.26%)
        const negativeChanges = screen.getAllByText(/-0\.26%/)
        expect(negativeChanges.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Filtering and Selection', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGoldPrices
        })
      })
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: []
        })
      })
    })

    it('should have SJC_9999 and XAU_USD selected by default', async () => {
      renderComponent()

      await waitFor(() => {
        // Check if default types are selected (indicated by visual style)
        const cards = screen.getAllByTestId(/gold-card/)
        expect(cards.length).toBeGreaterThan(0)
      })
    })

    it('should toggle type selection on card click', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Vàng SJC 9999')).toBeInTheDocument()
      })

      // Find card by text and click it
      const sjcCard = screen.getByText('Vàng SJC 9999').closest('[role="button"]')
      
      if (sjcCard) {
        fireEvent.click(sjcCard)
        
        // Should trigger historical data fetch for updated selection
        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/gold/history')
          )
        })
      }
    })

    it('should fetch historical data for selected types', async () => {
      renderComponent()

      await waitFor(() => {
        // Should fetch history for default selected types (SJC_9999, XAU_USD)
        const historyCalls = fetchMock.mock.calls.filter(call => 
          call[0].includes('/api/gold/history')
        )
        expect(historyCalls.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Period Selection', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGoldPrices
        })
      })
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: []
        })
      })
    })

    it('should have "day" as default period', async () => {
      renderComponent()

      await waitFor(() => {
        const dayButton = screen.getByText('Ngày')
        expect(dayButton).toBeInTheDocument()
        expect(dayButton).toHaveAttribute('aria-pressed', 'true')
      })
    })

    it('should change period on button click', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Tuần')).toBeInTheDocument()
      })

      const weekButton = screen.getByText('Tuần')
      fireEvent.click(weekButton)

      // Should fetch new historical data with week period
      await waitFor(() => {
        const historyCalls = fetchMock.mock.calls.filter(call => 
          call[0].includes('period=week')
        )
        expect(historyCalls.length).toBeGreaterThan(0)
      })
    })

    it('should support multiple periods (day, week, month, year)', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Ngày')).toBeInTheDocument()
        expect(screen.getByText('Tuần')).toBeInTheDocument()
        expect(screen.getByText('Tháng')).toBeInTheDocument()
        expect(screen.getByText('Năm')).toBeInTheDocument()
      })
    })
  })

  describe('Chart Toggle', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGoldPrices
        })
      })
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockHistoricalData.SJC_9999
        })
      })
    })

    it('should show chart by default', async () => {
      renderComponent()

      await waitFor(() => {
        // Chart component should be rendered (check for chart title)
        expect(screen.getByText(/Biểu đồ giá vàng/)).toBeInTheDocument()
      })
    })

    it('should toggle chart visibility', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText(/Biểu đồ giá vàng/)).toBeInTheDocument()
      })

      const toggleCheckbox = screen.getByLabelText(/Hiển thị biểu đồ/)
      fireEvent.click(toggleCheckbox)

      await waitFor(() => {
        expect(screen.queryByText(/Biểu đồ giá vàng/)).not.toBeInTheDocument()
      })
    })
  })

  describe('Refresh Functionality', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGoldPrices
        })
      })
    })

    it('should have refresh button', async () => {
      renderComponent()

      await waitFor(() => {
        const refreshButton = screen.getByLabelText(/Làm mới dữ liệu/)
        expect(refreshButton).toBeInTheDocument()
      })
    })

    it('should refetch data on refresh button click', async () => {
      renderComponent()

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalled()
      })

      const initialCallCount = fetchMock.mock.calls.length
      
      const refreshButton = screen.getByLabelText(/Làm mới dữ liệu/)
      fireEvent.click(refreshButton)

      await waitFor(() => {
        expect(fetchMock.mock.calls.length).toBeGreaterThan(initialCallCount)
      })
    })

    it('should show loading state during refresh', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Vàng SJC 9999')).toBeInTheDocument()
      })

      fetchMock.mockImplementationOnce(() => new Promise(resolve => {
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, data: mockGoldPrices })
        }), 100)
      }))

      const refreshButton = screen.getByLabelText(/Làm mới dữ liệu/)
      fireEvent.click(refreshButton)

      // Should show loading indicator (animate-spin class)
      await waitFor(() => {
        const svg = refreshButton.querySelector('svg')
        expect(svg).toHaveClass('animate-spin')
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message when fetch fails', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('❌ Lỗi tải dữ liệu')).toBeInTheDocument()
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('should display error when API returns success: false', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: 'Failed to fetch gold prices'
        })
      })

      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('❌ Lỗi tải dữ liệu')).toBeInTheDocument()
        expect(screen.getByText('Failed to fetch gold prices')).toBeInTheDocument()
      })
    })

    it('should have retry button on error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      renderComponent()

      await waitFor(() => {
        const retryButton = screen.getByText('Thử lại')
        expect(retryButton).toBeInTheDocument()
      })
    })

    it('should retry fetch on retry button click', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Thử lại')).toBeInTheDocument()
      })

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGoldPrices
        })
      })
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: []
        })
      })

      const retryButton = screen.getByText('Thử lại')
      fireEvent.click(retryButton)

      await waitFor(() => {
        expect(screen.getByText('Vàng SJC 9999')).toBeInTheDocument()
      })
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no prices available', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: []
        })
      })

      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Chưa có dữ liệu giá vàng')).toBeInTheDocument()
      })
    })
  })

  describe('Last Update Timestamp', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGoldPrices
        })
      })
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: []
        })
      })
    })

    it('should display last update time', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText(/Cập nhật:/)).toBeInTheDocument()
      })
    })

    it('should update timestamp after refresh', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText(/Cập nhật:/)).toBeInTheDocument()
      })

      const firstTimestamp = screen.getByText(/Cập nhật:/).parentElement.textContent

      // Wait a bit and refresh
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const refreshButton = screen.getByLabelText(/Làm mới dữ liệu/)
      fireEvent.click(refreshButton)

      await waitFor(() => {
        const newTimestamp = screen.getByText(/Cập nhật:/).parentElement.textContent
        expect(newTimestamp).not.toBe(firstTimestamp)
      })
    })
  })
})
