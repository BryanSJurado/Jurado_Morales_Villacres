import { Concepto } from "./concepto";

export interface Venta{
    idVen: number;
    idCliVen: number;
    conceptos: Concepto[]; 
}