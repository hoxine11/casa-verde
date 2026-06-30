import pool from "../config/db.js";

export const getSettings = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT *
      FROM settings
      LIMIT 1
    `);

    res.json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

export const updateSettings = async (req, res) => {

  try {

    const {
      restaurantName,
      phone,
      address,
      deliveryFee,
      facebook,
      instagram
    } = req.body;

    await pool.query(
      `
      UPDATE settings
      SET

      restaurant_name = $1,
      phone = $2,
      address = $3,
      delivery_fee = $4,
      facebook = $5,
      instagram = $6

      WHERE id = 1
      `,
      [
        restaurantName,
        phone,
        address,
        deliveryFee,
        facebook,
        instagram
      ]
    );

    res.json({
      message: "Settings updated"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};