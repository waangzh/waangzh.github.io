"""Build the selected Fold identity from original filled vector geometry."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MASTER = ROOT / "masters"
MASTER.mkdir(parents=True, exist_ok=True)

FOLD = "M24 44H64V148L104 108V44H136V156L192 100V44H232V116L136 212H104V164L56 212H24Z"
SMALL = "M16 40H64V152L104 112V40H136V160L192 104V40H240V120L144 216H104V168L56 216H16Z"
# Small optical reduction of white stems on dark surfaces.
REVERSE = "M25 45H63V150L105 108V45H135V158L193 100V45H231V116L135 212H105V162L55 212H25Z"
GLYPHS = {
    "k": (48, "M0 0H10V32L30 12H44L24 32L48 56H34L10 32V56H0Z"),
    "e": (44, "M44 37H11C12 44 17 48 24 48C30 48 34 46 38 42L44 48C39 54 32 58 24 58C9 58 0 49 0 35C0 21 9 12 23 12C37 12 44 21 44 35ZM11 29H33C31 23 28 21 23 21C17 21 13 24 11 29Z"),
    "v": (46, "M0 14H11L23 44L35 14H46L29 56H17Z"),
    "i": (18, "M4 0H14V10H4ZM4 14H14V56H4Z"),
    "n": (44, "M0 14H10V19C14 14 19 12 25 12C37 12 44 20 44 32V56H34V33C34 25 31 22 24 22C16 22 10 27 10 35V56H0Z"),
    ".": (10, "M0 46H10V56H0Z"),
    "d": (44, "M34 0H44V56H34V51C30 56 25 58 20 58C8 58 0 49 0 35C0 21 8 12 20 12C25 12 30 14 34 19ZM34 35C34 26 29 21 22 21C15 21 10 26 10 35C10 44 15 49 22 49C29 49 34 44 34 35Z"),
}


def signature():
    x = 0
    pieces = []
    for letter in "kevin.dev":
        width, data = GLYPHS[letter]
        pieces.append(f'<path transform="translate({x} 0)" fill-rule="evenodd" d="{data}"/>')
        x += width + 8
    return "".join(pieces)


def svg(name, viewbox, artwork):
    content = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" '
        f'role="img" aria-labelledby="title"><title id="title">Kevin Fold - {name}</title>'
        f'{artwork}</svg>\n'
    )
    (MASTER / f"kevin-{name}.svg").write_text(content, encoding="utf-8")


svg("symbol", "0 0 256 256", f'<path fill="#202020" d="{FOLD}"/>')
svg("symbol-small", "0 0 256 256", f'<path fill="#202020" d="{SMALL}"/>')
svg("symbol-reversed", "0 0 256 256", f'<path fill="#ffffff" d="{REVERSE}"/>')
svg("wordmark", "0 0 432 80", f'<g fill="#202020" transform="translate(12 10)">{signature()}</g>')
svg(
    "horizontal", "0 0 792 256",
    f'<path fill="#202020" d="{FOLD}"/>'
    f'<g fill="#202020" transform="translate(296 91) scale(1.15)">{signature()}</g>',
)
svg(
    "stacked", "0 0 512 400",
    f'<path fill="#202020" transform="translate(128 8)" d="{FOLD}"/>'
    f'<g fill="#202020" transform="translate(52 298)">{signature()}</g>',
)

spec = {
    "brand": "kevin.dev",
    "tagline": "Fold / personal developer identity",
    "brief": "A personal homepage for Agent, RAG and AI application engineering. An original folded W ties the identity to the GitHub handle waangzh.",
    "adjectives": ["structured", "independent", "clear", "restrained"],
    "criteria": "A clear silhouette at small sizes; monochrome first; practical in a site header and browser tab.",
    "industry": "developer-tools",
    "mockups": ["website", "readme", "terminal", "app-icon", "social", "favicon-tab"],
    "nav": ["Home", "Projects", "GitHub"],
    "brand_color": "#277EC5",
    "tile_color": "#202020",
    "greyscale": False,
    "final": True,
    "designer": "Kevin / Fold identity",
    "concepts": [{
        "name": "Fold",
        "symbol": "masters/kevin-symbol.svg",
        "lockup": "masters/kevin-horizontal.svg",
        "stacked": "masters/kevin-stacked.svg",
        "symbol_on_dark": "masters/kevin-symbol-reversed.svg",
        "symbol_on_tile": "masters/kevin-symbol-reversed.svg",
        "idea": "A folded W connects a personal signature to the waangzh GitHub handle.",
        "rationale": [
            "Stepped 45-degree cuts give the W a distinctive silhouette.",
            "The monochrome mark matches the restrained homepage.",
            "Original outlined letterforms make the signature independent of installed fonts."
        ],
    }],
    "recommendation": "Use the charcoal symbol with the kevin.dev signature for the homepage; white artwork on dark tiles.",
    "next_steps": ["Choose assets for their background and size.", "Homepage installation is a separate step."],
}
(ROOT / "presentation.json").write_text(json.dumps(spec, indent=2), encoding="utf-8")
