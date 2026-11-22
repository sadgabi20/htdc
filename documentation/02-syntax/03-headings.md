# Headings

Use `/h1` through `/h4` for section headings:

```text
/h1 Introduction
/h2 Background
/h3 Early Designs
/h4 A Note on Terminology
```

## Automatic numbering

HTDC numbers headings for you:

| Directive | Rendered number |
| --- | --- |
| `/h1` | `1`, `2`, … |
| `/h2` | `1.1`, `1.2`, … |
| `/h3` | `1.1.1`, … |
| `/h4` | none |

Do not type numbers into the heading text. Write:

```text
/h1 Introduction
```

not `1 Introduction`.

Numbering resets lower levels when a higher level appears. For example, a new `/h1` resets both `/h2` and `/h3` counters.

## Text behavior

- Heading text is the rest of the directive line.
- Inline italics are **not** parsed in headings.
- A blank line is not required after a heading, though it often improves readability in the source.
- A config object may be attached but is not used by the current renderer.

```text
/h1 Getting Started { id: getting-started }
```
