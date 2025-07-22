import { Mantenimiento } from "./mantenimiento"

export class RegistroProducto{
    idRegistroProducto?:number
    tipo!: string
    idProducto!:number
    mantenimientos?: Mantenimiento[] | undefined
}