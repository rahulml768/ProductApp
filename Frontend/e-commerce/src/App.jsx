import { useState ,lazy,Suspense} from 'react'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query'
import { Routes,Route ,BrowserRouter} from 'react-router-dom'


const SelectedProducts  =lazy(()=>import("./components/SslectedProducts.jsx"))
const Profile =lazy(()=>import("./components/Profile.jsx"))
const queryClient = new QueryClient()
function App() {

  return (
    <>
     <QueryClientProvider client={queryClient}>
      <Suspense fallback ={<p>laoding...</p>}>
      <BrowserRouter>
        <Routes>
          <Route path="/products" element={<Profile/>} />
          <Route path="/products/:id" element={<SelectedProducts/>} />
        </Routes>
      </BrowserRouter>
      </Suspense>
     </QueryClientProvider>
    </>
  )
}

export default App
