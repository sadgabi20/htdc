# Document metadata

Three directives describe the document as a whole.

## `/filename` — required

```text
/filename my-report
```

- Sets the base name of the generated PDF: `my-report.pdf`.
- Do not include the `.pdf` extension.
- A document without `/filename` fails at render time with `An HTDC document must have a file name`.
- It is usually the first line, but the parser does not require that.

The PDF is written to the current working directory, not next to the `.htdc` file.

## `/title`

```text
/title The Tin Can Navy
```

Renders a large document title.

## `/subtitle`

```text
/subtitle Destroyer Combat, Escort Duty, and Technological Evolution
```

Renders a smaller, muted subtitle beneath the title.

## Config objects on metadata directives

You may attach a config object, for example:

```text
/title A Short Paper { id: paper-title }
```

The parser accepts and stores it, but metadata rendering does not use config values yet. See the [roadmap](../../ROADMAP.md).
