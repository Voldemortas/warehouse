import React, { useState } from 'react'
import { Checkbox, TableCell } from 'semantic-ui-react'
import Database from '../functions/Database'
import { Product } from '../interfaces/index'
import showToast from './showToast'

const MyCheckbox = ({ product }: { product: Product }) => {
  const [state, setState] = useState<boolean>(product.Active)
  return (
    <Checkbox
      toggle
      checked={state}
      onChange={async (e) => {
        e.preventDefault()
        const response = await new Database().put({
          ...product,
          Active: !state,
        })
        showToast({
          ...response,
          message: response.success
            ? response.message
                .replace(/id \d+/, `EAN ${product.EAN}`)
                .replace('updated', state ? 'disabled' : 'enabled')
            : response.message,
        })
        if (!response.success) {
        } else {
          setState(!state)
        }
      }}
    />
  )
}

const ActionCell = ({
  product,
  setConfirmState,
}: {
  product: Product
  setConfirmState: (newState: { open: boolean; EAN: string | null }) => void
}) => {
  const isSmallScreen = () => window.innerWidth < 760
  return (
    <>
      {isSmallScreen() ? (
        <TableCell>
          <MyCheckbox product={product} />
          <br />
          <a href={`products/${product.id}/edit`}>
            <i className="icon edit" title="Edit" />
          </a>
          <a href={`products/${product.id}`}>
            <i className="icon eye" title="Preview" />
          </a>
          <i
            className="icon trash color_red cursor_pointer"
            title="Delete"
            onClick={() => {
              setConfirmState({ open: true, EAN: product.EAN })
            }}
          />
        </TableCell>
      ) : (
        <>
          <TableCell>
            <MyCheckbox product={product} />
          </TableCell>
          <TableCell>
            <a href={`products/${product.id}/edit`}>
              <i className="icon edit" title="Edit" />
            </a>
            <a href={`products/${product.id}`}>
              <i className="icon eye" title="Preview" />
            </a>
            <i
              className="icon trash color_red cursor_pointer"
              title="Delete"
              onClick={() => {
                setConfirmState({ open: true, EAN: product.EAN })
              }}
            />
          </TableCell>
        </>
      )}
    </>
  )
}

export default ActionCell
