import { Categoria } from "./categoria"
import { Empresa } from "./empresa"
import { Mantenimiento } from "./mantenimiento"

export class RegistroEstablecimiento{
    rpe!:string
    fechaEmision!: Date
    fechaVencimiento!:Date
    empresa!:Empresa
    departamento!: string
    localidad!:string
    direccion!:string
    expediente!:number
    enlace!:string
    categoria?:Categoria[]
    mantenimientos?: Mantenimiento[]
}