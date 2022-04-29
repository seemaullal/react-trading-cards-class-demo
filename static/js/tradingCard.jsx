function TradingCard(props) {
  return (
    <div className="card">
      <p>Name: {props.name}</p>
      <img src={props.imgUrl} alt="profile" />
      <p>Skill: {props.skill} </p>
    </div>
  );
}

function TradingCardContainer() {
  console.log('TradingCardContainer is re-rendering');
  // array of TradingCard components
  const tradingCards = [];

  const [timesClicked, setTimesClicked] = React.useState(0);
  const [cardData, setCardData] = React.useState([]);
  const [newCardName, setNewCardName] = React.useState('');
  const [newCardSkill, setNewCardSkill] = React.useState('');

  // any side effect including AJAX needs to be in a useEffect function
  React.useEffect(() => {
    console.log('in useEffect');
    // "api/cards/{currentCardId}"
    fetch('/api/cards.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setCardData(jsonData.cards);
      });
  }, []);

  // addNewCard {
  // /api/addCard --> 1) could return all of the cards, setCardData for all of them
  // 2 ) you only return the new card, and then add that
  // 3) you just add the card on the frontend regardless of the server (maybe if there's an error show that later)
  // }

  function addNewCard(event) {
    // single page app so prevent redirect (default behavior of forms)
    event.preventDefault();

    // clear the current form
    setNewCardName('');
    setNewCardSkill('');

    fetch('/api/add-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // this could also be written as body: JSON.stringify({ name, skill }) with
      // JS object property value shorthand
      // you could use document.querySelector("nameInput").value but not recommended
      body: JSON.stringify({ name: newCardName, skill: newCardSkill }),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        const cardAdded = jsonResponse.cardAdded;
        // [...cardData] makes a copy of cardData. Similar to currentCards = cards[:] in Python
        const currentCards = [...cardData];
        // [...currentCards, newCard] is an array containing all elements in currentCards followed by newCard
        // we update card data to include the new card so it is shown on the page
        setCardData([...currentCards, cardAdded]);
      });
  }

  // show loading message if the data is not loaded yet
  // (since we return, none of the code from  line 72 onwards will happen in this case)
  if (cardData.length == 0) {
    return <div>Loading</div>;
  }

  for (const currentCard of cardData) {
    tradingCards.push(
      <TradingCard
        key={currentCard.cardId}
        name={currentCard.name}
        skill={currentCard.skill}
        imgUrl={currentCard.imgUrl}
      />
    );
  }

  return (
    <div>
      <button onClick={() => setTimesClicked(timesClicked + 1)}>
        Click me
      </button>
      <div className="grid">{tradingCards}</div>
      <p> You clicked on the button {timesClicked} times.</p>
      <section>
        <h3>Add a new card!</h3>
        <form onSubmit={(event) => addNewCard(event)}>
          <label htmlFor="nameInput">
            Name
            <input
              value={newCardName}
              onChange={(event) => setNewCardName(event.target.value)}
              id="nameInput"
              style={{ marginLeft: '5px' }}
            />
          </label>
          <label htmlFor="skillInput" style={{ marginLeft: '10px' }}>
            Skill
            <input
              value={newCardSkill}
              onChange={(event) => setNewCardSkill(event.target.value)}
              id="skillInput"
            />
          </label>
          <button
            type="submit"
            style={{ marginLeft: '10px', marginTop: '10px' }}
          >
            Add New Card
          </button>
        </form>
      </section>
    </div>
  );
}

// this will add whatever the TradingCardContainer renders to inside of the element
// with the ID container
ReactDOM.render(
  <div>
    <TradingCardContainer />
  </div>,
  document.getElementById('container')
);
