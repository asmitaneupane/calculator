import { useReducer } from 'react';
import './styles.css'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

//we will break the action into two diff parameters i.e. type and payload
function reducer(state, { type, payload }) {
  // eslint-disable-next-line default-case
  switch (type) {

    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          curOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.curOperand === "0") return state
      if (payload.digit === "." && state.curOperand.includes(".")) return state
      return {
        ...state,
        curOperand: `${state.curOperand || ""}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.curOperand == null && state.prevOperand == null) {
        return state
      }

      if (state.curOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.curOperand,
          curOperand: null,
        }
      }

      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        curOperand: null
      }

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.curOperand == null ||
        state.prevOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        operation: null,
        curOperand: evaluate(state)
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          curOperand: null
        }
      }
      if (state.curOperand == null) return state
      if (state.curOperand.length === 1) {
        return {
          ...state,
          curOperand: null
        }
      }

      return {
        ...state,
        curOperand: state.curOperand.slice(0, -1)
      }

    // eslint-disable-next-line no-fallthrough
    case ACTIONS.CLEAR:
      return {}

  }
}

function evaluate({ prevOperand, curOperand, operation }) {
  const prev = parseFloat(prevOperand)
  const current = parseFloat(curOperand)
  if (isNaN(prev) && isNaN(current)) return ""
  let computation = ""
  // eslint-disable-next-line default-case
  switch (operation) {
    case "+":
      computation = prev + current
      break;

    case "-":
      computation = prev - current
      break;

    case "*":
      computation = prev * current
      break;

    case "÷":
      computation = prev / current
      break
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  //{} is the default state which is empty now
  //state has few different variables. so instead of state we will write {prevOperand, curOperand, operation}
  const [{ prevOperand, curOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(prevOperand)}{operation}</div>
        <div className="current-operand">{formatOperand(curOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton dispatch={dispatch} operation="÷" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
