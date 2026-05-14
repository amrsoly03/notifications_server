const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(cors());
app.use(express.json());

app.post("/send-notification", async (req, res) => {
  try {
    const {
      topic,
      title,
      body,
      image,
      data
    } = req.body;

    const message = {
      topic: topic,

      notification: {
        title: title,
        body: body,
        imageUrl: image,
      },

      data: data || {},

      android: {
        priority: "high",
        notification: {
          imageUrl: image,
        },
      },
    };

    const response = await admin.messaging().send(message);

    res.json({
      status: "success",
      response,
    });

  } catch (e) {
    res.status(500).json({
      status: "failed",
      error: e.toString(),
    });
  }
});

app.listen(3000, () => {
  console.log("Notification server running on port 3000");
});