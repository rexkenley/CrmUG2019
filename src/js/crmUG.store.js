/* global Xrm */
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import { isUUID } from "validator";
import get from "lodash/get";

const TYPE = {
    SET_RATING: "SET_RATING",
    SET_MAXRATING: "SET_MAXRATING",
    SET_COLUMNS: "SET_COLUMNS",
    SET_ITEMS: "SET_ITEMS",
    SET_ACCOUNTID: "SET_ACCOUNTID"
  },
  initialState = {
    rating: 0,
    maxRating: 5,
    columns: [],
    items: [],
    accountId: ""
  };

function reducer(state, { type = "", payload = {} } = {}) {
  const { rating = 0, maxRating = 0, columns = [], items = [] } = payload;
  let { accountId = "" } = payload;

  switch (type) {
    case TYPE.SET_RATING:
      return { ...state, rating };
    case TYPE.SET_MAXRATING:
      return { ...state, maxRating };
    case TYPE.SET_COLUMNS:
      return { ...state, columns };
    case TYPE.SET_ITEMS:
      return { ...state, items };
    case TYPE.SET_ACCOUNTID:
      accountId = accountId.replace(/[\{\}']+/g, ""); // eslint-disable-line
      if (isUUID(accountId)) return { ...state, accountId };
      return state;
    default:
      return state;
  }
}

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

export function setRating(rating = 0) {
  return dispatch => {
    dispatch({ type: TYPE.SET_RATING, payload: { rating } });
  };
}

export function setMaxRating(maxRating = 0) {
  return dispatch => {
    dispatch({ type: TYPE.SET_MAXRATING, payload: { maxRating } });
  };
}

export function setColumns(columns = []) {
  return dispatch => {
    dispatch({ type: TYPE.SET_COLUMNS, payload: { columns } });
  };
}

export function setItems(items = []) {
  return dispatch => {
    dispatch({ type: TYPE.SET_ITEMS, payload: { items } });
  };
}

export function getItems() {
  return async dispatch => {
    const { execute } = Xrm.WebApi.online,
      request = {
        AccountId: store.getState().accountId,
        getMetadata() {
          return {
            boundParameter: null,
            operationName: "vm_CrmUG",
            operationType: 0,
            parameterTypes: {
              AccountId: {
                typeName: "Edm.String",
                structuralProperty: 1
              }
            }
          };
        }
      },
      data = await execute(request),
      text = data && (await data.text()),
      { Result = "" } = text && JSON.parse(text),
      items =
        Result &&
        JSON.parse(Result).map(r => ({
          id: r.Id,
          ticketnumber: get(r, "Attributes[1].Value"),
          title: get(r, "Attributes[2].Value"),
          casetypecode: get(r, "Attributes[3].Value.Value")
        }));

    dispatch(setRating(items.filter(i => i.casetypecode === 2).length));
    dispatch(setMaxRating(items.length));
    dispatch(setItems(items));
  };
}

export function setAccountId(accountId) {
  return dispatch => {
    dispatch({ type: TYPE.SET_ACCOUNTID, payload: { accountId } });
  };
}
