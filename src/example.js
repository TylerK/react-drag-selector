import React from 'react';
import { render } from 'react-dom';
import { DragSelector } from './app';
import { SelectionTarget } from './app';

class App extends React.Component {
  render() {
    return (
      <DragSelector>
        <SelectionTarget />
        <SelectionTarget />
        <SelectionTarget />
        <SelectionTarget />
        <SelectionTarget />
      </DragSelector>
    );
  }
}

render(React.createElement(App), document.getElementById('app'));
