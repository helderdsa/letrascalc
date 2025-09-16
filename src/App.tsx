import MainForm from './components/MainForm'
import logoHero from './assets/logo_cma_hero.svg'

function App() {
  return (
    <div className="min-h-screen w-full max-w-full m-0 p-5 bg-gradient-orange bg-fixed flex flex-col items-center justify-start pt-10 overflow-x-hidden relative box-border md:p-4 md:pt-5">
      <div className="flex justify-center items-center mb-10 md:mb-8 sm:mb-5 bg-slate-50 rounded-lg p-4 max-w-fit">
        <img 
          src={logoHero} 
          alt="CMA Logo" 
          className="max-w-[300px] w-full h-auto md:max-w-[250px] sm:max-w-[200px]" 
        />
      </div>
      <MainForm />
    </div>
  )
}

export default App
