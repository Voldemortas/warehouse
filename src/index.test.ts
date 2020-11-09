import puppeteer from 'puppeteer'
jest.setTimeout(10000)
let browser: puppeteer.Browser | null = null
let page: puppeteer.Page | null = null
beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser?.newPage()
})

test('Testing List', async () => {
  await page?.goto('http://localhost:2999')
  await page?.waitForTimeout(200)
  expect(page?.url()).toBe('http://localhost:2999/products')
  await page?.evaluate(() => {
    localStorage.setItem(
      'products',
      JSON.stringify({
        products: [
          {
            id: 1,
            Name: 'test1',
            Active: true,
            Color: 'red',
            EAN: '123',
            Type: 'type test',
            Weight: 20,
          },
          {
            id: 2,
            Name: 'test2',
            Active: true,
            Color: 'red',
            EAN: '234',
            Type: 'type test',
            Weight: 20,
          },
          {
            id: 3,
            Name: 'test3',
            Active: true,
            Color: 'red',
            EAN: '567',
            Type: 'type test',
            Weight: 20,
          },
          {
            id: 4,
            Name: 'test4',
            Active: true,
            Color: 'red',
            EAN: '789',
            Type: 'type test',
            Weight: 20,
          },
          {
            id: 5,
            Name: 'test5',
            Active: true,
            Color: 'red',
            EAN: '012',
            Type: 'type test',
            Weight: 20,
          },
        ],
        nextId: 6,
      })
    )
  })
})

test('Edit route', async () => {
  await page?.goto('http://localhost:2999/products/0/edit')
  await page?.waitForTimeout(200)
  expect(page?.url()).toBe('http://localhost:2999/products')

  await page?.goto('http://localhost:2999/products/1/edit')
  await page?.waitForTimeout(200)
  expect(page?.url()).toBe('http://localhost:2999/products/1/edit')

  await page?.goto('http://localhost:2999/products/6/edit')
  await page?.waitForTimeout(200)
  expect(page?.url()).toBe('http://localhost:2999/products')
})

test('Preview route', async () => {
  await page?.goto('http://localhost:2999/products/0')
  await page?.waitForTimeout(200)
  expect(page?.url()).toBe('http://localhost:2999/products')

  await page?.goto('http://localhost:2999/products/1')
  await page?.waitForTimeout(200)
  expect(page?.url()).toBe('http://localhost:2999/products/1')

  await page?.goto('http://localhost:2999/products/6')
  await page?.waitForTimeout(200)
  expect(page?.url()).toBe('http://localhost:2999/products')
})

test('Create route', async () => {
  await page?.goto('http://localhost:2999/products/create')
  await page?.waitForTimeout(200)
  expect(page?.url()).toBe('http://localhost:2999/products/create')
})

afterAll(() => {
  browser?.close()
})
