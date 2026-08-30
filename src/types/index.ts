export interface Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  codigoAcesso: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Medidas {
  id: string;
  usuarioId: string;
  // O backend serializa campos Decimal do Prisma como string.
  busto: string;
  torax: string;
  cintura: string;
  quadril: string;
  coxa: string;
  numeroCalcado: string;
  atualizadoEm: string;
}

export interface UpsertMedidasPayload {
  busto: number;
  torax: number;
  cintura: number;
  quadril: number;
  coxa: number;
  numero_calcado: number;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
}

/** Formato de erro devolvido pelo AllExceptionsFilter do backend. */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}
