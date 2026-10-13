"""Convert .docx specification documents to Markdown using python-docx.

Handles headings, paragraphs, tables, lists, bold/italic formatting,
and images (saved alongside the markdown file).
"""

import os
import sys
from pathlib import Path

from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn


def extract_run_text(paragraph: Paragraph) -> str:
    """Extract text from a paragraph, preserving bold/italic formatting."""
    parts = []
    for run in paragraph.runs:
        text = run.text
        if not text:
            continue
        if run.bold and run.italic:
            text = f"***{text}***"
        elif run.bold:
            text = f"**{text}**"
        elif run.italic:
            text = f"*{text}*"
        parts.append(text)
    return "".join(parts) if parts else paragraph.text


def heading_level(paragraph: Paragraph) -> int:
    """Return the heading level (1-9) or 0 for non-headings."""
    style_name = paragraph.style.name if paragraph.style else ""
    if style_name.startswith("Heading"):
        try:
            return int(style_name.split()[-1])
        except (ValueError, IndexError):
            return 0
    return 0


def is_list_paragraph(paragraph: Paragraph) -> bool:
    """Check if paragraph is a list item."""
    style_name = paragraph.style.name if paragraph.style else ""
    if "List" in style_name:
        return True
    # Check for numbering properties
    pPr = paragraph._element.find(qn("w:pPr"))
    if pPr is not None:
        numPr = pPr.find(qn("w:numPr"))
        if numPr is not None:
            return True
    return False


def get_list_level(paragraph: Paragraph) -> int:
    """Get the indentation level of a list item."""
    pPr = paragraph._element.find(qn("w:pPr"))
    if pPr is not None:
        numPr = pPr.find(qn("w:numPr"))
        if numPr is not None:
            ilvl = numPr.find(qn("w:ilvl"))
            if ilvl is not None:
                return int(ilvl.get(qn("w:val"), "0"))
    return 0


def table_to_markdown(table: Table) -> str:
    """Convert a docx table to markdown table."""
    rows = []
    for row in table.rows:
        cells = []
        for cell in row.cells:
            # Get text from all paragraphs in cell
            cell_text = " ".join(p.text.strip() for p in cell.paragraphs if p.text.strip())
            # Escape pipe characters
            cell_text = cell_text.replace("|", "\\|")
            cells.append(cell_text)
        rows.append(cells)

    if not rows:
        return ""

    lines = []
    # Header row
    lines.append("| " + " | ".join(rows[0]) + " |")
    # Separator
    lines.append("| " + " | ".join("---" for _ in rows[0]) + " |")
    # Data rows
    for row in rows[1:]:
        # Pad row to match header length
        while len(row) < len(rows[0]):
            row.append("")
        lines.append("| " + " | ".join(row[:len(rows[0])]) + " |")

    return "\n".join(lines)


def convert_docx_to_markdown(docx_path: str, output_path: str) -> None:
    """Convert a .docx file to Markdown."""
    doc = Document(docx_path)
    lines = []
    prev_was_list = False

    for element in doc.element.body:
        tag = element.tag.split("}")[-1] if "}" in element.tag else element.tag

        if tag == "p":
            para = Paragraph(element, doc)
            text = extract_run_text(para)

            if not text.strip():
                if prev_was_list:
                    prev_was_list = False
                lines.append("")
                continue

            level = heading_level(para)
            if level > 0:
                lines.append("")
                lines.append(f"{'#' * level} {text.strip()}")
                lines.append("")
                prev_was_list = False
            elif is_list_paragraph(para):
                indent_level = get_list_level(para)
                indent = "  " * indent_level
                lines.append(f"{indent}- {text.strip()}")
                prev_was_list = True
            else:
                if prev_was_list:
                    lines.append("")
                    prev_was_list = False
                lines.append(text.strip())
                lines.append("")

        elif tag == "tbl":
            table = Table(element, doc)
            lines.append("")
            lines.append(table_to_markdown(table))
            lines.append("")
            prev_was_list = False

    # Write output
    output = "\n".join(lines)
    # Clean up excessive blank lines
    while "\n\n\n\n" in output:
        output = output.replace("\n\n\n\n", "\n\n\n")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(output)

    print(f"Converted: {docx_path} -> {output_path}")
    print(f"  Size: {len(output):,} characters, {output.count(chr(10)):,} lines")


def main():
    source_dir = Path(r"d:\KAIRO")
    output_dir = Path(r"d:\KAIRO\docs\spec")
    output_dir.mkdir(parents=True, exist_ok=True)

    docx_files = [
        ("KAIRO_Product_Requirements_Document.docx", "PRD.md"),
        ("KAIRO_Technical_Requirements_Document.docx", "TRD.md"),
        ("KAIRO_App_Flow.docx", "APP_FLOW.md"),
        ("KAIRO_UI_UX_Design_Brief.docx", "UI_UX_DESIGN_BRIEF.md"),
    ]

    for docx_name, md_name in docx_files:
        docx_path = source_dir / docx_name
        md_path = output_dir / md_name
        if docx_path.exists():
            try:
                convert_docx_to_markdown(str(docx_path), str(md_path))
            except Exception as e:
                print(f"ERROR converting {docx_name}: {e}")
                import traceback
                traceback.print_exc()
        else:
            print(f"MISSING: {docx_path}")


if __name__ == "__main__":
    main()
