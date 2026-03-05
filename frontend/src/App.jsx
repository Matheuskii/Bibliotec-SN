import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Livros from './pages/Livros.jsx'
import Favoritos from './pages/Favoritos.jsx'
import Reservas from './pages/Reservas.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import NovaSenha from './pages/NovaSenha.jsx'
import DetalhesLivro from './pages/DetalhesLivro.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Livros />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/nova-senha" element={<NovaSenha />} />
        <Route path="/livros/:id" element={<DetalhesLivro />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
