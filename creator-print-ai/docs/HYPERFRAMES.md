# HyperFrames

`packages/hyperframes` creates deterministic HTML composition stubs for creator promo videos:

- 9:16 TikTok sticker drop promo.
- 1:1 Instagram product reveal.
- 16:9 launch explainer.

The API route `/api/hyperframes/render` returns script metadata and HTML. If HyperFrames CLI/rendering is available, save the returned HTML and render it with HyperFrames. If not, the mock state still lets the product flow continue.
