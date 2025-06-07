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

router.get("/cover",  async (req, res) => {
  let c = req.query.id;
  const cover = await axios({
    method: "GET",
    url: `https://api.mangadex.org/cover/${c}`,
    timeout: 2000,
  });

  /* const i = await axios({
    method: "GET",
    url: `https://uploads.mangadex.org/covers/5b947fed-957b-44e1-8889-d998b95ba3e4/${cover.data.data.attributes.fileName}.256.jpg`,
    timeout: 2000,
  }); */
  res.status(200).send(cover.data.data.attributes.fileName);
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
