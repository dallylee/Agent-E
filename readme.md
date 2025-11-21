E.md
+40
-1

# Agent-E
# Agentica Eli – Noćna misija

Statička stranica koja spaja WebGL nebo, vremenski pristup i male interaktivne epizode za Eli. Sve radi bez build koraka – samo otvori `index.html`.

## Pokretanje lokalno
1. Kloniraj repozitorij ili preuzmi datoteke.
2. Otvori `index.html` u pregledniku (dvostruki klik ili `file://` put).

## Deploy na GitHub Pages
1. Pushaj ovaj repozitorij na GitHub.
2. Upostavkama repozitorija odaberi **Pages** -> **Deploy from a branch**.
3. Odaberi `main` granu i root folder (`/`), spremi.
4. Nakon nekoliko minuta stranica će biti dostupna na `https://<tvoj-user>.github.io/<repo>/`.

## Deploy na Netlify
1. Kreiraj novi Netlify site iz Git repozitorija.
2. Kao build command postavi **None** (nema builda), a publish direktorij je root (`/`).
3. Deploy potvrdi; Netlify će poslužiti `index.html` direktno.

## Promjena noćnog ključa
U datoteci `js/app.js` promijeni vrijednost konstante `NIGHT_KEY` na željeni ključ i spremi.

## Dodavanje nove epizode
1. U `data/episodes.json` dodaj novi objekt u polje `episodes` s novim `id`-em.
2. Podržani `sceneType` u MVP-u su `hiddenObject` i `sequenceClick` (drugi se može nadograditi analogno).
3. `objects` koriste `%` koordinate (x, y) za klikanje.
4. Ako epizoda daje nagradu, stavi `rewardItemId` na `id` predmeta iz inventara.

## Dodavanje novog predmeta i sposobnosti
1. U `js/inventory.js` dodaj novi unos u `ITEMS` s `id`, `name`, `description` i `ability` poljima.
2. U mapi `ABILITIES` dodaj funkciju s istim `ability` imenom koja prima `context` i radi što želiš (npr. otključava zastavicu, dodaje klasu na scenu).
3. Kad želiš dodati predmet igračici, pozovi `addItem('<id>')` iz epizode ili druge logike.

## Struktura
- `index.html` – ulazna točka, učitava module.
- `css/style.css` – stilovi, animacije i raspored.
- `js/` – svi ES moduli: vremenska logika (`timeGate.js`), WebGL (`webglScene.js`), crvotočina (`wormhole.js`), epizode (`engine.js`), inventar (`inventory.js`), UI helperi (`ui.js`), bootstrap (`app.js`).
- `shaders/` – GLSL shaderi za nebulu.
- `assets/` – sloj za eventualna dodatna sredstva; trenutačne slike planeta su uvezene kao data URI nizovi unutar `js/planetAssets.js` kako bi repo ostao bez binarnih datoteka.
- `data/episodes.json` – sadržaj epizoda vođen JSON-om.
css/style.css
New
