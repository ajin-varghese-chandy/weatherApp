import { useState } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_KEY = '80f09416eaac725f72c70158ee28ac25'

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
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      const data = await res.json()

      if (data.cod !== 200) {
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Weather App
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {weather.name}, {weather.sys.country}
            </h2>

            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="w-16 h-16"
              />
              <p className="text-4xl font-bold text-gray-800">
                {Math.round(weather.main.temp)}°C
              </p>
            </div>

            <p className="text-gray-600 capitalize mb-6">
              {weather.weather[0].description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-500 text-sm">Humidity</p>
                <p className="text-xl font-semibold text-gray-800">{weather.main.humidity}%</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-500 text-sm">Wind Speed</p>
                <p className="text-xl font-semibold text-gray-800">{weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
