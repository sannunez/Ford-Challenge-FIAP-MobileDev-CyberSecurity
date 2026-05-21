export interface CarDetailsDTO{
    make: string;
    model: string;
    trim: string;
    type: string;
    motor: string;
    potencia: number;
    torqueMax: number;
    transmissao: string;
    tracao: string;
    preco: number;
    zeroACem: number;
    amortecedores: string;
    modosConducao: string[];
    modosVolante: string[];
    modosEscapamento: string[];
    modosAmortecedor: string[];
    farois: string;
    rodasPneus: string;
    year: number;
}