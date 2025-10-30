import { Button } from '@/components/ui/button'
import { JsonInput, TreeView } from '@/components/visualize'
import { logoutUser } from '@/store/auth-slice'
import { LogOut } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export default function Home() {
  const [jsonText, setJsonText] = useState('')
  const [parsedJson, setParsedJson] = useState(null)
  const [error, setError] = useState(null)


  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dark')
  }, [])

  const handleVisualize = (text) => {
    setError(null)
    try {
      const parsed = JSON.parse(text)
      setParsedJson(parsed)
      setJsonText(text)
    } catch (e) {
      setError(e.message)
      setParsedJson(null)
    }
  }

  const handleClear = () => {
    setJsonText('')
    setParsedJson(null)
    setError(null)
  }

  const dispatch = useDispatch();
  function handleLogout(){
    dispatch(logoutUser());
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 transition-colors duration-300">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">JSON Tree Visualizer</h1>
          <div className='flex flex-1 justify-end'>
        <Button onClick={handleLogout} className='inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow'>
          <LogOut />
          Logout
        </Button>
      </div>
      </header>

      <main
        className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4"
        style={{ height: 'calc(100vh - 72px)' }}
      >
        <section className="lg:col-span-1 flex flex-col gap-3">
          <JsonInput
            initialValue={`{\n  "user": {\n    "name": "Mukesh",\n    "age": 23,\n    "address": { "city": "Mumbai", "zip": "400001" }\n  },\n  "items": [{ "name": "Shoes", "price": 49.99 }, { "name": "Hat", "price": 19.99 }]\n}`}
            onVisualize={handleVisualize}
            onClear={handleClear}
            error={error}
          />
        </section>

        <section className="lg:col-span-2 bg-gray-800 rounded shadow p-2 flex flex-col transition-colors duration-300">
          <TreeView json={parsedJson} />
        </section>
      </main>
    </div>
  )
}
