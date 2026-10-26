# Diario Poppate

PWA in italiano per registrare e sincronizzare le poppate tra due smartphone.

## Prova locale immediata

Aprire `index.html`. Finché `config.js` non contiene le credenziali Supabase, l'app usa una modalità demo locale. In modalità `file://` l'installazione PWA non è disponibile.

Per provare correttamente PWA e service worker da PC, nella cartella del progetto eseguire un piccolo server locale, ad esempio:

```bash
python -m http.server 8080
```

Poi aprire `http://localhost:8080`.

## Attivazione archivio sincronizzato

1. Creare un progetto gratuito su Supabase.
2. Aprire SQL Editor ed eseguire il contenuto di `supabase.sql`.
3. In Project Settings > API copiare Project URL e chiave anon/publishable.
4. Inserire i due valori in `config.js`.
5. Pubblicare tutti i file nel repository GitHub Pages.

## Avvertenza sull'accesso tramite link

Le policy incluse consentono lettura e modifica a chiunque disponga dell'URL e delle credenziali pubbliche incorporate nell'app. È coerente con il requisito iniziale, ma non costituisce autenticazione. Non inserire dati sanitari delicati nelle note. Una fase successiva potrà introdurre Supabase Auth.

## CSV

Formato: `ID;Data;Ora;ML;Nota`, UTF-8 con BOM, compatibile con Excel italiano. L'importazione permette di aggiungere escludendo duplicati oppure sostituire l'archivio.

## Fuso orario

Data e ora sono salvate come ora civile di Roma senza conversione automatica. In questo modo una poppata mantiene l'ora originariamente inserita anche dopo cambi d'ora legale.
