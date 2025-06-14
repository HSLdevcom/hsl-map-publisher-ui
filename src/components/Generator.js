import React from 'react';
import { inject, observer, PropTypes } from 'mobx-react';
import styled from 'styled-components';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Switch } from '@material-ui/core';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import RadioGroup from './RadioGroup';
import Checkbox from './Checkbox';
import StopList from './StopList';
import BuildSelect from './BuildSelect';
import SelectTemplate from './SelectTemplate';
import SelectRuleTemplates from './SelectRuleTemplates';
import { componentsWithMapOptions } from '../stores/generatorStore';
import TerminalSelect from './TerminalSelect';
import { ObservedLineSelect, ObservedSingleLineSelect } from './LineSelect';

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
    // For TerminalPoster one terminal means one poster, otherwise use the amount of stops
    .map(({ stopIds }) => (generatorStore.component === 'TerminalPoster' ? 1 : stopIds.length))
    .reduce((prev, cur) => prev + cur, 0);

  const getAmount = () => {
    let text = '';
    switch (generatorStore.component) {
      case 'StopPoster':
        text = stopCount;
        break;

      case 'Timetable':
        text = stopCount;
        break;

      case 'TerminalPoster':
        text = 1;
        break;

      case 'LineTimetable':
        text = generatorStore.selectedLines.length;
        break;

      case 'StopRoutePlate':
        if (generatorStore.useLineQuery && generatorStore.selectedRoutePlateLine) {
          text = 1;
        } else {
          text = stopCount;
        }
        break;

      default:
        text = 0;
        break;
    }
    return text;
  };

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
            {generatorStore.component === 'TerminalPoster' && (
              <div>
                <Checkbox
                  label="70x100 Juliste"
                  defaultValueTrue={generatorStore.isSmallTerminalPoster}
                  onChange={() => generatorStore.setIsSmallTerminalPoster()}
                />
              </div>
            )}
            {generatorStore.component === 'StopRoutePlate' && (
              <div style={{ marginLeft: '20px' }}>
                <span style={{ opacity: generatorStore.useLineQuery ? 0.4 : 1.0 }}>
                  Pysäkkihaku
                </span>
                <Switch
                  checked={generatorStore.useLineQuery}
                  onChange={() => generatorStore.toggleUseLineQuery()}
                  color="primary"
                  inputProps={{ 'aria-label': 'Linjahaku' }}
                  className="muiSwitch-toggle"
                  style={{ color: '#0077c7' }}
                />
                <span style={{ opacity: generatorStore.useLineQuery ? 1.0 : 0.4 }}>Linjahaku</span>
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
            disabled={
              generatorStore.component === 'TerminalPoster' ||
              generatorStore.component === 'LineTimetable'
            }
          />
        </Column>

        <Column>
          <h3>Aikataulukausi</h3>
          <RadioGroup
            valuesByLabel={{ Talvi: false, Kesä: true }}
            valueSelected={generatorStore.isSummerTimetable}
            onChange={value => generatorStore.setIsSummerTimetable(value)}
            disabled={generatorStore.component === 'LineTimetable'}
          />
        </Column>

        <Column>
          <h3>Päivämäärä</h3>
          <DatePicker
            name="Päivämäärä"
            value={generatorStore.date}
            onChange={(_, value) => generatorStore.setDate(value)}
            container="inline"
          />
        </Column>

        <Column>
          <h3>
            {generatorStore.component === 'StopRoutePlate'
              ? 'Vertailuvälin alku'
              : 'Voimassaolokausi alkaa'}
          </h3>
          <DatePicker
            name={
              generatorStore.component === 'StopRoutePlate'
                ? 'Vertailuvälin alku'
                : 'Voimassaolokausi alkaa'
            }
            value={generatorStore.dateBegin}
            onChange={(event, value) => generatorStore.setDateBegin(value)}
            hintText="oletus"
            container="inline"
          />
        </Column>

        <Column>
          <h3>
            {generatorStore.component === 'StopRoutePlate'
              ? 'Vertailuvälin loppu'
              : 'Voimassaolokausi loppuu'}
          </h3>
          <DatePicker
            name={
              generatorStore.component === 'StopRoutePlate'
                ? 'Vertailuvälin loppu'
                : 'Voimassaolokausi loppuu'
            }
            value={generatorStore.dateEnd}
            onChange={(event, value) => generatorStore.setDateEnd(value)}
            hintText="oletus"
            container="inline"
          />
        </Column>
      </Row>

      {generatorStore.component === 'TerminalPoster' && (
        <Main>
          <TerminalSelect
            selectedTerminal={generatorStore.terminalId}
            terminals={commonStore.terminals}
            onChange={generatorStore.setTerminalId}
          />
        </Main>
      )}

      {generatorStore.component === 'LineTimetable' && (
        <Main>
          <ObservedLineSelect
            setLineQuery={commonStore.setLineQuery}
            lines={commonStore.lines}
            lineQuery={commonStore.lineQuery}
            addLine={generatorStore.addLine}
            removeLine={generatorStore.removeLine}
            selectedLines={generatorStore.selectedLines}
          />
        </Main>
      )}

      {generatorStore.component === 'StopRoutePlate' && generatorStore.useLineQuery && (
        <Main>
          <ObservedSingleLineSelect
            setLineQuery={commonStore.setLineQuery}
            lines={commonStore.lines}
            lineQuery={commonStore.lineQuery}
            selectedRoutePlateLine={generatorStore.selectedRoutePlateLine}
            setSelectedRoutePlateLine={generatorStore.setSelectedRoutePlateLine}
            clearSelectedRoutePlateLine={generatorStore.clearSelectedRoutePlateLine}
          />
        </Main>
      )}

      {generatorStore.component !== 'LineTimetable' && !generatorStore.useLineQuery && (
        <div>
          <Main>
            <StopList
              onCheck={generatorStore.setChecked}
              onReset={generatorStore.resetChecked}
              disabled={generatorStore.component === 'LineTimetable'}
            />
          </Main>
          {generatorStore.component !== 'StopRoutePlate' && (
            <Main>
              <SelectTemplate
                currentTemplate={commonStore.currentTemplate}
                templates={commonStore.templates}
                onSelectTemplate={commonStore.selectTemplate}
                showControls={false}
              />
            </Main>
          )}
        </div>
      )}

      {generatorStore.component !== 'TerminalPoster' &&
        generatorStore.component !== 'LineTimetable' &&
        generatorStore.component !== 'StopRoutePlate' && (
          <Main>
            <SelectRuleTemplates
              selectedRuleTemplates={generatorStore.selectedRuleTemplates}
              templates={commonStore.ruleTemplates}
              setSelectedRuleTemplates={generatorStore.setSelectedRuleTemplates}
            />
          </Main>
        )}

      {componentsWithMapOptions.includes(generatorStore.component) && (
        <Row>
          <Column>
            <h3>Lähikartta</h3>
            <div>
              <Checkbox
                label="Vyöhykealueet"
                defaultValueTrue={generatorStore.mapZones}
                onChange={() => generatorStore.setMapZones()}
              />
              <Checkbox
                label="Vyöhykesymbolit"
                defaultValueTrue={generatorStore.mapZoneSymbols}
                onChange={() => generatorStore.setMapZoneSymbols()}
              />
              <Checkbox
                label="Lähin myyntipiste"
                defaultValueTrue={generatorStore.salesPoint}
                onChange={() => generatorStore.setSalesPoint()}
              />
              <Checkbox
                label="Legenda"
                defaultValueTrue={generatorStore.legend}
                onChange={() => generatorStore.setLegend()}
              />
            </div>
          </Column>

          <Column>
            <h3>Minikartta</h3>
            <div>
              <Checkbox
                label="Vyöhykealueet"
                defaultValueTrue={generatorStore.minimapZones}
                onChange={() => generatorStore.setMinimapZones()}
              />
              <Checkbox
                label="Vyöhykesymbolit"
                defaultValueTrue={generatorStore.minimapZoneSymbols}
                onChange={() => generatorStore.setMinimapZoneSymbols()}
              />
            </div>
          </Column>
        </Row>
      )}

      {generatorStore.component !== 'LineTimetable' && !generatorStore.useLineQuery && (
        <div>
          <h3>Poissuodatettavat linjat</h3>
          <Row>
            <TextField
              disabled={generatorStore.component === 'LineTimetable'}
              data-cy="routeFilterInput"
              onChange={(_, value) => commonStore.setRouteFilter(value)}
              value={commonStore.routeFilter}
              hintText="Esim. 1,7,9N"
              fullWidth
            />
          </Row>
        </div>
      )}

      <Heading>Generointi</Heading>
      <Footer>
        <BuildSelect
          builds={commonStore.builds.toJS()}
          buildIdSelected={generatorStore.buildId}
          onChange={generatorStore.setBuildId}
        />
        <FlatButton
          data-cy="create-build"
          onClick={() => commonStore.addBuild()}
          label="Uusi lista..."
          style={{ height: 40, marginLeft: 10 }}
        />
        <RaisedButton
          data-cy="generate-button"
          disabled={
            (stopCount < 1 &&
              generatorStore.component !== 'LineTimetable' &&
              !generatorStore.useLineQuery) ||
            (generatorStore.useLineQuery && generatorStore.selectedRoutePlateLine === null) ||
            !generatorStore.buildId ||
            (generatorStore.component === 'TerminalPoster' && generatorStore.terminalId === '') ||
            (generatorStore.component === 'LineTimetable' && generatorStore.lineId === '') ||
            (generatorStore.component === 'LineTimetable' && !generatorStore.dateBegin) ||
            (generatorStore.component === 'LineTimetable' && !generatorStore.dateEnd) ||
            (generatorStore.component === 'StopRoutePlate' && !generatorStore.dateBegin) ||
            (generatorStore.component === 'StopRoutePlate' && !generatorStore.dateEnd)
          }
          onClick={async () => {
            if ((await commonStore.currentTemplate) === undefined) {
              commonStore.showConfirm(
                'Sommittelua ei ole valittu, generointia ei voida aloittaa !',
                false,
              );
            } else if (commonStore.templateIsDirty) {
              commonStore.showConfirm(
                'Sommittelussa on tallentamattomia muutoksia. Julisteet generoidaan tallennetulla versiolla. Haluatko jatkaa?',
                generatorStore.generate,
              );
            } else {
              generatorStore.generate();
            }
          }}
          label={`Generoi (${getAmount()})`}
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
