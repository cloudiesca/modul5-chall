import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecipeDetail from "./components/recipe/RecipeDetail";
import PWABadge from "./PWABadge";
import "./App.css";

function RecipeDetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();

  return <RecipeDetail recipeId={id} onBack={() => navigate(-1)} />;
}

export default function App() {
  return (
    <Router>
      <PWABadge />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailWrapper />} />
      </Routes>
    </Router>
  );
}
