// In-memory data store (replace with database later)
let notes = []
let noteIdCounter = 1

// GET all notes
export const getNotes = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// GET note by ID
export const getNoteById = (req, res) => {
  try {
    const { id } = req.params
    const note = notes.find(n => n.id === parseInt(id))
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      })
    }

    res.status(200).json({
      success: true,
      data: note
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// POST create new note
export const createNote = (req, res) => {
  try {
    const { title, content, color } = req.body

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      })
    }

    const newNote = {
      id: noteIdCounter++,
      title,
      content,
      color: color || 'pink',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    notes.push(newNote)

    res.status(201).json({
      success: true,
      data: newNote
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// PUT update note
export const updateNote = (req, res) => {
  try {
    const { id } = req.params
    const { title, content, color } = req.body

    const noteIndex = notes.findIndex(n => n.id === parseInt(id))
    
    if (noteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      })
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title || notes[noteIndex].title,
      content: content || notes[noteIndex].content,
      color: color || notes[noteIndex].color,
      updatedAt: new Date().toISOString()
    }

    res.status(200).json({
      success: true,
      data: notes[noteIndex]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// DELETE note
export const deleteNote = (req, res) => {
  try {
    const { id } = req.params
    const noteIndex = notes.findIndex(n => n.id === parseInt(id))
    
    if (noteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      })
    }

    const deletedNote = notes.splice(noteIndex, 1)[0]

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: deletedNote
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
