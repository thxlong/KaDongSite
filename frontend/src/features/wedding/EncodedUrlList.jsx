/**
 * Encoded URL List Component
 * @description Display generated URLs with copy functionality
 * @author KaDong Team
 * @created 2025-11-12
 */

import { useState } from 'react'
import { Copy, CheckCircle, ExternalLink, Download, QrCode } from 'lucide-react'
import PropTypes from 'prop-types'
import { copyToClipboard, downloadAsTextFile, downloadAsCSVFile } from './weddingService'
import QRCodeDisplay from './QRCodeDisplay'

const EncodedUrlList = ({ urls, onCopyAll }) => {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [selectedQRIndex, setSelectedQRIndex] = useState(null)

  const handleCopyOne = async (url, index) => {
    const success = await copyToClipboard(url)
    
    if (success) {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } else {
      alert('Không thể copy. Vui lòng copy thủ công.')
    }
  }

  const handleCopyAll = async () => {
    const allUrls = urls.map(item => item.url).join('\n')
    const success = await copyToClipboard(allUrls)
    
    if (success) {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
      if (onCopyAll) onCopyAll()
    } else {
      alert('Không thể copy. Vui lòng copy thủ công.')
    }
  }

  const handleDownloadTxt = () => {
    const filename = `wedding-invitation-links-${new Date().toISOString().split('T')[0]}.txt`
    downloadAsTextFile(urls, filename)
  }

  const handleDownloadCsv = () => {
    const filename = `wedding-invitation-links-${new Date().toISOString().split('T')[0]}.csv`
    downloadAsCSVFile(urls, filename)
  }

  const toggleQRCode = (index) => {
    setSelectedQRIndex(selectedQRIndex === index ? null : index)
  }

  if (urls.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-gray-500 text-lg font-medium mb-2">
          Chưa có link nào
        </p>
        <p className="text-gray-400 text-sm">
          Nhập danh sách khách mời và base URL để tạo links
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📋 Danh Sách Links ({urls.length})
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {/* Copy All Button */}
          <button
            onClick={handleCopyAll}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              copiedAll
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600'
            }`}
            data-testid="copy-all-btn"
          >
            {copiedAll ? (
              <>
                <CheckCircle size={18} />
                Đã copy!
              </>
            ) : (
              <>
                <Copy size={18} />
                Copy tất cả
              </>
            )}
          </button>

          {/* Download Dropdown */}
          <div className="relative group">
            <button className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all flex items-center gap-2">
              <Download size={18} />
              Tải xuống
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={handleDownloadTxt}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg text-sm"
              >
                📄 Tải xuống .txt
              </button>
              <button
                onClick={handleDownloadCsv}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg text-sm"
              >
                📊 Tải xuống .csv
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* URL List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {urls.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-purple-300 transition-all"
            data-testid="encoded-url-item"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Name and URL */}
              <div className="flex-1 min-w-0">
                {/* Guest Name */}
                <p className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-purple-500">👤</span>
                  {item.name}
                </p>
                
                {/* URL */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 break-all flex items-start gap-1 group"
                  title="Mở link trong tab mới"
                >
                  <span className="flex-1">{item.url}</span>
                  <ExternalLink size={14} className="flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* QR Code Button */}
                <button
                  onClick={() => toggleQRCode(index)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    selectedQRIndex === index
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Hiển thị QR Code"
                >
                  <QrCode size={16} />
                  <span className="text-xs hidden sm:inline">QR</span>
                </button>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopyOne(item.url, index)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    copiedIndex === index
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title="Copy link"
                >
                  {copiedIndex === index ? (
                    <>
                      <CheckCircle size={16} />
                      <span className="text-xs hidden sm:inline">Đã copy</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span className="text-xs hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* QR Code Display (Collapsible) */}
            {selectedQRIndex === index && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center">
                <QRCodeDisplay
                  url={item.url}
                  guestName={item.name}
                  size={180}
                  showDownload={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
        Đã tạo <strong className="text-gray-700">{urls.length}</strong> links thiệp cưới
      </div>
    </div>
  )
}

EncodedUrlList.propTypes = {
  urls: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  onCopyAll: PropTypes.func
}

EncodedUrlList.defaultProps = {
  onCopyAll: null
}

export default EncodedUrlList
