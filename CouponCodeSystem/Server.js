const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Coupon = require("./models/Coupon");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://imt2021109:ved%40123@cluster0.sv47wz8.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.post("/api/coupons", async (req, res) => {
  try {
    const { code, discountType, discountAmount, expirationDate } = req.body;
    const newCoupon = new Coupon({
      code,
      discountType,
      discountAmount,
      expirationDate,
    });
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ error: "Coupon creation failed" });
  }
});

app.get("/api/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: "Coupon fetching failed" });
  }
});
app.put("/api/coupons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { discountType, discountAmount, expirationDate } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      {
        discountType,
        discountAmount,
        expirationDate,
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ error: "Coupon update failed" });
  }
});
app.delete("/api/coupons/delete", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id, "id");
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Coupon deletion failed" });
  }
});

app.post("/api/checkout", async (req, res) => {
  try {
    const { data } = req.body;

    console.log(req.body, data, "body");
    const coupon = await Coupon.findOne({ code: data.couponCode });
    console.log(coupon, "coupon");
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date() || !coupon.active) {
      return res.status(400).json({ error: "Coupon is expired or inactive" });
    }

    let finalPrice = data.totalPrice;
    finalPrice = data.totalPrice * (1 - coupon.discountAmount / 100);
    console.log(finalPrice, "price");
    res.json({ finalPrice });
  } catch (error) {
    res.status(500).json({ error: "Coupon validation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
