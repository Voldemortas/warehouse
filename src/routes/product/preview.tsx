import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Product, RouteParams } from '../../interfaces'
import Database from '../../functions/Database'
import {
  Segment,
  Tab,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
} from 'semantic-ui-react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const PreviewTable = ({
  Name,
  EAN,
  Type,
  Weight,
  Price,
  Amount,
  Active,
  Color,
  id,
}: Product) => {
  return (
    <Table
      inline
      inverted
      color="black"
      singleLine
      fixed
      celled
      unstackable
      className="preview__table"
    >
      <caption>Details</caption>
      <TableRow>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableCell>{Name}</TableCell>
      </TableRow>
      <TableRow>
        <TableHeaderCell>Color</TableHeaderCell>
        <TableCell>{Color}</TableCell>
      </TableRow>
      <TableRow>
        <TableHeaderCell>Type</TableHeaderCell>
        <TableCell>{Type}</TableCell>
      </TableRow>
      <TableRow>
        <TableHeaderCell>EAN</TableHeaderCell>
        <TableCell>{EAN}</TableCell>
      </TableRow>
      <TableRow>
        <TableHeaderCell>Weight</TableHeaderCell>
        <TableCell>{Weight} g</TableCell>
      </TableRow>
      <TableRow>
        <TableHeaderCell>Price</TableHeaderCell>
        <TableCell>{Price[0].value} €</TableCell>
      </TableRow>
      <TableRow>
        <TableHeaderCell>Amount</TableHeaderCell>
        <TableCell>{Amount[0].value}</TableCell>
      </TableRow>
      <TableRow>
        <TableHeaderCell>Active</TableHeaderCell>
        <TableCell>{Active ? 'Yes' : 'No'}</TableCell>
      </TableRow>
    </Table>
  )
}

const PriceChart = ({ Price }: Product) => {
  const PriceOptions: Highcharts.Options = {
    chart: { width: Math.min(window.innerWidth - 30, 472), height: 355 + 14 },
    title: {
      text: 'Price history',
    },
    series: [
      {
        type: 'line',
        name: 'Price over time €',
        data: Price.map((e) => e.value)
          .slice(0, 5)
          .reverse(),
      },
    ],
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'chart'}
      options={PriceOptions}
    />
  )
}

const AmountChart = ({ Amount }: Product) => {
  const PriceOptions: Highcharts.Options = {
    chart: { width: Math.min(window.innerWidth - 30, 472), height: 355 + 14 },
    title: {
      text: 'Amount history',
    },
    series: [
      {
        type: 'line',
        name: 'Amount over time €',
        data: Amount.map((e) => e.value)
          .slice(0, 5)
          .reverse(),
      },
    ],
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'chart'}
      options={PriceOptions}
    />
  )
}

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
  if (state === null) {
    return <></>
  }
  return (
    <>
      <Segment inverted className="preview">
        <Tab
          className="preview__tab"
          menu={{
            color: 'green',
            inverted: true,
            tabular: true,
          }}
          panes={[
            { menuItem: 'Details', render: () => <PreviewTable {...state} /> },
            {
              menuItem: 'Prices',
              render: () => <PriceChart {...state} />,
            },
            {
              menuItem: 'Amouts',
              render: () => <AmountChart {...state} />,
            },
          ]}
        />
        <a
          href="/products"
          style={{ position: 'absolute', left: 10, bottom: 10, fontSize: 15 }}
        >
          <i className="icon angle left" />
          Back to list
        </a>
        <a
          href={`/products/${id}/edit`}
          style={{ position: 'absolute', right: 10, bottom: 10, fontSize: 15 }}
          className="color_green"
        >
          Edit product
          <i className="icon angle right" />
        </a>
      </Segment>
    </>
  )
}

export default Preview
