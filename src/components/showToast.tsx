import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Message } from 'semantic-ui-react'
import { Message as message } from '../interfaces/index'

const showToast = (res: message) => {
  ReactDOM.render(
    React.createElement(Toast, {
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
}: {
  success: boolean
  message: string
  date: number
}) => {
  const [state, setState] = useState<{ visible: boolean }>({ visible: true })
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setState({ visible: true })
    return function cleanup() {
      setState({ visible: true })
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
        content={<div data-temp={date}>{message}</div>}
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
