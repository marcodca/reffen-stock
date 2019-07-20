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

// first time ever counter
// const InitialCocktailsCounter = {};

// cocktails.forEach(cocktail => {
//   InitialCocktailsCounter[cocktail] = 0;
// });

let prevCount, prevModified;

const CocktailCounter = ({ getCocktailsCounter, addCocktailsRecord }) => {
  const { cocktailsCounter, loading } = getCocktailsCounter;

  const lastRecord = cocktailsCounter
    ? cocktailsCounter[cocktailsCounter.length - 1]
    : { counter: "{}" };

  // console.log(lastRecord);

  const lastCount = JSON.parse(lastRecord.counter);

  const { lastModified } = lastRecord;

  const [counter, setCounter] = useState(lastCount);
  const [updated, setUpdated] = useState(lastModified);

  useEffect(() => {
    setCounter(prevCount || lastCount);
    setUpdated(prevModified || lastModified);
    // eslint-disable-next-line
  }, [getCocktailsCounter]);

  const newCocktailsCounter = { ...counter };

  const CocktailWidget = ({ cocktail, count }) => {
    return (
      <Paper
        css={`
          width: 60%;
          height: 5rem;
          min-width: 280px;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          >
            -1
          </Fab>
          <Fab
            color="secondary"
            aria-label={`Delete 0.25 ${cocktail}`}
            value={cocktail}
            size='small'
            onClick={e => {
              decreaseCocktailsCounter(e.target.parentElement.value, 0.25);
            }}
          >
            -0.25
          </Fab>
        </div>
        <div>
          <Typography variant="h6" align="center">
            {cocktail} <br /> {count}
          </Typography>
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
          >
            +1
          </Fab>
        </div>
      </Paper>
    );
  };

  function increaseCocktailsCounter(cocktail, amount = 1) {
    const newCount = { ...counter };
    newCount[cocktail] = newCount[cocktail] + amount;
    setCounter(newCount);
    return;
  }

  function decreaseCocktailsCounter(cocktail, amount = 1) {
    const newCount = { ...counter };
    newCount[cocktail] = newCount[cocktail] - amount;
    setCounter(newCount);
    return;
  }

  const hasCounterChanged = prevCount
    ? JSON.stringify(counter) === JSON.stringify(prevCount)
    : JSON.stringify(counter) === JSON.stringify(lastCount);

  return (
    <Container>
      <p>Updated {moment(updated).fromNow()}.</p>
      {Object.entries(counter).map(([key, value], index) => {
        return loading ? (
          <h1>Loading...</h1>
        ) : (
          <CocktailWidget cocktail={key} count={value} key={index} />
        );
      })}

      <button
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
      >
        Save
      </button>
    </Container>
  );
};

export default compose(
  graphql(getCocktailsCounter, { name: "getCocktailsCounter" }),
  graphql(addCocktailsRecord, { name: "addCocktailsRecord" })
)(CocktailCounter);
