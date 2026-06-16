import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { createRouter } from './router'

const router = createRouter()
const rootElement = document.getElementById('app')!
const root = ReactDOM.createRoot(rootElement)
root.render(<RouterProvider router={router} />)