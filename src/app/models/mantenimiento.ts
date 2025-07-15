import { Tramite } from "./tramite"

export class Mantenimiento{
    idMantenimiento?: number
    fechaMantenimiento!: Date
    enlaceRecibido?: string
    tramites?: Tramite[] = [];
}