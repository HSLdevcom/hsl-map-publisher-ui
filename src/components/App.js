import React, { Component } from 'react';
import styled from 'styled-components';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

import RadioGroup from './RadioGroup';
import StopList from './StopList';
import theme from './theme';

import { fetchStops, generate } from '../util/api';
import { stopsToRows, stopsToGroupRows } from '../util/stops';

const componentsByType = {
  Pysäkkijuliste: {
    name: 'StopPoster',
    filter: stop => stop.hasShelter,
  },
  Aikataulu: {
    name: 'Timetable',
    filter: stop => !stop.hasShelter,
  },
};

const rowFactoriesByType = {
  Pysäkit: {
    factory: stops => stopsToRows(stops),
  },
  Ajolistat: {
    factory: stops => stopsToGroupRows(stops),
  },
};

const Root = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  max-width: 1000px;
  height: 100vh;
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
  min-height: 300px;
`;

const Footer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin: 30px 0;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      rows: [],
      stops: [],
      componentsByType,
      selectedComponent: Object.values(componentsByType)[0],
      rowFactoriesByType,
      selectedRowFactory: Object.values(rowFactoriesByType)[0],
      selectedDate: new Date(),
      isSummerTimetable: false,
    };
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'test') return;

    fetchStops()
      .then(stops => {
        this.setState({ stops }, () => this.resetRows());
      })
      .catch(error => {
        this.setState({
          message: `Pysäkkien hakeminen epäonnistui: ${error.message}`,
        });
        console.error(error); // eslint-disable-line no-console
      });
  }

  onGenerate() {
    this.resetRows();

    const popup = window.open();
    const component = this.state.selectedComponent.name;

    const checkedRows = this.state.rows.filter(({ isChecked }) => isChecked);

    const props = checkedRows
      .reduce((prev, { stopIds }) => [...prev, ...stopIds], [])
      .map(stopId => ({
        stopId,
        date: moment(this.state.selectedDate).format('YYYY-MM-DD'),
        isSummerTimetable: this.state.isSummerTimetable,
        dateBegin: this.state.dateBegin
          ? moment(this.state.dateBegin).format('YYYY-MM-DD')
          : null,
        dateEnd: this.state.dateEnd
          ? moment(this.state.dateEnd).format('YYYY-MM-DD')
          : null,
      }));

    const filename =
      checkedRows.length === 1 ? `${checkedRows[0].title}.pdf` : 'output.pdf';

    generate(component, props, filename)
      .then(url => {
        if (popup) {
          popup.location = url;
        } else {
          const message = `Ponnahdusikkunan avaaminen epäonnistui. Tulosteet tehdään osoitteeseen ${
            window.location
          }${url}`;
          this.setState({ message });
        }
      })
      .catch(error => {
        if (popup) popup.close();
        this.setState({ message: `Generointi epäonnistui: ${error.message}` });
        console.error(error); // eslint-disable-line no-console
      });
  }

  onDialogClose() {
    this.setState({ message: null });
  }

  onDateChange(date) {
    this.setState({ selectedDate: date });
  }

  onRowFactoryChange(value) {
    this.setState({ selectedRowFactory: value }, () => this.resetRows());
  }

  onComponentChange(value) {
    this.setState({ selectedComponent: value }, () => this.resetRows());
  }

  onRowChecked(checkedRow, isChecked) {
    const rows = this.state.rows.map(
      row => (row === checkedRow ? { ...row, isChecked } : row),
    );
    this.setState({ rows });
  }

  resetRows() {
    const component = this.state.selectedComponent;
    const stops = this.state.stops.filter(component.filter);
    const rows = this.state.selectedRowFactory.factory(stops);
    this.setState({ rows });
  }

  render() {
    const stopCount = this.state.rows
      .filter(({ isChecked }) => isChecked)
      .map(({ stopIds }) => stopIds.length)
      .reduce((prev, cur) => prev + cur, 0);

    return (
      <MuiThemeProvider muiTheme={theme}>
        <Root>
          <Dialog
            open={!!this.state.message}
            onRequestClose={() => this.onDialogClose()}
            actions={[
              <FlatButton
                onTouchTap={() => this.onDialogClose()}
                label="OK"
                primary
              />,
            ]}
          >
            {this.state.message}
          </Dialog>

          <Row>
            <Column>
              <h3>Tuloste</h3>
              <RadioGroup
                valuesByLabel={this.state.componentsByType}
                valueSelected={this.state.selectedComponent}
                onChange={value => this.onComponentChange(value)}
              />
            </Column>

            <Column>
              <h3>Näytä</h3>
              <RadioGroup
                valuesByLabel={this.state.rowFactoriesByType}
                valueSelected={this.state.selectedRowFactory}
                onChange={value => this.onRowFactoryChange(value)}
              />
            </Column>

            <Column>
              <h3>Aikataulukausi</h3>
              <RadioGroup
                valuesByLabel={{ Talvi: false, Kesä: true }}
                valueSelected={this.state.isSummerTimetable}
                onChange={value => this.setState({ isSummerTimetable: value })}
              />
            </Column>

            <Column>
              <h3>Päivämäärä</h3>
              <DatePicker
                value={this.state.selectedDate}
                onChange={(event, date) => this.onDateChange(date)}
                container="inline"
              />
            </Column>

            <Column>
              <h3>Voimassaolokausi alkaa</h3>
              <DatePicker
                value={this.state.dateBegin}
                onChange={(event, date) => this.setState({ dateBegin: date })}
                hintText="oletus"
                container="inline"
              />
            </Column>

            <Column>
              <h3>Voimassaolokausi loppuu</h3>
              <DatePicker
                value={this.state.dateEnd}
                onChange={(event, date) => this.setState({ dateEnd: date })}
                hintText="oletus"
                container="inline"
              />
            </Column>
          </Row>

          <Main>
            <StopList
              rows={this.state.rows}
              onCheck={(index, isChecked) =>
                this.onRowChecked(index, isChecked)
              }
            />
          </Main>

          <Footer>
            <RaisedButton
              disabled={!stopCount}
              onTouchTap={() => this.onGenerate()}
              label={`Generoi (${stopCount})`}
              style={{ height: 45, flexGrow: 1 }}
              primary
            />
          </Footer>
        </Root>
      </MuiThemeProvider>
    );
  }
}

export default App;
