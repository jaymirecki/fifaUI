rm serverjs/*.js
echo "compiling ts..."
tsc serverts/*.ts
echo "done compiling ts"
mv serverts/*.js serverjs