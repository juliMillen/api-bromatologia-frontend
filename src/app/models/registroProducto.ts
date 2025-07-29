import { Mantenimiento } from "./mantenimiento"

export class RegistroProducto{
    idRegistroProducto?:number
    tipo!: string
    idProducto!:number
    elaborador!:string
    mantenimientos?: Mantenimiento[] | undefined
}