import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '../ui/textarea'

export default function JsonInput({ initialValue = '', onVisualize, onClear, error: externalError }) {
  const [text, setText] = useState(initialValue)
  const [error, setError] = useState(null)

  
  useEffect(() => {
    setError(externalError)
  }, [externalError])

  const validateJSON = (input) => {
    if (!input.trim()) {
      setError('JSON cannot be empty')
      return false
    }
    try {
      JSON.parse(input)
      setError(null)
      return true
    } catch (e) {
      setError(e.message)
      return false
    }
  }

  const handleVisualize = () => {
    if (validateJSON(text)) {
      try {
        const formatted = JSON.stringify(JSON.parse(text), null, 2)
        setText(formatted)
        onVisualize(formatted)
      } catch (e) {
        setError('Unexpected error formatting JSON')
      }
    }
  }

  const handleClear = () => {
    setText('')
    setError('JSON cannot be empty')
    onClear()
  }

  const handleChange = (e) => {
    const value = e.target.value
    setText(value)
    validateJSON(value)
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow flex flex-col gap-3 h-full">
      <h2 className="text-lg font-semibold mb-1">Enter JSON Data</h2>

      <Textarea
        className={`w-full flex-1 p-3 rounded-md font-mono text-sm resize-none bg-gray-900 text-gray-100 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        }`}
        rows={14}
        placeholder={`Paste or type JSON here, e.g.:
{
  "user": {
    "name": "Mukesh",
    "age": 23
  }
}`}
        value={text}
        onChange={handleChange}
      />

      {error && (
        <div className="text-red-400 text-sm -mt-2">
           Invalid JSON: {error}
        </div>
      )}

      <div className="flex justify-between mt-2">
        <Button onClick={handleVisualize}>Visualize</Button>
        <Button onClick={handleClear}>Clear</Button>
      </div>
    </div>
  )
}
