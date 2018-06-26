import React from 'react';
import styled, { css } from 'styled-components';

const Instructions = styled.div`
  line-height: 1.5;
  padding-bottom: 2rem;
`;

const Paragraph = styled.p`
  font-size: 12px;
  padding: 0.25rem 0;
  margin: 0:
`;

const Value = styled.span`
  padding: 2px;
  background: #dedede;
  font-family: monospace;
`;

const list = css`
  padding: 0.25rem 0 0.25rem 1.25rem;
  margin: 0;
  font-size: 12px;

  ul {
    padding-left: 2rem;
  }
`;

const Ol = styled.ol`
  ${list};
`;

const Ul = styled.ul`
  ${list};
`;

export default () => {
  return (
    <Instructions>
      <Paragraph>
        Tipauta haluamasi SVG tiedosto haluamallesi paikalle. Voit myös pienentää tai suurentaa
        aluetta vetämällä kahvoista, mutta varmista että grafiikka sopii uuteen kokoon.
      </Paragraph>
      <Paragraph>
        Jotta sommittelusi näkyisi julisteessa, varmista että se on tallennettu painamalla sinistä
        "Tallenna"-nappia. Juliste joka on valittuna sillä hetkellä kun painat "Generoi"-nappia
        ilmestyy julisteeseen.
      </Paragraph>
      <Paragraph>
        Voit tehdä uusi sommittelu painamalla "Uusi sommittelu"-nappia. Poista valittu sommittelu
        painamalla "Poista sommittelu"-nappia.
      </Paragraph>
      <Paragraph>
        Jos grafiikkaan tulee dynaamisia tietoja kuten verkko-osoitteet tai QR koodit, toimi näin:
      </Paragraph>
      <Ol>
        <li>
          Dynaamisina alueina toimii <Value>rect</Value> tai <Value>line</Value> SVG elementit.
        </li>
        <li>
          Anna SVG-elementille class-attribuutti <Value>dynamic-area</Value>.
        </li>
        <li>
          Aseta data-attribuutti <Value>data-area-type</Value> SVG-elementille. Tämä attribuutti
          määrittää millainen dynaaminen alue on kyseessä. Se voi olla arvoltaan:
          <Ul>
            <li>
              <Value>qr-code</Value>, jos haluat näyttää QR koodin alueella,
            </li>
            <li>
              <Value>url-display</Value>, jos haluat näyttää verkko-osoitetta teksti-muodossa.
              Mahdollinen http etuliite poistetaan.
            </li>
          </Ul>
        </li>
        <li>
          Aseta data-attribuutti <Value>data-area-data</Value> SVG-elementille. Tämä attribuutti
          määrittää mikä verkko-osoite tulee näkyviin alueella. Pysäkin koodi liitetään
          osoitteeseen. Data-attribuutti voi olla arvoltaan:
          <Ul>
            <li>
              <Value>stopinfo</Value>, jolloin verkko-osoite vie pysäkin Reittiopas-sivulle.
              Esimerkki: <Value>http://hsl.fi/pysakit/H0332</Value>
            </li>
            <li>
              <Value>ticketsales</Value>, jolloin verkko-osoite vie pysäkin info-sivulle. Esimerkki:{' '}
              <Value>http://tag.hsl.fi/tag/16918?a</Value>
            </li>
            <li>
              <Value>feedback</Value>, jolloin verkko-osoite vie pysäkin palaute-lomakkeelle.
              Esimerkki: <Value>hsl.fi/fixit/H0332</Value>
            </li>
          </Ul>
        </li>
        <li>
          QR-koodi tai verkko-osoite asetetaan SVG-kuvan päälle. Jos alueena käytetään{' '}
          <Value>rect</Value>-elementtiä, alueen koko ja sijainti luetaan elementin <Value>x</Value>,{' '}
          <Value>y</Value>, <Value>width</Value> ja <Value>height</Value> attribuuteista. Jos
          alueena toimii <Value>line</Value>-elementti, alueen koko ja sijainti luetaan elementin{' '}
          <Value>x1</Value>, <Value>x2</Value>, <Value>y1</Value>, <Value>y2</Value> ja{' '}
          <Value>stroke-width</Value> attribuuteista. Varmista siis että alueen elementti on oikean
          tyyppinen ja että siitä löytyy tarvittavat attribuutit.
        </li>
        <li>
          Toista ylläolevat toimeet jokaiselle dynaamiselle alueelle. Pudota tämän jälkeen
          valmistetut SVG tiedostot sommitteluun.
        </li>
      </Ol>
    </Instructions>
  );
};
