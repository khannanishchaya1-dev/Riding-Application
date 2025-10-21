const axios = require('axios');

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
        return { lat: Number(location.lat), lon: Number(location.lng) };
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