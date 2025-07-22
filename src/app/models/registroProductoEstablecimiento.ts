import { RegistroProducto } from "./registroProducto"

export class RegistroProductoEstablecimiento{
    idRegistroProductoEstablecimiento?:number
    idRegistroProducto!:number
    idRegistroEstablecimiento!: number
    rnpaActual!: string
    fechaEmision!:string
    rnpaAnterior!: string
    tipo!: string
    nroRne!: string
    certificado!: string
    expediente!: number
    registroProducto?: RegistroProducto | undefined

}