import React from 'react';
import { render } from 'react-dom';
import DragSelector from './lib/drag-selector';
import SelectionTarget from './lib/selection-target';

class App extends React.Component {
  render() {
    return (
      <DragSelector>
        {[1, 2, 3, 4, 5].map((item, i) => {
          return (
            <SelectionTarget key={`SelectionTarget${i}`} ref={`SelectionTarget${i}`}>
              <p>Select Me!</p>
            </SelectionTarget>
          );
        })}
      </DragSelector>
    );
  }
}

render(React.createElement(App), document.getElementById('app'));
