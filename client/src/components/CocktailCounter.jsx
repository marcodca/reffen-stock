import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import media from "../styles/media";
import { compose, graphql } from "react-apollo";
import { getCocktailsCounter, addCocktailsRecord } from "../queries";
import { cocktails } from "../utlis";
import moment from "moment";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const Container = styled.div`
  width: 100%;
  margin-top: 4rem;
  ${media.down.sm`
    margin-top: 5.8rem;
  `}
  display: flex;
  flex-direction: column;
  align-items: center;
`;

let prevCount, prevModified;

const CocktailCounter = ({ getCocktailsCounter, addCocktailsRecord }) => {
  const { cocktailsCounter } = getCocktailsCounter;

  let loading = cocktailsCounter ? false : true;

  const lastRecord = cocktailsCounter
    ? cocktailsCounter[cocktailsCounter.length - 1]
    : { counter: "{}" };

  const lastCount = JSON.parse(lastRecord.counter);

  const { lastModified } = lastRecord;

  const [counter, setCounter] = useState(lastCount);
  const [updated, setUpdated] = useState(lastModified);

  useEffect(() => {
    setCounter(prevCount || lastCount);
    setUpdated(prevModified || lastModified);
    // eslint-disable-next-line
  }, [getCocktailsCounter]);

  const lastReference = prevCount ? prevCount : lastCount;
  const hasCounterChanged =
    JSON.stringify(counter) === JSON.stringify(lastReference);

  //Styled components
  const CounterDisplay = styled(Typography)`
    font-size: 1.5em;
    color: ${props => (props.counter < 1 ? `red` : `inherit`)};
  `;

  const CocktailDisplay = styled(Typography)`
    font-size: 1.3em;
    color: ${props =>
      props.lastreference[props.cocktail] === props.counter[props.cocktail]
        ? `inherit`
        : props.lastreference[props.cocktail] > props.counter[props.cocktail]
        ? `red`
        : `green`};
  `;

  //Components

  const CocktailWidget = ({ cocktail, count }) => {
    return (
      <Paper
        css={`
          width: 70%;
          height: 5rem;
          min-width: 320px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          ${media.up.sm`justify-content: space-around`};
        `}
      >
        <div>
          <Fab
            color="secondary"
            aria-label={`Delete 1 ${cocktail}`}
            value={cocktail}
            onClick={e => {
              decreaseCocktailsCounter(e.target.parentElement.value);
            }}
            css={`
              width: 4.1em;
              height: 4.1em;
              margin: -4px 4px 4px 4px;
            `}
          >
            -1
          </Fab>
          <Fab
            color="secondary"
            aria-label={`Delete 0.25 ${cocktail}`}
            value={cocktail}
            size="small"
            onClick={e => {
              decreaseCocktailsCounter(e.target.parentElement.value, 0.25);
            }}
            css={`
              margin: 4px 4px -6px 0;
            `}
          >
            -0.25
          </Fab>
        </div>
        <div
          css={`
            min-width: 100px;
            font-size: 18px;
            display: flex;
            flex-direction: column;
            align-items: center;
            ${media.down.sm`font-size: 14px`};
          `}
        >
          <CocktailDisplay
            lastreference={lastReference}
            cocktail={cocktail}
            counter={counter}
          >
            {cocktail}
          </CocktailDisplay>
          <CounterDisplay counter={count} cocktail={cocktail}>
            {count}
          </CounterDisplay>
        </div>
        <div>
          <Fab
            color="primary"
            size="small"
            aria-label={`Add 0.25 ${cocktail}`}
            value={cocktail}
            onClick={e => {
              increaseCocktailsCounter(e.target.parentElement.value, 0.25);
            }}
            css={`
              margin: 4px 0 -6px 4px;
            `}
          >
            +0.25
          </Fab>
          <Fab
            color="primary"
            aria-label={`Add 1 ${cocktail}`}
            value={cocktail}
            onClick={e => {
              increaseCocktailsCounter(e.target.parentElement.value);
            }}
            css={`
              margin: -6px 4px 0 4px;
            `}
          >
            +1
          </Fab>
        </div>
      </Paper>
    );
  };

  function increaseCocktailsCounter(cocktail, amount = 1) {
    if (!cocktail) return;
    const newCount = { ...counter };
    newCount[cocktail] = newCount[cocktail] + amount;
    setCounter(newCount);
    return;
  }

  function decreaseCocktailsCounter(cocktail, amount = 1) {
    if (!cocktail) return;
    const newCount = { ...counter };
    newCount[cocktail] = newCount[cocktail] - amount;
    setCounter(newCount);
    return;
  }

  return (
    <Container>
      {loading ? (
        <CircularProgress
          css={`
            margin-top: 35vh;
          `}
        />
      ) : (
        <>
          <Typography variant="subtitle1">
            Last updated {moment(updated).fromNow()}.
          </Typography>
          <Button
            disabled={hasCounterChanged}
            onClick={() => {
              addCocktailsRecord({
                variables: {
                  counter: JSON.stringify(counter),
                  lastModified: moment()
                }
              }).then(({ data }) => {
                const { addCocktailsRecord: newRecord } = data;
                prevCount = JSON.parse(newRecord.counter);
                prevModified = newRecord.lastModified;
                setCounter(JSON.parse(newRecord.counter));
                setUpdated(newRecord.lastModified);
              });
            }}
            css={`
              background-color: lightblue;
              margin: 0 0 15px 0;
            `}
          >
            Save changes
          </Button>
          {Object.entries(counter).map(([key, value], index) => (
            <CocktailWidget cocktail={key} count={value} key={index} />
          ))}
          <Button
            onClick={() => {
              const zeroCount = {};
              Object.keys(counter).forEach(cocktail => {
                zeroCount[cocktail] = 0;
              });
              setCounter(zeroCount);
            }}
            css={`
              margin: 15px 0;
              background: lightcoral;
            `}
          >
            set all counters to 0
          </Button>
        </>
      )}
    </Container>
  );
};

export default compose(
  graphql(getCocktailsCounter, { name: "getCocktailsCounter" }),
  graphql(addCocktailsRecord, { name: "addCocktailsRecord" })
)(CocktailCounter);
