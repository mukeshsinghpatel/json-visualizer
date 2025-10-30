import React, { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group'
import { SearchIcon } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')
  const [message, setMessage] = useState('')

  const handleSearch = () => {
    if (!q.trim()) {
      setMessage('Please enter a path')
      setTimeout(() => setMessage(''), 2000)
      return
    }

    const found = onSearch(q.trim())

    if (found) {
      setMessage('Match found')
    } else {
      setMessage('No match found')
    }

    // Auto-clear message after 2 seconds
    setTimeout(() => setMessage(''), 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <InputGroup>
        <InputGroupInput
          placeholder="Search path e.g. $.user.address.city or items[0].name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon>
          <SearchIcon className="text-gray-500" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={handleSearch}>Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {message && (
        <div
          className={`text-sm ${
            message.includes('✅') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
