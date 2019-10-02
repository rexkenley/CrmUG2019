import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { initializeIcons } from "@uifabric/icons";

import store, { setColumns, setAccountId, getItems } from "./crmUG.store";
import CrmUG from "../jsx/crmUG";

const { Xrm } = window.parent || window,
  context = Xrm && Xrm.Utility.getGlobalContext(),
  par = (context && context.getQueryStringParameters()) || null; // eslint-disable-line

store.dispatch(
  setColumns([
    {
      fieldName: "ticketnumber",
      key: "ticketnumber",
      name: "ID",
      isResizable: true,
      minWidth: 100,
      maxWidth: 200
    },
    {
      fieldName: "title",
      key: "title",
      name: "Case Title",
      isResizable: true
    }
  ])
);
store.dispatch(setAccountId(par.id));
store.dispatch(getItems());

initializeIcons();
ReactDOM.render(
  <Provider store={store}>
    <CrmUG />
  </Provider>,
  document.getElementById("crmUG")
);
