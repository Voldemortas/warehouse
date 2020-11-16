import { Product } from '../interfaces'
import Database from './Database'

const product: Product = {
  id: -1,
  Name: 'Test',
  Active: true,
  Color: 'red',
  EAN: '123456',
  Type: 'type test',
  Weight: 20,
  Price: [{ value: 20, date: -1 }],
  Amount: [{ value: 20, date: -1 }],
}

export default async function addMock(): Promise<boolean> {
  let success = true
  success = success && (await new Database().removeAll()).success
  success = success && (await new Database().put(product)).success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '123',
        Name: 'test1',
        Color: 'green',
      })
    ).success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '234',
        Name: 'test2',
        Color: 'blue',
      })
    ).success
  success =
    success &&
    (await new Database().put({ ...product, EAN: '567', Name: 'test3' }))
      .success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '789',
        Name: 'test4',
        Color: 'green',
      })
    ).success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '012',
        Name: 'test5',
        Color: 'blue',
        Active: false,
      })
    ).success
  success =
    success &&
    (await new Database().put({ ...product, EAN: '345', Name: 'test6' }))
      .success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '678',
        Name: 'test7',
        Color: 'green',
        Active: false,
      })
    ).success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '901',
        Name: 'test8',
        Color: 'blue',
      })
    ).success
  success =
    success &&
    (await new Database().put({ ...product, EAN: '1234', Name: 'test9' }))
      .success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '2345',
        Name: 'test10',
        Color: 'green',
      })
    ).success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '3456',
        Name: 'test11',
        Color: 'blue',
        Active: false,
      })
    ).success
  success =
    success &&
    (await new Database().put({ ...product, EAN: '4567', Name: 'test12' }))
      .success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '5678',
        Name: 'test13',
        Color: 'green',
      })
    ).success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '6789',
        Name: 'test14',
        Color: 'blue',
      })
    ).success
  success =
    success &&
    (await new Database().put({ ...product, EAN: '7890', Name: 'test15' }))
      .success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '8901',
        Name: 'test16',
        Color: 'green',
      })
    ).success
  success =
    success &&
    (
      await new Database().put({
        ...product,
        EAN: '9012',
        Name: 'test17',
        Color: 'blue',
      })
    ).success
  success = success && (await new Database().remove(0)).success
  success = success && (await new Database().remove(10)).success
  success = success && (await new Database().remove(5)).success
  return success
}
