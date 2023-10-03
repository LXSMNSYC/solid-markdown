import { Dynamic, render } from 'solid-js/web';
import type { JSX } from 'solid-js';
import {
  Show,
  createEffect,
  createResource,
  createSignal,
} from 'solid-js';
import * as shiki from 'shiki';
import { MDXProvider } from 'solid-marked';
import Example from './Example.md';
import './main.css';

shiki.setCDN('https://unpkg.com/shiki/');

function App(): JSX.Element {
  const [highlighter] = createResource(async () => (
    shiki.getHighlighter({
      langs: ['tsx', 'jsx', 'md', 'mdx', 'markdown', 'bash', 'js', 'ts'],
      themes: ['github-dark'],
    })
  ));
  return (
    <MDXProvider
      builtins={{
        Heading(props): JSX.Element {
          return (
            <a href={`#${props.id}`}>
              <Dynamic component={`h${props.depth}`} id={props.id}>
                {props.children}
              </Dynamic>
            </a>
          );
        },
        Paragraph(props): JSX.Element {
          return (
            <p>
              {props.children}
            </p>
          );
        },
        Root(props): JSX.Element {
          return (
            <div class="bg-white m-4 p-4 rounded-lg prose">
              {props.children}
            </div>
          );
        },
        Blockquote(props): JSX.Element {
          return (
            <blockquote>
              {props.children}
            </blockquote>
          );
        },
        Image(props): JSX.Element {
          return (
            <img src={props.url} alt={props.alt ?? props.title ?? undefined} />
          );
        },
        Code(props): JSX.Element {
          const [ref, setRef] = createSignal<HTMLPreElement | undefined>();
          createEffect(() => {
            const current = ref();
            const instance = highlighter();
            const content = props.children;
            if (current && instance && content) {
              current.innerHTML = instance.codeToHtml(content, {
                lang: props.lang ?? undefined,
                theme: 'github-dark',
              });
            }
          });
          return (
            <div ref={setRef} lang={props.lang ?? undefined} />
          );
        },
        InlineCode(props): JSX.Element {
          return (
            <code>{props.children}</code>
          );
        },
        List(props): JSX.Element {
          return (
            <Dynamic component={props.ordered ? 'ol' : 'ul'} start={props.start ?? undefined}>
              {props.children}
            </Dynamic>
          );
        },
        ListItem(props): JSX.Element {
          return (
            <li>
              <Show when={'checked' in props} fallback={props.children}>
                <input type="checkbox" checked={props.checked ?? undefined} />
                {props.children}
              </Show>
            </li>
          );
        },
        Link(props): JSX.Element {
          return (
            <a href={props.url} title={props.title ?? undefined}>{props.children}</a>
          );
        },
      }}
    >
      <div class="bg-gradient-to-r from-indigo-400 to-blue-600 w-full flex">
        <div class="flex flex-col items-center w-full min-h-screen overflow-x-hidden">
          <Example />
        </div>
      </div>
    </MDXProvider>
  );
}

const root = document.getElementById('app');

if (root) {
  render(() => <App />, root);
}
