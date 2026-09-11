import { useState } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_KEY = import.meta.env.VITE_OWM_API_KEY

  const getWeather = async () => {
    if (!city) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      )
      const data = await res.json()

      if (Number(data.cod) !== 200) {
        setError('City not found!')
        setLoading(false)
        return
      }

      setWeather(data)
      setLoading(false)
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const windDirection = (deg) => {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return dirs[Math.round(deg / 22.5) % 16]
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/bg.mp4"
      />
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-8 w-full max-w-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Weather App
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={getWeather}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-600">
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

        {weather && (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="flex items-center justify-center gap-4 mb-2">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="w-20 h-20"
              />
              <div>
                <p className="text-5xl font-bold text-gray-800">
                  {Math.round(weather.main.temp)}°C
                </p>
                <p className="text-sm text-gray-500">
                  Feels like {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
            </div>

            <p className="text-gray-600 capitalize mb-1">
              {weather.weather[0].description}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              H: {Math.round(weather.main.temp_max)}° &nbsp; L: {Math.round(weather.main.temp_min)}°
            </p>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Humidity</p>
                <p className="text-lg font-semibold text-gray-800">{weather.main.humidity}%</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Wind</p>
                <p className="text-lg font-semibold text-gray-800">{weather.wind.speed} m/s</p>
                <p className="text-xs text-gray-400">{windDirection(weather.wind.deg)}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Pressure</p>
                <p className="text-lg font-semibold text-gray-800">{weather.main.pressure}</p>
                <p className="text-xs text-gray-400">hPa</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Visibility</p>
                <p className="text-lg font-semibold text-gray-800">{(weather.visibility / 1000).toFixed(1)}</p>
                <p className="text-xs text-gray-400">km</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Sunrise</p>
                <p className="text-lg font-semibold text-gray-800">{formatTime(weather.sys.sunrise)}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Sunset</p>
                <p className="text-lg font-semibold text-gray-800">{formatTime(weather.sys.sunset)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
