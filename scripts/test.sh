json -I -f package.json -e "this.main='./client/out/extension'"
tsc -b
sh scripts/build.sh
dotnet restore client/src/test/playground
