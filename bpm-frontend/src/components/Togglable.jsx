import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const baseButtonStyle = {
    margin: '8px',
  }

  const primaryButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#4f46e5',
    color: '#ffffff',
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button style={baseButtonStyle} onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button style={primaryButtonStyle} onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </div>
  )
}

export default Togglable
