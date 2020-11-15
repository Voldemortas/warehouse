import React from 'react'
import { Product, sortKeys } from '../interfaces/index'

const HeaderCell = ({
  callback,
  text,
  sort,
}: {
  callback: (key: keyof Product) => void
  text: keyof Product
  sort: sortKeys
}) => {
  return (
    <div
      style={{ whiteSpace: 'nowrap' }}
      onClick={() => {
        callback(text)
      }}
    >
      {text}
      <i
        className={`sort${
          sort.direction === 0 || sort.key !== text
            ? ''
            : sort.direction === 1
            ? ' down'
            : ' up'
        } icon`}
      ></i>
    </div>
  )
}

export default HeaderCell
