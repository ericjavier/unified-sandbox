import { readSync, writeSync } from 'to-vfile';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkSlug from 'remark-slug';
import remarkToc from 'remark-toc';
import remarkRetext from 'remark-retext';
import retextEnglish from 'retext-english';
import retextIndefiniteArticle from 'retext-indefinite-article';
import remarkRehype from 'remark-rehype';
import rehypeDocument from 'rehype-document';
import rehypeStringify from 'rehype-stringify';
import rehypeFormat from 'rehype-format';

const processor = unified()
  .use(remarkParse)
  .use(remarkRetext,
    unified()
      .use(retextEnglish)
      .use(retextIndefiniteArticle))
  .use(remarkSlug)
  .use(remarkToc)
  .use(remarkRehype)
  .use(rehypeDocument, {title: 'Contents'})
  .use(rehypeFormat)
  .use(rehypeStringify);

processor
  .process(readSync('example.md'))
  .then(
    file => {
      console.error(reporter(file));
      file.extname = '.html';
      writeSync(file);
    },
    err => {
      throw err;
    });