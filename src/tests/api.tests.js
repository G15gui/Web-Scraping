const test = require('node:test');
const assert = require('node:assert');

console.log('#API Tests');
var baseUri = 'http://localhost:3005/'
var token = '';
test('api index status', async () => {
  const response = await fetch(baseUri);
    console.log(response.status);
    assert.equal(response.status, 200);
  });

test('api auth-login', async () => {
    const response = await fetch(`${baseUri}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: 'admin',
        password: 'admin.api.test'
      })
    })
    if(response.status == 200)
    {
      const clientData = await response.json();
      for (const property in clientData) {
        console.log(`${property}: ${clientData[property]}`);
      }
      token = clientData['token'];
    }
    else
    {
      const data = await response.json();
      console.log(data);
    }
    console.log(response.status);
    assert.equal(response.status, 200);
  
  });

test('api client-add status', async () => {
  const response = await fetch(`${baseUri}clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Name Test',
      email: 'email_test2@company.com',
      date: Date.now(),
    })
  });
  if(response.status == 201)
  {
    const clientData = await response.json();
    for (const property in clientData) {
      console.log(`${property}: ${clientData[property]}`);
    }
  }
  if(response.status == 409)
  {
    const clientData = await response.json();
    console.log(clientData);
  }
  console.log(response.status);
  assert.ok(response.status == 201 || response.status == 409);
  });

test('api client-get status', async () => {
  const response = await fetch(`${baseUri}clients`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  console.log(data);
  console.log(response.status);
  assert.equal(response.status, 200);
  });

test('api client-getById status', async () => {
  const response = await fetch(`${baseUri}clients/id/65c13f64fa03f7082b83f654`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  
  const clientData = await response.json();
  for (const property in clientData) {
    console.log(`${property}: ${clientData[property]}`);
  }
  console.log(response.status);
  assert.equal(response.status, 200);   
  });

test('api client-getByEmail status', async () => {

  const response = await fetch(`${baseUri}clients/email/email_test@company.com`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
              
  const clientData = await response.json();
  for (const property in clientData) {
    console.log(`${property}: ${clientData[property]}`);
  }
  console.log(response.status);
  assert.equal(response.status, 200);              
});

test('api client-deleteByEmail status', async () => {
  const response = await fetch(`${baseUri}clients/email/email_test2@company.com`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },    
  });

  const clientData = await response.json();
  for (const property in clientData) {
    console.log(`${property}: ${clientData[property]}`);
  }
  console.log(response.status);
  assert.equal(response.status, 200);  
  });