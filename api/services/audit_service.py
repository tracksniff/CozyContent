import requests
from bs4 import BeautifulSoup
import anthropic
import os
import json
import logging
import stripe
from django.conf import settings
from io import BytesIO
from datetime import datetime

# ── ReportLab imports ──────────────────────────────────────────────────────────
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Spacer,
    KeepTogether,
    PageBreak,
    Flowable,
)
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

logger = logging.getLogger(__name__)

# ── Brand palette ──────────────────────────────────────────────────────────────
DARK = colors.HexColor("#1B1C1C")
OFF_WHITE = colors.HexColor("#FBF9F8")
ACCENT = colors.HexColor("#00696D")  # teal
ACCENT2 = colors.HexColor("#19A4A9")  # light teal
MID_GREY = colors.HexColor("#3D4949")
RED = colors.HexColor("#E84040")
ORANGE = colors.HexColor("#F5A623")
YELLOW = colors.HexColor("#F5D623")
GREEN = colors.HexColor("#4CAF50")

W, H = A4

# ─────────────────────────────────────────────────────────────────────────────
# Helper: word-wrap text onto a canvas
# ─────────────────────────────────────────────────────────────────────────────


def _get_wrapped_lines(text, font_name, font_size, max_width):
    """Helper to wrap text using stringWidth."""
    words = str(text).split()
    if not words:
        return []
    lines = []
    current_line = ""
    for word in words:
        test_line = (current_line + " " + word).strip()
        if stringWidth(test_line, font_name, font_size) <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)
    return lines


def _draw_wrapped(c, text, x, y, max_width, line_height=4.5):
    """Draw word-wrapped text; returns final y position."""
    font_name = c._fontname
    font_size = c._fontsize
    lines = _get_wrapped_lines(text, font_name, font_size, max_width)
    for ln in lines:
        c.drawString(x, y, ln)
        y -= line_height * mm
    return y


# ─────────────────────────────────────────────────────────────────────────────
# Flowable: Cover / Hero page
# ─────────────────────────────────────────────────────────────────────────────


class _CoverPage(Flowable):
    def __init__(self, business_name, website_url, overall_score, scores):
        super().__init__()
        self.business_name = business_name
        self.website_url = website_url
        self.overall_score = overall_score
        self.scores = scores  # dict: label -> value (0-100)

    def wrap(self, *args):
        return W, H

    def draw(self):
        c = self.canv
        # ── dark background + grid ──
        c.setFillColor(DARK)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setStrokeColor(colors.HexColor("#1A1A1A"))
        c.setLineWidth(0.5)
        for x in range(0, int(W) + 1, 40):
            c.line(x, 0, x, H)
        for y in range(0, int(H) + 1, 40):
            c.line(0, y, W, y)

        # ── top lime bar ──
        c.setFillColor(ACCENT)
        c.rect(0, H - 6 * mm, W, 6 * mm, fill=1, stroke=0)

        # ── "PERFORMANCE AUDIT" pill ──
        c.setFillColor(colors.HexColor("#1C1C1C"))
        c.roundRect(20 * mm, H - 28 * mm, 72 * mm, 10 * mm, 5 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 8)
        current_date = datetime.now().strftime("%B %Y").upper()
        c.drawString(25 * mm, H - 23 * mm, f"PERFORMANCE AUDIT  \u2022  {current_date}")

        # ── website url (above score) ──
        c.setFillColor(colors.white)
        c.setFont("Helvetica", 14)
        c.drawCentredString(W / 2, H / 2 + 76 * mm, self.website_url)

        # ── score circle ──
        cx, cy, r = W / 2, H / 2 + 30 * mm, 38 * mm
        c.setFillColor(colors.HexColor("#141414"))
        c.circle(cx, cy, r, fill=1, stroke=0)
        c.setStrokeColor(ACCENT)
        c.setLineWidth(3)
        c.circle(cx, cy, r, fill=0, stroke=1)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 42)
        c.drawCentredString(cx, cy + 6 * mm, str(self.overall_score))
        c.setFillColor(OFF_WHITE)
        c.setFont("Helvetica", 10)
        c.drawCentredString(cx, cy - 10 * mm, "OVERALL SCORE")

        # ── business name (below score) ──
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 36)
        c.drawCentredString(W / 2, H / 2 - 12 * mm, self.business_name)

        # ── score bars ──
        score_items = list(self.scores.items())  # [(label, value), ...]
        bar_x = 25 * mm
        bar_w = W - 50 * mm
        label_w = 36 * mm
        bar_area = bar_w - label_w - 20 * mm
        bar_y = H / 2 - 50 * mm

        c.setFillColor(colors.HexColor("#1A1A1A"))
        c.roundRect(
            bar_x - 4 * mm,
            bar_y - 6 * mm,
            bar_w + 8 * mm,
            len(score_items) * 10 * mm + 8 * mm,
            4 * mm,
            fill=1,
            stroke=0,
        )

        def _bar_color(v):
            if v < 40:
                return RED
            if v < 60:
                return ORANGE
            return GREEN

        for i, (label, value) in enumerate(score_items):
            y = bar_y + (len(score_items) - 1 - i) * 10 * mm
            c.setFillColor(OFF_WHITE)
            c.setFont("Helvetica", 9)
            c.drawString(bar_x, y + 1 * mm, label)
            # track
            c.setFillColor(colors.HexColor("#2A2A2A"))
            c.roundRect(
                bar_x + label_w, y, bar_area, 5 * mm, 2.5 * mm, fill=1, stroke=0
            )
            # fill
            fill_w = bar_area * int(value) / 100
            c.setFillColor(_bar_color(int(value)))
            c.roundRect(bar_x + label_w, y, fill_w, 5 * mm, 2.5 * mm, fill=1, stroke=0)
            # value
            c.setFillColor(colors.white)
            c.setFont("Helvetica-Bold", 9)
            c.drawRightString(bar_x + bar_w, y + 1 * mm, f"{value}%")

        # ── footer ──
        c.setFillColor(MID_GREY)
        c.setFont("Helvetica", 8)
        c.drawString(
            20 * mm, 14 * mm, "\u00a9 2026 Cosy Content Ltd  \u2022  Confidential"
        )
        c.drawRightString(W - 20 * mm, 14 * mm, "cosycontent.com")
        c.setFillColor(ACCENT)
        c.rect(0, 0, W, 4 * mm, fill=1, stroke=0)


# ─────────────────────────────────────────────────────────────────────────────
# Flowable: Section header band
# ─────────────────────────────────────────────────────────────────────────────


class _SectionHeader(Flowable):
    def __init__(self, title, subtitle=""):
        super().__init__()
        self._title = title
        self._subtitle = subtitle

    def wrap(self, avW, avH):
        self._w = avW
        return avW, 18 * mm

    def draw(self):
        c = self.canv
        c.setFillColor(DARK)
        c.roundRect(0, 0, self._w, 16 * mm, 3 * mm, fill=1, stroke=0)
        c.setFillColor(ACCENT)
        c.rect(0, 0, 3 * mm, 16 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(8 * mm, 9 * mm, self._title)
        if self._subtitle:
            c.setFillColor(colors.white)
            c.setFont("Helvetica", 8)
            c.drawString(8 * mm, 3.5 * mm, self._subtitle)


# ─────────────────────────────────────────────────────────────────────────────
# Flowable: Finding card
# ─────────────────────────────────────────────────────────────────────────────


class _FindingCard(Flowable):
    _PRI = {
        "CRITICAL": (RED, colors.HexColor("#FFF0F0")),
        "HIGH": (ORANGE, colors.HexColor("#FFF8F0")),
        "MEDIUM": (YELLOW, colors.HexColor("#FFFCF0")),
        "LOW": (GREEN, colors.HexColor("#F0FFF4")),
    }

    def __init__(self, priority, title, body):
        super().__init__()
        self._priority = str(priority).upper()
        self._title = title
        self._body = body

    def _get_layout(self, w):
        max_w = w - 14 * mm
        t_lines = _get_wrapped_lines(self._title, "Helvetica-Bold", 11, max_w)
        b_lines = _get_wrapped_lines(self._body, "Helvetica", 9, max_w)
        # title area: lines * 5mm
        # body area: lines * 4.5mm
        # base height (badge + title start + padding): 20mm
        h = 16 * mm + len(t_lines) * 5 * mm + len(b_lines) * 4.5 * mm + 4 * mm
        return max(32 * mm, h), t_lines, b_lines

    def wrap(self, avW, avH):
        self._w = avW
        self._h, _, _ = self._get_layout(avW)
        return avW, self._h

    def draw(self):
        c = self.canv
        w, h = self._w, self._h
        badge_col, bg_col = self._PRI.get(
            self._priority, (MID_GREY, colors.HexColor("#F9F9F9"))
        )

        c.setFillColor(bg_col)
        c.roundRect(0, 0, w, h, 3 * mm, fill=1, stroke=0)
        c.setStrokeColor(badge_col)
        c.setLineWidth(1)
        c.roundRect(0, 0, w, h, 3 * mm, fill=0, stroke=1)

        # left stripe
        c.setFillColor(badge_col)
        c.roundRect(0, 0, 3 * mm, h, 3 * mm, fill=1, stroke=0)
        c.rect(1.5 * mm, 0, 1.5 * mm, h, fill=1, stroke=0)

        # priority badge
        badge_text = self._priority
        badge_w = stringWidth(badge_text, "Helvetica-Bold", 7) + 6
        c.setFillColor(badge_col)
        c.roundRect(8 * mm, h - 8.5 * mm, badge_w, 6 * mm, 3 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white if self._priority == "CRITICAL" else DARK)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(8 * mm + 3, h - 5.5 * mm, badge_text)

        # title
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 11)
        y = _draw_wrapped(c, self._title, 8 * mm, h - 14 * mm, w - 14 * mm, line_height=5)

        # body
        y -= 1 * mm
        c.setFont("Helvetica", 9)
        c.setFillColor(MID_GREY)
        _draw_wrapped(c, self._body, 8 * mm, y, w - 14 * mm, line_height=4.5)


# ─────────────────────────────────────────────────────────────────────────────
# Flowable: Quick win card
# ─────────────────────────────────────────────────────────────────────────────


class _QuickWinCard(Flowable):
    def __init__(self, number, title, body):
        super().__init__()
        self._number = number
        self._title = title
        self._body = body

    def _get_layout(self, w):
        max_w = w - 18 * mm
        t_lines = _get_wrapped_lines(self._title, "Helvetica-Bold", 10, max_w)
        b_lines = _get_wrapped_lines(self._body, "Helvetica", 9, max_w)
        h = 10 * mm + len(t_lines) * 4.5 * mm + len(b_lines) * 4.5 * mm + 4 * mm
        return max(22 * mm, h), t_lines, b_lines

    def wrap(self, avW, avH):
        self._w = avW
        self._h, _, _ = self._get_layout(avW)
        return avW, self._h

    def draw(self):
        c = self.canv
        w, h = self._w, self._h

        c.setFillColor(colors.HexColor("#F0FFF4"))
        c.roundRect(0, 0, w, h, 3 * mm, fill=1, stroke=0)
        c.setStrokeColor(GREEN)
        c.setLineWidth(1)
        c.roundRect(0, 0, w, h, 3 * mm, fill=0, stroke=1)

        # number circle
        c.setFillColor(GREEN)
        c.circle(8 * mm, h - 8 * mm, 5 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(8 * mm, h - 9.5 * mm, str(self._number))

        # title
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 10)
        y = _draw_wrapped(
            c, self._title, 16 * mm, h - 9.5 * mm, w - 18 * mm, line_height=4.5
        )

        # body
        y -= 0.5 * mm
        c.setFont("Helvetica", 9)
        c.setFillColor(MID_GREY)
        _draw_wrapped(c, self._body, 16 * mm, y, w - 18 * mm, line_height=4.5)


# ─────────────────────────────────────────────────────────────────────────────
# Flowable: CTA banner
# ─────────────────────────────────────────────────────────────────────────────


class _CtaBanner(Flowable):
    def __init__(self, location="Nairobi"):
        super().__init__()
        self._location = location
        self._h = 65 * mm

    def wrap(self, avW, avH):
        self._w = avW
        return avW, self._h

    def draw(self):
        c = self.canv
        w, h = self._w, self._h

        c.setFillColor(DARK)
        c.roundRect(0, 0, w, h, 4 * mm, fill=1, stroke=0)

        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 15)
        c.drawCentredString(
            w / 2, h - 10 * mm, "Don\u2019t let your website hold you back."
        )

        c.setFillColor(OFF_WHITE)
        c.setFont("Helvetica", 9.5)
        line = f"We specialise in transforming businesses in {self._location} by building websites that actually work."
        c.drawCentredString(w / 2, h - 17 * mm, line)

        # stats
        stats = [
            ("7 Days", "Turnaround"),
            ("\u00a359/mo", "Zero Upfront"),
            ("Managed", "Hosting & Support"),
        ]
        col_w = w / 3
        for i, (val, label) in enumerate(stats):
            cx = col_w * i + col_w / 2
            c.setFillColor(colors.white)
            c.setFont("Helvetica-Bold", 13)
            c.drawCentredString(cx, h - 28 * mm, val)
            c.setFillColor(MID_GREY)
            c.setFont("Helvetica", 8)
            c.drawCentredString(cx, h - 33 * mm, label)

        # dividers between stats
        c.setStrokeColor(colors.HexColor("#2A2A2A"))
        c.setLineWidth(0.5)
        c.line(col_w, h - 22 * mm, col_w, h - 38 * mm)
        c.line(col_w * 2, h - 22 * mm, col_w * 2, h - 38 * mm)

        # Buttons
        btn_w = 60 * mm
        btn_h = 9 * mm
        
        # Pricing Button
        p_bx = (w / 2) - btn_w - 2 * mm
        p_by = 6 * mm
        c.setFillColor(ACCENT)
        c.roundRect(p_bx, p_by, btn_w, btn_h, 2 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(p_bx + btn_w / 2, p_by + 3 * mm, "VIEW PLANS & PRICING")
        c.linkURL("https://cosycontent.com/pricing", (p_bx, p_by, p_bx + btn_w, p_by + btn_h), relative=1)

        # Signup Button
        s_bx = (w / 2) + 2 * mm
        s_by = 6 * mm
        c.setFillColor(OFF_WHITE)
        c.roundRect(s_bx, s_by, btn_w, btn_h, 2 * mm, fill=1, stroke=0)
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(s_bx + btn_w / 2, s_by + 3 * mm, "GET MY NEW WEBSITE")
        c.linkURL("https://cosycontent.com/signup", (s_bx, s_by, s_bx + btn_w, s_by + btn_h), relative=1)


# ─────────────────────────────────────────────────────────────────────────────
# Page callbacks (header / footer on interior pages)
# ─────────────────────────────────────────────────────────────────────────────


def _make_cover_callback(cover_flowable):
    """Returns an onFirstPage callback that draws the cover."""

    def _cb(canvas, doc):
        canvas.saveState()
        cover_flowable.canv = canvas
        cover_flowable.draw()
        canvas.restoreState()

    return _cb


def _make_interior_callback(business_name):
    def _cb(canvas, doc):
        canvas.saveState()
        # header
        canvas.setFillColor(DARK)
        canvas.rect(0, H - 14 * mm, W, 14 * mm, fill=1, stroke=0)
        canvas.setFillColor(ACCENT)
        canvas.rect(0, H - 14 * mm, 3 * mm, 14 * mm, fill=1, stroke=0)
        canvas.setFillColor(colors.white)
        canvas.setFont("Helvetica-Bold", 9)
        canvas.drawString(
            10 * mm, H - 9 * mm, f"{business_name} \u2022 Website Performance Audit"
        )
        canvas.setFillColor(MID_GREY)
        canvas.setFont("Helvetica", 8)
        current_date = datetime.now().strftime("%B %Y")
        canvas.drawRightString(
            W - 10 * mm, H - 9 * mm, f"Cosy Content Ltd  \u2022  {current_date}"
        )
        # footer
        canvas.setFillColor(DARK)
        canvas.rect(0, 0, W, 10 * mm, fill=1, stroke=0)
        canvas.setFillColor(ACCENT)
        canvas.rect(0, 0, W, 2 * mm, fill=1, stroke=0)
        canvas.setFillColor(MID_GREY)
        canvas.setFont("Helvetica", 7.5)
        canvas.drawString(
            10 * mm, 3.5 * mm, "\u00a9 2026 Cosy Content Ltd  \u2022  Confidential"
        )
        canvas.setFillColor(colors.white)
        canvas.drawRightString(W - 10 * mm, 3.5 * mm, f"Page {doc.page}")
        canvas.restoreState()

    return _cb


# ─────────────────────────────────────────────────────────────────────────────
# Public API: generate_beautiful_pdf
# ─────────────────────────────────────────────────────────────────────────────


def generate_beautiful_pdf(report):
    """
    Generate a beautiful, branded PDF audit report using ReportLab.
    Returns raw PDF bytes, or None on failure.

    Replaces both the old `create_beautiful_html` + `generate_pdf_from_html` pair.
    """
    try:
        data = report.report_data
        scores = data.get("scores", {})

        def _norm(v):
            try:
                v = int(v)
                return v if v > 20 else v * 5
            except Exception:
                return 0

        score_map = {
            "Design": _norm(scores.get("design") or scores.get("ux") or 0),
            "Mobile UX": _norm(
                scores.get("mobile_ux") or scores.get("accessibility") or 0
            ),
            "Conversion": _norm(
                scores.get("lead_conversion") or scores.get("conversion") or 0
            ),
            "SEO": _norm(scores.get("seo_basics") or scores.get("seo") or 0),
            "Performance": _norm(
                scores.get("performance") or scores.get("trust_signals") or 0
            ),
        }
        overall = _norm(data.get("overall_score", 0))

        buf = BytesIO()
        doc = SimpleDocTemplate(
            buf,
            pagesize=A4,
            leftMargin=20 * mm,
            rightMargin=20 * mm,
            topMargin=20 * mm,
            bottomMargin=15 * mm,
        )

        cover = _CoverPage(report.business_name, report.website_url, overall, score_map)

        story = [PageBreak()]  # page 1 is drawn by the onFirstPage callback

        # ── Critical Findings ──────────────────────────────────────────────
        story.append(
            _SectionHeader(
                "Critical Findings", "Priority issues requiring immediate attention"
            )
        )
        story.append(Spacer(1, 3 * mm))

        for f in data.get("findings", []):
            priority = f.get("severity") or f.get("priority") or "medium"
            title = f.get("issue") or f.get("text") or "Finding"
            body = f.get("detail") or f.get("description") or ""
            card = _FindingCard(priority, title, body)
            story.append(KeepTogether([card, Spacer(1, 3 * mm)]))

        story.append(Spacer(1, 4 * mm))

        # ── Quick Wins ─────────────────────────────────────────────────────
        story.append(
            _SectionHeader(
                "Strategic Quick Wins", "High-impact actions you can take this week"
            )
        )
        story.append(Spacer(1, 3 * mm))

        for i, w in enumerate(data.get("quick_wins", []), 1):
            title = w.get("action") or w.get("text") or "Quick Win"
            body = w.get("detail") or w.get("description") or ""
            card = _QuickWinCard(i, title, body)
            story.append(KeepTogether([card, Spacer(1, 3 * mm)]))

        story.append(Spacer(1, 6 * mm))

        # ── CTA Banner ─────────────────────────────────────────────────────
        story.append(_CtaBanner(location=getattr(report, "location", "Nairobi")))

        doc.build(
            story,
            onFirstPage=_make_cover_callback(cover),
            onLaterPages=_make_interior_callback(report.business_name),
        )

        return buf.getvalue()

    except Exception as e:
        logger.error(f"generate_beautiful_pdf failed: {e}")
        return None


# ─────────────────────────────────────────────────────────────────────────────
# Email helper (unchanged logic, kept for completeness)
# ─────────────────────────────────────────────────────────────────────────────


def send_audit_email(report, pdf_content):
    brevo_api_key = os.getenv("BREVO_API_KEY")
    if not brevo_api_key:
        return False

    import base64

    payload = {
        "sender": {"name": "Cosy Content", "email": "contact@cosycontent.com"},
        "to": [{"email": report.email, "name": report.name}],
        "subject": f"Your Website Audit for {report.business_name} \U0001f4ca",
        "htmlContent": f"""
            <html>
            <body style="font-family: sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;
                            border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #1B1C1C;">Hi {report.name}!</h1>
                    <p>Thanks for requesting an audit for <strong>{report.business_name}</strong>.</p>
                    <p>We've analysed your site at <code>{report.website_url}</code> and
                       generated a detailed performance scorecard for you.</p>
                    <div style="background:#f8fafc; padding:20px; border-radius:8px;
                                text-align:center; margin:20px 0;">
                        <span style="font-size:14px; text-transform:uppercase;
                                     letter-spacing:1px; font-weight:bold;
                                     color:#3D4949;">Overall Score</span><br/>
                        <span style="font-size:48px; font-weight:900;
                                     color:#00696D;">{report.report_data.get("overall_score", "–")}/100</span>
                    </div>
                    <p><strong>Your PDF report is attached.</strong> It includes critical
                       findings and quick wins to help you get more leads.</p>
                    <p style="margin-top:30px;"><strong>Ready to fix these issues?</strong></p>
                    <p>We can rebuild your website in just 7 days — for as little as
                       £59/month with no upfront cost.</p>
                    <a href="https://cosycontent.com/signup"
                       style="display:inline-block; background:#00696D; color:#FFFFFF;
                              padding:15px 25px; text-decoration:none; border-radius:8px;
                              font-weight:bold; margin-top:10px;">Get My New Website</a>
                    <p style="margin-top:40px; font-size:12px; color:#94a3b8;">
                        &copy; 2026 Cosy Content Ltd. All rights reserved.
                    </p>
                </div>
            </body>
            </html>
        """,
    }

    if pdf_content:
        payload["attachment"] = [
            {
                "content": base64.b64encode(pdf_content).decode("utf-8"),
                "name": f"{report.business_name}_Audit.pdf",
            }
        ]

    headers = {
        "accept": "application/json",
        "api-key": brevo_api_key,
        "content-type": "application/json",
    }

    try:
        resp = requests.post(
            "https://api.brevo.com/v3/smtp/email", json=payload, headers=headers
        )
        return resp.status_code == 201
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False


# ─────────────────────────────────────────────────────────────────────────────
# Main task
# ─────────────────────────────────────────────────────────────────────────────


def perform_audit(audit_id):
    from ..models import AuditReport

    try:
        report = AuditReport.objects.get(id=audit_id)
        url = report.website_url
        if not url.startswith("http"):
            url = "https://" + url

        # 1. Stripe customer creation ──────────────────────────────────────
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            customer = stripe.Customer.create(
                email=report.email,
                name=report.name,
                description=f"Lead from Website Audit: {report.business_name}",
                metadata={
                    "business_name": report.business_name,
                    "industry": report.industry,
                    "location": report.location,
                    "website_url": report.website_url,
                },
            )
            report.stripe_customer_id = customer.id
            report.save()
        except Exception as e:
            logger.error(f"Stripe Customer creation failed: {e}")

        # 2. Scrape & AI analysis ──────────────────────────────────────────
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        report.meta_title = soup.title.string if soup.title else ""
        report.load_speed_score = 55  # placeholder until real CWV integration

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        ai_resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4000,
            system=(
                "You are a conversion rate optimisation expert. "
                "Return ONLY valid JSON with these keys: "
                "overall_score (int 0-100), "
                "scores (object: design, mobile_ux, lead_conversion, seo_basics, performance — each 0-100), "
                "findings (array of {severity, issue, detail}), "
                "quick_wins (array of {action, detail}), "
                "summary (string). "
                "No markdown, no explanation, just the JSON object."
            ),
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Audit this website for conversion performance.\n"
                        f"URL: {url}\n"
                        f"Business: {report.business_name}\n"
                        f"Industry: {report.industry}\n"
                        f"Meta title: {report.meta_title}\n"
                        f"Location: {report.location}"
                    ),
                }
            ],
        )

        raw = ai_resp.content[0].text.strip()
        logger.info(f"Claude raw response: {raw}")

        # strip markdown fences if present
        if raw.startswith("```json"):
            raw = raw[7:]
        elif raw.startswith("```"):
            raw = raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()

        report.report_data = json.loads(raw)
        report.save()

        # 3. PDF generation & email ────────────────────────────────────────
        pdf_bytes = generate_beautiful_pdf(report)
        send_audit_email(report, pdf_bytes)

        return report.report_data

    except Exception as e:
        logger.error(f"Audit failed for {audit_id}: {e}")
        return None
