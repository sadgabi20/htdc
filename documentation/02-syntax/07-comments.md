# Comments

Comments use `/* ... */` and never appear in the PDF.

## Single line

```text
/* This note is only for maintainers. */
```

## Multiple lines

```text
/*
This comment spans several lines.
It ends when */ is found.
*/
```

The opening `/*` must be at the start of a line. Inline comments after text are not supported:

```text
/h1 Introduction /* not a comment */
```

In that example, `/* not a comment */` is treated as heading text.

## Behavior

- A comment ends the current paragraph or list, just like a blank line.
- Comments are removed during parsing; they do not become HTML nodes.
- There is no nesting: the first `*/` closes the comment.
