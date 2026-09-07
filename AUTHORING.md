# Question Bank — Authoring Guide

The bank lives in `data/questions.json`. Shape:

```json
{
  "meta": { ... },
  "categories": [
    {
      "category": "Right of way (Vigepligt)",
      "questions": [
        {
          "id": "row-020",
          "scenario": "Plain-English description of the traffic situation.",
          "image": "/scenarios/row-020.jpg",     // OPTIONAL — your own/licensed image
          "imageAlt": "Short description for screen readers",
          "subquestions": [
            {
              "text": "A statement the learner marks True or False.",
              "answer": true,
              "explanation": "Why this answer is correct — one clear sentence."
            }
          ]
        }
      ]
    }
  ]
}
```

## Rules that keep the product good (and legal)

1. **Original wording only.** Write every scenario and statement yourself from
   the public rules (Færdselsloven, Færdselsstyrelsen's published test format).
   Never copy or lightly reword another site's questions or Færdselsstyrelsen's
   actual secret test items.
2. **Every sub-question gets an explanation.** This is the paid product's main
   value. One clear sentence saying *why*.
3. **IDs are unique** and prefixed by category: `row-`, `spd-`, `ovt-`, `prk-`,
   `vru-`, `mwy-`, `veh-`, `eco-`, `fst-`, `alc-`, `doc-`, `sign-`. Increment the
   number; don't reuse.
4. **No filler.** Two genuinely different situations beat five reworded copies of
   the same one. Vary the situation, not just the phrasing.
5. **Images**: put files in `public/scenarios/` and reference as
   `/scenarios/<id>.jpg`. Use only photos/illustrations you own or have licensed.
   The quiz renders the image automatically above the scenario text.

## Suggested targets per category (to feel complete vs competitors)

| Category | Rough target scenarios |
|---|---|
| Right of way | 40 |
| Road signs | 40 |
| Speed | 30 |
| Overtaking | 20 |
| Stopping & parking | 25 |
| Vulnerable road users | 30 |
| Motorway | 20 |
| Vehicle requirements | 20 |
| Eco driving | 15 |
| First aid | 15 |
| Alcohol/fitness | 15 |
| Documents/insurance | 15 |

Validate after editing:

```bash
python3 -c "import json; d=json.load(open('data/questions.json')); \
print(sum(len(c['questions']) for c in d['categories']),'scenarios')"
```
