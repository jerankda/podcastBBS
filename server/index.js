import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Simple JSON file database
const DB_PATH = path.join(__dirname, 'data', 'podcasts.json')

function readDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    }
  } catch (e) {
    console.error('Error reading DB:', e)
  }
  return { podcasts: [] }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('Error writing DB:', e)
  }
}

// Ensure directories exist
const dataDir = path.join(__dirname, 'data')
const uploadsDir = path.join(__dirname, 'uploads')
const audioDir = path.join(uploadsDir, 'audio')
const imagesDir = path.join(uploadsDir, 'images')

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true })
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

// Initialize DB if needed
if (!fs.existsSync(DB_PATH)) {
  writeDB({ podcasts: [] })
}

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      cb(null, audioDir)
    } else if (file.fieldname === 'image') {
      cb(null, imagesDir)
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      const audioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/flac', 'audio/x-m4a']
      if (audioTypes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|m4a|ogg|flac)$/i)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid audio file type'), false)
      }
    } else if (file.fieldname === 'image') {
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (imageTypes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid image file type'), false)
      }
    } else {
      cb(null, true)
    }
  }
})

// Simple auth middleware - verifies Firebase token from header
// For now, we trust the userId sent from client (in production, verify Firebase token)
const authMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id']
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized - No user ID provided' })
  }
  req.userId = userId
  next()
}

// ============ API ROUTES ============

// GET /api/podcasts - Get all podcasts
app.get('/api/podcasts', (req, res) => {
  try {
    const data = readDB()
    const podcasts = data.podcasts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json(podcasts)
  } catch (error) {
    console.error('Error fetching podcasts:', error)
    res.status(500).json({ error: 'Failed to fetch podcasts' })
  }
})

// GET /api/podcasts/:id - Get single podcast
app.get('/api/podcasts/:id', (req, res) => {
  try {
    const data = readDB()
    const podcast = data.podcasts.find(p => p.id === req.params.id)
    
    if (!podcast) {
      return res.status(404).json({ error: 'Podcast not found' })
    }
    
    res.json(podcast)
  } catch (error) {
    console.error('Error fetching podcast:', error)
    res.status(500).json({ error: 'Failed to fetch podcast' })
  }
})

// GET /api/podcasts/user/:userId - Get podcasts by user
app.get('/api/podcasts/user/:userId', (req, res) => {
  try {
    const data = readDB()
    const podcasts = data.podcasts
      .filter(p => p.authorId === req.params.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    res.json(podcasts)
  } catch (error) {
    console.error('Error fetching user podcasts:', error)
    res.status(500).json({ error: 'Failed to fetch podcasts' })
  }
})

// POST /api/podcasts - Upload new podcast
app.post('/api/podcasts', authMiddleware, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), (req, res) => {
  try {
    const { title, description, author, category, duration } = req.body
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }
    
    if (!req.files?.audio?.[0]) {
      return res.status(400).json({ error: 'Audio file is required' })
    }
    
    const id = uuidv4()
    const audioFile = req.files.audio[0]
    const imageFile = req.files.image?.[0]
    
    const audioUrl = `/uploads/audio/${audioFile.filename}`
    const imageUrl = imageFile ? `/uploads/images/${imageFile.filename}` : null
    
    const podcast = {
      id,
      title,
      description: description || '',
      author: author || 'Anonymous',
      authorId: req.userId,
      category: category || 'Other',
      duration: duration || '00:00',
      audioUrl,
      imageUrl,
      createdAt: new Date().toISOString()
    }
    
    const data = readDB()
    data.podcasts.push(podcast)
    writeDB(data)
    
    res.status(201).json(podcast)
  } catch (error) {
    console.error('Error creating podcast:', error)
    res.status(500).json({ error: 'Failed to create podcast' })
  }
})

// DELETE /api/podcasts/:id - Delete podcast (owner only)
app.delete('/api/podcasts/:id', authMiddleware, (req, res) => {
  try {
    const data = readDB()
    const podcastIndex = data.podcasts.findIndex(p => p.id === req.params.id)
    
    if (podcastIndex === -1) {
      return res.status(404).json({ error: 'Podcast not found' })
    }
    
    const podcast = data.podcasts[podcastIndex]
    
    if (podcast.authorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this podcast' })
    }
    
    // Delete files
    if (podcast.audioUrl) {
      const audioPath = path.join(__dirname, podcast.audioUrl)
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)
    }
    if (podcast.imageUrl) {
      const imagePath = path.join(__dirname, podcast.imageUrl)
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
    }
    
    // Delete from database
    data.podcasts.splice(podcastIndex, 1)
    writeDB(data)
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting podcast:', error)
    res.status(500).json({ error: 'Failed to delete podcast' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// GET /api/podcasts/:id/feed - RSS Feed für einen Podcast
app.get('/api/podcasts/:id/feed', (req, res) => {
  try {
    const data = readDB()
    const podcast = data.podcasts.find(p => p.id === req.params.id)
    
    if (!podcast) {
      return res.status(404).json({ error: 'Podcast not found' })
    }
    
    // Base URL für Links
    const baseUrl = `${req.protocol}://${req.get('host')}`
    
    // Escape XML special characters
    const escapeXml = (str) => {
      if (!str) return ''
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
    }
    
    // Format duration for iTunes (HH:MM:SS or MM:SS)
    const formatDuration = (duration) => {
      if (!duration) return '00:00'
      return duration
    }
    
    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(podcast.title)}</title>
    <link>${baseUrl}/podcast/${podcast.id}</link>
    <description>${escapeXml(podcast.description)}</description>
    <language>de-DE</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/podcasts/${podcast.id}/feed" rel="self" type="application/rss+xml"/>
    
    <itunes:author>${escapeXml(podcast.author)}</itunes:author>
    <itunes:summary>${escapeXml(podcast.description)}</itunes:summary>
    <itunes:category text="${escapeXml(podcast.category || 'Society &amp; Culture')}"/>
    <itunes:explicit>false</itunes:explicit>
    ${podcast.imageUrl ? `<itunes:image href="${baseUrl}${podcast.imageUrl}"/>` : ''}
    ${podcast.imageUrl ? `<image>
      <url>${baseUrl}${podcast.imageUrl}</url>
      <title>${escapeXml(podcast.title)}</title>
      <link>${baseUrl}/podcast/${podcast.id}</link>
    </image>` : ''}
    
    <item>
      <title>${escapeXml(podcast.title)}</title>
      <description>${escapeXml(podcast.description)}</description>
      <pubDate>${new Date(podcast.createdAt).toUTCString()}</pubDate>
      <enclosure url="${baseUrl}${podcast.audioUrl}" type="audio/mpeg"/>
      <guid isPermaLink="false">${podcast.id}</guid>
      <link>${baseUrl}/podcast/${podcast.id}</link>
      <itunes:duration>${formatDuration(podcast.duration)}</itunes:duration>
      <itunes:author>${escapeXml(podcast.author)}</itunes:author>
      <itunes:summary>${escapeXml(podcast.description)}</itunes:summary>
      ${podcast.imageUrl ? `<itunes:image href="${baseUrl}${podcast.imageUrl}"/>` : ''}
    </item>
  </channel>
</rss>`
    
    res.set('Content-Type', 'application/rss+xml; charset=utf-8')
    res.send(rss)
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    res.status(500).json({ error: 'Failed to generate RSS feed' })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 500MB.' })
  }
  res.status(500).json({ error: error.message || 'Internal server error' })
})

// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

app.listen(PORT, () => {
  console.log(`🎙️ Podcaster API running on http://localhost:${PORT}`)
})
