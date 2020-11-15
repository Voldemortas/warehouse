import React, { useEffect, useRef, useState } from 'react'
import { Product, sortKeys } from '../../interfaces'
import Database from '../../functions/Database'
import mock from '../../functions/addMock'
import showToast from '../../components/showToast'
import HeaderCell from '../../components/HeaderCell'
import {
  Button,
  Confirm,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'semantic-ui-react'
import ActionCell from '../../components/ActionCell'

const List = () => {
  const ref = useRef<Button>(null)
  const [state, setState] = useState<{
    products: Product[]
    sort: sortKeys
    page: number
  }>({
    products: [],
    sort: { key: 'id', direction: 0 },
    page: 0,
  })
  const [confirmState, setConfirmState] = useState<{
    open: boolean
    EAN: string | null
  }>({ open: false, EAN: null })
  useEffect(() => {
    console.log(state)
    ;(async () => {
      const response = await new Database().products
      let currentPage = +((window.location.hash as string) || '#1').replace(
        '#',
        ''
      )
      if (currentPage > Math.ceil(response.length / 8)) {
        currentPage = Math.ceil(response.length / 8)
        window.location.replace(`#${currentPage}`)
      }
      if (currentPage < 1) {
        currentPage = 1
        window.location.replace(`#${currentPage}`)
      }
      setState({
        ...state,
        products: response,
        page: currentPage,
      })
    })()
    // eslint-disable-next-line
  }, [state.products.length])
  const addMock = async () => {
    //@ts-ignore
    const realRef = ref.current!.ref.current as HTMLButtonElement
    realRef.setAttribute('disabled', 'true')
    const loadMock = await mock()
    if (!loadMock) {
      showToast({ success: false, message: 'Failed to use mock database' })
    }
    setState({ ...state, products: [], page: 1 })
    setState({ ...state, products: await new Database().products })
    window.location.replace(`#1`)
    realRef.removeAttribute('disabled')
  }
  const isSmallScreen = () => window.innerWidth < 600
  const sort = (key: keyof Product) => {
    setState({
      ...state,
      sort: {
        key,
        direction:
          state.sort.key === key
            ? (((state.sort.direction + 1) % 3) as 0 | 1 | 2)
            : 1,
      },
    })
  }
  const realSort = (a: Product, b: Product): number => {
    if (state.sort.direction === 0) {
      return a.id - b.id
    }
    const numbers = ['']
    if (numbers.includes(state.sort.key)) {
      const key = state.sort.key as 'id'
      return state.sort.direction === 1 ? a[key] - b[key] : b[key] - a[key]
    } else {
      const key = state.sort.key
      return state.sort.direction === 1
        ? a[key].toLocaleString().localeCompare(b[key].toLocaleString())
        : -a[key].toLocaleString().localeCompare(b[key].toLocaleString())
    }
  }
  return (
    <div style={{ display: 'inline-block' }}>
      <Confirm
        open={confirmState.open}
        onCancel={() => {
          setConfirmState({ open: false, EAN: null })
        }}
        onConfirm={async () => {
          const response = await new Database().remove(
            state.products.filter((e) => e.EAN === confirmState.EAN)[0].id
          )
          if (response.success) {
            setState({
              ...state,
              products: [
                ...state.products.filter((e) => e.EAN !== confirmState.EAN),
              ],
            })
          }
          showToast(response)
          setConfirmState({ open: false, EAN: null })
        }}
        cancelButton="Never mind"
        confirmButton="Yes, remove it"
        content={`Do you want to remove a product with EAN ${confirmState.EAN}?`}
      />
      <Table
        inline
        inverted
        color="black"
        singleLine
        fixed
        celled
        unstackable
        className="listTable"
      >
        {isSmallScreen() ? (
          <>
            <TableHeader>
              <Table.Row>
                <TableHeaderCell>
                  <HeaderCell text="Name" callback={sort} sort={state.sort} />
                  <HeaderCell text="Color" callback={sort} sort={state.sort} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <HeaderCell text="Type" callback={sort} sort={state.sort} />
                  <HeaderCell text="Weight" callback={sort} sort={state.sort} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <HeaderCell text="EAN" callback={sort} sort={state.sort} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <HeaderCell text="Active" callback={sort} sort={state.sort} />
                  Action
                </TableHeaderCell>
              </Table.Row>
            </TableHeader>
            <TableBody>
              {state.products
                .sort(realSort)
                .slice(8 * (state.page - 1), 8 * state.page + 1)
                .map((e) => (
                  <TableRow key={e.EAN}>
                    <TableCell>
                      {e.Name}
                      <br />
                      {e.Color}
                    </TableCell>
                    <TableCell>
                      {e.Type}
                      <br />
                      {e.Weight}
                    </TableCell>
                    <TableCell>{e.EAN}</TableCell>
                    <ActionCell
                      setConfirmState={(newstate) => {
                        setConfirmState(newstate)
                      }}
                      product={e}
                    />
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableHeaderCell colSpan="3" className="align_left">
                  <Pagination
                    onPageChange={(e, { activePage }) => {
                      window.location.replace(`#${activePage}`)
                      setState({ ...state, page: activePage as number })
                    }}
                    boundaryRange={0}
                    activePage={state.page}
                    ellipsisItem={null}
                    firstItem={true}
                    lastItem={true}
                    siblingRange={1}
                    totalPages={Math.ceil(state.products.length / 8)}
                  />
                </TableHeaderCell>
                <TableHeaderCell className="listTable__mock">
                  <a
                    href="products/create"
                    style={{ fontSize: 20 }}
                    className="color_green"
                  >
                    Add
                  </a>
                </TableHeaderCell>
              </TableRow>
            </TableFooter>
          </>
        ) : (
          <>
            <TableHeader>
              <Table.Row>
                <TableHeaderCell>
                  <HeaderCell text="Name" callback={sort} sort={state.sort} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <HeaderCell text="Color" callback={sort} sort={state.sort} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <HeaderCell text="Type" callback={sort} sort={state.sort} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <HeaderCell text="Weight" callback={sort} sort={state.sort} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <HeaderCell text="EAN" callback={sort} sort={state.sort} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <HeaderCell text="Active" callback={sort} sort={state.sort} />
                </TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </Table.Row>
            </TableHeader>{' '}
            <TableBody>
              {state.products
                .sort(realSort)
                .slice(8 * (state.page - 1), 8 * state.page + 1)
                .map((e) => (
                  <TableRow key={e.EAN}>
                    <TableCell>{e.Name}</TableCell>
                    <TableCell>{e.Color}</TableCell>
                    <TableCell>{e.Type}</TableCell>
                    <TableCell>{e.Weight}</TableCell>
                    <TableCell>{e.EAN}</TableCell>
                    <ActionCell
                      setConfirmState={(newstate) => {
                        setConfirmState(newstate)
                      }}
                      product={e}
                    />
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableHeaderCell colSpan="5" className="align_left">
                  <Pagination
                    onPageChange={(e, { activePage }) => {
                      window.location.replace(`#${activePage}`)
                      setState({ ...state, page: activePage as number })
                    }}
                    boundaryRange={0}
                    activePage={state.page}
                    ellipsisItem={null}
                    firstItem={true}
                    lastItem={true}
                    siblingRange={1}
                    totalPages={Math.ceil(state.products.length / 8)}
                  />
                </TableHeaderCell>
                <TableHeaderCell colSpan="2" className="listTable__mock">
                  <a
                    href="products/create"
                    style={{ fontSize: 20 }}
                    className="color_green"
                  >
                    Add
                  </a>
                </TableHeaderCell>
              </TableRow>
            </TableFooter>
          </>
        )}
      </Table>
      <Button id="addDb" ref={ref} onClick={addMock}>
        Use mock data
      </Button>
    </div>
  )
}

export default List
