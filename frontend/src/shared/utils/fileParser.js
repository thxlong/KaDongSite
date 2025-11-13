/**
 * File Parser Utilities
 * @description Parse guest names from TXT, CSV, and Excel files
 * @author KaDong Team
 * @created 2025-11-12
 * @spec specs/specs/06_wedding_invitation_url_encoder.spec
 */

import * as XLSX from 'xlsx'

/**
 * Parse text file (one name per line)
 * @param {File} file - Text file
 * @returns {Promise<string[]>} Array of guest names
 */
export const parseTextFile = async (file) => {
  try {
    const text = await file.text()
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
  } catch (error) {
    console.error('Error parsing text file:', error)
    throw new Error('Không thể đọc file TXT')
  }
}

/**
 * Parse CSV file (first column = names)
 * @param {File} file - CSV file
 * @returns {Promise<string[]>} Array of guest names
 */
export const parseCsvFile = async (file) => {
  try {
    const text = await file.text()
    const lines = text.split('\n')
    
    return lines
      .map(line => {
        // Handle both comma and tab separators
        const columns = line.split(/[,\t]/)
        return columns[0]?.trim() || ''
      })
      .filter(Boolean)
  } catch (error) {
    console.error('Error parsing CSV file:', error)
    throw new Error('Không thể đọc file CSV')
  }
}

/**
 * Parse Excel file (first column of first sheet = names)
 * @param {File} file - Excel file (.xlsx)
 * @returns {Promise<string[]>} Array of guest names
 */
export const parseExcelFile = async (file) => {
  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    
    // Get first sheet
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    
    // Convert to array of arrays
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    // Extract first column
    return data
      .map(row => String(row[0] || '').trim())
      .filter(Boolean)
  } catch (error) {
    console.error('Error parsing Excel file:', error)
    throw new Error('Không thể đọc file Excel')
  }
}

/**
 * Parse file based on extension
 * Automatically detects file type and uses appropriate parser
 * @param {File} file - File to parse
 * @returns {Promise<string[]>} Array of guest names
 */
export const parseFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase()
  
  switch (extension) {
    case 'txt':
      return parseTextFile(file)
    case 'csv':
      return parseCsvFile(file)
    case 'xlsx':
    case 'xls':
      return parseExcelFile(file)
    default:
      throw new Error(`Định dạng file không hỗ trợ: .${extension}. Chỉ hỗ trợ .txt, .csv, .xlsx`)
  }
}

/**
 * Validate file size (max in MB)
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Max size in megabytes (default: 2MB)
 * @returns {boolean} True if file size is valid
 */
export const validateFileSize = (file, maxSizeMB = 2) => {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * Validate file extension
 * @param {File} file - File to validate
 * @param {string[]} allowedExtensions - Array of allowed extensions (e.g., ['txt', 'csv', 'xlsx'])
 * @returns {boolean} True if file extension is valid
 */
export const validateFileExtension = (file, allowedExtensions = ['txt', 'csv', 'xlsx', 'xls']) => {
  const extension = file.name.split('.').pop().toLowerCase()
  return allowedExtensions.includes(extension)
}

/**
 * Get file extension
 * @param {File} file - File object
 * @returns {string} File extension (lowercase, without dot)
 */
export const getFileExtension = (file) => {
  return file.name.split('.').pop().toLowerCase()
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Validate file before parsing
 * @param {File} file - File to validate
 * @returns {{ valid: boolean, error: string|null }} Validation result
 */
export const validateFile = (file) => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'Vui lòng chọn file' }
  }
  
  // Check file size (max 2MB)
  if (!validateFileSize(file, 2)) {
    return { valid: false, error: 'File quá lớn. Vui lòng chọn file < 2MB' }
  }
  
  // Check file extension
  if (!validateFileExtension(file)) {
    return { valid: false, error: 'Định dạng file không hỗ trợ. Chỉ hỗ trợ .txt, .csv, .xlsx' }
  }
  
  return { valid: true, error: null }
}
