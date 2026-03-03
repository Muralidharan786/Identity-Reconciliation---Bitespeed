const express = require("express");
const pool = require("./db");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const [existingContacts] = await pool.execute(
      `SELECT * FROM Contact 
       WHERE email = ? OR phoneNumber = ?`,
      [email, phoneNumber]
    );

    // 1️⃣ If no contact found → create primary
    if (existingContacts.length === 0) {
      const [result] = await pool.execute(
        `INSERT INTO Contact (email, phoneNumber, linkPrecedence)
         VALUES (?, ?, 'primary')`,
        [email, phoneNumber]
      );

      return res.json({
        contact: {
          primaryContactId: result.insertId,
          emails: [email],
          phoneNumbers: [phoneNumber],
          secondaryContactIds: [],
        },
      });
    }

    // 2️⃣ Get primary contact
    const contacts = existingContacts;
    let primary =
      contacts.find((c) => c.linkPrecedence === "primary") ||
      contacts[0];

    // 3️⃣ Insert secondary if new combination
    const alreadyExists = contacts.some(
      (c) => c.email === email && c.phoneNumber === phoneNumber
    );

    if (!alreadyExists) {
      await pool.execute(
        `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence)
         VALUES (?, ?, ?, 'secondary')`,
        [email, phoneNumber, primary.id]
      );
    }

    // 4️⃣ Get all linked contacts
    const [allLinked] = await pool.execute(
      `SELECT * FROM Contact 
       WHERE id = ? OR linkedId = ?`,
      [primary.id, primary.id]
    );

    const emails = [
      ...new Set(allLinked.map((c) => c.email).filter(Boolean)),
    ];

    const phones = [
      ...new Set(allLinked.map((c) => c.phoneNumber).filter(Boolean)),
    ];

    const secondaryIds = allLinked
      .filter((c) => c.linkPrecedence === "secondary")
      .map((c) => c.id);

    res.json({
      contact: {
        primaryContactId: primary.id,
        emails,
        phoneNumbers: phones,
        secondaryContactIds: secondaryIds,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);