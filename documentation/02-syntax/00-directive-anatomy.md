# Directive anatomy

Every directive follows one shared shape:

```text
/name.type? txt? {configObject}?
```

Each part is optional except the leading slash and `name`.

| Part | Meaning | Example |
| --- | --- | --- |
| `name` | Directive name. Letters, digits, `_` and `-`. | `h1`, `img`, `list` |
| `.type` | Optional subtype for directives that support one. May contain dots. | `list.ul`, `list.ol`, `list.dl` |
| `txt` | The main argument, taken as the rest of the line and trimmed. | `A Title`, `./img/photo.png` |
| `{configObject}` | Optional flat CSS-like key-value object. | `{ width: 0.25 }` |

A directive must begin at the start of a line. Indentation before `/` is not treated as a directive.

## Examples

```text
/filename paper
/title A Short Paper
/list.ul
/img ./img/photo.png { width: 50% }
/h1 Introduction { id: intro }
```

- `/filename` uses only `txt`.
- `/list.ul` uses `name` plus `.type` and no `txt`.
- `/img` uses `txt` for the path and a config object for options.
- `/h1` uses `txt` for the heading and a config object that is currently parsed but not rendered.

## Recognition rules

- A line starting with `/` is treated as a directive. Unknown directive names produce an error in the console and are ignored.
- A line starting with `/*` is a [comment](07-comments.md), not a directive.
- Blank lines close any open paragraph or list.
- Leading and trailing whitespace in `txt` is trimmed.
- CRLF and LF line endings both work.

The config object has its own rules, including multi-line indentation. See [config objects](06-config-objects.md).

## What happens to unrecognized text?

Non-directive, non-comment, non-blank lines become paragraph text (or list item text when a list is open). There is no "unknown markup" syntax in `.htdc`; `*italic*` is the only inline convention today.
