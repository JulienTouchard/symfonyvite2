const Home = ({ title, username, cityCount }) => (// ou props
  <div>
    <h2>{title}</h2>{/* et props.title ... */}
    <p>Bienvenue {username}</p>
    <p>Nombre de villes chargees: {cityCount}</p>
  </div>
);
export default Home;
