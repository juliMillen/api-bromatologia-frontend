import { Producto } from "./producto"

export class Establecimiento{
    idEstablecimiento?:number
    localidad!: String
    departamento!: String
    direccion!: String
    cuitEmpresa!: number
    productos?: Producto[] = [];
}