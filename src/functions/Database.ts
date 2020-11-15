import { Product, Message } from '../interfaces'

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
    const { products, nextId } = await this.data()
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
      value = { ...value, id: nextId }
      localStorage.setItem(
        'products',
        JSON.stringify({ products: [...products, value], nextId: nextId + 1 })
      )
      return {
        success: true,
        message: `New Product ${value.Name} (${value.EAN}) was added`,
      }
    }
    if (products.some((e) => Database.isEqual(e, value, true))) {
      return { success: false, message: `No changes were made` }
    }
    localStorage.setItem(
      'products',
      JSON.stringify({
        products: [...products.map((e) => (e.id === value.id ? value : e))],
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
      a.Weight === b.Weight
    return id ? equality && a.id === b.id : equality
  }
  private static hasAllProps(product: Product): boolean {
    return (
      typeof product.id === 'number' &&
      typeof product.Weight === 'number' &&
      typeof product.Type === 'string' &&
      typeof product.Name === 'string' &&
      typeof product.EAN === 'string' &&
      typeof product.Color === 'string' &&
      typeof product.Active === 'boolean'
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
