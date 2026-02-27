const Home = ({ title, username, cityCount, trucRoute }) => (
  <div>
    <h2>{title}</h2>
    <p>Bienvenue {username}</p>
    <p>Nombre de villes chargees: {cityCount}</p>
    {trucRoute && (
      <p>
        <a href={trucRoute}>Aller vers TrucController</a>
      </p>
    )}
  </div>
);

export default Home;
