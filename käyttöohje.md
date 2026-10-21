# Full Stack -websovelluskehitys harjoitustyö

## Käyttöohje:

Sovellus toimii osoitteessa:
https://fs26-bpm.onrender.com/

Testitunnukset saa pyytämällä, jos ei ole

## Toiminnot:

- Soveluksessa voi olla useita käyttäjiä, jotka jakavat saman työtilan.
- Sovellukseen voi luoda prosesseja. Prosessi voi olla esim. todo-lista.
- Prosessi koostuu tietueista joilla voi olla useita eri tyyppisiä kenttiä.
- Prosessin tietueilla voi olla useita vaiheita esim. tekemättä, työn alla ja valmis.
- Haku prosesseilla ja tietueilla

## Prossessit

- Prosessin tiedot:

* nimi esim. Todo-lista
* vaiheet esim. suunniteltu, työn alla, valmiit
* kentät: nimi esim tehtävän kuvaus, tyyppi esim text ja vaiheet esim. suunniteltu, työn alla, valmiit

## Tietueet

- tietueella on otsikko (title)
- aktiivinen vaihe (phase)
- kenttät (prosessin määrityksissä annetut)

## Kentät

- Kentällä on nimi esim. budjetti
- Tyyppi esim. numeric unit €
- Vaiheet esim valmis

## Kenttien tyypit

- Text (tekstikenttä)
- Text Area (tekstialue)
- Predefined Options (käyttäjän määrittelemät vaihtoehdot)
- Numeric (numero)
- Numeric Unit (numero ja yksikko esim €)
- Date (päivämäärä)
- Date Range (väli jossa on alku ja loppupäivämäärä)
- Time (aika)
- Date & Time (päivämäärä ja aika)

## Kirjautuminen sisään ja ulos

- Sovellus pyytää kirjautumaan, jotta sitä voi käyttää
- Kirjaudu ulos nappi löytyy sivun oikeasta yläkulmasta

## Home

- aloitussivu, jonne päästään "Home"-linkillä

## Processes-näkymä

- Ylhäällä on hakukenttä, jonka avulla voi etsiä prosesseja
- Sivulle päästää Processes-linkin avulla (yläpalkki tai breadcrumbs)
- Jokaisesta prosessista on on oma kortti, jossa on sen nimi ja vaiheet.
- Klikkaamalla prosessia avautuu prosessin hallinta-näkymä

## Prosessin luominen

- Sivun yläpalkissa on "Create process"-napppi, joka avaa "Create a new process" lomakkeen.
- Lomakkeeseen annetaan:

* "Process name"-kenttään prosessin nimi (joka ainoa pakollinen kenttä tässä vaiheessa ja suosittelen että prosessin muokkausnäkymässä lisätään muut kentät ja vaiheet)
* "Add phases"-kenttään prosessin vaiheen nimi, joka lisätään "Add phase"-napilla. Voit lisätä useita vaiheita.
* "Field name"-kenttään prosessin tietueen kentän nimi.
* "Field type"-kenttään prosessin tietueen kentän tyyppi.
* "Field phases"-kenttään prosessin tietueen kentän aktiiviset vaiheet (ne vaiheet, jossa kenttä näkyy).
* Kenttä lisätään "Add field"-napilla. Voit lisätä useita kenttiä.
* Lopuksi prosessi tallennetaan painamalla "save"
* Kun porosessi on tallennettu, käyttäjä ohjataan prosessin hallinta-näkymään.

## Prosessin hallinta-näkymä

- "Kanban view"-nappi vie prosessin kanban-näkymään
- Settings alla on "Edit"-nappi, joka vie prosessin muokkaus-näkymään
- Settings alla on "Delete"-nappi, joka poistaa prosessin ja sen tietueet
- Phases otsikon alla on listattu järjestyksessä prosessin vaiheet
- Field definitions otsikon alla on prosessin kentät (nimi, tyyppi ja aktiiviset vaiheet)

## Kanban view

- Ylhäällä on hakukenttä, jonka avulla voi etsiä tietueita
- Sivun yläpalkissa on nyt "Add record"-nappi.
- "Add record"-nappi avaa tietueen lisäyslomakkeen sivun oikeaan laitaan. Täytä tietueen kentät ja tallenna se "add record"-napilla tai peru lisäys painamalla "cancel"
- Kanban-näkymä koostuu vaiheista tai uimaradoista, joissa tallennetut tietueet ovat

* Jokaisella prosessin vaiheella on oma uimarata. Otsikko sisältää vaiheen nimen ja tietueiden lukumäärän
* Tietueen yläkulmassa on kahva jonka avulla sen saa raahattua toiseen uimarataan (vaiheeseen)
* Jos tietuetta klikkaa sen tiedot avautuvat sivun oikeaan laittaan, jossa sitä klikkaamalla saa muokattua sen kenttiä ja aktiivista vaihetta. Muutokset tallennetaan painamalla "save"-nappia ja "cancel"-nappi peruu muutokset. Tietueen voi poistaa "delete"-napilla. Muokkausnäkymä suljetaan napista "Close" tai klikkaamalla sen ulkopuolelle.

# Prosessin muokkaus

- Päästään valitun prosessin hallinta-sivun kautta valitsemalla "Edit"
- "Process name"-kenttä on prosessin nimi
- "Add phases"-kenttään annetaan vaiheen nimi, joka lisätään "Add phase"-napilla
- Process phases listassa on prosessin vaiheet. Järjestyksen voi muuuttaa vetämällä "kahvasta". Nimen voi muuttaa klikkaamalla. Muutoksen tallennetaan "Save changes"-napilla tai perutaan "Cancel"-napilla
- Process field definitions alla on listattu prosessin kentät (nimi, tyyppi ja aktiiviset vaiheet)
- Klikkaamalla kenttää sitä voi muokata (nimi ja vaiheet ja liäksi yksikkö (numerin unit tyyppi) ja valinnat (predefined tyyppi))
- Vaiheita lisätään "Field phases" valikosta ja poistetaan vaiheen nimen vieressä olevasta rististä
- Muutokset tallennetaan valitsemalla "save changes" tai perutaan valitsemalla "cancel"
- Lopuksi prosessi tallennetaan ja suljetaan valitsemalla "Save and close process"
