# Config objects

Any directive can end with a flat, CSS-rule-like config object:

```text
/name txt { key: value; other-key: another value }
```

Config objects are the main way to pass options from `.htdc` source into HTDC.

## Syntax

- Entries are `key: value` pairs.
- Separate entries with `;`, `,`, or a newline. The final separator is optional.
- Separation is quote-aware, so `;` inside a quoted string is safe.
- Config objects cannot be nested. Do not use nested braces.

```text
/img ./img/photo.png { width: 0.25; title: "Ship; 1943" }

/h1 Title { id: intro, class: opening }
```

## Value types

| Written value | Parsed as |
| --- | --- |
| `0.25`, `42`, `-3` | number |
| `50%` | number `0.5` (percentage divided by 100) |
| `true`, `false` | boolean |
| `null` | `null` |
| `"quoted text"`, `'quoted text'` | string with quotes removed |
| `center`, `justified`, `abc` | string |

Quoted strings may contain escaped quotes such as `\"`.

## Last brace pair wins

Because config objects are flat, HTDC treats the **last** `{ ... }` pair that contains a `:` as the config object. Text before it remains the directive's `txt`.

```text
/h1 Using {braces} in text { id: braces }
```

Here the heading text is `Using {braces} in text` and the config is `{ id: braces }`. A bare brace pair without `:` is left in the text.

## Multi-line config objects

Continuation lines must be indented:

```text
/img ./img/photo.png {
  width: 50%
  title: "A destroyer at sea"
}
```

Rules:

- The opening `{` may be on the directive line or on the next **indented** line.
- Every line inside the config must begin with a space or tab.
- A bare closing `}` may be flush with the directive, as shown above.
- A blank line ends config collection.
- An unindented entry produces `Config continuation lines must be indented`.
- A missing `}` produces `Unclosed config object (missing "}")`.

Invalid entries without a `:` produce a console error and are skipped.

## Which directives use config today?

| Directive | Config used for rendering |
| --- | --- |
| `/img` | `width`, `title` |
| Plain paragraphs | Config is parsed and forwarded, but styling is not applied yet |
| Metadata and headings | Parsed and stored, but not rendered yet |

Config support is being expanded; see the [roadmap](../../ROADMAP.md).
