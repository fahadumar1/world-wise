import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import Header from "./components/Header";
import Logo from "./components/Logo";
import SiteNavigation from "./components/SiteNavigation";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import City from "./components/City";
import CountryList from "./components/CountryList";
import Form from "./components/Form.jsx";
import { CitiesProvider } from "./contexts/CitiesContext.jsx";
import { AuthProvider } from "./contexts/fakeAuthContext.jsx";
import ProtcetedRoutes from "./pages/ProtcetedRoutes.jsx";
const App = () => {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <div className="wrapper">
            <Header>
              <Logo />
              <SiteNavigation />
            </Header>
            <main id="main">
              <Routes>
                <Route index element={<Homepage />}></Route>
                <Route path="/product" element={<Product />}></Route>
                <Route path="/pricing" element={<Pricing />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route
                  path="/app"
                  element={
                    <ProtcetedRoutes>
                      <AppLayout />
                    </ProtcetedRoutes>
                  }
                >
                  <Route index element={<Navigate replace to="cities" />} />
                  <Route path="cities" element={<CityList />} />
                  <Route path="cities/:id" element={<City />} />
                  <Route path="countries" element={<CountryList />} />
                  <Route path="form" element={<Form />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
};

export default App;
