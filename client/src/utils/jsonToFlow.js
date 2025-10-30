// Converts JSON object to React Flow nodes & edges with simple hierarchical layout
let idCounter = 1

export function jsonToFlow(json) {
  idCounter = 1
  const nodes = []
  const edges = []
  const levels = {} // level -> count

  function nextId() { return String(idCounter++) }

  function placeNode(node, depth) {
    const index = (levels[depth] = (levels[depth] || 0) + 1) - 1
    const x = depth * 220
    const y = index * 90
    node.position = { x, y }
  }

  function build(value, label, parentId = null, path = '$', depth = 0) {
    const id = nextId()
    const type = getType(value)
    const nodeLabel = label || (type === 'array' ? 'array' : 'object')
    const displayLabel = type === 'primitive' ? `${label ?? path.split('.').slice(-1)[0]}: ${String(value)}` : (label ?? nodeLabel)

    const node = {
      id,
      data: {
        label: displayLabel,
        type,
        path,
        value
      },
      style: {
        padding: 8,
        borderRadius: 8,
        border: '1px solid rgba(0,0,0,0.08)',
        background: colorByType(type),
        color: '#fff',
        minWidth: 140
      }
    }
    placeNode(node, depth)
    nodes.push(node)

    if (parentId) {
      edges.push({
        id: `e${parentId}-${id}`,
        source: parentId,
        target: id,
        animated: false,
        style: { stroke: '#888' }
      })
    }

    if (type === 'object') {
      for (const key of Object.keys(value)) {
        const childPath = `${path}.${key}`
        build(value[key], key, id, childPath, depth + 1)
      }
    } else if (type === 'array') {
      for (let i = 0; i < value.length; i++) {
        const childPath = `${path}[${i}]`
        build(value[i], `[${i}]`, id, childPath, depth + 1)
      }
    }

    return id
  }

  build(json, 'root', null, '$', 0)
  return { nodes, edges }
}

function getType(v) {
  if (v === null) return 'primitive'
  if (Array.isArray(v)) return 'array'
  if (typeof v === 'object') return 'object'
  return 'primitive'
}

function colorByType(type) {
  if (type === 'object') return '#6d28d9' // purple
  if (type === 'array') return '#059669' // green
  return '#f97316' // orange for primitive
}
