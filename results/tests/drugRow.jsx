/* Ambiguous identifier in JSX: Boolean */

/* Ambiguous identifier in JSX: Boolean */

/* Ambiguous identifier in JSX: Boolean */

/* Ambiguous identifier in JSX: Boolean */

/* Ambiguous identifier in JSX: Boolean */

/* Ambiguous identifier in JSX: Boolean */

/* Ambiguous identifier in JSX: Boolean */

/* Ambiguous identifier in JSX: Boolean */

/* Ambiguous identifier in JSX: Boolean */

/* Ambiguous identifier in JSX: i */

/* Ambiguous identifier in JSX: i */

/* Ambiguous identifier in JSX: item */

/* Ambiguous identifier in JSX: map */

/* Ambiguous identifier in JSX: Boolean */

/* originally imports ./../alternativesModal/alternativesModal */

/* originally imports ./../../../helpers/userInfo */

/* originally imports ./../../../helpers/platform */

/* originally imports ./../modals/modalLimit/modalLimit */

/* originally imports ./../../designSystem/js/system */

/* originally imports ../drugLabelElement/drugLabelElement */

/* originally imports ./drugRow.html */
// Polyfill de array.flat pour Edge qui se fiche des standards modernes.
import 'array-flat-polyfill';
import { Router } from 'meteor/iron:router';
import React, { Component } from 'react';

class DrugRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fakeState: false
    };
    this.hasAlternatives = this.hasAlternatives.bind(this);
    this.buyable = this.buyable.bind(this);
    this.uuid = this.uuid.bind(this);
    this.isMobile = this.isMobile.bind(this);
    this.isPatient = this.isPatient.bind(this);
    this.isUs = this.isUs.bind(this);
    this.isShowRcpButton = this.isShowRcpButton.bind(this);
    this.fun_1 = this.fun_1.bind(this);
    this.goRCP = this.goRCP.bind(this);
  }

  componentDidMount() {
    this.setState({
      fakeState: true
    });
  }

  componentWillUnmount() {
    if (this.state.fakeState == false) return;
  }

  hasAlternatives() {
    return this.props.alternativesForDrug && this.props.alternativesForDrug.length > 0;
  }

  buyable() {
    return this.props.entity.commercialization_status !== 'Non commercialisée';
  }

  uuid() {
    return this.props.entity.uuid;
  }

  isMobile() {
    return isMobile();
  }

  isPatient() {
    return isPatient();
  }

  isUs() {
    return i18n.getLocale() === 'en-US';
  }

  isShowRcpButton(entity) {
    return entity.isBrandedDrug() && !isVisitor();
  }

  /*event: onClick .remove*/
  fun_1(event) {
    this.props.onRemove(this.props.entity);
  }

  goRCP(event) {
    const {
      entity
    } = this.props; // stop if clicked row is not a branded drug

    if (!entity.isBrandedDrug()) return;

    if (isPatient()) {
      DesignSystem.Popuper.render(entity.label, Template.entitySheetPatient, {
        drug: entity
      });
      DesignSystem.Popuper.show();
    } else if (entity.ndc) {
      Router.go(`/drug/${entity.ndc}`);
    } else {
      Router.go(`/drug/${entity.cis}`);
    }
  }

  render() {
    return <React.Fragment>{
        /* Template parameters :
            @param { Object } entity
            @param { function } onRemove
            @param { Array } alternativesForDrug
            @param { Boolean } isLoadingAlternatives
            @param { Array } icons liste des icons à afficher devant le nom de l'entité (html)
         */
      }
      <div name="drugRow">
  <div className="component-drugRow rounded">
    <div className="container-fluid h-100">
      <div className="row align-items-center p-0 h-100">

        <div className={"col p-2 " + (Boolean(this.isShowRcpButton(this.isMobile(this.props.entity))) && " name")}>
                {this.props.icon.map((item, i) => <React.Fragment key={i}>            {this.props.icon}
                </React.Fragment>)}{Boolean(this.hasAlternatives()) && <React.Fragment>            <button className="btn alternativesWarning px-3 m-2" data-uuid={this.props.entity.uuid}>
                <i className="fa fa-exchange"></i>
            </button>
                </React.Fragment>}          {Boolean(this.props.isLoadingAlternatives) && <i className="fa fa-spinner fa-spin m-0 p-2"></i>}
          <span className="align-middle d-inline-block">
                  <drugLabelElement therapeuticEntity={this.props.entity} truncate={false} showBadge={false} />          </span>
        </div>

        <div className="col-auto p-2 h-100 text-right">
                {Boolean(this.isShowRcpButton(this.props.entity)) ? <React.Fragment>          <span className={"mr-3 " + (!Boolean(this.isMobile()) && " shrink ") + " menu-item rcp"} data-uuid={this.props.entity.uuid}>
            <i className="fa fa-book" style={{
                      "cursor": "pointer"
                    }}></i>
            {Boolean(this.isPatient()) ? __("dr-card-text") : __("dr-rcp")}
          </span>
                </React.Fragment> : <React.Fragment>          <span className="mr-3 menu-item invisible">
            <i className="fa fa-book" data-uuid={this.props.entity.uuid}></i>
            {Boolean(this.isPatient()) ? __("dr-card-text") : <React.Fragment>{__("dr-rcp")} </React.Fragment>}
          </span>
                </React.Fragment>}          <span className={"pl-3 mr-2 remove " + (!Boolean(this.isMobile()) && " shrink ") + " menu-item"} data-uuid={this.props.entity.uuid} onClick={this.fun_1}>
            <i className="fa fa-trash" style={{
                    "cursor": "pointer"
                  }}></i>
          <span>{Boolean(this.isUs()) && "\xA0"}{__("dr-remove-cut-text")}{Boolean(this.isUs()) && "\xA0"}</span>
          </span>
        </div>
      </div>
    </div>

  </div>
      </div></React.Fragment>;
  }

}

export default DrugRow;