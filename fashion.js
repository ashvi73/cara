// ===============================
// FULL STACK MEN'S FASHION WEBSITE
// Tech: React + Node.js + Express + MongoDB + Razorpay
// ===============================

// ===============================
// 1. BACKEND (server.js)
// ===============================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/fashion", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const User = mongoose.model("User", {
  email: String,
  password: String,
});

const Order = mongoose.model("Order", {
  products: Array,
  amount: Number,
  address: String,
  paymentId: String,
});

// Razorpay Setup
const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});

// Create Order API
app.post("/create-order", async (req, res) => {
  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});

// Save Order
app.post("/save-order", async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json({ message: "Order saved" });
});

app.listen(5000, () => console.log("Server running on 5000"));

// ===============================
// 2. FRONTEND (App.js - React)
// ===============================

import React, { useState } from "react";

export default function App() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");

  const products = [
    { id: 1, name: "T-Shirt", price: 799 },
    { id: 2, name: "Jeans", price: 1499 },
    { id: 3, name: "Jacket", price: 2499 },
  ];

  const addToCart = (p) => setCart([...cart, p]);

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  const checkout = async () => {
    const res = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const order = await res.json();

    const options = {
      key: "YOUR_KEY_ID",
      amount: order.amount,
      currency: "INR",
      name: "FuelFit",
      order_id: order.id,
      handler: async function (response) {
        await fetch("http://localhost:5000/save-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: cart,
            amount: total,
            address,
            paymentId: response.razorpay_payment_id,
          }),
        });

        alert("Payment Successful");
        setCart([]);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <h1>Men's Fashion</h1>

      <div>
        {products.map((p) => (
          <div key={p.id}>
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button onClick={() => addToCart(p)}>Add</button>
          </div>
        ))}
      </div>

      <h2>Cart</h2>
      {cart.map((c, i) => (
        <p key={i}>{c.name}</p>
      ))}

      <h3>Total: ₹{total}</h3>

      <input
        placeholder="Address"
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={checkout}>Pay Now</button>
    </div>
  );
}

// ===============================
// 3. INDEX.HTML (Add Razorpay)
// ===============================

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

// ===============================
// 4. INSTALL COMMANDS
// ===============================

// Backend
// npm init -y
// npm install express mongoose cors razorpay

// Frontend
// npx create-react-app app
// cd app
// npm start

// ===============================
// DONE ✅
// ===============================