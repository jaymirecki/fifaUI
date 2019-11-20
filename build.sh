rm jsserver/*.js
rm server.js
echo "compiling ts..."
tsc tsserver/*.ts
echo "done compiling ts"
mv tsserver/*.js jsserver
sed 's/.\/database/.\/jsserver\/database/' jsserver/server.js > server.js