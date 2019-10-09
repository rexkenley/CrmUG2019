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
    SET_ACCOUNTID: "SET_ACCOUNTID",
    SET_CONTEXT: "SET_CONTEXT"
  },
  initialState = {
    rating: 0,
    maxRating: 5,
    columns: [],
    items: [],
    accountId: "",
    context: null
  };

/**
 * @param {object} state
 * @param {object} action
 */
function reducer(state, { type = "", payload = {} } = {}) {
  const {
    rating = 0,
    maxRating = 0,
    columns = [],
    items = [],
    context = null
  } = payload;
  let { accountId = "" } = payload;

  switch (type) {
    case TYPE.SET_RATING:
      return { ...state, rating };
    case TYPE.SET_MAXRATING:
      return { ...state, maxRating };
    case TYPE.SET_COLUMNS:
      return { ...state, columns };
    case TYPE.SET_ITEMS:
      if (Array.isArray(items)) return { ...state, items };
      return state;
    case TYPE.SET_ACCOUNTID:
      accountId = accountId.replace(/[\{\}']+/g, ""); // eslint-disable-line
      if (isUUID(accountId)) return { ...state, accountId };
      return state;
    case TYPE.SET_CONTEXT:
      return { ...state, context };
    default:
      return state;
  }
}

/**
 * @type {object}
 */
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

/**
 * @param {number} rating
 * @return {function}
 */
export function setRating(rating = 0) {
  return dispatch => {
    dispatch({ type: TYPE.SET_RATING, payload: { rating } });
  };
}

/**
 * @param {number} maxRating
 * @return {function}
 */
export function setMaxRating(maxRating = 0) {
  return dispatch => {
    dispatch({ type: TYPE.SET_MAXRATING, payload: { maxRating } });
  };
}

/**
 * @param {Array.<object>} columns
 * @return {function}
 */
export function setColumns(columns = []) {
  return dispatch => {
    dispatch({ type: TYPE.SET_COLUMNS, payload: { columns } });
  };
}

/**
 * @param {Array.<object>} items
 * @return {function}
 */
export function setItems(items = []) {
  return dispatch => {
    dispatch({ type: TYPE.SET_ITEMS, payload: { items } });
  };
}

/**
 * @param {string} accountId
 * @return {function}
 */
export function setAccountId(accountId) {
  return dispatch => {
    dispatch({ type: TYPE.SET_ACCOUNTID, payload: { accountId } });
  };
}

/**
 * @param {object} context
 * @return {function}
 */
export function setContext(context = null) {
  return dispatch => {
    dispatch({ type: TYPE.SET_CONTEXT, payload: { context } });
  };
}

/**
 * @return {function}
 */
export function getItems() {
  return async dispatch => {
    const { context } = store.getState(),
      api = get(context, "webAPI", get(context, "WebApi.online"));

    if (!api) return;

    const request = {
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
      data = await api.execute(request),
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
