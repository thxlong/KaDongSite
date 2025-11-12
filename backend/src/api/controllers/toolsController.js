// In-memory data store (replace with database later)
let tools = [
  {
    id: 'countdown',
    name: 'Đếm ngày',
    description: 'Theo dõi những ngày đặc biệt và kỷ niệm',
    icon: 'clock',
    color: 'from-pastel-purple to-pastel-blue',
    path: '/countdown'
  },
  {
    id: 'calendar',
    name: 'Lịch',
    description: 'Xem lịch trình và sự kiện sắp tới',
    icon: 'calendar',
    color: 'from-pastel-mint to-pastel-blue',
    path: '/calendar'
  },
  {
    id: 'notes',
    name: 'Ghi chú',
    description: 'Lưu lại những ý tưởng và việc cần làm',
    icon: 'sticky-note',
    color: 'from-pastel-peach to-pastel-cream',
    path: '/notes'
  },
  {
    id: 'currency',
    name: 'Chuyển đổi tiền',
    description: 'Tính toán và chuyển đổi tiền tệ nhanh chóng',
    icon: 'dollar-sign',
    color: 'from-pastel-mint to-pastel-purple',
    path: '/currency'
  }
]

// GET all tools
export const getTools = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// GET tool by ID
export const getToolById = (req, res) => {
  try {
    const { id } = req.params
    const tool = tools.find(t => t.id === id)
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        error: 'Tool not found'
      })
    }

    res.status(200).json({
      success: true,
      data: tool
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
