import { Router } from 'meteor/iron:router';

// Polyfill de array.flat pour Edge qui se fiche des standards modernes.
import 'array-flat-polyfill';

import './drugRow.html';

import '../drugLabelElement/drugLabelElement';

import DesignSystem from './../../designSystem/js/system';

import './../modals/modalLimit/modalLimit';

import { isMobile } from './../../../helpers/platform';
import { isPatient, isVisitor } from './../../../helpers/userInfo';

import './../alternativesModal/alternativesModal';


function goRCP(event, templateInstance) {
  const { entity } = templateInstance.data;

  // stop if clicked row is not a branded drug
  if (!entity.isBrandedDrug()) return;

  if (isPatient()) {
    DesignSystem.Popuper.render(entity.label, Template.entitySheetPatient, { drug: entity });
    DesignSystem.Popuper.show();
  } else if (entity.ndc) {
    Router.go(`/drug/${entity.ndc}`);
  } else {
    Router.go(`/drug/${entity.cis}`);
  }
}

Template.drugRow.onCreated(function() {
  this.fakeState = new ReactiveVar(false);
});

Template.drugRow.onRendered(function() {
  this.fakeState.set(true);
});

Template.drugRow.onDestroyed(function() {
  if(this.fakeState.get() == false) return;
});

Template.drugRow.helpers({
  hasAlternatives: () => Template.instance().data.alternativesForDrug && Template.instance().data.alternativesForDrug.length > 0,

  buyable: () => Template.instance().data.entity.commercialization_status !== 'Non commercialisée',

  uuid: () => Template.instance().data.entity.uuid,

  isMobile: () => isMobile(),

  isPatient: () => isPatient(),

  isUs: () => i18n.getLocale() === 'en-US',

  isShowRcpButton: entity => entity.isBrandedDrug() && !isVisitor(),
});

Template.drugRow.events({
  'click .rcp': goRCP,

  'click .component-drugLabel': goRCP,

  'click .remove': (event, templateInstance) => {
    templateInstance.data.onRemove(templateInstance.data.entity);
  },
});
