/* Ambiguous identifier in JSX: text */

/* originally imports ./infoBulle.html */
import React, { Component } from 'react';

class InfoBulle extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  render() {
    return <React.Fragment><div name="infoBulle">
  <button className="component-infoBulle btn btn--minor p-0 align-middle" data-html="true" data-toggle="tooltip" title={text}>
    <i className="fa fa-info-circle align-middle" aria-hidden="true"></i>
  </button>
      </div>
    </React.Fragment>;
  }

}

export default InfoBulle;