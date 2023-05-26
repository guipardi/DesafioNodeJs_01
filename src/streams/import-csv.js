import { parse } from "csv-parse"
import fs, { createReadStream } from "node:fs"

const csvPath = new URL('./tasks.csv', import.meta.url) /* Cria um caminho absoluto para a pasta EXCEL, onde estará as tarefas */

const stream = createReadStream(csvPath) /* Cria uma readable strem, que vai ler e fornecer informações do arquivo de forma simultâne */

const csvParse = parse({
  delimiter: ',',
  skip_empty_lines: true,
  from_line: 2
}) /* Cria um parseador para usar futuramente quando for ler o arquivo. Ele define o delimitador, define true para pular as linhas que estão vazias e usa o from_line para pular a linha Header de uma tabela */

export async function run() {
  const linesParse = stream.pipe(csvParse) /* Basicamente envia os dados dessa stream para a função parseador definida acima, e atribui o resultado dessa stream 'parseada' para a constante linesParse */

  for await (const line of linesParse) { /* Cria um loop for que assíncronamente recebe os dados da constante linesParse e atribui a constante line */
    const [title, description] = line /* Pega de cada linha o título e a description da tarefa */
    
    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
}


