import ToolPage from './pages/ToolPage.jsx';
import { lazy } from 'react';
import AllTools from './pages/AllTools.jsx';
import {
  About,
  Contact,
  Privacy,
  Terms,
  Disclaimer,
  Cookies,
  Faq,
} from './pages/Legal.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { bySlug, categories, categoryKeyBySlug } from './data/tools.js';
import Home from './pages/Home.jsx';
import Blog100KB from './pages/Blog100KB.jsx';
import BlogJpgToWebP from './pages/BlogJpgToWebP.jsx';
import BlogMergePDF from './pages/BlogMergePDF.jsx';
import BlogImageQuality from './pages/BlogImageQuality.jsx';

const NotFound = lazy(() => import('./pages/NotFound.jsx'));


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
        <Route path="about" element={<About />} />
	<Route path="contact" element={<Contact />} />
	<Route path="privacy-policy" element={<Privacy />} />
	<Route path="terms-of-service" element={<Terms />} />
	<Route path="disclaimer" element={<Disclaimer />} />
	<Route path="cookie-and-advertising" element={<Cookies />} />
	<Route path="faq" element={<Faq />} />
        <Route path="blog/how-to-reduce-image-to-100kb" element={<Blog100KB />} />
	<Route path="blog/compress-image-without-losing-quality" element={<BlogImageQuality />} />
	<Route path="blog/how-to-convert-jpg-to-webp-online" element={<BlogJpgToWebP />}/>
	<Route path="blog/how-to-merge-pdf-files-for-free" element={<BlogMergePDF />} />
        <Route path=":slug" element={<SlugRoute />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
