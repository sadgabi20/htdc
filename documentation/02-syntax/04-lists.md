# Lists

A list starts with `/list.<type>` and ends at a blank line or the next directive.

```text
/list.ul
- First item
- Second item with *italic* text

/h1 Next Section
```

## List types

| Directive | Output |
| --- | --- |
| `/list.ul` | Unordered (`<ul>`) |
| `/list.ol` | Ordered (`<ol>`) |
| `/list.dl` | Definition list (`<dl>`) |

The type suffix is required. A bare `/list` is not enough; use `/list.ul`, `/list.ol`, or `/list.dl`.

## Items

An item begins with `-` followed by at least one space:

```text
/list.ol
- Acquire the target
- Fire the torpedoes
- Disengage
```

Continuation lines are appended to the current item, so you can wrap long items:

```text
/list.ul
- A long item that starts here
  and continues on the next line
- Another item
```

## Ending a list

- A blank line ends the list.
- Any recognized directive ends the list.
- The list does not need an explicit `/end-list`.

## Limitations

- Lists cannot be nested.
- `*italic*` works in list items.
- `/list.dl` is accepted and rendered as a `<dl>` element, but items still use `<li>`; rich definition lists are not implemented yet.
- A config object may be attached to the list directive, but list rendering does not use it yet.
