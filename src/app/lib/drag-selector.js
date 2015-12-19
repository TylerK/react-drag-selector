/* no-did-mount-set-state: 0 */

import React from 'react';
import ReactDOM from 'react-dom';

export default class DragSelectionWrapper extends React.Component {

  /*
   * Statics
   */
  static propTypes() {
    return {
      children: React.PropTypes.element.isRequired
    };
  }

  /*
   * Constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      selected: []
    };
  }

  /*
   * Lifecycle
   */
  componentDidMount() {
    this.bounds = this.refs.wrapper.getBoundingClientRect();
    document.addEventListener('mousemove', this._handleMouseBoundry.bind(this));
  }

  /*
   * Lifecycle
   */
  componentWillUnMount() {
    document.removeEventListener('mousemove', this._handleMouseBoundry.bind(this));
  }

  /*
   * Utility: Return y mouse position relative to the wrapper
   * @param {object} e - Synthetic Event
   * @return {number}
   */
  _yPos(e) {
    return e.clientY - this.bounds.top;
  }

  /*
   * Utility: Return x mouse position relative to the wrapper
   * @param {object} Synthetic Event
   * @return {number}
   */
  _xPos(e) {
    return e.clientX - this.bounds.left;
  }

  /*
   * Utility: Return the offset bounding box of a dom element
   * @param {child} Integer
   * @return {object}
   */
  _getChildRects(child) {
    let elem = ReactDOM.findDOMNode(this.refs.wrapper.children[child]);

    return {
      top: elem.offsetTop,
      bottom: elem.offsetTop + elem.offsetHeight,
      left: elem.offsetLeft,
      right: elem.offsetLeft + elem.offsetWidth
    };
  }

  /*
   * Checks if the mouse is inside the bounds of any child elements.
   * @param {object} e - Synthetic Event
   * @return {boolean}
   */
  _checkInitialCollisions(e) {
    return this.props.children
    .map((child, i) => {
      let mouseY = this._yPos(e);
      let mouseX = this._xPos(e);
      let rect = this._getChildRects(i);
      let isInChildBounds = (
        mouseY <= rect.bottom &&
        mouseY >= rect.top &&
        mouseX >= rect.left &&
        mouseX <= rect.right
      );

      return isInChildBounds;
    })
    .some(isCollided => isCollided);
  }

  /*
   * Utility: Checks if any children are inside the selection bounds
   * @param {object} e - Synthetic Event
   * @return {array}
   */
  _checkAllCollisions(e) {
    return this.props.children
    .map((child, i) => {
      let sb = this.refs.selection.getBBox();
      let rect = this._getChildRects(i);

      let isInBounds = (
        sb.y + sb.height >= rect.top &&
        sb.y <= rect.bottom &&
        sb.x + sb.width >= rect.left &&
        sb.x <= rect.right
      );

      if (isInBounds) {
        return child
      }
    });
  }

  /*
   * Handles state when the mouse exceeds the bounds of this container
   * @param {object} e - Synthetic Event
   */
  _handleMouseBoundry(e) {
    if (!this.state.isDragging) return;
    let w = this.bounds;
    let cy = e.clientY;
    let cx = e.clientX;
    let isInBounds = (
      cy >= w.top &&
      cy <= w.bottom &&
      cx >= w.left &&
      cx <= w.right
    );

    if (!isInBounds) {
      this.setState({
        isDragging: false
      });
    }
  }

  /*
   * Mouse down event handler logic.
   * @param {object} e - Synthetic Event
   */
  _handleMouseDown(e) {
    e.preventDefault();
    let wrapper = this.bounds;
    let isCollided = this._checkInitialCollisions(e);

    if (isCollided) return;

    this.setState({
      isDragging: true,
      selected: [],
      startY: e.clientY - wrapper.top,
      startX: e.clientX - wrapper.left,
      indicator: {
        sy: e.clientY - wrapper.top,
        sx: e.clientX - wrapper.left,
        ey: e.clientY - wrapper.top,
        ex: e.clientX - wrapper.left
      }
    });
  }

  /*
   * Mouse movement event handler logic.
   * @param {object} e - Synthetic Event
   */
  _handleMouseMove(e) {
    e.preventDefault();
    if (!this.state.isDragging) return;

    let wrapper = this.bounds;
    let startY  = this.state.startY;
    let startX  = this.state.startX;
    let offsetY = this._yPos(e);
    let offsetX = this._xPos(e);

    this.setState({
      isDragging: true,
      indicator: { sy: startY, sx: startX, ey: offsetY, ex: offsetX },
      selected: this._checkAllCollisions(e)
    });
  }

  /*
   * Mouse up event handler logic.
   * @param {object} e - Synthetic Event
   */
  _handleMouseUp(e) {
    e.preventDefault();

    this.setState({
      isDragging: false,
      startY: 0,
      startX: 0,
      indicator: { sy: 0, sx: 0, ey: 0, ex: 0 }
    });
  }

  /*
   * Render sub method used to draw the selection box
   */
  renderIndicator() {
    let wrapper = this.bounds;
    let st = this.state.indicator;
    let sY = st.sy;
    let sX = st.sx;
    let eY = st.ey;
    let eX = st.ex;

    return (
      <div className='drag-select-indicator'>
        <svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox={`0 0 ${wrapper.width} ${wrapper.height}`}>
          <polygon points={`${sX} ${sY}, ${eX} ${sY}, ${eX} ${eY}, ${sX} ${eY}`}
                   className='drag-select-indicator__overlay'
                   ref='selection' />
        </svg>
      </div>
    );
  }

  /*
   * Render
   */
  render() {
    return (
      <div onMouseDown={this._handleMouseDown.bind(this)}
           onMouseMove={this._handleMouseMove.bind(this)}
           onMouseUp={this._handleMouseUp.bind(this)}
           className='drag-select-wrapper'
           ref='wrapper'>
        {this.renderChildren()}
        {this.state.isDragging ? this.renderIndicator() : null}
      </div>
    );
  }

  /*
   * Render Children
   */
  renderChildren() {
    return React.Children.map(this.props.children, (child, i) => {
      return React.cloneElement(child, {
        isSelected: this.state.selected.some(elem => {
          return elem ? elem.ref === child.ref : false;
        })
      });
    });
  }
}
