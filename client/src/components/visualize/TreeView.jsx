import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'reactflow/dist/style.css'
import ControlsPanel from './ControlsPanel'
import { jsonToFlow } from '@/utils/jsonToFlow'
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap
} from 'reactflow'
import SearchBar from './SearchBar'

export default function TreeView({ json }) {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [message, setMessage] = useState('')
  const [rfInstance, setRfInstance] = useState(null)
  const reactFlowWrapper = useRef(null)

  // ✅ Build flow when JSON changes
  useEffect(() => {
    if (!json) {
      setNodes([])
      setEdges([])
      return
    }
    const { nodes: builtNodes, edges: builtEdges } = jsonToFlow(json)
    setNodes(builtNodes)
    setEdges(builtEdges)
  }, [json])

  // ✅ Handlers for ReactFlow state changes
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  // ✅ Store ReactFlow instance
  const onInit = useCallback((instance) => {
    setRfInstance(instance)
  }, [])

  // ✅ Search logic: highlight + center
  const searchAndFocus = (searchPath) => {
    setMessage('')

    if (!searchPath || !nodes.length) {
      setMessage('❌ No match found')
      return false
    }

    const normalized = normalizePath(searchPath)
    const found = nodes.find((n) => n.data.path === normalized)

    if (found) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === found.id
            ? {
                ...n,
                style: {
                  ...(n.style || {}),
                  border: '3px solid #22c55e', // highlight green
                  background: 'rgba(34, 197, 94, 0.1)'
                }
              }
            : {
                ...n,
                style: {
                  ...(n.style || {}),
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent'
                }
              }
        )
      )
      setSelectedNodeId(found.id)

      if (rfInstance) {
        rfInstance.setCenter(found.position.x, found.position.y, { zoom: 1.4 })
      }

      setMessage('✅ Match found')
      return true
    } else {
      setMessage('❌ No match found')
      return false
    }
  }

  // ✅ Clear highlight / selection
  const clearSelection = () => {
    setSelectedNodeId(null)
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...(n.style || {}),
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent'
        }
      }))
    )
    setMessage('')
  }

  // ✅ Copy path when user clicks node
  const onNodeClick = (event, node) => {
    if (node?.data?.path) {
      navigator.clipboard?.writeText(node.data.path)
      setMessage(`📋 Copied path: ${node.data.path}`)

      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? {
                ...n,
                style: {
                  ...(n.style || {}),
                  boxShadow: '0 0 0 4px rgba(59,130,246,0.25)'
                }
              }
            : n
        )
      )

      setTimeout(() => clearSelection(), 1200)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full text-gray-100">
      {/* 🔍 Search & Controls */}
      <div className="flex items-center gap-3 mb-2">
        <SearchBar onSearch={searchAndFocus} />
        <ControlsPanel
          onFit={() => rfInstance?.fitView()}
          onZoomIn={() => rfInstance?.zoomIn()}
          onZoomOut={() => rfInstance?.zoomOut()}
          onClear={clearSelection}
        />
        <div className="ml-auto text-sm">
          {message && (
            <span
              className={`${
                message.includes('✅') || message.includes('📋')
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {message}
            </span>
          )}
        </div>
      </div>

      {/* 🌳 ReactFlow Visualizer */}
      <div
        ref={reactFlowWrapper}
        className="reactflow-wrapper flex-1 rounded border border-gray-700 bg-gray-900"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          onNodeClick={onNodeClick}
          fitView
          nodesDraggable
          panOnDrag
          connectionLineType="smoothstep"
        >
          <MiniMap />
          <Background gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

/* ✅ Utility to normalize user-input JSON path */
function normalizePath(p) {
  if (!p) return p
  p = p.trim()
  if (p.startsWith('$')) return p
  if (p.startsWith('.')) return '$' + p
  return '$.' + p
}
