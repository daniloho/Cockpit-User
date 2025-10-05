sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel"], (Controller, JSONModel) => {
  "use strict";
  return Controller.extend("cockpitusers.controller.BaseController", {
    getRouter(){ return this.getOwnerComponent().getRouter(); },
    getModel(name){ return this.getView().getModel(name) || this.getOwnerComponent().getModel(name); },
    setModel(dataOrModel, name="view"){
      const m = dataOrModel instanceof JSONModel ? dataOrModel : new JSONModel(dataOrModel);
      this.getView().setModel(m, name);
      return m;
    },
    setBusy(b){ this.getView().setBusy(!!b); }
  });
});
