# Text and paragraphs

Plain text lines are paragraphs. You do not need a `/p` directive.

```text
/h1 Introduction
This is the first paragraph. It continues on the next line
and is joined with a single space.

This is a second paragraph, separated by a blank line.
```

## Rules

- Consecutive non-blank text lines are joined into one paragraph with a single space.
- A **blank line** ends the paragraph and starts a new one.
- A directive also ends the current paragraph.
- Leading and trailing whitespace on each line is trimmed.
- Indentation on ordinary text lines has no special meaning.

## Italics

Wrap text in single asterisks to get italics:

```text
This word is *important* and this is *also italic*.
```

Asterisks are paired in order: the first becomes `<i>`, the second `</i>`. Always use them in matching pairs.

Italic parsing applies to **paragraphs and list items**. It is not applied to `/title`, `/subtitle`, or heading text.

## Not supported yet

There is no syntax for bold, inline code, links, footnotes, or math. Asterisks are the only inline markup currently recognized.

If you need literal braces in your text, see [config objects](06-config-objects.md); the parser only treats the last brace pair containing `:` as a config object.
