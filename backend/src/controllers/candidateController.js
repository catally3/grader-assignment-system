exports.getCandidates = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    // **[Kay] Edited table name candidates to applicants**
    const [rows] = await pool.query('SELECT * FROM applicants');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Error fetching candidates' });
  }
};
