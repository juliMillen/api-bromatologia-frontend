import { Actividad } from "./actividad";
import { Rubro } from "./rubro"

export class Categoria {
    idCategoria?: number
    nombreCategoria!: string
    rubro?: Rubro
    actividades?: Actividad[] = [];
}