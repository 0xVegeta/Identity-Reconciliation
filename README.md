
# Customer Identity Reconcilation System

This is a backend service which requires a way to identify and keep track of a customer's identity across multiple purchase.

## Customer Contact Linking
To establish a connection between customer contacts, the "Contact" rows are linked based on common email or phone number information. The following rules apply:

- All linked contacts belong to the same customer.
- The oldest contact row is considered "primary," and the rest are marked as "secondary."
- The linkedId field holds the ID of the primary contact associated with the  secondary contact row.

## Wanna try out the API endpoint
```bash
https://identity-reconcilation-7f5o.onrender.com/identify
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/0xVegeta/Identity-Reconciliation.git
```

Go to the project directory

```bash
   cd Identity-Reconciliation/
```

Install dependencies

```bash
  npm install
```
Make a .env file
```bash
  PORT=
  SEQUELIZE_DATABASE_URI=
```
Start the server

```bash
  npm start
```





## API Reference

```http
  POST /identify
```

#### Request Body (sample)


```http
  {
    "email": "test31@example.com",
    "phoneNumber": "123456"
}
```




## Edge cases (Future scope)

- Handling of secondary contacts which were once linked to primary contact (but now a secondary contact)

- Handling cases where contact details recieved are from two different secondary contacts

- Handling cases where contact details entered are from a primary and a secondary account. According to current logic it should be created as a secondary contact but this will create duplicate contact entries


## Tech Stack

**Backend:** Node (Javascript), Express, 

**Deployment:** Render, Supabase

