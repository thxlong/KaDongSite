/**
 * QR Code Display Component
 * @description Display and download QR codes for wedding invitation URLs
 * @author KaDong Team
 * @created 2025-11-12
 */

import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, QrCode } from 'lucide-react'
import PropTypes from 'prop-types'

/**
 * QRCodeDisplay Component
 * Displays a QR code for a given URL with download functionality
 */
const QRCodeDisplay = ({ url, guestName, size = 200, showDownload = true }) => {
  /**
   * Download QR code as PNG image
   */
  const handleDownload = () => {
    // Get the SVG element
    const svg = document.getElementById(`qr-code-${encodeURIComponent(guestName)}`)
    if (!svg) return

    // Create canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Set canvas size (add padding)
    const padding = 40
    canvas.width = size + padding * 2
    canvas.height = size + padding * 2

    // Fill white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    
    img.onload = () => {
      // Draw QR code centered with padding
      ctx.drawImage(img, padding, padding, size, size)
      
      // Add guest name at bottom
      if (guestName) {
        ctx.fillStyle = '#000000'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(guestName, canvas.width / 2, canvas.height - 15)
      }

      // Download as PNG
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `qr-code-${guestName || 'invitation'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
      {/* QR Code Title */}
      <div className="flex items-center gap-2 text-gray-700">
        <QrCode size={20} />
        <span className="text-sm font-medium">QR Code</span>
      </div>

      {/* QR Code SVG */}
      <div className="p-3 bg-white rounded-lg border-2 border-gray-300">
        <QRCodeSVG
          id={`qr-code-${encodeURIComponent(guestName)}`}
          value={url}
          size={size}
          level="H" // High error correction
          includeMargin={false}
        />
      </div>

      {/* Guest Name */}
      {guestName && (
        <p className="text-sm font-semibold text-gray-800 text-center max-w-full truncate">
          {guestName}
        </p>
      )}

      {/* Download Button */}
      {showDownload && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
          title="Tải QR code về máy"
        >
          <Download size={16} />
          Tải QR Code
        </button>
      )}
    </div>
  )
}

QRCodeDisplay.propTypes = {
  url: PropTypes.string.isRequired,
  guestName: PropTypes.string,
  size: PropTypes.number,
  showDownload: PropTypes.bool
}

export default QRCodeDisplay
