import React from 'react';
import { inject, observer, PropTypes } from 'mobx-react';
import styled from 'styled-components';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import RadioGroup from './RadioGroup';
import Checkbox from './Checkbox';
import StopList from './StopList';
import BuildSelect from './BuildSelect';
import SelectTemplate from './SelectTemplate';

const Root = styled.div`
  display: flex;
  flex-flow: column;
  padding: 10px 30px;
  margin: auto;
  box-sizing: border-box;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 0;
`;

const Column = styled.div`
  flex: 32%;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Heading = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Generator = props => {
  const { commonStore, generatorStore } = props;
  const stopCount = generatorStore.rows
    .filter(({ rowId }) => generatorStore.checkedRows.includes(rowId))
    .map(({ stopIds }) => stopIds.length)
    .reduce((prev, cur) => prev + cur, 0);

  return (
    <Root>
      <Row>
        <Column>
          <h3>Tuloste</h3>
          <RadioGroup
            valuesByLabel={generatorStore.componentsByLabel}
            valueSelected={generatorStore.component}
            onChange={value => generatorStore.setComponent(value)}
          />
          <div>
            {generatorStore.component === 'Timetable' && (
              <div>
                <Checkbox
                  label="A4 Formaatti"
                  defaultValueTrue={generatorStore.timetableAsA4Format}
                  onChange={value => generatorStore.setTimetableA4Format(value)}
                />
                <Checkbox
                  label="Mustavalkoisena"
                  defaultValueTrue={generatorStore.timetableAsGreyscale}
                  onChange={value => generatorStore.setTimetableGreyscale(value)}
                />
              </div>
            )}
          </div>
        </Column>

        <Column>
          <h3>Näytä</h3>
          <RadioGroup
            valuesByLabel={generatorStore.rowTypesByLabel}
            valueSelected={generatorStore.rowType}
            onChange={value => generatorStore.setRowType(value)}
          />
        </Column>

        <Column>
          <h3>Aikataulukausi</h3>
          <RadioGroup
            valuesByLabel={{ Talvi: false, Kesä: true }}
            valueSelected={generatorStore.isSummerTimetable}
            onChange={value => generatorStore.setIsSummerTimetable(value)}
          />
        </Column>

        <Column>
          <h3>Päivämäärä</h3>
          <DatePicker
            name="Päivämäärä"
            value={generatorStore.date}
            onChange={(event, value) => generatorStore.setDate(value)}
            container="inline"
          />
        </Column>

        <Column>
          <h3>Voimassaolokausi alkaa</h3>
          <DatePicker
            name="Voimassaolokausi alkaa"
            value={generatorStore.dateBegin}
            onChange={(event, value) => generatorStore.setDateBegin(value)}
            hintText="oletus"
            container="inline"
          />
        </Column>

        <Column>
          <h3>Voimassaolokausi loppuu</h3>
          <DatePicker
            name="Voimassaolokausi loppuu"
            value={generatorStore.dateEnd}
            onChange={(event, value) => generatorStore.setDateEnd(value)}
            hintText="oletus"
            container="inline"
          />
        </Column>
      </Row>

      <Main>
        <StopList onCheck={generatorStore.setChecked} onReset={generatorStore.resetChecked} />
      </Main>

      <Main>
        <SelectTemplate
          currentTemplate={commonStore.currentTemplate}
          templates={commonStore.templates}
          onSelectTemplate={commonStore.selectTemplate}
          showControls={false}
        />
      </Main>

      <Heading>Generointi</Heading>
      <Footer>
        <BuildSelect
          builds={commonStore.builds.toJS()}
          buildIdSelected={generatorStore.buildId}
          onChange={generatorStore.setBuildId}
        />
        <FlatButton
          onClick={() => commonStore.addBuild()}
          label="Uusi lista..."
          style={{ height: 40, marginLeft: 10 }}
        />
        <RaisedButton
          disabled={stopCount < 1 || !generatorStore.buildId}
          onClick={() => {
            if (commonStore.templateIsDirty) {
              commonStore.showConfirm(
                'Sommittelussa on tallentamattomia muutoksia. Julisteet generoidaan tallennetulla versiolla. Haluatko jatkaa?',
                generatorStore.generate,
              );
            } else {
              generatorStore.generate();
            }
          }}
          label={`Generoi (${stopCount})`}
          style={{ height: 40, marginLeft: 10 }}
          primary
        />
      </Footer>
    </Root>
  );
};

Generator.propTypes = {
  commonStore: PropTypes.observableObject.isRequired,
  generatorStore: PropTypes.observableObject.isRequired,
};

export default inject('commonStore', 'generatorStore')(observer(Generator));
