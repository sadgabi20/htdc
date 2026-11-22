# What is HTDC?

HTDC (**HyperText Document Compositor**) turns a plain-text `.htdc` file into a print-ready PDF. It is intended as a lighter alternative to LaTeX for documents that mostly need headings, paragraphs, lists, and images.

```text
/filename paper
/title A Short Paper

/h1 Introduction
Write normally. Use *asterisks* for italics.
```

The `.htdc` file is the normal way to use HTDC. You do not need to write JavaScript or TypeScript unless you want to generate documents dynamically or customize the rendering pipeline.

## What it provides today

- Document metadata: `/filename`, `/title`, `/subtitle`
- Numbered headings: `/h1` through `/h4`
- Plain paragraphs with `*italic*` emphasis
- Ordered, unordered, and definition lists
- Images with optional width and title, embedded into the PDF
- CSS-like config objects on directives
- Comments with `/* ... */`
- A bundled print stylesheet with embedded fonts

## What it is not

- It is not a Markdown processor. Some syntax looks similar, but `.htdc` uses slash-prefixed directives and its own rules.
- It is not a WYSIWYG editor. You write text and compile it.
- It does not yet cover LaTeX's advanced features such as math typesetting, tables, floats, or bibliographies.

Start with [directive anatomy](../02-syntax/00-directive-anatomy.md), or see the [roadmap](../../ROADMAP.md) for planned features.
