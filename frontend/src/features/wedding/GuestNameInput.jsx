/**
 * Guest Name Input Component
 * @description Textarea and file upload for guest name list
 * @author KaDong Team
 * @created 2025-11-12
 */

import { useState, useRef } from 'react'
import { Upload, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import PropTypes from 'prop-types'
import { parseFile, validateFile, formatFileSize, getFileExtension } from '../../utils/fileParser'
import { parseGuestNames, removeDuplicateNames } from '../../utils/urlEncoder'

const GuestNameInput = ({ onNamesChange }) => {
  const [text, setText] = useState('')
  const [fileInfo, setFileInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Reset previous file info
    setFileInfo(null)
    setError('')

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setLoading(true)

    try {
      // Parse file based on extension
      const names = await parseFile(file)
      
      // Remove duplicates
      const uniqueNames = removeDuplicateNames(names)
      
      // Update textarea with parsed names
      setText(uniqueNames.join('\n'))
      
      // Set file info
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size),
        extension: getFileExtension(file),
        count: uniqueNames.length,
        originalCount: names.length,
        duplicatesRemoved: names.length - uniqueNames.length
      })
      
      // Notify parent component
      onNamesChange(uniqueNames)
      
    } catch (err) {
      setError(err.message)
      setFileInfo(null)
    } finally {
      setLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleTextChange = (value) => {
    setText(value)
    setFileInfo(null)
    setError('')
    
    if (value.trim()) {
      const names = parseGuestNames(value)
      const uniqueNames = removeDuplicateNames(names)
      onNamesChange(uniqueNames)
    } else {
      onNamesChange([])
    }
  }

  const handleClear = () => {
    setText('')
    setFileInfo(null)
    setError('')
    onNamesChange([])
  }

  const getCurrentCount = () => {
    if (!text.trim()) return 0
    const names = parseGuestNames(text)
    return removeDuplicateNames(names).length
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Users size={20} className="text-purple-500" />
          Danh Sách Khách Mời
        </h3>
        
        {text && (
          <button
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Textarea Input */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Nhập danh sách khách mời (phân cách bằng dấu phẩy, chấm phẩy hoặc xuống dòng)

Ví dụ:
Bà Ngoại + Cậu Năm
GD Em Phong Vân
GĐ Em Sang Bình"
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none font-mono text-sm"
            data-testid="guest-names-textarea"
          />
          
          {/* Character Count */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {getCurrentCount()} khách
          </div>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
          <Upload className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-sm text-gray-600 mb-3">
            Hoặc tải lên file Excel/TXT/CSV
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            data-testid="file-upload-input"
          />
          <label
            htmlFor="file-upload"
            className="bg-gradient-to-r from-purple-400 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all cursor-pointer inline-block"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang đọc...
              </span>
            ) : (
              'Chọn File'
            )}
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Hỗ trợ: .txt, .csv, .xlsx (tối đa 2MB)
          </p>
        </div>

        {/* File Info - Success */}
        {fileInfo && !error && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 mb-1">
                  ✅ Đã đọc thành công
                </p>
                <div className="text-xs text-green-700 space-y-1">
                  <p className="flex items-center gap-2">
                    <FileText size={14} />
                    <span className="font-medium">{fileInfo.name}</span>
                    <span className="text-green-600">({fileInfo.size})</span>
                  </p>
                  <p>• Tìm thấy: {fileInfo.originalCount} tên</p>
                  <p>• Sau khi loại trùng: {fileInfo.count} tên</p>
                  {fileInfo.duplicatesRemoved > 0 && (
                    <p className="text-orange-600">
                      ⚠️ Đã loại bỏ {fileInfo.duplicatesRemoved} tên trùng lặp
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  ❌ Lỗi đọc file
                </p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Helper Text */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium text-gray-700 mb-1">💡 Hướng dẫn:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Nhập trực tiếp vào ô text hoặc upload file</li>
            <li>Có thể dùng dấu phẩy (,), chấm phẩy (;) hoặc xuống dòng</li>
            <li>File Excel: lấy dữ liệu từ cột A của sheet đầu tiên</li>
            <li>Tên trùng lặp sẽ tự động được loại bỏ</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

GuestNameInput.propTypes = {
  onNamesChange: PropTypes.func.isRequired
}

export default GuestNameInput
