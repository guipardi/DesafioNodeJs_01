export const routes = [
  {
    method: 'GET',
    path: '/tasks',
  },
  {
    method: 'POST',
    path: '/tasks',
  },
  {
    method: 'PUT',
    path: '/tasks/:id',
  },
  {
    method: 'DELETE',
    path: '/tasks/:id',
  },
  {
    method: 'PATCH',
    path: '/tasks/:id/complete',
  }
]