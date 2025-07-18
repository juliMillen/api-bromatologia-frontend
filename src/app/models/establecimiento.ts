import { Producto } from "./producto"

export class Establecimiento{
    idEstablecimiento?:number
    localidad!: string
    departamento!: string
    direccion!: string
    cuitEmpresa?: number
    productos?: Producto[] = [];
}