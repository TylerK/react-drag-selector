import React from 'react';

export default class SelectionTarget extends React.Component {
  static propTypes() {
    return {
      children: React.PropTypes.node.isRequired,
      isSelected: React.PropTypes.bool
    };
  }

  render() {
    const isSelected = this.props.isSelected ? 'is-selected' : '';
    return (
      <div className={`selection-target ${isSelected}`}>
        {this.props.children}
      </div>
    );
  }
}
