# cityscape-lyrics
Hosted on [jaydoncheng.github.io/magicalmirai2024](https://jaydoncheng.github.io/magicalmirai2024)


## Compiling / Running
This project requires [Node.js](https://nodejs.org/). The required packages can be installed using `npm install`.
To run in a local development environment, run:
`npm run clean && npm run build-dev`

To compile the source code into static files, run:
`npm run clean && npm run pre-build && npm run build`
The files and any assets will be placed in the `docs` directory.


## Documentation
Songs can be added manually through a song data file located in `src/core/songs`.
Song "keyframes" are generated automatically through `PlayerManager`'s `_genKeyframes()`. However, manually adding keyframes is possible through the corresponding song data file in `src/core/songs`, and encouraged to set the initial colors for the scene.

## Credits
- [TextAlive App API](https://developer.textalive.jp/)
