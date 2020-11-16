import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Product, RouteParams } from '../../interfaces'
import Database from '../../functions/Database'

const Preview = () => {
  const { id } = useParams<RouteParams>()
  const [state, setState] = useState<Product | null>(null)
  useEffect(() => {
    ;(async () => {
      const db = await new Database().products
      const product = db.filter((e) => e.id === +id)
      if (product.length === 0) {
        window.location.href = '/400'
      } else {
        setState(product[0])
      }
    })()
  }, [id])
  return <>Preview {JSON.stringify(state)}</>
}

export default Preview
