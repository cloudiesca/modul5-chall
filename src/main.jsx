import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
} from '@tanstack/react-query';
import {
  PersistQueryClientProvider
} from '@tanstack/react-query-persist-client';
import {
  createSyncStoragePersister
} from '@tanstack/query-sync-storage-persister';

import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import ProfilePage from './pages/ProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetail from './components/recipe/RecipeDetail';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import PWABadge from './PWABadge';
import './index.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// === React Query Config ===
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// === Persist ke LocalStorage ===
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [mode, setMode] = useState('list');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('makanan');
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  // 🟢 Handle direct link ke /recipe/:id (support UUID)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      // ✅ Regex yang support UUID format (huruf, angka, dash)
      const match = path.match(/^\/recipe\/([a-zA-Z0-9-]+)/);
      if (match) {
        const id = match[1];
        setSelectedRecipeId(id);
        setSelectedCategory('makanan'); // default kategori
        setMode('detail');
      }
    }
  }, []);

  // 🟢 Handle browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') {
        setMode('list');
        setSelectedRecipeId(null);
        setEditingRecipeId(null);
      } else {
        const match = path.match(/^\/recipe\/([a-zA-Z0-9-]+)/);
        if (match) {
          setSelectedRecipeId(match[1]);
          setMode('detail');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSplashComplete = () => setShowSplash(false);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    window.history.pushState({}, '', '/'); // reset ke root
  };

  const handleCreateRecipe = () => setMode('create');

  const handleRecipeClick = (recipeId, category) => {
    setSelectedRecipeId(recipeId);
    setSelectedCategory(category || currentPage);
    setMode('detail');
    // Update URL agar sesuai dengan format share
    window.history.pushState({}, '', `/recipe/${recipeId}`);
  };

  const handleEditRecipe = (id) => {
    setEditingRecipeId(id);
    setMode('edit');
  };

  const handleBack = () => {
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    window.history.pushState({}, '', '/'); // kembali ke root URL
  };

  const handleCreateSuccess = (newRecipe) => {
    alert('Resep berhasil dibuat!');
    setMode('list');
    if (newRecipe?.category) setCurrentPage(newRecipe.category);
  };

  const handleEditSuccess = () => {
    alert('Resep berhasil diperbarui!');
    setMode('list');
  };

  const renderCurrentPage = () => {
    if (mode === 'create')
      return <CreateRecipePage onBack={handleBack} onSuccess={handleCreateSuccess} />;
    if (mode === 'edit')
      return (
        <EditRecipePage
          recipeId={editingRecipeId}
          onBack={handleBack}
          onSuccess={handleEditSuccess}
        />
      );
    if (mode === 'detail')
      return (
        <RecipeDetail
          recipeId={selectedRecipeId}
          category={selectedCategory}
          onBack={handleBack}
          onEdit={handleEditRecipe}
        />
      );

    switch (currentPage) {
      case 'home':
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
      case 'makanan':
        return <MakananPage onRecipeClick={handleRecipeClick} />;
      case 'minuman':
        return <MinumanPage onRecipeClick={handleRecipeClick} />;
      case 'profile':
        return <ProfilePage onRecipeClick={handleRecipeClick} />;
      default:
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
    }
  };

  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {mode === 'list' && (
        <>
          <DesktopNavbar
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
          <MobileNavbar
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
        </>
      )}

      <main className="min-h-screen">{renderCurrentPage()}</main>
      <PWABadge />
    </div>
  );
}

// === RENDER APP ===
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: localStoragePersister }}
    >
      <AppRoot />
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  </StrictMode>
);