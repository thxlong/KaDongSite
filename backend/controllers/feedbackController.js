// In-memory data store (replace with database later)
let feedbacks = []
let feedbackIdCounter = 1

// POST submit feedback
export const submitFeedback = (req, res) => {
  try {
    const { name, email, message, rating } = req.body

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      })
    }

    const newFeedback = {
      id: feedbackIdCounter++,
      name: name || 'Anonymous',
      email: email || null,
      message,
      rating: rating || 5,
      createdAt: new Date().toISOString()
    }

    feedbacks.push(newFeedback)

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: newFeedback
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// GET all feedback
export const getAllFeedback = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
