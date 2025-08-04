import { Mantenimiento } from "./mantenimiento"

export class RegistroProducto{
    rppa!: ''
    fechaEmision!: Date
    fechaVencimiento!: Date
    registroEstablecimiento!:{
        rpe: ''
    }
    denominacion!: ''
    marca!: ''
    nombreFantasia!: ''
    categoriaProducto!: ''
    expediente!: number
    enlace!: ''
    elaborador!:string
    mantenimientos?: Mantenimiento[] | undefined
}