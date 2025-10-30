import React from 'react'
import { Button } from '../ui/button'

export default function ControlsPanel({ onFit, onZoomIn, onZoomOut, onClear }) {
  return (
    <div className="flex gap-2">
      <Button onClick={onZoomIn} >Zoom In</Button>
      <Button onClick={onZoomOut} >Zoom Out</Button>
      <Button onClick={onFit} >Fit View</Button>
      <Button onClick={onClear} >Clear Highlight</Button>
    </div>
  )
}
