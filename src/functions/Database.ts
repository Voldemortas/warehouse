import { Product, Message, numDatePair } from '../interfaces'

//pseudo frontend<->backend
export default class Database {
  private data(): Promise<{ products: Product[]; nextId: number }> {
    return new Promise((resolve, reject) => {
      setTimeout(
        () =>
          resolve(
            JSON.parse(
              localStorage.getItem('products') ||
                '{"products": [], "nextId": 0}'
            )
          ),
        10
      )
    })
  }
  get products(): Promise<Product[]> {
    return new Promise<Product[]>(async (resolve, reject) => {
      resolve((await this.data()).products)
    })
  }
  async put(value: Product): Promise<Message> {
    //if ean is in use ->
    //  return false
    //if id is -1 :
    //  add
    //if is equal to itself
    //  return was equal
    //else
    //  update
    const uploadDate = new Date().getTime()
    const { products, nextId } = await this.data()
    value = { ...value }
    value.Price[0].date = uploadDate
    value.Amount[0].date = uploadDate

    if (products.some((e) => e.EAN === value.EAN && e.id !== value.id)) {
      return {
        success: false,
        message: `Product with EAN ${value.EAN} alreayd exists`,
      }
    }
    if (!Database.hasAllProps(value)) {
      return {
        success: false,
        message: `The new Product has wrong attributes`,
      }
    }
    if (value.id === -1) {
      value.id = nextId
      localStorage.setItem(
        'products',
        JSON.stringify({ products: [...products, value], nextId: nextId + 1 })
      )
      return {
        success: true,
        message: `New Product ${value.Name} (${value.EAN}) was added`,
        //@ts-ignore
        id: nextId,
      }
    }
    if (products.some((e) => Database.isEqual(e, value, true))) {
      return { success: false, message: `No changes were made` }
    }
    console.log(value.Price)
    const newProducts = [
      ...products.map((e) =>
        e.id === value.id
          ? {
              ...value,
              Amount: [...value.Amount, ...e.Amount],
              Price: [...value.Price, ...e.Price],
            }
          : e
      ),
    ]
    console.log(newProducts.filter((e) => e.id === value.id)[0])
    localStorage.setItem(
      'products',
      JSON.stringify({
        products: newProducts
          .map((e) => {
            let temp = { ...e }
            temp.Price = e.Price.reduce((acc: numDatePair[], cur, index) => {
              if (index === 0) {
                return [cur]
              }
              if (acc[index - 1].value === cur.value) {
                console.log(acc[index - 1], cur)
                return acc
              }
              return [...acc, cur]
            }, [])
            return temp
          })
          .map((e) => {
            let temp = { ...e }
            temp.Amount = e.Amount.reduce((acc: numDatePair[], cur, index) => {
              if (index === 0) {
                return [cur]
              }
              if (acc[index - 1].value === cur.value) {
                return acc
              }
              return [...acc, cur]
            }, [])
            return temp
          }),
        nextId,
      })
    )
    return {
      success: true,
      message: `The Product with id ${value.id} was updated`,
    }
  }

  async remove(id: number): Promise<Message> {
    const { products, nextId } = await this.data()
    if (!products.some((e) => e.id === id)) {
      return { success: false, message: `No Product with id ${id} exists` }
    }
    localStorage.setItem(
      'products',
      JSON.stringify({
        products: [...products.filter((e) => e.id !== id)],
        nextId,
      })
    )
    return {
      success: true,
      message: `The Product wiht id ${id} was deleted`,
    }
  }

  static isEqual(a: Product, b: Product, id = false): boolean {
    const equality =
      a.Active === b.Active &&
      a.Color === b.Color &&
      a.EAN === b.EAN &&
      a.Name === b.Name &&
      a.Type === b.Type &&
      a.Weight === b.Weight &&
      a.Price[0].value === b.Price[0].value &&
      a.Amount[0].value === b.Amount[0].value
    return id ? equality && a.id === b.id : equality
  }
  private static hasAllProps(product: Product): boolean {
    return (
      typeof product.id === 'number' &&
      typeof product.Weight === 'number' &&
      product.Weight >= 0 &&
      typeof product.Type === 'string' &&
      typeof product.Name === 'string' &&
      typeof product.EAN === 'string' &&
      typeof product.Color === 'string' &&
      typeof product.Active === 'boolean' &&
      product.Price.reduce(
        (acc: boolean, cur) =>
          acc &&
          typeof cur.date === 'number' &&
          cur.value >= 0 &&
          typeof cur.value === 'number',
        true
      ) &&
      product.Amount.reduce(
        (acc: boolean, cur) =>
          acc &&
          typeof cur.date === 'number' &&
          cur.value >= 0 &&
          typeof cur.value === 'number',
        true
      )
    )
  }
  async removeAll(): Promise<Message> {
    await this.data()
    localStorage.setItem(
      'products',
      JSON.stringify({
        products: [],
        nextId: 0,
      })
    )
    return {
      success: true,
      message: `All Products were deleted`,
    }
  }
}
