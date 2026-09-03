import { Route, Routes } from "react-router";

import { navigationItems } from "./config/navigation.js";
import AppShell from "./layouts/AppShell.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {navigationItems.map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={<PlaceholderPage title={item.label} description={item.description} />}
          />
        ))}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
