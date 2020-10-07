import React, { Component } from 'react';
import { inject, observer, PropTypes } from 'mobx-react';
import styled from 'styled-components';
import FlatButton from 'material-ui/FlatButton';

import Build from './Build';

const Root = styled.div`
  display: flex;
  flex-flow: column;
  flex-basis: 10px;
  max-width: 100%;
  height: 95%;
  padding: 10px 30px;
  margin: auto;
  box-sizing: border-box;
  overflow-y: auto;
`;

const ToggleBuildsContainer = styled.div`
  width: calc(100vw - 120px);
  max-width: 880px;
  margin-top: 10px;
  white-space: nowrap;
`;

const Row = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

class BuildList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxBuilds: 50,
      buildsToggled: false,
    };
  }

  toggleBuilds = () => {
    const buildsToggled = !this.state.buildsToggled;
    this.setState({ buildsToggled });
  };

  toggleBuildsLabel = buildsAmount => {
    const amount = buildsAmount - this.state.maxBuilds;
    return this.state.buildsToggled ? `Piilota (${amount})` : `Näytä lisää (${amount})`;
  };

  render() {
    const storeBuilds = this.props.commonStore.builds.filter(build => build !== undefined);
    let builds = storeBuilds;
    if (!this.state.buildsToggled) {
      builds = storeBuilds.slice(0, this.state.maxBuilds);
    }
    return (
      <Root>
        {builds.map(build => (
          <Build
            key={build.id}
            {...build}
            onStatusChange={value =>
              this.props.commonStore.updateBuild({ id: build.id, status: value })
            }
            onSelect={() => this.props.commonStore.showBuild(build.id)}
            onRemoveBuild={() => this.props.commonStore.removeBuild(build.id)}
            onRemovePoster={id => this.props.commonStore.removePoster(id)}
          />
        ))}
        <ToggleBuildsContainer>
          <Row>
            <FlatButton
              onClick={() => this.toggleBuilds()}
              label={this.toggleBuildsLabel(storeBuilds.length)}
              style={{ marginLeft: 10, color: 'rgb(0, 119, 199)' }}
            />
          </Row>
        </ToggleBuildsContainer>
      </Root>
    );
  }
}

BuildList.propTypes = {
  // eslint-disable-next-line react/no-typos
  commonStore: PropTypes.observableObject.isRequired,
};

export default inject('commonStore')(observer(BuildList));
