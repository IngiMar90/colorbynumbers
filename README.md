# Leynilitir ✦

Íslenskur litaleikur þar sem leynimynd birtist smám saman þegar reitir eru litaðir eftir númerum. Engar forsýningar eða myndheiti birtast fyrr en mynd er fullgerð.

## Spila

Veldu stig og leynimynd. Veldu númeraða málningardós neðst og smelltu á reiti með sama númeri. Pensilbendillinn byrjar hvítur og oddurinn fær litinn sem þú velur. Hægra megin við myndina er skýring með númeri, litasýni og heiti hvers litar. Sýnishorn af penslinum við málningardósirnar sýnir líka valinn lit á snertiskjá. Einnig má halda músarhnappnum niðri og draga. Rangt litaval breytir ekki myndinni og engin tímamörk eða stigatap eru í leiknum.

| Stig | Stærð | Litir | Myndir |
| --- | --- | --- | --- |
| 1 | 12 × 12 | 6 | 6 |
| 2 | 16 × 16 | 8 | 6 |
| 3 | 20 × 20 | 10 | 6 |
| 4 | 30 × 30 | 12 | 6 |

Nýja fjórða stigið hefur sex ítarlegar senur með 900 reitum í hverri. Eldri 8 × 8 myndir hafa verið teknar út. Framvinda í 12 × 12, 16 × 16 og 20 × 20 myndunum heldur sömu myndauðkennum þótt stiganúmerin breytist.

Alls 24 upprunalegar myndir; mismunandi myndefni á hverju stigi. Ólitaðir reitir sýna númer og myndin verður smám saman þekkjanleg þegar litað er.

- Framvinda vistast á tækinu í `localStorage`, eftir mynd. Hún fylgir ekki milli tækja og eyðist ef vafragögnum er eytt. Einkavafri getur takmarkað vistun.
- Hægt er að stækka reiti og fletta myndinni, eða kveikja á vísbendingu fyrir valinn lit.
- Hljóð er valfrjálst og slökkt í upphafi. Leikurinn virðir stillingu um minni hreyfingu.
- Fullgerðar myndir birtast á forsíðu og má vista sem PNG.
- Lyklaborð: Tab að mynd, örvar milli reita, Enter/bil til að lita. Tölur 1–9 velja lit; 0 velur lit 10.
- Engar auglýsingar, innskráning, mælingar eða utanaðkomandi gagnasendingar. Engar ytri letur- eða myndaskrár.

## Setja upp sem app

Opnaðu leikinn í Chrome eða Edge og veldu **Setja upp app** efst á síðunni. Vafrinn staðfestir uppsetninguna. Ef hann birtir ekki uppsetningarglugga sýnir hnappurinn leiðbeiningar fyrir uppsetningu í valmynd vafrans. Í Safari á iPhone/iPad er hægt að velja **Deila → Bæta á heimaskjá**.

Appið biður um fullskjásham við ræsingu og fellur aftur á sérstakan appglugga ef tækið styður ekki þann ham. Í venjulegum vafra er hægt að velja **Fullur skjár**. Engin þvinguð sjálfvirk fullskjábeiðni er gerð; vafrinn krefst þess að notandi smelli á hnappinn.

Manifest, PNG-appmerki og service worker nota hlutfallslegar slóðir svo uppsetning og spilun virki undir `/colorbynumbers/`. Eftir fyrstu vel heppnuðu opnun eru allar myndir og appskrár aðgengilegar án nets. Nýjar útgáfur eru sóttar þegar net er í boði. Vistun framvindu er áfram sú sama og í fyrstu útgáfu.

## Skjár og gluggastærð

Leikjaskjárinn fyllir tiltækan glugga. Myndin er sjálfkrafa stillt eftir bæði breidd og hæð, litaskýring er við hlið hennar (fyrir neðan á lóðréttum símaskjá) og málningardósirnar hafa fast pláss neðst. Forsíðan er einnig stillt eftir gluggastærð.

Við stærðarbreytingu eða skipt yfir í fullan skjá fer myndin aftur í sjálfvirka stærð. Valfrjáls stækkun með **+** leyfir skrun aðeins innan myndarinnar; **Passa** sýnir alla myndina aftur. Litadósir og stjórnborð haldast sýnileg. Á mjög litlum skjám verða reitir á erfiðustu stigum smáir; stækkunarhnappurinn er þá tiltækur.

## Keyra á eigin tölvu

Keyrðu `python3 -m http.server 8080` og opnaðu `http://localhost:8080`. Uppsetning og service worker krefjast HTTPS eða localhost; að opna HTML-skrá beint virkjar ekki þá eiginleika.

## Próf

`npm test` keyrir próf fyrir stærðir, liti og stöðugleika allra mynda.

`npm install`, `npx playwright install chromium` og `npm run test:browser` keyra próf á viðmóti, skjástærðum og uppsetningu. Browser-prófin sannreyna að stjórnborð og reitir séu sýnileg á tíu gluggastærðum, raunverulegan fullskjá, manifest, uppsetningarskilyrði Chromium, leiðir uppsetningarhnappsins, áframhaldandi vistun og spilun eftir endurhleðslu án nets. Nota má `LEYNILITIR_CHROMIUM_PATH` til að prófa með Chromium sem þegar er uppsett.

## GitHub Pages

Innbyggt Actions verkflæði birtir appskrár, manifest, service worker og appmerki á GitHub Pages við breytingar á `main`. Birtingin krefst engrar byggingar eða pakkauppsetningar. Pages er þegar virkjað fyrir geymsluna.

Hvert myndauðkenni er óháð sýnilegu stiganúmeri. Auðkenni myndar og litanúmerun haldast við endurröðun stiga. Ef innihaldi myndar er breytt þarf hún nýtt auðkenni svo gömul framvinda lendi ekki á annarri mynd.
