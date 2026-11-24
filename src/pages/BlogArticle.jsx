import { lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts, blogPath } from '../data/blogPosts.js';
import { blogArticles } from '../data/blogArticles.js';
import { bySlug } from '../data/tools.js';
import { useSeo } from '../hooks/useSeo.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ToolList from '../components/ToolList.jsx';
import { Blocks, Inline } from '../components/RichText.jsx';

const NotFound = lazy(() => import('./NotFound.jsx'));

function Article({ post, article }) {
  const path = blogPath(post);
  const crumbs = [
    { name: 'Home', to: '/' },
    { name: 'Guides', to: '/blog' },
    { name: post.title, to: path },
  ];
  useSeo({ title: post.title, description: post.description, path, breadcrumbs: crumbs });

  const tools = post.tools.map(bySlug).filter(Boolean);
  const more = [
    ...blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...blogPosts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);

  return (
    <article className="wrap page prose">
      <Breadcrumbs items={crumbs} />
      <h1>{post.title}</h1>
      <p className="muted small">
        {post.updated ? `Updated ${post.updated}` : ''}
        {post.updated && post.minutes ? ' · ' : ''}
        {post.minutes ? `${post.minutes} min read` : ''}
      </p>

      <Blocks blocks={article.body} />

      {tools.length > 0 && (
        <section aria-labelledby="g-tools">
          <h2 id="g-tools">Tools mentioned in this guide</h2>
          <ToolList items={tools} />
        </section>
      )}

      {article.faqs?.length > 0 && (
        <section aria-labelledby="g-faq">
          <h2 id="g-faq">Frequently asked questions</h2>
          {article.faqs.map(([q, a]) => (
            <div key={q}>
              <h3>{q}</h3>
              <p><Inline text={a} /></p>
            </div>
          ))}
        </section>
      )}

      <section aria-labelledby="g-more">
        <h2 id="g-more">More guides</h2>
        <ul className="guide-list">
          {more.map((p) => (
            <li key={p.slug}>
              <Link to={blogPath(p)}>{p.title}</Link>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
        <p><Link to="/blog" className="text-link">Browse all guides</Link></p>
      </section>
    </article>
  );
}

export default function BlogArticle() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  const article = blogArticles[slug];
  if (!post || !article) return <NotFound />;
  return <Article post={post} article={article} />;
}
