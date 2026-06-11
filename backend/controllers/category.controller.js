import pool from "../config/db.js";
export const getCategories = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT *
      FROM categories
      ORDER BY id
    `);

    return res.json(result.rows);

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }
};
export const createCategory = async (req, res) => {
  try {

    const { name } = req.body;

    const result = await pool.query(
      `
      INSERT INTO categories(name)
      VALUES($1)
      RETURNING *
      `,
      [name]
    );

    return res.status(201).json(
      result.rows[0]
    );

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }
};
export const updateCategory = async (req, res) => {
  try {

    const { id } = req.params;
    const { name } = req.body;

    const result = await pool.query(
      `
      UPDATE categories
      SET name = $1
      WHERE id = $2
      RETURNING *
      `,
      [name, id]
    );

    return res.json(
      result.rows[0]
    );

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }
};
export const deleteCategory = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM categories
      WHERE id = $1
      `,
      [id]
    );

    return res.json({
      message: "Category deleted"
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }
};
    