# Leynilitir ✦

Íslenskur litaleikur þar sem leynimynd birtist smám saman þegar reitir eru litaðir eftir númerum. Engar forsýningar eða myndheiti birtast fyrr en mynd er fullgerð.

## Spila

Veldu stig og leynimynd. Veldu númeraðan lit og smelltu á reiti með sama númeri. Einnig má halda músarhnappnum niðri og draga. Rangt litaval breytir ekki myndinni og engin tímamörk eða stigatap eru í leiknum.

| Stig | Stærð | Litir | Myndir |
| --- | --- | --- | --- |
| 1 | 8 × 8 | 4 | 6 |
| 2 | 12 × 12 | 6 | 6 |
| 3 | 16 × 16 | 8 | 6 |
| 4 | 20 × 20 | 10 | 6 |

Alls 24 upprunalegar myndir; mismunandi myndefni á hverju stigi. Ólitaðir reitir sýna númer og myndin verður smám saman þekkjanleg þegar litað er.

- Framvinda vistast á tækinu í `localStorage`, eftir mynd. Hún fylgir ekki milli tækja og eyðist ef vafragögnum er eytt. Einkavafri getur takmarkað vistun.
- Hægt er að stækka reiti og fletta myndinni, eða kveikja á vísbendingu fyrir valinn lit.
- Hljóð er valfrjálst og slökkt í upphafi. Leikurinn virðir stillingu um minni hreyfingu.
- Fullgerðar myndir birtast á forsíðu og má vista sem PNG.
- Lyklaborð: Tab að mynd, örvar milli reita, Enter/bil til að lita. Tölur 1–9 velja lit; 0 velur lit 10.
- Engar auglýsingar, innskráning, mælingar eða utanaðkomandi gagnasendingar. Engar ytri letur- eða myndaskrár.

## Keyra á eigin tölvu

Opnaðu `index.html`, eða keyrðu `python3 -m http.server 8080` og opnaðu `http://localhost:8080`.

## Próf

`npm test` keyrir próf fyrir stærðir, liti og stöðugleika allra mynda. Viðmót er einnig prófað með raunverulegum Chromium vafra, m.a. vistun, röngu litavali, lyklaborði, snertingu og fullgerðri mynd.

## GitHub Pages

Innbyggt Actions verkflæði birtir þessar kyrrstæðu skrár á GitHub Pages við breytingar á `main`. Ef Pages hefur ekki áður verið virkjað þarf að velja **Settings → Pages → Source → GitHub Actions** í geymslunni. Engin bygging eða pakkauppsetning er nauðsynleg.

Myndefni og leikjaframvinda eru útgáfumerkt; breytt röðun eða innihald mynda krefst nýs vistunarlykils til að gömul framvinda eigi áfram við réttar myndir.
