import pool from "../config/db.js";

export const getSettings = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT *
      FROM settings
      LIMIT 1
    `);

    return res.json(result.rows[0]);

  } catch (err) {

    return res.status(500).json({
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
      instagram,
        is_open

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
        instagram = $6,
        is_open = $7
      WHERE id = 1
      `,
      [
        restaurantName,
        phone,
        address,
        deliveryFee, // maintenant c'est un texte
        facebook,
        instagram,
        is_open
      ]
    );

    return res.json({
      message: "Settings updated"
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

};