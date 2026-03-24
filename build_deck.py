import sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# --- Config ---
LOGO = r"C:\Users\bilal\Downloads\seedream-4_5_Samsara_ai_logo_design_Flower_of_Life_sacred_geometry_pattern_forming_a_perfect_-0_dada77da-65d8-43e3-956c-7fb017988364.jpg"
DECK_IMG = r"C:\Users\bilal\Downloads\grokking\public\deck-images"
OUT = r"C:\Users\bilal\Downloads\samsara_video_script.pptx"

# Brand colors
NAVY = RGBColor(0x0f, 0x17, 0x2a)
GOLD = RGBColor(0xC8, 0xA2, 0x3D)
WHITE = RGBColor(0xF8, 0xFA, 0xFC)
BLUE = RGBColor(0x60, 0xA5, 0xFA)
GREEN = RGBColor(0x22, 0xC5, 0x5E)
GRAY = RGBColor(0x94, 0xA3, 0xB8)
LIGHT_GRAY = RGBColor(0xCB, 0xD5, 0xE1)
PURPLE = RGBColor(0x8B, 0x5C, 0xF6)
ACCENT_BAR = RGBColor(0x3B, 0x82, 0xF6)
CARD_BG = RGBColor(0x15, 0x1D, 0x33)
FOOTER_BG = RGBColor(0x0A, 0x0F, 0x1E)
RED = RGBColor(0xEF, 0x44, 0x44)
AMBER = RGBColor(0xF5, 0x9E, 0x0B)

# 16:9
W = Inches(13.333)
H = Inches(7.5)

prs = Presentation()
prs.slide_width = W
prs.slide_height = H
blank_layout = prs.slide_layouts[6]


def add_bg(slide):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = NAVY


def add_rect(slide, left, top, width, height, color):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape


def add_text(slide, left, top, width, height, text, size=18, color=WHITE,
             bold=False, align=PP_ALIGN.LEFT, font_name="Segoe UI"):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = align
    return txBox


def add_gradient_bar(slide):
    add_rect(slide, 0, 0, W, Inches(0.06), ACCENT_BAR)


def add_footer(slide, text):
    add_rect(slide, 0, H - Inches(0.5), W, Inches(0.5), FOOTER_BG)
    add_text(slide, Inches(0.4), H - Inches(0.45), Inches(12), Inches(0.4),
             text, size=11, color=GRAY)


def add_img(slide, path, left, top, width=None, height=None):
    if not os.path.exists(path):
        print(f"  MISSING: {path}")
        return None
    kwargs = {}
    if width:
        kwargs["width"] = width
    if height:
        kwargs["height"] = height
    return slide.shapes.add_picture(path, left, top, **kwargs)


def add_logo_small(slide):
    add_img(slide, LOGO, Inches(11.8), Inches(0.15), height=Inches(0.8))


def deck_img(name):
    return os.path.join(DECK_IMG, name)


# ============================================================
# SLIDE 1: TITLE
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)

add_img(s, LOGO, Inches(4.9), Inches(0.3), height=Inches(3.8))
add_text(s, Inches(0), Inches(4.2), W, Inches(0.8), "SAMSARA",
         size=54, color=WHITE, bold=True, align=PP_ALIGN.CENTER, font_name="Georgia")
add_text(s, Inches(0), Inches(4.9), W, Inches(0.5), ".ai",
         size=32, color=GOLD, align=PP_ALIGN.CENTER, font_name="Georgia")
add_text(s, Inches(1), Inches(5.6), Inches(11.3), Inches(0.5),
         "Every mind deserves a brilliant tutor. Now they have one.",
         size=22, color=LIGHT_GRAY, align=PP_ALIGN.CENTER)
add_rect(s, 0, H - Inches(0.55), W, Inches(0.55), FOOTER_BG)
add_text(s, Inches(0), H - Inches(0.5), W, Inches(0.4),
         "samsara.ai  \u00b7  Pre-Seed 2025  \u00b7  Built Solo  \u00b7  LEARN \u00b7 EVOLVE \u00b7 TRANSCEND",
         size=12, color=GRAY, align=PP_ALIGN.CENTER)

# ============================================================
# SLIDE 2: FOUNDER & TEAM (with video placeholder)
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)
add_text(s, Inches(0.5), Inches(0.3), Inches(3), Inches(0.35),
         "FOUNDER & TEAM", size=13, color=GOLD, bold=True)
add_logo_small(s)

add_text(s, Inches(0.5), Inches(0.9), Inches(7.5), Inches(1.3),
         "\"Hi, I'm Bilal Hussain \u2014\nFounder of Samsara.ai.\"",
         size=34, color=WHITE, bold=True, font_name="Georgia")

# Video placeholder
vbox = add_rect(s, Inches(8.5), Inches(0.8), Inches(4.3), Inches(3.0), CARD_BG)
vbox.line.color.rgb = PURPLE
vbox.line.width = Pt(2)
add_text(s, Inches(8.5), Inches(1.6), Inches(4.3), Inches(0.6),
         "\u25b6", size=48, color=PURPLE, align=PP_ALIGN.CENTER)
add_text(s, Inches(8.5), Inches(2.3), Inches(4.3), Inches(0.5),
         "FOUNDER VIDEO", size=14, color=GRAY, align=PP_ALIGN.CENTER)
add_text(s, Inches(8.5), Inches(2.7), Inches(4.3), Inches(0.4),
         "Record & embed your intro here", size=11, color=RGBColor(0x64, 0x74, 0x8B), align=PP_ALIGN.CENTER)

# Credential cards
creds = [
    ("\U0001f393 Harvard CS", "Computer Science"),
    ("\u26a1 Built Solo", "Zero external hires"),
    ("\U0001f916 Claude Code", "Primary dev env"),
    ("\U0001f4c5 7+ Years", "AI + Full-Stack"),
]
for i, (title, sub) in enumerate(creds):
    cw = Inches(2.85)
    x = Inches(0.5) + i * (cw + Inches(0.15))
    y = Inches(2.8)
    card = add_rect(s, x, y, cw, Inches(1.1), CARD_BG)
    card.line.color.rgb = RGBColor(0x2D, 0x3B, 0x55)
    card.line.width = Pt(1)
    add_text(s, x + Inches(0.15), y + Inches(0.15), cw - Inches(0.3), Inches(0.4),
             title, size=16, color=WHITE, bold=True)
    add_text(s, x + Inches(0.15), y + Inches(0.6), cw - Inches(0.3), Inches(0.3),
             sub, size=12, color=GRAY)

add_text(s, Inches(0.5), Inches(4.15), Inches(12.3), Inches(0.5),
         "I built this because I AM the user \u2014 multilingual, underserved by every edtech platform that came before.",
         size=16, color=LIGHT_GRAY)

# Video tip box
add_rect(s, Inches(0.5), Inches(5.0), Inches(12.3), Inches(1.3), CARD_BG)
add_text(s, Inches(0.7), Inches(5.1), Inches(11.9), Inches(1.1),
         "\U0001f3ac VIDEO TIP: Including a video helps remind investors of you when evaluating your company.\n"
         "Record a 30\u201360 second intro: who you are, what Samsara.ai does, and why you are the right person to build it.\n"
         "Embed the video in the purple placeholder above, or link to it on YouTube/Loom.",
         size=13, color=LIGHT_GRAY)

add_footer(s, "0:00 \u2013 0:10  \u00b7  INTRODUCE YOURSELF + PLAY VIDEO")

# ============================================================
# SLIDE 3: THE PROBLEM
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)
add_text(s, Inches(0.5), Inches(0.3), Inches(3), Inches(0.35),
         "THE PROBLEM", size=13, color=GOLD, bold=True)
add_logo_small(s)

add_text(s, Inches(0.5), Inches(0.9), Inches(12), Inches(0.7),
         "1.5 Billion people are learning English right now.",
         size=32, color=WHITE, bold=True, font_name="Georgia")

stats = [
    ("96%", "Duolingo\nDropout Rate", RED),
    ("$100", "Per hour for\na human tutor", AMBER),
    ("90%", "Quality content\nin English only", BLUE),
]
for i, (num, label, accent) in enumerate(stats):
    x = Inches(0.5) + i * Inches(4.1)
    card = add_rect(s, x, Inches(2.0), Inches(3.8), Inches(2.2), CARD_BG)
    card.line.color.rgb = accent
    card.line.width = Pt(2)
    add_text(s, x, Inches(2.2), Inches(3.8), Inches(1.0),
             num, size=56, color=accent, bold=True, align=PP_ALIGN.CENTER)
    add_text(s, x, Inches(3.2), Inches(3.8), Inches(0.8),
             label, size=16, color=GRAY, align=PP_ALIGN.CENTER)

add_text(s, Inches(0.5), Inches(4.6), Inches(12.3), Inches(0.5),
         "Duolingo teaches vocabulary. Not conversation. Not comprehension. Not confidence.",
         size=17, color=LIGHT_GRAY)
add_text(s, Inches(0.5), Inches(5.2), Inches(12.3), Inches(0.5),
         "The private tutor is the solution \u2014 but it costs $100/hr and only speaks one language.",
         size=17, color=LIGHT_GRAY)
add_footer(s, "0:10 \u2013 0:25")

# ============================================================
# SLIDE 4: THE SOLUTION (with Python lesson screenshot)
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)
add_text(s, Inches(0.5), Inches(0.3), Inches(3), Inches(0.35),
         "THE SOLUTION", size=13, color=GOLD, bold=True)
add_logo_small(s)

add_text(s, Inches(0.5), Inches(0.8), Inches(6), Inches(0.7),
         "Samsara.ai \u2014 AI tutors that\nactually speak your language.",
         size=28, color=WHITE, bold=True, font_name="Georgia")

features = [
    ("\U0001f5e3\ufe0f Voice Tutors in 8 Languages",
     "French \u00b7 Spanish \u00b7 English \u00b7 Japanese \u00b7 Dutch \u00b7 Hindi \u00b7 German \u00b7 More"),
    ("\U0001f9e0 Conversational Memory",
     "Tutors remember your past sessions, your level, and your progress"),
    ("\U0001f4da 69+ Courses \u00b7 2,284+ Lessons",
     "Coding \u00b7 Finance \u00b7 Philosophy \u00b7 Languages \u00b7 Meditation \u00b7 Religion"),
    ("\U0001f4b0 $15/month \u2014 1 Month Free Trial",
     "75% cheaper than Coursera \u00b7 No credit card required"),
]
y = Inches(2.0)
for title, desc in features:
    add_rect(s, Inches(0.5), y, Inches(0.06), Inches(0.65), BLUE)
    add_text(s, Inches(0.75), y, Inches(5.5), Inches(0.35),
             title, size=15, color=WHITE, bold=True)
    add_text(s, Inches(0.75), y + Inches(0.32), Inches(5.5), Inches(0.3),
             desc, size=11, color=GRAY)
    y += Inches(0.85)

add_img(s, deck_img("python-lesson.png"), Inches(6.8), Inches(1.5), width=Inches(6.0))
add_footer(s, "0:25 \u2013 0:45  \u00b7  DEMO: show live platform during this slide")

# ============================================================
# SLIDE 5: TALK MODE (language selector + talk screenshots)
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)
add_text(s, Inches(0.5), Inches(0.3), Inches(4), Inches(0.35),
         "SECRET WEAPON: TALK MODE", size=13, color=GOLD, bold=True)
add_logo_small(s)

add_text(s, Inches(0.5), Inches(0.8), Inches(5.5), Inches(0.6),
         "True Two-Way Voice Conversation",
         size=28, color=WHITE, bold=True, font_name="Georgia")

add_img(s, deck_img("talk-languages.png"), Inches(0.3), Inches(1.7), width=Inches(5.5))
add_img(s, deck_img("talk-desktop.png"), Inches(6.2), Inches(1.7), width=Inches(6.8))

add_rect(s, Inches(0.5), Inches(5.7), Inches(12.3), Inches(0.7), CARD_BG)
add_text(s, Inches(0.7), Inches(5.8), Inches(11.9), Inches(0.5),
         "No other platform offers this. Duolingo has pronunciation exercises. We have conversations.",
         size=16, color=AMBER, bold=True, align=PP_ALIGN.CENTER)
add_footer(s, "Voice AI is the technical moat")

# ============================================================
# SLIDE 6: LIVE PLATFORM (dashboard + mobile screenshots)
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)
add_text(s, Inches(0.5), Inches(0.3), Inches(3), Inches(0.35),
         "LIVE PLATFORM", size=13, color=GOLD, bold=True)
add_logo_small(s)

add_text(s, Inches(0.5), Inches(0.8), Inches(8), Inches(0.6),
         "Built solo. Bootstrapped. Live today.",
         size=28, color=WHITE, bold=True, font_name="Georgia")

plat_stats = [("69+", "Courses"), ("2,284+", "Lessons"), ("8", "Languages"), ("$15/mo", "Price")]
for i, (num, label) in enumerate(plat_stats):
    yp = Inches(1.7) + i * Inches(0.75)
    add_rect(s, Inches(0.5), yp, Inches(0.06), Inches(0.6), GREEN)
    add_text(s, Inches(0.75), yp + Inches(0.05), Inches(1.5), Inches(0.35),
             num, size=22, color=GREEN, bold=True)
    add_text(s, Inches(2.3), yp + Inches(0.1), Inches(2), Inches(0.35),
             label, size=15, color=GRAY)

add_img(s, deck_img("dashboard.png"), Inches(4.5), Inches(1.5), width=Inches(5.5))
add_img(s, deck_img("mobile-dashboard.png"), Inches(10.5), Inches(1.3), height=Inches(4.8))
add_footer(s, "0:45 \u2013 0:60  \u00b7  SCREEN SHARE: show real platform at samsara.ai")

# ============================================================
# SLIDE 7: COURSE CATALOG (courses page screenshot)
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)
add_text(s, Inches(0.5), Inches(0.3), Inches(3), Inches(0.35),
         "COURSE CATALOG", size=13, color=GOLD, bold=True)
add_logo_small(s)

add_text(s, Inches(0.5), Inches(0.8), Inches(6), Inches(0.6),
         "7 Categories. 69+ Courses. 2,284+ Lessons.",
         size=26, color=WHITE, bold=True, font_name="Georgia")

cats = [
    "\U0001f4bb CS", "\U0001f5e3\ufe0f Languages", "\U0001f54c Religion",
    "\U0001f3db\ufe0f Philosophy", "\U0001f4b0 Finance", "\U0001f9d8 Health", "\U0001f3af Leadership"
]
xb = Inches(0.5)
for cat in cats:
    badge = add_rect(s, xb, Inches(1.5), Inches(1.7), Inches(0.4), CARD_BG)
    badge.line.color.rgb = BLUE
    badge.line.width = Pt(1)
    add_text(s, xb + Inches(0.05), Inches(1.52), Inches(1.6), Inches(0.35),
             cat, size=10, color=WHITE, align=PP_ALIGN.CENTER)
    xb += Inches(1.78)

add_img(s, deck_img("courses.png"), Inches(0.5), Inches(2.2), width=Inches(12.3))
add_footer(s, "Breadth + depth across 7 domains")

# ============================================================
# SLIDE 8: PRICING (actual pricing screenshot)
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)
add_text(s, Inches(0.5), Inches(0.3), Inches(3), Inches(0.35),
         "BUSINESS MODEL", size=13, color=GOLD, bold=True)
add_logo_small(s)

add_text(s, Inches(0.5), Inches(0.8), Inches(6), Inches(0.6),
         "Simple Pricing. Massive Value.",
         size=28, color=WHITE, bold=True, font_name="Georgia")

add_img(s, deck_img("pricing.png"), Inches(1.5), Inches(1.6), width=Inches(10.3))

add_rect(s, Inches(0.5), Inches(6.0), Inches(12.3), Inches(0.6), CARD_BG)
add_text(s, Inches(0.5), Inches(6.05), Inches(12.3), Inches(0.5),
         "40% cheaper than Codecademy ($20/mo)  |  75% cheaper than Coursera ($59/mo)  |  83-95% gross margins",
         size=15, color=GREEN, bold=True, align=PP_ALIGN.CENTER)
add_footer(s, "Unit economics: ~$3-6 cost per 100 coaching sessions")

# ============================================================
# SLIDE 9: TRACTION + ASK
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)
add_text(s, Inches(0.5), Inches(0.3), Inches(3), Inches(0.35),
         "TRACTION + ASK", size=13, color=GOLD, bold=True)
add_logo_small(s)

add_text(s, Inches(0.5), Inches(0.8), Inches(8), Inches(0.7),
         "Raising $250,000 Pre-Seed",
         size=34, color=WHITE, bold=True, font_name="Georgia")

traction = [
    "Platform fully live \u2014 69+ courses, 2,284+ lessons, 8 languages",
    "1-month free Pro trial live for all new signups",
    "Bootstrapped \u2014 zero external capital raised to date",
    "Applying to DMZ incubator at Toronto Metropolitan University",
    "83\u201395% gross margins on $15/month subscription",
]
for i, item in enumerate(traction):
    yp = Inches(1.8) + i * Inches(0.55)
    add_text(s, Inches(0.5), yp, Inches(7), Inches(0.45),
             "\u2705  " + item, size=15, color=LIGHT_GRAY)

fund_card = add_rect(s, Inches(8.0), Inches(1.6), Inches(4.8), Inches(4.0), CARD_BG)
fund_card.line.color.rgb = BLUE
fund_card.line.width = Pt(2)
add_text(s, Inches(8.2), Inches(1.75), Inches(4.4), Inches(0.4),
         "USE OF FUNDS", size=16, color=BLUE, bold=True)
funds = [("32%", "Marketing & Growth"), ("28%", "First Growth Hire"),
         ("16%", "AI Infrastructure"), ("10%", "B2B Sales"), ("14%", "Legal + Ops")]
for i, (pct, label) in enumerate(funds):
    yp = Inches(2.3) + i * Inches(0.55)
    add_text(s, Inches(8.3), yp, Inches(0.8), Inches(0.4),
             pct, size=18, color=GREEN, bold=True)
    add_text(s, Inches(9.3), yp + Inches(0.03), Inches(3.3), Inches(0.35),
             label, size=15, color=LIGHT_GRAY)

add_footer(s, "0:45 \u2013 1:00")

# ============================================================
# SLIDE 10: CLOSING
# ============================================================
s = prs.slides.add_slide(blank_layout)
add_bg(s)
add_gradient_bar(s)

add_img(s, LOGO, Inches(4.9), Inches(0.3), height=Inches(3.5))

add_text(s, Inches(0), Inches(3.9), W, Inches(0.9),
         "Every mind deserves\na brilliant tutor.",
         size=40, color=WHITE, bold=True, align=PP_ALIGN.CENTER, font_name="Georgia")
add_text(s, Inches(0), Inches(4.9), W, Inches(0.5),
         "Now they have one.",
         size=28, color=GOLD, align=PP_ALIGN.CENTER, font_name="Georgia")

cta = add_rect(s, Inches(4.5), Inches(5.5), Inches(4.3), Inches(0.6), PURPLE)
cta.line.fill.background()
add_text(s, Inches(4.5), Inches(5.53), Inches(4.3), Inches(0.5),
         "Try Free \u2192 samsara.ai", size=18, color=WHITE, bold=True, align=PP_ALIGN.CENTER)

add_text(s, Inches(0), Inches(6.3), W, Inches(0.4),
         "Raising $250K Pre-Seed  \u00b7  bilal@samsara.ai  \u00b7  Harvard CS  \u00b7  Toronto",
         size=14, color=GRAY, align=PP_ALIGN.CENTER)

add_footer(s, "1:00 \u2013 1:15  \u00b7  SAMSARA.AI")

# Save
prs.save(OUT)
print(f"Saved {len(prs.slides)} slides to {OUT}")
print("Done!")
