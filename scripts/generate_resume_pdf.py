#!/usr/bin/env python3
"""Generate the downloadable resume PDF from _data/resume.json."""

import json
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import BaseDocTemplate, Frame, KeepTogether, PageTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "_data" / "resume.json"
OUTPUT_PATH = ROOT / "assets" / "files" / "Harsimran-Sidhu-Resume.pdf"
RED = colors.HexColor("#E83E4D")
DARK = colors.HexColor("#151515")
MID = colors.HexColor("#4A4A4A")
LIGHT = colors.HexColor("#D7D7D7")


def add_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LIGHT)
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, 0.38 * inch, letter[0] - doc.rightMargin, 0.38 * inch)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MID)
    canvas.drawString(doc.leftMargin, 0.22 * inch, "HARSIMRAN SIDHU / SECURITY OPERATIONS")
    canvas.drawRightString(letter[0] - doc.rightMargin, 0.22 * inch, f"PAGE {doc.page}")
    canvas.restoreState()


def section_title(text, styles):
    return [Spacer(1, 5), Paragraph(text.upper(), styles["Section"]), Spacer(1, 2)]


def bullet(text, styles):
    return Paragraph(f"- {escape(text)}", styles["BulletLine"])


def build_resume():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUTPUT_PATH), pagesize=letter,
        leftMargin=0.48 * inch, rightMargin=0.48 * inch,
        topMargin=0.4 * inch, bottomMargin=0.5 * inch,
        title=f"{data['name']} - Resume", author=data["name"],
        subject="Security Operations, Incident Response, and Threat Intelligence",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="resume")
    doc.addPageTemplates([PageTemplate(id="resume", frames=[frame], onPage=add_page)])
    base = getSampleStyleSheet()
    styles = {
        "Name": ParagraphStyle("Name", parent=base["Title"], fontName="Helvetica-Bold", fontSize=24, leading=25, textColor=DARK, alignment=TA_LEFT, spaceAfter=1),
        "Headline": ParagraphStyle("Headline", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=9, leading=10.4, textColor=RED, tracking=0.8, spaceAfter=3),
        "Contact": ParagraphStyle("Contact", parent=base["Normal"], fontName="Helvetica", fontSize=7.8, leading=9.4, textColor=MID, spaceAfter=5),
        "Summary": ParagraphStyle("Summary", parent=base["Normal"], fontName="Helvetica", fontSize=8.6, leading=10.8, textColor=DARK, spaceAfter=2),
        "Section": ParagraphStyle("Section", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=9.8, leading=11.2, textColor=RED, spaceBefore=2, spaceAfter=2, tracking=0.7),
        "Role": ParagraphStyle("Role", parent=base["Heading3"], fontName="Helvetica-Bold", fontSize=9.6, leading=11, textColor=DARK),
        "Date": ParagraphStyle("Date", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=9.4, textColor=RED, alignment=TA_RIGHT),
        "Company": ParagraphStyle("Company", parent=base["Normal"], fontName="Helvetica-Oblique", fontSize=8, leading=9.4, textColor=MID, spaceAfter=1.5),
        "BulletLine": ParagraphStyle("BulletLine", parent=base["Normal"], fontName="Helvetica", fontSize=8, leading=9.6, textColor=DARK, leftIndent=7, firstLineIndent=-6, spaceAfter=1.4),
        "Compact": ParagraphStyle("Compact", parent=base["Normal"], fontName="Helvetica", fontSize=7.8, leading=9.3, textColor=DARK, spaceAfter=2),
        "Education": ParagraphStyle("Education", parent=base["Normal"], fontName="Helvetica", fontSize=7.8, leading=9.3, textColor=DARK, spaceAfter=1.5),
    }
    story = [
        Paragraph(escape(data["name"]), styles["Name"]),
        Paragraph(escape(data["headline"].upper()), styles["Headline"]),
        Paragraph(
            f"<link href='mailto:{data['email']}'>{data['email']}</link>  |  "
            f"<link href='{data['website']}'>harsim.ca</link>  |  "
            f"<link href='{data['linkedin']}'>linkedin.com/in/harsimransidhu</link>  |  "
            f"<link href='{data['github']}'>github.com/PKHarsimran</link>", styles["Contact"]),
        Paragraph(escape(data["summary"]), styles["Summary"]),
    ]
    story.extend(section_title("Experience", styles))
    for job in data["experience"]:
        heading = Table([[Paragraph(escape(job["role"]), styles["Role"]), Paragraph(escape(job["dates"]), styles["Date"]) ]], colWidths=[doc.width * 0.72, doc.width * 0.28])
        heading.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
        block = [heading, Paragraph(f"{escape(job['company'])} | {escape(job['location'])}", styles["Company"])]
        block.extend(bullet(item, styles) for item in job["bullets"])
        block.append(Spacer(1, 4))
        story.append(KeepTogether(block))
    story.extend(section_title("Core Capabilities", styles))
    skill_rows = [[Paragraph(f"<b>{escape(skill['group'])}</b>", styles["Compact"]), Paragraph(escape(skill["items"]), styles["Compact"])] for skill in data["skills"]]
    skills_table = Table(skill_rows, colWidths=[1.22 * inch, doc.width - 1.22 * inch])
    skills_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 4), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    story.append(skills_table)
    story.extend(section_title("Selected Security Work", styles))
    for work in data["selected_work"]:
        story.append(Paragraph(f"<b>{escape(work['title'])}:</b> {escape(work['description'])}", styles["Compact"]))
    story.extend(section_title("Education", styles))
    education_cells = [Paragraph(f"<b>{escape(item['credential'])}</b><br/>{escape(item['school'])} | {escape(item['location'])}<br/><font color='#E83E4D'>{escape(item['dates'])}</font>", styles["Education"]) for item in data["education"]]
    education_table = Table([education_cells], colWidths=[doc.width / 3.0] * 3)
    education_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    story.append(education_table)
    doc.build(story)


if __name__ == "__main__":
    build_resume()
