import MainForm from './components/MainForm'
import './App.css'
import logoHero from './assets/logo_cma_hero.svg'

function App() {
  return (
    <div className="App">
      <div className="logo-hero-container">
        <img src={logoHero} alt="CMA Logo" className="logo-hero" />
      </div>
      <MainForm />
    </div>
  )
}

export default App
