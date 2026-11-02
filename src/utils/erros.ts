import axios from 'axios'

type ContextoErro = 'geral' | 'login'

export function mensagemDeErro(error: unknown, contexto: ContextoErro = 'geral'): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'A resposta demorou demais. Tente novamente.'
    }

    if (!error.response) {
      return 'Sem conexão com o servidor. Confira sua internet e tente novamente.'
    }

    const { status } = error.response

    if (contexto === 'login' && (status === 400 || status === 401)) {
      return 'Usuário ou senha incorretos. Confira os dados e tente novamente.'
    }

    if (status === 400) {
      return 'Os dados enviados não foram aceitos. Confira o que digitou.'
    }
    if (status === 401) {
      return 'Sua sessão expirou. Entre novamente.'
    }
    if (status === 404) {
      return 'Não encontramos o que você pediu. O item pode ter sido removido.'
    }
    if (status >= 500) {
      return 'O servidor está com problemas. Tente novamente daqui a pouco.'
    }

    return `Não foi possível concluir a operação (código ${status}). Tente novamente.`
  }

  return 'Ocorreu um erro inesperado no aplicativo. Tente novamente.'
}
