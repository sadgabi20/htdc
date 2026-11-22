# Images

Insert an image with `/img`:

```text
/img ./img/photo.png
```

The path is the directive's `txt` argument. Local images are embedded into the PDF as data URIs, so the final PDF does not depend on the image file remaining available.

## Path resolution

- When you compile from a file, pass its directory as `baseDir`:

  ```ts
  await htdc2pdf(src, { baseDir: path.dirname(srcPath) });
  ```

- Then `./img/photo.png` is resolved relative to the `.htdc` file.
- Without `baseDir`, it is resolved against the process working directory.
- `file://` URLs, absolute paths, `https://` URLs, `//…` URLs, `data:` URIs, and `blob:` URIs are also accepted. Remote URLs are left for the browser to load and require network access at render time.

See [compilation](../00-overview/02-compilation-pipeline.md) for why `baseDir` is necessary.

## Config options

| Key | Type | Default | Meaning |
| --- | --- | --- | --- |
| `width` | number | `0.25` | Fraction of the page width (`0.5` = 50%). Percentages such as `50%` are converted to `0.5`. |
| `title` | string | none | Used as the image's `alt` text. |

```text
/img ./img/photo.png { width: 0.5; title: "A destroyer at sea" }
```

Multi-line config is also supported:

```text
/img ./img/photo.png {
  width: 50%
  title: "A destroyer at sea"
}
```

The older positional form still works, but the config form is preferred:

```text
/img ./img/photo.png 0.5
```

If both are present, `config.width` wins.

## Supported formats

PNG, JPEG, WebP, GIF, SVG, BMP, AVIF, APNG, and ICO. Unsupported extensions produce an `Unsupported image type` error.

## Rendering

Images are displayed as centered blocks, scaled to the configured width, capped at the content width, and kept on one page when possible. See [custom styles](../03-advanced/01-custom-styles.md) for defaults.

If an image fails to load, check the [FAQ](../04-faq/00-faq.md).
