const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

app.get("/repositories", (request, response) => {
  const {title} = request.query;

  const results = title 
    ? repositories.filter(repositorie => repositorie.title.includes(title)) 
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);
  
  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie not found.'})
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes:repositories[repositorieIndex].likes
  }

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie not found.'})
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie not found.'});
  }

  const like = { id: uuid(), idRepositorie:id, like: 1 };
  likes.push(like);

  const listLikesRepositorie = likes.filter(like => like.idRepositorie === id);

  const repositorie = repositories.find(repositorie => repositorie.id === id);

  const repositorieAtualizado = {
    id,
    title: repositorie.title,
    url: repositorie.url,
    techs: repositorie.techs,
    likes:listLikesRepositorie.length
  }
  
  repositories[repositorieIndex] = repositorieAtualizado;
  
  return response.json({likes: listLikesRepositorie.length});
});

module.exports = app;
