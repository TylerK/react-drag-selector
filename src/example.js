import React from 'react';
import { render } from 'react-dom';
import DragSelector from './lib/drag-selector';
import SelectionTarget from './lib/selection-target';

class App extends React.Component {
  render() {
    return (
      <DragSelector>
        <SelectionTarget>
          <p>Select me</p>
        </SelectionTarget>
        <SelectionTarget>
          <p>Select me</p>
        </SelectionTarget>
        <SelectionTarget>
          <p>Select me</p>
        </SelectionTarget>
      </DragSelector>
    );
  }
}

render(React.createElement(App), document.getElementById('app'));
