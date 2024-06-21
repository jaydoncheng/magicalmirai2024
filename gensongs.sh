# utility script to generate songs module based on the songs directory
# run through npm run gensongs/build/build-dev

# check if the songs directory exists
if [ ! -d "./src/core/songs" ]; then
    echo "songs directory not found"
    exit 1
fi

# remove the existing songs module
rm -rf ./src/core/songs/index.ts

# generate import statements
files=$(ls ./src/core/songs/*.ts)
for file in $files 
do
    filename=$(basename $file)
    songname="${filename%.*}"
    echo "import $songname from './$songname';" >> ./src/core/songs/index.ts
done

# generate default export statement
echo "\nexport default [" >> ./src/core/songs/index.ts
for file in $files
do
    filename=$(basename $file)
    songname="${filename%.*}"
    echo "    $songname," >> ./src/core/songs/index.ts
done
echo "];" >> ./src/core/songs/index.ts
