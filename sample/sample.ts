import { HTDC } from "../index.ts";

const doc = new HTDC();

// ===== SECTION 1 ===== //
doc.section("Section1", {
    paragraph: {
        alignment: 'justified',
        indentation: {
            symmetric: false,
            type: ['normal', [0, 0, 0]]
        },
        lineSpacing: [0, 0, 0, 0]
    },
    pagination: {
        position: 'bl',
        format: '123',
        style: 'p',
    }
});

doc.title("HTDC: HyperText Document Compiler");
doc.subtitle("A sample document for HTDC");

doc.h1("Chapter 1");

doc.h2("Using HTDC");
doc.p(`This is a paragraph.`);

doc.br();

doc.img("./myImg.png", { title: "My image", width: 0.25 });

console.log(doc.toHTML());
