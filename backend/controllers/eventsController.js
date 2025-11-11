// In-memory data store (replace with database later)
let events = []
let eventIdCounter = 1

// GET all events
export const getEvents = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// GET event by ID
export const getEventById = (req, res) => {
  try {
    const { id } = req.params
    const event = events.find(e => e.id === parseInt(id))
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      })
    }

    res.status(200).json({
      success: true,
      data: event
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// POST create new event
export const createEvent = (req, res) => {
  try {
    const { title, date, color, type } = req.body

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        error: 'Title and date are required'
      })
    }

    const newEvent = {
      id: eventIdCounter++,
      title,
      date,
      color: color || 'from-pastel-pink to-pastel-purple',
      type: type || 'countdown',
      createdAt: new Date().toISOString()
    }

    events.push(newEvent)

    res.status(201).json({
      success: true,
      data: newEvent
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// PUT update event
export const updateEvent = (req, res) => {
  try {
    const { id } = req.params
    const { title, date, color, type } = req.body

    const eventIndex = events.findIndex(e => e.id === parseInt(id))
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      })
    }

    events[eventIndex] = {
      ...events[eventIndex],
      title: title || events[eventIndex].title,
      date: date || events[eventIndex].date,
      color: color || events[eventIndex].color,
      type: type || events[eventIndex].type,
      updatedAt: new Date().toISOString()
    }

    res.status(200).json({
      success: true,
      data: events[eventIndex]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// DELETE event
export const deleteEvent = (req, res) => {
  try {
    const { id } = req.params
    const eventIndex = events.findIndex(e => e.id === parseInt(id))
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      })
    }

    const deletedEvent = events.splice(eventIndex, 1)[0]

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
