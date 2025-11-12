/**
 * Weather Routes
 * @description API routes for weather forecast and favorite cities
 * @author KaDong Team
 * @created 2025-11-11
 */

import express from 'express'
import * as weatherController from '#api/controllers/weatherController.js'

const router = express.Router()

// Weather data endpoints
router.get('/current', weatherController.getCurrentWeather)
router.get('/forecast', weatherController.getForecast)
router.get('/hourly', weatherController.getHourlyForecast)

// Favorite cities endpoints
router.get('/favorites', weatherController.getFavoriteCities)
router.post('/favorites', weatherController.addFavoriteCity)
router.delete('/favorites/:id', weatherController.removeFavoriteCity)

// Cache management
router.post('/cache/clean', weatherController.cleanCache)

export default router
