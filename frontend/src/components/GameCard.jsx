const GameCard = ({ game }) => {
  const imageData = game.image;
  const imageUrl = `data:image/png;base64,${imageData}`;

  return (
    <div>
      <h2>{game.title}</h2>
      <p>{game.site}</p>
      <img src={imageUrl} alt={game.title} />
    </div>
  );
};

export default GameCard;
