import pool from "../config/db.js";

export const createOption = async (req, res) => {
  try {
    const {
      product_id,
      name,
      price,
      option_group
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO product_options
      (product_id, name, price, option_group)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [product_id, name, price, option_group]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getOptionsByProduct = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM product_options
      WHERE product_id = $1
      ORDER BY id
      `,
      [req.params.productId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};