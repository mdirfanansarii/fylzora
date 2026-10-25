import { lazy } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { bySlug, categories, categoryKeyBySlug } from './data/tools.js';
import Home from './pages/Home.jsx';
import Blog100KB from './pages/Blog100KB.jsx';

const AllTools = lazy(() => import('./pages/AllTools.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const ToolPage = lazy(() => import('./pages/ToolPage.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Legal = {
  About: lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.About }))),
  Contact: lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.Contact }))),
  Privacy: lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.Privacy }))),
  Terms: lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.Terms }))),
  Disclaimer: lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.Disclaimer }))),
  Cookies: lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.Cookies }))),
  Faq: lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.Faq }))),
};

// /:slug can be a tool (/image-compressor) or a category (/pdf-tools).
function SlugRoute() {
  const { slug } = useParams();
  const catKey = categoryKeyBySlug(slug);
  if (catKey) return <CategoryPage categoryKey={catKey} />;
  const tool = bySlug(slug);
  if (tool) return <ToolPage tool={tool} />;
  return <NotFound />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="all-tools" element={<AllTools />} />
        <Route path="about" element={<Legal.About />} />
        <Route path="contact" element={<Legal.Contact />} />
        <Route path="privacy-policy" element={<Legal.Privacy />} />
        <Route path="terms-of-service" element={<Legal.Terms />} />
        <Route path="disclaimer" element={<Legal.Disclaimer />} />
        <Route path="cookie-and-advertising" element={<Legal.Cookies />} />
        <Route path="faq" element={<Legal.Faq />} />
        <Route path="blog/how-to-reduce-image-to-100kb" element={<Blog100KB />} />
    <Route path=":slug" element={<SlugRoute />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
