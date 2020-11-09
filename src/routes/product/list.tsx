import React, { useRef } from 'react'
import { Product } from '../../interfaces'
import Database from '../../functions/Database'

const List = () => {
  const ref = useRef<HTMLButtonElement>(null)
  async function addMock() {
    ref.current!.setAttribute('disabled', 'true')
    const product: Product = {
      id: -1,
      Name: 'Test',
      Active: true,
      Color: 'red',
      EAN: '123456',
      Type: 'type test',
      Weight: 20,
    }
    await new Database().removeAll()
    await new Database().put(product)
    await new Database().put({ ...product, EAN: '123', Name: 'test1' })
    await new Database().put({ ...product, EAN: '234', Name: 'test2' })
    await new Database().put({ ...product, EAN: '567', Name: 'test3' })
    await new Database().put({ ...product, EAN: '789', Name: 'test4' })
    await new Database().put({ ...product, EAN: '012', Name: 'test5' })
    await new Database().remove(0)

    ref.current!.removeAttribute('disabled')
  }
  return (
    <>
      <button id="addDb" ref={ref} onClick={addMock}>
        Add mock database
      </button>
    </>
  )
}

export default List
