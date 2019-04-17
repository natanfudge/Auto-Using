json -I -f package.json -e "this.main='./client/out/extension'"
tsc -b
sh scripts/buildServer.sh
dotnet restore client/src/test/playground
