const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
  id: "org.anderson51.torrentstream",
  version: "1.0.0",
  name: "Anderson51 Torrent Stream",
  description: "Stream Spider‑Man video via magnet link",
  logo: "https://via.placeholder.com/256?text=Anderson51",
  resources: ["catalog", "stream", "meta"],
  types: ["movie"],
  catalogs: [{ type: "movie", id: "anderson-torrents", name: "My Videos" }]
};

const builder = new addonBuilder(manifest);

const videoList = [
  {
    id: "spiderman1",
    name: "Spider-Man: Across the Spider-Verse (2023)",
    magnet: "magnet:?xt=urn:btih:4B114777AB3B56BD0C3B8EE6301DB4AB690DADEF&dn=Spider-Man%20Across%20the%20Spider-Verse%20%282023%29%20720p.mkv&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce",
    poster: "https://via.placeholder.com/300x450?text=SpiderMan"
  }
];

builder.defineCatalogHandler(() =>
  Promise.resolve({
    metas: videoList.map(v => ({
      id: v.id,
      name: v.name,
      type: "movie",
      poster: v.poster
    }))
  })
);

builder.defineMetaHandler(({ id }) => {
  const video = videoList.find(v => v.id === id);
  return Promise.resolve({
    meta: {
      id: video.id,
      name: video.name,
      type: "movie",
      poster: video.poster,
      background: video.poster,
      description: "Streamed via magnet link"
    }
  });
});

builder.defineStreamHandler(({ id }) => {
  const video = videoList.find(v => v.id === id);
  return Promise.resolve({
    streams: [{ title: "Magnet Stream", url: video.magnet }]
  });
});

// ✅ Use Render's port
const port = process.env.PORT || 10000;
require("http").createServer(builder.getInterface()).listen(port, () => {
  console.log(`✅ Add-on running on http://localhost:${port}`);
});
