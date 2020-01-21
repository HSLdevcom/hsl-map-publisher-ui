import React from 'react';
import { observer } from 'mobx-react';
import get from 'lodash/get';
import styled from 'styled-components';
import TemplateSelect from './TemplateSelect';
import { RaisedButton, FlatButton } from 'material-ui';
import { toJS } from 'mobx';

const TemplateControls = styled.div`
  display: flex;
  padding: 0 0 0.5rem 0;

  > * {
    flex: none;
  }
`;

const Select = styled(TemplateSelect)`
  width: 100%;
`;

const SectionHeading = styled.h4`
  margin-bottom: 0;
`;

export default observer(
  ({
    templates,
    currentTemplate,
    onSelectTemplate,
    templateIsDirty,
    onSaveTemplate,
    onAddTemplate,
    onRemoveTemplate,
    showControls = true,
  }) => (
    <div>
      <SectionHeading>Valitse sommittelu</SectionHeading>
      <TemplateControls data-cy={`select-template-${showControls ? 'with-controls' : ''}`}>
        <Select
          templates={templates}
          selectedTemplate={get(currentTemplate, 'id', null)}
          onChange={onSelectTemplate}
        />
      </TemplateControls>
      {showControls && (
        <TemplateControls>
          <RaisedButton
            primary
            disabled={!templateIsDirty}
            onClick={() => onSaveTemplate(toJS(currentTemplate))}
            label="Tallenna sommittelu"
            data-cy="save-template"
          />
          <FlatButton data-cy="new-template" onClick={onAddTemplate} label="Uusi sommittelu..." />
          <FlatButton
            backgroundColor="#ffcccc"
            onClick={() => onRemoveTemplate(get(currentTemplate, 'id'))}
            label="Poista sommittelu"
            data-cy="remove-template"
          />
        </TemplateControls>
      )}
    </div>
  ),
);
