import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Message } from 'semantic-ui-react'
import { Message as message } from '../interfaces/index'

const showToast = (res: message, handler = () => {}) => {
  ReactDOM.render(
    React.createElement(Toast, {
      handler,
      ...res,
      date: new Date().getTime(),
    }),
    document.getElementById('portal')
  )
}

const Toast = ({
  success,
  message,
  date,
  handler,
}: {
  success: boolean
  message: string
  date: number
  handler: () => void
}) => {
  const [state, setState] = useState<{ visible: boolean }>({ visible: true })
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setState({ visible: true })
    return function cleanup() {
      setState({ visible: false })
    }
  }, [message])
  useEffect(() => {
    ;(async () => {
      if (!state.visible) {
        return
      }
      setTimeout(() => {
        ref.current!.style.left = `calc(50% - ${
          ref.current!.offsetWidth / 2
        }px)`
      }, 1)
    })()
  })
  const handleDismiss = () => {
    ReactDOM.unmountComponentAtNode(
      document.getElementById('portal') as Element
    )
  }
  return state.visible ? (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: 'calc(50% - 126px)',
      }}
      className="popup"
    >
      <Message
        className="message"
        compact
        success={success}
        error={!success}
        onDismiss={handleDismiss}
        content={
          <div data-temp={date}>
            <span
              onClick={handler}
              style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}
            >
              {message}
            </span>
          </div>
        }
      />
    </div>
  ) : (
    <>
      <Message
        compact
        success={success}
        error={!success}
        onDismiss={handleDismiss}
        content={<div data-temp={date}>{message}</div>}
        hidden
      />
    </>
  )
}

export default showToast
