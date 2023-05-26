import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', {
        title: search,
        description: search
      })

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        return res.writeHead(400).end(JSON.stringify({message: 'Title is required!'}))
      }

      if (!description) {
        return res.writeHead(400).end(JSON.stringify({message: 'Description is required!'}))
      }

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({message: 'Title and description are required!'})
        )
      }

      const [task] = database.select('tasks', {id})

      if (!task) {
        return res.writeHead(400).end()
      }

      database.update('tasks', id, {
        title,
        description,
        ...task,
        updated_at: new Date() 
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', {id})

      if (!task) {
        return res.writeHead(400).end()
      }

      database.delete('tasks', id)

      return res.writeHead(204).end(`Usuário de id ${id}, deletado com sucesso!`)
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', {id})

      if(!task) {
        return res.writeHead(400).end()
      }

      const isTaskCompleted = !!task.completed_at
      const completed_at = isTaskCompleted ? null : new Date()

      database.update('tasks', id, {
        ...task,
        completed_at
      })

      return res.writeHead(204).end(`Tarefa ${task.description} marcada como completa: ${completed_at}`)
    }
  }
]