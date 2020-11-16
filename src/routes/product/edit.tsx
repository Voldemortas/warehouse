import React from 'react'
import { useParams } from 'react-router-dom'
import { RouteParams } from '../../interfaces'
import ProductForm from '../../components/ProductForm'

const Edit = () => {
  const { id } = useParams<RouteParams>()
  return (
    <>
      <ProductForm id={+id} />
    </>
  )
}

export default Edit
