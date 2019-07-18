import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import media from "../styles/media";
import { compose, graphql } from "react-apollo";
import { getCocktailsCounter, addCocktailsRecord } from "../queries";
import { cocktails } from "../utlis";
import moment from 'moment';

const Container = styled.div`
  width: 100%;
  margin-top: 4rem;
  ${media.down.sm`
    margin-top: 5.8rem;
  `}
`;

// first time ever counter
// const InitialCocktailsCounter = {};

// cocktails.forEach(cocktail => {
//   InitialCocktailsCounter[cocktail] = 0;
// });

const CocktailCounter = ({ getCocktailsCounter, addCocktailsRecord }) => {

  const { cocktailsCounter, loading } = getCocktailsCounter;

  const lastRecord = cocktailsCounter
  ? cocktailsCounter[cocktailsCounter.length - 1]
  : { counter: "{}" };

  console.log(lastRecord);
  
  const lastCount = JSON.parse(lastRecord.counter)

  const { lastModified } = lastRecord;


  const [counter, setCounter] = useState(lastCount);
  const [ updated, setUpdated ] = useState(lastModified);

  useEffect(() => {
    setCounter(lastCount);
    setUpdated(lastModified);
  }, [getCocktailsCounter]);

  const newCocktailsCounter = { ...counter };

  console.log(JSON.stringify(newCocktailsCounter) === JSON.stringify(lastCount))

  const CocktailWidget = ({ cocktail, count }) => {
    return (
      <>
        <button
          value={cocktail}
          onClick={e => {
            decreaseCocktailsCounter(e.target.value);
          }}
        >
          {cocktail}-1
        </button>
        <p>
          {cocktail} : {count}
        </p>
        <button
          value={cocktail}
          onClick={e => {
            increaseCocktailsCounter(e.target.value);
          }}
        >
          {cocktail}+1
        </button>
      </>
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

  console.log(counter);
  return (
    <Container>
        <p>Updated {moment(updated).fromNow()}.</p>
      {Object.entries(counter).map(([key, value], index) => {
        return loading
            ? <h1>Loading...</h1>
            :<CocktailWidget cocktail={key} count={value} key={index} />;
      })}

      <button
        disabled={JSON.stringify(newCocktailsCounter) === JSON.stringify(lastCount)}
        onClick={() => {
          addCocktailsRecord({
            variables: { counter: JSON.stringify(counter), lastModified: moment() }
          })
          .then(({data}) => {
              const { addCocktailsRecord : newRecord } = data;
              setCounter(JSON.parse(newRecord.counter));
              setUpdated(newRecord.lastModified);
          })
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
