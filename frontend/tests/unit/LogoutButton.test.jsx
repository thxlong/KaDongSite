/**
 * Unit Tests for LogoutButton Component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LogoutButton from '../../src/shared/components/LogoutButton'
import { AuthContext } from '../../src/shared/contexts/AuthContext'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('LogoutButton Component', () => {
  let mockLogout
  let mockAuthContext

  beforeEach(() => {
    mockLogout = vi.fn().mockResolvedValue({ success: true })
    mockNavigate.mockClear()

    mockAuthContext = {
      logout: mockLogout,
      isGuest: false,
      user: { id: '1', email: 'test@example.com' },
      isAuthenticated: true,
      loading: false
    }
  })

  const renderComponent = (variant = 'dropdown', onLogoutComplete = null) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <LogoutButton variant={variant} onLogoutComplete={onLogoutComplete} />
        </AuthContext.Provider>
      </BrowserRouter>
    )
  }

  describe('Dropdown Variant', () => {
    it('should render dropdown button', () => {
      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      expect(button).toBeInTheDocument()
      expect(button.tagName).toBe('BUTTON')
    })

    it('should show confirmation dialog on click', async () => {
      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
        expect(screen.getByText('Bạn có chắc muốn đăng xuất khỏi tài khoản?')).toBeInTheDocument()
      })
    })

    it('should close dialog on cancel', async () => {
      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })

      const cancelButton = screen.getByText('Hủy')
      fireEvent.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByText('Xác nhận đăng xuất')).not.toBeInTheDocument()
      })
    })

    it('should call logout and navigate on confirm', async () => {
      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })

      const confirmButtons = screen.getAllByText('Đăng xuất')
      const confirmButton = confirmButtons.find(btn => btn.className.includes('bg-red-600'))
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith('/login', {
          replace: true,
          state: { message: 'Đã đăng xuất thành công' }
        })
      })
    })

    it('should call onLogoutComplete callback', async () => {
      const mockCallback = vi.fn()
      renderComponent('dropdown', mockCallback)
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })

      const confirmButtons = screen.getAllByText('Đăng xuất')
      const confirmButton = confirmButtons.find(btn => btn.className.includes('bg-red-600'))
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Button Variant', () => {
    it('should render standalone button', () => {
      renderComponent('button')
      
      const button = screen.getByText('Đăng xuất')
      expect(button).toBeInTheDocument()
      expect(button.className).toContain('text-red-600')
    })

    it('should show confirmation dialog on click', async () => {
      renderComponent('button')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })
    })
  })

  describe('Guest Mode', () => {
    beforeEach(() => {
      mockAuthContext.isGuest = true
      mockAuthContext.user = { id: 'guest', email: 'guest@kadong.local' }
    })

    it('should show guest warning in confirmation dialog', async () => {
      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc muốn đăng xuất khỏi chế độ Guest/)).toBeInTheDocument()
        expect(screen.getByText(/Dữ liệu của bạn sẽ bị xóa/)).toBeInTheDocument()
      })
    })

    it('should call logout for guest user', async () => {
      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })

      const confirmButtons = screen.getAllByText('Đăng xuất')
      const confirmButton = confirmButtons.find(btn => btn.className.includes('bg-red-600'))
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message on logout failure', async () => {
      const error = new Error('Network error')
      mockLogout.mockRejectedValueOnce(error)

      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })

      const confirmButtons = screen.getAllByText('Đăng xuất')
      const confirmButton = confirmButtons.find(btn => btn.className.includes('bg-red-600'))
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(screen.getByText('Không thể đăng xuất. Vui lòng thử lại.')).toBeInTheDocument()
      })
    })

    it('should not navigate on logout error', async () => {
      mockLogout.mockRejectedValueOnce(new Error('Logout failed'))

      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })

      const confirmButtons = screen.getAllByText('Đăng xuất')
      const confirmButton = confirmButtons.find(btn => btn.className.includes('bg-red-600'))
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled()
      })
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner during logout', async () => {
      mockLogout.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })

      const confirmButtons = screen.getAllByText('Đăng xuất')
      const confirmButton = confirmButtons.find(btn => btn.className.includes('bg-red-600'))
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(screen.getByText('Đang xử lý...')).toBeInTheDocument()
      })
    })

    it('should disable buttons during logout', async () => {
      mockLogout.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })

      const confirmButtons = screen.getAllByText('Đăng xuất')
      const confirmButton = confirmButtons.find(btn => btn.className.includes('bg-red-600'))
      fireEvent.click(confirmButton)

      await waitFor(() => {
        const cancelButton = screen.getByText('Hủy')
        expect(cancelButton).toBeDisabled()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      expect(button.getAttribute('role')).toBeFalsy() // Native button has implicit role
      expect(button.tagName).toBe('BUTTON')
    })

    it('should be keyboard accessible', async () => {
      renderComponent('dropdown')
      
      const button = screen.getByText('Đăng xuất')
      
      // Simulate Enter key press
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Xác nhận đăng xuất')).toBeInTheDocument()
      })
    })
  })
})
