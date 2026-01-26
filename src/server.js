const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

let tasks =[{ id: 1, title: 'Task One', completed: false },
{ id: 2, title: 'Task Two', completed: true },
{ id: 3, title: 'Task Three', completed: false }];


let users = ['Admin', 'Guest', 'User1', 'User2'];

let products = [
  { id: 1, name: 'Product A', price: 10.0 },
  { id: 2, name: 'Product B', price: 20.0 },
  { id: 3, name: 'Product C', price: 30.0 }
];




app.get('/get-users', (req, res) => {
  if (!users.length) {
    return res.status(404).json({ message: 'No users found' })
  }
  else if (users.length > 10) {
    return res.status(413).json({ message: 'Too many users' })
  }

  return res.status(200).json(users)
})

app.post('/add-user', (req, res) => {
  const key = req.headers.authorization;
  if(key !== 'PASSWORD'){
    return res.status(401).json({ message: 'Unauthorized' })
  }  
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' })
  }
  users.push(name);
  return res.status(201).json({ message: 'User added successfully' })
})

app.delete('/delete-user/:name', (req, res) => {
  const { name } = req.params;
  users = users.filter(user => user !== name);
  return res.status(200).json({ message: 'User deleted successfully' })
})

app.put('/edit-user/:user', (req, res) => {
  const { user } = req.params;
  const { name } = req.body;
  const userIndex = users.findIndex(u => u === user);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' })
  }
  users[userIndex] = name || users[userIndex];
  return res.status(200).json({ message: 'User updated successfully' })
}
);

app.get('/get-tasks', (req, res) => {
  if (!tasks.length) {
    return res.status(404).json({ message: 'No tasks found' })
  }
  return res.status(200).json(tasks)
})

app.post('/add-task', (req, res) => {
  const { title, completed } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' })
  }
  const newTask = { id: tasks.length + 1, title, completed };
  tasks.push(newTask);
  return res.status(201).json({ message: 'Task added successfully', newTask })
})

app.put('/edit-task/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = tasks.find(task => task.id == id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }
  task.title = title || task.title;
  task.completed = completed !== undefined ? completed : task.completed;
  return res.status(200).json({ message: 'Task updated successfully' })
})

app.delete('/delete-task/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id != id);
  return res.status(200).json({ message: 'Task deleted successfully' })
})

app.get('/get-products', (req, res) => {
  if (!products.length) {
    return res.status(404).json({ message: 'No products found' })
  }
  return res.status(200).json(products)
})

app.post('/add-product', (req, res) => {
  const { name, price } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Name and price are required' })
  }
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  return res.status(201).json({ message: 'Product added successfully', newProduct })
})

app.put('/update-product/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const product = products.find(product => product.id == id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  product.name = name || product.name;
  product.price = price !== undefined ? price : product.price;
  return res.status(200).json({ message: 'Product updated successfully' })
})

app.delete('/delete-product/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(product => product.id != id);
  return res.status(200).json({ message: 'Product deleted successfully' })
}
);

app.get('/', (req, res) => {
  tasksnumber = tasks.length;
  usersnumber = users.length;
  productsnumber = products.length;

  stats = [{ tasks: tasksnumber }, { users: usersnumber }, { products: productsnumber }];
  res.status(200).json(stats);
  
});

app.post('/login', (req, res) => {
  
  const reqUsername = 'admin';
  const reqPassword = 'password123';
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (username === reqUsername && password === reqPassword) {
    
    res.cookie(`key`,`PASSWORD`);
    return res.status(200).json({ message: 'Login successful' });

  
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

app.listen(port, () => {
  console.log(`Example app listening on   http://localhost:${port}`)
})