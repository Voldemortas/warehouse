import React, { useState } from 'react'
import { Form, Segment } from 'semantic-ui-react'
import showToast from '../../components/showToast'
import Database from '../../functions/Database'

type typeInput = {
  success: boolean | null
  message: string | undefined
  value: string | number | boolean
}

const defaultInput: typeInput = { success: null, message: '', value: '' }

const Create = () => {
  const [state, setState] = useState<{
    Name: typeInput
    Color: typeInput
    Type: typeInput
    Weight: typeInput
    EAN: typeInput
    Active: typeInput
  }>({
    Name: { ...defaultInput, message: `Name cannot be empty` },
    Color: { ...defaultInput, success: true },
    Type: { ...defaultInput, message: `Type cannot be empty` },
    Weight: { message: '', value: 0, success: true },
    EAN: { ...defaultInput, message: `EAN cannot be empty` },
    Active: { value: false, message: '', success: true },
  })
  return (
    <Segment inverted raised className="form">
      <Form
        unstackable
        onSubmit={async () => {
          let success = true
          let newState = { ...state }
          if (state.Name.success !== true) {
            success = false
            newState = { ...newState, Name: { ...state.Name, success: false } }
          }
          if (state.Type.success !== true) {
            success = false
            newState = { ...newState, Type: { ...state.Type, success: false } }
          }
          if (state.EAN.success !== true) {
            success = false
            newState = {
              ...newState,
              EAN: {
                ...state.EAN,
                success: false,
                message:
                  state.EAN.value === ''
                    ? 'EAN cannot be empty'
                    : 'Such EAN is already taken',
              },
            }
          }
          if (!success) {
            setState(newState)
            return
          }
          const response = await new Database().put({
            id: -1,
            Name: state.Name.value + '',
            EAN: state.EAN.value + '',
            Active: state.Active.value as boolean,
            Type: state.Type.value + '',
            Weight: +state.Weight.value,
            Color: state.Color.value + '',
          })
          showToast(
            {
              ...response,
              message: response.message + '\n(Click here to follow)',
            },
            () => {
              //@ts-ignore
              window.location = `/products/${response.id}`
            }
          )
        }}
      >
        <Form.Group widths="equal">
          <Form.Input
            label={
              state.Name.success === false ? state.Name.message : 'Product name'
            }
            placeholder="Product name"
            onChange={(e) => {
              setState({
                ...state,
                Name: {
                  ...state.Name,
                  success: e.target.value !== '',
                  value: e.target.value,
                },
              })
            }}
            error={state.Name.success === false}
          />
          <Form.Input
            label="Product color"
            placeholder="Product color"
            onChange={(e) => {
              setState({
                ...state,
                Color: {
                  ...state.Color,
                  value: e.target.value,
                },
              })
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label={
              state.Type.success === false ? state.Type.message : 'Product Type'
            }
            placeholder="Product type"
            onChange={(e) => {
              setState({
                ...state,
                Type: {
                  ...state.Type,
                  success: e.target.value !== '',
                  value: e.target.value,
                },
              })
            }}
            error={state.Type.success === false}
          />
          <Form.Input
            label="Product weight (g)"
            placeholder="Product weight"
            type="number"
            defaultValue={state.Weight.value}
            onChange={(e) => {
              setState({
                ...state,
                Type: {
                  ...state.Weight,
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
            label={state.EAN.success === false ? state.EAN.message : 'EAN'}
            error={state.EAN.success === false}
            onChange={async (e) => {
              if (e.target.value === '') {
                setState({
                  ...state,
                  EAN: {
                    success: false,
                    message: 'EAN cannot be empty',
                    value: '',
                  },
                })
              } else {
                const products = await new Database().products
                setState({
                  ...state,
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
          />
          <Form.Checkbox
            label="Published?"
            fitted
            className="form__checkbox"
            onChange={(e, data) => {
              setState({
                ...state,
                Active: {
                  value: data.checked!,
                  success: true,
                  message: ``,
                },
              })
            }}
          />
        </Form.Group>
        <Form.Button className="form__button">Insert new product!</Form.Button>
      </Form>
    </Segment>
  )
}

export default Create
