const express = require("express");
const axios = require("axios");
const router = new express.Router();

router.get("/", async (req, res) => {
  const o = req.query.offset || 0;
  const f = req.query.status;
  const s = req.query.search;
  const baseUrl = "https://api.mangadex.org";
  if (f) {
    const d = await axios({
      method: "GET",
      url: `${baseUrl}/manga?offset=${o}&order[latestUploadedChapter]=desc&status[]=${f}`,
      timeout: 3000,
    });
    res.status(200).json(d.data);
  } else if (s) {
    const d = await await axios({
      method: "GET",
      url: `${baseUrl}/manga?offset=${o}&order[year]=asc`,
      params: {
        title: s,
      },
    });
    res.status(200).json(d.data);
  } else {
    const d = await axios({
      method: "GET",
      url: `${baseUrl}/manga?offset=${o}&order[latestUploadedChapter]=desc`,
      timeout: 3000,
    });
    res.status(200).json(d.data);
  }
});

router.get("/cover", async (req, res) => {
  const { id, dataID } = req.query;

  try {
    const cover = await axios.get(`https://api.mangadex.org/cover/${id}`);
    const fileName = cover.data.data.attributes.fileName;

    const imageUrl = `https://uploads.mangadex.org/covers/${dataID}/${fileName}.256.jpg`;
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });

    res.setHeader('Content-Type', 'image/jpeg');
    imageResponse.data.pipe(res);

  } catch (err) {
    console.error('Cover Proxy Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch cover image' });
  }


  // let c = req.query.id;
  // let dataID = req.query.dataID;
  // const cover = await axios({
  //   method: "GET",
  //   url: `https://api.mangadex.org/cover/${c}`,
  //   timeout: 2000,
  // });

  // if (!cover?.data?.data?.attributes?.fileName) {
  //   return res.status(404).json({ message: "Cover file not found" });
  // }

  // const fileName = cover.data.data.attributes.fileName;
  // const fullCoverUrl = `https://uploads.mangadex.org/covers/${dataID}/${fileName}.256.jpg`;

  // return res.status(200).json({ url: fullCoverUrl });
});

router.get("/chapters", async (req, res) => {
  let id = req.query.id;
  const chapters = await axios({
    method: "GET",
    url: `https://api.mangadex.org/manga/${id}/feed?limit=500&order[chapter]=asc`,
    timeout: 2000,
  });
  res.status(200).send(chapters.data);
});

router.get("/read", async (req, res) => {
  let id = req.query.id;
  const resp = await axios({
    method: "GET",
    url: `https://api.mangadex.org/at-home/server/${id}`,
  });
  res.status(200).send(resp.data);
});

module.exports = router;
