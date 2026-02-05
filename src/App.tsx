import { InvoiceTable } from './components/table';
import { Provider } from 'react-redux';
import { store } from './tableStore/store';
import { ThemeProvider } from "@material-tailwind/react";
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <InvoiceTable />
      </ThemeProvider>
    </Provider>
  )
}

export default App