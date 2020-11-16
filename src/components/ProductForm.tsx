import React, { useState, useEffect } from 'react'
import { Form, Segment } from 'semantic-ui-react'
import showToast from './showToast'
import Database from '../functions/Database'

type typeInput = {
  success: boolean | null
  message: string | undefined
  value: string | number | boolean
}

const defaultInput: typeInput = { success: null, message: '', value: '' }

type StateType = {
  Name: typeInput
  Color: typeInput
  Type: typeInput
  Weight: typeInput
  EAN: typeInput
  Active: typeInput
  Price: typeInput
  Amount: typeInput
}

const ProductForm = ({ id = -1 }: { id: number }) => {
  const [state, setState] = useState<StateType | null>(null)
  useEffect(() => {
    ;(async () => {
      const products = await new Database().products
      const elements = products.filter((e) => e.id === id)
      if (elements.length === 0 && id !== -1) {
        //@ts-ignore
        window.location = '/400'
      }
      let temp = elements[0]
      const defaultState: StateType = {
        Name: { ...defaultInput, message: `Name cannot be empty` },
        Color: { ...defaultInput, success: true },
        Type: { ...defaultInput, message: `Type cannot be empty` },
        Weight: { message: '', value: 0, success: true },
        EAN: { ...defaultInput, message: `EAN cannot be empty` },
        Active: { value: false, message: '', success: true },
        Price: { value: 0, message: '', success: true },
        Amount: { value: 0, message: '', success: true },
      }
      if (id === -1) {
        setState(defaultState)
      } else {
        setState({
          ...defaultState,
          Name: { ...defaultState!.Name, value: temp.Name, success: true },
          Color: { ...defaultState!.Color, value: temp.Color, success: true },
          EAN: { ...defaultState!.EAN, value: temp.EAN, success: true },
          Type: { ...defaultState!.Type, value: temp.Type, success: true },
          Weight: {
            ...defaultState!.Weight,
            value: temp.Weight,
            success: true,
          },
          Active: { ...defaultState!.Active, value: temp.Active },
          Price: {
            ...defaultState!.Price,
            value: temp.Price[0].value,
            success: true,
          },
          Amount: {
            ...defaultState!.Amount,
            value: temp.Amount[0].value,
            success: true,
          },
        })
      }
    })()
  }, [id])
  if (state === null) {
    return <></>
  }
  return (
    <Segment inverted raised className="form">
      <Form
        unstackable
        onSubmit={async () => {
          let success = true
          let newState = { ...state! }
          if (state?.Name.success !== true) {
            success = false
            newState = { ...newState, Name: { ...state?.Name, success: false } }
          }
          if (state?.Type.success !== true) {
            success = false
            newState = { ...newState, Type: { ...state?.Type, success: false } }
          }
          if (state?.EAN.success !== true) {
            success = false
            newState = {
              ...newState,
              EAN: {
                ...state?.EAN,
                success: false,
                message:
                  state?.EAN.value === ''
                    ? 'EAN cannot be empty'
                    : 'Such EAN is already taken',
              },
            }
          }
          if (!success) {
            setState(newState)
            return
          }
          const dataToSend = {
            id,
            Name: state?.Name.value + '',
            EAN: state?.EAN.value + '',
            Active: state?.Active.value as boolean,
            Type: state?.Type.value + '',
            Weight: +state?.Weight.value,
            Color: state?.Color.value + '',
            Amount: [{ value: +state?.Amount.value, date: -1 }],
            Price: [{ value: +state?.Price.value, date: -1 }],
          }
          const response = await new Database().put(dataToSend)
          showToast(
            {
              ...response,
              message: response.message + '\n(Click here to follow)',
            },
            () => {
              //@ts-ignore
              window.location = `/products/${response.id || id}`
            }
          )
        }}
      >
        <Form.Group widths="equal">
          <Form.Input
            label={
              state?.Name.success === false
                ? state?.Name.message
                : 'Product name'
            }
            placeholder="Product name"
            onChange={(e) => {
              setState({
                ...state!,
                Name: {
                  ...state?.Name,
                  success: e.target.value !== '',
                  value: e.target.value,
                },
              })
            }}
            error={state?.Name.success === false}
            defaultValue={state?.Name.value}
          />
          <Form.Input
            label="Product color"
            placeholder="Product color"
            onChange={(e) => {
              setState({
                ...state!,
                Color: {
                  ...state?.Color,
                  value: e.target.value,
                },
              })
            }}
            defaultValue={state?.Color.value}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label={
              state?.Type.success === false
                ? state?.Type.message
                : 'Product Type'
            }
            placeholder="Product type"
            onChange={(e) => {
              setState({
                ...state!,
                Type: {
                  ...state?.Type,
                  success: e.target.value !== '',
                  value: e.target.value,
                },
              })
            }}
            error={state?.Type.success === false}
            defaultValue={state?.Type.value}
          />
          <Form.Input
            label="Product weight (g)"
            placeholder="Product weight"
            type="number"
            defaultValue={state?.Weight.value}
            onChange={(e) => {
              setState({
                ...state!,
                Type: {
                  ...state?.Weight,
                  value: Math.max(+e.target.value, 0),
                },
              })
              e.target.value = Math.max(+e.target.value, 0) + ''
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label="Product price (€)"
            placeholder="Product price"
            type="number"
            defaultValue={state?.Price.value}
            onChange={(e) => {
              setState({
                ...state!,
                Price: {
                  ...state?.Price,
                  value: Math.max(+e.target.value, 0),
                },
              })
              e.target.value = Math.max(+e.target.value, 0) + ''
            }}
          />
          <Form.Input
            label="Amout of products"
            placeholder="Amount"
            type="number"
            defaultValue={state?.Amount.value}
            onChange={(e) => {
              setState({
                ...state!,
                Amount: {
                  ...state?.Amount,
                  value: Math.max(+e.target.value, 0),
                },
              })
              e.target.value = Math.max(+e.target.value, 0) + ''
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            placeholder="EAN"
            label={state?.EAN.success === false ? state?.EAN.message : 'EAN'}
            error={state?.EAN.success === false}
            onChange={async (e) => {
              if (e.target.value === '') {
                setState({
                  ...state!,
                  EAN: {
                    success: false,
                    message: 'EAN cannot be empty',
                    value: '',
                  },
                })
              } else {
                const products = await new Database().products
                setState({
                  ...state!,
                  EAN: {
                    success:
                      products.filter((pr) => pr.EAN === e.target.value)
                        .length === 0,
                    message: 'Such EAN is already taken',
                    value: e.target.value,
                  },
                })
              }
            }}
            defaultValue={state?.EAN.value}
          />
          <Form.Checkbox
            label="Published?"
            fitted
            className="form__checkbox"
            onChange={(e, data) => {
              setState({
                ...state!,
                Active: {
                  value: data.checked!,
                  success: true,
                  message: ``,
                },
              })
            }}
            defaultChecked={state?.Active.value as boolean}
          />
        </Form.Group>
        <Form.Button className="form__button">
          {id === -1 ? 'Insert new product!' : 'Update product!'}
        </Form.Button>
      </Form>
    </Segment>
  )
}

export default ProductForm
