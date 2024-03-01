const {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    createUserFavorite,
    fetchUserFavorites,
    deleteUserFavorite
  } = require('./db');
  const express = require('express');
  const app = express();
  app.use(express.json());
  
  app.get('/api/users', async(req, res, next)=> {
    try {
      res.send(await fetchUsers());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/products', async(req, res, next)=> {
    try {
      res.send(await fetchProducts());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/users/:id/favorites', async(req, res, next)=> {
    try {
      res.send(await fetchUserFavorites(req.params.id));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post('/api/users/:id/favorites', async(req, res, next)=> {
    try {
      res.status(201).send(await createUserFavorite({user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.delete('/api/users/:userId/favorites/:id', async(req, res, next)=> {
    try {
      await deleteUserFavorite({ user_id: req.params.userId, id: req.params.id });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });
  
  
  const init = async()=> {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [Morgen, Leo, Torrie, Kemp, computer, phone, tablet, camera] = await Promise.all([
      createUser({ username: 'Morgen', password: 'morgen123'}),
      createUser({ username: 'Leo', password: 'leo123'}),
      createUser({ username: 'Torrie', password: 'torie123'}),
      createUser({ username: 'Kemp', password: 'kemp123'}),
      createProduct({ name: 'computer'}),
      createProduct({ name: 'phone'}),
      createProduct({ name: 'tablet'}),
      createProduct({ name: 'camera'})
    ]);
  
    console.log(await fetchUsers());
    console.log(await fetchProducts());
  
    const userFavorites = await Promise.all([
      createUserFavorite({ user_id: Morgen.id, product_id: computer.id}),
      createUserFavorite({ user_id: Leo.id, product_id: phone.id}),
      createUserFavorite({ user_id: Torrie.id, product_id: tablet.id}),
      createUserFavorite({ user_id: Kemp.id, product_id: camera.id})
    ]);
    console.log(await fetchUserFavorites(Morgen.id));
    await deleteUserFavorite({ user_id: Morgen.id, id: userFavorites[0].id});
    console.log(await fetchUserFavorites(Morgen.id));
  
    // console.log(`curl localhost:3000/api/users/${Morgen.id}/favorites`);
  
    // console.log(`curl -X POST localhost:3000/api/users/${Morgen.id}/favorites -d '{"product_id": "${computer.id}"}' -H 'Content-Type:application/json'`);
    // console.log(`curl -X DELETE localhost:3000/api/users/${Morgen.id}/favorites/${userFavorites[3].id}`);
    
    // console.log('data seeded');
  
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  
  }
  init();