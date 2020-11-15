import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { Product, RouteParams } from '../../interfaces'
import Database from '../../functions/Database'

const Edit = () => {
  const { id } = useParams<RouteParams>()
  const [state, setState] = useState<{
    product: Product | null
    redirect: boolean
  }>({ product: null, redirect: false })
  useEffect(() => {
    ;(async () => {
      const db = await new Database().products
      const product = db.filter((e) => e.id === +id)
      if (product.length === 0) {
        setState({ ...state, redirect: true })
      } else {
        setState({ ...state, product: product[0] })
      }
    })()
    // eslint-disable-next-line
  }, [id])
  return state.redirect ? (
    <Redirect to="/products" />
  ) : (
    <>Edit {JSON.stringify(state.product)}</>
  )
}

export default Edit
