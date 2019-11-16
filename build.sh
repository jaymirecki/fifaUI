rm serverjs/*.js
rm server.js
echo "compiling ts..."
tsc serverts/*.ts
echo "done compiling ts"
mv serverts/*.js serverjs
sed 's/.\/database/.\/serverjs\/database/' serverjs/server.js > server.js