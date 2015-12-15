import React from 'react';
import './selection-target.scss';

export default class DragSelector extends React.Component {
  render() {
    const isSelected = this.props.isSelected ? 'is-selected' : '';

    return (
      <div className={`selection-target ${isSelected}`}>
        {this.props.children}
      </div>
    );
  }
}
