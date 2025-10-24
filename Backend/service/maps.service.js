const axios = require('axios');
const captainModel = require('../models/captain')

module.exports.getCoordinatesfromAddress = async (address) => {
    if (!address || typeof address !== 'string') {
        throw new TypeError('address must be a non-empty string');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error('Missing GOOGLE_MAPS_API_KEY in environment');
    }

    const url = 'https://maps.googleapis.com/maps/api/geocode/json';

    try {
        const res = await axios.get(url, {
            params: { address, key: apiKey },
            timeout: 5000
        });

        const data = res.data;
        if (data.status !== 'OK' || !Array.isArray(data.results) || data.results.length === 0) {
            return null;
        }

        const location = data.results[0].geometry.location; // { lat, lng }
        return {lon: Number(location.lng), lat: Number(location.lat) };
    } catch (err) {
        return null;
    }
}
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination || typeof origin !== 'string' || typeof destination !== 'string') {
        throw new TypeError('origin and destination must be non-empty strings');
    }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error('Missing GOOGLE_MAPS_API_KEY in environment');
    }
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    try {
        const res = await axios.get(url, {
            params: {
                origins: origin,
                destinations: destination,
                key: apiKey
            },
            timeout: 5000
        });

        const data = res.data;
        if (data.status !== 'OK' || !Array.isArray(data.rows) || data.rows.length === 0) {
            return null;
        }

        const element = data.rows[0].elements[0];
        if (element.status !== 'OK') {
            return null;
        }

        return {
            distance: element.distance,
            duration: element.duration
        };
    } catch (err) {
        return null;
    }
}
module.exports.getAutoSuggestions = async (input) => {
  if (!input || typeof input !== 'string') {
      throw new TypeError('input must be a non-empty string');
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
      throw new Error('Missing GOOGLE_MAPS_API_KEY in environment');
  }

  const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
  try {
      const res = await axios.get(url, {
          params: {
              input,
              key: apiKey
          },
          timeout: 5000
      });

      const data = res.data;
      if (data.status !== 'OK' || !Array.isArray(data.predictions)) {
          return [];
      }

      return data.predictions.map(prediction => ({
          description: prediction.description,
          place_id: prediction.place_id
      }));
  } catch (err) {
      return [];
  }
}
// Haversine formula — calculates distance in kilometers
module.exports.getDistanceInKm=async (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in kilometers

  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}


module.exports.getCaptainsInRadius = async (lat, lon, radius) => {
  try {
    console.log("🔍 Finding captains near:", { lat, lon, radius });

    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lon, lat], radius / 6371], // convert km to radians
        },
      },
    });

    console.log("✅ Found captains:", captains.length);
    return captains;
  } catch (error) {
    console.error("❌ Error finding captains:", error);
    return [];
  }
};