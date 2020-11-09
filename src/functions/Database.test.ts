import Database from './Database'
import { Product } from '../interfaces'

class LocalStorageMock {
  private store: { [key: string]: string } | null
  length = -1
  key = () => ''
  constructor() {
    this.store = null
  }

  clear() {
    this.store = null
  }

  getItem(key: string) {
    return this.store![key]
  }

  setItem(key: string, value: string) {
    this.store = {}
    this.store[key] = value
  }

  removeItem(key: string) {
    this.store = null
  }
}

global.localStorage = new LocalStorageMock()

const product: Product = {
  id: -1,
  Name: 'Test',
  Active: true,
  Color: 'red',
  EAN: '123456',
  Type: 'type test',
  Weight: 20,
}

test('Database Add', async () => {
  localStorage.clear()
  const answer = await new Database().put(product)
  expect(answer.success).toBeTruthy()
  const dbItem = await new Database().products
  expect(Database.isEqual(dbItem[0], product, false)).toBeTruthy()
  const answer2 = await new Database().put(product)
  expect(answer2.success).toBeFalsy()
  const product2 = { ...product, EAN: '1234567' }
  const answer3 = await new Database().put(product2)
  expect(answer3.success).toBeTruthy()
  //@ts-ignore
  expect((await new Database().data()).nextId).toBe(2)
})

test('Database Edit', async () => {
  const answer = await new Database().put({ ...product, id: 0 })
  expect(answer.success).toBeFalsy()
  const answer2 = await new Database().put({ ...product, id: 1 })
  expect(answer2.success).toBeFalsy()
  const answer3 = await new Database().put({
    ...product,
    id: 1,
    EAN: '12345678',
  })
  expect(answer3.success).toBeTruthy()
})

test('Database Delete', async () => {
  const answer0 = await new Database().remove(-1)
  expect(answer0.success).toBeFalsy()
  await new Database().put({ ...product, EAN: '234' })
  const answer = await new Database().remove(0)
  expect(answer.success).toBeTruthy()
  const answer2 = await new Database().remove(0)
  expect(answer2.success).toBeFalsy()
  await new Database().remove(1)
  expect((await new Database().products).length).toBe(1)
})
